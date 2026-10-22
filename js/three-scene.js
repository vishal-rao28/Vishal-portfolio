/* ═══════════════════════════════════════════════════════
   THREE.JS SCENE — Apple Cyber-Mesh & Quantum Constellation
   Engineered for Vishal Rao M · iOS Dev & Technical Engineer
   ═══════════════════════════════════════════════════════ */

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 3000);
  camera.position.set(0, 0, 520);

  // ─── 1. CYBER-WAVE TERRAIN (Undulating Digital Horizon) ───
  const planeWidth = 1800;
  const planeHeight = 1400;
  const gridX = 44;
  const gridY = 34;
  const terrainGeo = new THREE.PlaneGeometry(planeWidth, planeHeight, gridX, gridY);

  // Store original vertex coordinates
  const terrainPositions = terrainGeo.attributes.position;
  const baseTerrainZ = new Float32Array(terrainPositions.count);
  for (let i = 0; i < terrainPositions.count; i++) {
    baseTerrainZ[i] = terrainPositions.getZ(i);
  }

  // Cyan-Blue Wireframe Mesh
  const terrainMat = new THREE.MeshBasicMaterial({
    color: 0x007aff,
    wireframe: true,
    transparent: true,
    opacity: 0.13,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.rotation.x = -Math.PI / 2.25;
  terrainMesh.position.set(0, -260, -80);
  scene.add(terrainMesh);

  // Glowing Vertex Intersections on the Terrain
  const vertexPointsMat = new THREE.PointsMaterial({
    color: 0x00f2fe,
    size: 2.4,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const terrainPoints = new THREE.Points(terrainGeo, vertexPointsMat);
  terrainPoints.rotation.x = -Math.PI / 2.25;
  terrainPoints.position.set(0, -260, -80);
  scene.add(terrainPoints);

  // ─── 2. QUANTUM CONSTELLATION NODES & SYNAPSES ───
  const N = 320;
  const particleGeo = new THREE.BufferGeometry();
  const pCoords = new Float32Array(N * 3);
  const pColors = new Float32Array(N * 3);
  const pSizes = new Float32Array(N);
  const velocities = [];

  // Tech palette: iOS Blue (#007aff), Electric Cyan (#00f2fe), Swift Violet (#8b5cf6), Ice White (#ffffff)
  const palette = [
    new THREE.Color(0x007aff),
    new THREE.Color(0x00f2fe),
    new THREE.Color(0x8b5cf6),
    new THREE.Color(0x00f5d4),
    new THREE.Color(0xffffff)
  ];

  for (let i = 0; i < N; i++) {
    pCoords[i * 3]     = (Math.random() - 0.5) * 1500;
    pCoords[i * 3 + 1] = (Math.random() - 0.5) * 1100;
    pCoords[i * 3 + 2] = (Math.random() - 0.5) * 750;

    const col = palette[Math.floor(Math.random() * palette.length)];
    pColors[i * 3]     = col.r;
    pColors[i * 3 + 1] = col.g;
    pColors[i * 3 + 2] = col.b;

    pSizes[i] = Math.random() * 2.8 + 1.2;

    velocities.push({
      x: (Math.random() - 0.5) * 0.22,
      y: (Math.random() - 0.5) * 0.18,
      z: (Math.random() - 0.5) * 0.14
    });
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(pCoords, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
  particleGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));

  // Custom Particle Shader with soft glowing core
  const particleMat = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float time;
      void main() {
        vColor = color;
        vec3 pos = position;
        pos.y += sin(pos.x * 0.003 + time * 0.5) * 6.0;
        pos.x += cos(pos.y * 0.003 + time * 0.4) * 5.0;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (450.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.05, d) * 0.85;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Synaptic Connection Lines (Pre-allocated buffer for optimal 60+ FPS performance)
  const MAX_CONNECTIONS = 600;
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
  const connectionLines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(connectionLines);

  const CONNECT_DIST = 115;
  const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;

  function updateConnections() {
    let lineIdx = 0;
    const pos = particleGeo.attributes.position.array;

    for (let i = 0; i < N && lineIdx < MAX_CONNECTIONS; i++) {
      for (let j = i + 1; j < N && lineIdx < MAX_CONNECTIONS; j++) {
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

          // Blend colors of both nodes
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

  // ─── 3. FLOATING HOLOGRAPHIC GYROSCOPES & TECH ARTIFACTS ───
  const floatingGroup = new THREE.Group();
  scene.add(floatingGroup);

  // Concentric Gyroscope Rings (Symbolizing Apple CoreMotion & System Architecture)
  function makeGimbalRing(radius, tube, color, opacity = 0.25) {
    const geo = new THREE.TorusGeometry(radius, tube, 16, 64);
    const mat = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending
    });
    return new THREE.Mesh(geo, mat);
  }

  const gyroGroup = new THREE.Group();
  const ring1 = makeGimbalRing(72, 1.2, 0x007aff, 0.28);
  const ring2 = makeGimbalRing(56, 1.0, 0x00f2fe, 0.22);
  const ring3 = makeGimbalRing(40, 0.8, 0x8b5cf6, 0.32);

  const coreGeo = new THREE.OctahedronGeometry(22, 1);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x00f5d4,
    wireframe: true,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);

  gyroGroup.add(ring1);
  gyroGroup.add(ring2);
  gyroGroup.add(ring3);
  gyroGroup.add(coreMesh);
  gyroGroup.position.set(-420, 140, -120);
  floatingGroup.add(gyroGroup);

  // Floating Icosahedron (Neural AI / Machine Learning Lattice)
  const icoGeo = new THREE.IcosahedronGeometry(50, 1);
  const icoEdges = new THREE.EdgesGeometry(icoGeo);
  const icoMat = new THREE.LineBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending
  });
  const icoMesh = new THREE.LineSegments(icoEdges, icoMat);
  icoMesh.position.set(430, -90, -90);
  floatingGroup.add(icoMesh);

  // Floating Torus Knot (Data Complexity & Cryptography)
  const knotGeo = new THREE.TorusKnotGeometry(36, 9, 80, 12);
  const knotMat = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending
  });
  const knotMesh = new THREE.Mesh(knotGeo, knotMat);
  knotMesh.position.set(460, 200, -180);
  floatingGroup.add(knotMesh);

  // ─── 4. MOUSE & SCROLL INTERACTION ───
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let scrollY = 0;
  let targetScrollY = 0;

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

    particleMat.uniforms.time.value = elapsed;

    // Smooth lerp mouse & scroll parallax
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    scrollY += (targetScrollY - scrollY) * 0.06;

    camera.position.x = mouseX * 0.6;
    camera.position.y = mouseY * 0.5 - (scrollY * 0.15);
    camera.position.z = 520 + Math.sin(elapsed * 0.2) * 15;
    camera.lookAt(0, -scrollY * 0.15, 0);

    // Dynamic wave deformation of cyber terrain
    const pArray = terrainGeo.attributes.position.array;
    for (let i = 0; i < terrainPositions.count; i++) {
      const vx = pArray[i * 3];
      const vy = pArray[i * 3 + 1];
      const wave = Math.sin(vx * 0.005 + elapsed * 1.1) * Math.cos(vy * 0.004 + elapsed * 0.9) * 32.0;
      const ripple = Math.sin(Math.sqrt(vx * vx + vy * vy) * 0.008 - elapsed * 2.0) * 10.0;
      pArray[i * 3 + 2] = baseTerrainZ[i] + wave + ripple;
    }
    terrainGeo.attributes.position.needsUpdate = true;

    // Update particle positions and wrap around
    const coords = particleGeo.attributes.position.array;
    for (let i = 0; i < N; i++) {
      coords[i * 3]     += velocities[i].x;
      coords[i * 3 + 1] += velocities[i].y;
      coords[i * 3 + 2] += velocities[i].z;

      // Gentle bounds wrap
      if (coords[i * 3]     > 750)  coords[i * 3]     = -750;
      if (coords[i * 3]     < -750) coords[i * 3]     =  750;
      if (coords[i * 3 + 1] > 550)  coords[i * 3 + 1] = -550;
      if (coords[i * 3 + 1] < -550) coords[i * 3 + 1] =  550;
      if (coords[i * 3 + 2] > 380)  coords[i * 3 + 2] = -380;
      if (coords[i * 3 + 2] < -380) coords[i * 3 + 2] =  380;
    }
    particleGeo.attributes.position.needsUpdate = true;

    // Update synaptic line connections every 3 frames for silky smooth performance
    if (frame % 3 === 0) {
      updateConnections();
    }

    // Animate Gyroscope & Floating Wireframes
    ring1.rotation.x += 0.006;
    ring1.rotation.y += 0.009;
    ring2.rotation.y += 0.012;
    ring2.rotation.z += 0.007;
    ring3.rotation.x -= 0.008;
    ring3.rotation.z += 0.010;
    coreMesh.rotation.x += 0.015;
    coreMesh.rotation.y += 0.015;

    gyroGroup.position.y = 140 + Math.sin(elapsed * 0.7) * 18;
    gyroGroup.rotation.y = elapsed * 0.15;

    icoMesh.rotation.x += 0.005;
    icoMesh.rotation.y += 0.008;
    icoMesh.position.y = -90 + Math.cos(elapsed * 0.6) * 15;

    knotMesh.rotation.x += 0.004;
    knotMesh.rotation.y += 0.006;
    knotMesh.position.y = 200 + Math.sin(elapsed * 0.5 + 1.0) * 20;

    // Subtle drift of whole particle field
    particles.rotation.y = elapsed * 0.015;
    connectionLines.rotation.y = elapsed * 0.015;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });

})();
