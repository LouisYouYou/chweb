# chweb Visual Design Specification

**Status:** Draft
**Phase:** 3 — Visual Design Planning（程式碼禁止修改）
**Date:** 2026-10-09
**Author:** Claude Code (Lead Software Engineer)
**Approved Spec:** docs/frontend-upgrade-spec.md (v2, SPEC APPROVED)

---

## Design Mode: Design System Enhancement

現有品牌語言已確立（wine/amber 色系、教會身份、繁/英/緬/日四語）。
本 Phase 不重設計——在既有 token 系統之上精煉執行品質、修正不一致、建立可複用的節奏與結構。

**核心方向：Refined Heritage**
沉穩、真誠、現代，不刻意炫技。wine/gold 傳遞傳統與敬意，設計強化這個訊號，而非蓋過它。

---

## A. Visual Direction

### A1. 現況診斷

| 問題 | 位置 | 嚴重度 |
|---|---|---|
| 無統一 type scale — H1 跳 27px → 72px，body 混用 text-sm / text-base | 全站 | 高 |
| Section 垂直間距不一致 — py-16 / py-20 / py-32 混用無規律 | 各 section | 高 |
| 4 個 Hero CTA 爭奪同等視覺權重 | Hero | 高 |
| section 背景 white → #fdfaf5 → white 差異過細，無節奏感 | 首頁 | 中 |
| dark-section 與相鄰 light section 邊緣生硬無過渡 | LatestSermons | 中 |
| card-lift / card-glow 工具類存在，但部分 card 未套用 | WelcomeSection, UpcomingEvents | 中 |
| eyebrow tracking 0.3em vs 0.35em 不統一 | Hero, SundayMessage | 低 |
| divider-gold 僅出現在部分區塊 | SundayMessage | 低 |

### A2. 升級原則

1. **Restraint over addition** — 刪去比新增更有力。不新增顏色、不新增字型。
2. **Rhythm over decoration** — 統一 spacing scale，讓頁面自然呼吸。
3. **One primary CTA per section** — 每個 section 最多一個主要行動。
4. **Dark sections as punctuation** — 暗色區段是視覺休止，不是純裝飾。
5. **Motion as feedback, not performance** — 只在有意義的狀態轉換加動畫。

### A3. 禁止清單（本 Phase 明確不做）

- 不引入新字型（維持 Geist Sans + 中文 fallback）
- 不新增 CSS 色彩 token
- 不大量使用 glassmorphism（glass-card 僅限 dark-section 內部使用）
- 不濫用 gradient（hero overlay 維持現有；文字 gradient 只用於 hero title + stats）
- 不新增頁面動畫（僅修正現有 FadeIn 使用的一致性）
- 不移除任何現有功能性 UI 元素

---

## B. Typography System

### B1. 現況問題

目前無顯性 type scale token，全站使用硬編碼 Tailwind size class，且不統一。

**Hero H1：** `text-3xl sm:text-6xl md:text-7xl` → 30px → 60px → 72px（跨越太大）
**Section H2：** `text-3xl md:text-4xl` / `text-2xl sm:text-3xl md:text-4xl`（不一致）
**Card H3：** `text-lg font-bold` / `text-2xl sm:text-3xl`（不一致）
**Body：** `text-sm` / `text-base`（混用，無語意區分）
**Eyebrow：** `text-xs tracking-[0.3em]` / `text-xs tracking-[0.35em]`（不統一）

### B2. 建議 Type Scale（6 Token）

不新增 CSS 變數，使用 Tailwind class 規範化命名：

| Token 名稱 | Tailwind Class | 像素 | 用途 |
|---|---|---|---|
| `type-display` | `text-5xl sm:text-6xl md:text-7xl` | 48→60→72px | Hero H1（僅一處） |
| `type-h1` | `text-3xl sm:text-4xl md:text-5xl` | 30→36→48px | 頁面級標題 |
| `type-h2` | `text-2xl sm:text-3xl` | 24→30px | Section 標題 |
| `type-h3` | `text-lg sm:text-xl` | 18→20px | Card 標題 |
| `type-body` | `text-base` | 16px | 正文（統一，不再用 text-sm） |
| `type-caption` | `text-sm` | 14px | 輔助文字、時間、tag |
| `type-eyebrow` | `text-xs tracking-[0.3em] uppercase font-bold` | 12px | 區段識別（統一 tracking） |

**Font weight 規範：**
- Display / H1 / H2: `font-bold` (700)
- H3: `font-semibold` (600)
- Body: `font-normal` (400)
- Eyebrow / Caption label: `font-semibold` (600)

**Line height 規範：**
- Display / H1: `leading-tight` (1.25)
- H2 / H3: `leading-snug` (1.375)
- Body: `leading-relaxed` (1.625)
- Caption: `leading-normal` (1.5)

### B3. 中文字型注意事項

Geist Sans 不支援中文字元。目前 fallback 順序正確：
```css
font-family: var(--font-geist-sans), -apple-system, 'Microsoft JhengHei', 'PingFang TC', sans-serif;
```
緬甸語（my）需確認 fallback 包含 `'Padauk', 'Myanmar Text', sans-serif`（目前未加入，P2 補強）。

---

## C. Layout System

### C1. 垂直 Spacing Scale

統一 section padding，建立明確節奏層級：

| 層級 | Tailwind | 用途 |
|---|---|---|
| XS | `py-10` | 小型區段（AnnouncementBanner）|
| S  | `py-16` | 二線 section（WelcomeSection, Footer）|
| M  | `py-20` | 標準 section（ServiceTimes, Events）|
| L  | `py-24` | 主要 section（SundayMessage, Sermons）|
| XL | 全螢幕 | Hero 唯一 |

**目前 → 建議對照：**

| Section | 目前 | 建議 |
|---|---|---|
| AnnouncementBanner | `py-10` | 維持 XS |
| WelcomeSection | `py-16` | 維持 S |
| ServiceTimesSection | `py-20` | 維持 M（確認） |
| SundayMessageSection | `py-20` | 升至 L `py-24` |
| LatestSermons | `py-32` → 降為 | L `py-24` |
| UpcomingEvents | `py-16`（確認） | M `py-20` |
| Footer | `py-12` | 維持（footer 可稍窄）|

### C2. 水平容器

維持現有 `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`，不變更。

### C3. Section 背景節奏

目前背景切換：白 → 白(#fdfaf5) → 白 → 白(#fdfaf5) → 暗 → 白

建議更清晰的 3 層循環：
```
Hero          → wine-950 (dark overlay, 保持現有)
Announcement  → white
Welcome       → bg-[#fdfaf5]  (warm off-white, 保持)
ServiceTimes  → white
SundayMessage → bg-[#fdfaf5]  (warm off-white)
LatestSermons → dark-section  (deep wine, 保持)
UpcomingEvents→ white
Footer        → wine-950
```

**重點：** 暗色 LatestSermons 區段前後各加一個 light 區段，讓暗色成為「中段重音」，而非結尾。

### C4. Section 過渡（dark ↔ light）

目前 LatestSermons 與相鄰區段邊緣生硬。已有 wave SVG divider 在元件內（現有功能），確認其完整渲染。若 wave 只在一側：

```
SundayMessage(light) → [wave SVG, top] → LatestSermons(dark) → [wave SVG, bottom] → UpcomingEvents(light)
```

**不引入新 divider 元素**，只確認現有 wave SVG 在兩端均有渲染。

---

## D. Section-by-Section Proposal

### D1. Header / Navigation

**現況：**
- 視覺：`bg-white/97 backdrop-blur-md`，頂部 `h-0.5` amber gradient bar
- 問題：桌面 nav links 視覺權重無差異（active 狀態正確，但 hover 不夠明確）
- 問題：Lang switcher 在小螢幕時只有 flag，缺文字（WCAG 已修，但視覺待確認）

**建議修改（最小）：**
- 維持現有高度 `h-16` 與背景
- Nav links active 狀態：`text-wine-700 bg-wine-50` ✅（維持）
- Nav links hover：加 `transition-colors duration-150`（已有，確認一致）
- Amber top bar 維持 `h-0.5`（不加粗，低調）

**不改：**
- Logo 尺寸與排版
- 手機版 hamburger 樣式
- Lang switcher 外觀

---

### D2. Homepage Hero

**現況：**
- 視覺強烈，全螢幕 wine-950 overlay 上的白字 + amber 強調
- 問題：4 個 CTA 並排，無主次之分
- 問題：stats 區塊擁擠（2×2 grid on mobile），文字對比略弱

**建議修改：**

**CTA 層級重整（最重要）：**
```
Primary   → 聚會時間（amber solid pill）— 一個主要行動
Secondary → 認識我們（ghost pill, amber border）
Tertiary  → 週報 + 直播（ghost pill, white/20 border）
           ↑ 這兩個降為輔助級，視覺重量再降一階
```

具體：第 3、4 個 CTA border 從 `border-amber-400/60` 改為 `border-white/25 text-white/60`，明確降級，讓第一個 CTA 突出。

**Stats 調整（P2）：**
- Stats 2×2 grid on mobile 維持（已有 `sm:flex` breakpoint）
- 數字與 label 間距 `gap-1.5` → `gap-2`（微調）
- Label `text-wine-300` 確認在 dark background 上對比 ≥ 3:1（裝飾性可放寬）

**不改：**
- 背景圖 + overlay 層
- 裝飾 dot pattern（opacity-5，不影響可讀性）
- amber 左側 accent bar
- scroll indicator

---

### D3. AnnouncementBanner

**現況：** 乾淨，card-based，`py-10`，`max-w-4xl`。

**顯示原則（HIGH — 修正）：**

**所有有效公告必須可被使用者存取，不得因 UI 簡化而永久隱藏任何公告內容。**

公告數量超過顯示閾值時，採用以下任一方案（由實作時確認數量決定）：

| 方案 | 適用條件 | 注意事項 |
|---|---|---|
| 全部展示 | ≤ 5 則 | 無需折疊，直接全顯 |
| 「顯示更多 / 收合」展開區塊 | 6–10 則（建議優先） | 見下方 ARIA 規格 |
| Accordion 折疊 | 公告有分類時 | 每個分類可獨立展開 |
| Carousel | 僅在不影響 accessibility 前提下 | 需有靜態降級（prefers-reduced-motion）|

**預設顯示優先順序：**
1. `isPinned === true` 的公告優先顯示（置頂）
2. 其次按 `type: 'urgent'` > `'notice'` > `'event'` 排序
3. 超過閾值的公告以「顯示更多」展開，不得直接移除

**折疊控制 ARIA 規格（若採展開區塊）：**
```html
<button
  aria-expanded="false"
  aria-controls="announcements-extra"
>
  顯示更多公告（共 N 則）
</button>
<div id="announcements-extra" hidden>
  <!-- 額外公告列表 -->
</div>
```
- 展開時 `aria-expanded="true"`，`hidden` 屬性移除
- 收合文字：「收合公告」
- 可鍵盤操作（Enter / Space 觸發）
- 不得使用 `display: none` 替代 `hidden`（影響 SR 讀取）

**建議：** 維持現有 card 設計，只在數量超過 5 則時加入展開機制。

**不改：** 資料來源 API、公告排序邏輯（後端）、顏色、圓角、border、icon、`isPinned` 邏輯。

---

### D4. WelcomeSection（4 Steps）

**現況：** 4 個步驟 card，`rounded-2xl`，但缺 hover state。

**建議：**
- 加入 `card-lift` class（已有 token，只是未套用）
- Card border 從 `border-gray-100` 統一為 `border-wine-100/60`（稍暖一點）
- 步驟數字 badge（若有）確認 wine-700 bg + white text

**不改：** grid layout、content、icons。

---

### D5. ServiceTimesSection（聚會時間）

**現況：** 3 個時段 card，`dark-section` 背景（確認）或 white？

需確認背景顏色後決定，但設計方向：
- 若為 white 背景：加入 `border-wine-100` card border + `card-lift`
- 若為 dark 背景：card 使用 `glass-card`（已有）+ 金色分隔線

**不改：** 時段資訊、icon、多語文字。

---

### D6. SundayMessageSection

**現況：** `bg-[#fdfaf5]`，左圖右文 card，`shadow-lg shadow-wine-100/60`

**問題：** `divider-gold` 目前只在標題下方，card 底部無收尾。

**建議：**
- 標題區 eyebrow + `divider-gold`：維持（已有）
- Card 內部左側圖片欄（`lg:w-[52%]`）可加 `rounded-l-3xl` 使角落更柔和（目前只有外層 `rounded-3xl`，確認渲染）
- Watch CTA 按鈕樣式確認使用 `church-gradient` pill（已有）

**不改：** 資料來源、圖片尺寸、文字排版。

---

### D7. LatestSermons

**現況：** `dark-section` 背景，`glass-card` 3 欄，上下 wave SVG divider。

**問題：** `py-32` 過大；wave SVG 是否在兩端？

**建議：**
- `py-32` → `py-24`（section spacing scale M→L 調整）
- 確認 wave SVG 在 top AND bottom 均有渲染
- YouTube card 縮圖 aspect-ratio `aspect-video` 確認（避免 CLS）
- 標題 + eyebrow 與其他 section 對齊（同一 type-eyebrow token）

**不改：** dark 背景色、glass-card 設計、卡片結構。

---

### D8. UpcomingEvents

**現況：** Category color badge + date badge，`py-16`（確認）

**建議：**
- `py-16` → `py-20`（Section spacing M）
- Event card 加入 `card-lift`（已有 token）
- 空狀態 UI：已在 Phase 2 規格定義（D6），確認設計符合整體視覺語言

**不改：** category 色彩（event/notice/urgent），date badge 設計。

---

### D9. Footer

**現況：** `bg-wine-950`，3 欄，social icons，contact info。

**問題：** Quick links 欄位在行動版塌陷為 1 欄時，9 個連結缺乏視覺組織。

**建議：**
- 行動版 footer links 加 `grid grid-cols-2` wrapping（讓 9 個連結分兩欄）
- Social icon hover：`hover:bg-wine-700` → 考慮加 `hover:scale-105 transition-transform`（微互動）
- Copyright bar 確認 `text-wine-400` 在 `bg-wine-950` 上對比 ≥ 3:1

**不改：** 欄位結構、聯絡資訊、social icons SVG。

---

## E. Desktop / Tablet / Mobile 差異

### E1. Header

| 裝置 | 佈局 | 特殊行為 |
|---|---|---|
| Mobile (< 1024px) | Logo + Lang + Hamburger | Mobile overlay menu |
| Desktop (≥ 1024px) | Logo + Nav links + Resources dropdown + Lang | Hover dropdown |

### E2. Hero

| 裝置 | 特殊 |
|---|---|
| Mobile | CTA 2×2 grid；H1 `text-3xl`；Stats 2×2 |
| Tablet (sm) | CTA flex-row；H1 `text-6xl`；Stats flex-row |
| Desktop (md) | H1 `text-7xl`；max-w-4xl content |

**關鍵：** 行動版 H1 `text-3xl`（30px）跳到 tablet `text-6xl`（60px）落差太大。
建議：加入 `xs:text-4xl`（40px）中間級（或調整為 `text-4xl sm:text-5xl md:text-7xl`）。

### E3. Homepage Section Grid

| 裝置 | WelcomeSection | ServiceTimes | Sermons | Events |
|---|---|---|---|---|
| Mobile | 1 col | 1 col | 1 col | 1 col |
| Tablet (sm/md) | 2 col | 2 col | 2 col | 1 col |
| Desktop (lg) | 4 col | 3 col | 3 col | 1 col（list）|

**Mobile card 間距：** 確認 `gap-4`（16px）在 1 欄時不過稀疏。

### E4. SundayMessageSection

| 裝置 | 佈局 |
|---|---|
| Mobile (< lg) | `flex-col`：圖片全寬在上，文字在下 |
| Desktop (≥ lg) | `flex-row`：圖 52% + 文 48% |

圖片在 mobile 需確認 `h-auto`（不固定高度），維持原始 aspect ratio。

### E5. Footer

| 裝置 | 佈局 |
|---|---|
| Mobile | 1 col；links 2 欄 grid（建議修改）|
| Tablet+ (md) | 3 col |

---

## F. Component Impact

以下列出視覺改動對現有元件的影響，按修改幅度排序：

### 高影響（需仔細測試）

| 元件 | 改動 | 影響 |
|---|---|---|
| `Hero.tsx` | CTA 3/4 降級樣式（border 色） | 視覺層次變化，功能不變 |
| `page.tsx` | Suspense + Skeleton 版型一致性 | 需確認 skeleton grid 與實際 card 對齊 |

### 中影響（定向修改）

| 元件 | 改動 | 影響 |
|---|---|---|
| `WelcomeSection.tsx` | 加 `card-lift` class | 純 class 新增，無功能影響 |
| `UpcomingEvents.tsx` | 加 `card-lift`；py 調整 | 純 class 調整 |
| `Footer.tsx` | Mobile links → 2-col grid | RWD layout 微調 |
| `LatestSermons.tsx` | py-32 → py-24 | 只改 spacing |

### 低影響（Token 規範）

| 元件 | 改動 |
|---|---|
| 全站 section headings | eyebrow tracking 統一為 `tracking-[0.3em]` |
| 全站 body text | `text-sm` → `text-base`（正文）|
| `globals.css` | 無新增；確認現有 token 完整 |

---

## G. Implementation Order

按視覺影響與風險由低至高排序，每步驟可獨立驗證：

### Step 1 — Typography 規範化（最低風險）
- 統一 eyebrow tracking
- 統一 section H2 class（type-h2 token）
- 統一 body text-base

### Step 2 — Spacing 規範化
- Section py 調整（LatestSermons py-32→py-24 等）
- Footer mobile links 2-col grid

### Step 3 — Card Token 套用
- WelcomeSection、UpcomingEvents 加 `card-lift`
- 確認 wave SVG 在 LatestSermons 兩端渲染

### Step 4 — CTA 層級修正（Hero）
- CTA 3/4 border 降至 `border-white/25 text-white/60`

### Step 5 — Hero H1 斷點補強（P2）
- `text-3xl sm:text-5xl md:text-7xl`（加中間級）

### Step 6 — Skeleton 視覺對齊（配合 Phase 2）
- SermonsSkeleton、SundayMessageSkeleton grid 對齊實際 card

---

## H. 明確禁止修改的區域

以下區域視覺不得改動：

| 區域 | 原因 |
|---|---|
| `church-gradient` token 定義 | 品牌核心，已在全站使用 |
| wine-* 色彩 token | 不新增、不修改任何 token 值 |
| Hero 背景圖 + overlay 組合 | 品牌視覺核心 |
| Header amber top bar | 品牌識別元素 |
| `dark-section` token | Sermons 區段核心背景 |
| `divider-gold` token | 已確立的裝飾語言 |
| Footer wine-950 背景 | 品牌一致性 |
| 任何 SEO / JSON-LD 輸出 | Phase 2 Protected |
| Sanity / Supabase 資料流 | Phase 2 Protected |
| i18n / routing 設定 | Phase 2 Protected |
| Prayer Wall 功能 | Phase 2 Protected |
| Auth 流程 | Phase 2 Protected |

---

## Open Design Questions

以下需在 Step 4 前確認：

| # | 問題 | 建議決策 |
|---|---|---|
| Q1 | ServiceTimesSection 的背景是 white 還是 dark？ | 讀取確認後決定 card 樣式 |
| Q2 | LatestSermons wave SVG 是否在兩端渲染？ | 讀取確認，若缺漏加底部 wave |
| Q3 | Hero H1 `text-3xl` → `text-6xl` 是否要補中間級？ | 建議加 `sm:text-5xl`，確認 break-words |
| Q4 | Footer mobile quick links 是否接受 2-col grid？ | 需確認緬甸語長文字不截斷 |

---

*本規格由 Claude Code (claude-sonnet-4-6) 生成，基於 frontend-design Skill（Design System Mode）。所有 UI 改動須先通過 docs/frontend-upgrade-spec.md 的 lint / tsc / build 驗證基準。*
