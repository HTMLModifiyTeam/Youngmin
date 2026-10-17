/* =========================================================
   ✏️ 여기만 고치면 내용이 바뀝니다. (1994년 컴퓨터)
   - 지금 들어 있는 내용은 화면 확인용 임시 내용입니다.
   ========================================================= */

window.PC = {
  owner: "YOUNGMIN",
  date: "1994-11-12",          // 컴퓨터 속 날짜 (YYYY-MM-DD)
  time: "23:41:05",            // 처음 켠 순간의 시각. 이후 실제 시간만큼 흘러감
  cpu: "486DX2-66",
  memoryKB: 8192,
  hddMB: 420,

  /* 파일: 경로 · 크기(바이트) · 날짜 · 내용
     password 를 넣으면 열 때 암호를 물어봄
     kind: "text"(기본) · "image"(caption 만 보여 줌) · "exe"(실행 안 됨) */
  files: [
    { path: "C:\\AUTOEXEC.BAT", date: "94-03-02 10:12", text: "@ECHO OFF\nPROMPT $P$G\nPATH C:\\DOS;C:\\WINDOWS;C:\\HNC\nC:\\DOS\\SMARTDRV.EXE\nWIN" },
    { path: "C:\\CONFIG.SYS", date: "94-03-02 10:10", text: "DEVICE=C:\\DOS\\HIMEM.SYS\nDOS=HIGH,UMB\nFILES=40\nBUFFERS=20" },
    { path: "C:\\DOC\\메모.TXT", date: "94-11-12 22:58", text: "(임시 내용) 메모 파일입니다.\n여기에 내용을 넣으면 됩니다." },
    { path: "C:\\DOC\\일기.TXT", date: "94-11-10 01:22", text: "(임시 내용) 일기 파일입니다." },
    { path: "C:\\DOC\\비밀.TXT", date: "94-11-11 03:05", password: "1994", text: "(임시 내용) 암호가 걸린 파일입니다. 암호는 1994." },
    { path: "C:\\DOC\\사진1.BMP", date: "94-09-30 14:20", kind: "image", caption: "(임시) 사진 설명" },
    { path: "C:\\GAMES\\TETRIS.EXE", date: "93-12-24 09:00", kind: "exe", size: 48211 }
  ],

  /* PC통신 (가상의 통신망) */
  bbs: {
    name: "푸른하늘",
    phone: "01430",
    id: "youngmin",
    mail: [
      { from: "friend01", date: "94/11/12 21:10", title: "(임시) 메일 제목", body: "(임시 내용) 전자우편 본문입니다." },
      { from: "sysop", date: "94/11/01 09:00", title: "푸른하늘에 오신 것을 환영합니다", body: "가입을 환영합니다.\n즐거운 통신 생활 되십시오." }
    ],
    boards: [
      { name: "자유게시판", posts: [
        { no: 1024, from: "guest77", date: "94/11/12", title: "(임시) 게시물 제목", body: "(임시 내용) 게시물 본문입니다." },
        { no: 1023, from: "youngmin", date: "94/11/11", title: "(임시) 내가 쓴 글", body: "(임시 내용)" }
      ] }
    ]
  }
};
