---
target: homepage
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 4
p2_count: 1
target_identity: "file:/Users/louis/Desktop/chweb/src/app/[locale]/page.tsx"
target_fingerprint: "sha256:7de565069959e9daca1abedf3996c382d8340270a423aceb4d03f19ed2c61a02"
target_path: /Users/louis/Desktop/chweb/src/app/[locale]/page.tsx
timestamp: 2026-11-04T07-54-11Z
slug: src-app-locale-page-tsx
---
Method: dual-agent (A: aa010063c98b06956 · B: abe38ab34bab410d2)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Sunday Message 無新鮮度標示，回訪者無法確認是否為本週講道 |
| 2 | Match System / Real World | 3 | 教會詞彙自然；'∞ 神的恩典' 在統計列中讀起來像資料錯誤 |
| 3 | User Control and Freedom | 3 | 導覽功能正常；語言偏好未持久化 |
| 4 | Consistency and Standards | 3 | Token 系統一致；緬甸語 Pinned badge 顯示英文 |
| 5 | Error Prevention | 2 | 講道卡片 Play 按鈕指向列表頁，典型期望落差陷阱 |
| 6 | Recognition Rather Than Recall | 3 | 主要導覽清楚；Resources 下拉內容不可預覽 |
| 7 | Flexibility and Efficiency | n/a | Persuade 模式 |
| 8 | Aesthetic and Minimalist Design | 2 | 8 區塊競爭背景個性；Hero 同時承載過多元素 |
| 9 | Error Recovery | 2 | no-image placeholder text-white 在米白底不可見 |
| 10 | Help and Documentation | n/a | Persuade 模式 |
| **Total** | | **20/32** | **Acceptable — 有顯著改善空間** |

## Design Specificity Verdict

部分原創。wine/amber token 系統、bezel-card 架構、四語並行內容、CJK 逐字動畫是此教會特有的；但 section IA 是標準教會模板序列。
最深矛盾：DESIGN.md 宣告 Human-centered Editorial Design + Authentic Documentary Photography，但首頁無任何人物照片。
B 偵測：177 筆（154 advisory, 23 warnings）。homepage 相關：gradient-text × 2（意圖性）、side-tab × 3（border-l-4）。
Browser overlay 確認：LOW CONTRAST × 3、UNDERSIZED TEXT × 2 (10px)、BOUNCE EASING on scroll arrow、HERO EYEBROW PILL。

## Overall Impression

設計系統架構紮實，但首頁未兌現自身的設計宣言。Sunday Message 藏在第六個 section；Hero 照片不可見；無人物攝影。最大機會是結構性的。

## What's Working

1. Design token 凝聚力：wine/amber 色彩系統以真正 craft 紀律施行
2. 四語並行內容：罕見且真正服務多文化會眾
3. SundayMessageSection 版面組合：全站最強的單一 section

## Priority Issues

[P1] Sunday Message 藏在第 6 個 Section — 首頁最有價值的內容被 5 個通用 section 阻隔
Fix: Hero → Sunday Message → Service Times → Announcements → Sermons → Events
Command: /impeccable layout

[P1] 首頁零人物攝影 — Human-centered Editorial Design 未實現
Fix: 需要真實紀實照片。最小可行：SundayMessage 牧者照 + WelcomeSection 一張會眾照
Command: /impeccable shape

[P1] Hero 疊加層太暗 — 教會照片形同虛設
Fix: 三層疊加 → 單層 55-60%，移除 4 orb 和 sweep（shape brief 已確認）
Command: /impeccable craft hero

[P1] WelcomeSection 與 StatsBar 重複 — 兩個 scroll 內相同聚會時間 + 地點資訊
Fix: StatsBar 折入 Hero；WelcomeSection 換為情感引導內容
Command: /impeccable layout

[P2] 講道卡片 Play 按鈕指向列表頁，非影片
Fix: 直接連結 video.url 或 target="_blank" to YouTube
Command: /impeccable harden

## Persona Red Flags

Jordan (首次拜訪): 4 CTA 等重無主動線；first-visit 指引藏在 Resources；無人物照
Casey (手機單手): 10px ticker text (B 確認)；Play → list redirection；Sunday Message 在 section 6
Riley: no-image text-white on cream (A+B 雙方確認)；緬甸語公告顯示中/英文
長者回訪: 每週捲過 5 sections 才能找到 Sunday Message；10px badge text
緬甸語新移民: 無 titleMy 欄位；硬編碼 i18n；Pinned badge 顯示英文

## Minor Observations

- Hero scroll arrow 使用 animate-bounce，應改用 --ease-spring
- wine-500 on white 4.4:1，邊界無障礙失敗（B 確認）
- Newsletter placeholder #e2707d on #621422 = 4.2:1（B 確認）
- LatestSermons 無 md: breakpoint，iPad 寬度出現孤立卡片
- 首頁底部兩個連續轉換要求互相稀釋
- UpcomingEvents border-l-4 side-tab anti-pattern（B 確認）
