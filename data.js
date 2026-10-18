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

  /* 통화목록 (새것부터). dir = in(받은) · out(건) · missed(부재중), seen = 이미 확인한 부재중
     talk 가 있으면 누를 때 통화 녹음처럼 대화가 한 줄씩 나옴 (me: true = 민재) */
  calls: [
    { name: "아빠", dir: "out", when: "99/10/30 00:41", dur: "2:37", talk: [
      { t: "여보세요. …민재냐? 이 시간에 웬일이야." },
      { me: true, t: "아빠, 나 진짜 못 하겠어." },
      { t: "또 그 소리야?" },
      { me: true, t: "매일 맞아. 학교에서 걔들한테 매일 맞는다고!", loud: true },
      { me: true, t: "이러다가 진짜 죽어버릴 것 같아. 숨도 못 쉬겠어!", loud: true },
      { me: true, t: "아빠, 제발… 제발 나 좀 데려가 줘!", loud: true },
      { t: "민재야, 진정하고—" },
      { me: true, t: "숨을 못 쉬겠다고!!", loud: true } ] },
    { name: "수일이 형", dir: "out", when: "99/10/30 01:20", dur: "4:08", talk: [
      { me: true, t: "형, 나…" },
      { t: "응, 말해." },
      { me: true, t: "……" },
      { me: true, t: "아니, 그냥. 형 잘 지내나 해서." },
      { t: "민재야." },
      { t: "힘들면 말해. 형한테는 아무 말이나 해도 돼." },
      { t: "언제든 연락하고. 알았지?" } ] },
    { name: "수일이 형", dir: "in", when: "99/03/02 21:05", dur: "6:41", talk: [
      { t: "요즘은 좀 어때?" },
      { me: true, t: "그냥… 그렇지 뭐." },
      { t: "괜찮은 거지?" },
      { me: true, t: "있잖아, 형…" },
      { t: "응." },
      { me: true, t: "……아니다. 다음에 얘기할게." },
      { t: "그래. 다음에 꼭 해." } ] },
    { name: "수일이 형", dir: "missed", seen: true, when: "99/02/14 22:47" },
    { name: "수일이 형", dir: "out", when: "98/09/07 23:55", dur: "3:19", talk: [
      { t: "민재야? 이 시간에 웬일이야." },
      { me: true, t: "그냥… 형 목소리 듣고 싶어서." },
      { t: "오늘따라 목소리가 안 좋다. 무슨 일 있어?" },
      { me: true, t: "사실은…" },
      { me: true, t: "……" },
      { me: true, t: "아니야. 아무것도 아니야." },
      { t: "민재야." },
      { me: true, t: "진짜야. 그냥 좀 피곤해서 그래." } ] },
    { name: "수일이 형", dir: "in", when: "97/05/11 20:30", dur: "2:54", talk: [
      { t: "요즘 통 연락이 없네. 바쁘냐?" },
      { me: true, t: "응… 과제가 좀 많아서." },
      { t: "그래도 밥은 꼬박꼬박 먹어라." },
      { me: true, t: "응. 형도." } ] },
    { name: "수일이 형", dir: "out", when: "95/12/24 19:12", dur: "5:37", talk: [
      { me: true, t: "형, 메리 크리스마스. 여기 눈 엄청 와." },
      { t: "너도 메리 크리스마스. 크리스마스에 뭐 해?" },
      { me: true, t: "그냥 방에 있어. 창밖 보면서." },
      { t: "……그래. 형이 카드 보냈다. 곧 도착할 거야." },
      { me: true, t: "응. 고마워, 형." } ] },
    { name: "수일이 형", dir: "in", when: "94/10/02 10:44", dur: "4:15", talk: [
      { t: "시험은 잘 봤어?" },
      { me: true, t: "응, 그럭저럭." },
      { t: "다행이네. 밥은 잘 챙겨 먹고?" },
      { me: true, t: "응. 형은?" },
      { t: "형이야 잘 먹지. 너나 잘 먹어." } ] },
    { name: "수일이 형", dir: "out", when: "94/06/18 13:30", dur: "3:02", talk: [
      { me: true, t: "형, 나 오늘 점심으로 핫도그 먹었어." },
      { me: true, t: "길에서 파는 건데 1달러야. 진짜 커." },
      { t: "그것만 먹지 말고 밥도 좀 챙겨 먹어." },
      { me: true, t: "여기 쌀은 다 날아다녀, 형." },
      { t: "하하. 엄마가 반찬 보내래. 이번 주에 부칠게." } ] },
    { name: "아빠", dir: "out", when: "94/05/03 23:12", dur: "1:46", talk: [
      { me: true, t: "아빠, 나 진짜 돌아가고 싶어. 가족들 보고 싶어." },
      { t: "민재야, 또 그 소리냐." },
      { t: "너 거기 보내느라 다들 얼마나 애쓴 줄 알아? 처음엔 다 힘든 거다. 버텨." },
      { me: true, t: "……" },
      { me: true, t: "……알았어." } ] },
    { name: "아빠", dir: "out", when: "94/04/12 22:05", dur: "2:20", talk: [
      { me: true, t: "아빠, 나 사실 좀 힘들어." },
      { t: "뭐가." },
      { me: true, t: "그냥… 다. 한국으로 돌아가면 안 돼? 엄마랑 아빠 보고 싶어." },
      { t: "아직 적응을 덜 해서 그래. 다들 처음엔 그런다." },
      { t: "공부 더 열심히 해라. 그러면 괜찮아진다." },
      { me: true, t: "……응." } ] },
    { name: "아빠", dir: "out", when: "94/03/10 20:40", dur: "2:05", talk: [
      { me: true, t: "아빠, 나 잘 지내고 있어. 학교도 생각보다 괜찮아." },
      { t: "그래. 처음이 중요하다. 수업은 따라갈 만하고?" },
      { me: true, t: "응, 아직은. 단어 외우느라 바빠." },
      { t: "그래, 열심히 해라." } ] },
    { name: "수일이 형", dir: "in", when: "94/03/03 08:15", dur: "1:48", talk: [
      { t: "도착했어?" },
      { me: true, t: "응, 방금. 여기 비 와." },
      { t: "밥은 먹었고?" },
      { me: true, t: "기내식 두 번 먹었어. 생각보다 맛있더라." },
      { t: "다행이다. 푹 자고." } ] },
    { name: "수일이 형", dir: "out", when: "94/03/01 22:10", dur: "3:12", talk: [
      { me: true, t: "형, 나 이제 들어가." },
      { t: "그래. 짐은 다 챙겼고?" },
      { me: true, t: "응. 여권도 세 번 확인했어." },
      { me: true, t: "형, 나 잘 할 수 있을 것 같아. 너무 걱정하지는 마." },
      { t: "그래, 민재야. 공부 열심히 하고. 언제든 연락하렴." } ] },
    { name: "아빠", dir: "in", when: "94/03/01 21:30", dur: "1:58", talk: [
      { t: "탑승 수속은 끝났냐?" },
      { me: true, t: "응, 아빠. 이제 들어가려고." },
      { t: "가서 한눈팔지 말고 공부만 해라. 너 하나 보내려고 다들 애썼다." },
      { me: true, t: "알아. 잘할게." },
      { t: "도착하면 연락하고." } ] }
  ],

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
