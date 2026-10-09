# chweb Frontend Upgrade Specification

**Status:** Draft v2 (Codex Review Incorporated)
**Category:** Page / Layout / Feature
**Phase:** 2 — Planning Only (程式碼禁止修改)
**Date:** 2026-10-09
**Author:** Claude Code (Lead Software Engineer)
**Reviewed by:** Codex (codex-reviewer, w1:p2)
**Branch:** feat/website-ui-upgrade

---

## Scope

本規格覆蓋 chweb Next.js 教會官網的前端升級計畫。  
所有修改限定在前端呈現層。資料層、認證流程、API contracts 均不得異動。

---

## Non-goals

- 不修改 Supabase schema 或任何資料庫結構
- 不修改 Sanity CMS schema（`src/lib/sanity/schemas/**`）
- 不修改 API routes（`src/app/api/**`）
- 不修改 i18n routing 設定（`src/lib/i18n/**`）
- 不修改 Sanity Studio（`src/app/studio/**`）
- 不修改 `.env.local` 或任何 secrets
- 不修改 Auth 流程（login / register / profile）
- 不做整站 UI 視覺重設計（維持現有 wine/amber 色系與品牌風格）
- 不移除任何現有功能
- flag-icons 全量載入在本 Phase 維持不變（P2 後續優化）
- YouTube live check 架構在本 Phase 維持 client-side fetch（不強制改 ISR）

---

## Current Architecture

```
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                ← 首頁 (force-dynamic, Server Component)
│   │   ├── about/
│   │   ├── services/
│   │   ├── sermons/
│   │   ├── events/
│   │   ├── contact/
│   │   ├── daily-scripture/
│   │   ├── weekly-bulletin/
│   │   ├── gallery/
│   │   ├── prayer-wall/            ← 讀取公開代禱（未驗證可讀；不得新增登入門檻）
│   │   ├── login/
│   │   ├── register/
│   │   └── profile/
│   ├── api/                        ← PROTECTED: 不得修改
│   ├── studio/[[...tool]]/         ← PROTECTED: Sanity Studio
│   └── globals.css                 ← Design tokens
├── components/
│   ├── layout/
│   │   ├── Header.tsx              ← 'use client'
│   │   └── Footer.tsx              ← Server Component
│   ├── home/
│   │   ├── Hero.tsx                ← 'use client' (YouTube live check)
│   │   ├── AnnouncementBanner.tsx  ← async Server Component (Sanity)
│   │   ├── WelcomeSection.tsx      ← Server Component
│   │   ├── ServiceTimesSection.tsx ← 'use client' (移除候選)
│   │   ├── SundayMessageSection.tsx← async Server Component (Sanity)
│   │   ├── LatestSermons.tsx       ← async Server Component (YouTube API)
│   │   └── UpcomingEvents.tsx      ← async Server Component (Sanity)
│   ├── seo/
│   │   └── ChurchJsonLd.tsx        ← PROTECTED: 已修正完畢
│   ├── prayer/
│   │   └── PrayerWall.tsx          ← 'use client' (Supabase Auth)
│   └── ui/
│       └── FadeIn.tsx
├── lib/
│   ├── sanity/                     ← PROTECTED
│   └── supabase/                   ← PROTECTED
└── messages/
    ├── zh-TW.json
    ├── en.json
    ├── my.json
    └── ja.json
```

**技術棧：**
- Next.js 16.3.5 (App Router + Turbopack)
- React 19.2.8
- Tailwind CSS v4 + custom design tokens
- next-intl v4 (zh-TW / en / my / ja)
- Sanity v6 CMS (`sanity ^6.15.0`, `next-sanity ^13.3.4`)
- Supabase (Auth + DB, SSR)
- PWA via @ducanh2912/next-pwa
- flag-icons v7.5.0

---

## Protected Files

以下檔案在本 Phase 及後續所有 Phase **禁止修改**：

| 檔案 / 目錄 | 原因 |
|---|---|
| `src/app/api/**` | API contracts 不得異動 |
| `src/lib/supabase/**` | Supabase client 與 auth helper 不得異動 |
| `supabase/migrations/**` | Supabase schema migrations 不得新增或修改 |
| `src/lib/sanity/schemas/**` | Sanity CMS schema 不得異動 |
| `src/lib/sanity/client.ts` | Sanity client 設定與資料契約不得異動 |
| `src/lib/sanity/queries.ts` | Sanity 查詢介面不得異動（含回傳型別） |
| `src/app/studio/**` | Sanity Studio 不得異動 |
| `src/proxy.ts` | Locale redirect 301 邏輯已確認，不得異動 |
| `src/lib/i18n/**` | i18n routing config 不得異動 |
| `.env.local` | Secrets 不得異動 |
| `src/components/seo/ChurchJsonLd.tsx` | SEO schema 已修正，本 Phase 不再動 |
| `package-lock.json` | 已完成版本同步；不得引入新 npm 依賴（含 `focus-trap-react`） |
| `src/app/[locale]/login/**` | Auth flow 不得異動 |
| `src/app/[locale]/register/**` | Auth flow 不得異動 |
| `src/app/[locale]/profile/**` | Auth flow 不得異動 |
| `src/app/[locale]/prayer-wall/**` | Prayer Wall 現有讀寫行為不得改變；不得新增登入門檻 |
| `src/components/prayer/PrayerWall.tsx` | Supabase Auth + 公開讀取整合不得異動 |

**注意：** `src/app/[locale]/layout.tsx` 允許修改，但必須保留：providers、`children`、現有 `NewsTicker`、`NewsletterSection`、`LineFloatButton` 及 SEO metadata/robots 輸出。本 Phase 的 layout 修改範圍：僅注入 `<SkipToContent>` 並在 `<main>` 加入 `id="main-content"` + `setRequestLocale(params.locale)` 呼叫（ISR 前提）。

---

## A. 現況問題

### A1. 架構 / 效能

| ID | 位置 | 問題 | 嚴重度 |
|---|---|---|---|
| A1-1 | `page.tsx:12` | `export const dynamic = 'force-dynamic'` — 首頁每次 request 重新 render，無 ISR 快取，直接衝擊 TTFB 與 LCP | P0 |
| A1-2 | `LatestSermons.tsx:77` | `<Image unoptimized />` on YouTube thumbnails — 完全跳過 Next.js 圖片優化，sermon 區 LCP 未被優化 | P1 |
| A1-3 | `next.config.ts` | 缺少 YouTube 縮圖 remotePattern — `unoptimized` 的根本原因；正式 API 使用 `i.ytimg.com`，備援 RSS 縮圖使用 `img.youtube.com`，兩者均需加入 | P1 |
| A1-4 | `ServiceTimesSection.tsx:1` | `'use client'` 但無任何 client hooks，全靜態內容，可改為 Server Component | P1 |

### A2. Accessibility (WCAG 2.1)

| ID | 位置 | 問題 | WCAG 條款 | 嚴重度 |
|---|---|---|---|---|
| A2-1 | `src/app/layout.tsx` | 無 Skip-to-content 連結 | 2.4.1 Bypass Blocks | P0 |
| A2-2 | `Header.tsx` mobile menu | 無 focus trap：開啟後 Tab 可跑到背景 | 2.1.2 No Keyboard Trap | P0 |
| A2-3 | `Header.tsx` mobile menu | 無 Escape 關閉（與語言選單行為不一致） | 2.1.1 Keyboard | P1 |
| A2-4 | `Header.tsx` Resources dropdown | 桌面下拉無鍵盤導覽（無法 Tab 進入選單項目） | 2.1.1 Keyboard | P1 |
| A2-5 | `Header.tsx:221` | Hamburger button `aria-label="Toggle menu"` 未隨 state 更新（開啟後應改為「關閉選單」） | 4.1.2 Name, Role, Value | P1 |
| A2-6 | `Hero.tsx:139-147` | Stats 裝飾數字部分缺 aria 說明；scroll indicator 無 `aria-hidden` | 1.3.1 Info and Relationships | P2 |
| A2-7 | `AnnouncementBanner.tsx:24` | `zh = locale !== 'en' && locale !== 'my'` — ja locale 使用中文 label，非 i18n 正確做法 | — | P2 |

### A3. i18n

| ID | 位置 | 問題 | 嚴重度 |
|---|---|---|---|
| A3-1 | `UpcomingEvents.tsx:60-63` | `t4()` helper 手工四語切換，非 next-intl 標準 API | P1 |
| A3-2 | `SundayMessageSection.tsx:32-37` | `copy` 物件內聯四語字串，非 next-intl | P1 |
| A3-3 | `AnnouncementBanner.tsx:34,44` | 部分硬編碼中英文，缺 my/ja 標籤 | P2 |
| A3-4 | `ServiceTimesSection.tsx:51-68` | 四語 locale 條件 ×6 重複寫在 JSX | P1 |
| A3-5 | `Footer.tsx:101-121` | 地址 / 時段四語全寫在 JSX | P2 |

### A4. Loading / Empty / Error

| ID | 位置 | 問題 | 嚴重度 |
|---|---|---|---|
| A4-1 | `UpcomingEvents.tsx:57` | `if (!upcoming.length) return null` — 無 empty state，使用者看到空白 | P1 |
| A4-2 | `SundayMessageSection.tsx:15` | `if (!msg) return null` — 無 empty/loading state | P1 |
| A4-3 | `AnnouncementBanner.tsx:21` | `if (!announcements.length) return null` — 同上 | P2 |
| A4-4 | `LatestSermons.tsx` | YouTube API 慢時無 skeleton loader，畫面空白 | P1 |
| A4-5 | 全站 | 無全域 Error Boundary；API 失敗無 fallback UI | P2 |

### A5. ESLint Warnings（P2 Deferred）

| 位置 | 問題 |
|---|---|
| `Header.tsx:5` | `useLocale` imported but never used |
| `Header.tsx:32` | `zh` declared but never used |
| `src/components/layout/TickerTrack.tsx` | `useRef` imported but never used |
| `src/lib/sanity/components/StudioLogo.tsx` | `<img>` element used instead of `<Image>` |

---

## B. 優先級

### P0 — 必須修復（直接影響 WCAG A 級或首頁效能）

| # | 問題 | 修正方案 |
|---|---|---|
| B0-1 | 首頁 `force-dynamic` 阻止快取 | 前提：先確認 layout + page 均加入 `setRequestLocale(params.locale)`；確認後改 `revalidate = 300`（詳見 D8） |
| B0-2 | 無 Skip-to-content | 新建 `SkipToContent` component，注入 layout |
| B0-3 | Mobile menu 無 focus trap | 手刻 focus cycle（**不得**引入 `focus-trap-react`，lockfile 已鎖定） |

### P1 — 本 Phase 修復（UX 重要缺陷）

| # | 問題 |
|---|---|
| B1-1 | Mobile menu Escape 關閉 + aria-label 動態更新 |
| B1-2 | Desktop Resources dropdown 鍵盤導覽（ArrowDown/Up/Escape） |
| B1-3 | `next.config.ts` 加入 `i.ytimg.com` + `img.youtube.com` remotePattern（含路徑限制） |
| B1-4 | `LatestSermons` 移除 `unoptimized`，改用 Next.js Image |
| B1-5 | `UpcomingEvents` empty state UI |
| B1-6 | `SundayMessageSection` empty/loading fallback |
| B1-7 | `LatestSermons` skeleton loader（`<Suspense>` fallback） |
| B1-8 | `ServiceTimesSection` 改為 Server Component |
| B1-9 | `SundayMessageSection` + `UpcomingEvents` i18n 字串遷移到 messages JSON |

### P2 — 後續 Phase

Hero stats aria-hidden 補齊、AnnouncementBanner i18n 補全、Footer i18n 整理、移除 unused imports/vars、`<img>` → `<Image>`（StudioLogo）、flag-icons tree-shaking、Error Boundary 全域設定。

---

## C. 建議新版資訊架構

```
<RootLayout>                          ← src/app/[locale]/layout.tsx
  <SkipToContent targetId="main-content" />    ← 新建
  <Header locale={locale} />          ← sticky z-50, 'use client'
  <main id="main-content">
    <Hero />                           ← 'use client', YouTube live (維持)
    <AnnouncementBanner />             ← async Server, Sanity
    <WelcomeSection />                 ← Server Component
    <ServiceTimesSection />            ← Server Component (移除 'use client')
    <Suspense fallback={<SundayMessageSkeleton />}>
      <SundayMessageSection />         ← async Server, Sanity
    </Suspense>
    <Suspense fallback={<SermonsSkeleton />}>
      <LatestSermons />                ← async Server, YouTube API
    </Suspense>
    <Suspense fallback={<EventsSkeleton />}>
      <UpcomingEvents />               ← async Server, Sanity
    </Suspense>
  </main>
  <Footer />                          ← Server Component
</RootLayout>
```

**頁面路由（維持不變，不得調整）：**

```
/[locale]/                  首頁
/[locale]/about             關於
/[locale]/services          聚會資訊
/[locale]/sermons           講道媒體
/[locale]/events            活動行事曆
/[locale]/contact           聯絡
/[locale]/daily-scripture   每日聖經
/[locale]/weekly-bulletin   週報
/[locale]/gallery           相片集
/[locale]/prayer-wall       禱告牆（公開可讀；不得新增登入門檻；loading/empty state 沿用現有功能語意）(PROTECTED)
/[locale]/login             登入 (PROTECTED)
/[locale]/register          註冊 (PROTECTED)
/[locale]/profile           個人資料 (PROTECTED)
/[locale]/faq               FAQ
/studio/[[...tool]]         Sanity Studio (PROTECTED)
```

---

## D. Component 規格

### D1. SkipToContent（新建）

**檔案：** `src/components/layout/SkipToContent.tsx`

```typescript
interface SkipToContentProps {
  targetId?: string;   // default: 'main-content'
  labels?: {
    'zh-TW': string;
    en: string;
    my: string;
    ja: string;
  };
}
```

**Tailwind 樣式規格：**
```
預設（隱藏）:   className="sr-only"
:focus 顯示:   className="not-sr-only fixed top-2 left-2 z-[100]
               bg-amber-400 text-wine-900 font-bold text-sm
               px-4 py-2 rounded-lg shadow-lg
               focus:outline-none focus:ring-2 focus:ring-wine-700"
```

**注入位置：** `src/app/[locale]/layout.tsx`，在 `<Header>` 之前。

**`<main>` 改動：** 在首頁 `page.tsx` 的根 `<div>` 或 layout 的 `<main>` 加入 `id="main-content"`。

**States：**
| State | Trigger | Visual |
|---|---|---|
| Default | — | `sr-only`（視覺隱藏，SR 可讀） |
| Focus | Tab 首次進入頁面 | 左上角 amber 矩形，z-100 |

---

### D2. Header（升級）

**檔案：** `src/components/layout/Header.tsx`（現有檔案修改）

**新增 Mobile Menu 規格：**

```typescript
// 新增 ref for hamburger button（focus 回歸用）
const hamburgerRef = useRef<HTMLButtonElement>(null)
```

| 新增行為 | 實作規格 |
|---|---|
| Escape 關閉 | `menuOpen` 時加 `useEffect` 監聽 `keydown` → `Escape` → `setMenuOpen(false)` + `hamburgerRef.current?.focus()` |
| Focus trap | Mobile menu overlay 屬全頁遮蓋型（需 focus cycle）；`<nav>` 內收集所有 focusable elements，Tab/Shift+Tab 在內循環；此為 overlay 模式，WCAG disclosure pattern 適用 |
| aria-label 動態 | `aria-label={menuOpen ? t('close_menu') : t('open_menu')}` — 已在 `'nav'` namespace 內，不加前綴 |
| aria-expanded | `aria-expanded={menuOpen}` |
| aria-controls | `aria-controls="mobile-menu"` |
| `<nav>` id | `id="mobile-menu"` + `aria-label={t('main_nav')}` |

**i18n keys 需新增至 messages JSON（`nav` namespace）：**
```json
{
  "nav": {
    "close_menu": "關閉選單",
    "open_menu": "開啟選單",
    "main_nav": "主要導覽"
  }
}
```

**Desktop Resources Dropdown 新增規格：**

```typescript
const dropdownRef = useRef<HTMLDivElement>(null)
const triggerRef = useRef<HTMLButtonElement>(null)
```

| 新增行為 | 實作規格 |
|---|---|
| `role="menu"` | dropdown `<div>` 加 `role="menu"` |
| `role="menuitem"` | 每個 `<Link>` 加 `role="menuitem"` |
| button ARIA | `aria-haspopup="menu"` + `aria-expanded={desktopDropdownOpen}` + `aria-controls="resources-menu"` |
| keyboard: `Enter`/`Space` | 開啟 dropdown + focus 第一個 menuitem |
| keyboard: `ArrowDown` | 下一個 menuitem（loop）|
| keyboard: `ArrowUp` | 上一個 menuitem（loop）|
| keyboard: `Escape` | 關閉 + focus 回 trigger button |
| keyboard: `Tab` out | 觸發 `closeDropdown()` |

**移除（P2 warnings）：**
- `useLocale` import（line 5）
- `zh` 變數（line 32）— Header 內相關條件句改用 `locale === 'zh-TW'` 直接判斷

---

### D3. Hero（最小修改）

**檔案：** `src/components/home/Hero.tsx`

**修改項（P2，不改視覺）：**
- Stats 區 4 個數字：加 `aria-label` 或配 visually-hidden `<span>` 描述文字
- 捲動指示器 `ChevronDown`：加 `aria-hidden="true"`
- `liveStatus === 'loading'` 狀態：`animate-pulse` shimmer 取代空白

---

### D4. ServiceTimesSection（Server Component 化）

**檔案：** `src/components/home/ServiceTimesSection.tsx`

**修改：**
- 移除 `'use client'` directive
- `useTranslations(NAMESPACE)` → `await getTranslations(NAMESPACE)`（from `next-intl/server`）
- `useLocale()` → `await getLocale()`（from `next-intl/server`）
- 其餘視覺、layout 不變

**⚠️ 實作前驗證**：確認目前 `ServiceTimesSection.tsx` 使用的 `useTranslations` namespace（可能為 `'home'` 子路徑或 `'serviceTimes'`）與 `src/messages/*.json` 一致，再替換 API。namespace 不得在此次修改中更動。

---

### D5. LatestSermons（圖片優化）

**檔案：** `src/components/home/LatestSermons.tsx`

**修改：**
- 移除 `unoptimized` prop
- 確認縮圖 `src` 來自何處：正式 YouTube Data API v3 回傳 `i.ytimg.com`；RSS 備援回傳 `img.youtube.com`；兩者均需在 `next.config.ts` 允許（詳見 D9）
- 若縮圖欄位缺少（API 回傳無縮圖），需 fallback 到靜態佔位圖，不觸發 Image Optimizer 報錯

**Suspense 邊界說明：**
`<Suspense>` 在 `page.tsx` 包裹 `<LatestSermons />`，SSR 時 Next.js 會等待 `LatestSermons` 完成或 timeout 後串流。`LatestSermons` 為 async Server Component，不接受外部 `videos` props，自行在內部 fetch YouTube API。Skeleton 在 `<Suspense fallback={}>` 中渲染，與實際 card 版型應保持一致的 grid 結構，避免 layout shift。

**Skeleton（新建）：** `src/components/home/SermonsSkeleton.tsx`

```typescript
export function SermonsSkeleton() {
  return (
    <section className="dark-section py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading skeleton */}
        <div className="mb-12 space-y-3">
          <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
          <div className="h-8 w-64 bg-white/10 rounded animate-pulse" />
        </div>
        {/* 3-column card skeletons */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-2xl overflow-hidden bg-white/5">
              <div className="aspect-video bg-white/10 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-white/10 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

### D6. UpcomingEvents（Empty State）

**檔案：** `src/components/home/UpcomingEvents.tsx`

**修改：** 將 `if (!upcoming.length) return null` 替換為 empty state UI

```typescript
// 新建 EventsEmptyState component（同檔案內 or 獨立）
function EventsEmptyState({ locale }: { locale: string }) {
  // CalendarX2 icon + i18n 文字 + CTA 連結至 /${locale}/events
}
```

**i18n keys 需新增（四語 messages JSON）：**
```json
{
  "events": {
    "empty_title": "目前沒有近期活動",
    "empty_body": "請查看完整活動行事曆以取得更多資訊",
    "view_all": "查看所有活動"
  }
}
```

**Empty State 視覺規格：**
- 容器：`py-16 text-center`
- Icon：`CalendarX2`（lucide），`size={36}`，`className="mx-auto mb-4 text-wine-300 opacity-50"`
- 標題：`text-lg font-semibold text-wine-800`
- 說明文字：`text-sm text-gray-500 mt-1`
- CTA Button：`mt-6 inline-flex items-center gap-2 px-6 py-2.5 church-gradient text-white text-sm font-semibold rounded-full`

---

### D7. SundayMessageSection（Fallback）

**檔案：** `src/components/home/SundayMessageSection.tsx`

**修改：**  
將 `if (!msg) return null` 替換為靜態 fallback UI（不改資料來源）：

```typescript
if (!msg) return (
  <section className="py-20 bg-[#fdfaf5]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
      <BookOpen size={40} className="mx-auto mb-3 text-wine-300" />
      <p className="text-wine-600 text-sm">{t('pending')}</p>
    </div>
  </section>
)
```

**⚠️ 對比修正**：移除整個容器的 `opacity-40` / `opacity-XX` 設定，改用具體低彩度色彩（`text-wine-300`、`text-wine-600`）。全容器低透明度會讓文字對比失控，無法單獨驗證。`BookOpen` 裝飾 icon 維持低透明，但文字不得受影響。

**i18n keys 需新增：**
```json
{
  "sundayMessage": {
    "pending": "本週信息準備中，請稍後回來查看"
  }
}
```

**注意：** `copy` 物件的硬編碼四語字串屬 P1 i18n 修正，遷移至 messages JSON；但資料來源（Sanity + `getLatestSundayMessage`）完全不動。

---

### D8. page.tsx ISR（效能）

**檔案：** `src/app/[locale]/page.tsx`、`src/app/[locale]/layout.tsx`

#### 前提驗證（實作前必須完成）

next-intl v4 在 Server Component 中呼叫 `getLocale()` 時，預設讀取 middleware 設定的 request header（`x-next-intl-locale`），此行為會觸發 Next.js 動態渲染，使 `revalidate` 無效。要讓 ISR 生效，必須在 layout + page 的頂層明確呼叫：

```typescript
// src/app/[locale]/layout.tsx  AND  src/app/[locale]/page.tsx
import { setRequestLocale } from 'next-intl/server'

// 在 component 函式頂層（props.params 取得）：
setRequestLocale(params.locale)
```

`setRequestLocale` 將 locale 寫入 AsyncLocalStorage，後續同一 render tree 中的所有 `getLocale()` / `useLocale()` 呼叫均從此靜態值讀取，不再依賴 headers()。

**實作前驗證步驟：**
1. 確認 `src/app/[locale]/layout.tsx` 的 params 型別包含 `locale`
2. 確認 `src/lib/i18n/` 設定中有 `generateStaticParams` 對應四個 locale
3. 在 `layout.tsx` 加入 `setRequestLocale` 後，以 `npx next build` 觀察首頁是否從 λ (dynamic) 改為 ○ (static) 或 ● (ISR)

若驗證後首頁仍為 λ（代表 render tree 中有其他 headers() 呼叫），則 **ISR 延後至 Phase 3**，本 Phase 保留 `force-dynamic`，只做 Accessibility 與 Image 修正。

#### 確認 ISR 可行後的修改

```typescript
// src/app/[locale]/page.tsx

// 移除:
export const dynamic = 'force-dynamic'

// 新增:
export const revalidate = 300
// ISR 語意：頁面在首次 request 時 SSR，快取後
// 超過 300 秒的下一個 request 觸發背景再驗證。
// 這不是定時排程，是 stale-while-revalidate 模式。
```

#### 各資料來源的 fetch 快取設定

ISR revalidate 控制頁面整體快取期限，但各 fetch 資料來源應有自己的明確設定：

```typescript
// src/lib/sanity/client.ts 或 queries.ts 中的 fetch 選項（勿改合約，僅確認）：
// Sanity 活動 / 講道：revalidate = 300 → 與頁面同步
// YouTube API fetch（在 LatestSermons.tsx 或 lib 中）：
fetch(YOUTUBE_API_URL, { next: { revalidate: 1800 } })
// YouTube 資料更新頻率低（每週），1800 秒（30 分鐘）合理
// 不能直接宣稱「繼承頁面 revalidate = 300」，必須明確設定
```

**注意：** Hero 的 YouTube live check 已是 `useEffect` client-side fetch，不受 `revalidate` 影響，功能維持正常。

---

### D9. next.config.ts（圖片 Domain）

**檔案：** `next.config.ts`

```typescript
// 在 images.remotePatterns 加入兩個 YouTube 網域：
{ protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
{ protocol: 'https', hostname: 'img.youtube.com', pathname: '/vi/**' },
```

**為什麼需要兩個網域：**
- `i.ytimg.com/vi/<id>/hqdefault.jpg` — YouTube Data API v3 正常回傳的縮圖 CDN
- `img.youtube.com/vi/<id>/hqdefault.jpg` — API 失敗或 RSS 備援時的備用縮圖網址

僅允許 `/vi/**` 路徑，避免意外開放整個網域。

搭配 `LatestSermons.tsx` 移除 `unoptimized`，YouTube thumbnail 可被 Next.js Image 優化（WebP/AVIF + 自動 resize）。

---

## E. Responsive 規格

### 斷點策略（維持現有 Tailwind 斷點）

| Breakpoint | Width | 說明 |
|---|---|---|
| mobile | 0–639px (`< sm`) | 單欄；漢堡選單；全寬 card |
| tablet | 640–1023px (`sm–lg`) | 2 欄 grid；仍使用漢堡選單 |
| desktop | 1024px+ (`≥ lg`) | 最大 `max-w-7xl`；完整 nav bar |

### Header Responsive

```
< lg:   Logo + [lang switcher] + [hamburger]
≥ lg:   Logo + Desktop nav + Resources dropdown + Lang switcher
```

### Hero CTA Responsive

```
< sm:   grid-cols-2, gap-3, max-w-xs (2×2 grid)
≥ sm:   flex-row, gap-3, justify-center (單行)
```

### SundayMessageSection Responsive

```
< lg:   flex-col (image on top, info below)
≥ lg:   flex-row (image 52%, info 48%)
```

### UpcomingEvents Responsive

```
Mobile:  single-column event list
≥ md:    維持現有 layout
```

### Footer Responsive

```
< md:   grid-cols-1 (Brand → Links → Contact 垂直疊)
≥ md:   grid-cols-3 側排
```

### Safe Area（已實作，維持不變）

```css
Header: padding-top: env(safe-area-inset-top)
PrayerWall modal: iOS scroll-lock pattern
```

---

## F. Accessibility 規格

### F1. WCAG 2.1 AA 完整檢查表

| 條款 | 描述 | 目前狀態 | 目標狀態 | Priority |
|---|---|---|---|---|
| 1.4.3 Contrast | 文字對比 ≥ 4.5:1 | ✅ wine+amber 組合通過 | 維持 | — |
| 1.3.1 Info & Relationships | 結構語意正確 | ⚠️ Stats 缺 aria | ✅ | P2 |
| 2.1.1 Keyboard | 所有互動可鍵盤操作 | ⚠️ Resources dropdown 不完整 | ✅ | P1 |
| 2.1.2 No Keyboard Trap | Focus trap 限於 modal | ⚠️ Mobile menu 無 trap | ✅ | P0 |
| 2.4.1 Bypass Blocks | Skip-to-content | ❌ 缺 | ✅ | P0 |
| 4.1.2 Name, Role, Value | 所有 UI 元件有 accessible name | ⚠️ Hamburger label 未動態更新 | ✅ | P1 |

### F2. ARIA Pattern 規格

**Header Language Switcher（已修正 ✅）：**
```html
<button
  aria-label="繁體中文"
  aria-expanded="false"
>
  <span aria-hidden="true" class="fi fi-tw fis ..."></span>
  <span class="hidden sm:inline">繁體中文</span>
  <ChevronDown aria-hidden="true" />
</button>
```

**Header Resources Dropdown（待修正 P1）：**
```html
<button
  ref={triggerRef}
  aria-haspopup="menu"
  aria-expanded={desktopDropdownOpen}
  aria-controls="resources-menu"
>
  資源
</button>
<div
  id="resources-menu"
  role="menu"
  aria-label="資源選單"
>
  <a role="menuitem" href="...">每日聖經</a>
  <a role="menuitem" href="...">週報</a>
  <a role="menuitem" href="...">相片集</a>
  <a role="menuitem" href="...">禱告牆</a>
</div>
```

**Mobile Menu（待修正 P0/P1）：**
```html
<button
  ref={hamburgerRef}
  aria-label="開啟選單"  ← 動態切換
  aria-expanded={menuOpen}
  aria-controls="mobile-menu"
>
<nav
  id="mobile-menu"
  aria-label="主要導覽"
>
  <!-- focus trap: Tab cycles within, Escape closes + returns focus to hamburger -->
</nav>
```

**Focus Trap 實作規格：**
```typescript
// 在 mobile menu <nav> 的 onKeyDown handler:
const handleMenuKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Escape') {
    setMenuOpen(false)
    hamburgerRef.current?.focus()
    return
  }
  if (e.key === 'Tab') {
    const focusable = menuRef.current?.querySelectorAll(
      'a[href], button:not([disabled])'
    )
    if (!focusable?.length) return
    const first = focusable[0] as HTMLElement
    const last = focusable[focusable.length - 1] as HTMLElement
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}
```

---

## G. SEO / Performance 規格

### G1. ISR 快取策略

**前提：** ISR 生效需先通過 D8 前提驗證（`setRequestLocale` + build 輸出確認）。若前提未達成，維持 `force-dynamic`，效能優化延至 Phase 3。

**ISR 語意釐清**（修正舊描述）：
ISR（Incremental Static Regeneration）是 stale-while-revalidate 模式，**不是定時排程**。
- 首次 request → SSR 渲染，結果快取
- 快取期間（< 300s）的 request → 直接回傳快取
- 超過 300s 的下一個 request → 回傳舊快取，**同時在背景觸發一次新渲染**
- 新渲染完成後，下一個 request 才拿到新版本

| 區段 | 目前 | 目標 | 說明 |
|---|---|---|---|
| 首頁 `page.tsx` | `force-dynamic` | `revalidate = 300`（需 D8 前提） | stale-while-revalidate 300s；Vercel Edge Cache 有效 |
| `LatestSermons` YouTube fetch | 無明確設定 | `fetch(..., { next: { revalidate: 1800 } })` | YouTube 資料更新頻率低，30 分鐘合理；**不繼承** page revalidate |
| `UpcomingEvents` Sanity fetch | 無明確設定 | 繼承 page `revalidate = 300`（Sanity client 預設） | 活動資料需要較即時，5 分鐘合理 |
| `SundayMessageSection` Sanity fetch | 無明確設定 | 繼承 page `revalidate = 300` | 週報更新，5 分鐘快取足夠 |
| `Hero` YouTube live check | `useEffect` client-side | 維持（不改架構） | client-side fetch 完全不受 revalidate 影響 |

### G2. Image 優化規格

| 圖片 | 目前狀態 | 目標 | 優先 |
|---|---|---|---|
| `/church.jpg` Hero BG | `fill priority quality={95}` ✅ | 維持 | — |
| YouTube thumbnails | `unoptimized` ❌ | 移除 `unoptimized`，加 `i.ytimg.com` remotePattern | P1 |
| Logo `/logo.png` | `width=40 height=40` ✅ | 維持 | — |
| Sanity 圖片 | `urlFor().width(1200)` ✅ | 維持 | — |

**`next.config.ts` 修改：**
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/**' },
    { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },      // 新增：YouTube API 縮圖
    { protocol: 'https', hostname: 'img.youtube.com', pathname: '/vi/**' },  // 新增：YouTube RSS 備援縮圖
  ],
},
```

**驗收情境（三種需全部覆蓋）：**

| 情境 | 縮圖來源 | 預期結果 |
|---|---|---|
| YouTube API 正常 | `i.ytimg.com/vi/<id>/hqdefault.jpg` | Next.js Image 優化成功，回傳 WebP |
| YouTube API 失敗，啟用 RSS 備援 | `img.youtube.com/vi/<id>/hqdefault.jpg` | 同上，不因 domain 不在 allowlist 而報錯 |
| API + RSS 均無縮圖欄位 | fallback 靜態佔位圖（如 `/images/sermon-placeholder.jpg`） | 使用本機 public 圖，不觸發 Image Optimizer 外部請求 |

### G3. Preconnect（P2，不阻擋 P0/P1）

```html
<!-- src/app/layout.tsx <head> — P2 後加入 -->
<link rel="preconnect" href="https://i.ytimg.com" />
<link rel="preconnect" href="https://www.youtube.com" />
```

### G4. Schema.org JSON-LD（維持，不改）

現有 `ChurchJsonLd.tsx` + 首頁三層 JSON-LD（ChurchOrganization、WebSite、FAQ）已完整修正，本 Phase 不再動。

### G5. flag-icons（維持，P2 後優化）

目前 `globals.css` 全量 `@import "flag-icons/css/flag-icons.min.css"`，Header 只用 4 個國旗。  
本 Phase 不修改。P2 可改為手動 subset 或改用 SVG inline。

---

## H. 預計修改的檔案

### P0（3 檔案 + 1 新建）

| 檔案 | 修改內容 |
|---|---|
| `src/app/[locale]/page.tsx` | `force-dynamic` → `revalidate = 300`（**前提：D8 驗證通過**；若失敗則延至 Phase 3）；加入 `setRequestLocale(params.locale)` |
| `src/app/[locale]/layout.tsx` | 注入 `<SkipToContent />`；`<main id="main-content">`；加入 `setRequestLocale(params.locale)`；保留既有 providers / NewsTicker / NewsletterSection / LineFloatButton / SEO |
| `src/components/layout/Header.tsx` | Mobile overlay focus trap + Escape；`hamburgerRef` + aria-label 動態更新；**不引入新 npm 依賴** |
| `src/components/layout/SkipToContent.tsx` | **新建**：Skip-to-content component |

### P1（7 檔案 + 3 新建 + 4 messages JSON）

| 檔案 | 修改內容 |
|---|---|
| `src/components/layout/Header.tsx` | Resources dropdown 鍵盤導覽（ArrowDown/Up/Escape）；移除 unused `useLocale` / `zh` |
| `src/components/home/ServiceTimesSection.tsx` | 移除 `'use client'`，改 server-side i18n API（先確認 namespace，詳見 D4）|
| `src/components/home/LatestSermons.tsx` | 移除 `unoptimized`；YouTube fetch 加 `{ next: { revalidate: 1800 } }`；`<Suspense>` 在 page.tsx 包裹 |
| `src/components/home/UpcomingEvents.tsx` | Empty state UI；`t4()` → next-intl |
| `src/components/home/SundayMessageSection.tsx` | `null` fallback → empty state UI（無 opacity-40）；`copy` 物件 → messages JSON |
| `next.config.ts` | 加入 `i.ytimg.com` + `img.youtube.com` remotePattern（含 `/vi/**` 路徑限制） |
| `src/messages/zh-TW.json` | 加 `nav.close_menu`、`nav.open_menu`、`nav.main_nav`；`events.empty_title`、`events.empty_body`、`events.view_all`；`sundayMessage.pending` |
| `src/messages/en.json` | 同上（英文版） |
| `src/messages/my.json` | 同上（緬甸語版） |
| `src/messages/ja.json` | 同上（日文版） |
| `src/components/home/SermonsSkeleton.tsx` | **新建**：Sermon section skeleton（維持 `dark-section` 背景、`lg:grid-cols-3` 同實際 card）|
| `src/components/home/EventsSkeleton.tsx` | **新建**：Events section skeleton |
| `src/components/home/SundayMessageSkeleton.tsx` | **新建**：SundayMessage section skeleton（左圖右文 `lg:flex-row` 同實際版型）|

### P2（4 檔案）

| 檔案 | 修改內容 |
|---|---|
| `src/components/home/Hero.tsx` | Stats aria-label、scroll indicator aria-hidden |
| `src/components/layout/Header.tsx` | `useLocale` / `zh` unused import/var |
| `src/components/layout/TickerTrack.tsx` | `useRef` unused import |
| `src/lib/sanity/components/StudioLogo.tsx` | `<img>` → `<Image>` |

---

## I. Validation Plan

### I1. 編譯基準（每次 P0/P1 修改後必須通過）

```bash
npm run lint        # 0 errors（warnings 允許 ≤ 4 個已知 P2 items）
npx tsc --noEmit    # 0 errors
npm run build       # Build 成功，無 fatal error
                    # build log 確認首頁從 λ → ● (ISR) 或 ○ (static)
                    # 若仍為 λ，ISR 前提未達成，延至 Phase 3
```

### I2. Accessibility 驗證

**A. 鍵盤導覽**

| 動作 | 預期結果 |
|---|---|
| Tab 從首頁開始（所有頁面，非僅首頁） | 第一個 focus 為 Skip-to-content link |
| 啟動 Skip-to-content → Enter | Focus 移至 `#main-content`，頁面捲動至主內容 |
| Tab 進入 Header → Resources button → Enter | Dropdown 開啟，focus 移至第一個 menuitem |
| Dropdown 開啟 → ArrowDown/Up | focus 在 menuitem 間循環 |
| Dropdown 開啟 → Escape | Dropdown 關閉，focus 回 Resources button |
| Hamburger（< 1024px）→ 開啟 menu | Focus 移入 mobile menu 第一個 item |
| Mobile menu 開啟 → Tab（正向） | Focus 在 menu items 循環（不外漏到背景） |
| Mobile menu 開啟 → Shift+Tab（逆向） | Focus 在 menu items 逆向循環 |
| Mobile menu 開啟 → Escape | Menu 關閉，focus 回 hamburger button |
| 語言切換完成（任一語言）→ 鍵盤仍可操作 | Header 重渲後 focus 位置正確 |

**B. Screen Reader（VoiceOver / NVDA）**

| 元素 | 朗讀內容 |
|---|---|
| 語言選單 button | locale 名稱（如「繁體中文」），不朗讀 flag icon 名稱 |
| Hamburger（menu 關閉） | 「開啟選單」（依 locale 語言） |
| Hamburger（menu 開啟） | 「關閉選單」（動態切換） |
| Resources button | 「資源，快顯功能表按鈕，已收合」 |

**C. DevTools Accessibility Tree**

- Header `<nav>` 有語意角色；Resources dropdown `role="menu"` + items `role="menuitem"`
- Mobile menu `<nav id="mobile-menu">` 有 `aria-label`
- Skip-to-content link 在 DOM 中排在 `<Header>` 之前

### I3. RWD 驗證

| 情境 | 驗證方式 | 預期結果 |
|---|---|---|
| 1023px（tablet 最大，漢堡模式） | Chrome DevTools Device Toolbar | 漢堡選單顯示；desktop nav 隱藏 |
| 1024px（desktop 最小） | 同上 | Desktop nav 顯示；漢堡隱藏 |
| 375px 直向（iPhone SE） | 同上 | Hero CTA 2×2 grid；各 section 全寬 |
| 375px 橫向（低高度環境） | 同上 | Header 不遮蓋主內容；Skip-to-content 可用 |
| 緬甸語（`my`）長文字 | 切換至 `my` locale，各斷點確認 | 無文字溢出、截斷或 layout 破版 |
| Skeleton → 實際 card 切換 | 載入前後截圖比較 | `SermonsSkeleton` / `SundayMessageSkeleton` 版型與實際 card 一致，無 layout shift |

### I4. 四語 + 路由回歸驗證

| 測試項目 | 步驟 | 預期結果 |
|---|---|---|
| 四語首頁可正常載入 | 瀏覽 `/zh-TW/`、`/en/`、`/my/`、`/ja/` | 各頁面顯示對應語言，無 500/404 |
| 語言切換功能 | Header 語言選單切換 zh-TW → en → my → ja → zh-TW | URL 正確變更，頁面正確渲染 |
| 深層連結語言切換 | 在 `/zh-TW/sermons` 切換語言至 `en` | 導覽至 `/en/sermons`，非 `/en/` |
| 無效 locale | 瀏覽 `/fr/` | 301 redirect 至預設 locale |

### I5. Auth + Prayer Wall 回歸驗證

| 測試項目 | 預期結果 |
|---|---|
| 瀏覽 `/zh-TW/login`、`/en/register` | 頁面正常載入，表單可用 |
| 登入後瀏覽 `/zh-TW/profile` | 正常顯示個人資料 |
| Prayer Wall 未登入讀取 `/zh-TW/prayer-wall` | 頁面可顯示公開代禱（**不得**出現強制登入 redirect） |
| Prayer Wall modal 開啟/關閉 | iOS scroll lock 正常還原；Escape 關閉 |
| Prayer Wall 送出禱告（已登入） | 送出成功，資料正確寫入 |

### I6. Sanity + YouTube 資料來源驗證

| 情境 | 模擬方式 | 預期結果 |
|---|---|---|
| Sanity 正常 | 正常瀏覽 | `UpcomingEvents`、`SundayMessage`、`AnnouncementBanner` 顯示資料 |
| Sanity 空資料（無活動） | 清空測試活動 or 本機 mock | `UpcomingEvents` 顯示 empty state UI（非空白） |
| Sanity 空資料（無本週信息） | 同上 | `SundayMessageSection` 顯示 pending fallback |
| YouTube API 正常 | 正常瀏覽 | `LatestSermons` 顯示 3 個影片卡，縮圖從 `i.ytimg.com` 載入 |
| YouTube API 失敗（模擬） | 暫時使 API Key 無效 | `LatestSermons` 顯示 Skeleton 或 empty state（不崩潰） |
| YouTube 縮圖備援（RSS） | 確認 `img.youtube.com` 縮圖可被 Next.js Image 優化 | Network tab 顯示 WebP 回應，無 400 錯誤 |
| `<Suspense>` rejected | `LatestSermons` throw error → Error Boundary（P2） | 目前：顯示 Skeleton；不崩潰整頁（pending P2 Error Boundary）|

### I7. SEO + PWA 回歸驗證

| 測試項目 | 工具 | 預期結果 |
|---|---|---|
| JSON-LD schema | Chrome DevTools → Application → JSON-LD | ChurchOrganization、WebSite、FAQ 三層完整，無新增/移除 |
| `<title>` + `<meta>` | View Page Source | 修改前後一致（layout.tsx metadata 未被異動） |
| robots / sitemap | `curl https://<prod-url>/robots.txt` | 內容未變更 |
| PWA 舊快取 | Chrome DevTools → Application → Service Workers → Update on reload | 修改後重新整理，新版 HTML 正確載入（無 stale cache 停留在舊版）|

### I8. 效能驗證

| 指標 | 工具 | 目標 |
|---|---|---|
| YouTube thumbnail | Network tab | Content-Type: `image/webp`（確認 Next.js optimizer 有效）|
| YouTube thumbnail 備援 | 同上（切換至 RSS 模式） | 同樣 WebP，無 404 |
| LCP | Chrome DevTools Lighthouse | < 2.5s |
| TTFB（冷請求） | Vercel Function logs | 首次渲染後快取；ISR 驗證通過後 < 200ms |
| TTFB（暖請求）| 第二次請求 | 直接回傳快取，TTFB 顯著低於冷請求 |

### I9. 部署驗證（Feature Preview → Production）

**流程：**

```
1. feature branch: feat/website-ui-upgrade
   ↓ git push origin feat/website-ui-upgrade
   → Vercel 自動建立 Preview Deploy

2. 在 Vercel Dashboard 確認：
   - Build: ✅ PASS
   - Preview URL: https://<auto-hash>-nanshijiaoglory.vercel.app/
   - Commit SHA: 與 git log 一致

3. 在 Preview URL 執行 I2–I8 所有驗證

4. 驗證通過後合併 PR 至 main
   ↓ git push origin main (npm run deploy)
   → Vercel 自動建立 Production Deploy

5. 在 Vercel Dashboard 確認：
   - Production URL: https://nanshijiaoglory.vercel.app/（以 Vercel Dashboard 顯示的實際網域為準）
   - Commit SHA: 與 PR merge commit 一致
   - Build: ✅ PASS

6. 瀏覽 https://nanshijiaoglory.vercel.app/ 執行快速 smoke test：
   - 首頁四語可訪問
   - Accessibility: Skip-to-content 可用
   - Prayer Wall 未登入可讀
```

**⚠️ 常見陷阱**：
- `npm run deploy` 推送 `main`，feature branch 須先 merge，否則 Preview 與 Production 版本不同
- 驗證時確認瀏覽器網址列顯示 Production URL（非 Preview URL），避免驗到錯誤版本
- 每次 Production deploy 記錄 commit SHA（`git log -1 --format="%H"` 輸出），備查

---

## Open Items（記錄、不阻擋實作）

| # | 問題 | 決策 | 備註 |
|---|---|---|---|
| O1 | SundayMessageSection 架構 | async Server Component ✅，不改資料流 | 已確認 |
| O2 | YouTube live check ISR | 維持 client-side fetch，不改架構 | 本 Phase 決策 |
| O3 | flag-icons 全量載入 | 維持，P2 後優化 | 本 Phase 決策 |
| O4 | `AnnouncementBanner` ja locale 顯示中文 | P2 修正 | 不阻擋 P0/P1 |
| O5 | ISR 前提驗證結果 | 實作前確認（詳見 D8）；若失敗延至 Phase 3 | 阻擋 B0-1 |
| O6 | `LatestSermons` 縮圖無備援靜態圖 | 實作時確認 `/public/images/sermon-placeholder.jpg` 存在，或新建 | 阻擋 D5 thumbnail fallback |
| O7 | ServiceTimesSection i18n namespace | 實作前先讀取元件確認 namespace（詳見 D4） | 阻擋 D4 |
| O8 | `focus-trap-react` 依賴 | **不引入**（lockfile 已鎖定）；採手刻 focus cycle | 已決策（Codex HIGH→LOW 修正）|

---

## 規格變更紀錄

| 版本 | 日期 | 異動摘要 |
|---|---|---|
| v1 | 2026-10-09 | 初始版本 |
| v2 | 2026-10-09 | Codex Review 修正：HIGH #1 補 `img.youtube.com` + 驗收情境；HIGH #2 補 ISR `setRequestLocale` 前提 + 修正快取語意；MEDIUM 修正 i18n namespace/protected files/skeleton list/deployment flow/RWD+Auth+Sanity 驗收；LOW deferred `focus-trap-react`/Sanity 版本 |

---

*本規格由 Claude Code (claude-sonnet-4-6) 生成，經 Codex (codex-reviewer) Review。所有程式碼修改須先通過 lint / tsc / build 三關後才可 deploy。*
