'use client';

import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useRouter } from 'next/navigation';

// ─── Node data ────────────────────────────────────────────────────────────────

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
}

const NODES: SiteNode[] = [
  { id: 'home',           labelZh: '首頁',     labelEn: 'Home',       path: '/',               group: 'core',      size: 1.0,  color: '#8B2F45', glowColor: '#c94060', position: [0, 0, 0],         connections: ['about','first-visit','services','events','sermons','bulletin'] },
  { id: 'about',          labelZh: '關於我們', labelEn: 'About',      path: '/about',          group: 'core',      size: 0.65, color: '#6B2236', glowColor: '#a03050', position: [-4.5, 1.5, -1],  connections: ['home','first-visit','contact'] },
  { id: 'first-visit',    labelZh: '初次拜訪', labelEn: 'First Visit',path: '/first-visit',    group: 'connect',   size: 0.6,  color: '#1A5C3A', glowColor: '#28a060', position: [-3, -3, 1],      connections: ['home','about','services'] },
  { id: 'services',       labelZh: '聚會時間', labelEn: 'Services',   path: '/services',       group: 'core',      size: 0.65, color: '#8B2F45', glowColor: '#c94060', position: [3.5, -2.5, 0],   connections: ['home','events'] },
  { id: 'events',         labelZh: '活動行事曆',labelEn: 'Events',    path: '/events',         group: 'community', size: 0.7,  color: '#1A5C3A', glowColor: '#28a060', position: [5, 1.5, 1],      connections: ['home','services','prayer-wall'] },
  { id: 'sermons',        labelZh: '講道媒體', labelEn: 'Sermons',    path: '/sermons',        group: 'media',     size: 0.7,  color: '#7A5A20', glowColor: '#c9a040', position: [1.5, 4, -2],     connections: ['home','daily-scripture'] },
  { id: 'bulletin',       labelZh: '教會週報', labelEn: 'Bulletin',   path: '/weekly-bulletin',group: 'media',     size: 0.5,  color: '#7A5A20', glowColor: '#c9a040', position: [-1.5, 4, 1.5],   connections: ['home','sermons'] },
  { id: 'daily-scripture',labelZh: '每日靈糧', labelEn: 'Daily Word', path: '/daily-scripture',group: 'media',     size: 0.5,  color: '#7A5A20', glowColor: '#c9a040', position: [3.5, 4.5, -1.5], connections: ['sermons'] },
  { id: 'gallery',        labelZh: '相片集',   labelEn: 'Gallery',    path: '/gallery',        group: 'community', size: 0.5,  color: '#1A5C3A', glowColor: '#28a060', position: [5.5, -1, -2],    connections: ['events'] },
  { id: 'prayer-wall',    labelZh: '禱告牆',   labelEn: 'Prayer Wall',path: '/prayer-wall',    group: 'community', size: 0.55, color: '#1A5C3A', glowColor: '#28a060', position: [3, -4.5, -1],    connections: ['events','contact'] },
  { id: 'contact',        labelZh: '聯絡我們', labelEn: 'Contact',    path: '/contact',        group: 'connect',   size: 0.5,  color: '#6B2236', glowColor: '#a03050', position: [-5.5, -1.5, 0.5],connections: ['about','faq'] },
  { id: 'faq',            labelZh: '常見問題', labelEn: 'FAQ',        path: '/faq',            group: 'connect',   size: 0.45, color: '#6B2236', glowColor: '#a03050', position: [-4.5, -3.5, -1.5],connections: ['contact','first-visit'] },
];

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
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x0a0608);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 2, 18);

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x1a1010, 0.6));

    const sunLight = new THREE.PointLight(0xc9a040, 4, 20);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const wineLight = new THREE.PointLight(0x8B2F45, 1.5, 22);
    wineLight.position.set(-8, 6, 4);
    scene.add(wineLight);

    const forestLight = new THREE.PointLight(0x1A5C3A, 1.2, 22);
    forestLight.position.set(8, -4, -3);
    scene.add(forestLight);

    // Orbiting fill light — casts dynamic highlights on planet surfaces
    const fillLight = new THREE.PointLight(0x9080c0, 0.65, 26);
    scene.add(fillLight);

    // ── Nebula cloud volumes ───────────────────────────────────────────────
    const nebulaDefs: Array<{ pos: [number, number, number]; r: number; color: number }> = [
      { pos: [-9,  4, -9], r: 7.5, color: 0x3d0a15 },
      { pos: [10, -3, -7], r: 6.0, color: 0x0a1f10 },
      { pos: [ 1,  9,-11], r: 8.5, color: 0x1a1500 },
      { pos: [-6, -8,  5], r: 5.5, color: 0x0a0a1f },
      { pos: [ 6,  6,  7], r: 6.0, color: 0x1a0a05 },
    ];
    for (const def of nebulaDefs) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(def.r, 8, 8),
        new THREE.MeshBasicMaterial({ color: def.color, transparent: true, opacity: 0.09, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending }),
      );
      m.position.set(...def.pos);
      scene.add(m);
    }

    // ── Starfield (two populations) ───────────────────────────────────────
    const makeStars = (count: number, spread: number, size: number, opacity: number, color: number) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      return new THREE.Points(geo, new THREE.PointsMaterial({ size, color, transparent: true, opacity, sizeAttenuation: true }));
    };
    const stars       = makeStars(700, 70, 0.065, 0.55, 0xc8b89a);
    const brightStars = makeStars(60,  70, 0.20,  0.90, 0xfff4e8);
    scene.add(stars);
    scene.add(brightStars);

    // ── Planet nodes ──────────────────────────────────────────────────────
    type PlanetEntry = { mesh: THREE.Mesh; innerGlow: THREE.Mesh; node: SiteNode; phase: number; freq: number };
    const meshes: PlanetEntry[] = [];

    for (const node of NODES) {
      const color     = new THREE.Color(node.color);
      const glowColor = new THREE.Color(node.glowColor);

      // Three atmosphere layers — outer → mid → inner (additive blend)
      const layers = [
        { scale: 2.9,  opacity: 0.038 },
        { scale: 2.1,  opacity: 0.082 },
        { scale: 1.48, opacity: 0.22  },
      ];
      let innerGlowMesh!: THREE.Mesh;
      for (let li = 0; li < layers.length; li++) {
        const lm = new THREE.Mesh(
          new THREE.SphereGeometry(node.size * layers[li].scale, 16, 16),
          new THREE.MeshBasicMaterial({ color: glowColor, transparent: true, opacity: layers[li].opacity, depthWrite: false, blending: THREE.AdditiveBlending }),
        );
        lm.position.set(...node.position);
        scene.add(lm);
        if (li === 2) innerGlowMesh = lm;
      }

      // Planet surface — MeshPhysicalMaterial with clearcoat
      const mat = new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.28,
        metalness: 0.55,
        emissive: color,
        emissiveIntensity: 0.1,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(node.size, 40, 40), mat);
      mesh.position.set(...node.position);
      mesh.userData = { node };
      scene.add(mesh);

      meshes.push({ mesh, innerGlow: innerGlowMesh, node, phase: Math.random() * Math.PI * 2, freq: 0.35 + Math.random() * 0.45 });

      // Home planet — double ring system
      if (node.id === 'home') {
        const r1 = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.038, 8, 72), new THREE.MeshBasicMaterial({ color: 0xd4a843, transparent: true, opacity: 0.65 }));
        r1.rotation.x = Math.PI / 2.4;
        r1.position.set(...node.position);
        scene.add(r1);

        const r2 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.022, 8, 72), new THREE.MeshBasicMaterial({ color: 0xb8860b, transparent: true, opacity: 0.28 }));
        r2.rotation.x = Math.PI / 2.2;
        r2.rotation.z = 0.18;
        r2.position.set(...node.position);
        scene.add(r2);
      }
    }

    // ── Connection lines (dashed) + traveling particles ────────────────────
    type LineEntry = { line: THREE.Line; fromId: string; toId: string; fromPos: THREE.Vector3; toPos: THREE.Vector3 };
    const lineObjs: LineEntry[] = [];
    const seen = new Set<string>();

    for (const n of NODES) {
      for (const cid of n.connections) {
        const key = [n.id, cid].sort().join('--');
        if (seen.has(key)) continue;
        seen.add(key);
        const target = NODES.find((x) => x.id === cid);
        if (!target) continue;
        const fromPos = new THREE.Vector3(...n.position);
        const toPos   = new THREE.Vector3(...target.position);
        const geo     = new THREE.BufferGeometry().setFromPoints([fromPos, toPos]);
        const mat     = new THREE.LineDashedMaterial({ color: 0x5a3a1a, transparent: true, opacity: 0.28, dashSize: 0.5, gapSize: 0.38 });
        const line    = new THREE.Line(geo, mat);
        line.computeLineDistances();
        scene.add(line);
        lineObjs.push({ line, fromId: n.id, toId: cid, fromPos, toPos });
      }
    }

    // One glowing particle per connection — travels along the line
    const particleCount = lineObjs.length;
    const particlePos   = new Float32Array(particleCount * 3);
    const particleGeo   = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat   = new THREE.PointsMaterial({ size: 0.22, color: 0xd4a843, transparent: true, opacity: 0.75, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const particles     = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    // Each particle starts at a random progress along its connection
    const particleProgress = lineObjs.map(() => Math.random());

    // ── 2D labels (HTML overlay) ──────────────────────────────────────────
    const labelContainer = document.createElement('div');
    labelContainer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
    container.appendChild(labelContainer);

    const labelEls: { el: HTMLDivElement; node: SiteNode }[] = [];
    for (const node of NODES) {
      const el = document.createElement('div');
      el.textContent = locale === 'zh-TW' ? node.labelZh : node.labelEn;
      el.style.cssText = `
        position:absolute;
        transform:translate(-50%,-100%);
        color:#d4c4a8;
        font-size:12px;
        font-family:inherit;
        white-space:nowrap;
        text-shadow:0 0 8px #000,0 0 4px #000;
        pointer-events:none;
        transition:color 0.15s, text-shadow 0.2s, transform 0.15s;
        letter-spacing:0.025em;
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
    controls.autoRotateSpeed = 0.35;

    // ── Raycaster ─────────────────────────────────────────────────────────
    const raycaster    = new THREE.Raycaster();
    const pointer      = new THREE.Vector2();
    let hoveredId: string | null = null;
    const planetMeshes = meshes.map((m) => m.mesh);

    function onPointerMove(e: PointerEvent) {
      const bcr  = container.getBoundingClientRect();
      pointer.x  =  ((e.clientX - bcr.left) / bcr.width)  * 2 - 1;
      pointer.y  = -((e.clientY - bcr.top)  / bcr.height) * 2 + 1;
    }

    function onClick(e: MouseEvent) {
      const bcr  = container.getBoundingClientRect();
      pointer.x  =  ((e.clientX - bcr.left) / bcr.width)  * 2 - 1;
      pointer.y  = -((e.clientY - bcr.top)  / bcr.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(planetMeshes);
      if (hits.length > 0) handleNavigate((hits[0].object.userData.node as SiteNode).path);
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    // ── Resize ────────────────────────────────────────────────────────────
    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // ── Animation loop ────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId   = 0;
    let prevT   = 0;
    const tmpV  = new THREE.Vector3();
    const scaleV = new THREE.Vector3();

    function animate() {
      rafId = requestAnimationFrame(animate);
      const t     = clock.getElapsedTime();
      const delta = t - prevT;
      prevT = t;

      // Orbiting fill light
      fillLight.position.set(Math.cos(t * 0.18) * 16, Math.sin(t * 0.12) * 7, Math.sin(t * 0.18) * 16);

      // Star drift
      stars.rotation.y       = t * 0.009;
      brightStars.rotation.y = t * 0.006;
      brightStars.rotation.x = t * 0.003;

      // Planet rotation + breathing emissive + hover pulse
      for (const { mesh, innerGlow, node, phase, freq } of meshes) {
        mesh.rotation.y = t * 0.28 + node.position[0];
        mesh.rotation.x = Math.sin(t * 0.14 + node.position[2]) * 0.12;

        const isHov = hoveredId === node.id;
        const tgtScale = isHov ? 1.28 * (1 + Math.sin(t * 3.2) * 0.07) : 1.0;
        scaleV.setScalar(tgtScale);
        mesh.scale.lerp(scaleV, 0.07);

        const pmat    = mesh.material as THREE.MeshPhysicalMaterial;
        const breathe = 0.09 + Math.sin(t * freq + phase) * 0.045;
        pmat.emissiveIntensity += ((isHov ? 0.58 : breathe) - pmat.emissiveIntensity) * 0.07;
        pmat.emissive.set(isHov ? node.glowColor : node.color);

        const igMat       = innerGlow.material as THREE.MeshBasicMaterial;
        const tgtOpacity  = isHov ? 0.5 + Math.sin(t * 3.2) * 0.08 : 0.22 + Math.sin(t * freq + phase) * 0.07;
        igMat.opacity    += (tgtOpacity - igMat.opacity) * 0.07;
      }

      // Hover detection
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(planetMeshes);
      hoveredId  = hits.length > 0 ? (hits[0].object.userData.node as SiteNode).id : null;
      renderer.domElement.style.cursor = hoveredId ? 'pointer' : 'default';

      // Connection lines — highlight on hover
      for (const { line, fromId, toId } of lineObjs) {
        const hl  = hoveredId === fromId || hoveredId === toId;
        const lm  = line.material as THREE.LineDashedMaterial;
        lm.color.set(hl ? 0xc9a040 : 0x5a3a1a);
        lm.opacity += ((hl ? 0.75 : 0.28) - lm.opacity) * 0.1;
      }

      // Traveling particles along connections
      const posAttr = particles.geometry.attributes.position;
      for (let i = 0; i < lineObjs.length; i++) {
        const { fromId, toId, fromPos, toPos } = lineObjs[i];
        const hl    = hoveredId === fromId || hoveredId === toId;
        const speed = hl ? 0.45 : 0.18;
        particleProgress[i] = (particleProgress[i] + delta * speed) % 1;
        const p = particleProgress[i];
        posAttr.array[i * 3]     = fromPos.x + (toPos.x - fromPos.x) * p;
        posAttr.array[i * 3 + 1] = fromPos.y + (toPos.y - fromPos.y) * p;
        posAttr.array[i * 3 + 2] = fromPos.z + (toPos.z - fromPos.z) * p;
      }
      (posAttr as THREE.BufferAttribute).needsUpdate = true;

      // 2D label positions + hover style
      for (const { el, node } of labelEls) {
        tmpV.set(...node.position);
        tmpV.y += node.size + 0.65;
        tmpV.project(camera);
        const x = ( tmpV.x * 0.5 + 0.5) * container.clientWidth;
        const y = (-tmpV.y * 0.5 + 0.5) * container.clientHeight;
        el.style.left = `${x}px`;
        el.style.top  = `${y}px`;
        const isHov         = hoveredId === node.id;
        el.style.color      = isHov ? '#ffffff' : '#d4c4a8';
        el.style.textShadow = isHov ? '0 0 14px rgba(201,160,64,0.9), 0 0 6px #000' : '0 0 8px #000, 0 0 4px #000';
        el.style.transform  = isHov ? 'translate(-50%, -130%) scale(1.1)' : 'translate(-50%, -100%)';
        el.style.display    = tmpV.z < 1 ? 'block' : 'none';
      }

      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      if (container.contains(labelContainer))       container.removeChild(labelContainer);
    };
  }, [locale, handleNavigate]);

  return (
    <div className="absolute inset-0 bg-[#0a0608]">
      <div ref={containerRef} className="absolute inset-0" />
      <Legend locale={locale} />
    </div>
  );
}
