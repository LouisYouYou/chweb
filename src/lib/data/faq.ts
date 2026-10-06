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
            q: '南勢角附近有教會嗎？',
            a: '有，行道會南勢角榮耀堂位於捷運南勢角站4號出口步行約10分鐘處（新北市中和區忠孝街39-15號），是南勢角地區的基督教教會，歡迎任何人前來參加主日崇拜。',
          },
          {
            id: 'faq-5',
            q: '如何前往行道會南勢角榮耀堂？',
            a: '搭乘台北捷運環狀線至「南勢角站」，由4號出口步行約10分鐘（約700公尺），即可到達新北市中和區忠孝街39-15號。也可開車前往，教會附近有付費停車場可使用。',
          },
          {
            id: 'faq-6',
            q: '捷運環狀線南勢角站附近有教會嗎？',
            a: '有，行道會南勢角榮耀堂就位於捷運環狀線南勢角站步行10分鐘處（新北市中和區忠孝街39-15號），是該站最近的基督教教會之一，主日崇拜每週日10:00-11:30，歡迎蒞臨。',
          },
          {
            id: 'faq-7',
            q: '新北市中和忠孝街有教會嗎？',
            a: '是的，行道會南勢角榮耀堂位於新北市中和區忠孝街39-15號（郵遞區號235），電話02-8668-5515，是忠孝街上的基督教教會，主日崇拜每週日上午10:00-11:30。',
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
            a: '行道會南勢角榮耀堂位於中永和交界的南勢角地區，以華語為主要聚會語言，同時提供緬甸語及英語服務，服務多元文化背景的信徒。無論你是本地人或新住民，都歡迎前來。',
          },
          {
            id: 'faq-11',
            q: '新北市中和區有沒有提供緬甸語崇拜的教會？',
            a: '行道會南勢角榮耀堂提供緬甸語（Burmese）崇拜與小組服務，是中永和地區少數同時提供華語、英語、緬甸語三種語言服事的教會，地址為新北市中和區忠孝街39-15號。',
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
            a: '行道會南勢角榮耀堂的聯絡電話為 02-8668-5515，電子郵件為 winson651202@gmail.com，辦公時間為週一至週五 9:00-17:00。也歡迎透過官網聯絡表單留言，我們將盡快回覆。',
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
            q: 'Is there a church near Nanshijiao (南勢角)?',
            a: 'Yes, NJC Glory Church is located at 39-15 Zhongxiao St., Zhonghe District, New Taipei City — about a 10-minute walk from MRT Nanshijiao Station Exit 4. Everyone is welcome to attend Sunday worship.',
          },
          {
            id: 'faq-5',
            q: 'How do I get to NJC Glory Church?',
            a: 'Take the MRT Circular Line to Nanshijiao Station and exit from Exit 4. Walk approximately 10 minutes (700 m) to 39-15 Zhongxiao St., Zhonghe District, New Taipei City (Postal Code 235). Paid parking is also available nearby.',
          },
          {
            id: 'faq-6',
            q: 'Is there a church near MRT Nanshijiao Station (Circular Line)?',
            a: 'Yes, NJC Glory Church is a 10-minute walk from MRT Circular Line Nanshijiao Station (Exit 4), at 39-15 Zhongxiao St., Zhonghe. Sunday worship is every Sunday 10:00–11:30 AM.',
          },
          {
            id: 'faq-7',
            q: 'Is there a church on Zhongxiao Street in Zhonghe?',
            a: 'Yes, NJC Glory Church is located at 39-15 Zhongxiao St., Zhonghe District, New Taipei City (Postal Code 235). Phone: 02-8668-5515. Sunday worship is every Sunday 10:00–11:30 AM.',
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
            a: 'NJC Glory Church is located in Nanshijiao on the Zhongyonghe border and conducts services primarily in Mandarin, while also offering Burmese and English ministry — welcoming people of diverse cultural backgrounds.',
          },
          {
            id: 'faq-11',
            q: 'Is there a Burmese-language church in Zhonghe, New Taipei City?',
            a: 'Yes, NJC Glory Church provides Burmese (Myanmar) worship services and small groups. It is one of the few churches in the Zhongyonghe area offering ministry in Mandarin, English, and Burmese. Address: 39-15 Zhongxiao St., Zhonghe, New Taipei City.',
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
            a: 'Phone: 02-8668-5515. Email: winson651202@gmail.com. Office hours: Monday–Friday, 9:00 AM–5:00 PM. You are also welcome to reach us via the contact form on this website.',
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
            q: 'Nanshijiao (南勢角) နားမှာ ဘုရားကျောင်း ရှိသလား?',
            a: 'ဟုတ်ကဲ့၊ NJC Glory Church သည် MRT Nanshijiao Station 4  နံပါတ်ထွက်ပေါက်မှ ခြေလျင် ၁၀ မိနစ်ခန့်ကွာသောနေရာ (Zhongxiao St. 39-15, Zhonghe, New Taipei City) တွင် တည်ရှိသည်။',
          },
          {
            id: 'faq-5',
            q: 'ဘုရားကျောင်းသို့ ဘယ်လိုသွားရမည်နည်း?',
            a: 'MRT Circular Line ဖြင့် Nanshijiao Station သို့ ရောက်ပြီး Exit 4 မှ ထွက်ကာ ၁၀ မိနစ်ခန့် (700 မီတာ) လျှောက်ပါ။ လိပ်စာ: Zhongxiao St. 39-15, Zhonghe District, New Taipei City (235)။',
          },
          {
            id: 'faq-6',
            q: 'MRT Nanshijiao Station နားမှာ ဘုရားကျောင်း ရှိသလား?',
            a: 'ဟုတ်ကဲ့၊ NJC Glory Church သည် MRT Circular Line Nanshijiao Station Exit 4 မှ ၁၀ မိနစ်ခန့်လျှောက်ရသောနေရာတွင် ရှိသည်။ တနင်္ဂနွေ ဝတ်ပြုကိုးကွယ်ချိန်မှာ 10:00-11:30 ဖြစ်သည်။',
          },
          {
            id: 'faq-7',
            q: 'Zhonghe Zhongxiao Street တွင် ဘုရားကျောင်း ရှိသလား?',
            a: 'ဟုတ်ကဲ့၊ NJC Glory Church သည် Zhongxiao St. 39-15, Zhonghe District (235) တွင် တည်ရှိသည်။ ဖုန်းနံပါတ်: 02-8668-5515။',
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
            q: 'မြန်မာဘာသာဖြင့် ဝတ်ပြုကိုးကွယ်မှုပြုလုပ်သော ဘုရားကျောင်း ရှိသလား?',
            a: 'ဟုတ်ကဲ့၊ NJC Glory Church တွင် မြန်မာဘာသာ (Burmese) ဖြင့် ဝတ်ပြုကိုးကွယ်မှုနှင့် Small Group ဝန်ဆောင်မှုများ ရှိပါသည်။ ရုံတိုင်းပြည်ဘာသာ၊ အင်္ဂလိပ်ဘာသာ နှင့် မြန်မာဘာသာ သုံးမျိုးဖြင့် ဝန်ဆောင်မှုပေးသောကျောင်းတော်တစ်ခုဖြစ်သည်။',
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
}
