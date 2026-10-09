# chweb UI/UX Design System — MASTER

**Status:** Draft
**Phase:** 4 — UI/UX System Planning（程式碼禁止修改）
**Date:** 2026-10-09
**Author:** Claude Code (Lead Software Engineer)
**Source Specs:**
- `docs/frontend-upgrade-spec.md` (v2, SPEC APPROVED)
- `docs/visual-design-spec.md` (DESIGN APPROVED)

---

## Design Context

**Product type:** Religious community / Church official website
**Style:** Accessible & Ethical — High contrast, WCAG AA, keyboard navigation, screen-reader friendly
**Brand direction:** Refined Heritage — wine/amber palette, 沉穩、真誠、現代
**Stack:** Next.js 16.3.5 + Tailwind CSS v4 + next-intl (zh-TW / en / my / ja)
**Approach:** Design System Mode — 在既有 token 系統上精煉，不重設計

---

## A. Design Tokens

### A1. Color System

所有色彩 token 來自現有 `globals.css`。**不新增任何色彩值。**

#### Brand Palette

| Token | CSS Variable | Hex | 用途 |
|---|---|---|---|
| `wine-50` | `--color-wine-50` | `#fdf3f4` | hover bg、subtle tint |
| `wine-100` | `--color-wine-100` | `#fbe5e8` | card border、subtle bg |
| `wine-200` | `--color-wine-200` | `#f6c8cd` | disabled border |
| `wine-300` | `--color-wine-300` | `#efa0a9` | muted text on dark bg |
| `wine-400` | `--color-wine-400` | `#e2707d` | secondary icon |
| `wine-500` | `--color-wine-500` | `#ce4a58` | — |
| `wine-600` | `--color-wine-600` | `#b22e3c` | active text |
| `wine-700` | `--color-wine-700` | `#92202f` | primary text/active |
| `wine-800` | `--color-wine-800` | `#761929` | — |
| `wine-900` | `--color-wine-900` | `#621422` | heading |
| `wine-950` | `--color-wine-950` | `#380a14` | footer / hero overlay / dark bg |

| Token | Hex | 用途 |
|---|---|---|
| `amber-400` | `#f0c96e` | gold accent（亮） |
| `--accent` | `#c9a84c` | gold accent（標準） |
| `--primary` | `#7b1a2d` | brand primary |
| `--primary-dark` | `#380a14` | brand dark |

#### Semantic Color Mapping

| 用途 | Token | 場景 |
|---|---|---|
| Page BG | `white` / `bg-[#fdfaf5]` | 交替 light sections |
| Primary action | `bg-amber-400 text-wine-900` | CTA primary button |
| Primary hover | `bg-amber-300` | CTA primary hover |
| Ghost action | `border-amber-400/60 text-amber-300` | CTA secondary（on dark）|
| Ghost action（light） | `border-wine-300 text-wine-700` | Secondary CTA（on white）|
| Tertiary action | `border-white/25 text-white/60` | CTA 3rd/4th（on dark）|
| Destructive | `bg-red-400/10 border-red-400 text-red-300` | 直播中 CTA |
| Nav active | `text-wine-700 bg-wine-50` | Header nav active state |
| Nav hover | `text-wine-700 hover:bg-wine-50` | Header nav hover |
| Card border | `border-wine-100` | Standard card border |
| Card border（subtle）| `border-gray-100` | 次要 card |
| Footer bg | `bg-wine-950` | Footer background |
| Dark section | `dark-section` utility | LatestSermons section |

#### Announcement Badge Colors（禁止修改）

| Type | Badge | Bar |
|---|---|---|
| `event` | `bg-amber-100 text-amber-700 border-amber-200` | `bg-amber-400` |
| `notice` | `bg-sky-100 text-sky-700 border-sky-200` | `bg-sky-400` |
| `urgent` | `bg-red-100 text-red-700 border-red-200` | `bg-red-500` |

---

### A2. Typography Scale

6 semantic tokens，全部使用現有 Tailwind class，無新 CSS 變數。

| Token | Tailwind Class | Size | Weight | Line-height | 用途 |
|---|---|---|---|---|---|
| `type-display` | `text-4xl sm:text-5xl md:text-7xl` | 36→48→72px | `font-bold` | `leading-tight` | Hero H1（唯一一處）|
| `type-h1` | `text-3xl sm:text-4xl` | 30→36px | `font-bold` | `leading-tight` | 頁面級標題 |
| `type-h2` | `text-2xl sm:text-3xl` | 24→30px | `font-bold` | `leading-snug` | Section 標題 |
| `type-h3` | `text-lg sm:text-xl` | 18→20px | `font-semibold` | `leading-snug` | Card 標題 |
| `type-body` | `text-base` | 16px | `font-normal` | `leading-relaxed` | 正文（**最小 16px，mobile 必守**）|
| `type-caption` | `text-sm` | 14px | `font-normal` | `leading-normal` | 輔助文字、時間、tag |
| `type-eyebrow` | `text-xs font-semibold tracking-[0.3em] uppercase` | 12px | `font-semibold` | `leading-normal` | 區段識別（tracking 統一為 0.3em）|

**Hero H1 斷點決策（唯一版本）：**
`text-4xl sm:text-5xl md:text-7xl`
- mobile 375px → 36px（比原 30px 更大，避免跳太大）
- tablet 640px → 48px
- desktop 768px → 72px
- **不使用 `xs:` breakpoint**（Tailwind v4 預設無 xs）

**字型 stack（不修改）：**
```css
font-family: var(--font-geist-sans), -apple-system, 'Microsoft JhengHei', 'PingFang TC', sans-serif;
```
緬甸語（my）補強：P2 phase 在 `<html lang="my">` 時加 `'Padauk', 'Myanmar Text'` fallback。

**行寬限制：**
- 正文段落：`max-w-2xl`（≈ 65–72 字元/行，最佳可讀性）
- Section 說明文字：`max-w-xl`

---

### A3. Spacing Scale

對應 visual-design-spec.md Section Spacing，統一 section vertical rhythm。

| Level | Token | 用途 |
|---|---|---|
| XS | `py-10` | AnnouncementBanner |
| S | `py-16` | WelcomeSection、Footer |
| M | `py-20` | ServiceTimesSection、UpcomingEvents |
| L | `py-24` | SundayMessageSection、LatestSermons |
| XL | `min-height: max(92svh, 92vh)` | Hero（唯一）|

**內部 card padding：**
- Standard card：`p-5` → `p-6`
- Compact card：`p-4`
- Dense list item：`px-4 py-2.5`

**Gap scale：**
- Card grid：`gap-4` (mobile) → `gap-6` (desktop)
- Inline button group：`gap-3`
- Icon + text：`gap-2`（minimum 8px，符合 touch spacing rule）
- Section heading → content：`mb-10` → `mb-12`

---

### A4. Container Widths

維持現有，不修改。

| Context | Class |
|---|---|
| All pages | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| Body copy | `max-w-2xl` |
| Narrow section（AnnouncementBanner）| `max-w-4xl` |

---

### A5. Grid System

| Section | Mobile | Tablet (sm) | Desktop (lg) |
|---|---|---|---|
| WelcomeSection | `grid-cols-1` | `grid-cols-2` | `grid-cols-4` |
| ServiceTimes | `grid-cols-1` | `grid-cols-2` | `grid-cols-3` |
| LatestSermons | `grid-cols-1` | `grid-cols-2` | `grid-cols-3` |
| Hero CTA | `grid-cols-2` | `flex flex-row` | `flex flex-row` |
| Hero Stats | `grid-cols-2` | `flex flex-row` | `flex flex-row` |
| Footer | `grid-cols-1` + links `grid-cols-2` | `grid-cols-3` | `grid-cols-3` |

---

### A6. Border Radius

| Token | Class | 用途 |
|---|---|---|
| Small | `rounded-md` | Nav items、badge |
| Medium | `rounded-xl` | 小型 dropdown |
| Large | `rounded-2xl` | Standard card |
| XLarge | `rounded-3xl` | Feature card（SundayMessage）|
| Full | `rounded-full` | Pill button、avatar、lang switcher |

---

### A7. Shadow / Elevation

| Level | Class | 用途 |
|---|---|---|
| 0 | `shadow-none` | Flat / ghost element |
| 1 | `shadow-sm` | Header、subtle card |
| 2 | `shadow-md shadow-wine-100/40` | Standard card |
| 3 | `shadow-lg shadow-wine-100/60` | Feature card（SundayMessage）|
| Hover lift | `card-lift` utility（translateY -6px + shadow）| Interactive card hover |
| Hover glow | `card-glow` utility（wine-tinted box-shadow）| Dark section card hover |

---

### A8. Z-Index Scale

統一的 z-index 層級，避免 `z-[9999]`。

| Level | Value | 用途 |
|---|---|---|
| Base | `z-0` | 一般 DOM |
| Raised | `z-10` | Card hover overlay |
| Dropdown | `z-20` | Resources dropdown、lang dropdown |
| Sticky | `z-50` | Header（sticky top-0）|
| Modal | `z-[60]` | Prayer Wall modal |
| Skip link | `z-[100]` | SkipToContent（must be highest）|

---

## B. Component States

### B1. Buttons

#### Primary CTA（amber solid pill）

```
Default:   bg-amber-400 text-wine-900 font-bold rounded-full shadow-lg shadow-amber-400/30
Hover:     bg-amber-300 shadow-amber-400/50
Active:    bg-amber-300 scale-[0.98]
Focus:     ring-2 ring-amber-400 ring-offset-2
Disabled:  opacity-50 cursor-not-allowed
```

**Touch target：** `min-h-[44px] px-7 py-3`（min 44×44px，WCAG 2.5.5）

#### Secondary CTA（ghost pill on dark）

```
Default:   border border-amber-400/60 text-amber-300 rounded-full backdrop-blur-sm
Hover:     bg-amber-400/10 border-amber-400
Active:    bg-amber-400/15 scale-[0.98]
Focus:     ring-2 ring-amber-400/50 ring-offset-1 ring-offset-wine-950
Disabled:  opacity-40 cursor-not-allowed
```

#### Tertiary CTA（ghost pill on dark, 第 3/4 CTA）

```
Default:   border border-white/25 text-white/60 rounded-full
Hover:     bg-white/5 border-white/40 text-white/80
Active:    bg-white/10 scale-[0.98]
Focus:     ring-2 ring-white/30
Disabled:  opacity-30 cursor-not-allowed
```

#### Ghost CTA（on light bg）

```
Default:   border border-wine-300 text-wine-700 rounded-full
Hover:     bg-wine-50 border-wine-400
Active:    bg-wine-100 scale-[0.98]
Focus:     ring-2 ring-wine-400 ring-offset-2
Disabled:  opacity-50 cursor-not-allowed
```

#### Live Status Button（特殊 CTA）

```
Live:      border-red-400 text-red-300 bg-red-400/10 → hover:bg-red-400/20
Offline:   border-white/20 text-white/40 → hover:bg-white/5
Loading:   border-white/20 text-white/30 (no hover)
```

**規則：** 三種狀態均需保留，不得合併或刪除 loading 狀態。

---

### B2. Cards

#### Standard Card（WelcomeSection, UpcomingEvents）

```
Default:   bg-white rounded-2xl border border-wine-100 shadow-md shadow-wine-100/40
           card-lift（hover: translateY(-6px), shadow升）
           cursor-pointer
Focus:     ring-2 ring-wine-400 ring-offset-2（若 card 為 <a> 或可聚焦）
```

#### Feature Card（SundayMessageSection）

```
Default:   bg-white rounded-3xl border border-gray-100 shadow-lg shadow-wine-100/60
           overflow-hidden flex flex-col lg:flex-row
```

#### Dark Section Card（LatestSermons）

```
Default:   glass-card（rgba(255,255,255,0.06) + backdrop-blur-12px + border rgba(255,255,255,0.12)）
           rounded-2xl overflow-hidden
Hover:     card-glow（wine-tinted box-shadow）
           cursor-pointer
```

#### Announcement Card

```
Default:   bg-white rounded-2xl border border-gray-100 p-5 shadow-sm
           相對定位 left color bar（1px wide）
With link: hover:border-wine-200 hover:shadow-md transition-all cursor-pointer
```

---

### B3. Navigation States

#### Desktop Nav Link

```
Default:  text-gray-600 px-3 py-2 rounded-md text-sm font-medium
Hover:    text-wine-700 bg-wine-50 transition-colors duration-150
Active:   text-wine-700 bg-wine-50（isActive 判斷）
Focus:    ring-2 ring-wine-400 ring-offset-1（outline-none 搭配）
```

#### Mobile Nav Link

```
Default:  text-gray-700 px-3 py-2.5 rounded-md text-sm font-medium
Hover:    text-wine-700 bg-wine-50
Active:   text-wine-700 bg-wine-50
Min height: 44px（touch target）
```

#### Resources Dropdown（Desktop）

```
Trigger button: 同 Desktop Nav Link + aria-haspopup="menu" aria-expanded
Dropdown panel: bg-white rounded-2xl shadow-lg border border-wine-100 py-2 w-44
Menu item:      flex items-center gap-2.5 px-4 py-2.5 text-sm
                hover:text-wine-700 hover:bg-wine-50
                focus:bg-wine-50 focus:text-wine-700 focus:outline-none
                role="menuitem"
```

#### Language Switcher

```
Trigger: border border-gray-200 rounded-full px-3 py-1.5
         aria-label={locale label} aria-expanded
         hover:border-wine-300 hover:text-wine-700
         focus:ring-2 focus:ring-wine-400

Dropdown item: w-full flex items-center gap-2.5 px-4 py-2.5
               Selected: text-wine-700 bg-wine-50 font-medium
               Hover:    text-wine-700 hover:bg-wine-50
               Min height: 44px（touch target）
```

---

### B4. Form Controls

（適用於 Login / Register / Contact / Prayer Wall submit 表單）

```
Input Default:   border border-gray-200 rounded-xl px-4 py-3 text-base
                 text-gray-900 bg-white placeholder:text-gray-400
                 focus:border-wine-400 focus:ring-2 focus:ring-wine-400/30 focus:outline-none
Input Error:     border-red-400 focus:ring-red-400/30
Error message:   text-sm text-red-600 mt-1 role="alert"（aria-live="polite"）
Label:           text-sm font-semibold text-wine-900 mb-1（配合 htmlFor）
Disabled:        bg-gray-50 text-gray-400 cursor-not-allowed
```

**Font size ≥ 16px（iOS auto-zoom 已由 globals.css 處理）**

---

### B5. Loading / Skeleton States

#### Skeleton 通用規格

```
色彩: bg-wine-100/60 animate-pulse（light section）
      bg-white/10 animate-pulse（dark section）
圓角: 與實際 card 一致（rounded-2xl / rounded-xl）
比例: aspect-video for 影片縮圖; h-{n} for 文字行
```

**重要：** Skeleton 的 grid 結構必須與實際 card 版型完全一致（同斷點、同 gap），避免 layout shift。

#### SermonsSkeleton（dark section）

```
背景: dark-section py-24（與 LatestSermons 一致，py-32 → py-24）
Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
Card: rounded-2xl overflow-hidden bg-white/5
      aspect-video bg-white/10 animate-pulse
      p-4: h-4 bg-white/10 + h-3 w-3/4 bg-white/10（各 animate-pulse）
```

#### SundayMessageSkeleton

```
背景: py-24 bg-[#fdfaf5]
Layout: flex flex-col lg:flex-row（與 SundayMessageSection 一致）
Image side: lg:w-[52%] bg-wine-100 animate-pulse aspect-video
Text side: flex flex-col gap-4 p-8 lg:p-12
           h-3 w-24 bg-wine-100 rounded
           h-8 w-3/4 bg-wine-100 rounded
           h-4 w-1/2 bg-wine-100 rounded
           h-4 bg-wine-100 rounded × 3
```

#### EventsSkeleton

```
背景: py-20 bg-white
List: space-y-3
Item: h-20 bg-wine-50 rounded-2xl animate-pulse
```

#### Hero Live Status Loading

```
// 直播按鈕 loading 狀態
border border-white/20 text-white/30 rounded-full
（無 hover，無 cursor-pointer；非 disabled，只是 pending）
```

---

### B6. Empty States

所有 empty state 必須包含：圖示 + 標題 + 說明文字 + CTA（可選）。

#### UpcomingEvents Empty State

```
容器: py-16 text-center（在 section 白色背景內）
Icon: CalendarX2, size=36, text-wine-300（不加 opacity 在整個容器）
Title: text-lg font-semibold text-wine-800 mt-4
Body: text-sm text-gray-500 mt-2 max-w-sm mx-auto
CTA:  mt-6 church-gradient text-white px-6 py-2.5 text-sm font-semibold rounded-full
      href="/{locale}/events"
```

#### SundayMessageSection Empty State

```
容器: py-24 bg-[#fdfaf5]
Inner: max-w-7xl mx-auto px-4 text-center
Icon: BookOpen, size=40, text-wine-300
Text: text-wine-600 text-base mt-4（t('sundayMessage.pending')）
// 不使用 opacity 包覆整個容器；文字使用具體色彩
```

#### AnnouncementBanner Empty State

```
// 無公告時 return null（維持現有行為，公告為空即無 banner）
// 不顯示 empty state
```

---

### B7. Error States

```
全域: 目前無 Error Boundary（P2 實作）
      暫行：fetch 失敗時各 section 顯示靜默 fallback（empty state UI）

Announcement API 失敗: return null（維持）
SundayMessage 失敗:    顯示 pending fallback（同 empty state）
LatestSermons 失敗:    Suspense 本身不捕捉 error；
                       P2 補 <ErrorBoundary fallback={<SermonsSkeleton />}>
UpcomingEvents 失敗:   顯示 empty state

// Error message（表單）
role="alert" aria-live="polite"
text-red-600 text-sm
在問題欄位正下方，不只用紅色 border
```

---

### B8. Hover / Focus / Active / Disabled 統一規格

| State | Pattern |
|---|---|
| Hover | `transition-colors duration-150`（所有 interactive element 必加）|
| Focus | `focus:outline-none focus:ring-2 focus:ring-{color} focus:ring-offset-{n}`（不得移除 outline 而不替換）|
| Active | `active:scale-[0.98]`（按鈕）/ `active:bg-wine-100`（nav item）|
| Disabled | `disabled:opacity-50 disabled:cursor-not-allowed`（不得僅用顏色表示）|
| Cursor | `cursor-pointer` 必須加在所有 clickable card / button / link（icon-only 除外）|

**Focus ring 色彩映射：**
- Light bg 上：`ring-wine-400 ring-offset-2`
- Dark bg 上：`ring-amber-400/60 ring-offset-1 ring-offset-wine-950`
- 語言 dropdown item：`ring-wine-400`

---

## C. Responsive Rules

### C1. Breakpoints

```
mobile:  0–639px   (< sm)   預設，mobile-first
tablet:  640–1023px (sm–lg)  2-col grid、hamburger
desktop: 1024px+   (≥ lg)   full nav、3/4-col grid
wide:    1280px+   (≥ xl)   max-w-7xl 達到最大容器寬
```

**不使用 `xs:` breakpoint**（Tailwind v4 預設不定義）。

### C2. 最小觸控目標

**所有 interactive element：** `min-h-[44px]` + `min-w-[44px]`（iOS HIG + WCAG 2.5.5）

```
Header hamburger:   p-2 → 保持 ≥ 44×44px
Nav links:          py-2.5（高度 ≥ 44px）
Lang dropdown items: py-2.5
CTA buttons:        py-3（高度 ≥ 44px，搭配 text-base）
Card with link:     padding 確保可點區域 ≥ 44px high
```

**相鄰觸控目標間距：** `gap-2`（8px）最小。

### C3. 文字大小最小值

| 場景 | 最小 size |
|---|---|
| Body text（所有裝置）| `text-base`（16px）|
| Caption / helper text | `text-sm`（14px，acceptable）|
| Nav link（mobile）| `text-sm`（14px，OK 因 min-height 保障 touch）|
| Input field | `text-base`（16px）iOS auto-zoom 已由 globals.css 防止 |

### C4. 橫向捲動防護

```
// 所有 section：
overflow-x: hidden（在 <body> 或 layout 層）
// 不得有 fixed-width element > 100vw（Hero dot pattern 已是 absolute + overflow-hidden）
// breakpoint 切換時用 DevTools 375px 驗證
```

---

## D. Accessibility Rules

### D1. WCAG 2.1 AA 對照表

| 條款 | 規格 | 驗證方式 |
|---|---|---|
| 1.4.3 Text Contrast | 一般文字 ≥ 4.5:1；大文字（18pt/14pt bold）≥ 3:1 | Chrome Accessibility DevTools |
| 1.4.11 Non-text Contrast | UI 元件邊框、圖示 ≥ 3:1（對背景）| 同上 |
| 2.1.1 Keyboard | 所有功能可鍵盤操作 | Tab + Arrow 全站測試 |
| 2.1.2 No Keyboard Trap | Focus 只能被困在 modal/overlay 中，且有明確退出方式 | Mobile menu Escape + hamburger focus 回歸 |
| 2.4.1 Bypass Blocks | Skip-to-content link | 第一個 Tab 顯示 |
| 2.4.3 Focus Order | Tab 順序符合視覺順序 | DevTools Accessibility Tree |
| 2.4.7 Focus Visible | focus ring 清楚可見 | 手動驗證（不得 outline:none without ring）|
| 4.1.2 Name, Role, Value | 所有 UI 元件有名稱、角色、狀態 | ARIA attribute audit |
| 1.3.1 Info & Relationships | 語意 HTML（`<nav>`, `<main>`, `<section>`, `<footer>`）| HTML validator |

### D2. ARIA 必要清單

| 元件 | 必要 ARIA |
|---|---|
| Skip-to-content | `<a href="#main-content">` → `<main id="main-content">` |
| Hamburger button | `aria-label` 動態（開啟/關閉）+ `aria-expanded` + `aria-controls` |
| Mobile menu `<nav>` | `id="mobile-menu"` + `aria-label` |
| Resources button | `aria-haspopup="menu"` + `aria-expanded` + `aria-controls` |
| Resources dropdown | `role="menu"` + items `role="menuitem"` |
| Lang switcher | `aria-label={locale name}` + `aria-expanded` |
| Flag icon spans | `aria-hidden="true"` |
| Decorative icons | `aria-hidden="true"` |
| Error messages | `role="alert"` 或 `aria-live="polite"` |
| Announcement expand toggle | `aria-expanded` + `aria-controls` |
| Hero scroll indicator | `aria-hidden="true"` |
| Stats decorative numbers | `aria-hidden="true"` 或配 visually-hidden 說明文字 |

### D3. Focus Ring 規格

**原則：**
- 使用 `focus-visible:` 而非 `focus:`（滑鼠點擊不觸發 ring，鍵盤/SR 操作才觸發）
- `outline-none` 只能搭配有效、可見的替代 focus-visible 樣式使用，不可單獨出現
- Ring 必須在 light / dark 背景下均有足夠對比（≥ 3:1 against adjacent bg）
- 不可只依賴顏色差異；ring 的幾何外框本身即為非顏色視覺指示
- Focus ring 不可被 `overflow: hidden` 或 `clip-path` 遮蔽——有 `overflow-hidden` 的容器需改為 `overflow: clip`，或確保 focused child 使用 `outline` 而非 `box-shadow`

#### Light background（白色 / wine-50 / #fdfaf5 背景）

```html
<!-- Tailwind utilities 寫法 -->
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-wine-400
focus-visible:ring-offset-2
```

> ring-wine-400 = `#e2707d`；對白色背景對比 ≈ 3.2:1（通過 WCAG 1.4.11 non-text）

#### Dark background（wine-950 / dark-section 背景）

```html
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-amber-400/60
focus-visible:ring-offset-1
focus-visible:ring-offset-wine-950
```

> `ring-offset-[token]` 在 Tailwind v4 以 `ring-offset-{color}` utility 設定 ring 與元素之間的間隔色，與 CSS `outline-offset` 不同

#### 各元素套用清單

| 元素 | Light BG class | Dark BG class |
|---|---|---|
| `<button>` | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-2` | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-wine-950` |
| `<a>` / link | 同 button（light）| 同 button（dark）|
| `<input>` | `focus-visible:outline-none focus-visible:border-wine-400 focus-visible:ring-2 focus-visible:ring-wine-400/30` | — |
| `<select>` | 同 input（light）| — |
| `<textarea>` | 同 input（light）| — |
| Nav menu item | `focus-visible:outline-none focus-visible:bg-wine-50 focus-visible:text-wine-700` + `ring-2 ring-wine-400` | — |
| Resources dropdown item（`role="menuitem"`）| `focus:outline-none focus:bg-wine-50 focus:text-wine-700` | — |
| Disclosure trigger（Announcement expand）| `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-2` | — |
| Language switcher trigger | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-1` | — |
| Language switcher dropdown item | `focus:outline-none focus:bg-wine-50 focus:text-wine-700` | — |

> `menuitem` / dropdown 使用 `focus:` 而非 `focus-visible:`，因為這些元素由鍵盤 ArrowKey 聚焦，瀏覽器不一定將 ArrowKey 觸發的 focus 視為 keyboard interaction，故兩者都需要。

**`focus-visible` 而非 `focus`**（避免滑鼠點擊也出現 ring）——例外：menu item 同時保留 `focus:` 以確保 ArrowKey 導覽可見。

---

## E. Interaction Rules

### E1. Animation 規範

| 場景 | 規格 | 理由 |
|---|---|---|
| Scroll reveal（FadeIn）| opacity + translateY, 700ms ease-out | 已有，維持 |
| Card lift | translateY(-6px) + shadow, 250ms ease | 已有 `card-lift` |
| Nav dropdown | opacity 0→1, 150ms ease-out | 快速回饋 |
| Lang dropdown | 同上 | — |
| Button click | scale 0.98, 100ms ease | 觸覺回饋 |
| Live indicator ping | animate-ping（infinite，**合理**：功能指示非裝飾）| 直播中唯一的 infinite |
| News ticker | ticker-scroll（infinite，功能性）| 維持 |

**禁止：**
- animate-bounce 用於裝飾性圖示（scroll indicator 已是 ChevronDown，可維持，但屬邊界案例；P2 考慮移除）
- 同一個 view 內超過 2 個 FadeIn 同時觸發（目前 Hero 內無 FadeIn，各 section 各自 FadeIn，OK）
- 所有 property transition 改用 CSS transform / opacity（不做 width/height 動畫）

### E2. prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  /* FadeIn */
  .transition-all { transition: none; }
  .opacity-0 { opacity: 1; }
  .translate-y-7 { transform: none; }

  /* Card lift */
  .card-lift:hover { transform: none; }

  /* Ticker scroll */
  .animate-[ticker-scroll] { animation: none; }

  /* Live ping */
  .animate-ping { animation: none; }

  /* Hero scroll bounce */
  .animate-bounce { animation: none; }
}
```

**實作方式：** 在 `globals.css` 加入 `@media (prefers-reduced-motion: reduce)` block。

### E3. Transition Timing

| 類型 | Duration | Easing |
|---|---|---|
| Color / border（nav, button）| 150ms | `ease` |
| Shadow / transform（card）| 250ms | `ease` |
| Dropdown open | 150ms | `ease-out` |
| Page section FadeIn | 700ms | `ease-out` |
| 不得使用 | `linear`（機器人感）| — |

### E4. Cursor Rules

```
所有 <button>:   cursor-pointer（已有，確認全站一致）
所有 <a>:        cursor-pointer（瀏覽器預設，確認不被覆寫）
所有 card with onClick: cursor-pointer（手動加）
Disabled state:  cursor-not-allowed
Loading state:   cursor-wait（async 操作進行中）
```

---

## F. Implementation Order

按風險由低至高，每步可獨立測試：

| Step | 工作 | 影響範圍 | 對應規格 |
|---|---|---|---|
| 1 | Typography 規範化（eyebrow tracking、body text-base）| 全站文字 | B, type-eyebrow |
| 2 | Spacing 規範化（section py 調整）| 版面高度 | A3 |
| 3 | prefers-reduced-motion（globals.css 新增 block）| 動畫 | E2 |
| 4 | P0 Accessibility（SkipToContent + layout）| layout.tsx | D, A8 |
| 5 | P0 Header focus trap + ARIA | Header.tsx | B3, D2 |
| 6 | P1 Image optimization（next.config.ts + unoptimized）| LatestSermons | A1, G2 |
| 7 | P1 ISR（setRequestLocale + revalidate）| page.tsx, layout.tsx | A8 前提 |
| 8 | P1 Card token 套用（card-lift）| WelcomeSection, Events | B2 |
| 9 | P1 Empty states / Skeletons | UpcomingEvents, Sermons, Sunday | B5, B6 |
| 10 | P1 i18n 遷移（copy → messages JSON）| SundayMessage, ServiceTimes | — |
| 11 | P2 Hero CTA 降級（tertiary border）| Hero.tsx | B1 |
| 12 | P2 Footer mobile 2-col links | Footer.tsx | C1 |
| 13 | P2 Hero H1 斷點修正 | Hero.tsx | A2 |
| 14 | P2 Error Boundary 全域 | app/[locale]/layout.tsx | B7 |

---

## G. 可重用元件清單

以下現有元件可直接套用 Design System token，無需改寫邏輯：

| 元件 | 可重用方式 |
|---|---|
| `FadeIn.tsx` | 直接使用，加 reduced-motion 覆寫即可 |
| `church-gradient` | 所有主要 CTA pill button 直接使用 |
| `card-lift` | 所有 interactive card 加 class |
| `card-glow` | 所有 dark section card 加 class |
| `divider-gold` | Section heading 下方統一使用 |
| `glass-card` | 只限 dark-section 內的 card |
| `btn-amber` | 可在 non-Tailwind context 使用；Tailwind context 改用 token class |
| `dark-section` | LatestSermons 背景，可複用 |
| `gradient-text-gold` | Hero stats 數字，可複用 |
| `type-eyebrow` pattern | 每個 section heading 上方的 label |

---

## H. 禁止修改的元件 / 區域

| 元件 / 區域 | 禁止原因 |
|---|---|
| `src/components/seo/ChurchJsonLd.tsx` | SEO schema 已修正 |
| `src/lib/sanity/**` | 資料契約不得異動 |
| `src/lib/supabase/**` | Auth 不得異動 |
| `supabase/migrations/**` | Schema 不得異動 |
| `src/app/[locale]/prayer-wall/**` | 讀寫行為 + 無登入門檻 |
| `src/components/prayer/PrayerWall.tsx` | Supabase Auth 整合 |
| `src/app/[locale]/login/**` | Auth flow |
| `src/app/[locale]/register/**` | Auth flow |
| `src/app/api/**` | API contracts |
| `src/lib/i18n/**` | Routing config |
| `src/proxy.ts` | Locale redirect |
| `package-lock.json` | 不引入新 npm 依賴 |
| `church-gradient` CSS token | 品牌核心，不修改值 |
| wine-* color tokens | 不新增、不修改 |
| `dark-section` token | Sermons 核心背景 |
| Hero background + overlay | 視覺核心 |

---

## I. 實作驗證清單

### I1. 每次修改後必須通過

```bash
npm run lint        # 0 errors（≤ 4 known P2 warnings）
npx tsc --noEmit    # 0 errors
npm run build       # PASS
```

### I2. Visual Checklist

- [ ] 所有 `<button>` 和 `clickable card` 有 `cursor-pointer`
- [ ] 所有 `<a>` 有 `href`（不用 `<div onClick>`）
- [ ] 所有 interactive element 有 `transition-colors duration-150`
- [ ] 無 emoji 作為 UI icon（全站已用 Lucide SVG）
- [ ] Hover state 不造成 layout shift（card-lift 的 translateY 不影響相鄰元素）
- [ ] Light mode：body text 對比 ≥ 4.5:1
- [ ] Glass card 只用於 dark-section（`bg-rgba(255,255,255,0.06)` 在 white bg 上不可見）

### I3. Responsive Checklist（每個斷點）

| 尺寸 | 確認項目 |
|---|---|
| 375px 直向 | Hero CTA 2×2 grid；文字無截斷；觸控目標 ≥ 44px |
| 375px 橫向 | Header 不遮內容；Skip-to-content 可用 |
| 768px | SundayMessage flex-col（lg 前）；nav 仍為 hamburger |
| 1023px | hamburger 顯示（< lg）；desktop nav 隱藏 |
| 1024px | desktop nav 顯示；hamburger 隱藏 |
| 1440px | max-w-7xl 容器置中；無水平捲動 |

### I4. Accessibility Checklist

- [ ] Tab 鍵第一個 focus = Skip-to-content link（所有頁面，非僅首頁）
- [ ] Resources dropdown：Enter 開啟 → ArrowDown/Up 導覽 → Escape 關閉 + focus 回 trigger
- [ ] Mobile menu：Escape 關閉 + focus 回 hamburger；Tab 不外漏
- [ ] 語言切換 button 朗讀 locale name（不朗讀 flag icon）
- [ ] Hamburger aria-label 隨開/關動態切換
- [ ] Error messages 有 `role="alert"` 或 `aria-live="polite"`
- [ ] 所有裝飾性 icon 有 `aria-hidden="true"`
- [ ] Announcement expand button 有 `aria-expanded` + `aria-controls`

### I5. Interaction Checklist

- [ ] `prefers-reduced-motion: reduce` 時：FadeIn 無動畫、ticker 暫停、card-lift 無 translateY
- [ ] CTA button 在 async 操作中呈 disabled + `cursor-wait`
- [ ] Live status 三態（loading / live / offline）各自渲染正確
- [ ] card-lift hover 的 box-shadow 以 `transition: transform 0.25s, box-shadow 0.25s` 實作（已有 `card-lift` utility）

### I6. Locale / Long-text Checklist

- [ ] 緬甸語（my）最長文字在所有斷點不截斷、不溢出
- [ ] 日語（ja）長名詞（如日期格式）不破壞 card 版型
- [ ] Footer mobile 2-col links：緬甸語不截斷
- [ ] Hero H1 四語均無 `overflow: hidden` 截字（確認 `break-words`）
- [ ] AnnouncementBanner：isPinned urgent 公告排在前方，不被隱藏

### I7. Data Source / API Checklist

- [ ] Prayer Wall 未登入可讀（不出現 redirect）
- [ ] UpcomingEvents 空資料顯示 empty state（非 null）
- [ ] SundayMessage 空資料顯示 pending fallback（非 null）
- [ ] YouTube thumbnail：i.ytimg.com + img.youtube.com 均可被 Next.js Image 優化
- [ ] ISR：build log 首頁從 λ → ● 或 ○（若 λ 則 ISR 延至 Phase 3）

---

*本文件由 Claude Code (claude-sonnet-4-6) 基於 ui-ux-pro-max Skill 生成，整合 docs/frontend-upgrade-spec.md (v2) 與 docs/visual-design-spec.md 的核准規格。所有 src 程式碼修改須通過 lint / tsc / build 三關後方可 deploy。*
