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

const MSG_EPP = "⚠️ IMPORTANTE: Los EPPs en mal estado o rotos NO van a la basura común. Entrégalos al almacenero o administrador para su correcta disposición y reposición inmediata.";

const ITEMS = [
  { id: "carton",     name: "Cartones",                       emoji: "📦", bin: "papel",      reason: "Los cartones son reciclables → tacho AZUL." },
  { id: "papel",      name: "Papeles",                        emoji: "📄", bin: "papel",      reason: "Todo papel limpio → tacho AZUL." },
  { id: "planos",     name: "Impresión de planos",            emoji: "📐", bin: "papel",      reason: "Los planos impresos son papel → tacho AZUL." },
  { id: "folder",     name: "Folders",                        emoji: "🗂️", bin: "papel",      reason: "Los folders de papel → tacho AZUL." },
  { id: "clavos",     name: "Clavos",                         emoji: "📌", bin: "metalicos",  reason: "Los clavos son metálicos → tacho AMARILLO." },
  { id: "fierros",    name: "Retazos de fierros",             emoji: "🔧", bin: "metalicos",  reason: "Los retazos de fierro → tacho AMARILLO." },
  { id: "pernos",     name: "Pernos",                         emoji: "🔩", bin: "metalicos",  reason: "Los pernos son metálicos → tacho AMARILLO." },
  { id: "envmetal",   name: "Envases metálicos limpios",      emoji: "🥫", bin: "metalicos",  reason: "Envases metálicos limpios → tacho AMARILLO." },
  { id: "botgaseosa", name: "Botella de gaseosa limpia",      emoji: "🥤", bin: "plasticos",  reason: "Botellas de plástico limpias → tacho BLANCO." },
  { id: "botagua",    name: "Botella de agua limpia",         emoji: "💧", bin: "plasticos",  reason: "Botellas de agua limpias → tacho BLANCO." },
  { id: "vidrio",     name: "Vidrio",                         emoji: "🪟", bin: "vidrios",    reason: "Todo vidrio, limpio o roto → tacho PLOMO." },
  { id: "guantes",    name: "Guantes con aceite",             emoji: "🧤", bin: "peligrosos", reason: "Guantes con aceite → PELIGROSO → tacho ROJO." },
  { id: "tyvek",      name: "Tyvek contaminado",              emoji: "🦺", bin: "peligrosos", reason: "Tyvek contaminado → PELIGROSO → tacho ROJO." },
  { id: "cinta",      name: "Cinta con restos de cemento",    emoji: "🎗️", bin: "peligrosos", reason: "Cinta con cemento → PELIGROSA → tacho ROJO." },
  { id: "baldepint",  name: "Baldes de pintura",              emoji: "🪣", bin: "peligrosos", reason: "Baldes de pintura → PELIGROSOS → tacho ROJO." },
  { id: "madera",     name: "Madera con restos de concreto",  emoji: "🪵", bin: "peligrosos", reason: "Madera con concreto → PELIGROSA → tacho ROJO." },
  { id: "pilas",      name: "Pilas / baterías",               emoji: "🔋", bin: "peligrosos", reason: "Pilas y baterías → PELIGROSAS → tacho ROJO." },
  { id: "bidon",      name: "Bidones de combustible",         emoji: "🛢️", bin: "peligrosos", reason: "Bidones de combustible → PELIGROSOS → tacho ROJO." },
  { id: "quimicos",   name: "Aditivos químicos",              emoji: "🧪", bin: "peligrosos", reason: "Aditivos químicos → PELIGROSOS → tacho ROJO." },
  { id: "senaliz",    name: "Señalización en mal estado",     emoji: "🚧", bin: "noaprov",    reason: "Señalización deteriorada → tacho NEGRO." },
  { id: "botresid",   name: "Botellas con residuos",          emoji: "🍶", bin: "noaprov",    reason: "Botellas contaminadas → tacho NEGRO." },
  { id: "tecnopor",   name: "Tecnopor",                       emoji: "🧊", bin: "noaprov",    reason: "El tecnopor → tacho NEGRO." },
  { id: "eppsdet",    name: "EPPs deteriorados",              emoji: "🥾", bin: "noaprov",    reason: `EPPs deteriorados → tacho NEGRO.\n${MSG_EPP}` },
  { id: "lentesrot",  name: "Lentes de seguridad rotos",      emoji: "🥽", bin: "noaprov",    reason: `Lentes rotos → tacho NEGRO.\n${MSG_EPP}` },
  { id: "cascodet",   name: "Casco deteriorado",              emoji: "⛑️", bin: "noaprov",    reason: `Casco deteriorado → tacho NEGRO.\n${MSG_EPP}` },
  { id: "arnesdet",   name: "Arnés deteriorado",              emoji: "🦺", bin: "noaprov",    reason: `Arnés deteriorado → tacho NEGRO.\n${MSG_EPP}` },
  { id: "frutas",     name: "Restos de frutas",               emoji: "🍌", bin: "organicos",  reason: "Restos de frutas → orgánicos → tacho MARRÓN." },
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

// ── Música Web Audio API ─────────────────────────────────────────
function useGameMusic() {
  const ctxRef = useRef(null);
  const playingRef = useRef(false);
  const timeoutRef = useRef(null);

  const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
  const melody = [0,2,4,2,4,5,4,2,0,2,1,0,2,4,7,5,4,2,4,2,0];
  const bass   = [0,0,4,4,3,3,2,2,0,0,4,4,3,3,2,2];

  function playNote(ctx, master, freq, start, dur, vol, type) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(vol, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }

  function start() {
    if (playingRef.current) return;
    playingRef.current = true;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = 0.15;
    master.connect(ctx.destination);

    const bpm = 88, beat = 60 / bpm;

    function scheduleLoop(t) {
      if (!playingRef.current) return;
      const loopLen = melody.length * beat * 0.5;
      melody.forEach((n, i) => playNote(ctx, master, notes[n] * 2, t + i * beat * 0.5, beat * 0.45, 0.3, "sine"));
      bass.forEach((n, i) => playNote(ctx, master, notes[n] * 0.5, t + i * beat, beat * 0.7, 0.2, "triangle"));
      [0, 2, 4].forEach(n => {
        playNote(ctx, master, notes[n], t, loopLen * 0.48, 0.07, "sine");
        playNote(ctx, master, notes[n] * 2, t + loopLen * 0.5, loopLen * 0.48, 0.07, "sine");
      });
      const delay = Math.max((loopLen - 0.5) * 1000, 100);
      timeoutRef.current = setTimeout(() => scheduleLoop(t + loopLen), delay);
    }

    scheduleLoop(ctx.currentTime + 0.1);
  }

  function stop() {
    playingRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    try { ctxRef.current && ctxRef.current.close(); } catch (e) {}
    ctxRef.current = null;
  }

  return { start, stop };
}

// ── Muñequito ────────────────────────────────────────────────────
function Mascot({ type = "male", size = 220 }) {
  const src = type === "female" ? "/mascot-female.jpg" : "/mascot-male.jpg";
  return (
    <div style={{
      background: "linear-gradient(160deg,#eaf6fd,#f0f8ff)",
      borderRadius: 24, padding: "12px 16px 0",
      boxShadow: "0 4px 16px rgba(27,157,217,0.13)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      overflow: "hidden",
    }}>
      <img src={src} alt="Trabajador CMEJIA"
        style={{ height: size, width: "auto", objectFit: "contain", display: "block" }} />
    </div>
  );
}

// ── Logo ─────────────────────────────────────────────────────────
function Logo({ scale = 1 }) {
  return (
    <img src="/logo-cmejia.jpg" alt="CMEJIA S.A.C."
      style={{ height: 52 * scale, width: "auto", objectFit: "contain", display: "block" }} />
  );
}

// ── Tacho cilindro ───────────────────────────────────────────────
function Bin({ bin, onPick, answered, item }) {
  let shadow = "0 4px 10px rgba(0,0,0,0.22)";
  let transform = "none";
  if (answered) {
    if (bin.id === item.bin) { shadow = "0 0 0 5px #16a34a"; transform = "scale(1.06)"; }
    else if (bin.id === answered.chosen && !answered.correct) shadow = "0 0 0 5px #dc2626";
  }
  return (
    <button onClick={() => onPick(bin.id)} disabled={!!answered}
      style={{ cursor: answered ? "default" : "pointer", padding: 0, background: "none", border: "none", transition: "transform 0.15s" }}
      className="flex flex-col items-center w-full active:scale-95">
      <div style={{ width: "84%", height: 13, borderRadius: "50%", background: bin.lid, marginBottom: -6, position: "relative", zIndex: 1, boxShadow: "0 2px 4px rgba(0,0,0,0.25)" }} />
      <div className="w-full flex flex-col items-center rounded-b-2xl"
        style={{ background: bin.color, color: bin.text, border: bin.border ? `2px solid ${bin.border}` : "none",
          padding: "14px 6px 14px", boxShadow: shadow, transform }}>
        <span style={{ fontSize: 30, lineHeight: 1 }}>♻️</span>
        <span style={{ fontSize: 13, fontWeight: 900, textAlign: "center", textTransform: "uppercase", lineHeight: 1.2, marginTop: 6 }}>{bin.name}</span>
        <span style={{ fontSize: 11, fontWeight: 700, marginTop: 4, background: bin.text === "#fff" ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.12)", borderRadius: 20, padding: "2px 8px" }}>{bin.short}</span>
      </div>
    </button>
  );
}

// ── Chip ─────────────────────────────────────────────────────────
function Chip({ bin }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 20, padding: "6px 14px", fontWeight: 700, fontSize: 13, background: bin.color, color: bin.text, border: bin.border ? `2px solid ${bin.border}` : "none" }}>
      ♻️ {bin.name}
    </span>
  );
}

// ── App ──────────────────────────────────────────────────────────
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
  const [musicOn, setMusicOn] = useState(true);

  const startRef = useRef(null);
  const tickRef = useRef(null);
  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const nameRef = useRef("");
  const orderRef = useRef([]);
  const STORE_KEY = "cmejia_ranking_v1";
  const music = useGameMusic();

  function stopTick() { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; } }
  useEffect(() => () => { stopTick(); music.stop(); }, []);

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
    if (musicOn) { music.stop(); music.start(); }
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
    stopTick(); music.stop();
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
      const isEPP = item.reason.includes("almacenero");
      setTimeout(() => advance(), isEPP ? 4500 : 1200);
    } else {
      setStreak(0);
      setMistakes((m) => [...m, item]);
    }
  }

  function toggleMusic() {
    const next = !musicOn;
    setMusicOn(next);
    if (next) music.start(); else music.stop();
  }

  function openRanking() {
    setScreen("ranking"); setConfirmClear(false); setBoardLoading(true);
    try { setBoard(JSON.parse(localStorage.getItem(STORE_KEY) || "[]")); } catch (e) { setBoard([]); }
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

  const wrap = { minHeight: "100vh", background: "linear-gradient(160deg,#dbeeff 0%,#e8f4fb 50%,#d6eaf8 100%)" };

  // ── INICIO ──────────────────────────────────────────────────────
  if (screen === "start") return (
    <div style={wrap}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.10)", overflow: "hidden" }}>
          <div style={{ background: NAVY, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Logo scale={1} />
            <span style={{ background: BLUE, color: "#fff", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 700 }}>Medio Ambiente</span>
          </div>
          <div style={{ background: "linear-gradient(135deg,#eaf6fd,#f0f8ff)", padding: "24px 20px 8px", display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flexShrink: 0 }}>
              <Mascot type="female" size={210} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 40 }}>♻️</div>
              <h1 style={{ color: NAVY, fontSize: 30, fontWeight: 900, lineHeight: 1.1, margin: "6px 0 4px" }}>¿A dónde va el residuo?</h1>
              <p style={{ color: BLUE, fontSize: 14, fontWeight: 700, margin: "0 0 10px" }}>Segregación de residuos · NTP 900.058:2019</p>
              <div style={{ background: "#fff", border: `2px solid ${BLUE}`, borderRadius: 14, padding: "12px 14px" }}>
                <p style={{ margin: 0, fontSize: 15, color: "#1a1a1a", lineHeight: 1.5 }}>
                  ¡Hola! Toca el <b style={{ color: BLUE }}>tacho del color correcto</b> para cada residuo. ¡Rápido y sin fallar! 💪
                </p>
              </div>
            </div>
          </div>
          <div style={{ padding: "16px 20px 28px" }}>
            <div style={{ marginTop: 8 }}>
              <label style={{ fontSize: 18, fontWeight: 800, color: NAVY, display: "block", marginBottom: 8 }}>👷 Tu nombre</label>
              <input type="text" value={playerName}
                onChange={(e) => { setPlayerName(e.target.value); if (nameError) setNameError(false); }}
                onKeyDown={(e) => { if (e.key === "Enter") startGame(); }}
                placeholder="Ej. Juan Pérez" maxLength={40}
                style={{ width: "100%", padding: "16px 18px", fontSize: 18, borderRadius: 14, border: `3px solid ${nameError ? "#dc2626" : "#d1d5db"}`, outline: "none", boxSizing: "border-box", fontWeight: 600 }} />
              {nameError && <p style={{ color: "#dc2626", fontSize: 14, marginTop: 6, fontWeight: 700 }}>⚠️ Escribe tu nombre para empezar.</p>}
            </div>
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#777", textAlign: "center", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Los 7 tachos</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {BINS.map((b) => <Chip key={b.id} bin={b} />)}
              </div>
            </div>
            <button onClick={startGame} style={{ width: "100%", marginTop: 24, padding: "20px", background: BLUE, color: "#fff", border: "none", borderRadius: 16, fontSize: 20, fontWeight: 900, cursor: "pointer", boxShadow: "0 6px 20px rgba(27,157,217,0.4)" }}>
              ▶ INICIAR JUEGO
            </button>
            <button onClick={openRanking} style={{ width: "100%", marginTop: 12, padding: "16px", background: "#eef2f7", color: NAVY, border: "none", borderRadius: 16, fontSize: 17, fontWeight: 800, cursor: "pointer" }}>
              🏆 Ver ranking
            </button>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "#888", marginTop: 14 }}>C. MEJÍA S.A.C. · Tu compromiso es indispensable</p>
      </div>
    </div>
  );

  // ── RANKING ──────────────────────────────────────────────────────
  if (screen === "ranking") return (
    <div style={wrap}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.10)", overflow: "hidden" }}>
          <div style={{ background: NAVY, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Logo scale={0.85} />
            <span style={{ color: "#fff", fontSize: 22, fontWeight: 900 }}>🏆 Ranking</span>
          </div>
          <div style={{ padding: "20px" }}>
            {boardLoading ? <p style={{ textAlign: "center", color: "#888", padding: 40 }}>Cargando…</p>
              : sortedBoard.length === 0 ? <p style={{ textAlign: "center", color: "#888", padding: 40, fontSize: 16 }}>Aún no hay resultados. ¡Sé el primero!</p>
              : <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                  {sortedBoard.map((r, i) => {
                    const acc = Math.round((r.correct / r.total) * 100);
                    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: i < 3 ? "#eaf6fd" : "#f8fafc", borderRadius: 14, padding: "14px 16px" }}>
                        <div style={{ width: 36, textAlign: "center", fontSize: i < 3 ? 26 : 16, fontWeight: 900, color: NAVY }}>{medal}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: 17, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
                          <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>✅ {acc}% · ⏱️ {formatTime(r.timeSec)} · {fmtDate(r.date)}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 24, fontWeight: 900, color: BLUE }}>{r.score}</div>
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
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px" }}>
          <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.10)", overflow: "hidden" }}>
            <div style={{ background: NAVY, padding: "14px 20px" }}><Logo /></div>
            <div style={{ padding: "24px 20px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <Mascot type={acc >= 70 ? "female" : "male"} size={200} />
                <div style={{ fontSize: 56 }}>{emo}</div>
                <h2 style={{ color: NAVY, fontSize: 28, fontWeight: 900, textAlign: "center", margin: 0 }}>{rating}</h2>
                <p style={{ color: "#666", fontSize: 17, margin: "4px 0 0" }}>{nameRef.current}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginTop: 24 }}>
                {[{ val: score, label: "Puntos" }, { val: `${correctCount}/${total}`, label: "Aciertos" }, { val: `${acc}%`, label: "Precisión" }, { val: formatTime(finalTime), label: "Tiempo" }].map((s, i) => (
                  <div key={i} style={{ background: "#f0f9ff", borderRadius: 14, padding: "14px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: BLUE }}>{s.val}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#666", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <p style={{ textAlign: "center", fontSize: 15, color: "#666", marginTop: 10 }}>Mejor racha: 🔥 {bestStreak}</p>
              {mistakes.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <p style={{ fontWeight: 800, fontSize: 17, color: NAVY, marginBottom: 10 }}>📋 Para repasar:</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {mistakes.map((m, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fef9f0", borderRadius: 12, padding: "12px 14px", border: "1px solid #fde68a", flexWrap: "wrap", gap: 8 }}>
                        <span style={{ fontSize: 16, fontWeight: 700 }}>{m.emoji} {m.name}</span>
                        <Chip bin={BIN_BY_ID[m.bin]} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
                <button onClick={startGame} style={{ flex: 1, minWidth: 140, padding: "18px", background: BLUE, color: "#fff", border: "none", borderRadius: 14, fontSize: 18, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 14px rgba(27,157,217,0.35)" }}>🔄 Jugar de nuevo</button>
                <button onClick={openRanking} style={{ padding: "18px 22px", background: NAVY, color: "#fff", border: "none", borderRadius: 14, fontSize: 20, cursor: "pointer" }}>🏆</button>
                <button onClick={() => setScreen("start")} style={{ padding: "18px 22px", background: "#e5e7eb", color: "#374151", border: "none", borderRadius: 14, fontSize: 20, cursor: "pointer" }}>🏠</button>
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
  const lines = item.reason.split("\n");
  const hasEPP = lines.length > 1;

  return (
    <div style={wrap}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "12px 12px 28px" }}>
        {/* Header */}
        <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <Logo scale={0.85} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={toggleMusic} style={{ background: musicOn ? "#f0fdf4" : "#f3f4f6", border: `2px solid ${musicOn ? "#16a34a" : "#d1d5db"}`, borderRadius: 12, padding: "8px 12px", fontSize: 20, cursor: "pointer" }}>
              {musicOn ? "🔊" : "🔇"}
            </button>
            <div style={{ background: NAVY, borderRadius: 12, padding: "8px 14px", textAlign: "center", minWidth: 80 }}>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: 20, lineHeight: 1 }}>⏱️ {formatTime(elapsed)}</div>
              <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 600 }}>Tiempo</div>
            </div>
            <div style={{ background: "#f0f9ff", borderRadius: 12, padding: "8px 14px", textAlign: "center", minWidth: 60 }}>
              <div style={{ color: BLUE, fontWeight: 900, fontSize: 20, lineHeight: 1 }}>{score}</div>
              <div style={{ color: "#666", fontSize: 11, fontWeight: 600 }}>Puntos</div>
            </div>
            <div style={{ background: "#fff7ed", borderRadius: 12, padding: "8px 14px", textAlign: "center", minWidth: 60 }}>
              <div style={{ color: "#f97316", fontWeight: 900, fontSize: 20, lineHeight: 1 }}>🔥 {streak}</div>
              <div style={{ color: "#666", fontSize: 11, fontWeight: 600 }}>Racha</div>
            </div>
          </div>
        </div>

        {/* Progreso */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: "#444", marginBottom: 6 }}>
            <span>Residuo {idx + 1} de {order.length}</span>
            <span>✅ Aciertos: {correctCount}</span>
          </div>
          <div style={{ background: "#d1d5db", borderRadius: 8, height: 12, overflow: "hidden" }}>
            <div style={{ width: `${((idx + 1) / order.length) * 100}%`, background: BLUE, height: "100%", borderRadius: 8, transition: "width 0.4s" }} />
          </div>
        </div>

        {/* Tarjeta residuo */}
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 6px 24px rgba(0,0,0,0.09)", padding: "20px 16px", marginTop: 14, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flexShrink: 0 }}>
            <Mascot type="male" size={130} />
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#666", margin: "0 0 6px" }}>¿A qué tacho va este residuo?</p>
            <div style={{ fontSize: 88, lineHeight: 1, margin: "8px 0" }}>{item.emoji}</div>
            <h2 style={{ color: NAVY, fontSize: 26, fontWeight: 900, margin: 0, lineHeight: 1.2 }}>{item.name}</h2>
          </div>
        </div>

        {/* Feedback */}
        <div style={{ minHeight: 80, marginTop: 14 }}>
          {answered && answered.correct && (
            <div>
              <div style={{ background: "#16a34a", borderRadius: 16, padding: "18px 20px", textAlign: "center", color: "#fff", fontSize: 20, fontWeight: 900 }}>
                ✅ ¡Correcto! +{lastGain} pts
              </div>
              {hasEPP && (
                <div style={{ marginTop: 10, background: "#fffbeb", border: "3px solid #f59e0b", borderRadius: 14, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>⚠️</span>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#92400e", lineHeight: 1.6 }}>{lines[1]}</p>
                </div>
              )}
            </div>
          )}
          {answered && !answered.correct && (
            <div style={{ background: "#fef2f2", border: "2px solid #fca5a5", borderRadius: 16, padding: "16px 20px" }}>
              <p style={{ color: "#dc2626", fontWeight: 900, fontSize: 18, margin: "0 0 6px" }}>
                ❌ Va en el tacho {correctBin.name.toUpperCase()} ({correctBin.short})
              </p>
              <p style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 600, color: "#374151", lineHeight: 1.5 }}>{lines[0]}</p>
              {hasEPP && (
                <div style={{ background: "#fffbeb", border: "3px solid #f59e0b", borderRadius: 14, padding: "12px 14px", display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                  <span style={{ fontSize: 26, flexShrink: 0 }}>⚠️</span>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#92400e", lineHeight: 1.6 }}>{lines[1]}</p>
                </div>
              )}
              <button onClick={advance} style={{ marginTop: 4, padding: "16px 32px", background: NAVY, color: "#fff", border: "none", borderRadius: 12, fontSize: 17, fontWeight: 800, cursor: "pointer" }}>
                Siguiente ▶
              </button>
            </div>
          )}
        </div>

        {/* Tachos */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 16 }}>
          {BINS.slice(0, 4).map((b) => <Bin key={b.id} bin={b} onPick={handlePick} answered={answered} item={item} />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 10 }}>
          {BINS.slice(4).map((b) => <Bin key={b.id} bin={b} onPick={handlePick} answered={answered} item={item} />)}
        </div>
      </div>
    </div>
  );
}