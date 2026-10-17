(() => {
  const P = window.PHONE;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const wrap = $("#wrap"), flip = $("#flip"), lcd = $("#lcd"), hint = $("#hint"), closeBtn = $("#closeBtn");
  const TOUCH = matchMedia("(pointer: coarse)").matches;

  /* ================= 시간 ================= */
  const T0 = Date.now(), BASE = new Date(`${P.date}T${P.time}`);
  const now = () => new Date(BASE.getTime() + (Date.now() - T0));
  const p2 = n => String(n).padStart(2, "0");
  const W = "일월화수목금토";
  const hm12 = d => { const h = d.getHours() % 12 || 12; return [`${h}:${p2(d.getMinutes())}`, d.getHours() < 12 ? "A" : "P"]; };

  /* ================= 소리 ================= */
  let ctx = null;
  const audio = () => { try { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === "suspended") ctx.resume(); } catch (e) {} return ctx; };
  function tone(freqs, dur, vol = .05, at = 0, type = "sine") {
    if (!audio()) return; const t = ctx.currentTime + at;
    freqs.forEach(f => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .008); g.gain.setValueAtTime(vol, t + dur - .02); g.gain.linearRampToValueAtTime(0, t + dur);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur); });
  }
  function click(vol = .35, at = 0, freq = 2600) {   // 플라스틱 '딸깍'
    if (!audio()) return; const t = ctx.currentTime + at, len = Math.floor(ctx.sampleRate * .05), b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * .006));
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = b; f.type = "bandpass"; f.frequency.value = freq; f.Q.value = 1.4; g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(ctx.destination); s.start(t);
  }
  const DT = { "1": [697, 1209], "2": [697, 1336], "3": [697, 1477], "4": [770, 1209], "5": [770, 1336], "6": [770, 1477], "7": [852, 1209], "8": [852, 1336], "9": [852, 1477], "*": [941, 1209], "0": [941, 1336], "#": [941, 1477] };
  const keyBeep = k => DT[k] ? tone(DT[k], .12, .035) : tone([1400], .06, .03, 0, "square");
  const openJingle = () => { click(.4, 0, 1800); click(.3, .32, 2800); [784, 988, 1175, 1568].forEach((f, i) => tone([f], .12, .045, .45 + i * .11, "triangle")); };
  const closeSnap = () => { click(.45, .38, 1500); click(.25, .44, 3000); };

  /* ================= 배율 · 위치 (닫힘 / 열림) ================= */
  let opened = false, big = false;
  function fit(instant) {
    const vw = innerWidth, vh = innerHeight;
    let s, tx, ty;
    if (opened && big) {   // 액정 크게: 액정(경첩 축 기준 중심 0,-302 · 240×274)을 위쪽에 크게, 아래엔 조작 버튼
      s = Math.min((vw - 20) / 240, (vh - 90) / 274, 3);
      tx = vw / 2; ty = vh / 2 + 10 + 302 * s;
    } else {
      const [y0, y1] = opened ? [-605, 625] : [-126, 650];   // 경첩 축 기준 위·아래 끝
      s = Math.min((vw - 24) / 370, (vh - 64) / (y1 - y0), 1.5);
      tx = vw / 2; ty = vh / 2 - ((y0 + y1) / 2) * s - 6;
    }
    wrap.classList.toggle("instant", !!instant);
    wrap.style.transform = `translate(${tx}px,${ty}px) scale(${s})`;
    if (instant) requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.remove("instant")));
  }
  addEventListener("resize", () => fit(true)); fit(true);

  function openPhone() {
    if (opened) return; opened = true; audio();
    flip.classList.add("open"); fit(); openJingle();
    hint.style.opacity = 0; closeBtn.hidden = false;
    go("idle");
  }
  function closePhone() {
    if (!opened) return; opened = false;
    flip.classList.remove("open"); fit(); closeSnap();
    setBig(false); closeBtn.hidden = true; hint.style.opacity = 1; hint.textContent = "휴대폰을 누르면 열립니다";
    stopCall();
  }
  $("#lid").addEventListener("click", () => { if (!opened) openPhone(); });
  closeBtn.addEventListener("click", closePhone);
  /* 액정 클로즈업: 펼친 상태에서 액정을 누르면 크게, 액정 밖을 누르면 원래대로 */
  const bigOff = $("#bigOff");
  function setBig(v) { if (big === v) return; big = v; document.body.classList.toggle("big", v); bigOff.hidden = !v; fit(); }
  lcd.addEventListener("click", e => { if (opened && !big) { e.stopImmediatePropagation(); setBig(true); } }, true);
  bigOff.addEventListener("click", () => setBig(false));
  /* 클로즈업 중 터치 조작: 화면 아래 글자(소프트키)도 누를 수 있음 */
  lcd.addEventListener("click", e => { const sk = e.target.closest("[data-sk]"); if (sk && big) key(sk.dataset.sk); });
  addEventListener("keydown", e => { if (e.key === "Escape") closePhone(); });

  /* 바깥 작은 액정 */
  const subT = $("[data-subtime]"), subD = $("[data-subdate]");
  const batHTML = n => Array.from({ length: Math.max(0, Math.min(3, n)) }, (_, i) => `<i style="left:${1 + i * 4}px"></i>`).join("");
  document.querySelectorAll("[data-bat]").forEach(b => b.innerHTML = batHTML(P.battery ?? 2));
  function tick() {
    const d = now(), [t, ap] = hm12(d);
    subT.innerHTML = `${t}<small>${ap}</small>`; subD.textContent = `${d.getMonth() + 1}/${p2(d.getDate())} (${W[d.getDay()]})`;
    lcd.querySelectorAll("[data-clk]").forEach(e => e.innerHTML = `${t}<small>${ap === "A" ? "AM" : "PM"}</small>`);
    lcd.querySelectorAll("[data-sbt]").forEach(e => e.textContent = `${p2(d.getHours())}:${p2(d.getMinutes())}`);
  }
  setInterval(tick, 1000);

  /* ================= 큰 액정 화면 ================= */
  const MENU = [
    { id: "contacts", label: "전화번호부" }, { id: "messages", label: "메시지" }, { id: "calls", label: "통화목록" },
    { id: "camera", label: "카메라" }, { id: "album", label: "앨범" }, { id: "bell", label: "벨소리" },
    { id: "game", label: "게임" }, { id: "diary", label: "다이어리" }, { id: "settings", label: "환경설정" }
  ];
  const ICON = {
    contacts: `<rect x="7" y="4" width="18" height="24" rx="2" fill="#2f6fe0"/><rect x="10" y="7" width="12" height="18" fill="#fff"/><circle cx="16" cy="13" r="3" fill="#2f6fe0"/><path d="M11 22c1-4 9-4 10 0" fill="#2f6fe0"/>`,
    messages: `<rect x="4" y="8" width="24" height="16" rx="2" fill="#ffcf3a" stroke="#c48a00"/><path d="M4 9l12 9 12-9" fill="none" stroke="#c48a00" stroke-width="2"/>`,
    calls: `<path d="M9 5c2 0 4 5 3 6l-2 2c1 3 4 6 7 7l2-2c1-1 6 1 6 3s-3 5-5 5C12 26 6 20 5 12c0-3 2-7 4-7z" fill="#27a046"/>`,
    camera: `<rect x="4" y="10" width="24" height="16" rx="3" fill="#5a6577"/><rect x="11" y="6" width="10" height="5" rx="1" fill="#5a6577"/><circle cx="16" cy="18" r="5" fill="#9fe7ff" stroke="#fff" stroke-width="2"/>`,
    album: `<rect x="5" y="6" width="22" height="20" rx="2" fill="#fff" stroke="#888"/><path d="M7 23l6-7 4 4 3-3 5 6z" fill="#3aa64a"/><circle cx="21" cy="11" r="2.5" fill="#f5b800"/>`,
    bell: `<path d="M16 5c5 0 8 4 8 9v6l3 3H5l3-3v-6c0-5 3-9 8-9z" fill="#f59e0b"/><circle cx="16" cy="26" r="2.5" fill="#f59e0b"/>`,
    game: `<rect x="4" y="10" width="24" height="14" rx="7" fill="#7c4ddb"/><path d="M10 14v6M7 17h6" stroke="#fff" stroke-width="2"/><circle cx="21" cy="15.5" r="1.6" fill="#fff"/><circle cx="24" cy="18.5" r="1.6" fill="#fff"/>`,
    diary: `<rect x="7" y="4" width="18" height="24" rx="2" fill="#e04f6b"/><rect x="10" y="8" width="12" height="3" fill="#fff"/><path d="M10 15h12M10 19h12M10 23h8" stroke="#fff" stroke-width="1.5"/>`,
    settings: `<circle cx="16" cy="16" r="5" fill="none" stroke="#5a6577" stroke-width="3"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<rect x="14.5" y="4" width="3" height="5" rx="1" fill="#5a6577" transform="rotate(${a} 16 16)"/>`).join("")}`
  };
  const statusBar = () => `<div class="sb"><b>▂▄▆█</b><span class="r"><b data-sbt></b><span class="bat">${batHTML(P.battery ?? 2)}</span></span></div>`;
  const frame = (title, body, l = "", r = "") => `<div class="scr">${statusBar()}${title ? `<div class="title">${esc(title)}</div>` : ""}<div class="body">${body}</div><div class="softbar"><span data-sk="sl">${esc(l)}</span><span data-sk="sr">${esc(r)}</span></div></div>`;

  let S = { name: "off" }, popT = null, callT = [];
  function go(name, opt = {}) { S = { name, sel: 0, ...opt }; render(); }
  function render() {
    const n = S.name;
    if (n === "idle") {
      const missed = (P.calls || []).filter(c => c.dir === "missed").length, unread = (P.messages || []).filter(m => !m.read).length;
      lcd.innerHTML = frame("", `<div class="idle"><i class="sun"></i><i class="hill"></i>${P.banner ? `<div class="ban">${esc(P.banner)}</div>` : ""}<div class="clk" data-clk></div><div class="dt">${(() => { const d = now(); return `${d.getMonth() + 1}월 ${d.getDate()}일 (${W[d.getDay()]})`; })()}</div>
        ${missed || unread ? `<div class="note">${missed ? `<span>☎ 부재중 전화 ${missed}통</span>` : ""}${unread ? `<span>✉ 새 메시지 ${unread}개</span>` : ""}</div>` : ""}</div>`, "메뉴", "전화부");
    } else if (n === "dial") {
      lcd.innerHTML = frame("", `<div class="idle"><i class="sun"></i><i class="hill"></i><div class="dial">${esc(S.num)}</div></div>`, "저장", "지우기");
    } else if (n === "menu") {
      lcd.innerHTML = frame("메뉴", `<div class="grid">${MENU.map((m, i) => `<button class="mi${i === S.sel ? " sel" : ""}" data-i="${i}"><svg viewBox="0 0 32 32">${ICON[m.id]}</svg>${i + 1}</button>`).join("")}</div>`, "선택", "이전")
        .replace('<div class="softbar">', `<div class="mname">${esc(MENU[S.sel].label)}</div><div class="softbar">`);
    } else if (n === "list") {
      lcd.innerHTML = frame(S.title, `<div class="list">${S.items.length ? S.items.map((it, i) => `<button class="li${i === S.sel ? " sel" : ""}" data-i="${i}"><span class="no">${i + 1}</span>${it.ic ? `<span class="ic">${it.ic}</span>` : ""}<span>${esc(it.label)}</span><small>${esc(it.sub || "")}</small></button>`).join("") : `<div class="read">저장된 항목이 없습니다.</div>`}</div>`, S.items.length ? "선택" : "", "이전");
      const el = lcd.querySelector(".li.sel"); if (el) el.scrollIntoView({ block: "nearest" });
    } else if (n === "read") {
      lcd.innerHTML = frame(S.title, `<div class="read"><div class="meta">${esc(S.meta)}</div>${esc(S.text)}</div>`, S.call ? "통화" : "", "이전");
    } else if (n === "calling") {
      lcd.innerHTML = frame("", `<div class="calling"><div class="ani">☎ · · ·</div><div class="who">${esc(S.who)}</div><div class="num">${esc(S.num)}</div><div class="st" data-cst>연결 중입니다</div></div>`, "", "종료");
    }
    tick();
  }
  function pop(msg, then) { const p = document.createElement("div"); p.className = "pop"; p.textContent = msg; lcd.querySelector(".body")?.appendChild(p); clearTimeout(popT); popT = setTimeout(() => { p.remove(); then && then(); }, 1300); }
  const numberOf = name => (P.contacts || []).find(c => c.name === name)?.number || name;
  const nameOf = num => (P.contacts || []).find(c => c.number === num)?.name || "";

  function openMenu(i) {
    const id = MENU[i].id;
    if (id === "contacts") return go("list", { title: "전화번호부", kind: "contacts", back: ["menu", i], items: (P.contacts || []).map(c => ({ label: c.name, sub: c.number, data: c })) });
    if (id === "messages") return go("list", { title: "받은 메시지", kind: "messages", back: ["menu", i], items: (P.messages || []).map(m => ({ label: m.from, sub: m.when, ic: m.read ? "✉" : "●", data: m })) });
    if (id === "calls") return go("list", { title: "통화목록", kind: "calls", back: ["menu", i], items: (P.calls || []).map(c => ({ label: c.name, sub: c.when, ic: c.dir === "missed" ? "✖" : c.dir === "out" ? "↗" : "↙", data: c })) });
    pop("준비 중입니다");
  }
  function pick() {
    const it = S.items[S.sel]; if (!it) return;
    if (S.kind === "contacts") return go("read", { title: it.data.name, meta: "휴대폰", text: it.data.number, call: it.data.number, back: S });
    if (S.kind === "messages") { it.data.read = true; return go("read", { title: "받은 메시지", meta: `${it.data.from}  ·  ${it.data.when}`, text: it.data.text, call: numberOf(it.data.from), back: { ...S, items: S.items.map(x => x === it ? { ...x, ic: "✉" } : x) } }); }
    if (S.kind === "calls") return go("read", { title: "통화목록", meta: { missed: "부재중", out: "발신", in: "수신" }[it.data.dir] + "  ·  " + it.data.when, text: `${it.data.name}\n${numberOf(it.data.name)}`, call: numberOf(it.data.name), back: S });
  }
  function startCall(num) {
    stopCall(); const who = nameOf(num) || (P.contacts || []).find(c => c.name === num)?.name || "";
    go("calling", { num: numberOf(num), who: who || "" });
    tone([440, 480], 1.2, .03, .4); tone([440, 480], 1.2, .03, 4.4);
    callT.push(setTimeout(() => { const s = lcd.querySelector("[data-cst]"); if (s) s.textContent = "상대방이 전화를 받지 않습니다"; }, 7000));
    callT.push(setTimeout(() => { if (S.name === "calling") go("idle"); }, 9000));
  }
  function stopCall() { callT.forEach(clearTimeout); callT = []; }

  /* ================= 키 입력 ================= */
  function key(k) {
    if (!opened) return;
    keyBeep(k);
    if (k === "menu") k = "sl";
    if (k === "ph") { stopCall(); return openMenu(0); }   // 위쪽 전화부 키
    if (k === "jump" || k === "cam" || k === "nate") { if (S.name === "calling") return; return pop(k === "nate" ? "무선인터넷에 연결할 수 없습니다" : "준비 중입니다"); }
    const n = S.name, digit = /^[0-9*#]$/.test(k);
    if (k === "end") { stopCall(); return go("idle"); }
    if (n === "idle") {
      if (digit) return go("dial", { num: k });
      if (k === "ok" || k === "sl") return go("menu");
      if (k === "sr" || k === "down") return openMenu(0);
      if (k === "send" || k === "up") return openMenu(2);
      if (k === "left") return openMenu(1);
      return;
    }
    if (n === "dial") {
      if (digit) { S.num = (S.num + k).slice(0, 20); return render(); }
      if (k === "clr" || k === "sr") { S.num = S.num.slice(0, -1); return S.num ? render() : go("idle"); }
      if (k === "send" || k === "ok") return startCall(S.num);
      return;
    }
    if (n === "menu") {
      const mv = { up: -3, down: 3, left: -1, right: 1 }[k];
      if (mv) { S.sel = (S.sel + mv + 9) % 9; return render(); }
      if (k === "ok" || k === "sl") return openMenu(S.sel);
      if (/^[1-9]$/.test(k)) { S.sel = +k - 1; render(); return openMenu(S.sel); }
      if (k === "clr" || k === "sr") return go("idle");
      return;
    }
    if (n === "list") {
      if (k === "up" || k === "down") { if (!S.items.length) return; S.sel = (S.sel + (k === "up" ? -1 : 1) + S.items.length) % S.items.length; return render(); }
      if (k === "ok" || k === "sl") return pick();
      if (k === "send" && S.items[S.sel]) { const d = S.items[S.sel].data; return startCall(d.number || numberOf(d.name || d.from)); }
      if (/^[1-9]$/.test(k) && S.items[+k - 1]) { S.sel = +k - 1; render(); return pick(); }
      if (k === "clr" || k === "sr") return go("menu", { sel: S.back ? S.back[1] : 0 });
      return;
    }
    if (n === "read") {
      if (k === "up" || k === "down") { const r = lcd.querySelector(".read"); r.scrollTop += k === "up" ? -40 : 40; return; }
      if ((k === "send" || k === "sl") && S.call) return startCall(S.call);
      if (k === "clr" || k === "sr") { const b = S.back; S = b; return render(); }
      return;
    }
    if (n === "calling") { if (k === "sr" || k === "clr") { stopCall(); go("idle"); } }
  }
  document.querySelectorAll("[data-k]").forEach(b => {
    b.addEventListener("pointerdown", e => { e.preventDefault(); b.classList.add("press"); key(b.dataset.k); });
    const up = () => b.classList.remove("press"); b.addEventListener("pointerup", up); b.addEventListener("pointerleave", up); b.addEventListener("pointercancel", up);
  });
  /* 화면을 직접 눌러도 선택 */
  lcd.addEventListener("click", e => {
    const b = e.target.closest("[data-i]"); if (!b) return; const i = +b.dataset.i;
    if (S.name === "menu") { S.sel = i; render(); openMenu(i); } else if (S.name === "list") { S.sel = i; render(); pick(); }
  });
  /* 키보드로도 조작 (PC) */
  const KB = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", Enter: "ok", Backspace: "clr", F1: "sl", F2: "sr" };
  addEventListener("keydown", e => { if (!opened) return; const k = KB[e.key] || (/^[0-9*#]$/.test(e.key) ? e.key : null); if (k) { e.preventDefault(); key(k); } });

  go("off");
  tick();
})();
