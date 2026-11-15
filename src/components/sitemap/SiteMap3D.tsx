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
  {
    id: 'home',
    labelZh: '首頁',
    labelEn: 'Home',
    path: '/',
    group: 'core',
    size: 1.0,
    color: '#8B2F45',
    glowColor: '#c94060',
    position: [0, 0, 0],
    connections: ['about', 'first-visit', 'services', 'events', 'sermons', 'bulletin'],
  },
  {
    id: 'about',
    labelZh: '關於我們',
    labelEn: 'About',
    path: '/about',
    group: 'core',
    size: 0.65,
    color: '#6B2236',
    glowColor: '#a03050',
    position: [-4.5, 1.5, -1],
    connections: ['home', 'first-visit', 'contact'],
  },
  {
    id: 'first-visit',
    labelZh: '初次拜訪',
    labelEn: 'First Visit',
    path: '/first-visit',
    group: 'connect',
    size: 0.6,
    color: '#1A5C3A',
    glowColor: '#28a060',
    position: [-3, -3, 1],
    connections: ['home', 'about', 'services'],
  },
  {
    id: 'services',
    labelZh: '聚會時間',
    labelEn: 'Services',
    path: '/services',
    group: 'core',
    size: 0.65,
    color: '#8B2F45',
    glowColor: '#c94060',
    position: [3.5, -2.5, 0],
    connections: ['home', 'events'],
  },
  {
    id: 'events',
    labelZh: '活動行事曆',
    labelEn: 'Events',
    path: '/events',
    group: 'community',
    size: 0.7,
    color: '#1A5C3A',
    glowColor: '#28a060',
    position: [5, 1.5, 1],
    connections: ['home', 'services', 'prayer-wall'],
  },
  {
    id: 'sermons',
    labelZh: '講道媒體',
    labelEn: 'Sermons',
    path: '/sermons',
    group: 'media',
    size: 0.7,
    color: '#7A5A20',
    glowColor: '#c9a040',
    position: [1.5, 4, -2],
    connections: ['home', 'daily-scripture'],
  },
  {
    id: 'bulletin',
    labelZh: '教會週報',
    labelEn: 'Bulletin',
    path: '/weekly-bulletin',
    group: 'media',
    size: 0.5,
    color: '#7A5A20',
    glowColor: '#c9a040',
    position: [-1.5, 4, 1.5],
    connections: ['home', 'sermons'],
  },
  {
    id: 'daily-scripture',
    labelZh: '每日靈糧',
    labelEn: 'Daily Word',
    path: '/daily-scripture',
    group: 'media',
    size: 0.5,
    color: '#7A5A20',
    glowColor: '#c9a040',
    position: [3.5, 4.5, -1.5],
    connections: ['sermons'],
  },
  {
    id: 'gallery',
    labelZh: '相片集',
    labelEn: 'Gallery',
    path: '/gallery',
    group: 'community',
    size: 0.5,
    color: '#1A5C3A',
    glowColor: '#28a060',
    position: [5.5, -1, -2],
    connections: ['events'],
  },
  {
    id: 'prayer-wall',
    labelZh: '禱告牆',
    labelEn: 'Prayer Wall',
    path: '/prayer-wall',
    group: 'community',
    size: 0.55,
    color: '#1A5C3A',
    glowColor: '#28a060',
    position: [3, -4.5, -1],
    connections: ['events', 'contact'],
  },
  {
    id: 'contact',
    labelZh: '聯絡我們',
    labelEn: 'Contact',
    path: '/contact',
    group: 'connect',
    size: 0.5,
    color: '#6B2236',
    glowColor: '#a03050',
    position: [-5.5, -1.5, 0.5],
    connections: ['about', 'faq'],
  },
  {
    id: 'faq',
    labelZh: '常見問題',
    labelEn: 'FAQ',
    path: '/faq',
    group: 'connect',
    size: 0.45,
    color: '#6B2236',
    glowColor: '#a03050',
    position: [-4.5, -3.5, -1.5],
    connections: ['contact', 'first-visit'],
  },
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
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ background: meta.color, boxShadow: `0 0 6px ${meta.color}` }}
          />
          <span className="text-xs text-white/60 font-medium">
            {locale === 'zh-TW' ? meta.labelZh : meta.labelEn}
          </span>
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
    container.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 2, 18);

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x1a1010, 0.5));
    const sunLight = new THREE.PointLight(0xc9a040, 3, 18);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    const wineLight = new THREE.PointLight(0x8B2F45, 1.2, 20);
    wineLight.position.set(-8, 6, 4);
    scene.add(wineLight);
    const forestLight = new THREE.PointLight(0x1A5C3A, 1.0, 20);
    forestLight.position.set(8, -4, -3);
    scene.add(forestLight);

    // ── Starfield ─────────────────────────────────────────────────────────
    const starCount = 500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3]     = (Math.random() - 0.5) * 60;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.07, color: 0xc8b89a, transparent: true, opacity: 0.6, sizeAttenuation: true });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Planet nodes ──────────────────────────────────────────────────────
    const meshes: { mesh: THREE.Mesh; glow: THREE.Mesh; node: SiteNode }[] = [];

    for (const node of NODES) {
      const color = new THREE.Color(node.color);
      const glow  = new THREE.Color(node.glowColor);

      // Glow halo
      const glowMesh = new THREE.Mesh(
        new THREE.SphereGeometry(node.size * 1.9, 16, 16),
        new THREE.MeshBasicMaterial({ color: glow, transparent: true, opacity: 0.12, depthWrite: false }),
      );
      glowMesh.position.set(...node.position);
      scene.add(glowMesh);

      // Planet
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.35,
        metalness: 0.6,
        emissive: color,
        emissiveIntensity: 0.08,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(node.size, 32, 32), mat);
      mesh.position.set(...node.position);
      mesh.userData = { node };
      scene.add(mesh);
      meshes.push({ mesh, glow: glowMesh, node });

      // Ring for home
      if (node.id === 'home') {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1.5, 0.05, 8, 48),
          new THREE.MeshBasicMaterial({ color: 0xc9a040, transparent: true, opacity: 0.45 }),
        );
        ring.rotation.x = Math.PI / 2.4;
        ring.position.set(...node.position);
        scene.add(ring);
      }
    }

    // ── Connection lines ──────────────────────────────────────────────────
    const lineObjs: { line: THREE.Line; fromId: string; toId: string }[] = [];
    const seen = new Set<string>();
    for (const n of NODES) {
      for (const cid of n.connections) {
        const key = [n.id, cid].sort().join('--');
        if (seen.has(key)) continue;
        seen.add(key);
        const target = NODES.find((x) => x.id === cid);
        if (!target) continue;
        const pts = [new THREE.Vector3(...n.position), new THREE.Vector3(...target.position)];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({ color: 0x3a2a1a, transparent: true, opacity: 0.25 });
        const line = new THREE.Line(geo, mat);
        scene.add(line);
        lineObjs.push({ line, fromId: n.id, toId: cid });
      }
    }

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
        transition:color 0.15s;
      `;
      labelContainer.appendChild(el);
      labelEls.push({ el, node });
    }

    // ── OrbitControls ─────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 6;
    controls.maxDistance = 28;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;

    // ── Raycaster for click/hover ─────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hoveredId: string | null = null;

    const planetMeshes = meshes.map((m) => m.mesh);

    function onPointerMove(e: PointerEvent) {
      const bcr = container.getBoundingClientRect();
      pointer.x =  ((e.clientX - bcr.left) / bcr.width)  * 2 - 1;
      pointer.y = -((e.clientY - bcr.top)  / bcr.height) * 2 + 1;
    }

    function onClick(e: MouseEvent) {
      const bcr = container.getBoundingClientRect();
      pointer.x =  ((e.clientX - bcr.left) / bcr.width)  * 2 - 1;
      pointer.y = -((e.clientY - bcr.top)  / bcr.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(planetMeshes);
      if (hits.length > 0) {
        const node = hits[0].object.userData.node as SiteNode;
        handleNavigate(node.path);
      }
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
    let rafId = 0;
    const tmpV = new THREE.Vector3();

    function animate() {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Star slow rotation
      stars.rotation.y = t * 0.01;

      // Planet rotation + pulse
      for (const { mesh, glow, node } of meshes) {
        mesh.rotation.y = t * 0.3 + node.position[0];
        mesh.rotation.x = Math.sin(t * 0.15 + node.position[2]) * 0.1;

        const isHovered = hoveredId === node.id;
        const targetScale = isHovered ? 1.25 * (1 + Math.sin(t * 3) * 0.08) : 1.0;
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

        const mat = mesh.material as THREE.MeshStandardMaterial;
        const glowMat = glow.material as THREE.MeshBasicMaterial;
        mat.emissiveIntensity += ((isHovered ? 0.5 : 0.08) - mat.emissiveIntensity) * 0.08;
        if (isHovered) mat.emissive.set(node.glowColor);
        else mat.emissive.set(node.color);
        glowMat.opacity += ((isHovered ? 0.35 : 0.12) - glowMat.opacity) * 0.08;
      }

      // Hover detection
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(planetMeshes);
      hoveredId = hits.length > 0 ? (hits[0].object.userData.node as SiteNode).id : null;
      renderer.domElement.style.cursor = hoveredId ? 'pointer' : 'default';

      // Highlight connected lines
      for (const { line, fromId, toId } of lineObjs) {
        const highlighted = hoveredId === fromId || hoveredId === toId;
        const mat = line.material as THREE.LineBasicMaterial;
        mat.color.set(highlighted ? 0xc9a040 : 0x3a2a1a);
        mat.opacity += ((highlighted ? 0.7 : 0.25) - mat.opacity) * 0.1;
      }

      // Update 2D labels
      for (const { el, node } of labelEls) {
        tmpV.set(...node.position);
        tmpV.y += node.size + 0.6;
        tmpV.project(camera);
        const x = ( tmpV.x * 0.5 + 0.5) * container.clientWidth;
        const y = (-tmpV.y * 0.5 + 0.5) * container.clientHeight;
        el.style.left = `${x}px`;
        el.style.top  = `${y}px`;
        el.style.color = hoveredId === node.id ? '#ffffff' : '#d4c4a8';
        // hide if behind camera
        el.style.display = tmpV.z < 1 ? 'block' : 'none';
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
      if (container.contains(labelContainer)) container.removeChild(labelContainer);
    };
  }, [locale, handleNavigate]);

  return (
    <div className="absolute inset-0 bg-[#0a0608]">
      <div ref={containerRef} className="absolute inset-0" />
      <Legend locale={locale} />
    </div>
  );
}
