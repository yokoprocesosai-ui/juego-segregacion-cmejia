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
  { id: "carton",     name: "Cartones",                        emoji: "📦", bin: "papel",      reason: "Los cartones son reciclables: van al tacho AZUL." },
  { id: "papel",      name: "Papeles",                         emoji: "📄", bin: "papel",      reason: "Todo papel limpio va al tacho AZUL." },
  { id: "planos",     name: "Impresión de planos",             emoji: "📐", bin: "papel",      reason: "Los planos impresos son papel: van al tacho AZUL." },
  { id: "folder",     name: "Folders",                         emoji: "🗂️", bin: "papel",      reason: "Los folders de papel van al tacho AZUL." },
  { id: "clavos",     name: "Clavos",                          emoji: "📌", bin: "metalicos",  reason: "Los clavos son metálicos: van al tacho AMARILLO." },
  { id: "fierros",    name: "Retazos de fierros",              emoji: "🔧", bin: "metalicos",  reason: "Los retazos de fierro van al tacho AMARILLO." },
  { id: "pernos",     name: "Pernos",                          emoji: "🔩", bin: "metalicos",  reason: "Los pernos son metálicos: van al tacho AMARILLO." },
  { id: "envmetal",   name: "Envases metálicos limpios",       emoji: "🥫", bin: "metalicos",  reason: "Envases metálicos limpios van al tacho AMARILLO." },
  { id: "botgaseosa", name: "Botella de gaseosa limpia",       emoji: "🥤", bin: "plasticos",  reason: "Botellas de plástico limpias van al tacho BLANCO." },
  { id: "botagua",    name: "Botella de agua limpia",          emoji: "💧", bin: "plasticos",  reason: "Botellas de agua limpias van al tacho BLANCO." },
  { id: "vidrio",     name: "Vidrio",                          emoji: "🪟", bin: "vidrios",    reason: "Todo vidrio, limpio o roto, va al tacho PLOMO." },
  { id: "guantes",    name: "Guantes con aceite",              emoji: "🧤", bin: "peligrosos", reason: "Guantes con aceite son PELIGROSOS: tacho ROJO." },
  { id: "tyvek",      name: "Tyvek contaminado",               emoji: "🦺", bin: "peligrosos", reason: "El tyvek contaminado es PELIGROSO: tacho ROJO." },
  { id: "cinta",      name: "Cinta con restos de cemento",     emoji: "🎗️", bin: "peligrosos", reason: "Cinta con cemento es PELIGROSA: tacho ROJO." },
  { id: "baldepint",  name: "Baldes de pintura",               emoji: "🪣", bin: "peligrosos", reason: "Los baldes de pintura son PELIGROSOS: tacho ROJO." },
  { id: "madera",     name: "Madera con restos de concreto",   emoji: "🪵", bin: "peligrosos", reason: "Madera con concreto es PELIGROSA: tacho ROJO." },
  { id: "pilas",      name: "Pilas / baterías",                emoji: "🔋", bin: "peligrosos", reason: "Las pilas y baterías son PELIGROSAS: tacho ROJO." },
  { id: "bidon",      name: "Bidones de combustible",          emoji: "🛢️", bin: "peligrosos", reason: "Bidones de combustible son PELIGROSOS: tacho ROJO." },
  { id: "quimicos",   name: "Aditivos químicos",               emoji: "🧪", bin: "peligrosos", reason: "Los aditivos químicos son PELIGROSOS: tacho ROJO." },
  { id: "senaliz",    name: "Señalización en mal estado",      emoji: "🚧", bin: "noaprov",    reason: "La señalización deteriorada va al tacho NEGRO." },
  { id: "botresid",   name: "Botellas con residuos",           emoji: "🍶", bin: "noaprov",    reason: "Botellas contaminadas van al tacho NEGRO." },
  { id: "tecnopor",   name: "Tecnopor",                        emoji: "🧊", bin: "noaprov",    reason: "El tecnopor va al tacho NEGRO." },
  { id: "eppsdet",    name: "EPPs deteriorados",               emoji: "🥾", bin: "noaprov",    reason: "EPPs deteriorados van al tacho NEGRO.\n⚠️ Recuerda: entrega los EPPs rotos o en mal estado al almacén para su reposición y disposición." },
  { id: "lentesrot",  name: "Lentes de seguridad rotos",       emoji: "🥽", bin: "noaprov",    reason: "Lentes rotos van al tacho NEGRO.\n⚠️ Recuerda: entrega los lentes dañados al almacén para su reposición y disposición." },
  { id: "cascodet",   name: "Casco deteriorado",               emoji: "⛑️", bin: "noaprov",    reason: "El casco deteriorado va al tacho NEGRO.\n⚠️ Recuerda: entrega los cascos dañados al almacén para su reposición y disposición." },
  { id: "arnesdet",   name: "Arnés deteriorado",               emoji: "🦺", bin: "noaprov",    reason: "El arnés deteriorado va al tacho NEGRO.\n⚠️ Recuerda: entrega los arneses dañados al almacén para su reposición y disposición." },
  { id: "frutas",     name: "Restos de frutas",                emoji: "🍌", bin: "organicos",  reason: "Los restos de frutas son orgánicos: van al tacho MARRÓN." },
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

// Muñequitos — imágenes reales CMEJIA sin fondo
function Mascot({ type = "male", size = 220 }) {
  const src = type === "female" ? "/mascot-female.jpg" : "/mascot-male.jpg";
  return (
    <img src={src} alt="Trabajador CMEJIA"
      style={{ height: size, width: "auto", objectFit: "contain", display: "block",
        filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.18))",
        mixBlendMode: "multiply",  // elimina fondo blanco sobre bg claro
      }} />
  );
}

function Logo({ scale = 1 }) {
  return (
    <img src="/logo-cmejia.jpg" alt="CMEJIA S.A.C."
      style={{ height: 48 * scale, width: "auto", objectFit: "contain", display: "block" }} />
  );
}

// Tacho cilindro — grande y fácil de tocar
function Bin({ bin, onPick, answered, item }) {
  let glow = {};
  if (answered) {
    if (bin.id === item.bin) glow = { boxShadow: "0 0 0 5px #16a34a", transform: "scale(1.06)" };
    else if (bin.id === answered.chosen && !answered.correct) glow = { boxShadow: "0 0 0 5px #dc2626" };
  }
  const light = bin.text === "#fff";
  return (
    <button onClick={() => onPick(bin.id)} disabled={!!answered}
      style={{ cursor: answered ? "default" : "pointer", transition: "transform 0.15s, box-shadow 0.15s", padding: 0, background: "none", border: "none" }}
      className="flex flex-col items-center w-full active:scale-95">
      {/* Tapa */}
      <div style={{ width: "84%", height: 13, borderRadius: "50%", background: bin.lid, marginBottom: -6, position: "relative", zIndex: 1, boxShadow: "0 2px 4px rgba(0,0,0,0.25)" }} />
      {/* Cuerpo */}
      <div className="w-full flex flex-col items-center rounded-b-2xl"
        style={{
          background: bin.color, color: bin.text,
          border: bin.border ? `2px solid ${bin.border}` : "none",
          padding: "14px 6px 12px",
          boxShadow: answered && bin.id === item.bin ? "0 0 0 5px #16a34a" : answered && bin.id === answered.chosen && !answered.correct ? "0 0 0 5px #dc2626" : "0 4px 10px rgba(0,0,0,0.22)",
          ...glow,
        }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>♻️</span>
        <span className="font-black text-center leading-tight mt-1" style={{ fontSize: 13, letterSpacing: 0.2, textTransform: "uppercase", lineHeight: 1.2 }}>{bin.name}</span>
        <span className="mt-1 rounded-full px-2 py-0.5 font-bold" style={{ fontSize: 11, background: light ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.12)" }}>{bin.short}</span>
      </div>
    </button>
  );
}

function Chip({ bin }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 font-bold"
      style={{ background: bin.color, color: bin.text, border: bin.border ? `2px solid ${bin.border}` : "none", fontSize: 13 }}>
      ♻️ {bin.name}
    </span>
  );
}

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
    saveResult({ name: nameRef.current, score: scoreRef.current, correct: correctRef.current, total: orderRef.current.length, timeSec: Math.round(t), date: new Date().toISOString() });
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
      setTimeout(() => advance(), 1000);
    } else {
      setStreak(0);
      setMistakes((m) => [...m, item]);
    }
  }

  function openRanking() {
    setScreen("ranking"); setConfirmClear(false); setBoardLoading(true);
    try { setBoard(JSON.parse(localStorage.getItem(STORE_KEY) || "[]")); }
    catch (e) { setBoard([]); }
    setBoardLoading(false);
  }

  function clearBoard() { localStorage.removeItem(STORE_KEY); setBoard([]); setConfirmClear(false); }

  const sortedBoard = [...board].sort((a, b) => b.score - a.score || a.timeSec - b.timeSec);

  function buildCSV() {
    const lines = [["Puesto","Nombre","Puntos","Aciertos","Total","Precision","Tiempo","Fecha"].join(",")];
    sortedBoard.forEach((r, i) => lines.push([i+1,`"${r.name}"`,r.score,r.correct,r.total,Math.round((r.correct/r.total)*100)+"%",formatTime(r.timeSec),`"${new Date(r.date).toLocaleString("es-PE")}"`].join(",")));
    return lines.join("\n");
  }
  async function copyCSV() {
    try { await navigator.clipboard.writeText(buildCSV()); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (e) {}
  }
  function downloadCSV() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([buildCSV()], { type: "text/csv;charset=utf-8;" }));
    a.download = "ranking_segregacion_cmejia.csv";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  const wrap = {
    minHeight: "100vh",
    background: "linear-gradient(160deg,#dbeeff 0%,#e8f4fb 50%,#d6eaf8 100%)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  };

  // ── INICIO ───────────────────────────────────────────────────────
  if (screen === "start") return (
    <div style={wrap}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.10)", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ background: NAVY, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Logo scale={1} />
            <span style={{ background: BLUE, color: "#fff", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 700 }}>Medio Ambiente</span>
          </div>

          {/* Hero con muñequita grande */}
          <div style={{ background: "linear-gradient(135deg,#eaf6fd,#f0f8ff)", padding: "24px 20px 16px", display: "flex", alignItems: "flex-end", gap: 16 }}>
            <div style={{ flexShrink: 0 }}>
              <Mascot type="female" size={200} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 36, lineHeight: 1 }}>♻️</div>
              <h1 style={{ color: NAVY, fontSize: 28, fontWeight: 900, lineHeight: 1.1, margin: "8px 0 6px" }}>
                ¿A dónde va el residuo?
              </h1>
              <p style={{ color: BLUE, fontSize: 14, fontWeight: 700, margin: 0 }}>
                NTP 900.058:2019
              </p>
              <div style={{ background: "#fff", border: `2px solid ${BLUE}`, borderRadius: 14, padding: "12px 14px", marginTop: 12 }}>
                <p style={{ margin: 0, fontSize: 15, color: "#1a1a1a", lineHeight: 1.4 }}>
                  ¡Hola! Toca el <b style={{ color: BLUE }}>tacho del color correcto</b> para cada residuo. ¡Rápido y sin fallar! 💪
                </p>
              </div>
            </div>
          </div>

          <div style={{ padding: "0 20px 24px" }}>
            {/* Nombre */}
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 17, fontWeight: 800, color: NAVY, display: "block", marginBottom: 8 }}>
                👷 Tu nombre
              </label>
              <input type="text" value={playerName}
                onChange={(e) => { setPlayerName(e.target.value); if (nameError) setNameError(false); }}
                onKeyDown={(e) => { if (e.key === "Enter") startGame(); }}
                placeholder="Ej. Juan Pérez" maxLength={40}
                style={{
                  width: "100%", padding: "16px 18px", fontSize: 18, borderRadius: 14,
                  border: `3px solid ${nameError ? "#dc2626" : "#d1d5db"}`,
                  outline: "none", boxSizing: "border-box", fontWeight: 600,
                }} />
              {nameError && <p style={{ color: "#dc2626", fontSize: 14, marginTop: 6, fontWeight: 600 }}>⚠️ Escribe tu nombre para empezar.</p>}
            </div>

            {/* Los 7 tachos */}
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#666", textAlign: "center", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Los 7 tachos</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {BINS.map((b) => <Chip key={b.id} bin={b} />)}
              </div>
            </div>

            {/* Botones */}
            <button onClick={startGame} style={{
              width: "100%", marginTop: 24, padding: "20px", background: BLUE, color: "#fff",
              border: "none", borderRadius: 16, fontSize: 20, fontWeight: 900, cursor: "pointer",
              boxShadow: "0 6px 20px rgba(27,157,217,0.4)", letterSpacing: 0.5,
            }}>▶ INICIAR JUEGO</button>

            <button onClick={openRanking} style={{
              width: "100%", marginTop: 12, padding: "16px", background: "#eef2f7", color: NAVY,
              border: "none", borderRadius: 16, fontSize: 17, fontWeight: 800, cursor: "pointer",
            }}>🏆 Ver ranking</button>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "#888", marginTop: 16 }}>
          C. MEJÍA S.A.C. · Tu compromiso es indispensable
        </p>
      </div>
    </div>
  );

  // ── RANKING ──────────────────────────────────────────────────────
  if (screen === "ranking") return (
    <div style={wrap}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.10)", overflow: "hidden" }}>
          <div style={{ background: NAVY, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Logo scale={0.9} />
            <span style={{ color: "#fff", fontSize: 22, fontWeight: 900 }}>🏆 Ranking</span>
          </div>
          <div style={{ padding: "20px" }}>
            {boardLoading ? <p style={{ textAlign: "center", color: "#888", padding: 40 }}>Cargando…</p>
              : sortedBoard.length === 0 ? <p style={{ textAlign: "center", color: "#888", padding: 40, fontSize: 16 }}>Aún no hay resultados. ¡Sé el primero!</p>
              : <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                  {sortedBoard.map((r, i) => {
                    const acc = Math.round((r.correct / r.total) * 100);
                    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i+1}`;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: i < 3 ? "#eaf6fd" : "#f8fafc", borderRadius: 14, padding: "12px 16px" }}>
                        <div style={{ width: 36, textAlign: "center", fontSize: i < 3 ? 24 : 16, fontWeight: 900, color: NAVY }}>{medal}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: 16, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
                          <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>✅ {acc}% · ⏱️ {formatTime(r.timeSec)} · {fmtDate(r.date)}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 22, fontWeight: 900, color: BLUE }}>{r.score}</div>
                          <div style={{ fontSize: 12, color: "#aaa" }}>pts</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
            }
            {sortedBoard.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
                <button onClick={copyCSV} style={{ padding: "12px 18px", background: NAVY, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{copied ? "✓ Copiado" : "📋 Copiar CSV"}</button>
                <button onClick={downloadCSV} style={{ padding: "12px 18px", background: "#eef2f7", color: NAVY, border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>⬇️ Descargar CSV</button>
                {!confirmClear
                  ? <button onClick={() => setConfirmClear(true)} style={{ padding: "12px 18px", background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>🗑️ Limpiar</button>
                  : <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, color: "#666" }}>¿Borrar todo?</span>
                      <button onClick={clearBoard} style={{ padding: "10px 16px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>Sí</button>
                      <button onClick={() => setConfirmClear(false)} style={{ padding: "10px 16px", background: "#e5e7eb", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>No</button>
                    </div>
                }
              </div>
            )}
            <button onClick={() => setScreen("start")} style={{ width: "100%", marginTop: 20, padding: "16px", background: BLUE, color: "#fff", border: "none", borderRadius: 14, fontSize: 17, fontWeight: 800, cursor: "pointer" }}>← Volver</button>
          </div>
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
    else if (acc >= 50) { rating = "Sigue practicando"; emo = "💪"; }
    else { rating = "A reforzar la segregación"; emo = "📚"; }
    return (
      <div style={wrap}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.10)", overflow: "hidden" }}>
            <div style={{ background: NAVY, padding: "16px 20px" }}><Logo /></div>
            <div style={{ padding: "24px 20px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <Mascot type={acc >= 70 ? "female" : "male"} size={180} />
                <div style={{ fontSize: 52 }}>{emo}</div>
                <h2 style={{ color: NAVY, fontSize: 26, fontWeight: 900, textAlign: "center", margin: 0 }}>{rating}</h2>
                <p style={{ color: "#666", fontSize: 16, margin: 0 }}>{nameRef.current}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginTop: 24 }}>
                {[
                  { val: score, label: "Puntos" },
                  { val: `${correctCount}/${total}`, label: "Aciertos" },
                  { val: `${acc}%`, label: "Precisión" },
                  { val: `⏱️${formatTime(finalTime)}`, label: "Tiempo" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#f0f9ff", borderRadius: 14, padding: "14px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: BLUE }}>{s.val}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#666", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <p style={{ textAlign: "center", fontSize: 15, color: "#666", marginTop: 10 }}>Mejor racha: 🔥 {bestStreak}</p>

              {mistakes.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <p style={{ fontWeight: 800, fontSize: 16, color: NAVY, marginBottom: 10 }}>📋 Para repasar:</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {mistakes.map((m, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fef9f0", borderRadius: 12, padding: "12px 14px", border: "1px solid #fde68a" }}>
                        <span style={{ fontSize: 16, fontWeight: 700 }}>{m.emoji} {m.name}</span>
                        <Chip bin={BIN_BY_ID[m.bin]} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
                <button onClick={startGame} style={{ flex: 1, minWidth: 120, padding: "18px", background: BLUE, color: "#fff", border: "none", borderRadius: 14, fontSize: 17, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 14px rgba(27,157,217,0.35)" }}>🔄 Jugar de nuevo</button>
                <button onClick={openRanking} style={{ padding: "18px 20px", background: NAVY, color: "#fff", border: "none", borderRadius: 14, fontSize: 17, fontWeight: 800, cursor: "pointer" }}>🏆</button>
                <button onClick={() => setScreen("start")} style={{ padding: "18px 20px", background: "#e5e7eb", color: "#374151", border: "none", borderRadius: 14, fontSize: 17, fontWeight: 800, cursor: "pointer" }}>🏠</button>
              </div>
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
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "12px 12px 24px" }}>
        {/* Header */}
        <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <Logo scale={0.85} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ background: NAVY, borderRadius: 12, padding: "8px 14px", textAlign: "center" }}>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: 18, lineHeight: 1 }}>⏱️ {formatTime(elapsed)}</div>
              <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 600 }}>Tiempo</div>
            </div>
            <div style={{ background: "#f0f9ff", borderRadius: 12, padding: "8px 14px", textAlign: "center" }}>
              <div style={{ color: BLUE, fontWeight: 900, fontSize: 18, lineHeight: 1 }}>{score}</div>
              <div style={{ color: "#666", fontSize: 11, fontWeight: 600 }}>Puntos</div>
            </div>
            <div style={{ background: "#fff7ed", borderRadius: 12, padding: "8px 14px", textAlign: "center" }}>
              <div style={{ color: "#f97316", fontWeight: 900, fontSize: 18, lineHeight: 1 }}>🔥 {streak}</div>
              <div style={{ color: "#666", fontSize: 11, fontWeight: 600 }}>Racha</div>
            </div>
          </div>
        </div>

        {/* Progreso */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: "#555", marginBottom: 6 }}>
            <span>Residuo {idx + 1} de {order.length}</span>
            <span>✅ Aciertos: {correctCount}</span>
          </div>
          <div style={{ background: "#d1d5db", borderRadius: 8, height: 10, overflow: "hidden" }}>
            <div style={{ width: `${((idx + 1) / order.length) * 100}%`, background: BLUE, height: "100%", borderRadius: 8, transition: "width 0.4s" }} />
          </div>
        </div>

        {/* Tarjeta residuo */}
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 6px 24px rgba(0,0,0,0.09)", padding: "20px 16px", marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flexShrink: 0 }}>
            <Mascot type="male" size={110} />
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#666", margin: "0 0 4px" }}>¿A qué tacho va este residuo?</p>
            <div style={{ fontSize: 80, lineHeight: 1, margin: "8px 0" }}>{item.emoji}</div>
            <h2 style={{ color: NAVY, fontSize: 22, fontWeight: 900, margin: 0, lineHeight: 1.2 }}>{item.name}</h2>
          </div>
        </div>

        {/* Feedback */}
        <div style={{ minHeight: 72, marginTop: 12 }}>
          {answered && answered.correct && (
            <div style={{ background: "#16a34a", borderRadius: 16, padding: "16px 20px", textAlign: "center", color: "#fff", fontSize: 18, fontWeight: 900 }}>
              ✅ ¡Correcto! +{lastGain} pts
            </div>
          )}
          {answered && !answered.correct && (
            <div style={{ background: "#fef2f2", border: "2px solid #fca5a5", borderRadius: 16, padding: "16px 20px" }}>
              <p style={{ color: "#dc2626", fontWeight: 900, fontSize: 17, margin: "0 0 6px" }}>
                ❌ Va en el tacho <span style={{ textTransform: "uppercase" }}>{correctBin.name}</span> ({correctBin.short})
              </p>
              {item.reason.split("\n").map((line, i) => (
                <p key={i} style={{ color: "#374151", fontSize: 15, margin: "4px 0", fontWeight: i === 0 ? 600 : 700 }}>{line}</p>
              ))}
              <button onClick={advance} style={{ marginTop: 12, padding: "14px 28px", background: NAVY, color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
                Siguiente ▶
              </button>
            </div>
          )}
        </div>

        {/* Tachos */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 14 }}>
          {BINS.slice(0, 4).map((b) => <Bin key={b.id} bin={b} onPick={handlePick} answered={answered} item={item} />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 10 }}>
          {BINS.slice(4).map((b) => <Bin key={b.id} bin={b} onPick={handlePick} answered={answered} item={item} />)}
        </div>
      </div>
    </div>
  );
}