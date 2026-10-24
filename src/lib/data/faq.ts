export interface FaqItem {
  id: string
  q: string
  a: string
}

export interface FaqCategory {
  id: string
  title: string
  faqs: FaqItem[]
}

export interface FaqPageData {
  title: string
  subtitle: string
  backLabel: string
  contactLabel: string
  categories: FaqCategory[]
}

export const FAQ_DATA: Record<string, FaqPageData> = {
  'zh-TW': {
    title: '常見問題',
    subtitle: '關於行道會南勢角榮耀堂的常見問題解答',
    backLabel: '首頁',
    contactLabel: '還有其他問題？聯絡我們',
    categories: [
      {
        id: 'worship',
        title: '聚會資訊',
        faqs: [
          {
            id: 'faq-1',
            q: '中和教會的主日崇拜幾點開始？',
            a: '行道會南勢角榮耀堂（中和教會）的主日崇拜每週日上午10:00開始，至11:30結束，共90分鐘。另有週二19:30-21:00小組聚會及週六19:00-21:30青年聚會。',
          },
          {
            id: 'faq-2',
            q: '行道會南勢角榮耀堂有兒童主日學嗎？',
            a: '是的，行道會南勢角榮耀堂提供主日學課程，讓全家大小都能在信仰中一同成長。歡迎帶孩子來參加主日崇拜，課程於主日崇拜期間同步進行。',
          },
          {
            id: 'faq-3',
            q: '行道會南勢角榮耀堂有網路直播嗎？',
            a: '是的，主日崇拜提供 YouTube 線上直播，可至 YouTube 頻道 @winson651202 收看。直播通常於每週日主日崇拜（10:00）時段進行，無法親臨的朋友歡迎線上參與。',
          },
        ],
      },
      {
        id: 'location',
        title: '地點交通',
        faqs: [
          {
            id: 'faq-4',
            q: '我不是基督徒，可以來嗎？',
            a: '完全可以！行道會南勢角榮耀堂歡迎所有人，不論你有沒有信仰背景。不需要事先報名，不需要帶聖經，直接在週日早上10:00來就好。我們希望你在第一次來訪時感到自在與被接納。',
          },
          {
            id: 'faq-5',
            q: '如何前往行道會南勢角榮耀堂？',
            a: '搭乘台北捷運中和新蘆線至「南勢角站（O01）」，由4號出口步行約10分鐘（約700公尺），即可到達新北市中和區忠孝街39-15號。亦可搭乘 249、670、242 路線公車前往。也可開車前往，教會附近有付費停車場可使用。',
          },
          {
            id: 'faq-6',
            q: '第一次來需要事先報名嗎？',
            a: '不需要！你可以直接在週日早上10:00來到教會，不需要預約。不需要特別裝扮，也不需要帶任何東西。如果想讓我們提前知道你要來，歡迎透過聯絡表單留言，我們很樂意在門口迎接你。',
          },
          {
            id: 'faq-7',
            q: '教會會要求我捐錢嗎？',
            a: '不會。奉獻完全出於個人意願，我們不會在你來訪時要求或提醒你捐款。對第一次來的朋友，唯一的期望是你願意來、感受看看。',
          },
        ],
      },
      {
        id: 'about',
        title: '認識教會',
        faqs: [
          {
            id: 'faq-8',
            q: '行道會是什麼教會？',
            a: '行道會（Christian Fellowship Church，CFC）是源自台灣的基督教宗派，以「行道」為核心精神，強調門徒訓練與宣教。行道會南勢角榮耀堂為其台北榮耀堂體系旗下的地區教會，服事新北市中和、永和地區。',
          },
          {
            id: 'faq-9',
            q: '中和區有哪些基督教教會？',
            a: '行道會南勢角榮耀堂是中和區南勢角地區的基督教教會，位於新北市中和區忠孝街39-15號，服務中永和地區的基督徒社群。主日崇拜每週日上午10:00-11:30，全年開放，歡迎前來。',
          },
          {
            id: 'faq-10',
            q: '中永和地區有沒有說華語的教會？',
            a: '行道會南勢角榮耀堂位於中永和交界的南勢角地區，以華語為主要聚會語言，歡迎各族群朋友前來。教會網站提供中文、英文、緬甸語及日文版本，方便各國朋友查詢資訊。',
          },
          {
            id: 'faq-11',
            q: '網站有提供緬甸語嗎？',
            a: '是的，行道會南勢角榮耀堂官方網站提供繁體中文、英文、緬甸語及日文版本，方便各族群朋友查詢聚會資訊。教會主要以華語進行聚會，歡迎緬甸裔朋友前來參加。',
          },
          {
            id: 'faq-12',
            q: '行道會南勢角榮耀堂的主任牧師是誰？',
            a: '行道會南勢角榮耀堂的主任牧師為陳文彬牧師，傳道為羅淑樺傳道。教會隸屬行道會台北榮耀堂體系，長期服事新北市中永和地區的信仰社群。',
          },
        ],
      },
      {
        id: 'contact',
        title: '聯絡服務',
        faqs: [
          {
            id: 'faq-13',
            q: '行道會南勢角榮耀堂的聯絡電話是多少？',
            a: '行道會南勢角榮耀堂的聯絡電話為 02-8668-5515，電子郵件為 winson651202@gmail.com，辦公時間為週二至週日 9:00-17:00。也歡迎透過官網聯絡表單留言，我們將盡快回覆。',
          },
          {
            id: 'faq-14',
            q: '行道會南勢角榮耀堂如何奉獻？',
            a: '可透過銀行匯款奉獻：華南銀行南勢角分行（銀行代號008），戶名：財團法人中華基督教行道會南勢角榮耀堂，帳號：183-10-0034556。匯款時請備註姓名及奉獻用途，感謝您的支持。',
          },
        ],
      },
    ],
  },

  en: {
    title: 'FAQ',
    subtitle: 'Frequently asked questions about NJC Glory Church (Nanshijiao Glory Church)',
    backLabel: 'Home',
    contactLabel: 'Have more questions? Contact us',
    categories: [
      {
        id: 'worship',
        title: 'Service Information',
        faqs: [
          {
            id: 'faq-1',
            q: 'When does Sunday worship start?',
            a: 'Sunday worship at NJC Glory Church starts at 10:00 AM and ends at 11:30 AM (90 minutes). We also have small group meetings every Tuesday 7:30–9:00 PM and youth gatherings every Saturday 7:00–9:30 PM.',
          },
          {
            id: 'faq-2',
            q: 'Do you have children\'s Sunday school?',
            a: 'Yes, NJC Glory Church provides Sunday school classes for children during the Sunday worship service. The whole family is welcome — children can learn and grow in faith alongside adults.',
          },
          {
            id: 'faq-3',
            q: 'Do you livestream services?',
            a: 'Yes, Sunday worship is livestreamed on YouTube at @winson651202. The stream goes live every Sunday at 10:00 AM. You are welcome to join online if you cannot attend in person.',
          },
        ],
      },
      {
        id: 'location',
        title: 'Location & Directions',
        faqs: [
          {
            id: 'faq-4',
            q: 'Do I need to be a Christian to attend?',
            a: 'Not at all. Everyone is welcome at NJC Glory Church, regardless of faith background. No RSVP, no Bible, no preparation required — just show up on Sunday at 10:00 AM. We want your first visit to feel natural and comfortable.',
          },
          {
            id: 'faq-5',
            q: 'How do I get to NJC Glory Church?',
            a: 'Take the MRT Zhonghe-Xinlu Line to Nanshijiao Station (O01) and exit from Exit 4. Walk approximately 10 minutes (700 m) to 39-15 Zhongxiao St., Zhonghe District, New Taipei City (Postal Code 235). Bus routes 249, 670, and 242 also serve the area. Paid parking is also available nearby.',
          },
          {
            id: 'faq-6',
            q: 'Do I need to register before coming?',
            a: 'No registration needed. You can walk in any Sunday at 10:00 AM — no appointment, no dress code, nothing to bring. If you\'d like to let us know you\'re coming, feel free to use the contact form and we\'d love to greet you at the door.',
          },
          {
            id: 'faq-7',
            q: 'Will the church pressure me to donate?',
            a: 'No. Giving is entirely voluntary at NJC Glory Church. We will never ask or pressure first-time visitors to contribute. Your only expectation as a first-time guest is to come and see if this community feels right for you.',
          },
        ],
      },
      {
        id: 'about',
        title: 'About the Church',
        faqs: [
          {
            id: 'faq-8',
            q: 'What is Christian Fellowship Church (CFC / 行道會)?',
            a: 'Christian Fellowship Church (CFC, 行道會) is a Taiwanese Protestant denomination rooted in the "live out the Word" principle, emphasizing discipleship and missions. NJC Glory Church is a local congregation under the CFC Taipei Glory Church network, serving the Zhonghe and Yonghe areas of New Taipei City.',
          },
          {
            id: 'faq-9',
            q: 'What churches are in Zhonghe District (中和區)?',
            a: 'NJC Glory Church (行道會南勢角榮耀堂) is a Christian church in Nanshijiao, Zhonghe District, New Taipei City, at 39-15 Zhongxiao St. Sunday worship is open to all, every Sunday 10:00–11:30 AM.',
          },
          {
            id: 'faq-10',
            q: 'Is there a Mandarin-speaking church in Zhongyonghe (中永和)?',
            a: 'NJC Glory Church is located in Nanshijiao on the Zhongyonghe border and conducts services primarily in Mandarin. All are welcome regardless of background. Our website is available in Traditional Chinese, English, Burmese, and Japanese.',
          },
          {
            id: 'faq-11',
            q: 'Is the website available in Burmese?',
            a: 'Yes, the NJC Glory Church website is available in Traditional Chinese, English, Burmese (Myanmar), and Japanese. Services are conducted in Mandarin. Myanmar-background visitors are warmly welcome. Address: 39-15 Zhongxiao St., Zhonghe, New Taipei City.',
          },
          {
            id: 'faq-12',
            q: 'Who is the pastor of NJC Glory Church?',
            a: 'The senior pastor of NJC Glory Church is Rev. Chen Wen-bin (陳文彬牧師), and the evangelist is Luo Shu-hua (羅淑樺傳道). The church is affiliated with the CFC Taipei Glory Church network and has been serving the Zhongyonghe community for many years.',
          },
        ],
      },
      {
        id: 'contact',
        title: 'Contact & Giving',
        faqs: [
          {
            id: 'faq-13',
            q: 'What is the phone number for NJC Glory Church?',
            a: 'Phone: 02-8668-5515. Email: winson651202@gmail.com. Office hours: Tuesday–Sunday, 9:00 AM–5:00 PM. You are also welcome to reach us via the contact form on this website.',
          },
          {
            id: 'faq-14',
            q: 'How can I give / make a donation to NJC Glory Church?',
            a: 'Donations can be made via bank transfer: Hua Nan Bank, Nanshijiao Branch (Bank Code 008), Account Name: 財團法人中華基督教行道會南勢角榮耀堂, Account Number: 183-10-0034556. Please note your name and purpose when transferring. Thank you for your support.',
          },
        ],
      },
    ],
  },

  my: {
    title: 'မေးလေ့ရှိသောမေးခွန်းများ',
    subtitle: 'NJC Glory Church (Nanshijiao Glory Church) အကြောင်း မေးလေ့ရှိသောမေးခွန်းများ',
    backLabel: 'ပင်မစာမျက်နှာ',
    contactLabel: 'မေးခွန်းများရှိပါသလား? ကျွန်ုပ်တို့ကို ဆက်သွယ်ပါ',
    categories: [
      {
        id: 'worship',
        title: 'ဝတ်ပြုကိုးကွယ်ချိန်',
        faqs: [
          {
            id: 'faq-1',
            q: 'တနင်္ဂနွေ ဝတ်ပြုကိုးကွယ်ချိန် ဘယ်နှစ်နာရီ စတင်မည်နည်း?',
            a: 'NJC Glory Church ၏ တနင်္ဂနွေ ဝတ်ပြုကိုးကွယ်ချိန်မှာ နံနက် 10:00 - 11:30 (90 မိနစ်) ဖြစ်သည်။ အဂ္ဂါနေ့ညနေ 19:30-21:00 တွင် ကျေးဇူးတော်အုပ်စု၊ စနေနေ့ညနေ 19:00-21:30 တွင် လူငယ်အစည်းအဝေးများ ရှိသည်။',
          },
          {
            id: 'faq-2',
            q: 'ကလေးများအတွက် တနင်္ဂနွေကျောင်း ရှိသလား?',
            a: 'ဟုတ်ကဲ့၊ NJC Glory Church တွင် တနင်္ဂနွေ ဝတ်ပြုကိုးကွယ်ချိန်အတွင်း ကလေးများအတွက် Sunday School ရှိပါသည်။ မိသားစုနှင့်အတူ ကြွရောက်နိုင်ပါသည်။',
          },
          {
            id: 'faq-3',
            q: 'အွန်လိုင်းကနေ တိုက်ရိုက်ထုတ်လွှင့်မှု ကြည့်ရှုနိုင်သလား?',
            a: 'ဟုတ်ကဲ့၊ YouTube @winson651202 တွင် တနင်္ဂနွေ နံနက် 10:00 တိုက်ရိုက်ထုတ်လွှင့်ချိန်နှင့် တပြိုင်တည်း ကြည့်ရှုနိုင်သည်။',
          },
        ],
      },
      {
        id: 'location',
        title: 'တည်နေရာနှင့် လာရောက်နည်း',
        faqs: [
          {
            id: 'faq-4',
            q: 'ခရစ်ယာန် မဟုတ်သောသူများ လာနိုင်သလား?',
            a: 'လာနိုင်ပါသည်။ NJC Glory Church သည် ယုံကြည်မှုနောက်ခံ မည်သည့်သူကိုမဆို ကြိုဆိုပါသည်။ ကြိုတင်မှတ်ပုံတင်ရန် မလိုအပ်ပါ။ တနင်္ဂနွေ နံနက် 10:00 တွင် တိုက်ရိုက်လာနိုင်ပါသည်။',
          },
          {
            id: 'faq-5',
            q: 'ဘုရားကျောင်းသို့ ဘယ်လိုသွားရမည်နည်း?',
            a: 'MRT Zhonghe-Xinlu Line ဖြင့် Nanshijiao Station (O01) သို့ ရောက်ပြီး Exit 4 မှ ထွက်ကာ ၁၀ မိနစ်ခန့် (700 မီတာ) လျှောက်ပါ။ လိပ်စာ: Zhongxiao St. 39-15, Zhonghe District, New Taipei City (235)။',
          },
          {
            id: 'faq-6',
            q: 'ကြိုတင်မှတ်ပုံတင်ရန် လိုအပ်သလား?',
            a: 'မလိုအပ်ပါ။ တနင်္ဂနွေ နံနက် 10:00 တွင် တိုက်ရိုက်လာနိုင်သည်။ ဝတ်စားဆင်ယင်မှု သတ်မှတ်ချက် မရှိပါ။ ကြိုတင်အသိပေးလိုပါက ဆက်သွယ်ရေးဖောင်မှတဆင့် ဆက်သွယ်နိုင်ပါသည်။',
          },
          {
            id: 'faq-7',
            q: 'လှူဒါန်းမှု မဖြစ်မနေ လိုအပ်သလား?',
            a: 'မလိုအပ်ပါ။ လှူဒါန်းမှုသည် လုံးဝကိုယ်ပိုင်ဆန္ဒဖြင့် ပြုလုပ်သည်။ ပထမဆုံးလာသောသူများကို ငွေကြေးကိစ္စနှင့် ပတ်သက်၍ တောင်းဆိုမည် မဟုတ်ပါ။',
          },
        ],
      },
      {
        id: 'about',
        title: 'ဘုရားကျောင်းအကြောင်း',
        faqs: [
          {
            id: 'faq-8',
            q: 'Christian Fellowship Church (行道會) ဆိုသည်မှာ ဘာနည်း?',
            a: 'Christian Fellowship Church (CFC, 行道會) သည် တိုင်ဝမ်မှ ဆင်းသက်လာသောပရိုတက်စတင့် ဂိုဏ်းတစ်ခုဖြစ်ပြီး တပည့်ပြုခြင်းနှင့် သာသနာပြုခြင်းကို အဓိကထားသည်။ NJC Glory Church သည် Zhonghe/Yonghe ဒေသကို ဝန်ဆောင်မှုပေးနေသော လက်ခွဲကျောင်းတော်ဖြစ်သည်။',
          },
          {
            id: 'faq-9',
            q: 'ဝဘ်ဆိုက်တွင် မြန်မာဘာသာ ပါရှိသလား?',
            a: 'ဟုတ်ကဲ့၊ NJC Glory Church ဝဘ်ဆိုက်ကို တရုတ်ဘာသာ၊ အင်္ဂလိပ်ဘာသာ၊ မြန်မာဘာသာ နှင့် ဂျပန်ဘာသာဖြင့် ဖတ်ရှုနိုင်သည်။ ကျောင်းတော်ဝတ်ပြုကိုးကွယ်မှုများကို တရုတ်ဘာသာဖြင့် ပြုလုပ်သည်။ မြန်မာ နောက်ခံရှိသောညီအကိုမောင်နှမများကို ဖိတ်ကြားပါသည်။',
          },
          {
            id: 'faq-10',
            q: 'NJC Glory Church ၏ သင်းအုပ်ဆရာ ဘယ်သူနည်း?',
            a: 'အဓိကသင်းအုပ်ဆရာမှာ Rev. Chen Wen-bin (陳文彬牧師) ဖြစ်ပြီး Evangelist Luo Shu-hua (羅淑樺傳道) ပါဝင်သည်။ CFC Taipei Glory Church ကွန်ရက်နှင့် ချိတ်ဆက်ထားသည်။',
          },
          {
            id: 'faq-11',
            q: 'ဘုရားကျောင်း၏ ဆက်သွယ်ရန် ဖုန်းနံပါတ် ကဘာလဲ?',
            a: 'ဖုန်း: 02-8668-5515 | Email: winson651202@gmail.com | ရုံးဖွင့်ချိန်: တနင်္လာ-သောကြာ 9:00-17:00',
          },
          {
            id: 'faq-12',
            q: 'လှူဒါန်းရန် ဘယ်လိုပြုလုပ်ရမည်နည်း?',
            a: 'ဘဏ်လွှဲမှတစ်ဆင့် လှူဒါန်းနိုင်သည်: Hua Nan Bank, Nanshijiao Branch (Code 008), Account: 183-10-0034556 (財團法人中華基督教行道會南勢角榮耀堂)။ လွှဲသောအခါ နာမည်နှင့် ရည်ရွယ်ချက်ကို ဖော်ပြပေးပါ။',
          },
        ],
      },
      {
        id: 'contact',
        title: 'ဆက်သွယ်ရန်',
        faqs: [],
      },
    ],
  },

  ja: {
    title: 'よくある質問',
    subtitle: '行道会南勢角栄光教会に関するよくある質問',
    backLabel: 'ホーム',
    contactLabel: 'その他のご質問は？お問い合わせ',
    categories: [
      {
        id: 'worship',
        title: '礼拝情報',
        faqs: [
          {
            id: 'faq-1',
            q: '主日礼拝は何時に始まりますか？',
            a: '行道会南勢角栄光教会の主日礼拝は毎週日曜日午前10:00〜11:30（90分）です。火曜日19:30〜21:00の小グループ集会、毎週土曜日の青年集会も開催しています。',
          },
          {
            id: 'faq-2',
            q: '子ども向けのプログラムはありますか？',
            a: 'はい、主日礼拝と同時間帯に子どもの日曜学校を実施しています。お子さまと一緒にご参加いただけます。',
          },
          {
            id: 'faq-3',
            q: 'オンラインで礼拝を視聴できますか？',
            a: 'はい、主日礼拝はYouTubeでライブ配信しています。チャンネル「@winson651202」を毎週日曜日10:00にご覧ください。',
          },
        ],
      },
      {
        id: 'location',
        title: 'アクセス',
        faqs: [
          {
            id: 'faq-4',
            q: 'クリスチャンでなくても参加できますか？',
            a: 'もちろんです。行道会南勢角栄光教会は、信仰の背景に関係なくどなたでも歓迎しています。事前申し込み不要、持ち物なし。日曜日の朝10時にそのままお越しください。',
          },
          {
            id: 'faq-5',
            q: '教会へのアクセス方法を教えてください',
            a: '台北MRT中和新蘆線「南勢角駅（O01）」4番出口から徒歩約10分（約700m）。住所：新北市中和区忠孝街39-15号（郵便番号235）。バス249・670・242番も利用可能。近隣に有料駐車場あり。',
          },
          {
            id: 'faq-6',
            q: '事前に申し込みは必要ですか？',
            a: '不要です。毎週日曜日10:00に直接お越しください。服装の規定もなく、特別な準備も必要ありません。事前にご連絡いただける場合はお問い合わせフォームからどうぞ。入口でお迎えします。',
          },
          {
            id: 'faq-7',
            q: '献金は必須ですか？',
            a: '献金は完全に自由意志です。初めてお越しの方に献金をお願いすることは一切ありません。まずは礼拝を体験していただくことだけをお願いしています。',
          },
        ],
      },
      {
        id: 'about',
        title: '教会について',
        faqs: [
          {
            id: 'faq-8',
            q: '行道会（CFC）とはどのような教会ですか？',
            a: '行道会（Christian Fellowship Church、CFC）は台湾発祥のプロテスタント教派で、弟子訓練と宣教を中心に据えています。行道会南勢角栄光教会は台北栄光教会グループに属する地域教会として、新北市中和区・永和区を主なサービスエリアとしています。',
          },
          {
            id: 'faq-9',
            q: '礼拝はどの言語で行われますか？',
            a: '礼拝は主に中国語（普通話）で行われます。日本語での礼拝は行っていませんが、ウェブサイトは日本語に対応しており、日本語でのお問い合わせも受け付けています。',
          },
          {
            id: 'faq-10',
            q: '中和区・永和区に日本語対応の教会はありますか？',
            a: '行道会南勢角栄光教会は新北市中和区・永和区エリアに位置しています。礼拝は中国語で行われますが、ウェブサイトは日本語対応しており、日本語話者の方のご参加を歓迎しています。',
          },
          {
            id: 'faq-11',
            q: 'ウェブサイトは日本語に対応していますか？',
            a: 'はい、公式ウェブサイトは繁体字中国語・英語・ミャンマー語・日本語の4言語に対応しています。礼拝は中国語で行われますが、日本語でのお問い合わせも歓迎しています。',
          },
          {
            id: 'faq-12',
            q: '担任牧師はどなたですか？',
            a: '担任牧師は陳文彬（Chen Wen-bin）牧師、伝道師は羅淑樺（Luo Shu-hua）伝道師です。行道会台北栄光教会グループに所属し、長年にわたり中和・永和地区の信仰コミュニティを担っています。',
          },
        ],
      },
      {
        id: 'contact',
        title: 'お問い合わせ・献金',
        faqs: [
          {
            id: 'faq-13',
            q: '教会の連絡先を教えてください',
            a: '電話：02-8668-5515 / メール：winson651202@gmail.com / 受付時間：火〜日 9:00〜17:00。ウェブサイトのお問い合わせフォームからもご連絡いただけます。',
          },
          {
            id: 'faq-14',
            q: '献金・寄付はどのようにすればできますか？',
            a: '銀行振込でご支援いただけます。華南銀行 南勢角支店（銀行コード008）、口座名義：財團法人中華基督教行道會南勢角榮耀堂、口座番号：183-10-0034556。振込の際はお名前と用途をご記入ください。',
          },
        ],
      },
    ],
  },
}
