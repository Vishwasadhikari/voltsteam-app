import { useState, useEffect } from "react";
import { api } from "./api";

// ── Dark theme palette ───────────────────────────────────────────────────────
const D = {
  bg0:      "#0a0e1a",   // deepest background
  bg1:      "#0f1628",   // page background
  bg2:      "#141d35",   // card background
  bg3:      "#1a2540",   // card hover / elevated
  border:   "#1e2d4a",   // subtle border
  border2:  "#253558",   // hover border
  text0:    "#e8edf8",   // primary text
  text1:    "#8b9bbf",   // secondary text
  text2:    "#4d607f",   // muted text
  solar:    "#f59e0b",   // amber — solar
  grid:     "#38bdf8",   // sky blue — grid
  net:      "#34d399",   // emerald — net
  danger:   "#f87171",   // red — danger
  accent:   "#6366f1",   // indigo — accent
};

const API = "https://k4jz8nywj8.execute-api.eu-north-1.amazonaws.com/" 

const COLORS = { solar: D.solar, grid: D.grid, net: D.net, danger: D.danger };

// ── SVG Icon library (no emojis) ─────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor", style = {} }) => {
  const s = { width: size, height: size, display: "inline-block", verticalAlign: "middle", ...style };
  const paths = {
    zap:       <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    barChart:  <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    cpu:       <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></>,
    receipt:   <><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></>,
    activity:  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    sun:       <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    grid:      <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    plug:      <><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8H6a2 2 0 0 0-2 2v3a6 6 0 0 0 6 6h4a6 6 0 0 0 6-6v-3a2 2 0 0 0-2-2z"/></>,
    dollar:    <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    wifi:      <><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></>,
    search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    alert:     <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    power:     <><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></>,
    trendUp:   <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    clock:     <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" style={s}>
      {paths[name]}
    </svg>
  );
};

// ── Mock data ────────────────────────────────────────────────────────────────
const mkLiveData = () => ({
  grid_draw_kw:  +(2.4 + Math.random() * 0.6).toFixed(2),
  solar_gen_kw:  +(1.8 + Math.random() * 0.9).toFixed(2),
  net_usage_kw:  +(0.3 + Math.random() * 0.5).toFixed(2),
  timestamp:     new Date().toISOString(),
});

const mkHistory = (period) => {
  const labels =
    period === "daily"   ? Array.from({ length: 24 }, (_, i) => `${i}:00`) :
    period === "weekly"  ? ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] :
                           Array.from({ length: 30 }, (_, i) => `D${i+1}`);
  return labels.map((label) => ({
    label,
    grid:  +(2 + Math.random() * 2).toFixed(1),
    solar: +(1.2 + Math.random() * 1.8).toFixed(1),
  }));
};

const DEVICES = [
  { id:1, name:"Air Conditioner",  room:"Living Room", watts:1500, on:true  },
  { id:2, name:"Water Heater",     room:"Bathroom",    watts:2000, on:false },
  { id:3, name:"EV Charger",       room:"Garage",      watts:7200, on:true  },
  { id:4, name:"Refrigerator",     room:"Kitchen",     watts:150,  on:true  },
  { id:5, name:"Washing Machine",  room:"Utility",     watts:900,  on:false },
  { id:6, name:"Dishwasher",       room:"Kitchen",     watts:1200, on:false },
];

const BILLING = {
  current_balance: 2840, projected_bill: 3120,
  budget_limit: 3000,    days_remaining: 17, rate_per_kwh: 8.5,
};

const withFallback = async (fetcher, fallback) => {
  try {
    return await fetcher();
  } catch {
    return typeof fallback === "function" ? fallback() : fallback;
  }
};

// ── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ data, color }) {
  const w = 104, h = 40;
  if (data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  );
}

// ── Arc Gauge ────────────────────────────────────────────────────────────────
function Gauge({ value, max, label, color }) {
  const pct = Math.min(value / max, 1);
  const r = 44, cx = 56, cy = 56, startAngle = -210, sweep = 240;
  const toRad = (d) => (d * Math.PI) / 180;
  const arc = (a) => ({ x: cx + r * Math.cos(toRad(startAngle + a)), y: cy + r * Math.sin(toRad(startAngle + a)) });
  const s = arc(0), eF = arc(sweep), e = arc(sweep * pct);
  const large = sweep * pct > 180 ? 1 : 0;
  return (
    <div style={{ textAlign:"center" }}>
      <svg width={154} height={116} viewBox="0 0 112 84">
        <path d={`M${s.x} ${s.y} A${r} ${r} 0 1 1 ${eF.x} ${eF.y}`}
          fill="none" stroke={D.border2} strokeWidth="7" strokeLinecap="round" />
        {pct > 0 && <path d={`M${s.x} ${s.y} A${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`}
          fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="15" fontWeight="700" fill={color}>{value}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill={D.text2}>kW</text>
      </svg>
      <div style={{ fontSize:13, color:D.text1, marginTop:-10 }}>{label}</div>
    </div>
  );
}

// ── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ data }) {
  const w = 900, h = 260, pad = { l:44, r:10, t:12, b:38 };
  const iw = w-pad.l-pad.r, ih = h-pad.t-pad.b;
  const maxV = Math.max(...data.flatMap(d => [d.grid, d.solar]));
  const bw = (iw / data.length) * 0.35;
  const x = (i) => pad.l + (i/data.length)*iw + (iw/data.length - bw*2)/2;
  const y = (v) => pad.t + ih - (v/maxV)*ih;
  const shown = data.length > 12 ? data.filter((_,i) => i % Math.ceil(data.length/12) === 0) : data;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ overflow:"visible" }}>
      {[0,0.25,0.5,0.75,1].map(t => (
        <line key={t} x1={pad.l} x2={w-pad.r}
          y1={pad.t+ih*(1-t)} y2={pad.t+ih*(1-t)} stroke={D.border} strokeWidth="1" />
      ))}
      {data.map((d,i) => (
        <g key={i}>
          <rect x={x(i)}    y={y(d.grid)}  width={bw} height={ih-(y(d.grid)-pad.t)}  fill={D.grid}  rx="2" opacity="0.9" />
          <rect x={x(i)+bw} y={y(d.solar)} width={bw} height={ih-(y(d.solar)-pad.t)} fill={D.solar} rx="2" opacity="0.9" />
        </g>
      ))}
      {shown.map((d,i) => {
        const idx = data.indexOf(d);
        return <text key={i} x={x(idx)+bw} y={h-8} textAnchor="middle" fontSize="8" fill={D.text2}>{d.label}</text>;
      })}
      {[0, maxV/2, maxV].map((v,i) => (
        <text key={i} x={pad.l-4} y={y(v)+3} textAnchor="end" fontSize="8" fill={D.text2}>{v.toFixed(1)}</text>
      ))}
    </svg>
  );
}

// ── Shared components ────────────────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <div style={{ background:D.bg2, border:`1px solid ${D.border}`, borderRadius:14,
      padding:"26px 28px", marginBottom:18, ...style }}>
      {children}
    </div>
  );
}

function StatCard({ label, value, unit, color, note, spark }) {
  return (
    <div style={{ background:D.bg2, border:`1px solid ${D.border}`, borderRadius:14,
      padding:"24px 26px", minHeight:138 }}>
      <div style={{ fontSize:12, color:D.text2, textTransform:"uppercase",
        letterSpacing:"0.08em", marginBottom:14 }}>{label}</div>
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
        <div>
          <span style={{ fontSize:34, fontWeight:700, color, letterSpacing:"0" }}>{value}</span>
          {unit && <span style={{ fontSize:15, color:D.text2, marginLeft:4 }}>{unit}</span>}
          {note && <div style={{ fontSize:14, color:D.text1, marginTop:8 }}>{note}</div>}
        </div>
        {spark && <div style={{ opacity:0.9 }}>{spark}</div>}
      </div>
    </div>
  );
}

function SectionHeader({ iconName, title, subtitle }) {
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:46, height:46, borderRadius:10, background:D.bg3,
          border:`1px solid ${D.border2}`, display:"flex", alignItems:"center",
          justifyContent:"center" }}>
          <Icon name={iconName} size={22} color={D.accent} />
        </div>
        <h2 style={{ margin:0, fontSize:26, fontWeight:700, color:D.text0 }}>{title}</h2>
      </div>
      {subtitle && <p style={{ margin:"8px 0 0 60px", fontSize:15, color:D.text1 }}>{subtitle}</p>}
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:D.text1 }}>
      <span style={{ width:9, height:9, borderRadius:2, background:color, display:"inline-block" }} />
      {label}
    </span>
  );
}

function Toggle({ on, onClick }) {
  return (
    <div onClick={onClick} style={{ width:42, height:23, borderRadius:12,
      background: on ? D.net : D.border2, cursor:"pointer", position:"relative",
      transition:"background 0.25s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:3, left: on ? 21 : 3, width:17, height:17,
        borderRadius:"50%", background: on ? "#fff" : D.text1, transition:"left 0.25s" }} />
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding:"5px 16px", borderRadius:20,
      border:`1px solid ${active ? D.accent : D.border}`,
      background: active ? D.accent : "transparent",
      fontSize:12, cursor:"pointer", color: active ? "#fff" : D.text1,
      fontWeight: active ? 600 : 400 }}>
      {children}
    </button>
  );
}

// ── Pages ────────────────────────────────────────────────────────────────────
function LiveDashboard() {
  const [live, setLive] = useState(mkLiveData());
  const [history, setHistory] = useState([mkLiveData()]);
  useEffect(() => {
    let active = true;
    const loadLiveData = async () => {
      const d = await withFallback(api.getLivePower, mkLiveData);
      if (!active) return;
      setLive(d);
      setHistory(p => [...p.slice(-24), d]);
    };

    loadLiveData();
    const id = setInterval(() => {
      loadLiveData();
    }, 1800);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div>
      <SectionHeader iconName="activity" title="Live Dashboard" subtitle="Real-time power — updates every 1.8 s" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16, marginBottom:18 }}>
        <StatCard label="Grid Draw"        value={live.grid_draw_kw} unit="kW" color={D.grid}  note="From utility"
          spark={<Sparkline data={history.map(h=>h.grid_draw_kw)} color={D.grid} />} />
        <StatCard label="Solar Generation" value={live.solar_gen_kw} unit="kW" color={D.solar} note="Rooftop PV"
          spark={<Sparkline data={history.map(h=>h.solar_gen_kw)} color={D.solar} />} />
        <StatCard label="Net Usage"        value={live.net_usage_kw} unit="kW" color={D.net}   note="Grid − Solar"
          spark={<Sparkline data={history.map(h=>h.net_usage_kw)} color={D.net} />} />
      </div>
      <Card>
        <div style={{ display:"flex", gap:70, justifyContent:"center", padding:"22px 0 28px", flexWrap:"wrap" }}>
          <Gauge value={live.grid_draw_kw}  max={5} label="Grid Draw"  color={D.grid}  />
          <Gauge value={live.solar_gen_kw}  max={5} label="Solar Gen"  color={D.solar} />
          <Gauge value={live.net_usage_kw}  max={5} label="Net Usage"  color={D.net}   />
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"flex-end" }}>
          <Icon name="clock" size={12} color={D.text2} />
          <span style={{ fontSize:11, color:D.text2 }}>
            {new Date(live.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </Card>
    </div>
  );
}

function UsageHistory() {
  const [period, setPeriod] = useState("daily");
  const [data, setData] = useState(() => mkHistory("daily"));

  useEffect(() => {
    let active = true;
    withFallback(() => api.getHistory(period), () => mkHistory(period)).then((nextData) => {
      if (active) setData(nextData);
    });
    return () => {
      active = false;
    };
  }, [period]);

  const avgGrid  = (data.reduce((a,d)=>a+d.grid,0)/data.length).toFixed(1);
  const avgSolar = (data.reduce((a,d)=>a+d.solar,0)/data.length).toFixed(1);
  const coverage = ((data.reduce((a,d)=>a+d.solar,0)/data.reduce((a,d)=>a+d.grid,0))*100).toFixed(0);
  return (
    <div>
      <SectionHeader iconName="barChart" title="Usage History" subtitle="Energy consumption over time" />
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {["daily","weekly","monthly"].map(p => (
          <Pill key={p} active={period===p} onClick={()=>setPeriod(p)}>
            {p.charAt(0).toUpperCase()+p.slice(1)}
          </Pill>
        ))}
      </div>
      <Card>
        <div style={{ display:"flex", gap:16, marginBottom:12 }}>
          <LegendDot color={D.grid}  label="Grid Draw" />
          <LegendDot color={D.solar} label="Solar Generation" />
        </div>
        <BarChart data={data} />
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
        <StatCard label="Avg Grid Draw"    value={avgGrid}   unit="kW" color={D.grid}  />
        <StatCard label="Avg Solar Gen"    value={avgSolar}  unit="kW" color={D.solar} />
        <StatCard label="Solar Coverage"   value={coverage}  unit="%"  color={D.net} note="of grid demand" />
      </div>
    </div>
  );
}

function SmartControl({
  devices,
  setDevices
}) {
  



useEffect(() => {
  let active = true;

  withFallback(api.getDevices, DEVICES)
    .then((nextDevices) => {
      if (active) setDevices(nextDevices);
    });

  return () => {
    active = false;
  };
}, []);

  const toggle = async (id) => {
    const device = devices.find(d => d.id === id);
    if (!device) return;

    const nextOn = !device.on;
    setDevices(p => p.map(d => d.id===id ? {...d, on:nextOn} : d));

    try {
      const updated = await api.updateDevice(id, { on: nextOn });
      setDevices(p => p.map(d => d.id===id ? updated : d));
    } catch {
      setDevices(p => p.map(d => d.id===id ? {...d, on:device.on} : d));
    }
  };

  const totalW = devices.filter(d=>d.on).reduce((a,d)=>a+d.watts,0);
  const pct = Math.min((totalW/12000)*100, 100);
  return (
    <div>
      <SectionHeader iconName="plug" title="Smart Control" subtitle="Remote ON/OFF for all appliances" />
      <Card style={{ marginBottom:18 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Icon name="power" size={15} color={totalW>8000?D.danger:D.net} />
            <span style={{ fontSize:15, color:D.text1 }}>Active load</span>
          </div>
          <span style={{ fontSize:32, fontWeight:700, color:totalW>8000?D.danger:D.net,
            letterSpacing:"0" }}>{(totalW/1000).toFixed(1)} kW</span>
        </div>
        <div style={{ height:10, background:D.border, borderRadius:5, overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:3, transition:"width 0.4s",
            background: totalW>8000?D.danger:D.grid, width:`${pct}%` }} />
        </div>
        <div style={{ fontSize:13, color:D.text2, marginTop:8, textAlign:"right" }}>
          {pct.toFixed(0)}% of 12 kW capacity
        </div>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:16 }}>
        {devices.map(d => (
          <div key={d.id} style={{ background:D.bg2, border:`1px solid ${d.on?D.border2:D.border}`,
            borderRadius:12, padding:"22px 24px", minHeight:104, display:"flex",
            justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontWeight:600, fontSize:17, color:D.text0, marginBottom:6 }}>{d.name}</div>
              <div style={{ fontSize:13, color:D.text2 }}>{d.room} · {d.watts}W</div>
            </div>
            <Toggle on={d.on} onClick={()=>toggle(d.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Billing() {
  const [b, setBilling] = useState(BILLING);
  useEffect(() => {
    let active = true;
    withFallback(api.getBilling, BILLING).then((summary) => {
      if (active) setBilling(summary);
    });
    return () => {
      active = false;
    };
  }, []);

  const over = b.projected_bill > b.budget_limit;
  return (
    <div>
      <SectionHeader iconName="dollar" title="Billing" subtitle="Monthly cost, projections & budget alerts" />
      {over && (
        <div style={{ background:"rgba(248,113,113,0.08)", border:`1px solid rgba(248,113,113,0.25)`,
          borderRadius:10, padding:"14px 18px", fontSize:15, color:D.danger,
          marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
          <Icon name="alert" size={14} color={D.danger} />
          Projected bill <strong style={{marginLeft:4}}>₹{b.projected_bill}</strong>
          <span style={{marginLeft:4}}>exceeds budget of ₹{b.budget_limit}</span>
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16, marginBottom:18 }}>
        <StatCard label="Current Balance" value={`₹${b.current_balance}`} unit="" color={D.grid}  note="This month so far" />
        <StatCard label="Projected Bill"  value={`₹${b.projected_bill}`}  unit="" color={over?D.danger:D.net} note={over?"Over budget!":"Under budget"} />
        <StatCard label="Budget Limit"    value={`₹${b.budget_limit}`}    unit="" color={D.text1} note={`${b.days_remaining} days left`} />
      </div>
      <Card>
        <div style={{ fontSize:16, fontWeight:600, color:D.text0, marginBottom:20 }}>Budget progress</div>
        {[
          { label:"Current",   pct:(b.current_balance/b.budget_limit)*100, color:D.grid  },
          { label:"Projected", pct:(b.projected_bill/b.budget_limit)*100,  color:over?D.danger:D.solar },
        ].map(row => (
          <div key={row.label} style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:D.text2, marginBottom:8 }}>
              <span>{row.label}</span><span>{row.pct.toFixed(0)}%</span>
            </div>
            <div style={{ height:12, background:D.border, borderRadius:6, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:4, background:row.color,
                width:`${Math.min(row.pct,100)}%` }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop:20, fontSize:14, color:D.text2, display:"flex", gap:16 }}>
          <span>₹{b.rate_per_kwh}/kWh</span>
          <span>·</span>
          <span>{b.days_remaining} days remaining</span>
        </div>
      </Card>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign:"center", padding:"60px 0" }}>
      <Icon name="search" size={48} color={D.text2} style={{ marginBottom:16 }} />
      <div style={{ fontSize:22, fontWeight:700, color:D.text0, marginBottom:8 }}>404 — Not Found</div>
      <div style={{ color:D.text1, fontSize:13 }}>This route doesn't exist in VoltStream.</div>
    </div>
  );
}

// ── Nav config ───────────────────────────────────────────────────────────────
const ROUTES = [
  { path:"/",          label:"Dashboard", icon:"activity" },
  { path:"/analytics", label:"Analytics", icon:"barChart"  },
  { path:"/devices",   label:"Devices",   icon:"cpu"       },
  { path:"/billing",   label:"Billing",   icon:"receipt"   },
];

// ── App ──────────────────────────────────────────────────────────────────────
export default function VoltStream() {
  const [route, setRoute] = useState("/");
  const [devices, setDevices] = useState(DEVICES);
  const refreshDevices = async () => {

    const nextDevices = await withFallback(
      api.getDevices,
      DEVICES
    );
  
    setDevices(nextDevices);
  };


  const [chatOpen, setChatOpen] = useState(false);

  const [mode, setMode] = useState("ai");

  

  const [showModeMenu, setShowModeMenu] = useState(false);

  const [chatHistory, setChatHistory] = useState([]);
  const [agentHistory, setAgentHistory] = useState([]);
  
  const [message, setMessage] = useState("");

  const [aiMessages, setAiMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm VoltStream AI. How can I help you today?"
    }
  ]);
  
  const [ragMessages, setRagMessages] = useState([
    {
      sender: "bot",
      text: "Hello! Ask me about VoltStream devices, billing, analytics and energy usage."
    }
  ]);
  const [agentMessages, setAgentMessages] = useState([
    {
      sender: "bot",
      text: "⚡ Hello! I'm VoltStream Device Agent. I can control devices and check their status."
    }
  ]);
  const messages =
  mode === "ai"
    ? aiMessages
    : mode === "rag"
    ? ragMessages
    : agentMessages;
const sendMessage = async () => {
  if (!message.trim()) return;

  const userMessage = message;

  if (mode === "ai") {

    setAiMessages(prev => [
      ...prev,
      {
        sender: "user",
        text: userMessage
      }
    ]);
  
  } else if (mode === "rag") {
  
    setRagMessages(prev => [
      ...prev,
      {
        sender: "user",
        text: userMessage
      }
    ]);
  
  } else {
  
    setAgentMessages(prev => [
      ...prev,
      {
        sender: "user",
        text: userMessage
      }
    ]);
    
  
  }

  setMessage("");

  try {

    let endpoint = "";

if (mode === "ai") {

  endpoint =
    "https://k4jz8nywj8.execute-api.eu-north-1.amazonaws.com/api/v1/chat";

} else if (mode === "rag") {

  endpoint =
    "https://k4jz8nywj8.execute-api.eu-north-1.amazonaws.com/api/v1/qa";

} else {

  endpoint = "https://llzplbfyq9.execute-api.eu-north-1.amazonaws.com/agent";
}

let payload = {};

if (mode === "ai") {

  payload = {
    message: userMessage,
    history: chatHistory.slice(-8)
  };

} else if (mode === "rag") {

  payload = {
    question: userMessage,
    // history: agentHistory.slice(-8)
  };

} else {

  payload = {
    message: userMessage,
    history: agentHistory.slice(-8)
  };
}

    const response = await fetch(
      endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();
    console.log("Agent Response:", data);
    
    if (mode === "ai" && data.history) {
      setChatHistory(data.history);
    }

    if (mode === "ai") {

      setAiMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: data.response
        }
      ]);
    
    } else if (mode === "rag") {
    
      setRagMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: data.response
        }
      ]);
    
    } else {
      let botResponse = data.response || data.message;

      if (
        typeof botResponse === "string" &&
        botResponse.startsWith("{")
      ) {
        try {
          const parsed = JSON.parse(botResponse);
          botResponse =
            parsed.response ||
            parsed.message ||
            botResponse;
        } catch {}
      }
    
      setAgentMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: botResponse,
          sessionId: data.session_id,
          requestId: data.request_id
        }
      ]);

      // const refreshDeviceData = async() => {
      //   const data = (await fetch("http://127.0.0.1:8000/api/v1/devices")).json()
      //   return data;
      // }

      // useEffect(() => {
      //   refreshDeviceData();
      // }, [refreshDeviceData]);


      const refreshDevices = async () => {
        try {
          const response = await fetch(
            "https://k4jz8nywj8.execute-api.eu-north-1.amazonaws.com/api/v1/devices"
          );
      
          const devices = await response.json();
      
          console.log("REFRESHED:", devices);
      
          setDevices([...devices]);
        } catch (err) {
          console.error(err);
        }
      };

      setTimeout(async () => {
        await refreshDevices();
      }, 1500);
      
      setAgentHistory(prev => [
        ...prev,
        {
          role: "user",
          content: userMessage
        },
        {
          role: "assistant",
          content: botResponse
        }
      ].slice(-8));
    
      
    
      const nextDevices = await withFallback(
        api.getDevices,
        DEVICES
      );
    
      console.log("Updated Devices:", nextDevices);
    
      setDevices(nextDevices);
    }
   } catch {

    if (mode === "ai") {
  
      setAiMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "Unable to connect to VoltStream."
        }
      ]);
  
    } else if (mode === "rag") {
  
      setRagMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "Unable to connect to VoltStream."
        }
      ]);
  
    } else {
  
      setAgentMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "Unable to connect to VoltStream Agent."
        }
      ]);
  
    }
  }
  
  };
  const Page =
  route === "/"
    ? LiveDashboard
    : route === "/analytics"
    ? UsageHistory
    : route === "/devices"
    ? () => (
        <SmartControl
          devices={devices}
          setDevices={setDevices}
        />
      )
    : route === "/billing"
    ? Billing
    : NotFound;

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:D.bg1, minHeight:"100vh",
      color:D.text0, display:"flex", flexDirection:"column" }}>

      {/* Header */}
      <div style={{ background:D.bg0, padding:"18px 32px", display:"flex",
        alignItems:"center", justifyContent:"space-between",
        borderBottom:`1px solid ${D.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:38, height:38, borderRadius:9, background:D.accent,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="zap" size={19} color="#fff" />
          </div>
          <span style={{ color:D.text0, fontWeight:800, fontSize:20, letterSpacing:"0" }}>VoltStream</span>
          <span style={{ background:D.bg3, color:D.text2, fontSize:9, padding:"2px 6px",
            borderRadius:4, fontWeight:600, border:`1px solid ${D.border}` }}>PROSUMER</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:D.net, display:"inline-block",
            boxShadow:`0 0 6px ${D.net}` }} />
          <span style={{ fontSize:11, color:D.text1 }}>Live</span>
        </div>
      </div>

      {/* Nav tabs */}
      <div style={{ background:D.bg0, display:"flex", overflowX:"auto",
        borderBottom:`1px solid ${D.border}`, padding:"0 24px" }}>
        {ROUTES.map(r => (
          <button key={r.path} onClick={()=>setRoute(r.path)}
            style={{ padding:"16px 24px", background:"none", border:"none", cursor:"pointer",
              fontSize:16, fontWeight:500, whiteSpace:"nowrap", flexShrink:0,
              color: route===r.path ? D.text0 : D.text1,
              borderBottom: route===r.path ? `2px solid ${D.accent}` : "2px solid transparent",
              display:"flex", alignItems:"center", gap:7 }}>
            <Icon name={r.icon} size={17} color={route===r.path ? D.accent : D.text2} />
            {r.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ width:"100%", maxWidth:1280, margin:"0 auto", padding:"32px 32px 40px", flex:1 }}>
        <Page />
      </div>

      {/* Footer */}
      {/* VoltStream AI */}

<button
  className="bot-float"
  onClick={() => setChatOpen(!chatOpen)}
  style={{
    position: "fixed",
    bottom: "30px",
    right: "30px",
    width: "78px",
    height: "78px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    fontSize: "36px",
    background:
      "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "#fff",
    zIndex: 1000
  }}
>
  🤖
</button>

{chatOpen && (
  <div
    style={{
      position: "fixed",
      right: "30px",
      bottom: "120px",
      width: "380px",
      height: "500px",
      background:
  mode === "ai"
    ? "#141d35"
    : "#071a1a",
      border: "1px solid #253558",
      borderRadius: "16px",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      zIndex: 1000,
      boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
    }}
  >
    <div
  style={{
    padding: "18px",
    background:
      mode === "ai"
        ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
        : "linear-gradient(135deg,#00c6a7,#00a3ff)",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
>
  <span style={{ fontWeight: "700" }}>
  {
  mode === "ai"
    ? "🤖 VoltStream AI"
    : mode === "rag"
    ? "📚 VoltStream Knowledge Base"
    : "⚡ VoltStream Device Agent"
}
  </span>

  <div style={{ position: "relative" }}>

  <button
    onClick={() => setShowModeMenu(!showModeMenu)}
    style={{
      padding: "8px 12px",
      borderRadius: "8px",
      border: "1px solid rgba(255,255,255,0.2)",
      background: "rgba(255,255,255,0.15)",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
      minWidth: "90px"
    }}
  >
    {mode.toUpperCase()} ▼
  </button>

  {showModeMenu && (
    <div
      style={{
        position: "absolute",
        top: "42px",
        right: 0,
        background:
          mode === "ai"
            ? "#141d35"
            : "#071a1a",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "8px",
        overflow: "hidden",
        zIndex: 9999,
        minWidth: "90px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
      }}
    >
      <div
        onClick={() => {
          setMode("ai");
          setShowModeMenu(false);
        }}
        style={{
          padding: "10px",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        AI
      </div>

      <div
        onClick={() => {
          setMode("rag");
          setShowModeMenu(false);
        }}
        style={{
          padding: "10px",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        RAG
      </div>
      <div
  onClick={() => {
    setMode("agent");
    setShowModeMenu(false);
  }}
  style={{
    padding: "10px",
    color: "#fff",
    cursor: "pointer"
  }}
>
  AGENT
</div>
    </div>
  )}

</div>
    
     </div>
     <div
     className="chat-messages"
      style={{
       flex: 1,
       overflowY: "auto",
       padding: "16px"
     }}
   >

      {messages.map((msg, index) => (
        <div
          key={index}
          style={{
            textAlign:
              msg.sender === "user"
                ? "right"
                : "left",
            marginBottom: "10px"
          }}
        >
          <div
            style={{
              display: "inline-block",
              maxWidth: "80%",
              padding: "10px",
              borderRadius: "12px",
              // padding: msg.sender === "user" ? "14px" : "10px",
              background:
              msg.sender === "user"
                ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                : mode === "ai"
  ? "#1e293b"
  : "#103030",
            
            border:
              msg.sender === "bot"
                ? "1px solid #334155"
                : "none",
            
            lineHeight: "1.6"
            }}
          >
            <>
  <div>{msg.text}</div>

  {msg.sessionId && (
    <div
      style={{
        marginTop: "12px",
        padding: "12px",
        borderRadius: "10px",
        background: "#0f172a",
        border: "1px solid #1e40af",
        fontSize: "12px",
        textAlign: "left"
      }}
    >
      <div
        style={{
          color: "#38bdf8",
          fontWeight: "600",
          marginBottom: "8px"
        }}
      >
        ⚡ Agent Runtime Information
      </div>

      <div style={{ color: "#94a3b8" }}>
        Session ID
      </div>

      <div
        style={{
          color: "#fff",
          wordBreak: "break-all",
          marginBottom: "10px"
        }}
      >
        {msg.sessionId}
      </div>

      <div style={{ color: "#94a3b8" }}>
        Request ID
      </div>

      <div
        style={{
          color: "#fff",
          wordBreak: "break-all"
        }}
      >
        {msg.requestId}
      </div>
    </div>
  )}
</>
          </div>
        </div>
      ))}
    </div>

    <div
      style={{
        display: "flex",
        borderTop: "1px solid #253558"
      }}
    >
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && sendMessage()
        }
        placeholder={
          mode === "ai"
            ? "Ask VoltStream AI..."
            : mode === "rag"
            ? "Ask about devices, billing, analytics..."
            : "Try: turn off dishwasher"
        }
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          background:
  mode === "ai"
    ? "#141d35"
    : "#071a1a",
          color: "#fff",
          padding: "16px",
          fontSize: "14px"
        }}
      />

      <button
      onClick={sendMessage}
       style={{
        width: "70px",
        border: "none",
        cursor: "pointer",
        fontSize: "20px",
        background:
  mode === "ai"
    ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
    : mode === "rag"
    ? "linear-gradient(135deg,#00c6a7,#00a3ff)"
    : "linear-gradient(135deg,#f59e0b,#ef4444)"
      }}
        
      >
        ➤
      </button>
    </div>
  </div>
)}
      <div style={{ textAlign:"center", padding:"18px 0 24px", fontSize:12,
        color:D.text2, borderTop:`1px solid ${D.border}` }}>
        VoltStream · React + FastAPI · Tachyon AIML Internship v4.0
      </div>
    </div>
  );
}
