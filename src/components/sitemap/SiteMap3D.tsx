'use client';
// Pure imperative Three.js — Strict Mode safe (create/dispose on each mount cycle)

import { useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

// ─── Types / data ──────────────────────────────────────────────────────────────

type TextureType = 'volcanic' | 'gas' | 'earth' | 'barren';

interface SiteNode {
  id: string;
  labelZh: string;
  labelEn: string;
  path: string;
  group: 'core' | 'connect' | 'media' | 'community';
  size: number;
  color: string;
  glowColor: string;
  position: [number, number, number];
  connections: string[];
  tex: TextureType;
  descZh: string;
  descEn: string;
}

// Palette: 4 stained-glass jewel families
// Core      — amber gold    #3d1e06 / #d4921c
// Media     — royal purple  #1a0d38 / #8060c8
// Community — deep sapphire #0a1b38 / #3a7fd4
// Connect   — deep rose     #2a0d18 / #c04870

const NODES: SiteNode[] = [
  { id: 'home',           labelZh: '首頁',      labelEn: 'Home',       path: '/',                group: 'core',      size: 1.0,  color: '#3d1e06', glowColor: '#d4921c', position: [0, 0, 0],          connections: ['about','first-visit','services','events','sermons','bulletin'], tex: 'earth',   descZh: '歡迎來到行道會南勢角榮耀堂，認識我們的起點', descEn: 'Welcome to Glory Church of Nanshijiao' },
  { id: 'about',          labelZh: '關於我們',   labelEn: 'About',      path: '/about',           group: 'core',      size: 0.65, color: '#3a1c05', glowColor: '#c07e14', position: [-4.5, 1.5, -1],   connections: ['home','first-visit','contact'],          tex: 'volcanic', descZh: '認識教會的異象、歷史與同工團隊',         descEn: 'Our vision, history and leadership team' },
  { id: 'first-visit',    labelZh: '初次拜訪',   labelEn: 'First Visit',path: '/first-visit',     group: 'connect',   size: 0.6,  color: '#2a0d18', glowColor: '#c04870', position: [-3, -3, 1],       connections: ['home','about','services'],               tex: 'earth',   descZh: '新朋友必看：交通、流程與問答指南',          descEn: 'First-time visitor guide & directions' },
  { id: 'services',       labelZh: '聚會時間',   labelEn: 'Services',   path: '/services',        group: 'core',      size: 0.65, color: '#3d1e06', glowColor: '#d4921c', position: [3.5, -2.5, 0],    connections: ['home','events'],                        tex: 'volcanic', descZh: '主日禮拜 10:00–11:30，歡迎全家大小同來',   descEn: 'Sunday service 10:00–11:30, all welcome' },
  { id: 'events',         labelZh: '活動行事曆', labelEn: 'Events',     path: '/events',          group: 'community', size: 0.7,  color: '#0a1b38', glowColor: '#3a7fd4', position: [5, 1.5, 1],       connections: ['home','services','prayer-wall'],         tex: 'earth',   descZh: '節期特會、社區活動與教會行事曆',            descEn: 'Festivals, revivals & church calendar' },
  { id: 'sermons',        labelZh: '講道媒體',   labelEn: 'Sermons',    path: '/sermons',         group: 'media',     size: 0.7,  color: '#1a0d38', glowColor: '#8060c8', position: [1.5, 4, -2],      connections: ['home','daily-scripture'],               tex: 'gas',     descZh: '歷年講道影音、信息摘要與免費下載',          descEn: 'Sermon archive, audio & video library' },
  { id: 'bulletin',       labelZh: '教會週報',   labelEn: 'Bulletin',   path: '/weekly-bulletin', group: 'media',     size: 0.5,  color: '#160b32', glowColor: '#7050b8', position: [-1.5, 4, 1.5],    connections: ['home','sermons'],                       tex: 'gas',     descZh: '每週教會週報與最新活動公告',               descEn: 'Weekly bulletin & announcements' },
  { id: 'daily-scripture',labelZh: '每日靈糧',   labelEn: 'Daily Word', path: '/daily-scripture', group: 'media',     size: 0.5,  color: '#1a0d38', glowColor: '#8060c8', position: [3.5, 4.5, -1.5],  connections: ['sermons'],                              tex: 'gas',     descZh: '每日靈修默想與聖經閱讀進度',               descEn: 'Daily devotional & Bible reading plan' },
  { id: 'gallery',        labelZh: '相片集',     labelEn: 'Gallery',    path: '/gallery',         group: 'community', size: 0.5,  color: '#091830', glowColor: '#3070c0', position: [5.5, -1, -2],     connections: ['events'],                               tex: 'barren',  descZh: '教會生活、主日崇拜與活動精彩回顧',          descEn: 'Photo gallery of church life & events' },
  { id: 'prayer-wall',    labelZh: '禱告牆',     labelEn: 'Prayer Wall',path: '/prayer-wall',     group: 'community', size: 0.55, color: '#0a1b38', glowColor: '#3a7fd4', position: [3, -4.5, -1],     connections: ['events','contact'],                     tex: 'earth',   descZh: '提交代禱事項，與弟兄姊妹彼此守望',         descEn: 'Submit prayer requests, pray together' },
  { id: 'contact',        labelZh: '聯絡我們',   labelEn: 'Contact',    path: '/contact',         group: 'connect',   size: 0.5,  color: '#280b16', glowColor: '#b04060', position: [-5.5, -1.5, 0.5], connections: ['about','faq'],                           tex: 'barren',  descZh: '教會地址、電話、地圖與問路指引',            descEn: 'Address, phone, map & directions' },
  { id: 'faq',            labelZh: '常見問題',   labelEn: 'FAQ',        path: '/faq',             group: 'connect',   size: 0.45, color: '#280b16', glowColor: '#b04060', position: [-4.5, -3.5, -1.5],connections: ['contact','first-visit'],                 tex: 'barren',  descZh: '關於信仰、洗禮與教會的常見問答',            descEn: 'FAQ about faith, baptism & church life' },
];

// ─── Procedural planet surface texture ────────────────────────────────────────

function makePlanetTexture(node: SiteNode): THREE.CanvasTexture {
  const W = 512, H = 256;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d')!;
  const col = new THREE.Color(node.color);
  const br = Math.round(col.r * 255);
  const bg = Math.round(col.g * 255);
  const bb = Math.round(col.b * 255);
  ctx.fillStyle = `rgb(${br},${bg},${bb})`;
  ctx.fillRect(0, 0, W, H);

  // Derived land / highlight tones (brighter variant of base color = rough land / rock)
  const lr = Math.min(255, Math.round(br * 2.0 + 25));
  const lg = Math.min(255, Math.round(bg * 2.0 + 18));
  const lb = Math.min(255, Math.round(bb * 2.0 + 12));

  if (node.tex === 'gas') {
    // 28 atmospheric bands with multi-harmonic turbulence edges
    for (let i = 0; i < 28; i++) {
      const fy = i / 28;
      const y  = fy * H;
      const bh = H / 28 + (rnd() * 8 - 4);
      const a  = 0.06 + rnd() * 0.22;
      const ph = rnd() * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, y + Math.sin(ph) * 5 + Math.sin(ph * 2.3) * 2.5);
      ctx.bezierCurveTo(
        W * 0.3,  y + Math.sin(ph + 1.0) * 7 + rnd() * 6 - 3,
        W * 0.65, y + Math.sin(ph + 2.1) * 7 + rnd() * 6 - 3,
        W,        y + Math.sin(ph + 3.1) * 5 + Math.sin((ph + 3.1) * 2.3) * 2.5
      );
      ctx.lineTo(W, y + bh);
      ctx.bezierCurveTo(
        W * 0.65, y + bh + Math.sin(ph + 2.6) * 6 - 3,
        W * 0.3,  y + bh + Math.sin(ph + 1.5) * 6 - 3,
        0,        y + bh
      );
      ctx.closePath();
      const type = i % 4;
      ctx.fillStyle = type === 0
        ? `rgba(230,205,255,${a})`
        : type === 1
        ? `rgba(255,228,160,${a * 0.65})`
        : type === 2
        ? `rgba(${lr},${lg},${lb},${a * 0.45})`
        : `rgba(0,0,0,${a * 0.55})`;
      ctx.fill();
    }
    // Great storm oval — layered rings (bright interior = rough; dark ring = smooth/ocean-like glint)
    const sx = W * (0.25 + rnd() * 0.5), sy = H * (0.4 + rnd() * 0.2);
    for (let pass = 4; pass >= 0; pass--) {
      ctx.beginPath();
      ctx.ellipse(sx, sy, 36 - pass * 5, 22 - pass * 3, -0.18, 0, Math.PI * 2);
      const alpha = 0.08 + pass * 0.07;
      ctx.fillStyle = pass % 2 === 0
        ? `rgba(255,${170 - pass * 15},80,${alpha})`
        : `rgba(0,0,0,${alpha * 0.6})`;
      ctx.fill();
    }
    // Vortex wisps around storm
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      const ex = sx + Math.cos(ang) * (40 + rnd() * 20);
      const ey = sy + Math.sin(ang) * (26 + rnd() * 12);
      ctx.beginPath();
      ctx.ellipse(ex, ey, 8 + rnd() * 20, 2 + rnd() * 5, ang + 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,235,180,${0.05 + rnd() * 0.09})`; ctx.fill();
    }

  } else if (node.tex === 'volcanic') {
    // Rock face variation — darker crevices
    for (let i = 0; i < 80; i++) {
      ctx.beginPath();
      ctx.ellipse(rnd() * W, rnd() * H, rnd() * 30 + 5, rnd() * 18 + 3, rnd() * Math.PI, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${0.07 + rnd() * 0.22})`; ctx.fill();
    }
    // Lighter rock faces / plateaus
    for (let i = 0; i < 30; i++) {
      const cx2 = rnd() * W, cy2 = rnd() * H;
      const rg = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, 15 + rnd() * 30);
      rg.addColorStop(0, `rgba(${lr},${lg},${lb},0.18)`);
      rg.addColorStop(1, `rgba(${lr},${lg},${lb},0)`);
      ctx.beginPath(); ctx.ellipse(cx2, cy2, 20 + rnd() * 35, 12 + rnd() * 20, rnd() * Math.PI, 0, Math.PI * 2);
      ctx.fillStyle = rg; ctx.fill();
    }
    // Lava rivers — wider range, brighter peaks
    for (let i = 0; i < 28; i++) {
      const x0 = rnd() * W, y0 = rnd() * H;
      ctx.beginPath(); ctx.moveTo(x0, y0);
      let cx2 = x0, cy2 = y0;
      const segs = 5 + Math.floor(rnd() * 4);
      for (let s = 0; s < segs; s++) { cx2 += rnd() * 40 - 20; cy2 += rnd() * 20 - 10; ctx.lineTo(cx2, cy2); }
      const lavaG = 90 + Math.round(rnd() * 110);
      ctx.strokeStyle = `rgba(255,${lavaG},20,${0.15 + rnd() * 0.18})`;
      ctx.lineWidth = 0.5 + rnd() * 2.5; ctx.stroke();
    }
    // Lava pools — radial hot spots
    for (let i = 0; i < 8; i++) {
      const px = rnd() * W, py = rnd() * H;
      const pr = 6 + rnd() * 18;
      const pg = ctx.createRadialGradient(px, py, 0, px, py, pr);
      pg.addColorStop(0,   `rgba(255,220,60,0.28)`);
      pg.addColorStop(0.4, `rgba(255,110,20,0.18)`);
      pg.addColorStop(1,   `rgba(200,40,0,0)`);
      ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fillStyle = pg; ctx.fill();
    }

  } else if (node.tex === 'earth') {
    // Continents — planet-color-derived land masses (bright = rough land, dark = smooth ocean)
    for (let i = 0; i < 11; i++) {
      const cx2 = rnd() * W, cy2 = H * 0.08 + rnd() * H * 0.84;
      const rx2 = 28 + rnd() * 70, ry2 = 18 + rnd() * 44;
      const cg = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, Math.max(rx2, ry2));
      cg.addColorStop(0,   `rgba(${lr},${lg},${lb},0.50)`);
      cg.addColorStop(0.4, `rgba(${lr},${lg},${lb},0.28)`);
      cg.addColorStop(0.8, `rgba(${lr},${lg},${lb},0.10)`);
      cg.addColorStop(1,   `rgba(${lr},${lg},${lb},0)`);
      ctx.beginPath(); ctx.ellipse(cx2, cy2, rx2, ry2, rnd() * Math.PI, 0, Math.PI * 2);
      ctx.fillStyle = cg; ctx.fill();
    }
    // Coastal shallows — darker ocean band at continent edges (adds specular-dark transition)
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.ellipse(rnd() * W, H * 0.1 + rnd() * H * 0.8, 20 + rnd() * 50, 6 + rnd() * 20, rnd() * Math.PI, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${0.04 + rnd() * 0.08})`; ctx.fill();
    }
    // Ice caps — smooth gradient fade (dark base shows through = specular glint at poles)
    const ice1 = ctx.createLinearGradient(0, 0, 0, H * 0.20);
    ice1.addColorStop(0,   'rgba(240,250,255,0.60)');
    ice1.addColorStop(0.5, 'rgba(220,238,255,0.25)');
    ice1.addColorStop(1,   'rgba(200,225,255,0)');
    ctx.fillStyle = ice1; ctx.fillRect(0, 0, W, H * 0.20);
    const ice2 = ctx.createLinearGradient(0, H * 0.80, 0, H);
    ice2.addColorStop(0,   'rgba(200,225,255,0)');
    ice2.addColorStop(0.5, 'rgba(220,238,255,0.22)');
    ice2.addColorStop(1,   'rgba(240,250,255,0.55)');
    ctx.fillStyle = ice2; ctx.fillRect(0, H * 0.80, W, H * 0.20);
    // Cloud wisps — more visible
    for (let i = 0; i < 22; i++) {
      ctx.beginPath();
      ctx.ellipse(rnd() * W, H * 0.08 + rnd() * H * 0.84, 22 + rnd() * 70, 2.5 + rnd() * 9, rnd() * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.06 + rnd() * 0.12})`; ctx.fill();
    }

  } else { // barren
    // Terrain highland/lowland variation
    for (let i = 0; i < 20; i++) {
      const hx = rnd() * W, hy = rnd() * H;
      const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 30 + rnd() * 60);
      hg.addColorStop(0, `rgba(${lr},${lg},${lb},0.14)`);
      hg.addColorStop(1, `rgba(${lr},${lg},${lb},0)`);
      ctx.beginPath(); ctx.ellipse(hx, hy, 40 + rnd() * 70, 25 + rnd() * 45, rnd() * Math.PI, 0, Math.PI * 2);
      ctx.fillStyle = hg; ctx.fill();
    }
    // Impact craters — bright ejecta rim (rough) + dark smooth floor (specular)
    for (let i = 0; i < 50; i++) {
      const x = rnd() * W, y = rnd() * H, r = 3 + rnd() * 22;
      // Ejecta halo
      ctx.beginPath(); ctx.arc(x, y, r + 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${lr},${lg},${lb},${0.08 + rnd() * 0.12})`; ctx.fill();
      // Crater floor (dark = smooth = specular glint — like a dry lake bed)
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${0.12 + rnd() * 0.22})`; ctx.fill();
    }
    // Ejecta rays — 3–4 large craters with radial streak patterns
    for (let i = 0; i < 4; i++) {
      const ex = rnd() * W, ey = rnd() * H;
      const rays = 8 + Math.floor(rnd() * 8);
      for (let r2 = 0; r2 < rays; r2++) {
        const ang = (r2 / rays) * Math.PI * 2;
        const len = 25 + rnd() * 50;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex + Math.cos(ang) * len, ey + Math.sin(ang) * len);
        ctx.strokeStyle = `rgba(${lr},${lg},${lb},${0.07 + rnd() * 0.10})`;
        ctx.lineWidth = 0.5 + rnd() * 1.5; ctx.stroke();
      }
    }
    // Fine noise grain
    for (let i = 0; i < 180; i++) {
      ctx.beginPath(); ctx.arc(rnd() * W, rnd() * H, rnd() * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${0.03 + rnd() * 0.06})`; ctx.fill();
    }
  }

  return new THREE.CanvasTexture(cv);
}

function rnd() { return Math.random(); }

// ─── Star glow sprite ──────────────────────────────────────────────────────────

function makeStarSprite(): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = 64; cv.height = 64;
  const ctx = cv.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0,    'rgba(255,248,228,1)');
  g.addColorStop(0.08, 'rgba(255,248,228,0.9)');
  g.addColorStop(0.3,  'rgba(255,240,210,0.4)');
  g.addColorStop(0.65, 'rgba(255,235,200,0.1)');
  g.addColorStop(1,    'rgba(255,235,200,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(cv);
}

// ─── Fresnel atmosphere shaders ────────────────────────────────────────────────

const ATM_VERT = /* glsl */`
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  vNormal   = normalize(normalMatrix * normal);
  vec4 mv   = modelViewMatrix * vec4(position, 1.0);
  vViewDir  = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const ATM_FRAG = /* glsl */`
uniform vec3  uColor;
uniform float uPower;
uniform float uIntensity;
varying vec3  vNormal;
varying vec3  vViewDir;
void main() {
  float f = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), uPower);
  gl_FragColor = vec4(uColor, clamp(f * uIntensity, 0.0, 1.0));
}`;

// ─── Planet surface shader — inner radiance (stained-glass holy light) ────────

const PLANET_VERT = /* glsl */`
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUv;

void main() {
  vUv         = uv;
  vec4 mv     = modelViewMatrix * vec4(position, 1.0);
  vNormal     = normalize(normalMatrix * normal);
  vViewDir    = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const PLANET_FRAG = /* glsl */`
uniform sampler2D uMap;
uniform vec3  uBaseColor;
uniform vec3  uGlowColor;
uniform float uEmissive;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUv;

void main() {
  vec4  tex      = texture2D(uMap, vUv);
  vec3  lightDir = normalize(vec3(0.5, 0.75, 0.9));

  // Lambertian diffuse
  float diff    = max(dot(vNormal, lightDir), 0.0) * 0.45 + 0.55;
  vec3  surface = tex.rgb * uBaseColor * diff * 2.5;

  // Roughness from texture brightness — dark px (ocean) = smooth, bright (land) = rough
  float brightness = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
  float roughness  = clamp(brightness * 2.0, 0.0, 1.0);

  // Blinn-Phong specular — concentrated on smooth (low roughness) areas: water / ice
  vec3  halfVec  = normalize(lightDir + vViewDir);
  float spec     = pow(max(dot(vNormal, halfVec), 0.0), 72.0);
  vec3  specular = vec3(0.60, 0.78, 1.0) * spec * (1.0 - roughness) * 0.50;

  // Limb darkening — physical planetary effect (edges darker)
  float face    = max(dot(vNormal, vViewDir), 0.0);
  float limb    = pow(face, 0.38) * 0.20 + 0.80;

  // Inner radiance glow
  float innerGlow = pow(face, 2.0) * 0.55;

  vec3 col = (surface + specular) * limb + uGlowColor * (uEmissive + innerGlow * 0.38);
  gl_FragColor = vec4(col, 1.0);
}`;

// ─── Legend ───────────────────────────────────────────────────────────────────

const GROUP_META: Record<string, { color: string; labelZh: string; labelEn: string }> = {
  core:      { color: '#d4921c', labelZh: '核心頁面', labelEn: 'Core' },
  media:     { color: '#8060c8', labelZh: '媒體資源', labelEn: 'Media' },
  community: { color: '#3a7fd4', labelZh: '社群活動', labelEn: 'Community' },
  connect:   { color: '#c04870', labelZh: '聯絡資訊', labelEn: 'Connect' },
};

function sceneHint(locale: string, embedded: boolean) {
  if (locale === 'zh-TW') return embedded ? '拖曳旋轉 · 點選後開啟' : '拖曳旋轉 · 滾輪縮放 · 點選後開啟';
  if (locale === 'ja') return embedded ? 'ドラッグで回転 · 選んで開く' : 'ドラッグで回転 · スクロールで拡縮 · 選んで開く';
  if (locale === 'my') return embedded ? 'ဆွဲ၍လှည့်ပါ · ရွေးပြီးမှ ဖွင့်ပါ' : 'ဆွဲ၍လှည့်ပါ · ချဲ့ကြည့်ပါ · ရွေးပြီးမှ ဖွင့်ပါ';
  return embedded ? 'Drag · Select, then open' : 'Drag · Scroll · Select, then open';
}

function Legend({ locale, embedded }: { locale: string; embedded: boolean }) {
  return (
    <div className="absolute bottom-6 left-6 flex flex-col gap-2 pointer-events-none z-10">
      {Object.entries(GROUP_META).map(([key, meta]) => (
        <div key={key} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: meta.color, boxShadow: `0 0 7px ${meta.color}` }} />
          <span className="text-xs font-medium" style={{ color: '#a89060' }}>{locale === 'zh-TW' ? meta.labelZh : meta.labelEn}</span>
        </div>
      ))}
      <p className="mt-2 text-[10px] leading-tight" style={{ color: '#6a5030' }}>
        {sceneHint(locale, embedded)}
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function planetLabel(
  id: string,
  nav: ReturnType<typeof useTranslations<'nav'>>,
  welcome: ReturnType<typeof useTranslations<'welcome'>>,
) {
  switch (id) {
    case 'home': return nav('home');
    case 'about': return nav('about');
    case 'first-visit': return welcome('badge');
    case 'services': return nav('services');
    case 'events': return nav('events');
    case 'sermons': return nav('sermons');
    case 'bulletin': return nav('weekly_bulletin');
    case 'daily-scripture': return nav('daily_scripture');
    case 'gallery': return nav('gallery');
    case 'prayer-wall': return nav('prayer_wall');
    case 'contact': return nav('contact');
    case 'faq': return nav('faq');
    default: return nav('sitemap');
  }
}

export default function SiteMap3D({ locale, embedded = false }: { locale: string; embedded?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nav = useTranslations('nav');
  const welcome = useTranslations('welcome');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const labels = useMemo(() => {
    const map: Record<string, string> = {};
    for (const node of NODES) map[node.id] = planetLabel(node.id, nav, welcome);
    return map;
  }, [nav, welcome]);
  const selected = NODES.find(node => node.id === selectedId);

  useEffect(() => {
    const container = containerRef.current as HTMLDivElement;
    if (!container) return;

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    const viewW = Math.max(container.clientWidth, 1);
    const viewH = Math.max(container.clientHeight, 1);
    renderer.setSize(viewW, viewH);
    renderer.setClearColor(0x0a0608);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, viewW / viewH, 0.1, 100);
    camera.position.set(0, 2, 18);

    // ── Bloom post-processing ─────────────────────────────────────────────
    const composer   = new EffectComposer(renderer);
    const bloomPass  = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.95,  // strength  — refined, not overwrought
      0.70,  // radius    — soft diffuse bloom
      0.28,  // threshold — picks up jewel-toned glows
    );
    const outputPass = new OutputPass();
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(bloomPass);
    composer.addPass(outputPass);

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x0a0820, 0.55));

    const sun = new THREE.PointLight(0xfff4e0, 2.8, 26);
    sun.position.set(0, 0, 0);
    scene.add(sun);

    // Warm amber fill — from upper-left (like candlelight through glass)
    const amberLight = new THREE.PointLight(0xd4921c, 1.1, 28);
    amberLight.position.set(-8, 6, 4);
    scene.add(amberLight);

    // Cool violet fill — from lower-right (deep shadow counterpoint)
    const violetLight = new THREE.PointLight(0x6040c0, 0.65, 28);
    violetLight.position.set(8, -4, -3);
    scene.add(violetLight);

    // Soft purple moving fill
    const fillLight = new THREE.PointLight(0x8060a0, 0.4, 32);
    scene.add(fillLight);

    // ── Nebula particle volumes ───────────────────────────────────────────
    // Deep cosmic hues — no primary colours, all jewel-toned shadows
    const nebulaDefs: Array<{ pos:[number,number,number]; r:number; color:number; n:number }> = [
      { pos:[-9,  4, -9], r:7.0, color:0x200830, n:450 },  // deep violet
      { pos:[10, -3, -7], r:5.5, color:0x102040, n:320 },  // deep cobalt
      { pos:[ 1,  9,-11], r:8.0, color:0x302010, n:380 },  // dusty amber
      { pos:[-6, -8,  5], r:5.0, color:0x180820, n:260 },  // dark indigo
      { pos:[ 6,  6,  7], r:5.5, color:0x280818, n:310 },  // deep crimson
    ];
    for (const d of nebulaDefs) {
      const pos = new Float32Array(d.n * 3);
      for (let i = 0; i < d.n; i++) {
        const th = rnd() * Math.PI * 2, ph = Math.acos(2 * rnd() - 1);
        const r  = d.r * Math.cbrt(rnd());
        pos[i*3]  = d.pos[0] + r * Math.sin(ph) * Math.cos(th);
        pos[i*3+1]= d.pos[1] + r * Math.sin(ph) * Math.sin(th);
        pos[i*3+2]= d.pos[2] + r * Math.cos(ph);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
        color: d.color, size: 0.11, transparent: true, opacity: 0.16,
        sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending,
      })));
    }

    // ── Starfield (sprite glow texture) ───────────────────────────────────
    const starSprite = makeStarSprite();
    const makeStars = (n: number, spread: number, size: number, opacity: number) => {
      const pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        pos[i*3]  = (rnd()-.5)*spread;
        pos[i*3+1]= (rnd()-.5)*spread;
        pos[i*3+2]= (rnd()-.5)*spread;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      return new THREE.Points(geo, new THREE.PointsMaterial({
        size, map: starSprite, alphaMap: starSprite,
        transparent: true, opacity,
        sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending,
      }));
    };
    const stars        = makeStars(1600, 85, 0.12, 0.60);
    const brightStars  = makeStars(80,   75, 0.32, 0.90);
    scene.add(stars, brightStars);

    // ── Planet nodes ──────────────────────────────────────────────────────
    type PlanetEntry = { mesh: THREE.Mesh; atmMesh: THREE.Mesh; node: SiteNode; phase: number; freq: number };
    const meshes: PlanetEntry[] = [];

    for (const node of NODES) {
      const baseCol  = new THREE.Color(node.color);
      const glowCol  = new THREE.Color(node.glowColor);

      // Surface — inner radiance ShaderMaterial (stained-glass jewel)
      const mat = new THREE.ShaderMaterial({
        vertexShader:   PLANET_VERT,
        fragmentShader: PLANET_FRAG,
        uniforms: {
          uMap:       { value: makePlanetTexture(node) },
          uBaseColor: { value: baseCol.clone() },
          uGlowColor: { value: glowCol.clone() },
          uEmissive:  { value: 0.14 },
          uTime:      { value: 0.0 },
        },
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(node.size, 56, 56), mat);
      mesh.position.set(...node.position);
      mesh.userData = { node };
      scene.add(mesh);

      // Fresnel atmosphere halo — tighter, more refined
      const atmMat = new THREE.ShaderMaterial({
        vertexShader:   ATM_VERT,
        fragmentShader: ATM_FRAG,
        uniforms: {
          uColor:     { value: glowCol.clone() },
          uPower:     { value: 2.8 },
          uIntensity: { value: 0.60 },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
      });
      const atmMesh = new THREE.Mesh(new THREE.SphereGeometry(node.size * 1.44, 32, 32), atmMat);
      atmMesh.position.set(...node.position);
      scene.add(atmMesh);

      meshes.push({ mesh, atmMesh, node, phase: rnd() * Math.PI * 2, freq: 0.35 + rnd() * 0.45 });

      // Home planet — refined gold rings
      if (node.id === 'home') {
        const r1 = new THREE.Mesh(
          new THREE.TorusGeometry(1.44, 0.03, 8, 80),
          new THREE.MeshBasicMaterial({ color: 0xd4a030, transparent: true, opacity: 0.65 }),
        );
        r1.rotation.x = Math.PI / 2.4;
        r1.position.set(...node.position);
        scene.add(r1);

        const r2 = new THREE.Mesh(
          new THREE.TorusGeometry(2.1, 0.018, 8, 80),
          new THREE.MeshBasicMaterial({ color: 0xb88010, transparent: true, opacity: 0.28 }),
        );
        r2.rotation.x = Math.PI / 2.2;
        r2.rotation.z = 0.18;
        r2.position.set(...node.position);
        scene.add(r2);
      }
    }

    // ── Fine gold connections + traveling particles ────────────────────────
    type ConnEntry = { tube: THREE.Mesh; fromId: string; toId: string; curve: THREE.CatmullRomCurve3 };
    const connObjs: ConnEntry[] = [];
    const seen = new Set<string>();

    for (const n of NODES) {
      for (const cid of n.connections) {
        const key = [n.id, cid].sort().join('--');
        if (seen.has(key)) continue;
        seen.add(key);
        const tgt = NODES.find(x => x.id === cid);
        if (!tgt) continue;

        const a   = new THREE.Vector3(...n.position);
        const b   = new THREE.Vector3(...tgt.position);
        const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3((rnd()-.5)*1.2, 0.3 + rnd()*0.7, (rnd()-.5)*1.2));
        const curve = new THREE.CatmullRomCurve3([a, mid, b]);

        // Thin gold filament — like cathedral lead came lit from within
        const tubeGeo = new THREE.TubeGeometry(curve, 10, 0.008, 4, false);
        const tubeMat = new THREE.MeshBasicMaterial({ color: 0x2a1808, transparent: true, opacity: 0.20 });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        scene.add(tube);
        connObjs.push({ tube, fromId: n.id, toId: cid, curve });
      }
    }

    // Traveling light motes along connections
    const pCount  = connObjs.length;
    const pBuf    = new Float32Array(pCount * 3);
    const pGeo    = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pBuf, 3));
    const pMat    = new THREE.PointsMaterial({
      size: 0.20, map: starSprite, alphaMap: starSprite,
      transparent: true, opacity: 0.80,
      sizeAttenuation: true, depthWrite: false,
      blending: THREE.AdditiveBlending, color: 0xf0c060,
    });
    const particles     = new THREE.Points(pGeo, pMat);
    scene.add(particles);
    const pProgress     = connObjs.map(() => rnd());
    const pTmp          = new THREE.Vector3();

    // ── Comet ─────────────────────────────────────────────────────────────
    const TRAIL = 40;
    const cBuf  = new Float32Array(TRAIL * 3);
    const cGeo  = new THREE.BufferGeometry();
    cGeo.setAttribute('position', new THREE.BufferAttribute(cBuf, 3));
    const cMat  = new THREE.PointsMaterial({
      size: 0.18, map: starSprite, alphaMap: starSprite,
      transparent: true, opacity: 0,
      sizeAttenuation: true, depthWrite: false,
      blending: THREE.AdditiveBlending, color: 0xfff8e8,
    });
    scene.add(new THREE.Points(cGeo, cMat));

    let cometT    = 0, cometDelay = 5 + rnd() * 8;
    const cStart  = new THREE.Vector3(), cEnd = new THREE.Vector3();

    function launchComet() {
      const ang = rnd() * Math.PI * 2;
      const opp = ang + Math.PI + (rnd() - 0.5) * 0.6;
      const D   = 22;
      cStart.set(Math.cos(ang)*D, (rnd()-.5)*12, Math.sin(ang)*D);
      cEnd.set(Math.cos(opp)*D,   (rnd()-.5)*12, Math.sin(opp)*D);
      cometT = 0;
      cMat.opacity = 0.85;
    }

    // ── 2D labels ─────────────────────────────────────────────────────────
    const labelContainer = document.createElement('div');
    labelContainer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
    container.appendChild(labelContainer);

    const labelEls: { el: HTMLDivElement; node: SiteNode }[] = [];
    for (const node of NODES) {
      const el = document.createElement('div');
      el.textContent = labels[node.id] ?? '';
      el.style.cssText = `
        position:absolute; transform:translate(-50%,-100%);
        color:#c8a848; font-size:12px; font-family:inherit;
        white-space:nowrap; pointer-events:none;
        text-shadow:0 0 10px rgba(0,0,0,0.9),0 0 5px rgba(0,0,0,0.9),0 0 16px rgba(212,160,48,0.3);
        transition:color .15s, text-shadow .2s, transform .15s;
        letter-spacing:.03em;
      `;
      labelContainer.appendChild(el);
      labelEls.push({ el, node });
    }

    // ── OrbitControls ─────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping   = true;
    controls.dampingFactor   = 0.055;
    controls.enableZoom      = !embedded;
    controls.enablePan       = !embedded;
    controls.minDistance     = 5;
    controls.maxDistance     = 28;
    controls.autoRotate      = true;
    controls.autoRotateSpeed = 0.3;
    if (embedded) renderer.domElement.style.touchAction = 'pan-y';

    // ── Camera focus state ────────────────────────────────────────────────
    // Mutable closure vars — no React re-render needed for camera animation
    let currentSelectedId: string | null = null;
    const camHome = { pos: new THREE.Vector3(0, 2, 18), target: new THREE.Vector3(0, 0.5, 0) };
    const camFocus = {
      active: false,
      tgtTarget: new THREE.Vector3(),
      tgtPos:    new THREE.Vector3(),
    };

    function focusPlanet(node: SiteNode) {
      const planetPos = new THREE.Vector3(...node.position);
      // Keep current viewing angle, zoom to fixed distance from planet
      const toCam = camera.position.clone().sub(planetPos).normalize();
      const dist  = node.size * 3.5 + 4.5;
      camFocus.tgtTarget.copy(planetPos);
      camFocus.tgtPos.copy(planetPos).addScaledVector(toCam, dist);
      camFocus.active = true;
    }

    function focusHome() {
      camFocus.tgtTarget.copy(camHome.target);
      camFocus.tgtPos.copy(camHome.pos);
      camFocus.active = true;
    }

    function handleSelect(newId: string | null) {
      currentSelectedId = newId;
      setSelectedId(newId);
      if (newId) {
        const node = NODES.find(n => n.id === newId);
        if (node) focusPlanet(node);
      } else {
        focusHome();
      }
    }

    // ── Raycaster / pointer ───────────────────────────────────────────────
    const raycaster    = new THREE.Raycaster();
    const pointer      = new THREE.Vector2();
    let hoveredId: string | null = null;
    const planetMeshes = meshes.map(m => m.mesh);

    let downX = 0, downY = 0, tracking = false;
    function aim(e: PointerEvent) {
      const b = container.getBoundingClientRect();
      pointer.x  =  ((e.clientX - b.left) / b.width)  * 2 - 1;
      pointer.y  = -((e.clientY - b.top)  / b.height) * 2 + 1;
    }
    function onMove(e: PointerEvent) { aim(e); }
    function onPointerDown(e: PointerEvent) {
      if (!e.isPrimary) return;
      tracking = true;
      downX = e.clientX;
      downY = e.clientY;
    }
    function onPointerUp(e: PointerEvent) {
      if (!tracking || !e.isPrimary) return;
      tracking = false;
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
      aim(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(planetMeshes);
      handleSelect(hits.length ? (hits[0].object.userData.node as SiteNode).id : null);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleSelect(null);
    }
    renderer.domElement.addEventListener('pointermove', onMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    window.addEventListener('keydown', onKeyDown);

    // ── Resize ────────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w = Math.max(container.clientWidth, 1), h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    });
    ro.observe(container);

    // ── Animate ───────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId = 0, prevT = 0, active = false, onScreen = false, disposed = false;
    const tmpV = new THREE.Vector3();

    function animate() {
      rafId = 0;
      if (!active) return;
      const t     = clock.getElapsedTime();
      const delta = Math.min(t - prevT, 0.1);
      prevT = t;

      // Camera focus animation
      controls.autoRotate = !currentSelectedId;
      if (camFocus.active) {
        const spd = 0.055;
        controls.target.lerp(camFocus.tgtTarget, spd);
        camera.position.lerp(camFocus.tgtPos, spd);
        if (controls.target.distanceTo(camFocus.tgtTarget) < 0.04 &&
            camera.position.distanceTo(camFocus.tgtPos) < 0.04) {
          camFocus.active = false;
        }
      }

      // Orbiting fill light
      fillLight.position.set(Math.cos(t * 0.18) * 17, Math.sin(t * 0.11) * 7, Math.sin(t * 0.18) * 17);

      // Star drift
      stars.rotation.y       = t * 0.009;
      brightStars.rotation.y = t * 0.006;
      brightStars.rotation.x = t * 0.003;

      // Hover detection
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(planetMeshes);
      hoveredId  = hits.length ? (hits[0].object.userData.node as SiteNode).id : null;
      renderer.domElement.style.cursor = hoveredId ? 'pointer' : 'default';

      // Planet animation
      for (const { mesh, atmMesh, node, phase, freq } of meshes) {
        mesh.rotation.y = t * 0.28 + node.position[0] * 0.5;
        mesh.rotation.x = Math.sin(t * 0.14 + node.position[2]) * 0.09;

        const isHov    = hoveredId === node.id;
        const tgtScale = isHov ? 1.3 + Math.sin(t * 3.0) * 0.05 : 1.0;
        mesh.scale.x  += (tgtScale - mesh.scale.x) * 0.07;
        mesh.scale.y   = mesh.scale.x;
        mesh.scale.z   = mesh.scale.x;

        const pmat    = mesh.material as THREE.ShaderMaterial;
        const breathe = 0.09 + Math.sin(t * freq + phase) * 0.045;
        pmat.uniforms.uEmissive.value += ((isHov ? 0.60 : breathe) - pmat.uniforms.uEmissive.value) * 0.07;
        pmat.uniforms.uTime.value = t;

        const aMat = atmMesh.material as THREE.ShaderMaterial;
        const tgtI = isHov ? 1.0 + Math.sin(t * 2.5) * 0.12 : 0.60 + Math.sin(t * freq + phase) * 0.08;
        aMat.uniforms.uIntensity.value += (tgtI - aMat.uniforms.uIntensity.value) * 0.07;
        const tgtAS = isHov ? 1.08 : 1.0;
        atmMesh.scale.x += (tgtAS - atmMesh.scale.x) * 0.07;
        atmMesh.scale.y = atmMesh.scale.z = atmMesh.scale.x;
      }

      // Fine connection highlights
      const goldHl  = new THREE.Color(0xd4a030);
      const goldDim = new THREE.Color(0x2a1808);
      for (const { tube, fromId, toId } of connObjs) {
        const hl = hoveredId === fromId || hoveredId === toId;
        const tm = tube.material as THREE.MeshBasicMaterial;
        tm.color.lerp(hl ? goldHl : goldDim, 0.1);
        tm.opacity += ((hl ? 0.72 : 0.20) - tm.opacity) * 0.1;
      }

      // Traveling light motes
      const posAttr = particles.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pCount; i++) {
        const hl    = hoveredId === connObjs[i].fromId || hoveredId === connObjs[i].toId;
        pProgress[i] = (pProgress[i] + delta * (hl ? 0.50 : 0.18)) % 1;
        connObjs[i].curve.getPoint(pProgress[i], pTmp);
        posAttr.array[i*3]   = pTmp.x;
        posAttr.array[i*3+1] = pTmp.y;
        posAttr.array[i*3+2] = pTmp.z;
      }
      posAttr.needsUpdate = true;

      // Comet
      cometDelay -= delta;
      if (cometDelay <= 0 && cometT === 0) launchComet();
      if (cMat.opacity > 0 && cometT < 1) {
        cometT = Math.min(cometT + delta * 0.65, 1);
        const posC = cGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < TRAIL; i++) {
          const p  = Math.max(0, cometT - (i / TRAIL) * 0.1);
          const cp = cStart.clone().lerp(cEnd, p);
          posC.array[i*3] = cp.x; posC.array[i*3+1] = cp.y; posC.array[i*3+2] = cp.z;
        }
        posC.needsUpdate = true;
        if (cometT >= 1) {
          cMat.opacity = 0;
          cometDelay   = 10 + rnd() * 15;
          cometT       = 0;
        }
      }

      // Label projection
      for (const { el, node } of labelEls) {
        tmpV.set(...node.position);
        tmpV.y += node.size + 0.65;
        tmpV.project(camera);
        el.style.left = `${( tmpV.x * .5 + .5) * container.clientWidth}px`;
        el.style.top  = `${(-tmpV.y * .5 + .5) * container.clientHeight}px`;
        const isHov    = hoveredId === node.id;
        el.style.color = isHov ? '#f0d888' : '#c8a848';
        el.style.textShadow = isHov
          ? '0 0 20px rgba(240,200,80,0.9), 0 0 8px rgba(0,0,0,0.9)'
          : '0 0 10px rgba(0,0,0,0.9), 0 0 5px rgba(0,0,0,0.9), 0 0 16px rgba(212,160,48,0.25)';
        el.style.transform = isHov ? 'translate(-50%,-132%) scale(1.12)' : 'translate(-50%,-100%)';
        el.style.display   = tmpV.z < 1 ? 'block' : 'none';
      }

      controls.update();
      composer.render();
      if (active) rafId = requestAnimationFrame(animate);
    }
    function halt() {
      active = false;
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    function resume() {
      if (disposed || !onScreen || document.hidden || rafId) return;
      active = true;
      prevT = clock.getElapsedTime();
      rafId = requestAnimationFrame(animate);
    }
    function onVisibility() { if (document.hidden) halt(); else resume(); }
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) resume(); else halt();
    });
    io.observe(container);
    document.addEventListener('visibilitychange', onVisibility);

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      disposed = true;
      halt();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('keydown', onKeyDown);
      renderer.domElement.removeEventListener('pointermove', onMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      const textures = new Set<THREE.Texture>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        if (!mesh.material) return;
        for (const mat of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
          materials.add(mat);
          for (const value of Object.values(mat)) {
            if (value instanceof THREE.Texture) textures.add(value);
          }
          if (mat instanceof THREE.ShaderMaterial) {
            for (const u of Object.values(mat.uniforms)) {
              if (u.value instanceof THREE.Texture) textures.add(u.value);
            }
          }
        }
      });
      textures.forEach(t => t.dispose());
      materials.forEach(m => m.dispose());
      bloomPass.dispose();
      outputPass.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      labelContainer.remove();
    };
  }, [embedded, labels, locale]);

  const ctaLabel = locale === 'zh-TW' ? '前往頁面' : locale === 'ja' ? 'ページへ' : locale === 'my' ? 'သွားပါ' : 'Visit Page';

  return (
    <div className="absolute inset-0 bg-[#0d0608]">
      <style>{`
        @keyframes smFadeUp {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to   { opacity: 1; transform: translate(-50%, 0);    }
        }
      `}</style>

      <div ref={containerRef} className="absolute inset-0" />

      {selected && (() => {
        const meta = GROUP_META[selected.group];
        const desc = locale === 'zh-TW' ? selected.descZh : selected.descEn;
        return (
          <div
            key={selected.id}
            className="absolute left-1/2 z-20 w-72 rounded-2xl backdrop-blur-md"
            style={{
              bottom: '12%',
              transform: 'translateX(-50%)',
              animation: 'smFadeUp 0.22s ease-out forwards',
              border: `1px solid ${selected.glowColor}35`,
              background: `radial-gradient(ellipse at top, ${selected.glowColor}14 0%, #09060f 55%)`,
              boxShadow: `0 0 48px ${selected.glowColor}18, inset 0 1px 0 rgba(255,255,255,0.04)`,
            }}
          >
            <div className="px-5 pt-4 pb-5">
              {/* Group badge + close */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: meta.color, boxShadow: `0 0 6px ${meta.color}` }}
                  />
                  <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: meta.color }}>
                    {locale === 'zh-TW' ? meta.labelZh : meta.labelEn}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-6 h-6 flex items-center justify-center rounded-full text-white/35 hover:text-white/75 hover:bg-white/8 transition-colors text-xs leading-none"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Planet name */}
              <h3 className="text-[15px] font-bold mb-1.5 leading-snug" style={{ color: selected.glowColor }}>
                {labels[selected.id]}
              </h3>

              {/* Description */}
              <p className="text-[12px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.52)' }}>
                {desc}
              </p>

              {/* CTA */}
              <a
                href={`/${locale}${selected.path === '/' ? '' : selected.path}`}
                className="flex items-center justify-center gap-2 w-full rounded-full py-2.5 text-[13px] font-semibold transition-opacity hover:opacity-80"
                style={{
                  background: `linear-gradient(135deg, ${selected.glowColor}30 0%, ${selected.glowColor}18 100%)`,
                  border: `1px solid ${selected.glowColor}45`,
                  color: selected.glowColor,
                }}
              >
                {ctaLabel}
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        );
      })()}

      <Legend locale={locale} embedded={embedded} />
    </div>
  );
}
