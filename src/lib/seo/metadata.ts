import type { Metadata } from 'next'

export const BASE_URL = 'https://nanshijiaoglory.vercel.app'

type Locale = 'zh-TW' | 'en' | 'my' | 'ja'

interface LocaleMeta { title: string; description: string }

interface PageSEO {
  path: string
  'zh-TW': LocaleMeta
  en: LocaleMeta
  my: LocaleMeta
  ja: LocaleMeta
}

function hreflang(path: string) {
  return {
    canonical: `${BASE_URL}/zh-TW${path}`,
    languages: {
      'zh-TW':     `${BASE_URL}/zh-TW${path}`,
      'en':        `${BASE_URL}/en${path}`,
      'my':        `${BASE_URL}/my${path}`,
      'ja':        `${BASE_URL}/ja${path}`,
      'x-default': `${BASE_URL}/zh-TW${path}`,
    },
  }
}

export function buildMetadata(locale: string, page: PageSEO): Metadata {
  const l: Locale = (locale as Locale) in page ? (locale as Locale) : 'zh-TW'
  const { title, description } = page[l]
  const ogLocale = l === 'zh-TW' ? 'zh_TW' : l === 'my' ? 'my_MM' : l === 'ja' ? 'ja_JP' : 'en_US'

  return {
    title: { absolute: title },
    description,
    alternates: hreflang(page.path),
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}${page.path}`,
      locale: ogLocale,
      images: [{ url: `${BASE_URL}/church-og.jpg`, width: 1200, height: 630, alt: title }],
    },
  }
}

// ── Per-page SEO data ──────────────────────────────────────────────────────

export const pageSEO = {
  home: {
    path: '',
    'zh-TW': {
      title: '行道會南勢角榮耀堂 | 新北市中和區基督教教會・主日禮拜',
      description: '歡迎來到行道會南勢角榮耀堂，新北市中和區在地基督教教會（中和教會）。主日禮拜每週日 10:00–11:30，地址：忠孝街 39-15 號，捷運南勢角站 4 號出口步行 10 分鐘。設有緬甸語敬拜，歡迎各族群朋友。',
    },
    en: {
      title: 'Glory Church Of Nanshijiao | Christian Church in Zhonghe, New Taipei',
      description: 'Glory Church Of Nanshijiao — Sunday worship 10:00–11:30 at No.39-15 Zhongxiao St., Zhonghe, New Taipei. 10-min walk from MRT Nanshijiao Exit 4. Burmese-language worship available.',
    },
    my: {
      title: 'နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း | နယူးတိုင်းပေ',
      description: 'နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း — တနင်္ဂနွေ ဝတ်ပြုကိုးကွယ်ချိန် ၁၀:၀၀–၁၁:၃၀။ မြေအောက်ရထား နန်ရှိချောင် ဘူတာ ၄ ထွက်ပေါက်မှ ၁၀ မိနစ်ခန့်သာ ကြာသည်။',
    },
    ja: {
      title: '行道会南勢角栄光教会 | 新北市中和区キリスト教会・主日礼拝',
      description: 'ようこそ行道会南勢角栄光教会へ。新北市中和区のキリスト教会です。主日礼拝は毎週日曜日10:00〜11:30。MRT南勢角駅4番出口から徒歩10分。日本語対応可能。',
    },
  } satisfies PageSEO,

  about: {
    path: '/about',
    'zh-TW': {
      title: '關於我們 | 行道會南勢角榮耀堂・中和基督教教會',
      description: '認識行道會南勢角榮耀堂——中和區在地基督教教會（中和教會）。使命、異象與教會歷史。以耶穌基督的愛建立信仰群體，服事中和緬甸族群與在地社區，歡迎加入南勢角主日禮拜大家庭。',
    },
    en: {
      title: 'About Us | Glory Church Of Nanshijiao – Zhonghe Christian Community',
      description: 'Discover Glory Church Of Nanshijiao — mission, vision, core values and history. Building a faith community in Zhonghe, New Taipei City, serving Myanmar diaspora and local community.',
    },
    my: {
      title: 'ကျွန်ုပ်တို့အကြောင်း | နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း',
      description: 'နန်ရှိချောင် ဂလိုရီဘုရားကျောင်းကို မိတ်ဆက် — ကျွန်ုပ်တို့၏ ရည်ရွယ်ချက်၊ မျှော်မှန်းချက်နှင့် ဘုရားကျောင်းသမိုင်းကြောင်း။',
    },
    ja: {
      title: '私たちについて | 行道会南勢角栄光教会',
      description: '行道会南勢角栄光教会について — 使命、ビジョン、歴史。新北市中和区のキリスト教会。主日礼拝と共に、ミャンマーコミュニティも歓迎します。',
    },
  } satisfies PageSEO,

  services: {
    path: '/services',
    'zh-TW': {
      title: '主日禮拜時間地點 | 行道會南勢角榮耀堂・中和教會',
      description: '中和教會聚會時間：主日禮拜每週日 10:00–11:30、小組聚會週二 19:30、青年聚會週六 19:00。地址：新北市中和區忠孝街 39-15 號，捷運南勢角站 4 號出口。歡迎初次來訪的朋友！',
    },
    en: {
      title: 'Sunday Worship Times & Location | Glory Church Of Nanshijiao',
      description: 'Sunday worship 10:00–11:30, cell group Tue 19:30, youth Sat 19:00. Address: No.39-15 Zhongxiao St., Zhonghe, New Taipei. MRT Nanshijiao Station Exit 4. All are welcome.',
    },
    my: {
      title: 'ဝတ်ပြုကိုးကွယ်မှု အချက်အလက် | နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း',
      description: 'တနင်္ဂနွေ ဝတ်ပြုကိုးကွယ်ချိန် ၁၀:၀၀–၁၁:၃၀၊ အုပ်စုသင်းပြုချိန် အင်္ဂါ ၁၉:၃၀၊ လူငယ်ပွဲ စနေ ၁၉:၀၀။',
    },
    ja: {
      title: '礼拝案内 | 行道会南勢角栄光教会',
      description: '礼拝時間：主日礼拝 毎週日曜日10:00〜11:30、セルグループ 火曜日19:30、青年礼拝 土曜日19:00。新北市中和区忠孝街39-15号。MRT南勢角駅4番出口。',
    },
  } satisfies PageSEO,

  events: {
    path: '/events',
    'zh-TW': {
      title: '教會活動行事曆 | 行道會南勢角榮耀堂・中和教會',
      description: '行道會南勢角榮耀堂近期基督教活動：退修會、蒙特梭利親子活動、聖經講座、青年特會、中和社區服務。中和教會活動資訊，立即查看並線上報名。',
    },
    en: {
      title: 'Events Calendar | Glory Church Of Nanshijiao – Zhonghe',
      description: 'Upcoming events at Glory Church Of Nanshijiao: retreats, Montessori family workshops, Bible seminars, youth events, and community outreach in Zhonghe. Register online.',
    },
    my: {
      title: 'ပွဲအစီအစဉ် | နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း',
      description: 'နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း ကျင်းပမည့် ပွဲများ: နုတ်ပယ်ပွဲ၊ မိသားစုလုပ်ငန်းများ၊ သမ္မာကျမ်းဆွေးနွေးပွဲ၊ လူငယ်ပွဲများ။',
    },
    ja: {
      title: 'イベントカレンダー | 行道会南勢角栄光教会',
      description: '行道会南勢角栄光教会のイベント：リトリート、家族向けワークショップ、聖書セミナー、青年イベント、地域奉仕。オンラインで登録できます。',
    },
  } satisfies PageSEO,

  sermons: {
    path: '/sermons',
    'zh-TW': {
      title: '主日講道媒體庫 | 行道會南勢角榮耀堂・中和教會',
      description: '行道會南勢角榮耀堂主日講道影片。陳文彬牧師帶領中和教會聖經系列、青年信息，隨時收看南勢角主日禮拜講道，在基督教信仰中靈命天天更新。',
    },
    en: {
      title: 'Sunday Sermon Library | Glory Church Of Nanshijiao',
      description: 'Watch sermons from Glory Church Of Nanshijiao. Sunday messages, Bible series, and youth sermons by Pastor Chen Wen-Bin — Zhonghe\'s local Christian church in New Taipei.',
    },
    my: {
      title: 'တရားဟောချက်မှတ်တမ်း | နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း',
      description: 'နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း တရားဟောချက်များ နားထောင်ပြီး ယုံကြည်မှုတွင် ကြီးထွားပါ။',
    },
    ja: {
      title: 'メッセージライブラリ | 行道会南勢角栄光教会',
      description: '行道会南勢角栄光教会のメッセージを視聴しましょう。陳文彬牧師による主日メッセージ、聖書シリーズ、青年メッセージ。',
    },
  } satisfies PageSEO,

  dailyScripture: {
    path: '/daily-scripture',
    'zh-TW': {
      title: '每日聖經經文 | 行道會南勢角榮耀堂・中和教會',
      description: '行道會南勢角榮耀堂（中和教會）每日聖經金句。牧師精選基督教靈修經文，每日更新，讓神的話語帶領你的一天，為主日禮拜預備心靈。',
    },
    en: {
      title: 'Daily Scripture | Glory Church Of Nanshijiao',
      description: 'Daily Bible verses from Glory Church Of Nanshijiao — Zhonghe Christian church. Curated scripture updated every day to start your day in God\'s Word.',
    },
    my: {
      title: 'နေ့စဉ်သမ္မာကျမ်း | နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း',
      description: 'နေ့စဉ် ကျမ်းပိုဒ်တစ်ကြောင်းဖြင့် ဘုရားသခင်၏ နှုတ်ကပတ်တော်တွင် အမြစ်တွယ်ပါ။',
    },
    ja: {
      title: '今日のみことば | 行道会南勢角栄光教会',
      description: '行道会南勢角栄光教会からの毎日の聖書の言葉。毎日更新される聖書の節で、神のみことばに根ざした一日を始めましょう。',
    },
  } satisfies PageSEO,

  gallery: {
    path: '/gallery',
    'zh-TW': {
      title: '教會相片集 | 行道會南勢角榮耀堂・中和教會',
      description: '行道會南勢角榮耀堂（中和教會）活動相片集——主日禮拜崇拜、基督教特別聚會、社區服務與蒙特梭利親子活動的珍貴記錄。',
    },
    en: {
      title: 'Photo Gallery | Glory Church Of Nanshijiao – Zhonghe',
      description: 'Photo gallery of Glory Church Of Nanshijiao — Sunday worship, special events, community outreach, and Montessori family programs at our Zhonghe church.',
    },
    my: {
      title: 'ဓာတ်ပုံများ | နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း',
      description: 'နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း လှပသောအချိန်များ ဓာတ်ပုံများ — ဘုရားသခင်၏ ကျေးဇူးတော် မှတ်တမ်း။',
    },
    ja: {
      title: 'フォトギャラリー | 行道会南勢角栄光教会',
      description: '行道会南勢角栄光教会のフォトギャラリー — 主日礼拝、特別イベント、地域奉仕の貴重な記録。',
    },
  } satisfies PageSEO,

  weeklyBulletin: {
    path: '/weekly-bulletin',
    'zh-TW': {
      title: '主日週報 | 行道會南勢角榮耀堂・中和教會',
      description: '行道會南勢角榮耀堂每週主日禮拜週報，可線上閱讀或下載 PDF。掌握中和教會本週信息主題、活動通知與基督教靈修消息。',
    },
    en: {
      title: 'Weekly Sunday Bulletin | Glory Church Of Nanshijiao',
      description: 'Weekly Sunday bulletins from Glory Church Of Nanshijiao — download or read online to stay updated on sermons, church news, and upcoming events in Zhonghe.',
    },
    my: {
      title: 'အပတ်စဉ်သတင်းလွှာ | နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း',
      description: 'နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း တနင်္ဂနွေ အပတ်စဉ်သတင်းလွှာ — ဒေါင်းလုဒ်ဖတ်ပါ။',
    },
    ja: {
      title: '週報 | 行道会南勢角栄光教会',
      description: '行道会南勢角栄光教会の毎週の主日週報 — オンラインで閲覧またはPDFをダウンロードできます。',
    },
  } satisfies PageSEO,

  prayerWall: {
    path: '/prayer-wall',
    'zh-TW': {
      title: '代禱牆 | 行道會南勢角榮耀堂・中和基督教教會',
      description: '行道會南勢角榮耀堂（中和教會）代禱牆——分享你的代禱需求，讓中和基督教教會弟兄姊妹一同守望禱告，彼此扶持，經歷群體代禱的力量。',
    },
    en: {
      title: 'Prayer Wall | Glory Church Of Nanshijiao',
      description: 'Share your prayer requests on the Glory Church Of Nanshijiao Prayer Wall. Our Zhonghe Christian community prays with you and for you.',
    },
    my: {
      title: 'ဆုတောင်းချက်နံရံ | နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း',
      description: 'သင်၏ ဆုတောင်းချက်ကို မျှဝေပါ — ကျွန်ုပ်တို့ အတူတကွ ဆုတောင်းကြမည်ဖြစ်သည်။',
    },
    ja: {
      title: '祈りの壁 | 行道会南勢角栄光教会',
      description: '行道会南勢角栄光教会の祈りの壁 — 祈りのリクエストを共有し、共同体として共に祈り合いましょう。',
    },
  } satisfies PageSEO,

  contact: {
    path: '/contact',
    'zh-TW': {
      title: '聯絡我們 | 行道會南勢角榮耀堂・中和教會',
      description: '聯絡行道會南勢角榮耀堂（中和教會）。電話：(02) 8668-5515，地址：新北市中和區忠孝街 39-15 號，捷運南勢角站 4 號出口。主日禮拜每週日 10:00，歡迎來訪基督教教會。',
    },
    en: {
      title: 'Contact Us | Glory Church Of Nanshijiao – Zhonghe',
      description: 'Contact Glory Church Of Nanshijiao. Phone: (02) 8668-5515, Address: No.39-15 Zhongxiao St., Zhonghe, New Taipei. Sunday worship every week at 10:00 AM.',
    },
    my: {
      title: 'ဆက်သွယ်ရန် | နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း',
      description: 'နန်ရှိချောင် ဂလိုရီဘုရားကျောင်းထံ ဆက်သွယ်ပါ။ ဖုန်း: (02) 8668-5515။ မေးစရာများ သို့မဟုတ် ဆုတောင်းချက် ကူညီမှုအတွက် ဆက်သွယ်ပါ။',
    },
    ja: {
      title: 'お問い合わせ | 行道会南勢角栄光教会',
      description: '行道会南勢角栄光教会へのお問い合わせ。電話：(02) 8668-5515、住所：新北市中和区忠孝街39-15号。主日礼拝は毎週日曜日10:00。',
    },
  } satisfies PageSEO,
}
