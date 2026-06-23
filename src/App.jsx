import { useState, useRef, useEffect } from "react";

const BLUE = "#1B9DD9";
const NAVY = "#1F3864";

const BINS = [
  { id: "papel",      name: "Papel y cartón",   short: "Azul",     color: "#2059A8", lid: "#184788", text: "#fff" },
  { id: "metalicos",  name: "Metálicos",        short: "Amarillo", color: "#F2C500", lid: "#D4AC00", text: "#1a1a1a" },
  { id: "plasticos",  name: "Plásticos",        short: "Blanco",   color: "#F4F4F4", lid: "#DcDcDc", text: "#2a2a2a", border: "#CFCFCF" },
  { id: "vidrios",    name: "Vidrios",          short: "Plomo",    color: "#9A9CA0", lid: "#7E8084", text: "#fff" },
  { id: "peligrosos", name: "Peligrosos",       short: "Rojo",     color: "#C81F2E", lid: "#A4192A", text: "#fff" },
  { id: "noaprov",    name: "No aprovechables", short: "Negro",    color: "#1E1E1E", lid: "#0C0C0C", text: "#fff" },
  { id: "organicos",  name: "Orgánicos",        short: "Marrón",   color: "#6E4A2A", lid: "#573820", text: "#fff" },
];
const BIN_BY_ID = Object.fromEntries(BINS.map((b) => [b.id, b]));

const ITEMS = [
  { id: "carton",     name: "Cartones",                      emoji: "📦", bin: "papel",      reason: "Los cartones son reciclables: van al tacho azul." },
  { id: "papel",      name: "Papeles",                       emoji: "📄", bin: "papel",      reason: "Todo papel limpio va al tacho azul." },
  { id: "planos",     name: "Impresión de planos",           emoji: "📐", bin: "papel",      reason: "Los planos impresos son papel: van al tacho azul." },
  { id: "folder",     name: "Folders",                       emoji: "🗂️", bin: "papel",      reason: "Los folders de papel van al tacho azul." },
  { id: "clavos",     name: "Clavos",                        emoji: "📌", bin: "metalicos",  reason: "Los clavos son metálicos: van al tacho amarillo." },
  { id: "fierros",    name: "Retazos de fierros",            emoji: "🔧", bin: "metalicos",  reason: "Los retazos de fierro van al tacho amarillo." },
  { id: "pernos",     name: "Pernos",                        emoji: "🔩", bin: "metalicos",  reason: "Los pernos son metálicos: van al tacho amarillo." },
  { id: "envmetal",   name: "Envases metálicos limpios",     emoji: "🥫", bin: "metalicos",  reason: "Envases metálicos limpios van al tacho amarillo." },
  { id: "botgaseosa", name: "Botella de gaseosa limpia",     emoji: "🥤", bin: "plasticos",  reason: "Botellas de plástico limpias van al tacho blanco." },
  { id: "botagua",    name: "Botella de agua limpia",        emoji: "💧", bin: "plasticos",  reason: "Botellas de agua limpias van al tacho blanco." },
  { id: "vidrio",     name: "Vidrio",                        emoji: "🪟", bin: "vidrios",    reason: "Todo vidrio, limpio o roto, va al tacho plomo." },
  { id: "guantes",    name: "Guantes con aceite",            emoji: "🧤", bin: "peligrosos", reason: "Guantes impregnados de aceite son peligrosos: tacho rojo." },
  { id: "tyvek",      name: "Tyvek con aceite",              emoji: "🦺", bin: "peligrosos", reason: "El tyvek con aceite es residuo peligroso: tacho rojo." },
  { id: "cinta",      name: "Cinta con restos de cemento",   emoji: "🎗️", bin: "peligrosos", reason: "Cinta de seguridad con cemento es peligrosa: tacho rojo." },
  { id: "baldepint",  name: "Balde de pintura",              emoji: "🪣", bin: "peligrosos", reason: "Los baldes de pintura son residuo peligroso: tacho rojo." },
  { id: "madera",     name: "Madera con restos de concreto", emoji: "🪵", bin: "peligrosos", reason: "Madera contaminada con concreto va al tacho rojo." },
  { id: "pilas",      name: "Pilas / baterías",              emoji: "🔋", bin: "peligrosos", reason: "Las pilas y baterías son peligrosas: tacho rojo." },
  { id: "bidon",      name: "Bidón de combustible",          emoji: "🛢️", bin: "peligrosos", reason: "Bidones de combustible son peligrosos: tacho rojo." },
  { id: "quimicos",   name: "Aditivos químicos",             emoji: "🧪", bin: "peligrosos", reason: "Los aditivos químicos son peligrosos: tacho rojo." },
  { id: "senaliz",    name: "Señalización en mal estado",    emoji: "🚧", bin: "noaprov",    reason: "La señalización deteriorada no es aprovechable: tacho negro." },
  { id: "botresid",   name: "Botellas con residuos",         emoji: "🍶", bin: "noaprov",    reason: "Botellas contaminadas no son reciclables: van al tacho negro." },
  { id: "eppsdet",    name: "EPPs deteriorados",             emoji: "🥾", bin: "noaprov",    reason: "Los EPPs en mal estado van al tacho negro." },
  { id: "lentesrot",  name: "Lentes de seguridad rotos",     emoji: "🥽", bin: "noaprov",    reason: "Lentes de seguridad rotos van al tacho negro." },
  { id: "tyvekrot",   name: "Tyvek roto",                    emoji: "🦺", bin: "noaprov",    reason: "El tyvek roto sin contaminantes va al tacho negro." },
  { id: "tecnopor",   name: "Tecnopor",                      emoji: "🧊", bin: "noaprov",    reason: "El tecnopor no es aprovechable: tacho negro." },
  { id: "frutas",     name: "Restos de frutas",              emoji: "🍌", bin: "organicos",  reason: "Los restos de frutas son orgánicos: van al tacho marrón." },
];

const ROUND_COUNT = 12;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function formatTime(sec) {
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function fmtDate(iso) {
  const d = new Date(iso), p = (n) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

// ── Muñequitos SVG CMEJIA ──────────────────────────────────────────
const C = {
  navy:"#1F3864", navyD:"#16284D", lime:"#C8D400", limeD:"#A8B200",
  white:"#F5F7FA", whiteD:"#DDE2EA", skin:"#E8A87C", hair:"#2A1F1A",
  boot:"#7A4A24", refl:"#E8EEF4", lens:"#BDD8F0",
};

function HardHat({ cx = 105, y = 30 }) {
  return <>
    <ellipse cx={cx} cy={y + 38} rx={38} ry={9} fill={C.whiteD} />
    <path d={`M${cx - 30} ${y + 36} a30 28 0 0 1 60 0 z`} fill={C.white} />
    <rect x={cx - 6} y={y + 14} width={12} height={10} rx={4} fill={C.whiteD} />
    <circle cx={cx} cy={y + 28} r={5} fill="#1B9DD9" />
  </>;
}
function Glasses({ cx = 105, ey = 82 }) {
  return <g stroke={C.navy} strokeWidth={2.5} fill={C.lens}>
    <rect x={cx - 22} y={ey} width={18} height={12} rx={4} />
    <rect x={cx + 4} y={ey} width={18} height={12} rx={4} />
    <line x1={cx - 4} y1={ey + 6} x2={cx + 4} y2={ey + 6} />
    <line x1={cx - 40} y1={ey + 5} x2={cx - 22} y2={ey + 5} fill="none" />
    <line x1={cx + 22} y1={ey + 5} x2={cx + 40} y2={ey + 5} fill="none" />
  </g>;
}
function Badge({ cx = 110, ty = 170 }) {
  return <g>
    <rect x={cx - 18} y={ty} width={36} height={18} rx={3} fill={C.white} opacity={0.9} />
    <text x={cx} y={ty + 7} textAnchor="middle" fontSize={5} fontWeight="bold" fill="#1B9DD9">CMEJIA</text>
    <text x={cx} y={ty + 14} textAnchor="middle" fontSize={4} fill={C.navy}>S.A.C.</text>
  </g>;
}

function MascotMale({ size = 130 }) {
  return <svg width={size} height={size * 1.75} viewBox="0 0 210 370" style={{ display: "block" }}>
    <rect x={84} y={240} width={24} height={90} rx={10} fill={C.navy} />
    <rect x={106} y={240} width={24} height={90} rx={10} fill={C.navy} />
    <rect x={84} y={308} width={24} height={7} fill={C.refl} />
    <rect x={106} y={308} width={24} height={7} fill={C.refl} />
    <path d="M82 330 h26 v8 q0 7-7 7 H74 q-7 0-7-7 q0-8 15-8 z" fill={C.boot} />
    <path d="M108 330 h26 q15 0 15 8 q0 7-7 7 h-27 q-7 0-7-7 z" fill={C.boot} />
    <path d="M82 175 C65 185 60 215 62 235" fill="none" stroke={C.navy} strokeWidth={18} strokeLinecap="round" />
    <circle cx={62} cy={237} r={10} fill={C.skin} />
    <path d="M128 175 C148 160 158 130 162 108" fill="none" stroke={C.navy} strokeWidth={18} strokeLinecap="round" />
    <circle cx={163} cy={104} r={10} fill={C.skin} />
    <rect x={159} y={84} width={8} height={20} rx={4} fill={C.skin} />
    <rect x={78} y={155} width={64} height={100} rx={18} fill={C.navy} />
    <path d="M88 155 h44 a10 10 0 0 1 10 10 v80 a10 10 0 0 1-10 10 h-44 a10 10 0 0 1-10-10 v-80 a10 10 0 0 1 10-10 z" fill={C.lime} />
    <path d="M104 155 L110 172 L116 155 Z" fill={C.navy} />
    <rect x={107} y={155} width={6} height={100} fill={C.limeD} />
    <rect x={80} y={195} width={60} height={9} fill={C.refl} />
    <rect x={80} y={216} width={60} height={9} fill={C.refl} />
    <rect x={92} y={168} width={7} height={25} fill={C.refl} />
    <rect x={121} y={168} width={7} height={25} fill={C.refl} />
    <Badge />
    <rect x={99} y={135} width={22} height={24} rx={8} fill={C.skin} />
    <ellipse cx={110} cy={115} rx={30} ry={33} fill={C.skin} />
    <circle cx={81} cy={117} r={7} fill={C.skin} />
    <circle cx={139} cy={117} r={7} fill={C.skin} />
    <path d="M82 106 C84 82 136 82 138 106 C130 94 118 88 110 88 C102 88 90 94 82 106 Z" fill={C.hair} />
    <Glasses cx={110} ey={106} />
    <circle cx={99} cy={112} r={3} fill="#222" />
    <circle cx={121} cy={112} r={3} fill="#222" />
    <path d="M103 125 q7 7 14 0" fill="none" stroke="#8B3A2A" strokeWidth={2.5} strokeLinecap="round" />
    <HardHat cx={110} y={56} />
  </svg>;
}

function MascotFemale({ size = 130 }) {
  return <svg width={size} height={size * 1.75} viewBox="0 0 210 370" style={{ display: "block" }}>
    <rect x={84} y={240} width={24} height={90} rx={10} fill={C.navy} />
    <rect x={106} y={240} width={24} height={90} rx={10} fill={C.navy} />
    <rect x={84} y={308} width={24} height={7} fill={C.refl} />
    <rect x={106} y={308} width={24} height={7} fill={C.refl} />
    <path d="M82 330 h26 v8 q0 7-7 7 H74 q-7 0-7-7 q0-8 15-8 z" fill={C.boot} />
    <path d="M108 330 h26 q15 0 15 8 q0 7-7 7 h-27 q-7 0-7-7 z" fill={C.boot} />
    <path d="M82 175 C68 188 64 212 64 232" fill="none" stroke={C.navy} strokeWidth={18} strokeLinecap="round" />
    <circle cx={64} cy={234} r={10} fill={C.skin} />
    <path d="M128 175 C148 158 160 128 164 108" fill="none" stroke={C.navy} strokeWidth={18} strokeLinecap="round" />
    <circle cx={165} cy={104} r={10} fill={C.skin} />
    <rect x={158} y={84} width={7} height={16} rx={3.5} fill={C.skin} />
    <rect x={165} y={82} width={7} height={18} rx={3.5} fill={C.skin} />
    <rect x={172} y={84} width={7} height={16} rx={3.5} fill={C.skin} />
    <rect x={78} y={155} width={64} height={100} rx={18} fill={C.navy} />
    <path d="M88 155 h44 a10 10 0 0 1 10 10 v80 a10 10 0 0 1-10 10 h-44 a10 10 0 0 1-10-10 v-80 a10 10 0 0 1 10-10 z" fill={C.lime} />
    <path d="M104 155 L110 172 L116 155 Z" fill={C.navy} />
    <rect x={107} y={155} width={6} height={100} fill={C.limeD} />
    <rect x={80} y={195} width={60} height={9} fill={C.refl} />
    <rect x={80} y={216} width={60} height={9} fill={C.refl} />
    <rect x={92} y={168} width={7} height={25} fill={C.refl} />
    <rect x={121} y={168} width={7} height={25} fill={C.refl} />
    <Badge />
    <rect x={99} y={135} width={22} height={24} rx={8} fill={C.skin} />
    <ellipse cx={110} cy={114} rx={29} ry={32} fill={C.skin} />
    <circle cx={82} cy={116} r={7} fill={C.skin} />
    <circle cx={138} cy={116} r={7} fill={C.skin} />
    <path d="M80 105 C80 78 140 78 140 105 L138 165 C138 172 126 172 125 165 L126 118 C120 138 100 138 94 118 L95 165 C94 172 82 172 81 165 Z" fill={C.hair} />
    <path d="M82 105 C84 80 136 80 138 105 C128 92 92 92 82 105 Z" fill={C.hair} />
    <Glasses cx={110} ey={105} />
    <circle cx={99} cy={111} r={3} fill="#222" />
    <circle cx={121} cy={111} r={3} fill="#222" />
    <ellipse cx={110} cy={126} rx={5} ry={6} fill="#7A2E22" />
    <HardHat cx={110} y={54} />
  </svg>;
}

function Mascot({ type = "male", size = 130 }) {
  if (type === "female") return <MascotFemale size={size} />;
  return <MascotMale size={size} />;
}

// ── Logo CMEJIA ───────────────────────────────────────────────────
function Logo({ scale = 1 }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={38 * scale} height={38 * scale} viewBox="0 0 64 64">
        <path d="M4 58 L4 30 L22 22 L22 58 Z" fill={BLUE} />
        <rect x="24" y="14" width="16" height="44" fill={BLUE} />
        <path d="M42 58 L42 28 L58 28 L58 58 Z" fill="#7FC9ED" />
        <rect x="28" y="20" width="3" height="3" fill="#fff" />
        <rect x="33" y="20" width="3" height="3" fill="#fff" />
        <rect x="28" y="27" width="3" height="3" fill="#fff" />
        <rect x="33" y="27" width="3" height="3" fill="#fff" />
        <path d="M2 60 Q30 52 62 60" stroke={BLUE} strokeWidth="3" fill="none" />
      </svg>
      <div className="leading-none">
        <div className="font-extrabold tracking-tight" style={{ color: BLUE }}>
          <span style={{ fontSize: 22 * scale }}>C</span>
          <span style={{ fontSize: 18 * scale }}>MEJIA</span>
          <span className="align-top ml-1" style={{ fontSize: 11 * scale }}>S.A.C.</span>
        </div>
        <div className="font-semibold tracking-wide" style={{ color: BLUE, fontSize: 9 * scale }}>CONTRATISTAS GENERALES</div>
      </div>
    </div>
  );
}

// ── Tacho cilindro ────────────────────────────────────────────────
function Bin({ bin, onPick, answered, item }) {
  let ring = "none";
  if (answered) {
    if (bin.id === item.bin) ring = "0 0 0 4px #16a34a";
    else if (bin.id === answered.chosen && !answered.correct) ring = "0 0 0 4px #dc2626";
  }
  const light = bin.text === "#fff";
  return (
    <button onClick={() => onPick(bin.id)} disabled={!!answered}
      className="flex flex-col items-center transition transform hover:-translate-y-1 active:scale-95"
      style={{ cursor: answered ? "default" : "pointer" }}>
      <div style={{ width: "80%", height: 10, borderRadius: "50%", background: bin.lid, marginBottom: -5, position: "relative", zIndex: 1 }} />
      <div className="w-full flex flex-col items-center px-1 pt-3 pb-2"
        style={{
          background: bin.color, borderRadius: "10px 10px 16px 16px", color: bin.text,
          border: bin.border ? `1px solid ${bin.border}` : "none",
          boxShadow: ring !== "none" ? ring : "0 3px 7px rgba(0,0,0,0.18)",
        }}>
        <span style={{ fontSize: 24, lineHeight: 1 }}>♻️</span>
        <span className="font-bold text-center leading-none mt-1" style={{ fontSize: 10 }}>RESIDUOS</span>
        <span className="font-extrabold text-center leading-tight" style={{ fontSize: 11, textTransform: "uppercase" }}>{bin.name}</span>
        <span className="mt-1 rounded-full px-2 font-semibold" style={{ fontSize: 10, background: light ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.10)" }}>{bin.short}</span>
      </div>
    </button>
  );
}

function Chip({ bin }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold"
      style={{ background: bin.color, color: bin.text, border: bin.border ? `1px solid ${bin.border}` : "none" }}>
      ♻️ {bin.name}
    </span>
  );
}

// ── App principal ─────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("start");
  const [playerName, setPlayerName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [order, setOrder] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [lastGain, setLastGain] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [board, setBoard] = useState([]);
  const [boardLoading, setBoardLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const startRef = useRef(null);
  const tickRef = useRef(null);
  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const nameRef = useRef("");
  const orderRef = useRef([]);

  const STORE_KEY = "cmejia_ranking_v1";

  function stopTick() { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; } }
  useEffect(() => () => stopTick(), []);

  function startGame() {
    const nm = playerName.trim();
    if (!nm) { setNameError(true); return; }
    setNameError(false);
    nameRef.current = nm;
    const ord = shuffle(ITEMS).slice(0, ROUND_COUNT);
    orderRef.current = ord;
    setOrder(ord); setIdx(0);
    setScore(0); scoreRef.current = 0;
    setCorrectCount(0); correctRef.current = 0;
    setStreak(0); setBestStreak(0);
    setMistakes([]); setAnswered(null); setLastGain(0);
    setElapsed(0);
    startRef.current = Date.now();
    stopTick();
    tickRef.current = setInterval(() => setElapsed((Date.now() - startRef.current) / 1000), 200);
    setScreen("play");
  }

  function saveResult(result) {
    try {
      const prev = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
      prev.push(result);
      if (prev.length > 500) prev.splice(0, prev.length - 500);
      localStorage.setItem(STORE_KEY, JSON.stringify(prev));
    } catch (e) { console.error(e); }
  }

  function endGame() {
    stopTick();
    const t = (Date.now() - startRef.current) / 1000;
    setFinalTime(t);
    saveResult({
      name: nameRef.current, score: scoreRef.current, correct: correctRef.current,
      total: orderRef.current.length, timeSec: Math.round(t), date: new Date().toISOString(),
    });
    setScreen("end");
  }

  function advance() {
    setAnswered(null);
    if (idx + 1 >= order.length) endGame();
    else setIdx((i) => i + 1);
  }

  function handlePick(binId) {
    if (answered) return;
    const item = order[idx];
    const correct = binId === item.bin;
    setAnswered({ chosen: binId, correct });
    if (correct) {
      const gain = 100 + Math.min(streak, 5) * 10;
      setLastGain(gain);
      scoreRef.current += gain; setScore(scoreRef.current);
      correctRef.current += 1; setCorrectCount(correctRef.current);
      setStreak((s) => { const n = s + 1; setBestStreak((b) => Math.max(b, n)); return n; });
      setTimeout(() => advance(), 850);
    } else {
      setStreak(0);
      setMistakes((m) => [...m, item]);
    }
  }

  function openRanking() {
    setScreen("ranking"); setConfirmClear(false); setBoardLoading(true);
    try {
      const data = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
      setBoard(data);
    } catch (e) { setBoard([]); }
    setBoardLoading(false);
  }

  function clearBoard() {
    localStorage.removeItem(STORE_KEY);
    setBoard([]);
    setConfirmClear(false);
  }

  const sortedBoard = [...board].sort((a, b) => b.score - a.score || a.timeSec - b.timeSec);

  function buildCSV() {
    const header = ["Puesto", "Nombre", "Puntos", "Aciertos", "Total", "Precision", "Tiempo", "Fecha"];
    const lines = [header.join(",")];
    sortedBoard.forEach((r, i) => {
      const acc = Math.round((r.correct / r.total) * 100) + "%";
      lines.push([i + 1, `"${r.name}"`, r.score, r.correct, r.total, acc, formatTime(r.timeSec), `"${new Date(r.date).toLocaleString("es-PE")}"`].join(","));
    });
    return lines.join("\n");
  }

  async function copyCSV() {
    try { await navigator.clipboard.writeText(buildCSV()); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch (e) { console.error(e); }
  }

  function downloadCSV() {
    const blob = new Blob([buildCSV()], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "ranking_segregacion_cmejia.csv";
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  const wrap = { minHeight: "100vh", background: "linear-gradient(160deg,#eef4fa 0%,#e3edf6 55%,#dbe7f3 100%)" };

  // ── INICIO ───────────────────────────────────────────────────────
  if (screen === "start") return (
    <div style={wrap}>
      <div className="max-w-3xl mx-auto px-4 py-7">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <Logo />
            <span className="text-xs font-semibold rounded-full px-3 py-1" style={{ background: "#eaf6fd", color: NAVY }}>Área de Medio Ambiente</span>
          </div>
          <div className="text-center mt-4">
            <div className="text-5xl">♻️</div>
            <h1 className="text-3xl font-extrabold mt-1" style={{ color: NAVY }}>¿A dónde va el residuo?</h1>
            <p className="text-sm font-semibold mt-1" style={{ color: BLUE }}>Segregación de residuos sólidos · NTP 900.058:2019</p>
          </div>
          <div className="flex items-end justify-center gap-3 mt-4">
            <Mascot type="female" size={120} />
            <div className="bg-blue-50 rounded-2xl p-3 shadow-sm mb-4" style={{ border: `2px solid ${BLUE}` }}>
              <p className="text-sm text-gray-700">¡Hola! Toca el <b>tacho del color correcto</b> para cada residuo. ¡Hazlo rápido y sin fallar! ♻️</p>
            </div>
          </div>
          <div className="mt-3">
            <label className="text-sm font-bold" style={{ color: NAVY }}>Tu nombre</label>
            <input type="text" value={playerName}
              onChange={(e) => { setPlayerName(e.target.value); if (nameError) setNameError(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") startGame(); }}
              placeholder="Ej. Juan Pérez" maxLength={40}
              className="w-full mt-1 rounded-xl px-4 py-3 text-base outline-none"
              style={{ border: `2px solid ${nameError ? "#dc2626" : "#d1d5db"}` }} />
            {nameError && <p className="text-xs text-red-600 mt-1">Escribe tu nombre para empezar.</p>}
          </div>
          <div className="mt-5">
            <p className="text-xs font-bold text-gray-500 mb-2 text-center">LOS 7 TACHOS</p>
            <div className="flex flex-wrap justify-center gap-2">{BINS.map((b) => <Chip key={b.id} bin={b} />)}</div>
          </div>
          <button onClick={startGame} className="w-full mt-6 rounded-xl py-4 text-white font-extrabold text-lg transition transform hover:scale-105 active:scale-95 shadow-md" style={{ background: BLUE }}>▶ Iniciar juego</button>
          <button onClick={openRanking} className="w-full mt-3 rounded-xl py-3 font-bold transition active:scale-95" style={{ background: "#eef2f7", color: NAVY }}>🏆 Ver ranking</button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">C. MEJÍA S.A.C. — Contratistas Generales · Tu compromiso es indispensable</p>
      </div>
    </div>
  );

  // ── RANKING ──────────────────────────────────────────────────────
  if (screen === "ranking") return (
    <div style={wrap}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <Logo scale={0.85} />
            <span className="text-2xl font-extrabold" style={{ color: NAVY }}>🏆 Ranking</span>
          </div>
          {boardLoading ? (
            <p className="text-center text-gray-500 py-10">Cargando…</p>
          ) : sortedBoard.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Aún no hay resultados. ¡Sé el primero!</p>
          ) : (
            <div className="space-y-2 mt-5">
              {sortedBoard.map((r, i) => {
                const acc = Math.round((r.correct / r.total) * 100);
                const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
                return (
                  <div key={i} className="flex items-center gap-3 rounded-xl shadow-sm px-3 py-2" style={{ background: i < 3 ? "#f3f9ff" : "#f8fafc" }}>
                    <div className="w-8 text-center text-lg font-extrabold" style={{ color: NAVY }}>{medal || i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate" style={{ color: NAVY }}>{r.name}</div>
                      <div className="text-xs text-gray-500">✅ {acc}% · ⏱️ {formatTime(r.timeSec)} · {fmtDate(r.date)}</div>
                    </div>
                    <div className="text-right"><div className="text-xl font-extrabold" style={{ color: BLUE }}>{r.score}</div><div className="text-xs text-gray-400">pts</div></div>
                  </div>
                );
              })}
            </div>
          )}
          {sortedBoard.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              <button onClick={copyCSV} className="rounded-lg px-4 py-2 font-bold text-white" style={{ background: NAVY }}>{copied ? "✓ Copiado" : "📋 Copiar CSV"}</button>
              <button onClick={downloadCSV} className="rounded-lg px-4 py-2 font-bold" style={{ background: "#eef2f7", color: NAVY }}>⬇️ Descargar CSV</button>
              {!confirmClear
                ? <button onClick={() => setConfirmClear(true)} className="rounded-lg px-4 py-2 font-bold text-red-600 bg-red-50">🗑️ Limpiar</button>
                : <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">¿Borrar todo?</span>
                    <button onClick={clearBoard} className="rounded-lg px-3 py-2 font-bold text-white bg-red-600">Sí</button>
                    <button onClick={() => setConfirmClear(false)} className="rounded-lg px-3 py-2 font-bold bg-gray-200">No</button>
                  </div>
              }
            </div>
          )}
          <button onClick={() => setScreen("start")} className="w-full mt-6 rounded-xl py-3 font-bold text-white" style={{ background: BLUE }}>← Volver</button>
        </div>
      </div>
    </div>
  );

  // ── FIN ──────────────────────────────────────────────────────────
  if (screen === "end") {
    const total = order.length;
    const acc = Math.round((correctCount / total) * 100);
    let rating, emo;
    if (acc === 100) { rating = "¡Maestro del reciclaje!"; emo = "🌟"; }
    else if (acc >= 85) { rating = "¡Excelente trabajo!"; emo = "🌿"; }
    else if (acc >= 70) { rating = "¡Muy bien!"; emo = "👍"; }
    else if (acc >= 50) { rating = "Vas bien, sigue practicando"; emo = "💪"; }
    else { rating = "A reforzar la segregación"; emo = "📚"; }
    return (
      <div style={wrap}>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-center"><Logo /></div>
            <div className="flex flex-col items-center mt-3">
              <Mascot type={acc >= 70 ? "female" : "male"} size={120} />
              <div className="text-5xl mt-1">{emo}</div>
              <h2 className="text-2xl font-extrabold mt-1" style={{ color: NAVY }}>{rating}</h2>
              <p className="text-sm text-gray-500">{nameRef.current}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="bg-gray-100 rounded-xl p-3 text-center"><div className="text-2xl font-extrabold" style={{ color: BLUE }}>{score}</div><div className="text-xs text-gray-500">Puntos</div></div>
              <div className="bg-gray-100 rounded-xl p-3 text-center"><div className="text-2xl font-extrabold" style={{ color: BLUE }}>{correctCount}/{total}</div><div className="text-xs text-gray-500">Aciertos</div></div>
              <div className="bg-gray-100 rounded-xl p-3 text-center"><div className="text-2xl font-extrabold" style={{ color: BLUE }}>{acc}%</div><div className="text-xs text-gray-500">Precisión</div></div>
              <div className="bg-gray-100 rounded-xl p-3 text-center"><div className="text-2xl font-extrabold" style={{ color: BLUE }}>⏱️ {formatTime(finalTime)}</div><div className="text-xs text-gray-500">Tiempo</div></div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-3">Mejor racha: 🔥 {bestStreak}</p>
            {mistakes.length > 0 && (
              <div className="mt-6">
                <p className="font-bold text-sm mb-2" style={{ color: NAVY }}>Para repasar:</p>
                <div className="space-y-2">
                  {mistakes.map((m, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-sm">{m.emoji} {m.name}</span>
                      <Chip bin={BIN_BY_ID[m.bin]} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-3 mt-7">
              <button onClick={startGame} className="flex-1 rounded-xl py-3 text-white font-bold" style={{ background: BLUE }}>🔄 Jugar de nuevo</button>
              <button onClick={openRanking} className="rounded-xl py-3 px-5 font-bold text-white" style={{ background: NAVY }}>🏆 Ranking</button>
              <button onClick={() => setScreen("start")} className="rounded-xl py-3 px-5 font-bold text-gray-600 bg-gray-200">Inicio</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── JUEGO ────────────────────────────────────────────────────────
  const item = order[idx];
  const correctBin = BIN_BY_ID[item.bin];
  return (
    <div style={wrap}>
      <div className="max-w-4xl mx-auto px-4 py-5">
        <div className="bg-white rounded-2xl shadow p-3 flex items-center justify-between flex-wrap gap-3">
          <Logo scale={0.85} />
          <div className="flex items-center gap-2 flex-wrap">
            <div className="rounded-lg px-3 py-1 text-center" style={{ background: NAVY }}>
              <div className="text-white font-extrabold text-lg leading-none">⏱️ {formatTime(elapsed)}</div>
              <div className="text-xs text-blue-100">Tiempo</div>
            </div>
            <div className="rounded-lg px-3 py-1 text-center bg-gray-100"><div className="font-extrabold text-lg leading-none" style={{ color: BLUE }}>{score}</div><div className="text-xs text-gray-500">Puntos</div></div>
            <div className="rounded-lg px-3 py-1 text-center bg-gray-100"><div className="font-extrabold text-lg leading-none text-orange-500">🔥 {streak}</div><div className="text-xs text-gray-500">Racha</div></div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
            <span>Residuo {idx + 1} de {order.length}</span><span>Aciertos: {correctCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="h-2 rounded-full transition-all" style={{ width: `${((idx + 1) / order.length) * 100}%`, background: BLUE }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 mt-4 flex items-center gap-2">
          <div className="shrink-0"><Mascot type="male" size={80} /></div>
          <div className="flex-1 text-center">
            <p className="text-sm font-semibold text-gray-500">¿A qué tacho va este residuo?</p>
            <div className="text-7xl my-2">{item.emoji}</div>
            <h2 className="text-xl sm:text-2xl font-extrabold" style={{ color: NAVY }}>{item.name}</h2>
          </div>
        </div>
        <div className="mt-3" style={{ minHeight: 64 }}>
          {answered && answered.correct && (
            <div className="rounded-xl px-4 py-3 text-center font-bold text-white" style={{ background: "#16a34a" }}>✅ ¡Correcto! +{lastGain} pts</div>
          )}
          {answered && !answered.correct && (
            <div className="rounded-xl px-4 py-3" style={{ background: "#fdecea", border: "1px solid #f5b7b1" }}>
              <p className="font-bold text-red-700">❌ Va en el tacho {correctBin.name} ({correctBin.short})</p>
              <p className="text-sm text-gray-700 mt-1">{item.reason}</p>
              <button onClick={advance} className="mt-2 rounded-lg px-5 py-2 text-white font-bold" style={{ background: NAVY }}>Siguiente ▶</button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-3">
          {BINS.map((b) => <Bin key={b.id} bin={b} onPick={handlePick} answered={answered} item={item} />)}
        </div>
      </div>
    </div>
  );
}
