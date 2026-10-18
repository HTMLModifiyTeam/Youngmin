/* =========================================================
   ✏️ 여기만 고치면 내용이 바뀝니다. (2000년대 초 폴더폰)
   - 지금 들어 있는 내용은 화면 확인용 임시 내용입니다.
   ========================================================= */

window.PHONE = {
  owner: "강민재",
  date: "1999-11-05",        // 휴대폰 속 날짜 (YYYY-MM-DD)
  time: "23:40:00",          // 처음 연 순간의 시각. 이후 실제 시간만큼 흘러감
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

  /* 통화목록 (날짜순 자동 정렬). dir = in(받은) · out(건) · missed(부재중), seen = 이미 확인한 부재중
     talk 가 있으면 누를 때 통화 녹음처럼 대화가 한 줄씩 나옴 (me: true = 민재). 화면을 한 번 누르면 끝까지 바로 */
  calls: [
    /* ── 아빠 (민재는 존댓말) ── */
    { name: "아빠", dir: "in", when: "94/03/01 21:30", dur: "1:58", talk: [
      { t: "탑승 수속은 끝났냐?" },
      { me: true, t: "네, 아빠. 이제 들어가려고요." },
      { t: "가서 한눈팔지 말고 공부만 해라." },
      { me: true, t: "네. 잘할게요." },
      { t: "도착하면 연락하고." } ] },
    { name: "아빠", dir: "out", when: "94/03/10 20:40", dur: "2:05", talk: [
      { me: true, t: "아빠, 저 잘 지내고 있어요. 학교도 생각보다 괜찮아요." },
      { t: "그래. 처음이 중요하다. 수업은 따라갈 만하고?" },
      { me: true, t: "네, 아직은요. 단어 외우느라 바빠요." },
      { t: "그래, 열심히 해라." } ] },
    { name: "아빠", dir: "out", when: "94/04/12 22:05", dur: "2:20", talk: [
      { me: true, t: "아빠, 저 사실 좀 힘들어요." },
      { t: "뭐가." },
      { me: true, t: "그냥… 다요. 한국으로 돌아가면 안 돼요? 엄마랑 아빠 보고 싶어요." },
      { t: "아직 적응을 덜 해서 그래. 다들 처음엔 그런다." },
      { t: "공부 더 열심히 해라. 그러면 괜찮아진다." },
      { me: true, t: "……네." } ] },
    { name: "아빠", dir: "out", when: "94/05/03 23:12", dur: "1:46", talk: [
      { me: true, t: "아빠, 저 진짜 돌아가고 싶어요. 가족들 보고 싶어요." },
      { t: "민재야, 또 그 소리냐." },
      { t: "남들은 가고 싶어도 못 가는 데다. 처음엔 다 힘든 거다. 버텨라." },
      { me: true, t: "……" },
      { me: true, t: "……알겠어요." } ] },
    { name: "아빠", dir: "out", when: "99/10/30 00:41", dur: "2:37", talk: [
      { t: "여보세요. …민재냐? 이 시간에 웬일이야." },
      { me: true, t: "아빠, 저 진짜 못 하겠어요." },
      { t: "또 그 소리야?" },
      { me: true, t: "매일 맞아요. 학교에서 걔들한테 매일 맞는다고요!" },
      { me: true, t: "이러다가 진짜 죽어버릴 것 같아요. 숨도 못 쉬겠어요!" },
      { me: true, t: "아빠, 제발… 제발 저 좀 데려가 주세요!" },
      { t: "민재야, 진정하고—" },
      { me: true, t: "숨을 못 쉬겠다고요!!" } ] },

    /* ── 수일이 형 (7개, 대부분 힘들어하는 모습) ── */
    { name: "수일이 형", dir: "out", when: "94/03/01 22:10", dur: "3:12", talk: [
      { me: true, t: "형, 나 이제 들어가." },
      { t: "그래. 짐은 다 챙겼고?" },
      { me: true, t: "응. 여권도 세 번 확인했어." },
      { me: true, t: "형, 나 잘 할 수 있을 것 같아. 너무 걱정하지는 마." },
      { t: "그래, 민재야. 공부 열심히 하고. 언제든 연락하렴." } ] },
    { name: "수일이 형", dir: "out", when: "94/06/18 13:30", dur: "3:02", talk: [
      { me: true, t: "형, 나 오늘 점심으로 핫도그 먹었어." },
      { me: true, t: "길에서 파는 건데 1달러야. 진짜 커." },
      { t: "그것만 먹지 말고 밥도 좀 챙겨 먹어." },
      { me: true, t: "응. 근데 형… 점심은 그냥 밖에서 혼자 먹는 게 편해." },
      { t: "왜, 식당은 별로야?" },
      { me: true, t: "……그냥. 시끄러워서." } ] },
    { name: "수일이 형", dir: "out", when: "95/12/24 19:12", dur: "5:37", talk: [
      { me: true, t: "형, 메리 크리스마스. 여기 눈 엄청 와." },
      { t: "너도 메리 크리스마스. 크리스마스에 뭐 해?" },
      { me: true, t: "그냥 방에 있어. 창밖 보면서." },
      { t: "……혼자?" },
      { me: true, t: "응. 괜찮아. 조용해서 좋아." },
      { t: "형이 카드 보냈다. 곧 도착할 거야." } ] },
    { name: "수일이 형", dir: "in", when: "97/05/11 20:30", dur: "2:54", talk: [
      { t: "요즘 통 연락이 없네. 바쁘냐?" },
      { me: true, t: "응… 그냥." },
      { t: "목소리에 힘이 하나도 없다. 밥은 먹고 다녀?" },
      { me: true, t: "…입맛이 없어." },
      { t: "민재야, 무슨 일 있으면—" },
      { me: true, t: "형, 나 수업 들어가야 돼. 끊을게." } ] },
    { name: "수일이 형", dir: "out", when: "98/09/07 23:55", dur: "3:19", talk: [
      { t: "민재야? 이 시간에 웬일이야." },
      { me: true, t: "그냥… 형 목소리 듣고 싶어서." },
      { t: "오늘따라 목소리가 안 좋다. 무슨 일 있어?" },
      { me: true, t: "사실은…" },
      { me: true, t: "……" },
      { me: true, t: "아니야. 아무것도 아니야." },
      { t: "민재야." },
      { me: true, t: "진짜야. 그냥 좀 피곤해서 그래." } ] },
    { name: "수일이 형", dir: "in", when: "99/03/02 21:05", dur: "6:41", talk: [
      { t: "요즘은 좀 어때?" },
      { me: true, t: "그냥… 그렇지 뭐." },
      { t: "괜찮은 거지?" },
      { me: true, t: "있잖아, 형…" },
      { t: "응." },
      { me: true, t: "……아니다. 다음에 얘기할게." },
      { t: "그래. 다음에 꼭 해." } ] },
    { name: "수일이 형", dir: "out", when: "99/10/30 01:20", dur: "4:08", talk: [
      { me: true, t: "형, 나…" },
      { t: "응, 말해." },
      { me: true, t: "……" },
      { me: true, t: "아니, 그냥. 형 잘 지내나 해서." },
      { t: "민재야." },
      { t: "힘들면 말해. 형한테는 아무 말이나 해도 돼." },
      { t: "언제든 연락하고. 알았지?" } ] }
  ],

  /* 전화번호부에서 직접 걸었을 때의 대본 (없는 사람은 받지 않음) */
  scripts: {
    "엄마": [
      { t: "어머, 민재니? 이 시간에 웬일이야." },
      { me: true, t: "엄마… 나 좀 힘들어." },
      { t: "왜, 공부가 많이 어려워? 우리 아들 원래 잘하잖아." },
      { me: true, t: "그게 아니라, 엄마…" },
      { t: "엄마는 우리 아들 믿어. 잘 할 수 있을 거야." },
      { t: "밥 꼭 챙겨 먹고, 감기 조심하고. 알았지?" },
      { me: true, t: "……응." } ],
    "아빠": [
      { t: "그래, 무슨 일이냐." },
      { me: true, t: "아빠, 학교에서 애들이 자꾸 저를…" },
      { t: "그런 걸로 엄살 부리지 마라." },
      { t: "남자애들은 원래 그러면서 친해지는 거다. 네가 먼저 어울려 봐." },
      { me: true, t: "그게 아니라요, 아빠—" },
      { t: "바쁘다. 끊자." } ],
    "수일이 형": [
      { t: "민재야? 무슨 일 있어?" },
      { me: true, t: "……" },
      { t: "괜찮아. 말 안 해도 돼." },
      { t: "준비되면 말해. 형 여기 있을게." } ],
    "Jake": [
      { t: "Who's this?", ko: "누구야?" },
      { me: true, t: "……" },
      { t: "Hello? …Oh shit, it's the slant-eyed monkey.", ko: "여보세요? …아 씨발, 그 째진 눈 원숭이 새끼네." },
      { t: "Yo, guys! Yellow's calling me! Shut up, listen to him breathe!", ko: "야, 얘들아! 옐로우가 나한테 전화했어! 조용히 해 봐, 숨 쉬는 소리 들어 봐!" },
      { me: true, t: "……" },
      { t: "What'd you eat tonight, dog? I can smell it through the fucking phone.", ko: "오늘 저녁엔 뭐 처먹었냐, 개? 전화기 너머로도 냄새가 나." },
      { t: "Get the fuck off my line, freak.", ko: "내 전화에서 꺼져, 괴물 새끼야." } ],
    "Ethan Miller": [
      { t: "What.", ko: "뭐." },
      { me: true, t: "……" },
      { t: "Are you fucking serious? The yellow nerd's calling my house now?", ko: "장난하냐? 이제 옐로우 범생이가 우리 집까지 전화를 해?" },
      { t: "Who gave you this number, you rice-eating little rat?", ko: "이 번호 누가 줬어, 쌀이나 처먹는 쥐새끼야?" },
      { me: true, t: "……" },
      { t: "Call here again and I'll break every one of your fucking fingers. Then try dialing, monkey.", ko: "한 번만 더 걸면 손가락 전부 부러뜨려 줄게. 그 다음에 전화해 봐, 원숭이." } ],
    "Ryan": [
      { t: "Herro? Herro? Ching-chong?", ko: "헬로? 헬로? 칭챙총?" },
      { me: true, t: "……" },
      { t: "C'mon, say something in monkey. We're all listening, bookworm.", ko: "어서, 원숭이 말로 뭐라고 좀 해 봐. 다 듣고 있어, 범생아." },
      { t: "Can't even talk. Pathetic. Your own parents shipped you off, you know that?", ko: "말도 못 하네. 한심해. 네 부모도 널 내다 버린 거 알지?" },
      { me: true, t: "……" },
      { t: "Nobody wants you here, yellow. Nobody wants you anywhere.", ko: "여기선 아무도 너 안 원해, 옐로우. 어디서도 아무도 안 원해." } ],
    "Marcus Lee": [
      { t: "You've got some balls calling me, monkey.", ko: "나한테 전화를 다 하고, 간이 부었네, 원숭이." },
      { me: true, t: "……" },
      { t: "What, you gonna rat us out? Go ahead. Nobody's gonna believe some yellow freak.", ko: "뭐, 꼰지르게? 해 봐. 옐로우 괴물 말을 누가 믿겠냐." },
      { t: "You tell anyone, and you're fucking dead. You hear me?", ko: "누구한테든 말하면 넌 뒤졌어. 알아들어?" },
      { me: true, t: "……" },
      { t: "Tomorrow. Behind the gym. Don't make me come find you.", ko: "내일. 체육관 뒤. 내가 찾아가게 만들지 마." } ]
  },

  /* 문자: 받은 메시지 */
  messages: [
    { from: "수일이 형", when: "11/04 13:05", text: "(임시 내용) 문자 메시지입니다." },
    { from: "엄마", when: "11/02 19:30", text: "(임시 내용) 밥 먹었니" }
  ],

  /* 보낸 문자 */
  sent: [
    { to: "수일이 형", when: "11/03 22:41", text: "(임시 내용) 보낸 문자입니다." }
  ],

  /* 메모 (첫 줄이 목록 제목) */
  memos: [
    { when: "10/28 23:10", text: "(임시) 메모 제목\n메모 내용이 들어갑니다." }
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
