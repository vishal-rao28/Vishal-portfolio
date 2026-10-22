/* ═══════════════════════════════════════════════════════
   THREE.JS SCENE — Real Deep Space & Antigravity Cosmos
   Authentic Astronomical Universe · Volumetric Nebulae · 
   Twinkling Starfield · Meteors · Orbital Zero-G Physics
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
  scene.fog = new THREE.FogExp2(0x020308, 0.00035);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 4000);
  camera.position.set(0, 0, 600);

  // ─── 1. PROCEDURAL NEBULA GAS CLOUD TEXTURE ───
  function createNebulaTexture(colorHex = '#38bdf8') {
    const size = 256;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');

    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, colorHex);
    gradient.addColorStop(0.35, colorHex);
    gradient.addColorStop(0.7, 'rgba(10, 15, 35, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    return new THREE.CanvasTexture(c);
  }

  // Volumetric Nebulae Collection
  const nebulaeGroup = new THREE.Group();
  scene.add(nebulaeGroup);

  const nebulaColors = [
    'rgba(0, 122, 255, 0.35)',   // Deep iOS Deep Space Blue
    'rgba(0, 242, 254, 0.25)',   // Cyan Stellar Dust
    'rgba(139, 92, 246, 0.30)',  // Interstellar Violet
    'rgba(247, 37, 133, 0.20)',  // Cosmic Magenta
    'rgba(16, 185, 129, 0.18)'   // Auroral Green
  ];

  const nebulaSprites = [];
  const nebulaConfigs = [
    { x: -500, y: 250,  z: -600, scale: 950, colorIdx: 0 },
    { x: 550,  y: -200, z: -700, scale: 1100, colorIdx: 1 },
    { x: 300,  y: 350,  z: -900, scale: 1250, colorIdx: 2 },
    { x: -400, y: -300, z: -800, scale: 900,  colorIdx: 3 },
    { x: 50,   y: 50,   z: -1100, scale: 1400, colorIdx: 0 },
    { x: -650, y: -100, z: -1000, scale: 1050, colorIdx: 2 }
  ];

  nebulaConfigs.forEach(cfg => {
    const tex = createNebulaTexture(nebulaColors[cfg.colorIdx]);
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(cfg.x, cfg.y, cfg.z);
    sprite.scale.set(cfg.scale, cfg.scale, 1);
    sprite.userData = {
      baseScale: cfg.scale,
      rotSpeed: (Math.random() - 0.5) * 0.0004,
      pulseSpeed: Math.random() * 0.4 + 0.2
    };
    nebulaeGroup.add(sprite);
    nebulaSprites.push(sprite);
  });

  // ─── 2. REALISTIC TWINKLING DEEP STARFIELD (2,400 Stars) ───
  const STAR_COUNT = 2400;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(STAR_COUNT * 3);
  const starColors = new Float32Array(STAR_COUNT * 3);
  const starSizes = new Float32Array(STAR_COUNT);
  const starPhases = new Float32Array(STAR_COUNT);
  const starTwinkleSpeeds = new Float32Array(STAR_COUNT);

  // Real astronomical stellar spectral types (O, B, A, F, G, K, M)
  const starPalettes = [
    new THREE.Color(0xb5d4ff), // O/B: Blue-white giant
    new THREE.Color(0xdce7ff), // A: Bright white-blue
    new THREE.Color(0xffffff), // Pure white
    new THREE.Color(0xfff1dc), // F/G: Soft sun-like warm yellow
    new THREE.Color(0xffddb4), // K: Golden amber
    new THREE.Color(0xffb89b), // M: Soft cosmic orange-red
    new THREE.Color(0x99f6e4)  // Cyan-tinted distant star
  ];

  for (let i = 0; i < STAR_COUNT; i++) {
    // Spherical distribution with depth from z: -2500 to +400
    const r = 2400 * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    starPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = r * Math.cos(phi) - 400;

    const col = starPalettes[Math.floor(Math.random() * starPalettes.length)];
    starColors[i * 3]     = col.r;
    starColors[i * 3 + 1] = col.g;
    starColors[i * 3 + 2] = col.b;

    // Varied stellar magnitudes (most are tiny pinpoints, few are bright beacons)
    const rand = Math.random();
    if (rand > 0.96) {
      starSizes[i] = Math.random() * 3.5 + 2.5; // Major beacon stars
    } else if (rand > 0.85) {
      starSizes[i] = Math.random() * 2.0 + 1.6; // Medium bright stars
    } else {
      starSizes[i] = Math.random() * 1.2 + 0.6; // Deep background field
    }

    starPhases[i] = Math.random() * Math.PI * 2;
    starTwinkleSpeeds[i] = Math.random() * 2.5 + 0.8;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('aColor', new THREE.BufferAttribute(starColors, 3));
  starGeo.setAttribute('aSize', new THREE.BufferAttribute(starSizes, 1));
  starGeo.setAttribute('aPhase', new THREE.BufferAttribute(starPhases, 1));
  starGeo.setAttribute('aTwinkleSpeed', new THREE.BufferAttribute(starTwinkleSpeeds, 1));

  // Custom Twinkling Star Shader
  const starShaderMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 }
    },
    vertexShader: `
      attribute vec3 aColor;
      attribute float aSize;
      attribute float aPhase;
      attribute float aTwinkleSpeed;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uTime;

      void main() {
        vColor = aColor;
        // Natural non-linear twinkle
        float t = sin(uTime * aTwinkleSpeed + aPhase);
        float twinkle = 0.45 + 0.55 * (t * t);
        vAlpha = twinkle;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * (0.8 + 0.4 * t) * (420.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        // Soft astronomical optical diffraction glow
        float core = exp(-d * d * 22.0);
        float halo = smoothstep(0.5, 0.0, d) * 0.4;
        float intensity = core + halo;
        gl_FragColor = vec4(vColor, vAlpha * intensity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const starfield = new THREE.Points(starGeo, starShaderMat);
  scene.add(starfield);

  // ─── 3. WEIGHTLESS FLOATING ANTIGRAVITY STARDUST (Zero-G Drift) ───
  const DUST_COUNT = 380;
  const dustGeo = new THREE.BufferGeometry();
  const dustPositions = new Float32Array(DUST_COUNT * 3);
  const dustVelocities = [];

  for (let i = 0; i < DUST_COUNT; i++) {
    dustPositions[i * 3]     = (Math.random() - 0.5) * 1400;
    dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 600;

    dustVelocities.push({
      x: (Math.random() - 0.5) * 0.25,
      y: (Math.random() - 0.5) * 0.20,
      z: (Math.random() - 0.5) * 0.18,
      origX: dustPositions[i * 3],
      origY: dustPositions[i * 3 + 1]
    });
  }

  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

  const dustMat = new THREE.PointsMaterial({
    color: 0x00f2fe,
    size: 2.2,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const stardust = new THREE.Points(dustGeo, dustMat);
  scene.add(stardust);

  // ─── 4. CELESTIAL ANTIGRAVITY ORBITAL RINGS ───
  const celestialGroup = new THREE.Group();
  scene.add(celestialGroup);

  function makeCosmicRing(radius, tube, color, opacity = 0.2) {
    const geo = new THREE.TorusGeometry(radius, tube, 8, 80);
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    return new THREE.LineSegments(new THREE.EdgesGeometry(geo), mat);
  }

  const orbitRing1 = makeCosmicRing(220, 0.8, 0x007aff, 0.22);
  const orbitRing2 = makeCosmicRing(180, 0.6, 0x00f2fe, 0.18);
  const orbitRing3 = makeCosmicRing(140, 0.5, 0x8b5cf6, 0.25);

  orbitRing1.rotation.x = Math.PI / 3;
  orbitRing2.rotation.y = Math.PI / 4;
  orbitRing3.rotation.z = Math.PI / 6;

  celestialGroup.add(orbitRing1);
  celestialGroup.add(orbitRing2);
  celestialGroup.add(orbitRing3);
  celestialGroup.position.set(400, 80, -250);

  // ─── 5. CINEMATIC SHOOTING STARS / METEORS ENGINE ───
  const meteors = [];
  const MAX_METEORS = 4;

  class ShootingStar {
    constructor() {
      this.active = false;
      this.timer = Math.random() * 2.5 + 0.5; // Random initial spawn delay

      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
      this.geo = new THREE.BufferGeometry().setFromPoints(points);

      this.mat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      this.line = new THREE.Line(this.geo, this.mat);
      scene.add(this.line);

      this.pos = new THREE.Vector3();
      this.vel = new THREE.Vector3();
      this.tailLength = 120;
      this.life = 0;
      this.maxLife = 0;
    }

    spawn() {
      this.active = true;
      this.life = 0;
      this.maxLife = Math.random() * 0.7 + 0.6; // 0.6s to 1.3s streak

      // Spawn high up and slightly angled
      const side = Math.random() > 0.5 ? 1 : -1;
      this.pos.set(
        (Math.random() - 0.5) * 1200 + (side * 200),
        Math.random() * 400 + 200,
        (Math.random() - 0.5) * 600 - 100
      );

      // Trajectory angle (streaking diagonally down)
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 1200 + 1600;
      this.vel.set(-Math.cos(angle) * speed, -Math.sin(angle) * speed, (Math.random() - 0.5) * 100);

      // Meteor streak color (white-cyan or white-gold)
      const isGold = Math.random() > 0.6;
      this.mat.color.setHex(isGold ? 0xfff0d4 : 0xcceeff);
    }

    update(delta) {
      if (!this.active) {
        this.timer -= delta;
        if (this.timer <= 0) {
          this.spawn();
        }
        return;
      }

      this.life += delta;
      const progress = this.life / this.maxLife;

      if (progress >= 1.0) {
        this.active = false;
        this.mat.opacity = 0;
        this.timer = Math.random() * 3.5 + 1.8; // Next meteor in 2–5 seconds
        return;
      }

      // Step position
      this.pos.x += this.vel.x * delta;
      this.pos.y += this.vel.y * delta;
      this.pos.z += this.vel.z * delta;

      // Calculate tail trailing behind velocity
      const dir = this.vel.clone().normalize();
      const tail = this.pos.clone().sub(dir.multiplyScalar(this.tailLength));

      const posAttr = this.geo.attributes.position;
      posAttr.setXYZ(0, this.pos.x, this.pos.y, this.pos.z);
      posAttr.setXYZ(1, tail.x, tail.y, tail.z);
      posAttr.needsUpdate = true;

      // Fade in sharply, then fade out
      if (progress < 0.2) {
        this.mat.opacity = progress / 0.2;
      } else {
        this.mat.opacity = (1.0 - progress) * 0.9;
      }
    }
  }

  for (let i = 0; i < MAX_METEORS; i++) {
    meteors.push(new ShootingStar());
  }

  // ─── 6. INTERACTION & CAMERA PARALLAX ───
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let scrollY = 0, targetScrollY = 0;

  window.addEventListener('mousemove', e => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 60;
    targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 45;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  // ─── 7. ANIMATION LOOP ───
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // 1. Twinkling Stars Time Uniform
    starShaderMat.uniforms.uTime.value = elapsed;

    // 2. Camera smooth lerping & cosmic scroll travel
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;
    scrollY += (targetScrollY - scrollY) * 0.05;

    camera.position.x = mouseX * 0.7;
    camera.position.y = mouseY * 0.6 - (scrollY * 0.22);
    camera.position.z = 600 + Math.sin(elapsed * 0.15) * 20;
    camera.lookAt(0, -scrollY * 0.22, 0);

    // 3. Volumetric Nebulae gentle drift & breathe
    nebulaSprites.forEach(sprite => {
      sprite.material.rotation += sprite.userData.rotSpeed;
      const pulse = Math.sin(elapsed * sprite.userData.pulseSpeed) * 40;
      sprite.scale.set(sprite.userData.baseScale + pulse, sprite.userData.baseScale + pulse, 1);
    });
    nebulaeGroup.rotation.y = elapsed * 0.003;

    // 4. Zero-Gravity Stardust drift with subtle cursor gravity
    const dPos = dustGeo.attributes.position.array;
    for (let i = 0; i < DUST_COUNT; i++) {
      dPos[i * 3]     += dustVelocities[i].x;
      dPos[i * 3 + 1] += dustVelocities[i].y;
      dPos[i * 3 + 2] += dustVelocities[i].z;

      // Wrap around space boundaries
      if (dPos[i * 3]     >  700) dPos[i * 3]     = -700;
      if (dPos[i * 3]     < -700) dPos[i * 3]     =  700;
      if (dPos[i * 3 + 1] >  500) dPos[i * 3 + 1] = -500;
      if (dPos[i * 3 + 1] < -500) dPos[i * 3 + 1] =  500;
      if (dPos[i * 3 + 2] >  300) dPos[i * 3 + 2] = -300;
      if (dPos[i * 3 + 2] < -300) dPos[i * 3 + 2] =  300;
    }
    dustGeo.attributes.position.needsUpdate = true;
    stardust.rotation.y = elapsed * 0.008;

    // 5. Orbital Antigravity Rings Rotation
    orbitRing1.rotation.x += 0.003;
    orbitRing1.rotation.y += 0.005;
    orbitRing2.rotation.y += 0.006;
    orbitRing2.rotation.z += 0.004;
    orbitRing3.rotation.x += 0.004;
    orbitRing3.rotation.z += 0.005;
    celestialGroup.position.y = 80 + Math.sin(elapsed * 0.5) * 16;

    // 6. Shooting Stars / Meteors Update
    meteors.forEach(m => m.update(delta));

    // 7. Slow whole-cosmos celestial spin
    starfield.rotation.y = elapsed * 0.0015;

    renderer.render(scene, camera);
  }

  animate();

  // ─── 8. LIVE THEME INTEGRATION ───
  window.setThreeTheme = function (themeName) {
    if (themeName === 'swift') {
      dustMat.color.setHex(0xff5e3a);
      orbitRing1.material.color.setHex(0xff5e3a);
      orbitRing2.material.color.setHex(0xec4899);
      orbitRing3.material.color.setHex(0xa855f7);
    } else if (themeName === 'matrix') {
      dustMat.color.setHex(0x00f5d4);
      orbitRing1.material.color.setHex(0x00f5d4);
      orbitRing2.material.color.setHex(0x10b981);
      orbitRing3.material.color.setHex(0x06b6d4);
    } else if (themeName === 'titanium') {
      dustMat.color.setHex(0xffffff);
      orbitRing1.material.color.setHex(0xffffff);
      orbitRing2.material.color.setHex(0x94a3b8);
      orbitRing3.material.color.setHex(0x64748b);
    } else { // cyber / deep space default
      dustMat.color.setHex(0x00f2fe);
      orbitRing1.material.color.setHex(0x007aff);
      orbitRing2.material.color.setHex(0x00f2fe);
      orbitRing3.material.color.setHex(0x8b5cf6);
    }
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
