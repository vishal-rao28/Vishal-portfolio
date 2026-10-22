/* ═══════════════════════════════════════════════════════
   THREE.JS SCENE — Holographic Multi-Ring Rig & Constellation Network
   Engineered for Vishal Rao M · iOS Dev & Technical Engineer
   ═══════════════════════════════════════════════════════ */

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 3000);
  camera.position.set(0, 0, 580);

  // ─── 1. HOLOGRAPHIC MULTI-RING RIG (Central Gyroscope & Celestial Sphere) ───
  const rigGroup = new THREE.Group();
  scene.add(rigGroup);
  rigGroup.position.set(0, 0, -100);

  function createHoloRing(radius, tube, color, opacity = 0.3) {
    const geo = new THREE.TorusGeometry(radius, tube, 16, 100);
    const mat = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    return new THREE.Mesh(geo, mat);
  }

  // Multi-tier Concentric Rings
  const ring1 = createHoloRing(340, 1.4, 0x00f2fe, 0.32); // Outer Cyan Ring
  const ring2 = createHoloRing(280, 1.2, 0x007aff, 0.38); // Middle iOS Blue Ring
  const ring3 = createHoloRing(220, 1.0, 0x8b5cf6, 0.42); // Inner Violet Ring
  const ring4 = createHoloRing(160, 0.8, 0x00f5d4, 0.35); // Core Teal Ring

  ring1.rotation.x = Math.PI / 3;
  ring2.rotation.y = Math.PI / 4;
  ring3.rotation.z = Math.PI / 6;

  rigGroup.add(ring1);
  rigGroup.add(ring2);
  rigGroup.add(ring3);
  rigGroup.add(ring4);

  // Large Wireframe Cyber Sphere (Astrolabe / Celestial Globe)
  const sphereGeo = new THREE.SphereGeometry(250, 24, 16);
  const sphereEdges = new THREE.EdgesGeometry(sphereGeo);
  const sphereMat = new THREE.LineBasicMaterial({
    color: 0x007aff,
    transparent: true,
    opacity: 0.14,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const cyberSphere = new THREE.LineSegments(sphereEdges, sphereMat);
  rigGroup.add(cyberSphere);

  // Glowing Core Geometry (Icosahedron Core)
  const coreGeo = new THREE.IcosahedronGeometry(75, 1);
  const coreEdges = new THREE.EdgesGeometry(coreGeo);
  const coreMat = new THREE.LineBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const coreMesh = new THREE.LineSegments(coreEdges, coreMat);
  rigGroup.add(coreMesh);

  // Satellite Orbiters (Small glowing beads on the rings)
  const satelliteGeo = new THREE.SphereGeometry(4, 12, 12);
  const satMat1 = new THREE.MeshBasicMaterial({ color: 0x00f2fe, blending: THREE.AdditiveBlending });
  const satMat2 = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, blending: THREE.AdditiveBlending });
  const sat1 = new THREE.Mesh(satelliteGeo, satMat1);
  const sat2 = new THREE.Mesh(satelliteGeo, satMat2);
  rigGroup.add(sat1);
  rigGroup.add(sat2);

  // ─── 2. FLOATING WIREFRAME POLYHEDRA RIGS ───
  function makePolyhedron(geo3d, size, x, y, z, color = 0x00f2fe) {
    const edges = new THREE.EdgesGeometry(geo3d);
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const mesh = new THREE.LineSegments(edges, mat);
    mesh.scale.setScalar(size);
    mesh.position.set(x, y, z);
    mesh.userData = {
      rotX: (Math.random() - 0.5) * 0.012,
      rotY: (Math.random() - 0.5) * 0.016,
      rotZ: (Math.random() - 0.5) * 0.010,
      floatY: y,
      floatSpeed: Math.random() * 0.6 + 0.3,
      floatAmp: Math.random() * 24 + 12
    };
    return mesh;
  }

  const polyhedra = [];
  const polyConfigs = [
    { geo: new THREE.TorusGeometry(1, 0.3, 16, 32), size: 48, x: -440, y: 160,  z: -120, color: 0x00f2fe },
    { geo: new THREE.TorusKnotGeometry(1, 0.3, 64, 8), size: 42, x: 420,  y: -140, z: -100, color: 0x8b5cf6 },
    { geo: new THREE.OctahedronGeometry(1), size: 65, x: 460,  y: 220,  z: -160, color: 0x007aff },
    { geo: new THREE.DodecahedronGeometry(1), size: 40, x: -380, y: -200, z: -80,  color: 0x00f5d4 },
    { geo: new THREE.IcosahedronGeometry(1), size: 55, x: 180,  y: 300,  z: -200, color: 0xffffff }
  ];

  polyConfigs.forEach(cfg => {
    const p = makePolyhedron(cfg.geo, cfg.size, cfg.x, cfg.y, cfg.z, cfg.color);
    scene.add(p);
    polyhedra.push(p);
  });

  // ─── 3. QUANTUM CONSTELLATION NETWORK PATTERN ───
  const N = 420;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = new Float32Array(N * 3);
  const pColors = new Float32Array(N * 3);
  const pSizes = new Float32Array(N);
  const velocities = [];

  const defaultPalette = [
    new THREE.Color(0x00f2fe), // Electric Cyan
    new THREE.Color(0x007aff), // iOS Blue
    new THREE.Color(0x8b5cf6), // Violet
    new THREE.Color(0x00f5d4), // Teal
    new THREE.Color(0xffffff)  // Pure White
  ];

  for (let i = 0; i < N; i++) {
    pPositions[i * 3]     = (Math.random() - 0.5) * 1500;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 1100;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 750;

    const col = defaultPalette[Math.floor(Math.random() * defaultPalette.length)];
    pColors[i * 3]     = col.r;
    pColors[i * 3 + 1] = col.g;
    pColors[i * 3 + 2] = col.b;

    pSizes[i] = Math.random() * 2.8 + 1.2;

    velocities.push({
      x: (Math.random() - 0.5) * 0.18,
      y: (Math.random() - 0.5) * 0.14,
      z: (Math.random() - 0.5) * 0.10
    });
  }

  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  pGeo.setAttribute('aColor', new THREE.BufferAttribute(pColors, 3));
  pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSizes, 1));

  // Node Shader Material with soft glow core
  const particleMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute float aSize;
      attribute vec3 aColor;
      varying vec3 vColor;
      uniform float uTime;
      void main() {
        vColor = aColor;
        vec3 pos = position;
        pos.y += sin(pos.x * 0.003 + uTime * 0.4) * 6.0;
        pos.x += cos(pos.y * 0.003 + uTime * 0.3) * 5.0;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aSize * (440.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.02, d) * 0.9;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(pGeo, particleMat);
  scene.add(particles);

  // Constellation Connection Lines Buffer
  const MAX_LINES = 700;
  const linePositions = new Float32Array(MAX_LINES * 2 * 3);
  const lineColors = new Float32Array(MAX_LINES * 2 * 3);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.38,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const connectionLines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(connectionLines);

  const CONNECT_DIST = 110;
  const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;

  function updateConstellation() {
    let lineIdx = 0;
    const pos = pGeo.attributes.position.array;

    for (let i = 0; i < N && lineIdx < MAX_LINES; i++) {
      for (let j = i + 1; j < N && lineIdx < MAX_LINES; j++) {
        const dx = pos[i * 3]     - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < CONNECT_DIST_SQ) {
          const alpha = 1.0 - Math.sqrt(distSq) / CONNECT_DIST;
          const idx = lineIdx * 6;

          linePositions[idx]     = pos[i * 3];
          linePositions[idx + 1] = pos[i * 3 + 1];
          linePositions[idx + 2] = pos[i * 3 + 2];

          linePositions[idx + 3] = pos[j * 3];
          linePositions[idx + 4] = pos[j * 3 + 1];
          linePositions[idx + 5] = pos[j * 3 + 2];

          const c1r = pColors[i * 3],     c1g = pColors[i * 3 + 1], c1b = pColors[i * 3 + 2];
          const c2r = pColors[j * 3],     c2g = pColors[j * 3 + 1], c2b = pColors[j * 3 + 2];

          lineColors[idx]     = c1r * alpha;
          lineColors[idx + 1] = c1g * alpha;
          lineColors[idx + 2] = c1b * alpha;

          lineColors[idx + 3] = c2r * alpha;
          lineColors[idx + 4] = c2g * alpha;
          lineColors[idx + 5] = c2b * alpha;

          lineIdx++;
        }
      }
    }
    lineGeo.setDrawRange(0, lineIdx * 2);
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;
  }

  // ─── 4. MOUSE & SCROLL TRACKING ───
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let scrollY = 0, targetScrollY = 0;

  window.addEventListener('mousemove', e => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 80;
    targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 60;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  // ─── 5. ANIMATION LOOP ───
  const clock = new THREE.Clock();
  let frame = 0;

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    frame++;

    particleMat.uniforms.uTime.value = elapsed;

    // Smooth lerping mouse & scroll parallax
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;
    scrollY += (targetScrollY - scrollY) * 0.05;

    camera.position.x = mouseX * 0.7;
    camera.position.y = mouseY * 0.6 - (scrollY * 0.18);
    camera.lookAt(0, -scrollY * 0.18, 0);

    // 1. Gyroscope Rings Rotation & Orbit Dynamics
    ring1.rotation.x += 0.005;
    ring1.rotation.y += 0.007;
    ring2.rotation.y += 0.009;
    ring2.rotation.z += 0.006;
    ring3.rotation.x -= 0.007;
    ring3.rotation.z += 0.008;
    ring4.rotation.y += 0.012;

    // Cyber Sphere & Core Rotation
    cyberSphere.rotation.y = elapsed * 0.04;
    cyberSphere.rotation.x = elapsed * 0.02;
    coreMesh.rotation.x = elapsed * 0.15;
    coreMesh.rotation.y = elapsed * 0.18;

    // Satellite Beads Orbiting on the rings
    sat1.position.set(
      Math.cos(elapsed * 1.2) * 340,
      Math.sin(elapsed * 1.2) * 340 * Math.sin(Math.PI / 3),
      Math.sin(elapsed * 1.2) * 340 * Math.cos(Math.PI / 3)
    );
    sat2.position.set(
      Math.cos(elapsed * 1.5 + 2) * 280 * Math.cos(Math.PI / 4),
      Math.sin(elapsed * 1.5 + 2) * 280,
      Math.cos(elapsed * 1.5 + 2) * 280 * Math.sin(Math.PI / 4)
    );

    // Rig Floating Vertical Harmonics
    rigGroup.position.y = Math.sin(elapsed * 0.4) * 20;
    rigGroup.rotation.y = elapsed * 0.03;

    // 2. Floating Polyhedra Animation
    polyhedra.forEach(p => {
      p.rotation.x += p.userData.rotX;
      p.rotation.y += p.userData.rotY;
      p.rotation.z += p.userData.rotZ;
      p.position.y = p.userData.floatY + Math.sin(elapsed * p.userData.floatSpeed) * p.userData.floatAmp;
    });

    // 3. Update Constellation Nodes & Boundaries
    const pos = pGeo.attributes.position.array;
    for (let i = 0; i < N; i++) {
      pos[i * 3]     += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;

      if (pos[i * 3]     >  750) pos[i * 3]     = -750;
      if (pos[i * 3]     < -750) pos[i * 3]     =  750;
      if (pos[i * 3 + 1] >  550) pos[i * 3 + 1] = -550;
      if (pos[i * 3 + 1] < -550) pos[i * 3 + 1] =  550;
      if (pos[i * 3 + 2] >  380) pos[i * 3 + 2] = -380;
      if (pos[i * 3 + 2] < -380) pos[i * 3 + 2] =  380;
    }
    pGeo.attributes.position.needsUpdate = true;

    // Update lines every 3 frames for optimal 60+ FPS
    if (frame % 3 === 0) {
      updateConstellation();
    }

    particles.rotation.y = elapsed * 0.012;
    connectionLines.rotation.y = elapsed * 0.012;

    renderer.render(scene, camera);
  }

  animate();

  // ─── 6. THEME SWITCHER INTEGRATION ───
  window.setThreeTheme = function (themeName) {
    let primaryColor, secondaryColor, tertiaryColor, newPalette;

    if (themeName === 'swift') {
      primaryColor = 0xff5e3a;
      secondaryColor = 0xec4899;
      tertiaryColor = 0xa855f7;
      newPalette = [new THREE.Color(0xff5e3a), new THREE.Color(0xec4899), new THREE.Color(0xa855f7), new THREE.Color(0xf59e0b), new THREE.Color(0xffffff)];
    } else if (themeName === 'matrix') {
      primaryColor = 0x00f5d4;
      secondaryColor = 0x10b981;
      tertiaryColor = 0x06b6d4;
      newPalette = [new THREE.Color(0x00f5d4), new THREE.Color(0x10b981), new THREE.Color(0x34d399), new THREE.Color(0x06b6d4), new THREE.Color(0xffffff)];
    } else if (themeName === 'titanium') {
      primaryColor = 0xffffff;
      secondaryColor = 0xcbd5e1;
      tertiaryColor = 0x94a3b8;
      newPalette = [new THREE.Color(0xffffff), new THREE.Color(0xcbd5e1), new THREE.Color(0x94a3b8), new THREE.Color(0x64748b), new THREE.Color(0x38bdf8)];
    } else { // cyber default
      primaryColor = 0x00f2fe;
      secondaryColor = 0x007aff;
      tertiaryColor = 0x8b5cf6;
      newPalette = defaultPalette;
    }

    ring1.material.color.setHex(primaryColor);
    ring2.material.color.setHex(secondaryColor);
    ring3.material.color.setHex(tertiaryColor);
    ring4.material.color.setHex(primaryColor);
    cyberSphere.material.color.setHex(secondaryColor);
    coreMesh.material.color.setHex(primaryColor);
    sat1.material.color.setHex(primaryColor);
    sat2.material.color.setHex(tertiaryColor);

    const colors = pGeo.attributes.aColor.array;
    for (let i = 0; i < N; i++) {
      const col = newPalette[Math.floor(Math.random() * newPalette.length)];
      pColors[i * 3]     = col.r;
      pColors[i * 3 + 1] = col.g;
      pColors[i * 3 + 2] = col.b;
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    pGeo.attributes.aColor.needsUpdate = true;
  };

  const savedTheme = localStorage.getItem('portfolio_theme');
  if (savedTheme) {
    window.setThreeTheme(savedTheme);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });

})();
