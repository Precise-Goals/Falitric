"""
Recommendation engine for Faltric AI service.

Score formula: S = Σ(W_i * V_i) / Σ(W_i) * 100
where W_i are weather weights and V_i are normalized historical efficiency values.
"""

import io
from typing import Any, Dict, List, Optional

import numpy as np

try:
    from sklearn.linear_model import LinearRegression
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib import colors
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False

# Weather weights for each source type
WEATHER_WEIGHTS: Dict[str, Dict[str, float]] = {
    "solar": {"solar_irradiance": 0.7, "wind_speed": 0.05, "precipitation": -0.25},
    "wind":  {"solar_irradiance": 0.05, "wind_speed": 0.8, "precipitation": -0.15},
    "biogas": {"solar_irradiance": 0.1, "wind_speed": 0.1, "precipitation": -0.1},
}

# Normalized ranges for weather features
WEATHER_RANGES = {
    "solar_irradiance": (0, 1000),  # W/m²
    "wind_speed": (0, 20),          # m/s
    "precipitation": (0, 50),       # mm
}

ETH_PER_KWH = 0.0001  # Mock price: 1 kWh = 0.0001 ETH


def normalize(value: float, min_val: float, max_val: float) -> float:
    """Normalize value to [0, 1] range."""
    if max_val == min_val:
        return 0.0
    return max(0.0, min(1.0, (value - min_val) / (max_val - min_val)))


class RecommendationEngine:
    """
    Recommends the best energy source based on weather conditions
    and historical generation/consumption efficiency.
    """

    def _compute_efficiency(self, historical_data: List[Dict]) -> float:
        """Mean efficiency: generation / (generation + consumption)."""
        if not historical_data:
            return 0.5  # Default 50%
        efficiencies = []
        for entry in historical_data:
            g = float(entry.get("generation", 0))
            c = float(entry.get("consumption", 0))
            total = g + c
            if total > 0:
                efficiencies.append(g / total)
        return float(np.mean(efficiencies)) if efficiencies else 0.5

    def _regress_trend(self, historical_data: List[Dict]) -> float:
        """
        Use linear regression on generation values to predict trend.
        Returns slope normalized to [-1, 1].
        """
        if not SKLEARN_AVAILABLE or len(historical_data) < 3:
            return 0.0
        gens = [float(e.get("generation", 0)) for e in historical_data]
        X = np.arange(len(gens)).reshape(-1, 1)
        y = np.array(gens)
        model = LinearRegression().fit(X, y)
        slope = model.coef_[0]
        max_gen = max(gens) if max(gens) > 0 else 1
        return float(np.clip(slope / max_gen, -1, 1))

    def _score_source(
        self,
        source: str,
        weather: Dict[str, float],
        efficiency: float,
        trend: float,
    ) -> float:
        """
        Compute score S = Σ(W_i * V_i) where:
        - W_i = weather weight for this source
        - V_i = normalized weather feature value
        Plus bonuses for efficiency and trend.
        """
        weights = WEATHER_WEIGHTS.get(source, WEATHER_WEIGHTS["solar"])
        score = 0.0
        total_weight = sum(abs(w) for w in weights.values())

        for feature, weight in weights.items():
            val = weather.get(feature, 0.0)
            min_v, max_v = WEATHER_RANGES[feature]
            norm_val = normalize(val, min_v, max_v)
            # Negative weights penalize the score
            score += weight * norm_val

        # Normalize to [0, 100]
        score = (score / (total_weight or 1)) * 100

        # Efficiency bonus (up to 15 points)
        score += efficiency * 15

        # Trend bonus (up to 5 points)
        score += trend * 5

        return round(max(0.0, min(100.0, score)), 2)

    def recommend(
        self,
        installation_id: str,
        installation_type: Optional[str],
        historical_data: List[Dict],
        weather: Dict[str, float],
    ) -> Dict[str, Any]:
        """
        Main recommendation method. Returns recommended source, score, and estimated earnings.
        """
        efficiency = self._compute_efficiency(historical_data)
        trend = self._regress_trend(historical_data)

        sources = ["solar", "wind", "biogas"]
        scores = {
            src: self._score_source(src, weather, efficiency, trend)
            for src in sources
        }

        # If installation type is known, boost that source
        if installation_type in sources:
            scores[installation_type] = min(100.0, scores[installation_type] * 1.1)

        best_source = max(scores, key=scores.__getitem__)
        best_score = scores[best_source]

        # Estimated surplus kWh based on efficiency and trend
        if historical_data:
            avg_gen = np.mean([float(e.get("generation", 0)) for e in historical_data])
            avg_con = np.mean([float(e.get("consumption", 0)) for e in historical_data])
            surplus_kwh = max(0.0, float(avg_gen - avg_con))
        else:
            surplus_kwh = 0.0

        estimated_earnings = round(surplus_kwh * ETH_PER_KWH, 6)

        return {
            "recommended_source": best_source,
            "score": best_score,
            "estimated_earnings": estimated_earnings,
            "all_scores": scores,
            "efficiency": round(efficiency * 100, 2),
        }

    def generate_report(
        self,
        path: str,
        installation_id: str,
        result: Dict[str, Any],
        weather: Dict[str, float],
    ) -> None:
        """Generate a PDF report for the prediction result."""
        if not REPORTLAB_AVAILABLE:
            # Write a placeholder text file if reportlab not available
            with open(path.replace(".pdf", ".txt"), "w") as f:
                f.write(f"Report for installation {installation_id}\n{result}")
            return

        doc = SimpleDocTemplate(path, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []

        story.append(Paragraph("⚡ Faltric Energy Recommendation Report", styles["Title"]))
        story.append(Spacer(1, 12))
        story.append(Paragraph(f"Installation ID: {installation_id}", styles["Normal"]))
        story.append(Spacer(1, 12))

        story.append(Paragraph("Recommendation Summary", styles["Heading2"]))
        summary_data = [
            ["Field", "Value"],
            ["Recommended Source", result.get("recommended_source", "—").capitalize()],
            ["Score", f"{result.get('score', 0):.2f} / 100"],
            ["Estimated Earnings", f"{result.get('estimated_earnings', 0):.6f} ETH"],
            ["Historical Efficiency", f"{result.get('efficiency', 0):.1f}%"],
        ]
        t = Table(summary_data, colWidths=[200, 300])
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#16a34a")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f0fdf4"), colors.white]),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#d1fae5")),
            ("PADDING", (0, 0), (-1, -1), 8),
        ]))
        story.append(t)
        story.append(Spacer(1, 16))

        story.append(Paragraph("Weather Conditions", styles["Heading2"]))
        weather_data = [
            ["Metric", "Value"],
            ["Solar Irradiance", f"{weather.get('solar_irradiance', 0):.1f} W/m²"],
            ["Wind Speed", f"{weather.get('wind_speed', 0):.1f} m/s"],
            ["Precipitation", f"{weather.get('precipitation', 0):.1f} mm"],
        ]
        wt = Table(weather_data, colWidths=[200, 300])
        wt.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e40af")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#eff6ff"), colors.white]),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#bfdbfe")),
            ("PADDING", (0, 0), (-1, -1), 8),
        ]))
        story.append(wt)
        story.append(Spacer(1, 16))

        # All scores
        all_scores = result.get("all_scores", {})
        if all_scores:
            story.append(Paragraph("All Source Scores", styles["Heading2"]))
            score_data = [["Source", "Score"]] + [
                [src.capitalize(), f"{score:.2f}"] for src, score in all_scores.items()
            ]
            st = Table(score_data, colWidths=[200, 300])
            st.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#374151")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f9fafb"), colors.white]),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
                ("PADDING", (0, 0), (-1, -1), 8),
            ]))
            story.append(st)

        story.append(Spacer(1, 20))
        story.append(Paragraph("Generated by Faltric AI Service", styles["Normal"]))

        doc.build(story)
