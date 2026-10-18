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
  const W = "일월화수목금토", WE = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"], MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
  function typing() { return !!(document.activeElement && document.activeElement.tagName === "TEXTAREA"); }
  function fit(instant) {
    const VV = window.visualViewport, vw = VV ? VV.width : innerWidth, vh = VV ? VV.height : innerHeight, oy = VV ? VV.offsetTop : 0, ox = VV ? VV.offsetLeft : 0;
    let s, tx, ty;
    if (opened && big) {   // 액정 크게: 액정(경첩 축 기준 중심 0,-302 · 240×274)을 위쪽에 크게, 아래엔 조작 버튼
      const [Y0, Y1] = typing() ? [-445, -160] : [-612, 30];   // 평소엔 윗덮개 전체, 글 쓰는 중(자판이 뜸)엔 액정만 남은 공간에 맞춤
      s = Math.min((vw - 8) / 372, (vh - 30) / (Y1 - Y0), 2.6);
      tx = vw / 2; ty = vh / 2 - ((Y0 + Y1) / 2) * s;
    } else {
      const [y0, y1] = opened ? [-605, 625] : [-126, 650];   // 경첩 축 기준 위·아래 끝
      s = Math.min((vw - 24) / 370, (vh - 64) / (y1 - y0), 1.5);
      tx = vw / 2; ty = vh / 2 - ((y0 + y1) / 2) * s - 6;
    }
    tx += ox; ty += oy;
    wrap.classList.toggle("instant", !!instant);
    wrap.style.transform = `translate(${tx}px,${ty}px) scale(${s})`;
    if (instant) requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.remove("instant")));
  }
  addEventListener("resize", () => fit(true)); fit(true);
  /* 모바일 자판: 보이는 영역(visualViewport)에 맞춰 액정이 자판 위로 올라오게 */
  if (window.visualViewport) { visualViewport.addEventListener("resize", () => fit(true)); visualViewport.addEventListener("scroll", () => fit(true)); }
  document.addEventListener("focusin", e => { if (e.target.tagName === "TEXTAREA") setTimeout(() => fit(true), 250); });
  document.addEventListener("focusout", e => { if (e.target.tagName === "TEXTAREA") setTimeout(() => { try { scrollTo(0, 0); } catch (x) {} fit(true); }, 80); });
  /* 글 쓰는 칸 밖(액정 제목줄·휴대폰 몸체·배경)을 누르면 자판이 내려감 */
  document.addEventListener("pointerdown", e => { if (typing() && !e.target.closest(".ta, [data-sk]")) document.activeElement.blur(); }, true);

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
  /* 소프트키 글자: 키보드가 떠 있어도 한 번에 눌리게 pointerdown 에서 처리 (글 쓰던 칸의 포커스를 뺏지 않음) */
  lcd.addEventListener("pointerdown", e => { const sk = e.target.closest("[data-sk]"); if (!sk || !big) return; e.preventDefault(); e.stopPropagation(); key(sk.dataset.sk); }, true);
  lcd.addEventListener("click", e => { if (e.target.closest("[data-sk]")) { e.stopPropagation(); } }, true);
  addEventListener("keydown", e => { if (e.key === "Escape" && !(e.target && e.target.tagName === "TEXTAREA")) closePhone(); });

  /* 바깥 작은 액정 */
  const subT = $("[data-subtime]"), subD = $("[data-subdate]"), subIc = $("[data-subic]"), subN = $("[data-subnote]");
  const batHTML = n => Array.from({ length: Math.max(0, Math.min(3, n)) }, (_, i) => `<i style="left:${1 + i * 4}px"></i>`).join("");
  document.querySelectorAll("[data-bat]").forEach(b => b.innerHTML = batHTML(P.battery ?? 2));
  function tick() {
    const d = now(), [t, ap] = hm12(d);
    subT.innerHTML = `${t}<small>${ap}</small>`; subD.textContent = `${d.getMonth() + 1}/${p2(d.getDate())} ${WE[d.getDay()]}`;
    lcd.querySelectorAll("[data-clk]").forEach(e => e.textContent = t);
    lcd.querySelectorAll("[data-ap]").forEach(e => e.textContent = ap === "A" ? "AM" : "PM");
    const missed = (P.calls || []).filter(c => c.dir === "missed" && !c.seen).length, unread = (P.messages || []).filter(m => !m.read).length;
    subIc.innerHTML = (unread ? `<span class="sl-ic">✉</span>` : "") + (missed ? `<span class="sl-ic">☎</span>` : "");
    subN.textContent = missed ? `${missed} Missed call${missed > 1 ? "s" : ""}` : unread ? `${unread} New msg` : "";
    lcd.querySelectorAll("[data-sbt]").forEach(e => e.textContent = `${p2(d.getHours())}:${p2(d.getMinutes())}`);
    let st0 = 0; try { st0 = S.t0; } catch (e) {}
    if (st0) { const S = { t0: st0 }; const s = Math.floor((Date.now() - S.t0) / 1000); lcd.querySelectorAll("[data-ctm]").forEach(e => e.textContent = `${p2(Math.floor(s / 60))}:${p2(s % 60)}`); }
  }
  setInterval(tick, 1000);

  /* ================= 큰 액정 화면 (흰색·회색·파랑의 옛 휴대폰 화면) ================= */
  P.sent = P.sent || []; P.memos = P.memos || [];
  (P.calls || []).sort((x, y) => String(y.when).localeCompare(String(x.when)));   // 통화목록은 최근 것부터
  const MENU = [
    { id: "contacts", label: "Phonebook" }, { id: "calls", label: "Call Log" },
    { id: "msg", label: "Messages" }, { id: "memo", label: "Memo" }, { id: "music", label: "Music" }
  ];
  /* 파란 단색 픽셀 아이콘 */
  const ICON = {
    contacts: `<rect x="3" y="2" width="10" height="12" fill="none" stroke="currentColor"/><rect x="5.5" y="4" width="5" height="4" fill="currentColor"/><path d="M5 11h6M5 12.5h4" stroke="currentColor"/>`,
    calls: `<path d="M4 2h2l1 3-1.5 1c.6 1.6 1.9 2.9 3.5 3.5L10 8l3 1v2c0 .8-.7 1.5-1.5 1.5C6.6 12.5 3 8.9 3 4c0-.8.4-2 1-2z" fill="currentColor"/>`,
    msg: `<rect x="2" y="4" width="12" height="9" fill="none" stroke="currentColor"/><path d="M2 4l6 5 6-5" fill="none" stroke="currentColor"/>`,
    memo: `<rect x="3" y="2" width="10" height="12" fill="none" stroke="currentColor"/><path d="M5 5h6M5 7.5h6M5 10h4" stroke="currentColor"/><path d="M11 10l2-2" stroke="currentColor"/>`,
    inbox: `<path d="M2 9l2-5h8l2 5v4H2z" fill="none" stroke="currentColor"/><path d="M2 9h4l1 2h2l1-2h4" fill="none" stroke="currentColor"/>`,
    sent: `<path d="M2 8l12-5-4 11-2-4z" fill="none" stroke="currentColor"/>`,
    write: `<path d="M3 13l1-3 7-7 2 2-7 7z" fill="none" stroke="currentColor"/>`,
    music: `<path d="M6 3l7-1.5V11" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6 3v9" stroke="currentColor" stroke-width="1.4"/><ellipse cx="4.3" cy="12.2" rx="2.2" ry="1.7" fill="currentColor"/><ellipse cx="11.3" cy="11.2" rx="2.2" ry="1.7" fill="currentColor"/>`
  };
  const ico = id => `<svg class="pi" viewBox="0 0 16 16">${ICON[id] || ""}</svg>`;
  const ANT = `<span class="ant"><b>T</b><i></i><i></i><i></i><i></i></span>`;
  const statusBar = () => `<div class="sb">${ANT}<span class="sbi">${(P.messages || []).some(m => !m.read) ? ico("msg") : ""}${M.on ? ico("music") : ""}</span><span class="r"><span data-sbt></span><span class="bat">${batHTML(P.battery ?? 2)}</span></span></div>`;
  const frame = (title, body, l = "", r = "", o = {}) => `<div class="scr${o.cls ? " " + o.cls : ""}">${statusBar()}${title ? `<div class="title"><span>${esc(title)}</span>${o.right ? `<em>${esc(o.right)}</em>` : ""}</div>` : ""}<div class="body">${body}</div><div class="softbar"><button type="button" data-sk="sl">${esc(l)}</button><span class="mid">${o.mid !== undefined ? esc(o.mid) : "▲▼"}</span><button type="button" data-sk="sr">${esc(r)}</button></div></div>`;
  const stamp = () => { const d = now(); return `${p2(d.getMonth() + 1)}/${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}`; };
  const bytes = s => [...s].reduce((n, c) => n + (c.charCodeAt(0) > 127 ? 2 : 1), 0);

  let S = { name: "off" }, popT = null, callT = [], talkT = null;
  function go(name, opt = {}) { S = { name, sel: 0, ...opt }; render(); }
  const listHTML = items => `<div class="list">${items.length ? items.map((it, i) => `<button class="li${i === S.sel ? " sel" : ""}" data-i="${i}"><span class="no">${i + 1}</span>${it.ic ? ico(it.ic) : ""}${it.dot ? `<i class="dot"></i>` : ""}<span class="lb">${esc(it.label)}</span><small>${esc(it.sub || "")}</small></button>`).join("") : `<div class="empty">No entries</div>`}</div>`;
  function render() {
    const n = S.name;
    if (n !== "edit" && typing()) document.activeElement.blur();   // 전송·저장·취소하면 자판이 내려감
    if (n === "idle") {
      const missed = (P.calls || []).filter(c => c.dir === "missed" && !c.seen).length, unread = (P.messages || []).filter(m => !m.read).length, d = now();
      lcd.innerHTML = frame("", `<div class="idle"><div class="ilogo">${esc(P.banner || "")}</div><div class="clk"><span data-clk></span><b data-ap></b></div><div class="dt">${WE[d.getDay()]}, ${MON[d.getMonth()]} ${p2(d.getDate())} ${d.getFullYear()}</div>
        ${missed || unread ? `<div class="note">${missed ? `<span>${ico("calls")}${missed} Missed call${missed > 1 ? "s" : ""}</span>` : ""}${unread ? `<span>${ico("msg")}${unread} New message${unread > 1 ? "s" : ""}</span>` : ""}</div>` : ""}</div>`, "Menu", "Contacts", { cls: "home", mid: "" });
    } else if (n === "dial") {
      lcd.innerHTML = frame("", `<div class="idle"><div class="dial"><small>${esc(nameOf(S.num))}</small>${esc(S.num)}</div></div>`, "Call", "Clear", { cls: "home", mid: "" });
    } else if (n === "menu") {
      lcd.innerHTML = frame(S.title || "Menu", `<div class="list mlist">${S.items.map((m, i) => `<button class="li big${i === S.sel ? " sel" : ""}" data-i="${i}"><span class="no">${i + 1}</span>${ico(m.id)}<span class="lb">${esc(m.label)}</span></button>`).join("")}</div>`, "Select", "Back", { right: S.right || "" });
    } else if (n === "list") {
      lcd.innerHTML = frame(S.title, listHTML(S.items), S.items.length ? (S.lbl || "Select") : "", "Back", { right: S.items.length ? `${S.sel + 1}/${S.items.length}` : "" });
      const el = lcd.querySelector(".li.sel"); if (el) el.scrollIntoView({ block: "nearest" });
    } else if (n === "read") {
      lcd.innerHTML = frame(S.title, `<div class="read ruled"><div class="meta">${esc(S.meta)}</div><div class="txt">${esc(S.text)}</div></div>`, S.l || "", "Back", { right: S.right || "" });
    } else if (n === "edit") {
      lcd.innerHTML = frame(S.title, `<div class="edit">${S.to != null ? `<div class="to">To: <b>${esc(S.to || "")}</b></div>` : ""}<textarea class="ta ruled" spellcheck="false" maxlength="${S.max || 80}">${esc(S.text || "")}</textarea></div>`, S.l || "Save", "Cancel", { right: "", mid: `${bytes(S.text || "")}/${S.max || 80}` });
      const ta = lcd.querySelector(".ta"), cnt = lcd.querySelector(".softbar .mid");
      ta.addEventListener("input", () => { S.text = ta.value; cnt.textContent = `${bytes(ta.value)}/${S.max || 80}`; });
      if (!TOUCH || big) setTimeout(() => { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }, 30);
    } else if (n === "player") {
      const s = SONGS[M.i] || {}, L = secs(s.len || "0:00");
      lcd.innerHTML = frame("Now Playing", `<div class="player"><div class="art">${ico("music")}<div class="eq${M.on ? " on" : ""}">${"<i></i>".repeat(7)}</div></div>
        <div class="trk">${M.i + 1}/${SONGS.length}</div><div class="stl"><span>${esc(s.title || "")}</span></div><div class="sar">${esc(s.artist || "")}</div>
        <div class="pb"><i data-pf style="width:${(M.t / (L || 1)) * 100}%"></i></div><div class="ptm"><span data-pc>${mmss(M.t)}</span><span>${esc(s.len || "")}</span></div>
        <div class="pctl"><span>|◀◀</span><b>${M.on ? "❚❚" : "▶"}</b><span>▶▶|</span></div></div>`, M.on ? "Pause" : "Play", "Back", { mid: "" });
      const st = lcd.querySelector(".stl span"); if (st && st.scrollWidth > st.parentNode.clientWidth) st.parentNode.classList.add("long");
    } else if (n === "talk") {   // 통화 녹음: 대화가 한 줄씩 올라옴
      const c = S.c, who = c.name;
      const done = S.n >= c.talk.length;
      if (S.live) {   // 실시간 통화: 통화 화면 + 아래 자막
        const cur = S.n > 0 ? c.talk[S.n - 1] : null;
        lcd.innerHTML = frame("", `<div class="incall"><div class="ava">${ico("calls")}</div><div class="who">${esc(who)}</div><div class="num">${esc(numberOf(who))}</div><div class="cst">${done ? "Call ended" : "Connected"} <span data-ctm></span></div>
          <div class="cap${cur ? " on" : ""}">${cur ? `<b>${cur.me ? "Me" : esc(who)}</b><span>${esc(cur.t)}</span>${cur.ko ? `<small>(${esc(cur.ko)})</small>` : ""}` : ""}</div></div>`, "", done ? "OK" : "End", { mid: "" });
        clearTimeout(talkT);
        if (!done) talkT = setTimeout(() => { if (S.name === "talk" && S.c === c) { S.n++; render(); } }, S.n === 0 ? 900 : 1500 + Math.min(3000, ((cur && cur.t.length) || 10) * 75));
        else if (!S.logged) { S.logged = true; P.calls.unshift(c); talkT = setTimeout(() => { if (S.name === "talk" && S.c === c) go("idle"); }, 3500); }
        tick(); return;
      }
      lcd.innerHTML = frame(S.live ? (done ? "Call Ended" : "Connected") : "Call Rec.", `<div class="talk ruled"><div class="meta">${S.live ? esc(who) : `${{ missed: "Missed", out: "Dialed", in: "Received" }[c.dir]} ${esc(c.when)}${c.dur ? " · " + esc(c.dur) : ""}`}</div>${c.talk.slice(0, S.n).map(l => `<div class="tl${l.me ? " me" : ""}"><b>${l.me ? "Me" : esc(who)}</b>${esc(l.t)}${l.ko ? `<small class="ko">(${esc(l.ko)})</small>` : ""}</div>`).join("")}${S.n < c.talk.length ? `<div class="tl wait">▪ ▪ ▪</div>` : `<div class="tl end">— End of call —</div>`}</div>`, S.live ? "" : "Call", S.live ? (done ? "OK" : "End") : "Back", { right: `${Math.min(S.n, c.talk.length)}/${c.talk.length}`, mid: S.n < c.talk.length ? "▶" : "■" });
      const tk = lcd.querySelector(".talk"); tk.scrollTop = tk.scrollHeight;
      clearTimeout(talkT);
      if (S.n < c.talk.length) { talkT = setTimeout(() => { if (S.name === "talk" && S.c === c) { S.n++; render(); } }, S.n === 0 ? 700 : 1300 + Math.min(2600, (c.talk[S.n - 1]?.t.length || 10) * 70)); }
      else if (S.live && !S.logged) { S.logged = true; P.calls.unshift(c); talkT = setTimeout(() => { if (S.name === "talk" && S.c === c) go("idle"); }, 3500); }   // 실시간 통화가 끝나면 통화목록에 남음
    } else if (n === "calling") {
      lcd.innerHTML = frame("", `<div class="calling"><div class="ani">${ico("calls")}</div><div class="who">${esc(S.who || "")}</div><div class="num">${esc(S.num)}</div><div class="st" data-cst>Calling…</div></div>`, "", "End", { mid: "" });
    }
    tick();
  }
  function pop(msg, then, ms = 1300) { const p = document.createElement("div"); p.className = "pop"; p.textContent = msg; lcd.querySelector(".body")?.appendChild(p); clearTimeout(popT); popT = setTimeout(() => { p.remove(); then && then(); }, ms); }
  const numberOf = name => (P.contacts || []).find(c => c.name === name)?.number || name;
  const nameOf = num => (P.contacts || []).find(c => c.number === num)?.name || "";

  const mainMenu = sel => go("menu", { items: MENU, sel: sel || 0, level: "main" });
  const msgMenu = sel => go("menu", { items: [{ id: "inbox", label: "Inbox" }, { id: "sent", label: "Sent" }, { id: "write", label: "Write New" }], sel: sel || 0, level: "msg", title: "Messages" });
  function openMenu(i) {
    const id = MENU[i].id;
    if (id === "contacts") return go("list", { title: "Phonebook", kind: "contacts", backTo: () => mainMenu(0), items: (P.contacts || []).map(c => ({ label: c.name, sub: c.number, data: c })) });
    if (id === "calls") return go("list", { title: "Call Log", kind: "calls", backTo: () => mainMenu(1), items: (P.calls || []).map(c => ({ label: c.name, sub: (c.dir === "out" ? "↗ " : c.dir === "in" ? "↙ " : "✕ ") + String(c.when).slice(0, 8), ic: "calls", dot: c.dir === "missed" && !c.seen, data: c })) });
    if (id === "msg") return msgMenu(0);
    if (id === "memo") return memoList();
    if (id === "music") return musicList(M.i);
  }
  /* 음악: 곡 목록 · 재생 화면 (재생은 화면 속에서만 흐름) */
  const SONGS = P.music || [];
  const secs = s => { const [m, x] = String(s).split(":").map(Number); return m * 60 + (x || 0); };
  const mmss = t => `${Math.floor(t / 60)}:${p2(Math.floor(t % 60))}`;
  const M = { i: 0, t: 0, on: false, iv: null };
  function musicTick() {
    if (!M.on) return; M.t += 1;
    if (M.t >= secs(SONGS[M.i].len)) { M.i = (M.i + 1) % SONGS.length; M.t = 0; if (S.name === "player") return render(); }
    if (S.name === "player") { const f = lcd.querySelector("[data-pf]"), c = lcd.querySelector("[data-pc]"); if (f) f.style.width = (M.t / secs(SONGS[M.i].len) * 100) + "%"; if (c) c.textContent = mmss(M.t); }
  }
  setInterval(musicTick, 1000);
  const musicList = sel => go("list", { title: "Music", kind: "music", sel: sel || 0, lbl: "Play", backTo: () => mainMenu(4), items: SONGS.map(s => ({ label: s.title, sub: s.artist, ic: "music", data: s })) });
  const inbox = sel => go("list", { title: "Inbox", kind: "inbox", sel: sel || 0, backTo: () => msgMenu(0), items: (P.messages || []).map(m => ({ label: m.from, sub: m.when, dot: !m.read, data: m })) });
  const sentBox = sel => go("list", { title: "Sent", kind: "sent", sel: sel || 0, backTo: () => msgMenu(1), items: P.sent.map(m => ({ label: m.to, sub: m.when, data: m })) });
  const memoList = sel => go("list", { title: "Memo", kind: "memo", sel: sel || 0, lbl: "Open", backTo: () => mainMenu(3), items: [{ label: "New Memo", ic: "write", data: null }, ...P.memos.map(m => ({ label: (m.text || "").split("\n")[0] || "(Empty)", sub: m.when, data: m }))] });
  const pickTo = after => go("list", { title: "Select Recipient", kind: "pickTo", after, backTo: () => msgMenu(2), items: (P.contacts || []).map(c => ({ label: c.name, sub: c.number, data: c })) });
  const compose = (to, back) => go("edit", { title: "Write Message", to, text: "", l: "Send", max: 80, mode: "sms", backTo: back });
  function pick() {
    const it = S.items[S.sel]; if (!it) return;
    const here = S.kind, sel = S.sel;
    if (here === "contacts") return go("read", { title: it.data.name, meta: "Mobile", text: it.data.number, call: it.data.number, smsTo: it.data.name, l: "Call", backTo: () => openMenu(0) });
    if (here === "calls" && it.data.talk) { it.data.seen = true; return go("talk", { c: it.data, n: 0, backTo: () => { openMenu(1); S.sel = sel; render(); } }); }
    if (here === "calls") { it.data.seen = true; } if (here === "calls") return go("read", { title: "Call Log", meta: { missed: "Missed", out: "Dialed", in: "Received" }[it.data.dir] + "  " + it.data.when, text: `${it.data.name}\n${numberOf(it.data.name)}`, call: numberOf(it.data.name), l: "Call", backTo: () => { openMenu(1); S.sel = sel; render(); } });
    if (here === "inbox") { it.data.read = true; const i = P.messages.indexOf(it.data); return go("read", { title: "Message", right: `${i + 1}/${P.messages.length}`, meta: `${it.data.from}  ${it.data.when}`, text: it.data.text, call: numberOf(it.data.from), smsTo: it.data.from, l: "Reply", backTo: () => inbox(sel) }); }
    if (here === "sent") return go("read", { title: "Sent", meta: `${it.data.to}  ${it.data.when}`, text: it.data.text, call: numberOf(it.data.to), l: "Call", backTo: () => sentBox(sel) });
    if (here === "memo") return it.data ? go("read", { title: "Memo", meta: it.data.when, text: it.data.text, l: "Edit", memo: it.data, backTo: () => memoList(sel) })
                                       : go("edit", { title: "New Memo", text: "", l: "Save", max: 200, mode: "memo", backTo: () => memoList(0) });
    if (here === "pickTo") return compose(it.data.name, () => pickTo());
    if (here === "music") { if (M.i !== sel) { M.i = sel; M.t = 0; } M.on = true; return go("player", {}); }
  }
  function save() {   // 편집 화면에서 저장/전송
    const ta = lcd.querySelector(".ta"); if (ta) S.text = ta.value;   // 조합 중인 글자까지 반영
    if (typing()) document.activeElement.blur();
    const t = (S.text || "").trim();
    if (!t) return pop("Enter text");
    if (S.mode === "sms") { P.sent.unshift({ to: S.to, when: stamp(), text: t }); const b = S.backTo; S.name = "sending"; return pop("Message sent", () => msgMenu(1)); }
    if (S.mode === "memo") { if (S.memo) { S.memo.text = t; S.memo.when = stamp(); } else P.memos.unshift({ text: t, when: stamp() }); return pop("Saved", () => memoList(S.memo ? P.memos.indexOf(S.memo) + 1 : 1)); }
  }
  function startCall(num) {
    stopCall(); clearTimeout(talkT); const who = nameOf(num) || (P.contacts || []).find(c => c.name === num)?.name || "";
    go("calling", { num: numberOf(num), who });
    tone([440, 480], 1.2, .03, .4);
    const sc = (P.scripts || {})[who];
    if (sc) {   // 전화번호부에서 건 전화: 상대가 받으면 대본이 한 줄씩
      callT.push(setTimeout(() => { if (S.name !== "calling") return; click(.3, 0, 1600); const d = now();
        go("talk", { live: true, n: 0, t0: Date.now(), c: { name: who, dir: "out", when: `${String(d.getFullYear()).slice(2)}/${stamp()}`, dur: "", talk: sc } }); }, 2600));
      return;
    }
    tone([440, 480], 1.2, .03, 4.4);
    callT.push(setTimeout(() => { const s = lcd.querySelector("[data-cst]"); if (s) s.textContent = "No answer"; }, 7000));
    callT.push(setTimeout(() => { if (S.name === "calling") go("idle"); }, 9000));
  }
  function stopCall() { callT.forEach(clearTimeout); callT = []; }

  /* ================= 키 입력 ================= */
  function key(k) {
    if (!opened) return;
    keyBeep(k);
    if (k === "menu") k = "sl";
    if (k === "jump" || k === "cam" || k === "nate") return;   // 쓰지 않는 키
    if (k === "ph") { stopCall(); return openMenu(0); }   // 위쪽 전화부 키
    const n = S.name, digit = /^[0-9*#]$/.test(k);
    if (k === "end") { if (S.name === "talk" && S.live && !S.logged) { S.logged = true; P.calls.unshift(S.c); } clearTimeout(talkT); stopCall(); return go("idle"); }
    if (n === "idle") {
      if (digit) return go("dial", { num: k });
      if (k === "ok" || k === "sl") return mainMenu(0);
      if (k === "sr" || k === "down") return openMenu(0);
      if (k === "send" || k === "up") return openMenu(1);
      if (k === "left") return openMenu(2);
      if (k === "right") return openMenu(3);
      return;
    }
    if (n === "dial") {
      if (digit) { S.num = (S.num + k).slice(0, 20); return render(); }
      if (k === "clr" || k === "sr") { S.num = S.num.slice(0, -1); return S.num ? render() : go("idle"); }
      if (k === "send" || k === "ok" || k === "sl") return startCall(S.num);
      return;
    }
    if (n === "menu") {
      const L = S.items.length;
      if (k === "up" || k === "down") { S.sel = (S.sel + (k === "up" ? -1 : 1) + L) % L; return render(); }
      const open = i => { if (S.level === "main") return openMenu(i); const id = S.items[i].id; return id === "inbox" ? inbox() : id === "sent" ? sentBox() : pickTo(); };
      if (k === "ok" || k === "sl" || k === "right") return open(S.sel);
      if (/^[1-9]$/.test(k) && +k <= L) { S.sel = +k - 1; render(); return open(S.sel); }
      if (k === "clr" || k === "sr" || k === "left") return S.level === "main" ? go("idle") : mainMenu(2);
      return;
    }
    if (n === "list") {
      if (k === "up" || k === "down") { if (!S.items.length) return; S.sel = (S.sel + (k === "up" ? -1 : 1) + S.items.length) % S.items.length; return render(); }
      if (k === "ok" || k === "sl" || k === "right") return pick();
      if (k === "send" && S.items[S.sel] && S.kind !== "memo") { const d = S.items[S.sel].data; return d && startCall(d.number || numberOf(d.name || d.from || d.to)); }
      if (/^[1-9]$/.test(k) && S.items[+k - 1]) { S.sel = +k - 1; render(); return pick(); }
      if (k === "clr" || k === "sr" || k === "left") return S.backTo ? S.backTo() : mainMenu(0);
      return;
    }
    if (n === "read") {
      if (k === "up" || k === "down") { const r = lcd.querySelector(".read"); r.scrollTop += k === "up" ? -36 : 36; return; }
      if (k === "send" && S.call) return startCall(S.call);
      if (k === "ok" || k === "sl") {
        if (S.memo) return go("edit", { title: "Edit Memo", text: S.memo.text, l: "Save", max: 200, mode: "memo", memo: S.memo, backTo: S.backTo });
        if (S.l === "Reply" && S.smsTo) { const back = S.backTo; return compose(S.smsTo, back); }
        if (S.call) return startCall(S.call);
        return;
      }
      if (k === "clr" || k === "sr" || k === "left") return S.backTo ? S.backTo() : go("idle");
      return;
    }
    if (n === "edit") {
      if (k === "ok" || k === "sl") return save();
      if (k === "sr") return S.backTo ? S.backTo() : go("idle");
      if (k === "clr") { if (S.text) { S.text = S.text.slice(0, -1); return render(); } return S.backTo ? S.backTo() : go("idle"); }
      if (digit) { S.text = (S.text || "") + k; return render(); }
      return;
    }
    if (n === "talk") {
      if (k === "up" || k === "down") { const r = lcd.querySelector(".talk"); r.scrollTop += k === "up" ? -36 : 36; return; }
      if (k === "ok" || k === "right") { if (S.n < S.c.talk.length) { S.n++; return render(); } return; }   // 다음 줄 바로 보기
      if (S.live) { if (k === "sr" || k === "clr" || k === "end") { clearTimeout(talkT); if (!S.logged) { S.logged = true; P.calls.unshift(S.c); } return go("idle"); } return; }
      if (k === "send" || k === "sl") return startCall(numberOf(S.c.name));
      if (k === "clr" || k === "sr" || k === "left") { clearTimeout(talkT); return S.backTo(); }
      return;
    }
    if (n === "player") {
      if (k === "ok" || k === "sl") { M.on = !M.on; return render(); }
      if (k === "left" || k === "right") { M.i = (M.i + (k === "left" ? -1 : 1) + SONGS.length) % SONGS.length; M.t = 0; return render(); }
      if (k === "clr" || k === "sr" || k === "up") return musicList(M.i);
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
    if (S.name === "talk" && !e.target.closest("[data-sk]")) { if (S.n < S.c.talk.length) { S.n = S.c.talk.length; render(); } return; }   // 한 번 누르면 대본 끝까지 바로
    const b = e.target.closest("[data-i]"); if (!b) return; const i = +b.dataset.i;
    if (S.name === "menu" || S.name === "list") { S.sel = i; render(); key("ok"); }
  });
  /* 키보드로도 조작 (PC). 글 쓰는 중에는 글자 입력이 우선 */
  const KB = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", Enter: "ok", Backspace: "clr", F1: "sl", F2: "sr" };
  addEventListener("keydown", e => {
    if (!opened) return;
    if (e.target && e.target.tagName === "TEXTAREA") { if (e.key === "Escape") { e.preventDefault(); key("sr"); } return; }
    const k = KB[e.key] || (/^[0-9*#]$/.test(e.key) ? e.key : null); if (k) { e.preventDefault(); key(k); }
  });

  go("off");
  tick();
})();
