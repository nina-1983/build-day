"use client";

import { useState, useRef } from "react";

const CHECKLIST = [
  {
    section: "Your copy",
    items: [
      { key: "landingCopy",  label: "Landing page copy", note: "Headline, subheadline, body, CTA — written and ready in a doc.", required: true },
      { key: "thankYouCopy", label: "Thank you page copy", note: "Even one line and a next step is enough.", required: true },
      { key: "emailCopy",    label: "Email sequence copy", note: "All emails written, subject lines included. You write, I wire up.", required: true },
    ],
  },
  {
    section: "Assets",
    items: [
      { key: "brandImages",   label: "Brand images / photos", note: "Share via Google Drive or Dropbox link.", required: true },
      { key: "logo",          label: "Logo file (PNG, transparent background)", note: "" },
      { key: "brandColours",  label: "Brand colours and fonts", note: "Hex codes or a brand guide. Existing site URL works too." },
    ],
  },
  {
    section: "Links & payments",
    items: [
      { key: "paymentLink",   label: "Payment link or checkout URL", note: "ThriveCart, Stripe, PayPal — must be set up before the day.", required: true },
      { key: "redirectUrls",  label: "Redirect URLs (success pages, upsell pages)", note: "" },
    ],
  },
  {
    section: "Platform access",
    items: [
      { key: "platformLogin", label: "Login details for your platform", note: "Kajabi, Systeme.io, MailerLite, ConvertKit etc. Send via email, not WhatsApp.", required: true },
    ],
  },
];

const ALL_KEYS = CHECKLIST.flatMap(s => s.items.map(i => i.key));
const REQUIRED_KEYS = CHECKLIST.flatMap(s => s.items.filter(i => i.required).map(i => i.key));

export default function BuildDayChecklist() {
  const [info, setInfo] = useState({ name: "", email: "", buildDate: "" });
  const [checked, setChecked] = useState(() => Object.fromEntries(ALL_KEYS.map(k => [k, false])));
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const canvasRef = useRef(null);

  const doneCount = ALL_KEYS.filter(k => checked[k]).length;
  const pct = Math.round((doneCount / ALL_KEYS.length) * 100);
  const allRequired = REQUIRED_KEYS.every(k => checked[k]);

  function updateInfo(field, value) {
    setInfo(prev => ({ ...prev, [field]: value }));
  }

  function toggle(key) {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...info,
          ...checked,
          notes,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setStatus("success");
        launchConfetti(canvasRef.current);
      } else {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <main style={s.page}>
      <canvas ref={canvasRef} style={s.canvas} />

      <nav style={s.nav}>
        <span style={s.navLogo}>Nina Mistry <span style={s.navRole}>| Launch Architect</span></span>
        <a href="https://nina-mistry.com" style={s.navBack}>← Back to site</a>
      </nav>

      <div style={s.container}>
        <header style={s.header}>
          <p style={s.tag}>The Build Day</p>
          <h1 style={s.h1}>Your prep<br /><em style={s.h1Em}>checklist.</em></h1>
          <p style={s.sub}>Tick off everything below and submit before your Build Day. Missing anything on the day = we rebook. No exceptions.</p>
        </header>

        <div style={s.card} className="form-card">
          <div style={s.cardAccent} />

          {errorMessage && <div style={s.errorBox}>{errorMessage}</div>}

          {status !== "success" ? (
            <form onSubmit={handleSubmit}>

              {/* Progress bar */}
              <div style={s.progressWrap}>
                <div style={s.progressBar}>
                  <div style={{ ...s.progressFill, width: `${pct}%` }} />
                </div>
                <span style={s.progressPct}>{pct}% ready</span>
              </div>

              {/* Client details */}
              <div style={s.section}>
                <h2 style={s.sectionTitle}>Your details</h2>
                <div style={s.twoCol} className="two-col">
                  <Field label="Your name">
                    <input type="text" required value={info.name} onChange={e => updateInfo("name", e.target.value)}
                      placeholder="Your name" style={s.input} />
                  </Field>
                  <Field label="Your email">
                    <input type="email" required value={info.email} onChange={e => updateInfo("email", e.target.value)}
                      placeholder="hello@yourbusiness.com" style={s.input} />
                  </Field>
                </div>
                <Field label="Your Build Day date">
                  <input type="date" required value={info.buildDate} onChange={e => updateInfo("buildDate", e.target.value)}
                    style={s.input} />
                </Field>
              </div>

              {/* Checklist sections */}
              {CHECKLIST.map(({ section, items }) => (
                <div key={section} style={s.section}>
                  <h2 style={s.sectionTitle}>{section}</h2>
                  {items.map(({ key, label, note, required }) => (
                    <div key={key} style={s.checkRow} onClick={() => toggle(key)}>
                      <div style={{ ...s.box, ...(checked[key] ? s.boxDone : {}) }}>
                        {checked[key] && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                      </div>
                      <div style={s.checkText}>
                        <span style={{ ...s.checkLabel, ...(checked[key] ? s.checkLabelDone : {}) }}>
                          {label}
                          {required && <span style={s.required}>required</span>}
                        </span>
                        {note && <span style={s.checkNote}>{note}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Warning if required items missing */}
              {!allRequired && doneCount > 0 && (
                <div style={s.warning}>
                  <span style={s.warningIcon}>⚠</span>
                  <span>You still have required items unchecked. Nina can't build without these.</span>
                </div>
              )}

              {/* Notes */}
              <div style={s.section}>
                <h2 style={s.sectionTitle}>Anything else I should know?</h2>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Platform you're using, special requirements, links to assets, anything relevant..."
                  style={s.textarea} />
              </div>

              <div style={s.footer}>
                <button type="submit" disabled={status === "loading" || !info.name || !info.email || !info.buildDate}
                  style={{ ...s.btnPrimary, ...((!info.name || !info.email || !info.buildDate) ? s.btnDisabled : {}) }}>
                  {status === "loading" ? "Sending…" : "Submit my checklist"}
                </button>
              </div>

            </form>
          ) : (
            <div style={s.success}>
              <div style={s.successCircle} className="success-pop">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 16l7 7L26 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="success-check" />
                </svg>
              </div>
              <h2 style={s.successTitle}>You're ready.</h2>
              <p style={s.successMsg}>
                Nina's got everything. See you on your Build Day — come ready and we'll fly through it.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{css}</style>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      {children}
    </div>
  );
}

function launchConfetti(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colours = ["#85d0cd", "#326ab3", "#6783c2", "#f4c82c", "#f9d8da", "#1c2b3a"];
  const pieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    w: Math.random() * 10 + 6,
    h: Math.random() * 5 + 3,
    colour: colours[Math.floor(Math.random() * colours.length)],
    rot: Math.random() * Math.PI * 2,
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 4 + 2,
    vr: (Math.random() - 0.5) * 0.15,
  }));
  let frame, start = null;
  const duration = 3500;
  function draw(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.colour;
      ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (elapsed < duration) { frame = requestAnimationFrame(draw); }
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }
  frame = requestAnimationFrame(draw);
  setTimeout(() => cancelAnimationFrame(frame), duration + 100);
}

const s = {
  page: { minHeight: "100vh", background: "var(--off-white)" },
  canvas: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 100 },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", background: "rgba(250,250,249,0.92)", borderBottom: "1px solid rgba(133,208,205,0.25)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 10 },
  navLogo: { fontSize: "13px", fontWeight: 600, color: "var(--dark)", letterSpacing: "0.5px", textTransform: "uppercase" },
  navRole: { fontWeight: 400, color: "var(--mid)" },
  navBack: { fontSize: "13px", color: "var(--blue)", textDecoration: "none", fontWeight: 500 },
  container: { maxWidth: "680px", margin: "0 auto", padding: "60px 24px 80px" },
  header: { marginBottom: "48px" },
  tag: { fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--teal)", marginBottom: "16px", borderLeft: "2px solid var(--teal)", paddingLeft: "12px" },
  h1: { fontFamily: "var(--font-bodoni), 'Bodoni Moda', Georgia, serif", fontSize: "clamp(48px, 8vw, 72px)", fontWeight: 700, lineHeight: 1.05, color: "var(--dark)", marginBottom: "20px" },
  h1Em: { fontStyle: "italic", fontWeight: 400, color: "var(--blue)" },
  sub: { fontSize: "16px", color: "var(--mid)", lineHeight: 1.7, maxWidth: "480px" },
  card: { background: "var(--white)", borderRadius: "8px", padding: "48px", boxShadow: "0 4px 24px rgba(28,43,58,0.07)", border: "1px solid rgba(133,208,205,0.2)", position: "relative", overflow: "hidden" },
  cardAccent: { position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, var(--teal) 0%, var(--blue) 50%, var(--periwinkle) 100%)" },
  errorBox: { padding: "14px 16px", background: "#fff4f5", border: "1.5px solid var(--blush)", borderRadius: "6px", fontSize: "14px", color: "#c0392b", marginBottom: "32px" },
  progressWrap: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "40px" },
  progressBar: { flex: 1, height: "6px", background: "#e8ecf0", borderRadius: "100px", overflow: "hidden" },
  progressFill: { height: "100%", background: "var(--blue)", borderRadius: "100px", transition: "width 0.3s ease" },
  progressPct: { fontSize: "13px", fontWeight: 600, color: "var(--mid)", minWidth: "64px", textAlign: "right" },
  section: { marginBottom: "40px" },
  sectionTitle: { fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--mid)", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid rgba(133,208,205,0.3)" },
  checkRow: { display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 0", borderBottom: "0.5px solid #eef0f2", cursor: "pointer", userSelect: "none" },
  box: { width: "20px", height: "20px", borderRadius: "6px", border: "1.5px solid #c8d0da", flexShrink: 0, marginTop: "2px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", background: "white" },
  boxDone: { background: "var(--blue)", borderColor: "var(--blue)" },
  checkText: { flex: 1 },
  checkLabel: { display: "block", fontSize: "14px", color: "var(--dark)", lineHeight: 1.5, fontWeight: 500 },
  checkLabelDone: { textDecoration: "line-through", color: "var(--mid)", fontWeight: 400 },
  checkNote: { display: "block", fontSize: "12px", color: "var(--mid)", marginTop: "3px", lineHeight: 1.5 },
  required: { display: "inline-block", background: "#fef3e2", color: "#b45309", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 7px", borderRadius: "4px", marginLeft: "8px", verticalAlign: "middle" },
  warning: { display: "flex", alignItems: "flex-start", gap: "10px", background: "#fef9ec", border: "0.5px solid #f4c82c", borderRadius: "8px", padding: "12px 16px", fontSize: "13px", color: "#92400e", marginBottom: "32px" },
  warningIcon: { flexShrink: 0, fontSize: "15px" },
  field: { marginBottom: "20px" },
  label: { display: "block", fontSize: "12px", fontWeight: 600, color: "var(--dark)", marginBottom: "8px", letterSpacing: "0.5px", textTransform: "uppercase" },
  input: { width: "100%", padding: "12px 14px", border: "1.5px solid #dde3ea", borderRadius: "6px", fontSize: "15px", color: "var(--dark)", background: "var(--white)", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s", outline: "none" },
  textarea: { width: "100%", padding: "12px 14px", border: "1.5px solid #dde3ea", borderRadius: "6px", fontSize: "15px", color: "var(--dark)", background: "var(--white)", fontFamily: "inherit", minHeight: "100px", resize: "vertical", boxSizing: "border-box", outline: "none" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  footer: { paddingTop: "32px", borderTop: "1px solid var(--off-white)", marginTop: "8px" },
  btnPrimary: { width: "100%", padding: "15px 32px", background: "var(--blue)", color: "white", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s, transform 0.2s" },
  btnDisabled: { opacity: 0.5, cursor: "not-allowed" },
  success: { padding: "48px 0 24px", textAlign: "center" },
  successCircle: { width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), var(--blue))", margin: "0 auto 28px", display: "flex", alignItems: "center", justifyContent: "center" },
  successTitle: { fontFamily: "var(--font-bodoni), 'Bodoni Moda', Georgia, serif", fontSize: "44px", fontStyle: "italic", fontWeight: 400, color: "var(--dark)", marginBottom: "12px" },
  successMsg: { fontSize: "15px", color: "var(--mid)", lineHeight: 1.7, maxWidth: "400px", margin: "0 auto" },
};

const css = `
  input:focus, textarea:focus {
    border-color: var(--teal) !important;
    box-shadow: 0 0 0 3px rgba(133,208,205,0.2) !important;
  }
  button[type="submit"]:hover:not(:disabled) {
    background: #2558a0 !important;
    transform: translateY(-2px);
  }
  @keyframes popIn {
    0% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes drawCheck {
    from { stroke-dashoffset: 40; }
    to { stroke-dashoffset: 0; }
  }
  .success-pop { animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
  .success-check { stroke-dasharray: 40; stroke-dashoffset: 40; animation: drawCheck 0.4s ease 0.4s forwards; }
  @media (max-width: 600px) {
    .two-col { grid-template-columns: 1fr !important; }
    .form-card { padding: 28px 20px !important; }
  }
`;
