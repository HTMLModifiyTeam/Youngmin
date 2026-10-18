/* =========================================================
   ✏️ 여기만 고치면 내용이 바뀝니다. (2000년대 초 폴더폰)
   - 지금 들어 있는 내용은 화면 확인용 임시 내용입니다.
   ========================================================= */

window.PHONE = {
  owner: "강민재",
  date: "1994-12-08",        // 휴대폰 속 날짜 (YYYY-MM-DD)
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
    { name: "아빠", dir: "out", when: "94/12/03 00:41", dur: "2:37", talk: [
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
    { name: "수일이 형", dir: "out", when: "94/11/24 19:12", dur: "5:37", talk: [
      { me: true, t: "형, 여기 오늘 추수감사절이야. 벌써 눈도 와." },
      { t: "아, 땡스기빙? 다들 칠면조 먹는다며. 너는 뭐 해?" },
      { me: true, t: "그냥 방에 있어. 창밖 보면서." },
      { t: "……혼자?" },
      { me: true, t: "응. 괜찮아. 조용해서 좋아." },
      { t: "형이 소포 하나 보냈다. 라면이랑 김. 곧 도착할 거야." } ] },
    { name: "수일이 형", dir: "in", when: "94/09/11 20:30", dur: "2:54", talk: [
      { t: "요즘 통 연락이 없네. 바쁘냐?" },
      { me: true, t: "응… 그냥." },
      { t: "목소리에 힘이 하나도 없다. 밥은 먹고 다녀?" },
      { me: true, t: "…입맛이 없어." },
      { t: "민재야, 무슨 일 있으면—" },
      { me: true, t: "형, 나 수업 들어가야 돼. 끊을게." } ] },
    { name: "수일이 형", dir: "out", when: "94/10/07 23:55", dur: "3:19", talk: [
      { t: "민재야? 이 시간에 웬일이야." },
      { me: true, t: "그냥… 형 목소리 듣고 싶어서." },
      { t: "오늘따라 목소리가 안 좋다. 무슨 일 있어?" },
      { me: true, t: "사실은…" },
      { me: true, t: "……" },
      { me: true, t: "아니야. 아무것도 아니야." },
      { t: "민재야." },
      { me: true, t: "진짜야. 그냥 좀 피곤해서 그래." } ] },
    { name: "수일이 형", dir: "in", when: "94/11/13 21:05", dur: "6:41", talk: [
      { t: "요즘은 좀 어때?" },
      { me: true, t: "그냥… 그렇지 뭐." },
      { t: "괜찮은 거지?" },
      { me: true, t: "있잖아, 형…" },
      { t: "응." },
      { me: true, t: "……아니다. 다음에 얘기할게." },
      { t: "그래. 다음에 꼭 해." } ] },
    { name: "수일이 형", dir: "out", when: "94/12/03 01:20", dur: "4:08", talk: [
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

  /* 문자: 받은 메시지 (최신순). ko = 한국어 해석, pic = 사진 첨부 (회색 칸으로만 표시)
     read: false 면 안 읽은 문자 */
  messages: [
    { from: "Marcus Lee", when: "94/12/08 23:12", read: false, text: "Behind the gym tomorrow. 7:30. Come alone, monkey. If you're late we start with your fingers.", ko: "내일 체육관 뒤. 7시 반. 혼자 와라, 원숭이. 늦으면 손가락부터 시작한다." },
    { from: "Jake", when: "94/12/08 22:47", read: false, text: "heard u cried in the nurses office lmao. ching chong boo hoo. ur mommy cant hear u from china", ko: "양호실에서 질질 짰다며 ㅋㅋ 칭챙 엉엉. 중국에선 엄마가 니 소리 못 들어." },
    { from: "019-338-0412", when: "94/12/07 01:03", read: false, text: "Nobody at this school wants you breathing the same air. Pack up and go back to whatever rice paddy you crawled out of.", ko: "이 학교에선 아무도 너랑 같은 공기 마시는 거 안 원해. 짐 싸서 기어 나온 논바닥으로 돌아가." },
    { from: "Ryan", when: "94/12/05 16:20", pic: "floor", text: "look at this lil yellow bitch. sitting in the hallway like a stray dog. framed it lol", ko: "이 노란 새끼 봐라. 복도에 길바닥 개처럼 앉아 있네. 액자에 걸었음 ㅋㅋ" },
    { from: "Ethan Miller", when: "94/12/01 21:58", text: "You actually told the teacher? Bold move, slant-eyes. She laughed about it in the lounge btw. Nobody's coming to save you.", ko: "진짜 선생한테 말했냐? 배짱 좋네, 찢눈아. 그 선생 교무실에서 그거 얘기하면서 웃더라. 아무도 너 구하러 안 와." },
    { from: "Marcus Lee", when: "94/11/28 23:40", text: "Your face looked better with the blood on it. More color. Same time Monday.", ko: "피 묻으니까 얼굴이 더 낫더라. 혈색 돌고. 월요일 같은 시간에." },
    { from: "Jake", when: "94/11/22 12:14", pic: "tray", text: "lunch is served, rice rat. eat it off the floor like back home", ko: "점심 나왔다, 쌀쥐야. 고향에서처럼 바닥에서 주워 먹어." },
    { from: "Ethan Miller", when: "94/11/17 21:36", text: "So how do you like the cigarette burn I gave you on your wrist today? Suits you, rice rat. Want a matching one on the other side?", ko: "오늘 손목에 새겨 준 담배빵은 마음에 드냐? 잘 어울리더라, 쌀쥐야. 반대쪽에도 똑같이 하나 해 줄까?" },
    { from: "Ryan", when: "94/11/09 08:02", text: "Dog-eater. Did your family eat the dog or did the dog eat your family? Asking for science.", ko: "개 먹는 놈. 너네 가족이 개를 먹었냐, 개가 너네 가족을 먹었냐? 과학적으로 궁금해서." },
    { from: "019-338-0412", when: "94/11/03 02:31", text: "We know where you live. Nice house for a chink. Shame if something happened to it.", ko: "너 어디 사는지 안다. 짱깨치고 집 좋더라. 무슨 일 생기면 안타깝겠다." },
    { from: "Ethan Miller", when: "94/10/26 19:45", pic: "book", text: "Oops. Guess the bookworm's gonna fail now. Daddy's money can't buy you a new brain, yellow.", ko: "어이쿠. 책벌레 이제 낙제하겠네. 아빠 돈으로 새 뇌는 못 사, 옐로우." },
    { from: "Marcus Lee", when: "94/10/20 22:10", text: "If you skip school again I'll come get you myself. You don't get to hide, monkey.", ko: "또 학교 빠지면 내가 직접 데리러 간다. 넌 숨을 자격 없어, 원숭이." },
    { from: "Jake", when: "94/10/12 15:33", text: "everyone saw u piss urself in gym class LMAO. smelled like fish sauce", ko: "체육 시간에 너 오줌 지린 거 다 봤음 ㅋㅋㅋㅋ 액젓 냄새 나더라" },
    { from: "Ryan", when: "94/10/04 07:51", pic: "toilet", text: "found ur backpack. it was where u belong", ko: "니 가방 찾았다. 니가 있어야 할 데 있더라" },
    { from: "Ethan Miller", when: "94/08/30 20:04", text: "Welcome back, ching-chong. Did you miss us? We missed you. Lots of plans this year.", ko: "돌아온 걸 환영한다, 칭챙. 우리 보고 싶었냐? 우린 보고 싶었는데. 올해 계획이 많거든." },
    { from: "Marcus Lee", when: "94/06/11 23:55", text: "Enjoy summer. Pray you don't come back. We'll be waiting.", ko: "여름 잘 보내라. 돌아오지 않게 기도나 해. 기다리고 있을게." },
    { from: "Jake", when: "94/06/03 13:27", pic: "desk", text: "made u a name tag lol. now everyone knows whos desk it is", ko: "이름표 만들어 줬다 ㅋㅋ 이제 다들 누구 책상인지 알겠지" },
    { from: "019-338-0412", when: "94/05/26 00:48", text: "go home. go home. go home. go home. go home. nobody wants you here.", ko: "꺼져. 꺼져. 꺼져. 꺼져. 꺼져. 여기 아무도 너 안 원해." },
    { from: "Ryan", when: "94/05/18 18:36", text: "Do your eyes even open all the way? How do you read with those slits lmao", ko: "니 눈 끝까지 떠지긴 하냐? 그 찢어진 틈으로 어떻게 글 읽어 ㅋㅋ" },
    { from: "Ethan Miller", when: "94/05/07 21:12", text: "Tell anyone and next time it won't be your locker. It'll be your face.", ko: "누구한테 말하면 다음엔 사물함이 아니라 니 얼굴이야." },
    { from: "Jake", when: "94/05/06 08:15", pic: "locker", text: "good morning yellow :) check ur locker", ko: "좋은 아침, 옐로우 :) 니 사물함 확인해 봐" },
    { from: "Marcus Lee", when: "94/04/23 16:40", text: "Stop looking at me in class, slant-eyes. You look at me again I break your glasses.", ko: "수업 시간에 나 쳐다보지 마, 찢눈아. 또 쳐다보면 안경 부숴 버린다." },
    { from: "Ryan", when: "94/04/15 20:09", text: "Hey Mr. Miyagi. Wax on wax off lol. Do u even speak english or just ching chong", ko: "어이 쿵푸 사부님. 아뵤~ 한번 해 봐 ㅋㅋ 영어는 하냐 아님 칭챙만 하냐" },
    { from: "Jake", when: "94/04/09 22:31", text: "hey new kid. ur the yellow one right? welcome to america lol. u wont last", ko: "어이 전학생. 니가 그 노란 애 맞지? 미국에 온 걸 환영한다 ㅋㅋ 오래 못 버틸걸" },
    { from: "엄마", when: "94/03/02 19:30", text: "우리 아들 첫 등교 잘했어? 친구들 많이 사귀어. 엄마가 사랑해." },
    { from: "수일이 형", when: "94/03/01 13:05", text: "민재야 도착했다며. 시차 적응 잘하고. 힘들면 연락해." }
  ],

  /* 보낸 문자 */
  sent: [
    { to: "수일이 형", when: "94/12/02 22:41", text: "(임시 내용) 보낸 문자입니다." }
  ],

  /* 메모 (첫 줄이 목록 제목) */
  memos: [
    { when: "94/11/28 23:10", text: "(임시) 메모 제목\n메모 내용이 들어갑니다." }
  ],

  /* 음악: 1993~94년 미국 팝 (곡 정보만. 실제 음원은 넣지 않음) */
  music: [
    { title: "I'll Make Love to You", artist: "Boyz II Men", len: "3:58" },
    { title: "The Sign", artist: "Ace of Base", len: "3:09" },
    { title: "I Swear", artist: "All-4-One", len: "4:20" },
    { title: "Stay (I Missed You)", artist: "Lisa Loeb", len: "3:02" },
    { title: "Hero", artist: "Mariah Carey", len: "4:19" },
    { title: "Again", artist: "Janet Jackson", len: "3:47" },
    { title: "All for Love", artist: "Bryan Adams, Rod Stewart & Sting", len: "4:42" },
    { title: "Linger", artist: "The Cranberries", len: "4:34" },
    { title: "Can You Feel the Love Tonight", artist: "Elton John", len: "4:00" },
    { title: "Whatta Man", artist: "Salt-N-Pepa feat. En Vogue", len: "4:28" },
    { title: "Wild Night", artist: "John Mellencamp & Me'Shell Ndegeocello", len: "3:28" },
    { title: "Creep", artist: "TLC", len: "4:28" }
  ]
};
