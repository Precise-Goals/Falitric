import os
import uuid
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models.recommendation import RecommendationEngine

load_dotenv()

app = FastAPI(
    title="Faltric AI Service",
    description="Energy source recommendation and prediction API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

REPORTS_DIR = Path(os.getenv("REPORTS_DIR", "/tmp/faltric_reports"))
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

engine = RecommendationEngine()


class HistoricalEntry(BaseModel):
    generation: float
    consumption: float
    date: Optional[str] = None


class WeatherData(BaseModel):
    solar_irradiance: float = 500.0   # W/m²
    wind_speed: float = 5.0           # m/s
    precipitation: float = 0.0        # mm


class PredictRequest(BaseModel):
    installation_id: str
    installation_type: Optional[str] = None
    historical_data: List[HistoricalEntry] = []
    weather: WeatherData = WeatherData()


class PredictResponse(BaseModel):
    recommended_source: str
    score: float
    estimated_earnings: float
    report_url: Optional[str] = None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    try:
        historical = [
            {"generation": e.generation, "consumption": e.consumption}
            for e in req.historical_data
        ]
        weather = {
            "solar_irradiance": req.weather.solar_irradiance,
            "wind_speed": req.weather.wind_speed,
            "precipitation": req.weather.precipitation,
        }

        result = engine.recommend(
            installation_id=req.installation_id,
            installation_type=req.installation_type,
            historical_data=historical,
            weather=weather,
        )

        # Generate PDF report
        report_id = str(uuid.uuid4())
        report_path = REPORTS_DIR / f"report_{report_id}.pdf"
        engine.generate_report(
            path=str(report_path),
            installation_id=req.installation_id,
            result=result,
            weather=weather,
        )

        result["report_url"] = f"/reports/{report_id}"
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/reports/{report_id}")
def get_report(report_id: str):
    # Sanitize: only allow UUID-like names
    if not all(c in "0123456789abcdef-" for c in report_id.lower()):
        raise HTTPException(status_code=400, detail="Invalid report ID")
    path = REPORTS_DIR / f"report_{report_id}.pdf"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Report not found")
    return FileResponse(path, media_type="application/pdf", filename=f"faltric_report_{report_id}.pdf")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
