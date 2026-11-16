'use client';
// Pure imperative Three.js — Strict Mode safe (create/dispose on each mount cycle)

import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { useRouter } from 'next/navigation';

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
}

const NODES: SiteNode[] = [
  { id: 'home',           labelZh: '首頁',      labelEn: 'Home',       path: '/',                group: 'core',      size: 1.0,  color: '#8B2F45', glowColor: '#ff4070', position: [0, 0, 0],          connections: ['about','first-visit','services','events','sermons','bulletin'], tex: 'earth' },
  { id: 'about',          labelZh: '關於我們',   labelEn: 'About',      path: '/about',           group: 'core',      size: 0.65, color: '#6B2236', glowColor: '#d04070', position: [-4.5, 1.5, -1],   connections: ['home','first-visit','contact'],          tex: 'volcanic' },
  { id: 'first-visit',    labelZh: '初次拜訪',   labelEn: 'First Visit',path: '/first-visit',     group: 'connect',   size: 0.6,  color: '#1A5C3A', glowColor: '#28c060', position: [-3, -3, 1],       connections: ['home','about','services'],               tex: 'earth' },
  { id: 'services',       labelZh: '聚會時間',   labelEn: 'Services',   path: '/services',        group: 'core',      size: 0.65, color: '#8B2F45', glowColor: '#ff4070', position: [3.5, -2.5, 0],    connections: ['home','events'],                        tex: 'volcanic' },
  { id: 'events',         labelZh: '活動行事曆', labelEn: 'Events',     path: '/events',          group: 'community', size: 0.7,  color: '#1A5C3A', glowColor: '#28c060', position: [5, 1.5, 1],       connections: ['home','services','prayer-wall'],         tex: 'earth' },
  { id: 'sermons',        labelZh: '講道媒體',   labelEn: 'Sermons',    path: '/sermons',         group: 'media',     size: 0.7,  color: '#7A5A20', glowColor: '#d4a843', position: [1.5, 4, -2],      connections: ['home','daily-scripture'],               tex: 'gas' },
  { id: 'bulletin',       labelZh: '教會週報',   labelEn: 'Bulletin',   path: '/weekly-bulletin', group: 'media',     size: 0.5,  color: '#7A5A20', glowColor: '#d4a843', position: [-1.5, 4, 1.5],    connections: ['home','sermons'],                       tex: 'gas' },
  { id: 'daily-scripture',labelZh: '每日靈糧',   labelEn: 'Daily Word', path: '/daily-scripture', group: 'media',     size: 0.5,  color: '#7A5A20', glowColor: '#d4a843', position: [3.5, 4.5, -1.5],  connections: ['sermons'],                              tex: 'gas' },
  { id: 'gallery',        labelZh: '相片集',     labelEn: 'Gallery',    path: '/gallery',         group: 'community', size: 0.5,  color: '#1A5C3A', glowColor: '#28c060', position: [5.5, -1, -2],     connections: ['events'],                               tex: 'barren' },
  { id: 'prayer-wall',    labelZh: '禱告牆',     labelEn: 'Prayer Wall',path: '/prayer-wall',     group: 'community', size: 0.55, color: '#1A5C3A', glowColor: '#28c060', position: [3, -4.5, -1],     connections: ['events','contact'],                     tex: 'earth' },
  { id: 'contact',        labelZh: '聯絡我們',   labelEn: 'Contact',    path: '/contact',         group: 'connect',   size: 0.5,  color: '#6B2236', glowColor: '#d04070', position: [-5.5, -1.5, 0.5], connections: ['about','faq'],                           tex: 'barren' },
  { id: 'faq',            labelZh: '常見問題',   labelEn: 'FAQ',        path: '/faq',             group: 'connect',   size: 0.45, color: '#6B2236', glowColor: '#d04070', position: [-4.5, -3.5, -1.5],connections: ['contact','first-visit'],                 tex: 'barren' },
];

// ─── Procedural planet surface texture ────────────────────────────────────────

function makePlanetTexture(node: SiteNode): THREE.CanvasTexture {
  const W = 512, H = 256;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d')!;
  const col = new THREE.Color(node.color);
  ctx.fillStyle = `rgb(${Math.round(col.r*255)},${Math.round(col.g*255)},${Math.round(col.b*255)})`;
  ctx.fillRect(0, 0, W, H);

  if (node.tex === 'gas') {
    for (let i = 0; i < 20; i++) {
      const y     = (i / 20) * H;
      const bandH = H / 20 + (rnd() * 10 - 5);
      const alpha = 0.07 + rnd() * 0.18;
      ctx.beginPath();
      ctx.moveTo(0, y + Math.sin(i * 0.8) * 4);
      ctx.bezierCurveTo(W * 0.33, y + rnd() * 12 - 6, W * 0.66, y + rnd() * 12 - 6, W, y + Math.sin((i+1) * 0.8) * 4);
      ctx.lineTo(W, y + bandH);
      ctx.bezierCurveTo(W * 0.66, y + bandH + rnd() * 10 - 5, W * 0.33, y + bandH + rnd() * 10 - 5, 0, y + bandH);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? `rgba(255,230,160,${alpha})` : `rgba(0,0,0,${alpha})`;
      ctx.fill();
    }
    // Great spot
    for (let pass = 0; pass < 3; pass++) {
      ctx.beginPath();
      ctx.ellipse(W * 0.3, H * 0.55, 32 - pass * 6, 20 - pass * 4, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,${160 - pass * 20},60,${0.15 + pass * 0.08})`;
      ctx.fill();
    }
  } else if (node.tex === 'volcanic') {
    for (let i = 0; i < 120; i++) {
      ctx.beginPath();
      ctx.ellipse(rnd() * W, rnd() * H, rnd() * 28 + 4, rnd() * 18 + 3, rnd() * Math.PI, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${0.05 + rnd() * 0.22})`;
      ctx.fill();
    }
    for (let i = 0; i < 25; i++) {
      const x0 = rnd() * W, y0 = rnd() * H;
      ctx.beginPath(); ctx.moveTo(x0, y0);
      let cx = x0, cy = y0;
      for (let s = 0; s < 6; s++) { cx += rnd() * 36 - 18; cy += rnd() * 18 - 9; ctx.lineTo(cx, cy); }
      ctx.strokeStyle = `rgba(255,${80 + Math.round(rnd()*80)},20,${0.1 + rnd() * 0.15})`;
      ctx.lineWidth = 0.6 + rnd() * 1.8; ctx.stroke();
    }
  } else if (node.tex === 'earth') {
    for (let i = 0; i < 9; i++) {
      const cx = rnd() * W, cy = rnd() * H;
      const rx = 32 + rnd() * 65, ry = 20 + rnd() * 42;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
      g.addColorStop(0,   'rgba(55,100,38,0.38)');
      g.addColorStop(0.6, 'rgba(45,80,28,0.2)');
      g.addColorStop(1,   'rgba(35,65,18,0)');
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, rnd() * Math.PI, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.fillRect(0, 0, W, 22); ctx.fillRect(0, H - 22, W, 22);
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.ellipse(rnd() * W, rnd() * H, 18 + rnd() * 50, 3 + rnd() * 10, rnd() * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.04 + rnd() * 0.08})`; ctx.fill();
    }
  } else { // barren
    for (let i = 0; i < 60; i++) {
      const x = rnd() * W, y = rnd() * H, r = 3 + rnd() * 22;
      ctx.beginPath(); ctx.arc(x, y, r + 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,215,170,${0.07 + rnd() * 0.1})`; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${0.1 + rnd() * 0.22})`; ctx.fill();
    }
    for (let i = 0; i < 240; i++) {
      ctx.beginPath(); ctx.arc(rnd() * W, rnd() * H, rnd() * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${0.03 + rnd() * 0.07})`; ctx.fill();
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

// ─── Legend ───────────────────────────────────────────────────────────────────

const GROUP_META: Record<string, { color: string; labelZh: string; labelEn: string }> = {
  core:      { color: '#8B2F45', labelZh: '核心頁面', labelEn: 'Core' },
  media:     { color: '#7A5A20', labelZh: '媒體資源', labelEn: 'Media' },
  community: { color: '#1A5C3A', labelZh: '社群活動', labelEn: 'Community' },
  connect:   { color: '#6B2236', labelZh: '聯絡資訊', labelEn: 'Connect' },
};

function Legend({ locale }: { locale: string }) {
  return (
    <div className="absolute bottom-6 left-6 flex flex-col gap-2 pointer-events-none z-10">
      {Object.entries(GROUP_META).map(([key, meta]) => (
        <div key={key} className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }} />
          <span className="text-xs text-white/60 font-medium">{locale === 'zh-TW' ? meta.labelZh : meta.labelEn}</span>
        </div>
      ))}
      <p className="mt-2 text-[10px] text-white/35 leading-tight">
        {locale === 'zh-TW' ? '拖曳旋轉 · 滾輪縮放 · 點擊前往' : 'Drag · Scroll · Click'}
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SiteMap3D({ locale }: { locale: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleNavigate = useCallback(
    (path: string) => router.push(`/${locale}${path === '/' ? '' : path}`),
    [locale, router],
  );

  useEffect(() => {
    const container = containerRef.current as HTMLDivElement;
    if (!container) return;

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x07040a);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 2, 18);

    // ── Bloom post-processing ─────────────────────────────────────────────
    const composer   = new EffectComposer(renderer);
    const bloomPass  = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      1.15,  // strength
      0.52,  // radius
      0.35,  // threshold
    );
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x1a1015, 0.75));

    const sun = new THREE.PointLight(0xfff4e0, 3.5, 24);
    sun.position.set(0, 0, 0);
    scene.add(sun);

    const wineLight = new THREE.PointLight(0x8B2F45, 1.6, 26);
    wineLight.position.set(-8, 6, 4);
    scene.add(wineLight);

    const forestLight = new THREE.PointLight(0x1A5C3A, 1.3, 26);
    forestLight.position.set(8, -4, -3);
    scene.add(forestLight);

    const fillLight = new THREE.PointLight(0x9080d0, 0.65, 30);
    scene.add(fillLight);

    // ── Nebula particle volumes ───────────────────────────────────────────
    const nebulaDefs: Array<{ pos:[number,number,number]; r:number; color:number; n:number }> = [
      { pos:[-9,  4, -9], r:7.0, color:0xcc1030, n:450 },
      { pos:[10, -3, -7], r:5.5, color:0x108040, n:320 },
      { pos:[ 1,  9,-11], r:8.0, color:0xc09010, n:380 },
      { pos:[-6, -8,  5], r:5.0, color:0x2030b0, n:260 },
      { pos:[ 6,  6,  7], r:5.5, color:0x601020, n:310 },
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
        color: d.color, size: 0.11, transparent: true, opacity: 0.22,
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
    const stars        = makeStars(1400, 85, 0.13, 0.65);
    const brightStars  = makeStars(90,   75, 0.35, 0.95);
    scene.add(stars, brightStars);

    // ── Planet nodes ──────────────────────────────────────────────────────
    type PlanetEntry = { mesh: THREE.Mesh; atmMesh: THREE.Mesh; node: SiteNode; phase: number; freq: number };
    const meshes: PlanetEntry[] = [];

    for (const node of NODES) {
      const baseCol  = new THREE.Color(node.color);
      const glowCol  = new THREE.Color(node.glowColor);

      // Surface (MeshPhysicalMaterial + procedural texture)
      const mat = new THREE.MeshPhysicalMaterial({
        map: makePlanetTexture(node),
        color: baseCol,
        roughness: 0.32,
        metalness: 0.42,
        emissive: baseCol,
        emissiveIntensity: 0.38,
        clearcoat: 0.65,
        clearcoatRoughness: 0.22,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(node.size, 56, 56), mat);
      mesh.position.set(...node.position);
      mesh.userData = { node };
      scene.add(mesh);

      // Fresnel atmosphere halo
      const atmMat = new THREE.ShaderMaterial({
        vertexShader:   ATM_VERT,
        fragmentShader: ATM_FRAG,
        uniforms: {
          uColor:     { value: glowCol.clone() },
          uPower:     { value: 2.6 },
          uIntensity: { value: 0.65 },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
      });
      const atmMesh = new THREE.Mesh(new THREE.SphereGeometry(node.size * 1.48, 32, 32), atmMat);
      atmMesh.position.set(...node.position);
      scene.add(atmMesh);

      meshes.push({ mesh, atmMesh, node, phase: rnd() * Math.PI * 2, freq: 0.35 + rnd() * 0.45 });

      // Home planet — double rings
      if (node.id === 'home') {
        const r1 = new THREE.Mesh(
          new THREE.TorusGeometry(1.44, 0.04, 8, 80),
          new THREE.MeshBasicMaterial({ color: 0xd4a843, transparent: true, opacity: 0.72 }),
        );
        r1.rotation.x = Math.PI / 2.4;
        r1.position.set(...node.position);
        scene.add(r1);

        const r2 = new THREE.Mesh(
          new THREE.TorusGeometry(2.15, 0.024, 8, 80),
          new THREE.MeshBasicMaterial({ color: 0xb8860b, transparent: true, opacity: 0.34 }),
        );
        r2.rotation.x = Math.PI / 2.2;
        r2.rotation.z = 0.18;
        r2.position.set(...node.position);
        scene.add(r2);
      }
    }

    // ── 3D tube connections + particles ──────────────────────────────────
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
        const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3((rnd()-.5)*1.5, 0.3 + rnd()*0.8, (rnd()-.5)*1.5));
        const curve = new THREE.CatmullRomCurve3([a, mid, b]);

        const tubeGeo = new THREE.TubeGeometry(curve, 10, 0.022, 4, false);
        const tubeMat = new THREE.MeshBasicMaterial({ color: 0x5a3a1a, transparent: true, opacity: 0.28 });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        scene.add(tube);
        connObjs.push({ tube, fromId: n.id, toId: cid, curve });
      }
    }

    // Traveling particles (one per connection, follows curve)
    const pCount  = connObjs.length;
    const pBuf    = new Float32Array(pCount * 3);
    const pGeo    = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pBuf, 3));
    const pMat    = new THREE.PointsMaterial({
      size: 0.28, map: starSprite, alphaMap: starSprite,
      transparent: true, opacity: 0.88,
      sizeAttenuation: true, depthWrite: false,
      blending: THREE.AdditiveBlending, color: 0xffd090,
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
      size: 0.22, map: starSprite, alphaMap: starSprite,
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
      cMat.opacity = 0.9;
    }

    // ── 2D labels ─────────────────────────────────────────────────────────
    const labelContainer = document.createElement('div');
    labelContainer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
    container.appendChild(labelContainer);

    const labelEls: { el: HTMLDivElement; node: SiteNode }[] = [];
    for (const node of NODES) {
      const el = document.createElement('div');
      el.textContent = locale === 'zh-TW' ? node.labelZh : node.labelEn;
      el.style.cssText = `
        position:absolute; transform:translate(-50%,-100%);
        color:#d4c4a8; font-size:12px; font-family:inherit;
        white-space:nowrap; pointer-events:none;
        text-shadow:0 0 10px #000,0 0 5px #000,0 0 2px #000;
        transition:color .15s, text-shadow .2s, transform .15s;
        letter-spacing:.025em;
      `;
      labelContainer.appendChild(el);
      labelEls.push({ el, node });
    }

    // ── OrbitControls ─────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping   = true;
    controls.dampingFactor   = 0.055;
    controls.minDistance     = 5;
    controls.maxDistance     = 28;
    controls.autoRotate      = true;
    controls.autoRotateSpeed = 0.3;

    // ── Raycaster / pointer ───────────────────────────────────────────────
    const raycaster    = new THREE.Raycaster();
    const pointer      = new THREE.Vector2();
    let hoveredId: string | null = null;
    const planetMeshes = meshes.map(m => m.mesh);

    function onMove(e: PointerEvent) {
      const b = container.getBoundingClientRect();
      pointer.x  =  ((e.clientX - b.left) / b.width)  * 2 - 1;
      pointer.y  = -((e.clientY - b.top)  / b.height) * 2 + 1;
    }
    function onClick(e: MouseEvent) {
      const b = container.getBoundingClientRect();
      pointer.x  =  ((e.clientX - b.left) / b.width)  * 2 - 1;
      pointer.y  = -((e.clientY - b.top)  / b.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(planetMeshes);
      if (hits.length) handleNavigate((hits[0].object.userData.node as SiteNode).path);
    }
    renderer.domElement.addEventListener('pointermove', onMove);
    renderer.domElement.addEventListener('click', onClick);

    // ── Resize ────────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    });
    ro.observe(container);

    // ── Animate ───────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId   = 0, prevT = 0;
    const tmpV  = new THREE.Vector3();

    function animate() {
      rafId = requestAnimationFrame(animate);
      const t     = clock.getElapsedTime();
      const delta = Math.min(t - prevT, 0.1);
      prevT = t;

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

        const pmat    = mesh.material as THREE.MeshPhysicalMaterial;
        const breathe = 0.11 + Math.sin(t * freq + phase) * 0.055;
        pmat.emissiveIntensity += ((isHov ? 0.7 : breathe) - pmat.emissiveIntensity) * 0.07;
        pmat.emissive.set(isHov ? node.glowColor : node.color);

        const aMat = atmMesh.material as THREE.ShaderMaterial;
        const tgtI = isHov ? 1.1 + Math.sin(t * 2.5) * 0.15 : 0.65 + Math.sin(t * freq + phase) * 0.1;
        aMat.uniforms.uIntensity.value += (tgtI - aMat.uniforms.uIntensity.value) * 0.07;
        const tgtAS = isHov ? 1.1 : 1.0;
        atmMesh.scale.x += (tgtAS - atmMesh.scale.x) * 0.07;
        atmMesh.scale.y = atmMesh.scale.z = atmMesh.scale.x;
      }

      // Tube connection highlights
      const goldCol = new THREE.Color(0xc9a040);
      const dimCol  = new THREE.Color(0x5a3a1a);
      for (const { tube, fromId, toId } of connObjs) {
        const hl = hoveredId === fromId || hoveredId === toId;
        const tm = tube.material as THREE.MeshBasicMaterial;
        tm.color.lerp(hl ? goldCol : dimCol, 0.1);
        tm.opacity += ((hl ? 0.78 : 0.28) - tm.opacity) * 0.1;
      }

      // Traveling particles
      const posAttr = particles.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pCount; i++) {
        const hl    = hoveredId === connObjs[i].fromId || hoveredId === connObjs[i].toId;
        pProgress[i] = (pProgress[i] + delta * (hl ? 0.55 : 0.2)) % 1;
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
        el.style.color = isHov ? '#fff' : '#d4c4a8';
        el.style.textShadow = isHov
          ? '0 0 18px rgba(201,160,64,0.95), 0 0 8px #000'
          : '0 0 10px #000, 0 0 5px #000, 0 0 2px #000';
        el.style.transform = isHov ? 'translate(-50%,-132%) scale(1.12)' : 'translate(-50%,-100%)';
        el.style.display   = tmpV.z < 1 ? 'block' : 'none';
      }

      controls.update();
      composer.render();
    }
    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.domElement.removeEventListener('pointermove', onMove);
      renderer.domElement.removeEventListener('click', onClick);
      controls.dispose();
      starSprite.dispose();
      composer.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      if (container.contains(labelContainer))       container.removeChild(labelContainer);
    };
  }, [locale, handleNavigate]);

  return (
    <div className="absolute inset-0 bg-[#07040a]">
      <div ref={containerRef} className="absolute inset-0" />
      <Legend locale={locale} />
    </div>
  );
}
