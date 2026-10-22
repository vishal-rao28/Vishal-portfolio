/* ═══════════════════════════════════════════════════════
   THREE.JS SCENE — Luxury Kinetic Gyroscopic Core & Luminous Stardust
   Engineered for Vishal Rao M · iOS Developer & Technical Engineer
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
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 0, 480);

  // ─── COLOR PALETTES ───
  let currentTheme = {
    primary: new THREE.Color(0x00f2fe),   // Vibrant Cyan
    secondary: new THREE.Color(0x007aff), // iOS Sapphire Blue
    tertiary: new THREE.Color(0x8b5cf6),  // Radiant Violet
    accent: new THREE.Color(0x00f5d4),    // Electric Teal
    white: new THREE.Color(0xffffff)
  };

  // ─── 1. KINETIC GYROSCOPIC RIG GROUP ───
  const rigGroup = new THREE.Group();
  scene.add(rigGroup);
  rigGroup.position.set(0, 20, 0);

  // Helper: Create Smooth Glowing Holographic Ring
  function createGlowRing(radius, tube, radialSegments, tubularSegments, colorHex, opacity = 0.45) {
    const geo = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending,
      wireframe: true,
      depthWrite: false
    });
    return new THREE.Mesh(geo, mat);
  }

  // Ring 1: Primary Outer Horizon Ring (Cyan)
  const ring1 = createGlowRing(220, 1.8, 16, 90, currentTheme.primary.getHex(), 0.55);
  ring1.rotation.x = Math.PI / 2.8;
  rigGroup.add(ring1);

  // Ring 2: Inclined Equatorial Ring (iOS Blue)
  const ring2 = createGlowRing(180, 1.4, 16, 80, currentTheme.secondary.getHex(), 0.6);
  ring2.rotation.y = Math.PI / 3.2;
  ring2.rotation.z = Math.PI / 5;
  rigGroup.add(ring2);

  // Ring 3: Inner Orbital Gyro Ring (Violet)
  const ring3 = createGlowRing(140, 1.2, 16, 70, currentTheme.tertiary.getHex(), 0.5);
  ring3.rotation.x = -Math.PI / 4;
  ring3.rotation.y = Math.PI / 6;
  rigGroup.add(ring3);

  // Ring 4: Core Precision Nano Ring (Teal)
  const ring4 = createGlowRing(100, 0.9, 12, 60, currentTheme.accent.getHex(), 0.4);
  ring4.rotation.z = Math.PI / 2;
  rigGroup.add(ring4);

  // Central Holographic Quantum Core (Glowing Wireframe Icosahedron)
  const coreGeo = new THREE.IcosahedronGeometry(48, 1);
  const coreEdges = new THREE.EdgesGeometry(coreGeo);
  const coreMat = new THREE.LineBasicMaterial({
    color: currentTheme.primary.getHex(),
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const coreMesh = new THREE.LineSegments(coreEdges, coreMat);
  rigGroup.add(coreMesh);

  // Inner Breathing Pulsar Node (Small glowing nucleus)
  const nucleusGeo = new THREE.SphereGeometry(12, 16, 16);
  const nucleusMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
  rigGroup.add(nucleus);

  // Orbiting Luminescent Satellite Nodes
  const satGeo = new THREE.SphereGeometry(4.5, 16, 16);
  const satMat1 = new THREE.MeshBasicMaterial({ color: currentTheme.primary.getHex(), blending: THREE.AdditiveBlending });
  const satMat2 = new THREE.MeshBasicMaterial({ color: currentTheme.tertiary.getHex(), blending: THREE.AdditiveBlending });
  const satMat3 = new THREE.MeshBasicMaterial({ color: currentTheme.accent.getHex(), blending: THREE.AdditiveBlending });

  const sat1 = new THREE.Mesh(satGeo, satMat1);
  const sat2 = new THREE.Mesh(satGeo, satMat2);
  const sat3 = new THREE.Mesh(satGeo, satMat3);
  rigGroup.add(sat1);
  rigGroup.add(sat2);
  rigGroup.add(sat3);

  // ─── 2. LUMINOUS ORBITAL STARDUST VORTEX (Keplerian Particles) ───
  const PARTICLE_COUNT = 520;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = new Float32Array(PARTICLE_COUNT * 3);
  const pColors = new Float32Array(PARTICLE_COUNT * 3);
  const pSizes = new Float32Array(PARTICLE_COUNT);
  const orbitalData = [];

  const palette = [
    currentTheme.primary,
    currentTheme.secondary,
    currentTheme.tertiary,
    currentTheme.accent,
    currentTheme.white
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Distribute in a rich orbital disk with spherical halo
    const radius = Math.pow(Math.random(), 0.6) * 550 + 60;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 240 * (radius / 550 + 0.3);

    pPositions[i * 3]     = Math.cos(angle) * radius;
    pPositions[i * 3 + 1] = height;
    pPositions[i * 3 + 2] = Math.sin(angle) * radius;

    const col = palette[Math.floor(Math.random() * palette.length)];
    pColors[i * 3]     = col.r;
    pColors[i * 3 + 1] = col.g;
    pColors[i * 3 + 2] = col.b;

    pSizes[i] = Math.random() * 3.5 + 1.2;

    orbitalData.push({
      radius: radius,
      angle: angle,
      speed: (0.003 + (600 - radius) * 0.00002) * (Math.random() > 0.1 ? 1 : -1),
      verticalOffset: height,
      oscSpeed: Math.random() * 0.02 + 0.01,
      oscAmp: Math.random() * 16 + 4
    });
  }

  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
  pGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));

  // Custom Point Shader with smooth radial illumination
  const particleMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float uPixelRatio;
      uniform float uTime;
      void main() {
        vColor = color;
        vec3 pos = position;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * uPixelRatio * (320.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        // Soft gaussian-like falloff for premium glow
        float strength = pow(1.0 - d * 2.0, 1.8);
        gl_FragColor = vec4(vColor, strength * 0.85);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(pGeo, particleMat);
  scene.add(particleSystem);

  // ─── 3. ELEGANT CONSTELLATION LINK CABLES ───
  // Subtle connecting lines only near the core for architectural elegance
  const MAX_CONNECTIONS = 280;
  const linePositions = new Float32Array(MAX_CONNECTIONS * 2 * 3);
  const lineColors = new Float32Array(MAX_CONNECTIONS * 2 * 3);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const constellationLines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(constellationLines);

  const CONNECT_RADIUS = 95;
  const CONNECT_RADIUS_SQ = CONNECT_RADIUS * CONNECT_RADIUS;

  function updateConstellations() {
    let lineIdx = 0;
    const pos = pGeo.attributes.position.array;
    // Check nearest subset of inner particles for performance & clean aesthetic
    const checkCount = Math.min(PARTICLE_COUNT, 160);

    for (let i = 0; i < checkCount && lineIdx < MAX_CONNECTIONS; i++) {
      for (let j = i + 1; j < checkCount && lineIdx < MAX_CONNECTIONS; j++) {
        const dx = pos[i * 3]     - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < CONNECT_RADIUS_SQ) {
          const alpha = (1.0 - Math.sqrt(distSq) / CONNECT_RADIUS) * 0.7;
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

  // ─── 4. INTERACTIVE MOUSE & SCROLL TRACKING ───
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let scrollY = 0, targetScrollY = 0;

  window.addEventListener('mousemove', e => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 70;
    targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 50;
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

    // Smooth Lerping
    mouseX += (targetMouseX - mouseX) * 0.045;
    mouseY += (targetMouseY - mouseY) * 0.045;
    scrollY += (targetScrollY - scrollY) * 0.06;

    // Camera responds gracefully to mouse and scroll
    camera.position.x = mouseX * 0.6;
    camera.position.y = mouseY * 0.5 - (scrollY * 0.16);
    camera.lookAt(0, -scrollY * 0.16, 0);

    // 1. Rig Gyroscopic Rotations (Multi-axis harmony)
    ring1.rotation.x += 0.005;
    ring1.rotation.y += 0.007;

    ring2.rotation.y += 0.008;
    ring2.rotation.z += 0.006;

    ring3.rotation.x -= 0.006;
    ring3.rotation.z += 0.007;

    ring4.rotation.y -= 0.011;

    // 2. Core & Pulsar Breathing
    coreMesh.rotation.x = elapsed * 0.18;
    coreMesh.rotation.y = elapsed * 0.22;
    const pulse = 1.0 + Math.sin(elapsed * 2.8) * 0.18;
    nucleus.scale.set(pulse, pulse, pulse);

    // 3. Orbiting Satellite Nodes on the rings
    const t1 = elapsed * 1.1;
    sat1.position.set(
      Math.cos(t1) * 220,
      Math.sin(t1) * 220 * Math.sin(Math.PI / 2.8),
      Math.sin(t1) * 220 * Math.cos(Math.PI / 2.8)
    );

    const t2 = elapsed * 1.4 + 2.0;
    sat2.position.set(
      Math.cos(t2) * 180 * Math.cos(Math.PI / 3.2),
      Math.sin(t2) * 180,
      Math.cos(t2) * 180 * Math.sin(Math.PI / 3.2)
    );

    const t3 = elapsed * 1.8 + 4.0;
    sat3.position.set(
      Math.sin(t3) * 140,
      Math.cos(t3) * 140 * Math.cos(Math.PI / 4),
      -Math.cos(t3) * 140 * Math.sin(Math.PI / 4)
    );

    // 4. Subtle Rig Float
    rigGroup.position.y = Math.sin(elapsed * 0.5) * 15;
    rigGroup.rotation.y = elapsed * 0.025;

    // 5. Update Orbital Stardust Stream
    const pos = pGeo.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const data = orbitalData[i];
      data.angle += data.speed;

      pos[i * 3]     = Math.cos(data.angle) * data.radius;
      pos[i * 3 + 1] = data.verticalOffset + Math.sin(elapsed * 2.0 + data.angle) * data.oscAmp;
      pos[i * 3 + 2] = Math.sin(data.angle) * data.radius;
    }
    pGeo.attributes.position.needsUpdate = true;

    // Update constellation lines every 2 frames for silky 60fps
    if (frame % 2 === 0) {
      updateConstellations();
    }

    renderer.render(scene, camera);
  }

  animate();

  // ─── 6. THEME INTEGRATION ───
  window.setThreeTheme = function (themeName) {
    let pCol, sCol, tCol, aCol;

    if (themeName === 'swift') {
      pCol = 0xff5e3a; // Swift Orange
      sCol = 0xec4899; // Pink
      tCol = 0xa855f7; // Purple
      aCol = 0xf59e0b; // Gold
    } else if (themeName === 'matrix') {
      pCol = 0x00f5d4; // Matrix Teal
      sCol = 0x10b981; // Emerald
      tCol = 0x06b6d4; // Cyan
      aCol = 0x34d399; // Mint
    } else if (themeName === 'titanium') {
      pCol = 0xffffff; // Pure White
      sCol = 0xcbd5e1; // Silver Slate
      tCol = 0x94a3b8; // Titanium
      aCol = 0x38bdf8; // Sky Blue
    } else { // cyber default
      pCol = 0x00f2fe; // Cyan
      sCol = 0x007aff; // iOS Blue
      tCol = 0x8b5cf6; // Violet
      aCol = 0x00f5d4; // Teal
    }

    ring1.material.color.setHex(pCol);
    ring2.material.color.setHex(sCol);
    ring3.material.color.setHex(tCol);
    ring4.material.color.setHex(aCol);
    coreMesh.material.color.setHex(pCol);
    sat1.material.color.setHex(pCol);
    sat2.material.color.setHex(tCol);
    sat3.material.color.setHex(aCol);

    const pColorObjs = [
      new THREE.Color(pCol),
      new THREE.Color(sCol),
      new THREE.Color(tCol),
      new THREE.Color(aCol),
      new THREE.Color(0xffffff)
    ];

    const colors = pGeo.attributes.color.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const c = pColorObjs[Math.floor(Math.random() * pColorObjs.length)];
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      pColors[i * 3]     = c.r;
      pColors[i * 3 + 1] = c.g;
      pColors[i * 3 + 2] = c.b;
    }
    pGeo.attributes.color.needsUpdate = true;
  };

  const savedTheme = localStorage.getItem('portfolio_theme');
  if (savedTheme) {
    window.setThreeTheme(savedTheme);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    particleMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
  }, { passive: true });

})();
