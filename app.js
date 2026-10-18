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
  addEventListener("keydown", e => { if (e.key === "Escape" && !(e.target && e.target.tagName === "TEXTAREA")) closePhone(); });

  /* 바깥 작은 액정 */
  const subT = $("[data-subtime]"), subD = $("[data-subdate]"), subIc = $("[data-subic]"), subN = $("[data-subnote]");
  const batHTML = n => Array.from({ length: Math.max(0, Math.min(3, n)) }, (_, i) => `<i style="left:${1 + i * 4}px"></i>`).join("");
  document.querySelectorAll("[data-bat]").forEach(b => b.innerHTML = batHTML(P.battery ?? 2));
  function tick() {
    const d = now(), [t, ap] = hm12(d);
    subT.innerHTML = `${t}<small>${ap}</small>`; subD.textContent = `${d.getMonth() + 1}/${p2(d.getDate())} (${W[d.getDay()]})`;
    lcd.querySelectorAll("[data-clk]").forEach(e => e.textContent = t);
    lcd.querySelectorAll("[data-ap]").forEach(e => e.textContent = ap === "A" ? "AM" : "PM");
    const missed = (P.calls || []).filter(c => c.dir === "missed").length, unread = (P.messages || []).filter(m => !m.read).length;
    subIc.innerHTML = (unread ? `<span class="sl-ic">✉</span>` : "") + (missed ? `<span class="sl-ic">☎</span>` : "");
    subN.textContent = missed ? `부재중 ${missed}통` : unread ? `새 메시지 ${unread}개` : "";
    lcd.querySelectorAll("[data-sbt]").forEach(e => e.textContent = `${p2(d.getHours())}:${p2(d.getMinutes())}`);
  }
  setInterval(tick, 1000);

  /* ================= 큰 액정 화면 (흰색·회색·파랑의 옛 휴대폰 화면) ================= */
  P.sent = P.sent || []; P.memos = P.memos || [];
  const MENU = [
    { id: "contacts", label: "전화번호부" }, { id: "calls", label: "통화목록" },
    { id: "msg", label: "문자" }, { id: "memo", label: "메모" }
  ];
  /* 파란 단색 픽셀 아이콘 */
  const ICON = {
    contacts: `<rect x="3" y="2" width="10" height="12" fill="none" stroke="currentColor"/><rect x="5.5" y="4" width="5" height="4" fill="currentColor"/><path d="M5 11h6M5 12.5h4" stroke="currentColor"/>`,
    calls: `<path d="M4 2h2l1 3-1.5 1c.6 1.6 1.9 2.9 3.5 3.5L10 8l3 1v2c0 .8-.7 1.5-1.5 1.5C6.6 12.5 3 8.9 3 4c0-.8.4-2 1-2z" fill="currentColor"/>`,
    msg: `<rect x="2" y="4" width="12" height="9" fill="none" stroke="currentColor"/><path d="M2 4l6 5 6-5" fill="none" stroke="currentColor"/>`,
    memo: `<rect x="3" y="2" width="10" height="12" fill="none" stroke="currentColor"/><path d="M5 5h6M5 7.5h6M5 10h4" stroke="currentColor"/><path d="M11 10l2-2" stroke="currentColor"/>`,
    inbox: `<path d="M2 9l2-5h8l2 5v4H2z" fill="none" stroke="currentColor"/><path d="M2 9h4l1 2h2l1-2h4" fill="none" stroke="currentColor"/>`,
    sent: `<path d="M2 8l12-5-4 11-2-4z" fill="none" stroke="currentColor"/>`,
    write: `<path d="M3 13l1-3 7-7 2 2-7 7z" fill="none" stroke="currentColor"/>`
  };
  const ico = id => `<svg class="pi" viewBox="0 0 16 16">${ICON[id] || ""}</svg>`;
  const ANT = `<span class="ant"><b>T</b><i></i><i></i><i></i><i></i></span>`;
  const statusBar = () => `<div class="sb">${ANT}<span class="sbi">${(P.messages || []).some(m => !m.read) ? ico("msg") : ""}</span><span class="r"><span data-sbt></span><span class="bat">${batHTML(P.battery ?? 2)}</span></span></div>`;
  const frame = (title, body, l = "", r = "", o = {}) => `<div class="scr${o.cls ? " " + o.cls : ""}">${statusBar()}${title ? `<div class="title"><span>${esc(title)}</span>${o.right ? `<em>${esc(o.right)}</em>` : ""}</div>` : ""}<div class="body">${body}</div><div class="softbar"><span data-sk="sl">${esc(l)}</span><span class="mid">${o.mid !== undefined ? esc(o.mid) : "▲▼"}</span><span data-sk="sr">${esc(r)}</span></div></div>`;
  const stamp = () => { const d = now(); return `${p2(d.getMonth() + 1)}/${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}`; };
  const bytes = s => [...s].reduce((n, c) => n + (c.charCodeAt(0) > 127 ? 2 : 1), 0);

  let S = { name: "off" }, popT = null, callT = [];
  function go(name, opt = {}) { S = { name, sel: 0, ...opt }; render(); }
  const listHTML = items => `<div class="list">${items.length ? items.map((it, i) => `<button class="li${i === S.sel ? " sel" : ""}" data-i="${i}"><span class="no">${i + 1}</span>${it.ic ? ico(it.ic) : ""}${it.dot ? `<i class="dot"></i>` : ""}<span class="lb">${esc(it.label)}</span><small>${esc(it.sub || "")}</small></button>`).join("") : `<div class="empty">저장된 항목이 없습니다</div>`}</div>`;
  function render() {
    const n = S.name;
    if (n === "idle") {
      const missed = (P.calls || []).filter(c => c.dir === "missed").length, unread = (P.messages || []).filter(m => !m.read).length, d = now();
      lcd.innerHTML = frame("", `<div class="idle"><div class="ilogo">${esc(P.banner || "")}</div><div class="clk"><span data-clk></span><b data-ap></b></div><div class="dt">${d.getFullYear()}.${p2(d.getMonth() + 1)}.${p2(d.getDate())} ${W[d.getDay()]}요일</div>
        ${missed || unread ? `<div class="note">${missed ? `<span>${ico("calls")}부재중 전화 ${missed}통</span>` : ""}${unread ? `<span>${ico("msg")}새 문자 ${unread}개</span>` : ""}</div>` : ""}</div>`, "메뉴", "전화부", { cls: "home", mid: "" });
    } else if (n === "dial") {
      lcd.innerHTML = frame("", `<div class="idle"><div class="dial"><small>${esc(nameOf(S.num))}</small>${esc(S.num)}</div></div>`, "통화", "지우기", { cls: "home", mid: "" });
    } else if (n === "menu") {
      lcd.innerHTML = frame("메뉴", `<div class="list mlist">${S.items.map((m, i) => `<button class="li big${i === S.sel ? " sel" : ""}" data-i="${i}"><span class="no">${i + 1}</span>${ico(m.id)}<span class="lb">${esc(m.label)}</span></button>`).join("")}</div>`, "선택", "이전", { right: S.right || "" });
    } else if (n === "list") {
      lcd.innerHTML = frame(S.title, listHTML(S.items), S.items.length ? (S.lbl || "선택") : "", "이전", { right: S.items.length ? `${S.sel + 1}/${S.items.length}` : "" });
      const el = lcd.querySelector(".li.sel"); if (el) el.scrollIntoView({ block: "nearest" });
    } else if (n === "read") {
      lcd.innerHTML = frame(S.title, `<div class="read ruled"><div class="meta">${esc(S.meta)}</div><div class="txt">${esc(S.text)}</div></div>`, S.l || "", "이전", { right: S.right || "" });
    } else if (n === "edit") {
      lcd.innerHTML = frame(S.title, `<div class="edit">${S.to != null ? `<div class="to">받는사람: <b>${esc(S.to || "")}</b></div>` : ""}<textarea class="ta ruled" spellcheck="false" maxlength="${S.max || 80}">${esc(S.text || "")}</textarea></div>`, S.l || "저장", "취소", { right: "", mid: `${bytes(S.text || "")}/${S.max || 80}` });
      const ta = lcd.querySelector(".ta"), cnt = lcd.querySelector(".softbar .mid");
      ta.addEventListener("input", () => { S.text = ta.value; cnt.textContent = `${bytes(ta.value)}/${S.max || 80}`; });
      if (!TOUCH || big) setTimeout(() => { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }, 30);
    } else if (n === "calling") {
      lcd.innerHTML = frame("", `<div class="calling"><div class="ani">${ico("calls")}</div><div class="who">${esc(S.who || "")}</div><div class="num">${esc(S.num)}</div><div class="st" data-cst>연결 중…</div></div>`, "", "종료", { mid: "" });
    }
    tick();
  }
  function pop(msg, then, ms = 1300) { const p = document.createElement("div"); p.className = "pop"; p.textContent = msg; lcd.querySelector(".body")?.appendChild(p); clearTimeout(popT); popT = setTimeout(() => { p.remove(); then && then(); }, ms); }
  const numberOf = name => (P.contacts || []).find(c => c.name === name)?.number || name;
  const nameOf = num => (P.contacts || []).find(c => c.number === num)?.name || "";

  const mainMenu = sel => go("menu", { items: MENU, sel: sel || 0, level: "main" });
  const msgMenu = sel => go("menu", { items: [{ id: "inbox", label: "받은 문자함" }, { id: "sent", label: "보낸 문자함" }, { id: "write", label: "문자 작성" }], sel: sel || 0, level: "msg", title: "문자" });
  function openMenu(i) {
    const id = MENU[i].id;
    if (id === "contacts") return go("list", { title: "전화번호부", kind: "contacts", backTo: () => mainMenu(0), items: (P.contacts || []).map(c => ({ label: c.name, sub: c.number, data: c })) });
    if (id === "calls") return go("list", { title: "통화목록", kind: "calls", backTo: () => mainMenu(1), items: (P.calls || []).map(c => ({ label: c.name, sub: c.when, ic: "calls", dot: c.dir === "missed", data: c })) });
    if (id === "msg") return msgMenu(0);
    if (id === "memo") return memoList();
  }
  const inbox = sel => go("list", { title: "받은 문자함", kind: "inbox", sel: sel || 0, backTo: () => msgMenu(0), items: (P.messages || []).map(m => ({ label: m.from, sub: m.when, dot: !m.read, data: m })) });
  const sentBox = sel => go("list", { title: "보낸 문자함", kind: "sent", sel: sel || 0, backTo: () => msgMenu(1), items: P.sent.map(m => ({ label: m.to, sub: m.when, data: m })) });
  const memoList = sel => go("list", { title: "메모", kind: "memo", sel: sel || 0, lbl: "열기", backTo: () => mainMenu(3), items: [{ label: "새 메모 쓰기", ic: "write", data: null }, ...P.memos.map(m => ({ label: (m.text || "").split("\n")[0] || "(빈 메모)", sub: m.when, data: m }))] });
  const pickTo = after => go("list", { title: "받는사람 선택", kind: "pickTo", after, backTo: () => msgMenu(2), items: (P.contacts || []).map(c => ({ label: c.name, sub: c.number, data: c })) });
  const compose = (to, back) => go("edit", { title: "문자 작성", to, text: "", l: "전송", max: 80, mode: "sms", backTo: back });
  function pick() {
    const it = S.items[S.sel]; if (!it) return;
    const here = S.kind, sel = S.sel;
    if (here === "contacts") return go("read", { title: it.data.name, meta: "휴대폰", text: it.data.number, call: it.data.number, smsTo: it.data.name, l: "통화", backTo: () => openMenu(0) });
    if (here === "calls") return go("read", { title: "통화목록", meta: { missed: "부재중 전화", out: "건 전화", in: "받은 전화" }[it.data.dir] + "  " + it.data.when, text: `${it.data.name}\n${numberOf(it.data.name)}`, call: numberOf(it.data.name), l: "통화", backTo: () => { openMenu(1); S.sel = sel; render(); } });
    if (here === "inbox") { it.data.read = true; const i = P.messages.indexOf(it.data); return go("read", { title: "받은 문자", right: `${i + 1}/${P.messages.length}`, meta: `${it.data.from}  ${it.data.when}`, text: it.data.text, call: numberOf(it.data.from), smsTo: it.data.from, l: "답장", backTo: () => inbox(sel) }); }
    if (here === "sent") return go("read", { title: "보낸 문자", meta: `${it.data.to}  ${it.data.when}`, text: it.data.text, call: numberOf(it.data.to), l: "통화", backTo: () => sentBox(sel) });
    if (here === "memo") return it.data ? go("read", { title: "메모", meta: it.data.when, text: it.data.text, l: "수정", memo: it.data, backTo: () => memoList(sel) })
                                       : go("edit", { title: "새 메모", text: "", l: "저장", max: 200, mode: "memo", backTo: () => memoList(0) });
    if (here === "pickTo") return compose(it.data.name, () => pickTo());
  }
  function save() {   // 편집 화면에서 저장/전송
    const t = (S.text || "").trim();
    if (!t) return pop("내용을 입력하세요");
    if (S.mode === "sms") { P.sent.unshift({ to: S.to, when: stamp(), text: t }); const b = S.backTo; S.name = "sending"; return pop("메시지를 보냈습니다", () => msgMenu(1)); }
    if (S.mode === "memo") { if (S.memo) { S.memo.text = t; S.memo.when = stamp(); } else P.memos.unshift({ text: t, when: stamp() }); return pop("저장되었습니다", () => memoList(S.memo ? P.memos.indexOf(S.memo) + 1 : 1)); }
  }
  function startCall(num) {
    stopCall(); const who = nameOf(num) || (P.contacts || []).find(c => c.name === num)?.name || "";
    go("calling", { num: numberOf(num), who });
    tone([440, 480], 1.2, .03, .4); tone([440, 480], 1.2, .03, 4.4);
    callT.push(setTimeout(() => { const s = lcd.querySelector("[data-cst]"); if (s) s.textContent = "상대방이 받지 않습니다"; }, 7000));
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
    if (k === "end") { stopCall(); return go("idle"); }
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
        if (S.memo) return go("edit", { title: "메모 수정", text: S.memo.text, l: "저장", max: 200, mode: "memo", memo: S.memo, backTo: S.backTo });
        if (S.l === "답장" && S.smsTo) { const back = S.backTo; return compose(S.smsTo, back); }
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
    if (n === "calling") { if (k === "sr" || k === "clr") { stopCall(); go("idle"); } }
  }
  document.querySelectorAll("[data-k]").forEach(b => {
    b.addEventListener("pointerdown", e => { e.preventDefault(); b.classList.add("press"); key(b.dataset.k); });
    const up = () => b.classList.remove("press"); b.addEventListener("pointerup", up); b.addEventListener("pointerleave", up); b.addEventListener("pointercancel", up);
  });
  /* 화면을 직접 눌러도 선택 */
  lcd.addEventListener("click", e => {
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
