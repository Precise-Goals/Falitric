import React, { memo } from "react";
import { Link } from "react-router-dom";

const Hero = memo(() => (
  <section className="relative border-b-2 border-black bg-white bg-grid-pattern">
    <div className="mx-auto grid max-w-[1440px] grid-cols-1 md:grid-cols-12 min-h-[700px]">
      <div className="flex flex-col justify-center border-b-2 border-black p-8 md:col-span-8 md:border-b-0 md:border-r-2 md:p-16 lg:p-24 relative overflow-hidden">
        <div className="mb-8 mt-15 inline-flex w-fit items-center gap-2 border-2 border-black bg-black px-4 py-1 text-xs font-bold uppercase text-white shadow-[4px_4px_0px_0px_#000000]">
          <span className="material-symbols-outlined text-sm animate-pulse">
            radio_button_checked
          </span>
          <span>Protocol v2.0 Live</span>
        </div>
        <h1 className="mb-8 text-7xl font-black uppercase leading-[0.85] tracking-tight md:text-8xl lg:text-9xl z-10">
          Energy
          <br />
          <span className="text-stroke-black" style={{ fontSize: "100px" }}>
            Decentralized
          </span>
        </h1>
        <p className="mb-10 max-w-lg text-xl font-medium leading-relaxed font-body text-neutral-800 z-10">
          The centralized grid is failing. Faltric enables peer-to-peer energy
          trading, turning consumers into producers.
        </p>
        <div className="flex flex-wrap gap-4 z-10">
          <Link
            to="/exchange"
            className="h-14 min-w-[200px] border-2 border-black bg-black px-8 text-base font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_#000000] transition-all hover:bg-neutral-800 hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">
              account_balance_wallet
            </span>
            Exchange
          </Link>
          <button className="flex h-14 min-w-[180px] items-center justify-center gap-2 border-2 border-black bg-white px-8 text-base font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_#000000] transition-all hover:bg-neutral-50 hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
            Read Manifesto
          </button>
        </div>
      </div>

      <div className="relative flex flex-col md:col-span-4 bg-neutral-100">
        <div
          className="relative h-full w-full min-h-[300px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDwj8uT-gVheKRMkE8UlSk8hQ24QbHra4caHkaMOQlbtwW7tsz6R_wPEXpcCsxv5U6MyY5xF3mAzG8_lVlSClKGmvk4PhO_UUo71_Y406ylzA3h2-5JuGmfGamt9duLIe3tpIRNMEc27gYNeqbLFAhMzn_EjMm-9hFCGrD6kcxadcGNIkARyLxuut7hMCERCT5WBl8iVLKO39TMrtWObaU_F_-Get7xqVEf7FilmPPXrZFb9eZBLxrDLQtcDNu2ovQuNEScr8A4tE0')",
            filter: "grayscale(100%) contrast(140%) brightness(90%)",
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-6 right-6 border-2 border-black bg-white p-3 shadow-[4px_4px_0px_0px_#000000]">
            <span className="material-symbols-outlined text-4xl">sunny</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full border-t-2 border-black bg-white p-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">
                  Grid Load
                </p>
                <p className="text-3xl font-black">42.8 GW</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">
                  Status
                </p>
                <div className="flex items-center gap-2 justify-end">
                  <div className="h-3 w-3 bg-green-500 border-2 border-black"></div>
                  <span className="font-bold">Stable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
));

const ProblemSection = memo(() => (
  <section className="border-b-2 border-black bg-black text-white bg-grid-pattern-dark relative overflow-hidden">
    <div className="mx-auto max-w-[1440px] grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
      <div className="lg:col-span-5 border-b-2 border-white lg:border-b-0 lg:border-r-2 lg:border-white p-12 lg:p-20 flex flex-col justify-center relative">
        <h2 className="text-6xl md:text-7xl font-black uppercase mb-8 leading-[0.9]">
          The
          <br />
          <span className="text-stroke-white">Problem</span>
        </h2>
        <p className="text-xl font-body text-gray-400 max-w-md">
          Centralized power grids are aging, inefficient, and prone to
          catastrophic failure. Relying on a single point of failure is no
          longer an option.
        </p>
        <div className="absolute -bottom-12 -left-12 opacity-10">
          <span className="material-symbols-outlined text-[300px]">
            warning
          </span>
        </div>
      </div>
      <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2">
        <div className="border-b-2 border-white md:border-r-2 md:border-white p-10 flex flex-col justify-between hover:bg-neutral-900 transition-colors">
          <span className="material-symbols-outlined text-5xl mb-6">
            power_off
          </span>
          <div>
            <h3 className="text-4xl font-bold mb-2">350%</h3>
            <p className="font-mono text-sm uppercase text-gray-400">
              Increase in blackouts since 2015
            </p>
          </div>
        </div>
        <div className="border-b-2 border-white p-10 flex flex-col justify-between hover:bg-neutral-900 transition-colors">
          <span className="material-symbols-outlined text-5xl mb-6">
            payments
          </span>
          <div>
            <h3 className="text-4xl font-bold mb-2">30%</h3>
            <p className="font-mono text-sm uppercase text-gray-400">
              Energy lost in transmission
            </p>
          </div>
        </div>
        <div className="border-b-2 md:border-b-0 border-white md:border-r-2 md:border-white p-10 flex flex-col justify-between hover:bg-neutral-900 transition-colors">
          <span className="material-symbols-outlined text-5xl mb-6">co2</span>
          <div>
            <h3 className="text-4xl font-bold mb-2">40GT</h3>
            <p className="font-mono text-sm uppercase text-gray-400">
              Annual CO2 Emissions
            </p>
          </div>
        </div>
        <div className="p-10 flex flex-col justify-between hover:bg-neutral-900 transition-colors">
          <span className="material-symbols-outlined text-5xl mb-6">lock</span>
          <div>
            <h3 className="text-4xl font-bold mb-2">0</h3>
            <p className="font-mono text-sm uppercase text-gray-400">
              Control over your pricing
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
));

const SolutionSection = memo(() => (
  <section className="border-b-2 border-black bg-white py-24 lg:py-32">
    <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
      <div className="mb-20">
        <div className="inline-block border-2 border-black bg-white px-3 py-1 text-xs font-bold uppercase mb-6 shadow-[4px_4px_0px_0px_#000000]">
          Solution
        </div>
        <h2 className="text-5xl md:text-7xl font-black uppercase leading-none">
          Why Faltric?
        </h2>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="group relative border-2 border-black bg-white p-8 shadow-[4px_4px_0px_0px_#000000] transition-all hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000]">
          <div className="mb-8 flex justify-between items-start">
            <span className="text-6xl font-black text-neutral-200 group-hover:text-black transition-colors">
              01
            </span>
            <div className="h-12 w-12 border-2 border-black bg-black text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">
                sync_alt
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold uppercase mb-4">P2P Trading</h3>
          <p className="font-sans text-gray-600 leading-relaxed">
            Buy and sell excess energy directly with your neighbors. Remove the
            middleman utility company and set your own rates.
          </p>
        </div>
        <div className="group relative border-2 border-black bg-black text-white p-8 shadow-[4px_4px_0px_0px_#000000] transition-all hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000]">
          <div className="mb-8 flex justify-between items-start">
            <span className="text-6xl font-black text-neutral-700 group-hover:text-white transition-colors">
              02
            </span>
            <div className="h-12 w-12 border-2 border-white bg-white text-black flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">
                visibility
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold uppercase mb-4">
            Total Transparency
          </h3>
          <p className="font-body text-gray-300 leading-relaxed">
            Every electron is tracked on-chain. Audit your usage, verify the
            source of your power, and trust the immutable ledger.
          </p>
        </div>
        <div className="group relative border-2 border-black bg-white p-8 shadow-[4px_4px_0px_0px_#000000] transition-all hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000]">
          <div className="mb-8 flex justify-between items-start">
            <span className="text-6xl font-black text-neutral-200 group-hover:text-black transition-colors">
              03
            </span>
            <div className="h-12 w-12 border-2 border-black bg-black text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">forest</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold uppercase mb-4">Carbon Tracking</h3>
          <p className="font-sans text-gray-600 leading-relaxed">
            Real-time carbon intensity monitoring. Optimize your consumption for
            the greenest hours automatically.
          </p>
        </div>
      </div>
    </div>
  </section>
));

const FeatureShowcase = memo(() => (
  <section className="border-b-2 border-black">
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="border-b-2 lg:border-b-0 lg:border-r-2 border-black bg-neutral-100 p-12 lg:p-24 flex items-center justify-center">
        <div className="w-full max-w-md border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000000]">
          <div className="border-b-2 border-black bg-black p-2 flex justify-between items-center px-4">
            <span className="text-white font-mono text-xs">
              TERMINAL_V1.EXE
            </span>
            <div className="flex gap-2">
              <div className="h-3 w-3 bg-white rounded-none"></div>
              <div className="h-3 w-3 bg-white rounded-none"></div>
            </div>
          </div>
          <div className="p-6 font-mono text-sm space-y-4">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-bold">PAIR</span>
              <span className="font-bold">PRICE (FLT)</span>
            </div>
            <div className="flex justify-between text-green-700">
              <span>SOLAR/GRID</span>
              <span>0.42 ▲</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>WIND/GRID</span>
              <span>0.38 ▼</span>
            </div>
            <div className="flex justify-between">
              <span>STORAGE/GRID</span>
              <span>0.55 -</span>
            </div>
            <div className="pt-4 mt-4 border-t-2 border-black">
              <button className="w-full bg-black text-white py-2 font-bold hover:bg-gray-800">
                EXECUTE TRADE
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-12 lg:p-24 flex flex-col justify-center bg-white">
        <span className="font-mono text-sm font-bold text-gray-500 mb-2">
          01 — INTERFACE
        </span>
        <h3 className="text-4xl md:text-5xl font-black uppercase mb-6">
          Exchange Terminal
        </h3>
        <p className="text-lg font-body text-gray-800 mb-8">
          A professional-grade trading environment for energy assets. Set limit
          orders for your solar production or automate purchases based on spot
          prices.
        </p>
        <ul className="space-y-4 font-bold uppercase text-sm">
          <li className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl">check_box</span>
            Real-time Order Book
          </li>
          <li className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl">check_box</span>
            Automated Market Making
          </li>
          <li className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl">check_box</span>
            Instant Settlement
          </li>
        </ul>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 border-t-2 border-black">
      <div className="order-2 lg:order-1 p-12 lg:p-24 flex flex-col justify-center bg-black text-white">
        <span className="font-mono text-sm font-bold text-gray-400 mb-2">
          02 — INTELLIGENCE
        </span>
        <h3 className="text-4xl md:text-5xl font-black uppercase mb-6">
          Predict AI
        </h3>
        <p className="text-lg font-body text-gray-300 mb-8">
          Machine learning models that forecast local energy production and
          consumption patterns. Optimize your battery storage automatically to
          sell at peak rates.
        </p>
        <Link
          to="/ai-dashboard"
          className="w-fit border-2 border-white px-6 py-3 font-bold uppercase hover:bg-white hover:text-black transition-colors shadow-[4px_4px_0px_0px_#ffffff] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
        >
          View Documentation
        </Link>
      </div>
      <div className="order-1 lg:order-2 border-b-2 lg:border-b-0 lg:border-l-2 border-black bg-neutral-100 p-12 lg:p-24 flex items-center justify-center">
        <div className="w-full max-w-md aspect-square border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000000] p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-xs font-bold uppercase text-gray-500">
                Prediction Confidence
              </p>
              <p className="text-4xl font-black">98.4%</p>
            </div>
            <span className="material-symbols-outlined text-4xl animate-pulse">
              auto_awesome
            </span>
          </div>
          <div className="flex items-end justify-between h-32 gap-2">
            <div className="w-full bg-gray-200 h-[40%]"></div>
            <div className="w-full bg-gray-300 h-[60%]"></div>
            <div className="w-full bg-black h-[80%] relative group">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 hidden group-hover:block">
                PEAK
              </div>
            </div>
            <div className="w-full bg-gray-300 h-[50%]"></div>
            <div className="w-full bg-gray-200 h-[30%]"></div>
          </div>
          <p className="text-xs font-mono mt-4 text-center text-gray-500">
            HOURLY DEMAND FORECAST
          </p>
        </div>
      </div>
    </div>
  </section>
));

const Ticker = memo(() => (
  <div className="w-full border-b-2 border-black bg-white py-4 overflow-hidden whitespace-nowrap">
    <div className="inline-block animate-marquee">
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          className="mx-8 font-mono text-lg font-bold uppercase tracking-wide"
        >
          <span className="text-green-600 mr-2">●</span> ACTIVE NODES: 12,405
          <span className="mx-8 text-gray-300">|</span>
          <span className="text-blue-600 mr-2">●</span> BLOCK HEIGHT: #8,992,102
          <span className="mx-8 text-gray-300">|</span>
          <span className="text-orange-600 mr-2">●</span> KW/H PRICE: $0.12
          <span className="mx-8 text-gray-300">|</span>
          <span className="text-purple-600 mr-2">●</span> TOTAL STAKED: $45M
          <span className="mx-8 text-gray-300">|</span>
        </span>
      ))}
    </div>
  </div>
));

const CTA = memo(() => (
  <section className="bg-white py-32 relative overflow-hidden bg-grid-pattern">
    <div className="absolute top-0 right-0 w-64 h-64 bg-neutral-100 border-l-2 border-b-2 border-black -z-0"></div>
    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black -z-0"></div>
    <div className="container mx-auto max-w-5xl px-6 text-center relative z-10">
      <div className="mb-10 inline-flex flex-col items-center">
        <div className="h-16 w-1 border-l-2 border-black border-dashed mb-4"></div>
        <span className="material-symbols-outlined text-4xl mb-4">power</span>
      </div>
      <h2 className="mb-8 text-6xl font-black uppercase leading-[0.9] md:text-8xl">
        Join The
        <br />
        Network
      </h2>
      <p className="mx-auto mb-12 max-w-2xl text-xl font-medium font-body text-gray-800 leading-relaxed">
        The grid is yours. Connect your wallet, register as a validator node,
        and start earning from the decentralized energy revolution.
      </p>
      <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
        <button className="group relative h-20 min-w-[280px] border-2 border-black bg-[#111811] text-white px-8 text-xl font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_#000000] transition-all hover:bg-white hover:text-black hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none overflow-hidden">
          <span className="relative z-10">Launch App</span>
          <div className="absolute inset-0 h-full w-full bg-white translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
          <span className="absolute inset-0 z-10 flex items-center justify-center text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Launch App
          </span>
        </button>
        <a
          className="group flex h-20 min-w-[280px] items-center justify-center gap-2 border-2 border-black bg-white px-8 text-lg font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          href="#"
        >
          <span className="material-symbols-outlined text-2xl">
            description
          </span>
          Documentation
        </a>
      </div>
      <p className="mt-8 text-sm font-mono text-gray-500">
        NO CREDIT CARD REQUIRED • WEB3 NATIVE
      </p>
    </div>
  </section>
));

const Footer = memo(() => (
  <footer className="border-t-2 border-black bg-black text-white">
    <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white text-black flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">bolt</span>
            </div>
            <span className="text-2xl font-bold uppercase tracking-tight">
              FALTRIC
            </span>
          </div>
          <p className="text-sm font-body text-gray-400 leading-relaxed">
            Building the decentralized infrastructure for the post-carbon
            economy. Open source, permissionless, and immutable.
          </p>
          <div className="flex gap-4">
            {["TW", "DC", "GH"].map((social) => (
              <a
                key={social}
                className="h-10 w-10 border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                href="#"
              >
                <span className="text-xs font-bold">{social}</span>
              </a>
            ))}
          </div>
        </div>
        {[
          {
            title: "Protocol",
            links: ["Status", "Explorer", "Governance", "Tokenomics"],
          },
          {
            title: "Developers",
            links: ["Documentation", "Github", "Audits", "Bug Bounty"],
          },
          { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
        ].map((col) => (
          <div key={col.title} className="flex flex-col gap-4">
            <h4 className="font-bold uppercase tracking-wider text-gray-500 mb-2">
              {col.title}
            </h4>
            {col.links.map((link) => (
              <a
                key={link}
                className="hover:text-gray-300 transition-colors"
                href="#"
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-800 pt-8 gap-4">
        <p className="text-sm text-gray-500 font-mono">
          © 2024 FALTRIC PROTOCOL FOUNDATION.
        </p>
        <div className="flex items-center gap-2 border border-gray-800 px-4 py-2 bg-gray-900">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-wide text-gray-300">
            All Systems Operational
          </span>
        </div>
      </div>
    </div>
  </footer>
));

const VideoSection = memo(() => (
  <div
    className="vd"
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      background: "black",
    }}
  >
    <video
      src="/video.mp4"
      autoPlay
      loop
      controls
      style={{
        filter: "brightness(0.98) contrast(1.125)",
        margin: "5% 15%",
        width:"60%",
        borderRadius: "5rem",
        background: "black",
      }}
    />
  </div>
));

export default function Dashboard() {
  return (
    <div className="bg-white text-[#111811] font-display antialiased overflow-x-hidden selection:bg-black selection:text-white">
      <main className="flex-grow">
        <Hero />
        <ProblemSection />
        <VideoSection />
        <SolutionSection />
        <FeatureShowcase />
        <Ticker />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
