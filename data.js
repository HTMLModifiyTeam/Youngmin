/* =========================================================
   ✏️ 여기만 고치면 내용이 바뀝니다. (2000년대 초 폴더폰)
   - 지금 들어 있는 내용은 화면 확인용 임시 내용입니다.
   ========================================================= */

window.PHONE = {
  owner: "영민",
  date: "2003-05-09",        // 휴대폰 속 날짜 (YYYY-MM-DD)
  time: "15:00:00",          // 처음 연 순간의 시각. 이후 실제 시간만큼 흘러감
  battery: 2,                // 배터리 칸 수 (0~3)
  banner: "",                // 대기화면 문구 (비우면 표시 안 함)

  /* 전화번호부 */
  contacts: [
    { name: "엄마", number: "011-234-5678" },
    { name: "아빠", number: "011-9021-4417" },
    { name: "할아버지", number: "02-764-3318" },
    { name: "수일이 형", number: "016-345-6789" },
    { name: "Jake", number: "017-552-0931" },
    { name: "Ethan Miller", number: "019-277-8104" },
    { name: "Ryan", number: "016-803-2265" },
    { name: "Marcus Lee", number: "011-460-7392" }
  ],

  /* 통화목록: dir = in(받은) · out(건) · missed(부재중) */
  calls: [
    { name: "엄마", dir: "missed", when: "05/09 14:12" },
    { name: "수일이 형", dir: "in", when: "05/09 01:47" },
    { name: "Jake", dir: "out", when: "05/08 22:40" }
  ],

  /* 문자: 받은 메시지 */
  messages: [
    { from: "Jake", when: "05/09 13:05", text: "(임시 내용) 문자 메시지입니다." },
    { from: "엄마", when: "05/08 19:30", text: "(임시 내용) 밥 먹었니" }
  ],

  /* 보낸 문자 */
  sent: [
    { to: "수일이 형", when: "05/08 22:41", text: "(임시 내용) 보낸 문자입니다." }
  ],

  /* 메모 (첫 줄이 목록 제목) */
  memos: [
    { when: "05/07 23:10", text: "(임시) 메모 제목\n메모 내용이 들어갑니다." }
  ],

  /* 음악: 90년대 말 미국 팝 (곡 정보만. 실제 음원은 넣지 않음) */
  music: [
    { title: "...Baby One More Time", artist: "Britney Spears", len: "3:30" },
    { title: "I Want It That Way", artist: "Backstreet Boys", len: "3:33" },
    { title: "Genie in a Bottle", artist: "Christina Aguilera", len: "3:36" },
    { title: "No Scrubs", artist: "TLC", len: "3:34" },
    { title: "Livin' la Vida Loca", artist: "Ricky Martin", len: "4:03" },
    { title: "Smooth", artist: "Santana feat. Rob Thomas", len: "4:56" },
    { title: "Iris", artist: "Goo Goo Dolls", len: "4:49" },
    { title: "Tearin' Up My Heart", artist: "*NSYNC", len: "3:31" },
    { title: "Bills, Bills, Bills", artist: "Destiny's Child", len: "4:16" },
    { title: "All Star", artist: "Smash Mouth", len: "3:20" },
    { title: "Semi-Charmed Life", artist: "Third Eye Blind", len: "4:28" },
    { title: "MMMBop", artist: "Hanson", len: "3:58" }
  ]
};
