"use client";
import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";
import {
  dealsPerYear, industryData, cityData,
  stageData, funnelData, topStartups, monthlyData
} from "./data";

const COLORS = ["#2563eb", "#059669", "#dc2626", "#7c3aed", "#d97706", "#db2777"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-3 text-sm shadow-xl">
        <p className="font-bold text-gray-900 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

function useCountUp(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function AnimatedStat({ value, label, prefix = "", suffix = "", color = "#2563eb" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const numericValue = typeof value === "number" ? value : parseInt(value.replace(/[^0-9]/g, "")) || 0;
  const count = useCountUp(numericValue, 1500, visible);
  return (
    <div ref={ref} className="text-center p-6">
      <div className="text-5xl font-black mb-2" style={{ color }}>
        {prefix}{visible ? count.toLocaleString() : 0}{suffix}
      </div>
      <div className="text-sm text-slate-500 font-medium leading-snug">{label}</div>
    </div>
  );
}

const Highlight = ({ children, color = "#2563eb" }) => (
  <span className="font-black px-1 rounded" style={{ color, background: `${color}12` }}>{children}</span>
);

const PullQuote = ({ children }) => (
  <div className="my-12 relative">
    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-200 rounded-full" />
    <p className="text-2xl font-black text-slate-800 leading-tight pl-6 italic">{children}</p>
  </div>
);

const DataCard = ({ title, value, sub, color }) => (
  <div className="rounded-2xl p-5 border-2" style={{ borderColor: `${color}30`, background: `${color}08` }}>
    <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color }}>{title}</div>
    <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
    <div className="text-sm text-slate-500">{sub}</div>
  </div>
);

const SectionLabel = ({ n, text }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">{n}</div>
    <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">{text}</span>
  </div>
);

const ChartLabel = ({ children }) => (
  <p className="text-xs text-slate-400 text-center mt-3 italic">{children}</p>
);

export default function Home() {
  const [activeChart, setActiveChart] = useState("deals");
  const [activeIndustry, setActiveIndustry] = useState("deals");

  return (
    <main className="bg-white min-h-screen" style={{ fontFamily: "'Georgia', serif" }}>

      {/* NAV */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 z-50" style={{ fontFamily: "system-ui, sans-serif" }}>
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between h-14">
          <span className="font-bold text-slate-800 text-sm">🇮🇳 India Startup Funding</span>
          <div className="flex gap-6 text-xs text-slate-400 font-semibold tracking-wider uppercase">
            {["Trends", "Industries", "Cities", "Funnel", "Findings"].map(s => (
              <a key={s} href={`#${s.toLowerCase()}`} className="hover:text-blue-500 transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)" }} />
        <div className="max-w-3xl mx-auto px-6 py-20 relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8" style={{ fontFamily: "system-ui, sans-serif" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase">Data Analysis · 2015 – 2020</span>
          </div>
          <h1 className="text-6xl font-black leading-none mb-6 tracking-tight">
            What does it take to get<br />
            <span className="text-transparent" style={{ WebkitTextStroke: "2px #60a5fa" }}>funded in India?</span>
          </h1>
          <p className="text-slate-300 text-xl leading-relaxed mb-12 max-w-2xl" style={{ fontFamily: "system-ui, sans-serif" }}>
            An analysis of 3,000+ deals reveals a brutal truth — the most popular sectors weren't getting the biggest cheques, 98% of funded startups never raise a Series A, and the capital map of India fits on a single page.
          </p>
          <div className="grid grid-cols-4 gap-0 border border-white/10 rounded-2xl overflow-hidden">
            {[
              { v: 3043, label: "Deals analyzed", color: "#60a5fa" },
              { v: 34, label: "Billion USD tracked", prefix: "$", suffix: "B+", color: "#34d399" },
              { v: 98, label: "Never reach Series A", suffix: "%", color: "#f87171" },
              { v: 840, label: "Deals in Bangalore", color: "#a78bfa" },
            ].map((s, i) => (
              <div key={i} className="border-r border-white/10 last:border-0">
                <AnimatedStat value={s.v} label={s.label} prefix={s.prefix || ""} suffix={s.suffix || ""} color={s.color} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BYLINE */}
      <div className="max-w-3xl mx-auto px-6 py-6 border-b border-slate-100 flex items-center gap-4" style={{ fontFamily: "system-ui, sans-serif" }}>
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-black flex items-center justify-center">N</div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Nikhil Aswal</p>
          <p className="text-xs text-slate-400">Data: Kaggle · Indian Startup Funding Dataset · May 2026</p>
        </div>
      </div>

      {/* INTRO */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-xl leading-relaxed text-slate-700 mb-6">
          Between 2015 and 2020, Indian startups raised over <Highlight color="#2563eb">$34 billion</Highlight> across more than 3,000 funding deals. This was the era that produced Flipkart, Paytm, and Ola — and it was also an era that quietly ended. Deal volumes have collapsed since their 2016 peak, and the easy money is gone.
        </p>
        <p className="text-xl leading-relaxed text-slate-700">
          This analysis cuts through the noise to answer one question: <em>where did the money actually go?</em> The answers are more surprising than you'd expect.
        </p>
      </div>

      {/* TRENDS */}
      <section id="trends" className="max-w-3xl mx-auto px-6 py-12 border-t-2 border-slate-900">
        <SectionLabel n="01" text="Year over year" />
        <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">
          The boom, the peak,<br />and the slow decline
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-10">
          <DataCard title="Peak Deals Year" value="2016" sub="993 deals closed" color="#2563eb" />
          <DataCard title="Peak Money Year" value="2017" sub="$10.4B total raised" color="#059669" />
          <DataCard title="Avg Deal 2016 vs 2017" value="3.5x" sub="$6.5M → $22.8M" color="#d97706" />
        </div>
        <p className="text-lg leading-relaxed text-slate-700 mb-6">
          The Indian startup ecosystem saw its highest deal count in <Highlight color="#2563eb">2016 with 993 rounds</Highlight>. But this was also the year with the lowest average deal size — just $6.5M. Investors were spreading bets broadly.
        </p>
        <p className="text-lg leading-relaxed text-slate-700 mb-6">
          By 2017, the mood shifted. Fewer deals — <Highlight color="#059669">687 vs 993</Highlight> — but total funding jumped to <Highlight color="#059669">$10.4 billion</Highlight>. Average deal size: $22.8M. The market stopped betting on everyone and started doubling down on proven winners.
        </p>
        <p className="text-lg leading-relaxed text-slate-700 mb-8">
          By 2019, deals collapsed to just <Highlight color="#dc2626">110 for the year</Highlight>. The era of easy seed money was definitively over.
        </p>
        <PullQuote>"2016 had the most deals. 2017 had the most money. They are not the same thing."</PullQuote>
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200" style={{ fontFamily: "system-ui, sans-serif" }}>
          <div className="flex gap-3 mb-6">
            {[{ key: "deals", label: "Number of Deals" }, { key: "funding", label: "Funding (B USD)" }].map(({ key, label }) => (
              <button key={key} onClick={() => setActiveChart(key)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeChart === key ? "bg-blue-600 text-white shadow-lg" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
                {label}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dealsPerYear}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 13, fontFamily: "system-ui" }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 13, fontFamily: "system-ui" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={activeChart} radius={[6, 6, 0, 0]} name={activeChart === "deals" ? "Deals" : "Funding (B)"}>
                {dealsPerYear.map((_, i) => <Cell key={i} fill={i === 2 ? "#1d4ed8" : "#93c5fd"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <ChartLabel>Toggle between deal count and total funding — notice how 2017 ranks differently on each</ChartLabel>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section id="industries" className="max-w-3xl mx-auto px-6 py-12 border-t-2 border-slate-900">
        <SectionLabel n="02" text="Where the money went" />
        <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">
          The most popular sector<br />wasn't getting the biggest cheques
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-10">
          <DataCard title="Consumer Internet" value="941 deals" sub="$6.25B raised · $10.6M avg" color="#2563eb" />
          <DataCard title="E-Commerce" value="296 deals" sub="$8.24B raised · $40.8M avg" color="#dc2626" />
        </div>
        <p className="text-lg leading-relaxed text-slate-700 mb-6">
          Consumer Internet dominated deal count with <Highlight color="#2563eb">941 deals</Highlight> — nearly double Technology's 478. If you were counting pitch decks, Consumer Internet was everywhere.
        </p>
        <p className="text-lg leading-relaxed text-slate-700 mb-6">
          But look at total funding and E-Commerce tells a different story. <Highlight color="#dc2626">296 deals, $8.24 billion</Highlight>. Less than a third of Consumer Internet's deal count — but $2 billion more in total funding. Average deal size: $40.8M vs $10.6M.
        </p>
        <p className="text-lg leading-relaxed text-slate-700 mb-8">
          Finance is even more extreme — <Highlight color="#7c3aed">78 deals, $3.34 billion</Highlight>. That's $45.7M per deal on average. Investors were writing enormous cheques for a tiny number of fintech companies.
        </p>
        <PullQuote>"E-Commerce raised $2 billion more than Consumer Internet — with three times fewer deals."</PullQuote>
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200" style={{ fontFamily: "system-ui, sans-serif" }}>
          <div className="flex gap-3 mb-6">
            {[{ key: "deals", label: "Number of Deals" }, { key: "funding", label: "Funding (B USD)" }].map(({ key, label }) => (
              <button key={key} onClick={() => setActiveIndustry(key)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeIndustry === key ? "bg-red-500 text-white shadow-lg" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
                {label}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={industryData} layout="vertical" margin={{ left: 20, right: 40 }}>
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12, fontFamily: "system-ui" }} />
              <YAxis type="category" dataKey="industry" tick={{ fill: "#334155", fontSize: 12, fontFamily: "system-ui" }} width={130} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={activeIndustry} radius={[0, 6, 6, 0]} name={activeIndustry === "deals" ? "Deals" : "Funding (B)"}>
                {industryData.map((_, i) => <Cell key={i} fill={i === 2 ? "#991b1b" : "#fca5a5"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <ChartLabel>Toggle between views — notice how E-Commerce jumps from 3rd to 1st when ranked by money</ChartLabel>
        </div>
      </section>

      {/* CITIES */}
      <section id="cities" className="max-w-3xl mx-auto px-6 py-12 border-t-2 border-slate-900">
        <SectionLabel n="03" text="Geography" />
        <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">
          India's startup map<br />fits in three cities
        </h2>
        <p className="text-lg leading-relaxed text-slate-700 mb-6">
          Of 3,043 deals, <Highlight color="#2563eb">840 were in Bangalore</Highlight> — over 27% of all Indian startup funding. Mumbai came second at 567, Delhi third at 455.
        </p>
        <p className="text-lg leading-relaxed text-slate-700 mb-8">
          The top three cities accounted for over <Highlight color="#059669">60% of all deals</Highlight>. Hyderabad, often called India's emerging tech hub, had just <Highlight color="#dc2626">99 deals</Highlight> in this entire period.
        </p>
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-6" style={{ fontFamily: "system-ui, sans-serif" }}>
          {cityData.map((c, i) => (
            <div key={i} className="mb-5 last:mb-0">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-800">{c.city}</span>
                <span className="text-sm font-black" style={{ color: COLORS[i] }}>{c.deals} deals</span>
              </div>
              <div className="bg-slate-200 rounded-full h-4 overflow-hidden">
                <div className="h-full rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(c.deals / 840) * 100}%`, background: COLORS[i], minWidth: "2rem" }}>
                  <span className="text-white text-xs font-black">{Math.round((c.deals / 840) * 100)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <PullQuote>"Bangalore alone had more deals than Mumbai and Delhi combined."</PullQuote>
      </section>

      {/* FUNNEL */}
      <section id="funnel" className="max-w-3xl mx-auto px-6 py-12 border-t-2 border-slate-900">
        <SectionLabel n="04" text="The funding journey" />
        <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">
          1,500 startups raised seed.<br />
          <span className="text-red-600">Only 24 made it to Series A.</span>
        </h2>
        <p className="text-lg leading-relaxed text-slate-700 mb-6">
          Of <Highlight color="#2563eb">1,500 seed-funded startups</Highlight>, only <Highlight color="#dc2626">24 went on to raise a Series A</Highlight>. A drop-off of 98.4%. 19 raised Series B, 14 Series C, 12 Series D.
        </p>
        <p className="text-lg leading-relaxed text-slate-700 mb-8">
          Those few late-stage survivors raised <Highlight color="#7c3aed">$28.3 billion</Highlight>, versus just $889 million for 1,500 early-stage startups. Almost the same number of deals, but <Highlight color="#7c3aed">32x more money</Highlight> going to the top.
        </p>
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8" style={{ fontFamily: "system-ui, sans-serif" }}>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Startup survival at each funding stage</p>
          {funnelData.map((f, i) => (
            <div key={i} className="mb-5 last:mb-0">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-800">{f.stage}</span>
                <span className="text-sm font-black text-blue-700">{f.count.toLocaleString()} startups</span>
              </div>
              <div className="bg-slate-200 rounded-full h-5 overflow-hidden">
                <div className="h-full rounded-full flex items-center pl-3 text-white text-xs font-black"
                  style={{ width: `${Math.max((f.count / 1500) * 100, 5)}%`, background: `hsl(${210 + i * 25}, 65%, ${40 + i * 8}%)` }}>
                  {i === 0 ? "100%" : `${((f.count / 1500) * 100).toFixed(1)}%`}
                </div>
              </div>
            </div>
          ))}
        </div>
        <PullQuote>"The funding landscape isn't a ladder. It's a funnel with almost no exit at the top."</PullQuote>
        <div className="grid grid-cols-2 gap-4">
          <DataCard title="Early Stage (Seed)" value="$889M" sub="across 1,502 deals" color="#2563eb" />
          <DataCard title="Late Stage (PE/Series)" value="$28.3B" sub="across 1,386 deals" color="#7c3aed" />
        </div>
      </section>

      {/* TOP STARTUPS */}
      <section className="max-w-3xl mx-auto px-6 py-12 border-t-2 border-slate-900">
        <SectionLabel n="05" text="The winners" />
        <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">
          Two companies raised<br />more than everyone else combined
        </h2>
        <p className="text-lg leading-relaxed text-slate-700 mb-6">
          <Highlight color="#2563eb">Flipkart raised $4.06 billion</Highlight> before its Walmart acquisition — the biggest exit in Indian startup history. <Highlight color="#059669">Paytm followed with $3.15 billion</Highlight>, riding the demonetisation tailwind. Together, over $7 billion — roughly 20% of all funding in the dataset.
        </p>
        <p className="text-lg leading-relaxed text-slate-700 mb-8">
          After these two, there's a sharp cliff. Ola at $984M, Udaan at $870M. Capital concentration at the very top is extreme.
        </p>
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200" style={{ fontFamily: "system-ui, sans-serif" }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topStartups} layout="vertical" margin={{ left: 20, right: 60 }}>
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12, fontFamily: "system-ui" }} unit="B" />
              <YAxis type="category" dataKey="name" tick={{ fill: "#334155", fontSize: 13, fontFamily: "system-ui", fontWeight: 600 }} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="funding" radius={[0, 8, 8, 0]} name="Funding (B)">
                {topStartups.map((_, i) => <Cell key={i} fill={i < 2 ? "#1d4ed8" : "#93c5fd"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <ChartLabel>Flipkart and Paytm (dark blue) raised more than the other 8 startups combined</ChartLabel>
        </div>
      </section>

      {/* FINDINGS */}
      <section id="findings" className="bg-slate-900 text-white py-20 px-6 mt-12">
        <div className="max-w-3xl mx-auto">
          <SectionLabel n="06" text="Summary" />
          <h2 className="text-4xl font-black mb-12 leading-tight">
            6 things the data tells us<br />about Indian startup funding
          </h2>
          <div style={{ fontFamily: "system-ui, sans-serif" }}>
            {[
              { n: "01", color: "#60a5fa", title: "Peak deals ≠ peak money", text: "2016 had 993 deals — the most in any year. But 2017 had $10.4B — the most money. As deal volume fell, cheque sizes grew from $6.5M to $22.8M. The market stopped spreading bets and started concentrating them." },
              { n: "02", color: "#f87171", title: "Volume and value are not the same thing", text: "E-Commerce raised $8.24B with only 296 deals vs Consumer Internet's $6.25B with 941 deals. Counting deals tells you where excitement was. Counting dollars tells you where conviction was." },
              { n: "03", color: "#34d399", title: "Almost no one survives seed", text: "98.4% of seed-funded startups never raised a Series A. Of 1,500 seed deals, only 24 progressed. Seed funding is not validation — it's the beginning of a brutal elimination round." },
              { n: "04", color: "#a78bfa", title: "Late stage takes almost everything", text: "Late stage attracted $28.3B. Early stage attracted $889M. Across similar deal counts. A tiny group of survivors raised almost all the money in the ecosystem." },
              { n: "05", color: "#fbbf24", title: "India's startup map is three cities", text: "Bangalore, Mumbai, and Delhi accounted for over 60% of all deals. Hyderabad had 99. Geographic concentration is as extreme as capital concentration." },
              { n: "06", color: "#f9a8d4", title: "Big money has no seasonality", text: "Deals happened at 220–300 per month all year. But August ($5.8B) and November ($4.35B) saw massive spikes — a handful of mega-rounds can distort an entire month's numbers." },
            ].map((f, i) => (
              <div key={i} className="flex gap-6 py-8 border-b border-white/10 last:border-0">
                <div className="text-5xl font-black leading-none shrink-0 w-12 opacity-20">{f.n}</div>
                <div>
                  <div className="w-8 h-1 rounded-full mb-3" style={{ background: f.color }} />
                  <h4 className="font-black text-white text-lg mb-2">{f.title}</h4>
                  <p className="text-slate-400 leading-relaxed text-sm">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="max-w-3xl mx-auto px-6 py-10 border-t border-slate-100" style={{ fontFamily: "system-ui, sans-serif" }}>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Methodology</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Dataset sourced from Kaggle (Indian Startup Funding, 2015–2020). 3,043 entries after cleaning. One outlier removed (Rapido $3.9B — likely data entry error). City variants standardised. Industry categories unified. Undisclosed amounts excluded from monetary totals but included in deal counts.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 py-10 text-center text-sm text-slate-400" style={{ fontFamily: "system-ui, sans-serif" }}>
        <p className="mb-1">Built with Python · Pandas · Next.js · Recharts</p>
        <p>Data: Kaggle · <a href="https://github.com" className="text-blue-500 hover:underline">View on GitHub →</a></p>
      </footer>

    </main>
  );
}