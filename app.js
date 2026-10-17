(() => {
  const P = window.PC;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const h = html => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const screen = $("#screen"), led = $("#led"), hint = $("#hint"), room = $("#room"), pcEl = $("#pc");
  const TOUCH = matchMedia("(pointer: coarse)").matches;

  /* ================= 시간 ================= */
  const T0 = Date.now(), BASE = new Date(`${P.date}T${P.time}`);
  const now = () => new Date(BASE.getTime() + (Date.now() - T0));
  const p2 = n => String(n).padStart(2, "0");
  const W = "일월화수목금토";

  /* ================= 책상 장면 · 모니터 확대 ================= */
  const stage = $("#stage"), mon = pcEl.querySelector(".monitor"), back = $("#back");
  let mobile = false, zoomed = false;
  function fit(instant) {
    const vw = innerWidth, vh = innerHeight, portrait = vh > vw;
    mobile = vw < 760 || (TOUCH && vw < 1000);
    document.body.classList.toggle("mobile", mobile);
    document.body.classList.toggle("zoomed", zoomed);
    const [sw, sh] = zoomed && mobile && portrait ? [360, 500] : [640, 480];
    document.documentElement.style.setProperty("--sw", sw + "px");
    document.documentElement.style.setProperty("--sh", sh + "px");
    pcEl.style.left = (850 - pcEl.offsetWidth / 2) + "px";
    let s, tx, ty;
    if (!zoomed) {   // 책상 전체 (스피커~휴대전화)
      const X0 = 30, X1 = 1560, Y0 = mobile && portrait ? 120 : 20, Y1 = 920;
      s = Math.min(vw / (X1 - X0), vh / (Y1 - Y0));
      tx = (vw - (X1 - X0) * s) / 2 - X0 * s; ty = (vh - (Y1 - Y0) * s) / 2 - Y0 * s;
    } else {         // 모니터가 화면 가운데를 가득
      const mx = pcEl.offsetLeft + mon.offsetLeft, my = pcEl.offsetTop + mon.offsetTop, mw = mon.offsetWidth, mh = mon.offsetHeight;
      s = Math.min((vw - 12) / mw, (vh - 12) / mh, mobile ? 3 : 1.6);
      tx = vw / 2 - (mx + mw / 2) * s; ty = vh / 2 - (my + mh / 2) * s;
    }
    stage.classList.toggle("instant", !!instant);
    stage.style.transform = `translate(${tx}px,${ty}px) scale(${s})`;
    if (instant) requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove("instant")));
    document.querySelectorAll(".win").forEach(w => { if (mobile && !w.closest(".dlg")) w.classList.add("max"); });
  }
  function zoom(z) {
    if (zoomed === z) return; zoomed = z;
    document.body.classList.toggle("scene", !z); back.hidden = !z; fit();
  }
  $("#zoomHit").addEventListener("click", () => zoom(true));
  back.addEventListener("click", () => zoom(false));
  addEventListener("keydown", e => { if (e.key === "Escape" && zoomed && !(document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName))) zoom(false); });
  addEventListener("resize", () => fit(true)); fit(true);
  hint.textContent = mobile ? "모니터를 누르세요 · PC 환경을 권장합니다" : "모니터를 누르세요";
  /* 휴대전화 화면의 시계 */
  const phTime = $("#phTime"), phTick = () => { const d = now(); phTime.textContent = `${p2(d.getHours())}:${p2(d.getMinutes())}`; };
  phTick(); setInterval(phTick, 1000);

  /* ================= 소리 ================= */
  let ctx = null, fan = null;
  function audio() { try { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === "suspended") ctx.resume(); } catch (e) {} return ctx; }
  function noiseBuf(sec, brown) {
    const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate), d = b.getChannelData(0); let l = 0;
    for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; if (brown) { l = (l + .02 * w) / 1.02; d[i] = l * 3.5; } else d[i] = w; }
    return b;
  }
  function beep(f = 1000, dur = .16, vol = .08, type = "square") {
    if (!audio()) return; const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol, t); g.gain.setValueAtTime(vol, t + dur - .01); g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur);
  }
  function seek(n = 3) {   // 하드디스크 '드륵드륵'
    const hl = $("#hddLed"); if (hl && on) { hl.classList.add("on"); clearTimeout(hl._t); hl._t = setTimeout(() => hl.classList.remove("on"), 90 * n); }
    if (!audio()) return; const buf = noiseBuf(.05);
    for (let i = 0; i < n; i++) { const t = ctx.currentTime + i * (.04 + Math.random() * .09), s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = buf; f.type = "bandpass"; f.frequency.value = 1800 + Math.random() * 2500; f.Q.value = 3; g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + .03);
      s.connect(f); f.connect(g); g.connect(ctx.destination); s.start(t); s.stop(t + .05); }
  }
  function fanOn() {
    if (!audio() || fan) return; const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf(4, true); s.loop = true; f.type = "lowpass"; f.frequency.value = 380; g.gain.value = 0; g.gain.linearRampToValueAtTime(.05, ctx.currentTime + 1.5);
    const o = ctx.createOscillator(), og = ctx.createGain(); o.frequency.value = 120; og.gain.value = .006;
    s.connect(f); f.connect(g); o.connect(og); og.connect(g); g.connect(ctx.destination); s.start(); o.start(); fan = { s, o, g };
  }
  function fanOff() { if (!fan) return; const t = ctx.currentTime; fan.g.gain.linearRampToValueAtTime(0, t + .6); fan.s.stop(t + .7); fan.o.stop(t + .7); fan = null; }
  function modem() {   // 다이얼 → 응답음 → 접속 잡음 (약 6초)
    if (!audio()) return 0; let t = ctx.currentTime + .1;
    const tone = (f1, f2, a, d, v = .05) => [f1, f2].forEach(f => { if (!f) return; const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = f; g.gain.setValueAtTime(0, a); g.gain.linearRampToValueAtTime(v, a + .01); g.gain.setValueAtTime(v, a + d - .02); g.gain.linearRampToValueAtTime(0, a + d); o.connect(g); g.connect(ctx.destination); o.start(a); o.stop(a + d); });
    tone(350, 440, t, .6, .03); t += .7;
    const DT = { 0: [941, 1336], 1: [697, 1209], 3: [697, 1477], 4: [770, 1209] };
    String(P.bbs.phone).split("").forEach(c => { const f = DT[c] || [852, 1336]; tone(f[0], f[1], t, .09); t += .14; });
    t += .5; tone(2100, 0, t, 1.6, .05); t += 1.7;
    const nz = (a, d, fq, v) => { const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noiseBuf(d + .1); f.type = "bandpass"; f.frequency.value = fq; f.Q.value = 1.2; g.gain.setValueAtTime(v, a); g.gain.setValueAtTime(v, a + d - .05); g.gain.linearRampToValueAtTime(0, a + d); s.connect(f); f.connect(g); g.connect(ctx.destination); s.start(a); s.stop(a + d); };
    tone(980, 1180, t, .5, .03); t += .5; tone(1650, 1850, t, .4, .03); t += .45;
    nz(t, 1.6, 1800, .07); tone(1200, 2400, t + .3, .4, .02); t += 1.6;
    return (t - ctx.currentTime) * 1000;
  }

  /* ================= 파일 시스템 ================= */
  const bytes = s => [...String(s || "")].reduce((n, c) => n + (c.charCodeAt(0) > 127 ? 2 : 1), 0);
  const FS = {};   // 경로 → { dirs:[], files:[] }
  const dirOf = p => p.slice(0, p.lastIndexOf("\\")) || "C:";
  const ensure = d => { if (FS[d]) return FS[d]; FS[d] = { dirs: [], files: [] }; if (d !== "C:") { const up = ensure(dirOf(d)); if (!up.dirs.includes(d)) up.dirs.push(d); } return FS[d]; };
  ensure("C:"); ["C:\\DOS", "C:\\WINDOWS"].forEach(ensure);
  (P.files || []).forEach(f => { f.name = f.path.slice(f.path.lastIndexOf("\\") + 1); f.size = f.size ?? (f.kind === "image" ? 38078 : bytes(f.text)); ensure(dirOf(f.path)).files.push(f); });
  const base = d => d === "C:" ? "C:\\" : d.slice(d.lastIndexOf("\\") + 1);

  /* ================= 전원 · 부팅 ================= */
  let on = false, bootTok = 0, skip = false;
  const togglePower = () => { audio(); on ? powerOff() : powerOn(); };
  $("#power").addEventListener("click", togglePower);
  $("#towerPower").addEventListener("click", () => { togglePower(); if (on) setTimeout(() => zoom(true), 350); });
  function powerOff() {
    on = false; bootTok++; $("#power").classList.remove("on"); led.className = "led"; $("#pwrLed").classList.remove("on"); fanOff();
    screen.style.filter = "brightness(3)"; setTimeout(() => { screen.classList.add("off"); screen.innerHTML = ""; screen.style.filter = ""; }, 120);
  }
  async function powerOn() {
    on = true; const tok = ++bootTok; skip = false; $("#power").classList.add("on"); led.className = "led on"; $("#pwrLed").classList.add("on"); fanOn();
    screen.classList.remove("off"); screen.innerHTML = `<div class="blank"></div>`;
    const alive = () => tok === bootTok;
    await wait(700); if (!alive()) return;
    const t = h(`<div class="txt"></div>`); screen.innerHTML = ""; screen.appendChild(t);
    const out = (s = "", cls) => { t.insertAdjacentHTML("beforeend", cls ? `<span class="${cls}">${esc(s)}</span>` : esc(s)); };
    const line = async (s, ms = 120, cls) => { out(s + "\n", cls); if (!skip) await wait(ms); };
    const onSkip = () => { skip = true; }; screen.addEventListener("pointerdown", onSkip); addEventListener("keydown", onSkip);
    await line("Enhanced BIOS Version 1.02  (C)1993", 200, "w");
    await line(`Main Processor : ${P.cpu}`, 150);
    out("Memory Testing : ");
    const memSpan = h(`<span class="w">0K</span>`); t.appendChild(memSpan);
    for (let k = 0; k <= P.memoryKB; k += 256) { if (!alive()) return; memSpan.textContent = k + "K"; if (!skip) await wait(28); }
    memSpan.textContent = P.memoryKB + "K OK"; out("\n\n"); beep(); if (!skip) await wait(500);
    await line(`  Detecting IDE Primary Master ... ${P.hddMB}MB`, 400); seek(4);
    await line("  Detecting IDE Primary Slave  ... None", 300);
    await line("  Floppy Drive A: 1.44M, 3.5 in.", 400);
    await line("", 200);
    out("Starting DOS...\n\n", "w"); seek(6); if (!skip) await wait(1100); if (!alive()) return;
    await line("HIMEM is testing extended memory...done.", 300);
    await line("한글 출력 장치를 설치했습니다.", 300, "y"); seek(3);
    await line("", 100);
    for (const l of autoexec()) { await line("C:\\>" + l, 260); seek(2); }
    screen.removeEventListener("pointerdown", onSkip); removeEventListener("keydown", onSkip);
    if (!alive()) return;
    await wait(skip ? 200 : 500); startGUI(tok);
  }
  function autoexec() {
    const f = (P.files || []).find(x => x.path.toUpperCase() === "C:\\AUTOEXEC.BAT");
    return f ? f.text.split("\n").filter(l => l && !/^@?ECHO/i.test(l) && !/^(PROMPT|PATH)/i.test(l)) : ["WIN"];
  }

  /* ================= 그래픽 환경 ================= */
  let gui, z = 10;
  async function startGUI(tok) {
    led.className = "led busy";
    const sp = h(`<div class="splash"><b>창 3.1</b><small>그래픽 환경을 시작하는 중입니다…</small><div class="bar"><i></i></div></div>`);
    screen.innerHTML = ""; screen.appendChild(sp);
    for (let i = 1; i <= 5; i++) { await wait(260); if (tok !== bootTok) return; sp.querySelector("i").style.width = i * 20 + "%"; seek(2); }
    await wait(300); if (tok !== bootTok) return;
    led.className = "led on";
    gui = h(`<div class="gui"><div class="desk-ico" data-mins></div></div>`); screen.innerHTML = ""; screen.appendChild(gui);
    progman();
  }

  /* 창 */
  function openWin({ title, w = 360, h: hh = 260, x, y, menu, body, status, cls = "", onClose, max = false }) {
    const n = gui.querySelectorAll(".win").length;
    const el = h(`<div class="win ${cls}"><div class="tb"><button class="ctl" data-close aria-label="닫기"><i></i></button><div class="tt">${esc(title)}</div><button class="bt" data-min aria-label="최소화">▼</button><button class="bt" data-max aria-label="최대화">▲</button></div>
      ${menu ? `<div class="mb">${menu.map(m => `<span>${esc(m)}</span>`).join("")}</div>` : ""}<div class="body"></div>${status != null ? `<div class="status">${status}</div>` : ""}</div>`);
    const G = gui.getBoundingClientRect(), sc = G.width / gui.offsetWidth;
    const gw = gui.offsetWidth, gh = gui.offsetHeight;
    w = Math.min(w, gw - 8); hh = Math.min(hh, gh - 8);
    el.style.width = w + "px"; el.style.height = hh + "px";
    el.style.left = (x ?? Math.max(4, Math.min(gw - w - 4, 30 + n * 22))) + "px";
    el.style.top = (y ?? Math.max(4, Math.min(gh - hh - 4, 20 + n * 22))) + "px";
    if (mobile || max) el.classList.add("max");
    const b = el.querySelector(".body"); if (typeof body === "string") b.innerHTML = body; else if (body) b.appendChild(body);
    gui.appendChild(el); focus(el);
    el.addEventListener("pointerdown", () => focus(el));
    el.querySelector("[data-close]").onclick = () => close();
    el.querySelector("[data-max]").onclick = () => el.classList.toggle("max");
    el.querySelector("[data-min]").onclick = () => {
      el.hidden = true; const ic = h(`<button class="ico">${ICON.win}<span>${esc(title)}</span></button>`);
      ic.onclick = () => { el.hidden = false; ic.remove(); focus(el); }; gui.querySelector("[data-mins]").appendChild(ic);
    };
    const tt = el.querySelector(".tt"); let d = null;   // 제목 표시줄 끌어서 이동
    tt.addEventListener("pointerdown", e => { if (el.classList.contains("max")) return; d = [e.clientX, e.clientY, el.offsetLeft, el.offsetTop, gui.getBoundingClientRect().width / gui.offsetWidth]; tt.setPointerCapture(e.pointerId); });
    tt.addEventListener("pointermove", e => { if (!d) return; el.style.left = Math.max(-w + 60, Math.min(gw - 40, d[2] + (e.clientX - d[0]) / d[4])) + "px"; el.style.top = Math.max(0, Math.min(gh - 24, d[3] + (e.clientY - d[1]) / d[4])) + "px"; });
    tt.addEventListener("pointerup", () => d = null);
    tt.addEventListener("dblclick", () => el.classList.toggle("max"));
    function close() { if (onClose && onClose() === false) return; el.remove(); }
    el._close = close;
    return el;
  }
  function focus(el) { gui.querySelectorAll(".win").forEach(w => w.classList.remove("act")); el.classList.add("act"); el.style.zIndex = ++z; }
  function dialog(title, msg, { stop, input, buttons = ["확인"] } = {}) {
    return new Promise(res => {
      const d = h(`<div class="dlg"><div class="win act"><div class="tb"><div class="ctl"><i></i></div><div class="tt">${esc(title)}</div></div>
        <div class="in"><div class="row2"><div class="mark${stop ? " stop" : ""}">${stop ? "✕" : "i"}</div><div>${esc(msg).replace(/\n/g, "<br>")}${input ? `<div style="margin-top:8px"><input class="field" type="password" style="width:100%"></div>` : ""}</div></div>
        <div class="ok">${buttons.map((b, i) => `<button class="btn" data-b="${i}">${esc(b)}</button>`).join("")}</div></div></div></div>`);
      d.style.zIndex = ++z + 100; gui.appendChild(d); beep(stop ? 300 : 880, .12, .05, "triangle");
      const f = d.querySelector("input"); if (f) { setTimeout(() => f.focus(), 50); f.addEventListener("keydown", e => { if (e.key === "Enter") done(0); }); }
      const done = i => { d.remove(); res(input ? (i === 0 ? f.value : null) : i); };
      d.querySelectorAll("[data-b]").forEach(b => b.onclick = () => done(+b.dataset.b));
    });
  }

  /* 아이콘 (작은 그림) */
  const ICON = {
    fm: `<svg viewBox="0 0 32 32"><rect x="3" y="8" width="26" height="19" fill="#ff0" stroke="#000"/><path d="M3 8l3-4h8l2 4" fill="#ff0" stroke="#000"/><rect x="7" y="13" width="18" height="2" fill="#000"/><rect x="7" y="18" width="12" height="2" fill="#000"/></svg>`,
    note: `<svg viewBox="0 0 32 32"><rect x="6" y="3" width="20" height="26" fill="#fff" stroke="#000"/><path d="M9 9h14M9 13h14M9 17h14M9 21h9" stroke="#000080" stroke-width="2"/><rect x="6" y="3" width="20" height="4" fill="#0ff" stroke="#000"/></svg>`,
    term: `<svg viewBox="0 0 32 32"><rect x="3" y="5" width="26" height="18" fill="#c0c0c0" stroke="#000"/><rect x="6" y="8" width="20" height="12" fill="#0000a8"/><path d="M8 12h8M8 16h12" stroke="#ff5" stroke-width="2"/><path d="M10 27h12l2-4H8z" fill="#c0c0c0" stroke="#000"/></svg>`,
    clock: `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="#fff" stroke="#000" stroke-width="2"/><path d="M16 16V8M16 16l6 3" stroke="#000" stroke-width="2"/></svg>`,
    calc: `<svg viewBox="0 0 32 32"><rect x="7" y="3" width="18" height="26" fill="#c0c0c0" stroke="#000"/><rect x="10" y="6" width="12" height="5" fill="#fff" stroke="#000"/><g fill="#000">${[0, 1, 2].map(r => [0, 1, 2].map(c => `<rect x="${10 + c * 4.5}" y="${14 + r * 4.5}" width="3" height="3"/>`).join("")).join("")}</g></svg>`,
    dos: `<svg viewBox="0 0 32 32"><rect x="3" y="5" width="26" height="22" fill="#000" stroke="#808080"/><text x="6" y="20" font-size="9" fill="#fff" font-family="monospace">C:\\&gt;</text></svg>`,
    win: `<svg viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="20" fill="#fff" stroke="#000"/><rect x="4" y="6" width="24" height="5" fill="#000080"/></svg>`,
    dir: `<svg viewBox="0 0 16 16"><path d="M1 4h5l1 2h8v8H1z" fill="#ff0" stroke="#000"/></svg>`,
    file: `<svg viewBox="0 0 16 16"><path d="M3 1h7l3 3v11H3z" fill="#fff" stroke="#000"/><path d="M5 7h6M5 9h6M5 11h4" stroke="#000"/></svg>`,
    exe: `<svg viewBox="0 0 16 16"><rect x="1" y="3" width="14" height="10" fill="#fff" stroke="#000"/><rect x="1" y="3" width="14" height="3" fill="#000080"/></svg>`,
    img: `<svg viewBox="0 0 16 16"><rect x="1" y="2" width="14" height="12" fill="#0ff" stroke="#000"/><path d="M2 13l4-5 3 3 2-2 4 4z" fill="#080"/></svg>`,
    lock: `<svg viewBox="0 0 16 16"><path d="M3 1h7l3 3v11H3z" fill="#fff" stroke="#000"/><rect x="5" y="8" width="6" height="5" fill="#c00"/><path d="M6 8V6a2 2 0 0 1 4 0v2" fill="none" stroke="#c00" stroke-width="1.4"/></svg>`
  };

  /* 프로그램 관리자 */
  const APPS = [
    { id: "fm", label: "파일 관리자", run: () => fileManager() },
    { id: "note", label: "메모장", run: () => notepad() },
    { id: "term", label: "통신", run: () => terminal() },
    { id: "clock", label: "시계", run: () => clockApp() },
    { id: "calc", label: "계산기", run: () => calcApp() },
    { id: "dos", label: "도스 프롬프트", run: () => dosPrompt() }
  ];
  function iconGrid(items) {   // 한 번 누르면 선택, 두 번(터치는 한 번) 누르면 실행
    const g = h(`<div class="icons">${items.map((a, i) => `<button class="ico" data-i="${i}">${ICON[a.id] || ICON.win}<span>${esc(a.label)}</span></button>`).join("")}</div>`);
    let last = -1, lt = 0;
    g.addEventListener("click", e => { const b = e.target.closest("[data-i]"); if (!b) return; const i = +b.dataset.i;
      g.querySelectorAll(".ico").forEach(x => x.classList.toggle("sel", x === b));
      if (TOUCH || (i === last && Date.now() - lt < 600)) { items[i].run(); last = -1; } else { last = i; lt = Date.now(); } });
    return g;
  }
  function progman() {
    openWin({ title: "프로그램 관리자", w: 420, h: 250, x: 18, y: 14, menu: ["파일", "옵션", "창", "도움말"], body: iconGrid(APPS),
      onClose: () => { dialog("창 종료", "그래픽 환경을 끝내고 도스로 돌아갑니다.", { buttons: ["확인", "취소"] }).then(i => { if (i === 0) exitGUI(); }); return false; } });
  }
  function exitGUI() { screen.innerHTML = ""; const t = dosShell(true); screen.appendChild(t); t._focus(); }

  /* 파일 관리자 */
  function fileManager() {
    let cur = "C:\\DOC" in FS ? "C:\\DOC" : "C:";
    const el = h(`<div class="fm"><div class="tree"></div><div class="list"></div></div>`);
    const w = openWin({ title: "파일 관리자", w: 470, h: 300, menu: ["파일", "디스크", "트리", "보기", "옵션", "창"], body: el, status: "" });
    const tree = el.querySelector(".tree"), list = el.querySelector(".list"), st = w.querySelector(".status");
    const depth = d => d === "C:" ? 0 : d.split("\\").length - 1;
    const order = []; (function walk(d) { order.push(d); FS[d].dirs.slice().sort().forEach(walk); })("C:");
    const render = () => {
      tree.innerHTML = order.map(d => `<button class="row${d === cur ? " sel" : ""}" data-dir="${esc(d)}" style="padding-left:${4 + depth(d) * 14}px">${ICON.dir}${esc(base(d))}</button>`).join("");
      const F = FS[cur];
      list.innerHTML = `<div class="dirbar">${esc(cur === "C:" ? "C:\\" : cur)}</div>` +
        F.dirs.map(d => `<button class="row" data-dir="${esc(d)}">${ICON.dir}${esc(base(d))}</button>`).join("") +
        F.files.map((f, i) => `<button class="row" data-f="${i}">${f.password ? ICON.lock : f.kind === "image" ? ICON.img : f.kind === "exe" ? ICON.exe : ICON.file}${esc(f.name)}<small>${f.size.toLocaleString()}  ${esc(f.date)}</small></button>`).join("");
      const tot = F.files.reduce((n, f) => n + f.size, 0);
      st.innerHTML = `<span>C: ${Math.round((P.hddMB * 1024 * .37))}KB 남음</span><span>파일 ${F.files.length}개 (${tot.toLocaleString()}바이트)</span>`;
    };
    el.addEventListener("click", e => {
      const d = e.target.closest("[data-dir]"); if (d) { cur = d.dataset.dir; render(); seek(2); return; }
      const r = e.target.closest("[data-f]"); if (!r) return;
      list.querySelectorAll(".row").forEach(x => x.classList.toggle("sel", x === r));
      if (TOUCH || r._t && Date.now() - r._t < 600) openFile(FS[cur].files[+r.dataset.f]); else r._t = Date.now();
    });
    render();
  }
  const unlocked = new Set();
  async function openFile(f) {
    seek(3);
    if (f.kind === "exe") { dialog("오류", `${f.name}\n\n이 프로그램을 실행할 수 없습니다.`, { stop: true }); return; }
    if (f.password && !unlocked.has(f.path)) {
      const pw = await dialog("암호", `${f.name} 파일은 암호로 보호되어 있습니다.\n암호를 입력하십시오.`, { input: true, buttons: ["확인", "취소"] });
      if (pw === null) return;
      if (pw !== String(f.password)) { dialog("암호", "암호가 틀렸습니다.", { stop: true }); return; }
      unlocked.add(f.path);
    }
    if (f.kind === "image") { openWin({ title: `그림 보기 - ${f.name}`, w: 360, h: 290, body: `<div class="imgv">${f.img ? `<img src="${esc(f.img)}" alt="">` : `<div>${esc(f.caption || f.name)}</div>`}</div>` }); return; }
    notepad(f);
  }

  /* 메모장 */
  function notepad(f) {
    const ta = h(`<textarea class="note" spellcheck="false"></textarea>`); ta.value = f ? f.text || "" : "";
    if (f) ta.readOnly = true;
    openWin({ title: `메모장 - ${f ? f.name : "(제목 없음)"}`, w: 400, h: 280, menu: ["파일", "편집", "찾기", "도움말"], body: ta });
    if (!f && !TOUCH) setTimeout(() => ta.focus(), 50);
  }

  /* 시계 */
  function clockApp() {
    const el = h(`<div class="clock"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#000" stroke-width="2"/>${Array.from({ length: 12 }, (_, i) => `<rect x="48.5" y="7" width="3" height="${i % 3 ? 4 : 8}" fill="#000" transform="rotate(${i * 30} 50 50)"/>`).join("")}<line data-h x1="50" y1="50" x2="50" y2="26" stroke="#000" stroke-width="4"/><line data-m x1="50" y1="50" x2="50" y2="14" stroke="#000" stroke-width="2.5"/><line data-s x1="50" y1="56" x2="50" y2="12" stroke="#800" stroke-width="1"/></svg><p></p></div>`);
    const w = openWin({ title: "시계", w: 230, h: 260, body: el });
    const up = () => { if (!w.isConnected) return clearInterval(t); const d = now(), s = d.getSeconds(), m = d.getMinutes() + s / 60, hr = d.getHours() % 12 + m / 60;
      el.querySelector("[data-h]").setAttribute("transform", `rotate(${hr * 30} 50 50)`); el.querySelector("[data-m]").setAttribute("transform", `rotate(${m * 6} 50 50)`); el.querySelector("[data-s]").setAttribute("transform", `rotate(${s * 6} 50 50)`);
      el.querySelector("p").textContent = `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} (${W[d.getDay()]})`; };
    const t = setInterval(up, 1000); up();
  }

  /* 계산기 */
  function calcApp() {
    const el = h(`<div class="calc"><div class="disp">0</div><div class="keys">${["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+", "C"].map(k => `<button class="btn" data-k="${k}">${k === "*" ? "×" : k === "/" ? "÷" : k}</button>`).join("")}</div></div>`);
    openWin({ title: "계산기", w: 220, h: 260, menu: ["편집", "보기", "도움말"], body: el });
    const D = el.querySelector(".disp"); let acc = null, op = null, cur = "0", fresh = true;
    const calc = (a, b, o) => o === "+" ? a + b : o === "-" ? a - b : o === "*" ? a * b : o === "/" ? (b ? a / b : NaN) : b;
    el.addEventListener("click", e => { const k = e.target.closest("[data-k]")?.dataset.k; if (!k) return;
      if (/[0-9.]/.test(k)) { cur = fresh ? (k === "." ? "0." : k) : (k === "." && cur.includes(".") ? cur : cur + k); fresh = false; }
      else if (k === "C") { acc = null; op = null; cur = "0"; fresh = true; }
      else if (k === "=") { if (op) { acc = calc(acc, parseFloat(cur), op); cur = String(+acc.toFixed(10)); } acc = null; op = null; fresh = true; }
      else { const v = parseFloat(cur); acc = op && !fresh ? calc(acc, v, op) : (acc ?? v); op = k; fresh = true; cur = String(+acc.toFixed(10)); }
      D.textContent = cur === "NaN" ? "0으로 나눌 수 없습니다" : cur; });
  }

  /* 도스 (프롬프트 창 · 그래픽 환경 종료 후) */
  function dosShell(full) {
    let cwd = "C:";
    const t = h(`<div class="txt dos"${full ? "" : ` style="position:absolute;inset:0"`}><span data-o></span><span data-p></span><span data-l class="w"></span><span class="cur"></span><input autocapitalize="off" autocomplete="off" spellcheck="false"></div>`);
    const o = t.querySelector("[data-o]"), pr = t.querySelector("[data-p]"), ln = t.querySelector("[data-l]"), inp = t.querySelector("input");
    const prompt = () => (cwd === "C:" ? "C:\\" : cwd) + ">";
    const print = s => { o.insertAdjacentText("beforeend", s); };
    const resolve = a => { a = a.toUpperCase().replace(/\/$/, ""); if (a === "\\") return "C:"; if (a === "..") return cwd === "C:" ? "C:" : dirOf(cwd); const p = /^C:/.test(a) ? a.replace(/\\$/, "") : (cwd + "\\" + a); return Object.keys(FS).find(k => k.toUpperCase() === p.toUpperCase()); };
    const findFile = a => { const p = (/^C:/i.test(a) ? a : cwd + "\\" + a).toUpperCase(); return (P.files || []).find(f => f.path.toUpperCase() === p); };
    const run = c => {
      const [cmd, ...rest] = c.trim().split(/\s+/), arg = rest.join(" "), C = (cmd || "").toUpperCase();
      if (!C) return;
      if (C === "CLS") { o.textContent = ""; return; }
      if (C === "VER") return print("\nDOS 버전 6.20\n\n");
      if (C === "HELP" || C === "?") return print("\n사용할 수 있는 명령: DIR  CD  TYPE  CLS  VER  DATE  TIME  WIN  EXIT\n\n");
      if (C === "DATE") { const d = now(); return print(`\n현재 날짜: ${W[d.getDay()]} ${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}\n\n`); }
      if (C === "TIME") { const d = now(); return print(`\n현재 시각: ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}\n\n`); }
      if (C === "DIR") { seek(3); const F = FS[cwd]; let s = `\n C 드라이브의 볼륨에는 이름이 없습니다\n ${prompt().slice(0, -1)} 의 디렉토리\n\n`;
        F.dirs.forEach(d => s += `${base(d).padEnd(14)}<DIR>\n`); F.files.forEach(f => s += `${f.name.padEnd(14)}${String(f.size).padStart(9)}  ${f.date}\n`);
        return print(s + `      ${F.files.length}개 파일\n\n`); }
      if (C === "CD" || C === "CHDIR" || /^CD\\|^CD\.\./.test(C)) { const a = C.length > 2 && C.startsWith("CD") ? C.slice(2) : arg; if (!a) return print("\n" + prompt().slice(0, -1) + "\n\n"); const d = resolve(a); if (d) cwd = d; else print("\n디렉토리가 잘못되었습니다\n\n"); return; }
      if (C === "TYPE") { const f = findFile(arg); if (!f) return print("\n파일을 찾을 수 없습니다\n\n"); if (f.password) return print("\n접근이 거부되었습니다 - 암호가 걸린 파일입니다\n\n"); if (f.kind) return print("\n(읽을 수 없는 파일 형식)\n\n"); seek(2); return print("\n" + f.text + "\n\n"); }
      if (C === "WIN") { if (full) { startGUI(bootTok); return "stop"; } return print("\n이미 그래픽 환경에서 실행 중입니다.\n\n"); }
      if (C === "EXIT") { if (!full) { t.closest(".win")?._close(); return "stop"; } return print("\n"); }
      const f = findFile(cmd) || findFile(cmd + ".EXE") || findFile(cmd + ".COM") || findFile(cmd + ".BAT");
      if (f) return print("\n이 프로그램은 실행할 수 없습니다.\n\n");
      print("\n잘못된 명령이나 파일 이름입니다\n\n");
    };
    const draw = () => { pr.textContent = prompt(); ln.textContent = inp.value; t.scrollTop = t.scrollHeight; };
    inp.addEventListener("input", draw);
    inp.addEventListener("keydown", e => { if (e.key !== "Enter" || e.isComposing) return; e.preventDefault(); const c = inp.value; inp.value = ""; print(prompt() + c + "\n"); if (run(c) !== "stop") draw(); });
    t.addEventListener("click", () => inp.focus());
    t._focus = () => setTimeout(() => inp.focus(), 50);
    print(full ? "\n" : "도스 프롬프트입니다. 그래픽 환경으로 돌아가려면 EXIT 를 입력하십시오.\n도움말은 HELP\n\n"); draw();
    return t;
  }
  function dosPrompt() { const t = dosShell(false); const w = openWin({ title: "도스 프롬프트", w: 480, h: 300, body: t }); w.querySelector(".body").style.background = "#000"; t._focus(); }

  /* 통신 (가상의 PC통신) */
  function terminal() {
    const B = P.bbs; let state = "dial", stack = [], busy = true;
    const el = h(`<div style="position:absolute;inset:0;display:flex;flex-direction:column"><div class="term" style="position:relative;flex:1"></div><div class="term-in"><label>선택&gt;</label><input autocomplete="off" autocapitalize="off" spellcheck="false"></div></div>`);
    const w = openWin({ title: "통신 - " + B.name, w: 520, h: 340, menu: ["파일", "편집", "설정", "전화걸기", "전송"], body: el, onClose: () => { busy = false; } });
    const T = el.querySelector(".term"), inp = el.querySelector("input");
    const out = s => { T.insertAdjacentHTML("beforeend", s); T.scrollTop = T.scrollHeight; };
    const cls = () => { T.innerHTML = ""; };
    const m = (k, label) => `<span class="menu" data-cmd="${esc(k)}">${esc(k)}. ${esc(label)}</span>`;
    const bar = s => `<span class="bar">${esc(s)}</span>`;
    const home = () => { state = "main"; stack = []; cls(); out(bar(`${B.name}  ─  초기 화면`) + `\n  ${m("1", "전자우편")}\n  ${m("2", "게시판")}\n  ${m("X", "접속 종료")}\n\n<span class="dim">번호를 입력하거나 누르십시오.</span>\n`); };
    const mail = () => { state = "mail"; cls(); out(bar("전자우편  ─  받은 편지") + `<span class="c">번호  보낸이        날짜            제목</span>\n` + B.mail.map((x, i) => `<span class="menu" data-cmd="${i + 1}">${String(i + 1).padStart(3)}   ${esc(x.from.padEnd(12))}${esc(x.date)}  ${esc(x.title)}</span>`).join("\n") + `\n\n<span class="dim">읽을 번호 · P 이전 화면</span>\n`); };
    const boards = () => { state = "boards"; cls(); out(bar("게시판") + B.boards.map((b, i) => "  " + m(String(i + 1), b.name)).join("\n") + `\n\n<span class="dim">번호 · P 이전 화면</span>\n`); };
    let curBoard = null;
    const board = i => { curBoard = B.boards[i]; state = "board"; cls(); out(bar(curBoard.name) + `<span class="c">번호   글쓴이       날짜      제목</span>\n` + curBoard.posts.map((p, k) => `<span class="menu" data-cmd="${k + 1}">${String(p.no).padStart(5)}  ${esc(p.from.padEnd(11))}${esc(p.date)}  ${esc(p.title)}</span>`).join("\n") + `\n\n<span class="dim">읽을 순서 번호(1부터) · P 이전 화면</span>\n`); };
    const read = (title, meta, body) => { cls(); out(bar(title) + `<span class="c">${esc(meta)}</span>\n${"─".repeat(30)}\n${esc(body)}\n${"─".repeat(30)}\n<span class="dim">P 이전 화면</span>\n`); };
    const go = c => {
      if (busy) return; c = String(c).trim().toUpperCase(); if (!c) return;
      out(`<span class="y">선택&gt; ${esc(c)}</span>\n`);
      if (c === "X" || c === "BYE") { busy = true; out("\n접속을 종료합니다. 이용해 주셔서 감사합니다.\n\n<span class='g'>NO CARRIER</span>\n"); state = "off"; return; }
      if (c === "P" || c === "GO TOP") { const back = stack.pop(); return back ? back() : home(); }
      if (state === "main") { if (c === "1") { stack.push(home); mail(); } else if (c === "2") { stack.push(home); boards(); } else out("잘못 입력하셨습니다.\n"); return; }
      if (state === "mail") { const x = B.mail[+c - 1]; if (!x) return out("없는 번호입니다.\n"); stack.push(mail); read(x.title, `보낸이: ${x.from}   ${x.date}`, x.body); return; }
      if (state === "boards") { if (!B.boards[+c - 1]) return out("없는 번호입니다.\n"); stack.push(boards); board(+c - 1); return; }
      if (state === "board") { const p = curBoard.posts[+c - 1]; if (!p) return out("없는 번호입니다.\n"); const bi = B.boards.indexOf(curBoard); stack.push(() => board(bi)); read(`[${p.no}] ${p.title}`, `글쓴이: ${p.from}   ${p.date}`, p.body); return; }
      if (state === "off") out("연결되어 있지 않습니다.\n");
    };
    T.addEventListener("click", e => { const k = e.target.closest("[data-cmd]"); if (k) go(k.dataset.cmd); else if (!TOUCH) inp.focus(); });
    inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); go(inp.value); inp.value = ""; } });
    (async () => {
      out(`<span class="c">통신 에뮬레이터 2.1</span>\n\nATZ\nOK\nATDT${esc(B.phone)}\n`);
      led.className = "led busy"; const ms = modem(); await wait(Math.max(ms, 5200)); if (!w.isConnected) return; led.className = "led on";
      out(`\n<span class="g">CONNECT 14400/ARQ</span>\n\n`); await wait(700);
      out(`<span class="y">  ★  ${esc(B.name)}  ★\n</span>\n이용자ID : ${esc(B.id)}\n`); await wait(500);
      out("비밀번호 : ********\n"); await wait(800);
      out(`\n${esc(B.id)}님, 반갑습니다.\n마지막 접속: ${esc(B.mail[0]?.date || "")}\n`); await wait(1200);
      busy = false; home(); if (!TOUCH) inp.focus();
    })();
  }

  /* 탭 전환 등으로 화면이 다시 보일 때 오디오 깨우기 */
  addEventListener("pointerdown", () => { if (ctx && ctx.state === "suspended") ctx.resume(); }, { capture: true });
})();
