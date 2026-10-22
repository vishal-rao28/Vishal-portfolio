/* ═══════════════════════════════════════════════════════
   MAIN.JS — Cursor, Reveal, Counter, Tilt, Nav
   ═══════════════════════════════════════════════════════ */

(function() {

  // ─── CUSTOM CURSOR & AMBIENT MOUSE SPOTLIGHT ───
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');
  const spotlight = document.getElementById('mouse-glow-spotlight');
  let cx = 0, cy = 0, tx = 0, ty = 0, sx = 0, sy = 0;

  document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; }, { passive: true });

  function updateCursor() {
    if (cursor) {
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    }
    if (trail) {
      tx += (cx - tx) * 0.12;
      ty += (cy - ty) * 0.12;
      trail.style.left = tx + 'px';
      trail.style.top  = ty + 'px';
    }
    if (spotlight) {
      sx += (cx - sx) * 0.08;
      sy += (cy - sy) * 0.08;
      spotlight.style.left = sx + 'px';
      spotlight.style.top  = sy + 'px';
    }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  document.querySelectorAll('a, button, .proj-row, .skill-card, .stat-card, .contact-card, .close-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // ─── SCROLL REVEAL ───
  const revealEls = document.querySelectorAll('.reveal, .tl-item');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => io.observe(el));

  // Stagger children
  document.querySelectorAll('.skills-grid, .about-stats, .projects-list, .contact-cards').forEach(grid => {
    [...grid.children].forEach((child, i) => {
      child.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  // ─── COUNTER ANIMATION ───
  function animateCounter(numEl, suffixEl, target, duration) {
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      numEl.textContent = Math.floor(ease * target);
      if (suffixEl) suffixEl.style.opacity = progress.toString();
      if (progress < 1) requestAnimationFrame(step);
      else numEl.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const numEl    = e.target.querySelector('.stat-num');
        const suffixEl = e.target.querySelector('.stat-suffix');
        const target   = parseInt(numEl.dataset.target);
        if (!isNaN(target) && !numEl.dataset.animated) {
          numEl.dataset.animated = '1';
          animateCounter(numEl, suffixEl, target, 1600);
        }
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat-card').forEach(c => counterIO.observe(c));

  // ─── HERO NAME 3D TILT ───
  const tiltEl = document.getElementById('hero-tilt');
  document.addEventListener('mousemove', e => {
    if (!tiltEl) return;
    const xOff = (e.clientX / window.innerWidth  - 0.5) * 14;
    const yOff = (e.clientY / window.innerHeight - 0.5) * 8;
    tiltEl.querySelector('.hero-name').style.transform =
      `perspective(800px) rotateY(${xOff}deg) rotateX(${-yOff}deg)`;
  });

  // ─── NAVBAR SCROLL ───
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  // ─── PROJECT ROW HOVER SOUND (subtle visual pulse) ───
  document.querySelectorAll('.proj-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.style.transition = 'all .4s';
    });
  });

  // ─── MAGNETIC BUTTONS ───
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.transition = 'transform .4s ease';
    });
  });

  // ─── SKILL CARDS — MOUSE PARALLAX ───
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      this.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
      this.style.transition = 'transform 0s';
      const glow = this.querySelector('.skill-glow');
      if (glow) {
        glow.style.top  = (e.clientY - rect.top  - 100) + 'px';
        glow.style.left = (e.clientX - rect.left - 100) + 'px';
      }
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.transition = 'transform .4s ease';
    });
  });

  // ─── CIRCULAR FAVICON GENERATOR ───
  const faviconImg = new Image();
  faviconImg.src = 'assets/kaushal.png';
  faviconImg.onload = function() {
    const canvas = document.createElement('canvas');
    const size = 64;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    ctx.clip();
    
    // Maintain aspect ratio while drawing
    const minSide = Math.min(faviconImg.width, faviconImg.height);
    const sx = (faviconImg.width - minSide) / 2;
    const sy = (faviconImg.height - minSide) / 2;
    ctx.drawImage(faviconImg, sx, sy, minSide, minSide, 0, 0, size, size);
    
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL('image/png');
  };


  // ─── CYBER AUDIO SOUND ENGINE (Web Audio API) ───
  let audioCtx = null;
  let sfxEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(820, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'hover') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(540, now);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.07);
        osc.frequency.setValueAtTime(783.99, now + 0.14);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'open') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
        osc.start(now);
        osc.stop(now + 0.13);
      } else if (type === 'terminal') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(580, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        osc.start(now);
        osc.stop(now + 0.025);
      }
    } catch (err) {}
  }

  const sfxToggle = document.getElementById('sfx-toggle');
  if (sfxToggle) {
    sfxToggle.addEventListener('click', () => {
      initAudio();
      sfxEnabled = !sfxEnabled;
      sfxToggle.classList.toggle('sfx-active', sfxEnabled);
      const icon = sfxToggle.querySelector('.sfx-icon');
      const label = sfxToggle.querySelector('.sfx-label');
      if (icon) icon.textContent = sfxEnabled ? '🔊' : '🔈';
      if (label) label.textContent = sfxEnabled ? 'SFX: ON' : 'SFX';
      if (sfxEnabled) playSound('success');
      showToast(sfxEnabled ? '🔊 Interactive Cyber SFX Enabled' : '🔈 SFX Audio Muted');
    });
  }

  // ─── TOAST NOTIFICATION ───
  const toastEl = document.getElementById('toast');
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  }

  // Auto Copy for Contact Links (phone & email)
  document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"], .hero-contact-item, .contact-card').forEach(el => {
    el.addEventListener('click', (e) => {
      const href = el.getAttribute('href');
      let text = '';
      if (href && (href.startsWith('mailto:') || href.startsWith('tel:'))) {
        text = href.replace(/^(mailto:|tel:)/, '');
      } else {
        const valEl = el.querySelector('.cc-val') || el.querySelector('span:last-child');
        text = valEl ? valEl.textContent.trim() : el.textContent.trim();
      }
      if (text && !text.includes('github') && !text.includes('linkedin') && navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          playSound('success');
          showToast('✓ Copied "' + text + '" to clipboard!');
        }).catch(() => {});
      }
    });
  });

  // ─── PROJECT FILTER TABS ───
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectRows = document.querySelectorAll('.proj-row');

  filterTabs.forEach(tab => {
    tab.addEventListener('mouseenter', () => playSound('hover'));
    tab.addEventListener('click', () => {
      playSound('click');
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;

      projectRows.forEach(row => {
        row.classList.remove('filter-anim-in', 'skill-highlighted');
        const cat = row.dataset.category;
        if (filter === 'all' || cat === filter) {
          row.classList.remove('filtered-out');
          row.classList.add('filter-anim-in');
        } else {
          row.classList.add('filtered-out');
        }
      });
    });
  });

  // ─── SKILL TAGS CLICK TO FILTER PROJECTS ───
  document.querySelectorAll('.skill-tags .tag').forEach(tag => {
    tag.style.cursor = 'pointer';
    tag.setAttribute('title', 'Click to find projects using ' + tag.textContent);
    tag.addEventListener('mouseenter', () => playSound('hover'));
    tag.addEventListener('click', (e) => {
      e.stopPropagation();
      playSound('click');
      const skillName = tag.textContent.trim().toLowerCase();

      const allTab = document.querySelector('.filter-tab[data-filter="all"]');
      if (allTab) {
        filterTabs.forEach(t => t.classList.remove('active'));
        allTab.classList.add('active');
      }

      let matchCount = 0;
      projectRows.forEach(row => {
        row.classList.remove('filtered-out', 'skill-highlighted');
        const stackText = row.querySelector('.proj-stack')?.textContent.toLowerCase() || '';
        const bodyText = row.querySelector('.proj-body')?.textContent.toLowerCase() || '';
        if (stackText.includes(skillName) || bodyText.includes(skillName)) {
          row.classList.add('skill-highlighted');
          matchCount++;
        }
      });

      const projectsSec = document.getElementById('projects');
      if (projectsSec) projectsSec.scrollIntoView({ behavior: 'smooth' });
      showToast('Found ' + matchCount + ' project(s) matching "' + tag.textContent + '"');
    });
  });

  // ─── PROJECT ARCHITECTURE DETAIL MODAL ───
  const projectDetails = {
    viana360: {
      category: 'iOS & iPadOS · Institutional · Live',
      title: 'Viana 360 — Monitoring & Visualization',
      status: '● Live on App Store',
      desc: 'A comprehensive institutional application designed for real-time monitoring and advanced data visualization across iPhone and iPad platforms. Features high-throughput telemetry streams, role-based dashboards, and interactive analytics charts.',
      arch: 'Clean MVVM Architecture · Combine Reactive State Management · Adaptive iPadOS SplitView · Real-time REST Data Ingestion',
      qa: 'Selenium & Appium automated UI flows · High-load endpoint latency benchmarking · Network fault tolerance validation',
      stack: ['SwiftUI', 'UIKit', 'Combine', 'Swift Charts', 'REST APIs', 'iPadOS', 'TestFlight'],
      url: 'https://apps.apple.com/in/app/viana-360/id6760163659',
      btnText: 'View on App Store ↗'
    },
    ulcer: {
      category: 'iOS · Medical AI · Core ML · Live',
      title: 'Smart Ulcer Predictor — AI Clinical Vision',
      status: '● Live on App Store',
      desc: 'An AI-powered clinical decision-support mobile application employing deep learning computer vision on-device. Evaluates skin ulcer image patterns to predict healing classification (Healing, Not Healing, Normal Skin) with sub-second inference and zero cloud latency.',
      arch: 'On-device Apple Neural Engine (ANE) Inference · Core ML Model Quantization · Vision Framework Pre-processing · HIPAA-conscious Local Pipeline',
      qa: 'Confusion matrix & model accuracy benchmarking · Memory leak validation during image capture · Extreme lighting tolerance tests',
      stack: ['Core ML', 'Vision Framework', 'SwiftUI', 'Deep Learning', 'Convolutional Nets', 'Camera Capture'],
      url: 'https://apps.apple.com/in/app/smart-ulcer-predictor/id6755873140',
      btnText: 'View on App Store ↗'
    },
    breathtrack: {
      category: 'iOS · MedTech · Vitals & Telehealth · Live',
      title: 'BreathTrack — COPD Care & Remote Monitoring',
      status: '● Live on App Store',
      desc: 'A collaborative respiratory telehealth platform bridging pulmonary patients with clinical teams. Features real-time tracking for peripheral capillary oxygen saturation (SpO2), forced vital capacity (FVC), inhaler dose reminders, and clinician ABG diagnostic reviews.',
      arch: 'Apple HealthKit Background Delivery · Secure REST Telehealth Integration · Interactive Vital Trend Graphing · Push Notification Dispatcher',
      qa: 'Background HealthKit query battery impact testing · Clinician dashboard Selenium verification · Security penetration audits',
      stack: ['SwiftUI', 'HealthKit', 'Combine', 'REST APIs', 'Interactive Charts', 'Local Notifications'],
      url: 'https://apps.apple.com/in/app/breathtrack/id6804558579',
      btnText: 'View on App Store ↗'
    },
    corecare: {
      category: 'iOS · Digital Health · Wellness · Live',
      title: 'CoreCare — All-in-One Wellness Companion',
      status: '● Live on App Store',
      desc: 'A holistic wellness management platform engineered to streamline daily health routines. Consolidates nutrition logging, hydration pacing, daily habit loops, mood tracking, and vital biometric indicators into an intuitive Apple HIG interface.',
      arch: 'Offline-First Core Data Persistence · Combine Reactive Binding · Modular Micro-Feature Architecture · Dark Mode HIG Design',
      qa: 'Core Data schema migration testing · Automated regression test suites · Memory footprint profiling under continuous session loops',
      stack: ['SwiftUI', 'Combine', 'Core Data', 'Health Analytics', 'Apple HIG', 'Swift 5'],
      url: 'https://apps.apple.com/in/app/corecare/id6753789920',
      btnText: 'View on App Store ↗'
    },
    hairjourney: {
      category: 'iOS · Health & Lifestyle · PhotosUI · Live',
      title: 'HairJourneyTracker — Visual Growth Companion',
      status: '● Live on App Store',
      desc: 'A visual regimen companion allowing users to record high-resolution photographic milestones, analyze hair growth trends over time, evaluate treatment efficacy, and receive scheduled regimen notifications.',
      arch: 'PhotosUI Modern Photo Picker · Asynchronous Image Compression Pipeline · Local Core Data Photo Cache · UserNotifications Framework',
      qa: 'High-res image memory spike profiling · Scheduled notifications background delivery testing · UI rendering smoothness tests',
      stack: ['SwiftUI', 'PhotosUI', 'Core Data', 'UserNotifications', 'Combine', 'Image Processing'],
      url: 'https://apps.apple.com/in/app/hairjourneytracker/id6760697820',
      btnText: 'View on App Store ↗'
    },
    schoolbus: {
      category: 'iOS · Safety & Location · Core Location',
      title: 'School Bus Child Tracking System',
      status: '● Production Tested',
      desc: 'A dual-application safety ecosystem composed of dedicated Parent and Bus Driver applications. Features live bus location streaming on Apple Maps, automated geofence boundary alerts, and electronic student boarding attendance.',
      arch: 'MapKit & Core Location Sub-meter Accuracy · Firebase Realtime DB Location Telemetry · Geofence Region Monitoring · Dual App Architecture',
      qa: 'Simulated moving GPS route stress tests · Reconnection resilience on cell signal loss · High-frequency location battery optimization',
      stack: ['Swift', 'MapKit', 'Core Location', 'Firebase', 'Geofencing', 'Push Notifications'],
      url: '#contact',
      btnText: 'Inquire Architecture Details ↗'
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openProjectModal(id) {
    const data = projectDetails[id];
    if (!data || !projectModal) return;

    const catEl = document.getElementById('modalCategory');
    const titleEl = document.getElementById('modalTitle');
    const statusEl = document.getElementById('modalStatusBadge');
    const descEl = document.getElementById('modalDesc');
    const archEl = document.getElementById('modalArch');
    const qaEl = document.getElementById('modalQA');

    if (catEl) catEl.textContent = data.category;
    if (titleEl) titleEl.textContent = data.title;
    if (statusEl) statusEl.textContent = data.status;
    if (descEl) descEl.textContent = data.desc;
    if (archEl) archEl.textContent = data.arch;
    if (qaEl) qaEl.textContent = data.qa;

    const stackContainer = document.getElementById('modalStackTags');
    if (stackContainer) {
      stackContainer.innerHTML = '';
      data.stack.forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'proj-tag';
        tag.textContent = tech;
        stackContainer.appendChild(tag);
      });
    }

    const actionBtn = document.getElementById('modalActionBtn');
    if (actionBtn) {
      actionBtn.href = data.url;
      const span = actionBtn.querySelector('span');
      if (span) span.textContent = data.btnText;
    }

    projectModal.classList.add('active');
    playSound('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    playSound('click');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeTerminal();
    }
  });

  projectRows.forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('.proj-live-link')) return;
      const pid = row.dataset.projectId;
      if (pid) openProjectModal(pid);
    });
  });

  // ─── INTERACTIVE DEVELOPER CONSOLE ───
  const terminalDrawer = document.getElementById('dev-terminal-drawer');
  const terminalTriggerBtn = document.getElementById('terminal-trigger-btn');
  const terminalCloseBtn = document.getElementById('terminal-close-btn');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');

  let commandHistory = [];
  let historyIndex = -1;

  function toggleTerminal() {
    if (!terminalDrawer) return;
    const isHidden = terminalDrawer.classList.contains('hidden');
    if (isHidden) {
      terminalDrawer.classList.remove('hidden');
      terminalInput?.focus();
      playSound('open');
    } else {
      closeTerminal();
    }
  }

  function closeTerminal() {
    if (terminalDrawer) {
      terminalDrawer.classList.add('hidden');
      playSound('click');
    }
  }

  if (terminalTriggerBtn) terminalTriggerBtn.addEventListener('click', toggleTerminal);
  if (terminalCloseBtn) terminalCloseBtn.addEventListener('click', closeTerminal);

  function printLine(text, className = '') {
    if (!terminalOutput) return;
    const div = document.createElement('div');
    div.className = 't-line ' + className;
    div.innerHTML = text;
    terminalOutput.appendChild(div);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    printLine('vishal@dev:~$ ' + cmdRaw, 'command-echo');
    playSound('terminal');

    if (!cmd) return;
    commandHistory.push(cmdRaw);
    historyIndex = commandHistory.length;

    switch (cmd) {
      case 'help':
        printLine('Available Commands:', 'cyan');
        printLine('  <span class="t-cyan">about</span>       - Bio, background & disciplines');
        printLine('  <span class="t-cyan">skills</span>      - Categorized technical stack');
        printLine('  <span class="t-cyan">projects</span>    - List all 6 projects with live links');
        printLine('  <span class="t-cyan">experience</span>  - SIMATS, Viana Soft, Greatify history');
        printLine('  <span class="t-cyan">contact</span>     - Email, phone, location & profiles');
        printLine('  <span class="t-cyan">resume</span>      - Open official PDF resume');
        printLine('  <span class="t-cyan">matrix</span>      - Trigger digital rain Easter egg');
        printLine('  <span class="t-cyan">sudo hire</span>   - Fast track hiring dispatch');
        printLine('  <span class="t-cyan">clear</span>       - Clear console screen');
        break;

      case 'about':
        printLine('<strong>Vishal Rao M</strong> — iOS Developer & Technical Engineer', 'green');
        printLine('• Specialized in SwiftUI, UIKit, Combine, Core ML, and Apple HIG.');
        printLine('• Expert in multi-platform testing across 4 disciplines: Selenium, Appium, Load Testing, and Vulnerability Testing.');
        printLine('• Education: B.Tech in Artificial Intelligence & Data Science.');
        break;

      case 'skills':
        printLine('⚡ Core Technical Arsenal:', 'cyan');
        printLine('• <strong>Mobile:</strong> Swift, SwiftUI, UIKit, Combine, Core ML, HealthKit, PhotosUI, MapKit');
        printLine('• <strong>QA & Automation:</strong> Selenium, Appium, Postman, Load Testing, Vulnerability Testing');
        printLine('• <strong>Backend & DB:</strong> Core Data, MySQL, PHP, ROOM Database, REST APIs');
        printLine('• <strong>Design & Tools:</strong> Figma, Canva, Blender, Xcode, Git');
        break;

      case 'projects':
        printLine('🚀 Featured Production Projects:', 'cyan');
        printLine('1. <strong>Viana 360</strong> (Live on App Store) — Monitoring & Data Visualization');
        printLine('2. <strong>Smart Ulcer Predictor</strong> (Live on App Store) — Medical AI & Clinical Vision');
        printLine('3. <strong>BreathTrack</strong> (Live on App Store) — COPD Telehealth & HealthKit Vitals');
        printLine('4. <strong>CoreCare</strong> (Live on App Store) — Lifestyle, Nutrition & Core Data Companion');
        printLine('5. <strong>HairJourneyTracker</strong> (Live on App Store) — Visual Growth & PhotosUI Regimen');
        printLine('6. <strong>School Bus Child Tracking</strong> — Dual-App MapKit & Geofencing Ecosystem');
        printLine('💡 Type project name or click cards on the main page to inspect architecture.', 'dim');
        break;

      case 'experience':
        printLine('💼 Career Milestones:', 'yellow');
        printLine('• <strong>2026 – Present:</strong> iOS Dev & Technical Trainer @ SIMATS Engineering');
        printLine('• <strong>2025:</strong> Technical Engineer (QA & Backend) @ Viana Soft');
        printLine('• <strong>2024:</strong> Technical Engineer @ Greatify');
        break;

      case 'contact':
        printLine('📬 Direct Coordinates:', 'cyan');
        printLine('• Phone: <a href="tel:+916382190388" class="t-cyan">+91 63821 90388</a>');
        printLine('• Email: <a href="mailto:vishalrao5432@gmail.com" class="t-cyan">vishalrao5432@gmail.com</a>');
        printLine('• GitHub: <a href="https://github.com/vishal-rao28" target="_blank" class="t-cyan">github.com/vishal-rao28</a>');
        printLine('• LinkedIn: <a href="https://linkedin.com/in/vishal-rao-173a232b9" target="_blank" class="t-cyan">vishal-rao</a>');
        printLine('• Location: Chennai, Tamil Nadu, India');
        break;

      case 'resume':
        printLine('Opening official PDF resume in new tab...', 'green');
        window.open('Vishal_Rao_UDI.pdf', '_blank');
        break;

      case 'clear':
        if (terminalOutput) terminalOutput.innerHTML = '';
        break;

      case 'matrix':
        printLine('Initializing Matrix digital stream...', 'green');
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            const glyphs = '01010110 01001001 01010011 01001000 01000001 01001100';
            printLine(glyphs.split('').sort(() => 0.5 - Math.random()).join(''), 'green');
          }, i * 120);
        }
        break;

      case 'sudo hire':
      case 'hire':
        printLine('⭐ INITIATING CANDIDATE ENGAGEMENT PROTOCOL...', 'yellow');
        printLine('Redirecting to mail client for priority dispatch...', 'green');
        setTimeout(() => {
          window.location.href = 'mailto:vishalrao5432@gmail.com?subject=Opportunity%20Discussion%20with%20Vishal%20Rao';
        }, 800);
        break;

      default:
        printLine("Command not recognized: '" + cmdRaw + "'. Type <span class=\"t-cyan\">'help'</span> for list of commands.", 'dim');
        break;
    }
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        terminalInput.value = '';
        handleCommand(val);
      } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex] || '';
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = '';
        }
      }
    });
  }

  document.querySelectorAll('.t-sug-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      if (cmd) handleCommand(cmd);
    });
  });

  // ─── CIRCULAR SCROLL PROGRESS & BACK TO TOP ───
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  const progressCircle = document.querySelector('.progress-ring-circle');
  const circleCircumference = 2 * Math.PI * 18;

  if (progressCircle) {
    progressCircle.style.strokeDasharray = circleCircumference + ' ' + circleCircumference;
    progressCircle.style.strokeDashoffset = circleCircumference;
  }

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollY / (docHeight || 1), 0), 1);

    if (progressCircle) {
      const offset = circleCircumference - (progress * circleCircumference);
      progressCircle.style.strokeDashoffset = offset;
    }

    if (scrollTopBtn) {
      if (scrollY > 300) scrollTopBtn.classList.add('visible');
      else scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      playSound('click');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ─── ATMOSPHERIC THEME SWITCHER ───
  const themeChips = document.querySelectorAll('.palette-chip');
  function setTheme(themeName, playSfx = true) {
    document.body.dataset.theme = themeName;
    themeChips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.theme === themeName);
    });
    localStorage.setItem('vrm_portfolio_theme', themeName);
    if (playSfx) {
      playSound('success');
      const names = { cyan: 'Cosmic Cyan', violet: 'Cyber Violet', emerald: 'Aurora Emerald' };
      showToast('Atmosphere: ' + (names[themeName] || themeName) + ' Active');
    }
  }

  themeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const theme = chip.dataset.theme;
      if (theme) setTheme(theme, true);
    });
  });

  // Restore saved theme preference
  const savedTheme = localStorage.getItem('vrm_portfolio_theme');
  if (savedTheme && ['cyan', 'violet', 'emerald'].includes(savedTheme)) {
    setTheme(savedTheme, false);
  }

  // ─── TIMELINE FILTER TABS ───
  const tlFilterTabs = document.querySelectorAll('.tl-filter-tab');
  const tlItems = document.querySelectorAll('.tl-item');

  tlFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playSound('click');
      tlFilterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.tlFilter;

      tlItems.forEach(item => {
        const cat = item.dataset.tlCategory;
        if (filter === 'all' || cat === filter) {
          item.classList.remove('filtered-out');
        } else {
          item.classList.add('filtered-out');
        }
      });
    });
  });

  // ─── TIMELINE DELIVERABLES & IMPACT EXPANDER ───
  document.querySelectorAll('.tl-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.tl-item');
      if (!parent) return;
      const drawer = parent.querySelector('.tl-impact-drawer');
      const icon = btn.querySelector('.tl-expand-icon');
      const text = btn.querySelector('.tl-expand-text');
      if (!drawer) return;

      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        drawer.classList.remove('open');
        btn.classList.remove('expanded');
        if (text) text.textContent = 'Key Deliverables & Impact Metrics';
        playSound('click');
      } else {
        drawer.classList.add('open');
        btn.classList.add('expanded');
        if (text) text.textContent = 'Hide Impact Metrics';
        playSound('open');
      }
    });
  });

  // ─── MODAL SUB-TABS INTERACTION ───
  const modalTabBtns = document.querySelectorAll('.modal-tab-btn');
  const modalPanes = {
    overview: document.getElementById('paneOverview'),
    architecture: document.getElementById('paneArchitecture'),
    testing: document.getElementById('paneTesting')
  };

  modalTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      modalTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.modaltab;

      Object.keys(modalPanes).forEach(paneKey => {
        const pane = modalPanes[paneKey];
        if (pane) {
          pane.classList.toggle('active', paneKey === target);
        }
      });
    });
  });

  // Extended project specs with architecture flow & QA matrices
  const extendedProjectData = {
    viana360: {
      flow: ['SwiftUI Views', 'Combine Event Streams', 'REST API Client', 'iPadOS Split Controllers', 'Swift Charts Rendering'],
      tests: ['Appium Cross-Device Flow', 'Postman Automated Collections', 'High-Throughput Load Benchmarks', 'Session Persistence Tests']
    },
    ulcer: {
      flow: ['AVFoundation Camera Capture', 'Vision Preprocessing & Crop', 'Core ML Quantized Model', 'Confidence Scorer', 'Prediction UI'],
      tests: ['Confusion Matrix Validation', 'Apple Neural Engine Latency Profiling', 'Low-Light Exposure Tests', 'Memory Leaks Auditing']
    },
    breathtrack: {
      flow: ['HealthKit SpO2/FVC Stream', 'Local Sync Engine', 'Clinician REST Telehealth Portal', 'Notification Scheduler'],
      tests: ['Background HealthKit Query Stress', 'Clinician Portal Selenium Regression', 'HIPAA Privacy Encryption Audit']
    },
    corecare: {
      flow: ['User HIG Inputs', 'Combine Reactive State', 'Core Data SQLite Sync', 'Local Notification Queue'],
      tests: ['Core Data Migration Regression', 'Continuous Loop Memory Profiling', 'Dark Mode Contrast Conformance']
    },
    hairjourney: {
      flow: ['PhotosUI Image Picker', 'Async Compression Pipeline', 'Local Cache Store', 'Milestone Growth Algorithm'],
      tests: ['Large Asset Memory Spike Testing', 'Local Push Notification Delivery Audit', 'Smooth 60FPS Scroll Benchmarks']
    },
    schoolbus: {
      flow: ['Core Location GPS', 'MapKit Real-time Overlay', 'Firebase Realtime Node', 'Geofence Region Monitor'],
      tests: ['Simulated Moving Route Resilience', 'Cellular Signal Reconnect Recovery', 'Background Battery Optimization']
    }
  };

  // Enhance openProjectModal to populate tabs and flow chips
  const originalOpenProjectModal = window.openProjectModal || openProjectModal;
  window.openProjectModal = function(id) {
    if (typeof originalOpenProjectModal === 'function') {
      originalOpenProjectModal(id);
    }
    // Reset to Overview tab on open
    modalTabBtns.forEach(b => b.classList.toggle('active', b.dataset.modaltab === 'overview'));
    Object.keys(modalPanes).forEach(paneKey => {
      const pane = modalPanes[paneKey];
      if (pane) pane.classList.toggle('active', paneKey === 'overview');
    });

    const ext = extendedProjectData[id];
    const archFlowContainer = document.getElementById('modalArchFlow');
    const testBadgesContainer = document.getElementById('modalTestBadges');

    if (archFlowContainer && ext) {
      archFlowContainer.innerHTML = '';
      ext.flow.forEach((step, idx) => {
        const chip = document.createElement('div');
        chip.className = 'flow-step-chip';
        chip.innerHTML = step + (idx < ext.flow.length - 1 ? ' <span class="arrow">→</span>' : '');
        archFlowContainer.appendChild(chip);
      });
    }

    if (testBadgesContainer && ext) {
      testBadgesContainer.innerHTML = '';
      ext.tests.forEach(test => {
        const chip = document.createElement('div');
        chip.className = 'flow-step-chip';
        chip.innerHTML = '🧪 ' + test;
        testBadgesContainer.appendChild(chip);
      });
    }
  };

  // Re-bind project row clicks to enhanced modal opener
  projectRows.forEach(row => {
    row.onclick = (e) => {
      if (e.target.closest('.proj-live-link')) return;
      const pid = row.dataset.projectId;
      if (pid) window.openProjectModal(pid);
    };
  });

  // ─── QUICK INQUIRE MESSAGE COMPOSER ───
  let selectedTopic = 'iOS App Development';
  const topicChips = document.querySelectorAll('.topic-chip');
  topicChips.forEach(chip => {
    chip.addEventListener('click', () => {
      playSound('click');
      topicChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedTopic = chip.dataset.topic || 'General Inquiry';
    });
  });

  const sendInquireBtn = document.getElementById('sendInquireBtn');
  const copyDraftBtn = document.getElementById('copyDraftBtn');
  const inquireName = document.getElementById('inquireName');
  const inquireNote = document.getElementById('inquireNote');

  function buildMessage() {
    const sender = (inquireName?.value || '').trim() || 'Prospective Partner';
    const note = (inquireNote?.value || '').trim() || 'I came across your portfolio and would like to discuss an opportunity regarding ' + selectedTopic + '.';
    const subject = encodeURIComponent('Inquiry: ' + selectedTopic + ' — ' + sender);
    const body = encodeURIComponent(
      'Hi Vishal,\n\n' +
      note + '\n\n' +
      'Topic: ' + selectedTopic + '\n' +
      'From: ' + sender + '\n\n' +
      'Sent via Vishal Rao M Interactive Portfolio'
    );
    const plainText = 'Hi Vishal,\n\n' + note + '\n\nTopic: ' + selectedTopic + '\nFrom: ' + sender;
    return { subject, body, plainText };
  }

  if (sendInquireBtn) {
    sendInquireBtn.addEventListener('click', () => {
      playSound('open');
      const { subject, body } = buildMessage();
      window.location.href = 'mailto:vishalrao5432@gmail.com?subject=' + subject + '&body=' + body;
      showToast('Launching email client with pre-filled draft...');
    });
  }

  if (copyDraftBtn) {
    copyDraftBtn.addEventListener('click', () => {
      const { plainText } = buildMessage();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(plainText).then(() => {
          playSound('success');
          showToast('✓ Message draft copied to clipboard!');
        });
      }
    });
  }


  // ─── AVAILABILITY MODAL ───
  const availStatusPill = document.getElementById('availStatusPill');
  const hireModal = document.getElementById('hireModal');
  const hireModalCloseBtn = document.getElementById('hireModalCloseBtn');

  function openHireModal() {
    if (!hireModal) return;
    hireModal.classList.add('active');
    playSound('open');
    document.body.style.overflow = 'hidden';
  }

  function closeHireModal() {
    if (!hireModal) return;
    hireModal.classList.remove('active');
    playSound('click');
    document.body.style.overflow = '';
  }

  if (availStatusPill) availStatusPill.addEventListener('click', openHireModal);
  if (hireModalCloseBtn) hireModalCloseBtn.addEventListener('click', closeHireModal);
  if (hireModal) {
    hireModal.addEventListener('click', (e) => {
      if (e.target === hireModal) closeHireModal();
    });
  }

  // ─── SKILLS VIEW TOGGLE (CARDS vs PROFICIENCY MATRIX) ───
  const skillsViewBtns = document.querySelectorAll('[data-skills-view]');
  const skillsCardsView = document.getElementById('skillsCardsView');
  const skillsMatrixView = document.getElementById('skillsMatrixView');

  skillsViewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      skillsViewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.skillsView;

      if (view === 'cards') {
        if (skillsCardsView) skillsCardsView.style.display = 'grid';
        if (skillsMatrixView) skillsMatrixView.classList.remove('active');
      } else {
        if (skillsCardsView) skillsCardsView.style.display = 'none';
        if (skillsMatrixView) skillsMatrixView.classList.add('active');
      }
    });
  });

  // ─── LIVE CODE INSPECTOR PLAYGROUND ───
  const codeSnippets = {
    swiftui: `// Clean MVVM + Combine Reactive Pipeline
<span class="code-keyword">import</span> <span class="code-type">SwiftUI</span>
<span class="code-keyword">import</span> <span class="code-type">Combine</span>

<span class="code-keyword">final class</span> <span class="code-type">TelemetryViewModel</span>: <span class="code-type">ObservableObject</span> {
    @<span class="code-type">Published</span> <span class="code-keyword">private(set) var</span> streamMetrics: [<span class="code-type">MetricNode</span>] = []
    @<span class="code-type">Published</span> <span class="code-keyword">private(set) var</span> isConnected: <span class="code-type">Bool</span> = <span class="code-keyword">false</span>
    <span class="code-keyword">private var</span> cancellables = <span class="code-type">Set</span>&lt;<span class="code-type">AnyCancellable</span>&gt;()

    <span class="code-keyword">func</span> <span class="code-func">subscribeToTelemetry</span>() {
        <span class="code-type">NetworkService</span>.shared.telemetryPublisher()
            .receive(on: <span class="code-type">DispatchQueue</span>.main)
            .sink(receiveCompletion: { completion <span class="code-keyword">in</span>
                <span class="code-keyword">if case</span> .failure(let err) = completion {
                    <span class="code-func">print</span>(<span class="code-str">"Stream fault: \(err)"</span>)
                }
            }, receiveValue: { [weak self] nodes <span class="code-keyword">in</span>
                self?.streamMetrics = nodes
                self?.isConnected = <span class="code-keyword">true</span>
            })
            .store(in: &cancellables)
    }
}`,
    coreml: `// Core ML Vision Pipeline on Apple Neural Engine (ANE)
<span class="code-keyword">import</span> <span class="code-type">CoreML</span>
<span class="code-keyword">import</span> <span class="code-type">Vision</span>

<span class="code-keyword">final class</span> <span class="code-type">ClinicalVisionClassifier</span> {
    <span class="code-keyword">private var</span> request: <span class="code-type">VNCoreMLRequest</span>?

    <span class="code-keyword">init</span>() {
        <span class="code-keyword">guard let</span> model = <span class="code-keyword">try</span>? <span class="code-type">VNCoreMLModel</span>(for: <span class="code-type">SmartUlcerModel</span>().model) <span class="code-keyword">else</span> { <span class="code-keyword">return</span> }
        request = <span class="code-type">VNCoreMLRequest</span>(model: model) { [weak self] req, _ <span class="code-keyword">in</span>
            <span class="code-keyword">guard let</span> results = req.results <span class="code-keyword">as</span>? [<span class="code-type">VNClassificationObservation</span>],
                  <span class="code-keyword">let</span> top = results.first <span class="code-keyword">else</span> { <span class="code-keyword">return</span> }
            <span class="code-comment">// Sub-second prediction on ANE</span>
            <span class="code-func">print</span>(<span class="code-str">"Label: \(top.identifier) | Confidence: \(top.confidence * 100)%"</span>)
        }
    }
}`,
    qa: `// Appium Automated UI & Latency Assertion Flow
<span class="code-keyword">const</span> { remote } = <span class="code-keyword">require</span>(<span class="code-str">'webdriverio'</span>);

<span class="code-keyword">async function</span> <span class="code-func">runAppiumSuite</span>() {
    <span class="code-keyword">const</span> driver = <span class="code-keyword">await</span> remote({
        capabilities: {
            platformName: <span class="code-str">'iOS'</span>,
            automationName: <span class="code-str">'XCUITest'</span>,
            bundleId: <span class="code-str">'com.vianasft.viana360'</span>,
            noReset: <span class="code-keyword">true</span>
        }
    });

    <span class="code-comment">// Verify telemetry stream latency</span>
    <span class="code-keyword">const</span> chartCard = <span class="code-keyword">await</span> driver.$(<span class="code-str">'~telemetryChart'</span>);
    <span class="code-keyword">await</span> chartCard.waitForDisplayed({ timeout: <span class="code-str">3000</span> });
    <span class="code-func">expect</span>(<span class="code-keyword">await</span> chartCard.isDisplayed()).toBe(<span class="code-keyword">true</span>);
    <span class="code-keyword">await</span> driver.deleteSession();
}`
  };

  const codeSnippetDisplay = document.getElementById('codeSnippetDisplay');
  const inspectorTabBtns = document.querySelectorAll('.inspector-tab-btn');
  const copyCodeSnippetBtn = document.getElementById('copyCodeSnippetBtn');
  let currentSnippetKey = 'swiftui';

  function displaySnippet(key) {
    if (!codeSnippetDisplay) return;
    currentSnippetKey = key;
    codeSnippetDisplay.innerHTML = codeSnippets[key] || '';
  }
  displaySnippet('swiftui');

  inspectorTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      inspectorTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const snippetKey = btn.dataset.snippet;
      if (snippetKey) displaySnippet(snippetKey);
    });
  });

  if (copyCodeSnippetBtn) {
    copyCodeSnippetBtn.addEventListener('click', () => {
      const plainText = codeSnippetDisplay ? codeSnippetDisplay.innerText : '';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(plainText).then(() => {
          playSound('success');
          showToast('✓ Swift / QA Code snippet copied!');
        });
      }
    });
  }

  // ─── PROJECTS VIEW TOGGLE (LIST vs IPHONE SIMULATOR) ───
  const projectsViewBtns = document.querySelectorAll('[data-projects-view]');
  const projectsList = document.querySelector('.projects-list');
  const projectFilterTabs = document.querySelector('.project-filter-tabs');
  const iphoneSimulatorContainer = document.getElementById('iphoneSimulatorContainer');

  projectsViewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      projectsViewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.projectsView;

      if (view === 'list') {
        if (projectsList) projectsList.style.display = 'flex';
        if (projectFilterTabs) projectFilterTabs.style.display = 'flex';
        if (iphoneSimulatorContainer) iphoneSimulatorContainer.classList.remove('active');
      } else {
        if (projectsList) projectsList.style.display = 'none';
        if (projectFilterTabs) projectFilterTabs.style.display = 'none';
        if (iphoneSimulatorContainer) iphoneSimulatorContainer.classList.add('active');
      }
    });
  });

  // ─── IPHONE SIMULATOR APP SWITCHER ───
  const simAppChips = document.querySelectorAll('.sim-app-chip');
  const simAppCards = document.querySelectorAll('.app-screen-card');

  simAppChips.forEach(chip => {
    chip.addEventListener('click', () => {
      playSound('click');
      simAppChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const appId = chip.dataset.simapp;

      simAppCards.forEach(card => {
        card.classList.toggle('active', card.id === 'sim-' + appId);
      });
    });
  });

  // Live status bar clock updater
  function updateSimClock() {
    const clockEl = document.getElementById('simClock');
    if (!clockEl) return;
    const now = new Date();
    let hours = now.getHours();
    let mins = now.getMinutes();
    clockEl.textContent = hours + ':' + (mins < 10 ? '0' + mins : mins);
  }
  updateSimClock();
  setInterval(updateSimClock, 30000);

  // Dynamic Island tap interaction
  const dynamicIsland = document.getElementById('dynamicIsland');
  if (dynamicIsland) {
    dynamicIsland.addEventListener('click', () => {
      playSound('success');
      showToast('Dynamic Island: iOS Simulation Engine Active');
    });
  }


  // ─── APP STORE QR CODE MODAL ───
  const qrAppStoreData = {
    viana360: {
      title: 'Viana 360',
      icon: '📊',
      url: 'https://apps.apple.com/in/app/viana-360/id6760163659',
      sub: 'Scan with your iPhone camera to download Viana 360 directly from the Apple App Store.'
    },
    ulcer: {
      title: 'Smart Ulcer Predictor',
      icon: '🔬',
      url: 'https://apps.apple.com/in/app/smart-ulcer-predictor/id6755873140',
      sub: 'Scan to experience clinical on-device deep learning on your iPhone.'
    },
    breathtrack: {
      title: 'BreathTrack',
      icon: '🫁',
      url: 'https://apps.apple.com/in/app/breathtrack/id6804558579',
      sub: 'Scan to install the COPD care and HealthKit telemetry app.'
    },
    corecare: {
      title: 'CoreCare',
      icon: '🌿',
      url: 'https://apps.apple.com/in/app/corecare/id6753789920',
      sub: 'Scan to download the holistic wellness and routine tracking companion.'
    },
    hairjourney: {
      title: 'HairJourneyTracker',
      icon: '✨',
      url: 'https://apps.apple.com/in/app/hairjourneytracker/id6760697820',
      sub: 'Scan to install the milestone photo growth tracker.'
    }
  };

  const qrModal = document.getElementById('qrModal');
  const qrModalCloseBtn = document.getElementById('qrModalCloseBtn');
  const qrAppIcon = document.getElementById('qrAppIcon');
  const qrAppTitle = document.getElementById('qrAppTitle');
  const qrAppSubtitle = document.getElementById('qrAppSubtitle');
  const qrAppStoreLink = document.getElementById('qrAppStoreLink');

  function openQrModal(appId) {
    const data = qrAppStoreData[appId];
    if (!data || !qrModal) return;

    if (qrAppIcon) qrAppIcon.textContent = data.icon;
    if (qrAppTitle) qrAppTitle.textContent = data.title;
    if (qrAppSubtitle) qrAppSubtitle.textContent = data.sub;
    if (qrAppStoreLink) qrAppStoreLink.href = data.url;

    qrModal.classList.add('active');
    playSound('open');
    document.body.style.overflow = 'hidden';
  }

  function closeQrModal() {
    if (!qrModal) return;
    qrModal.classList.remove('active');
    playSound('click');
    document.body.style.overflow = '';
  }

  if (qrModalCloseBtn) qrModalCloseBtn.addEventListener('click', closeQrModal);
  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) closeQrModal();
    });
  }

  document.querySelectorAll('[data-qr-app]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const appId = btn.dataset.qrApp;
      if (appId) openQrModal(appId);
    });
  });

  // Highlight iOS layer cards on hover with sound
  document.querySelectorAll('.ios-layer-card').forEach(card => {
    card.addEventListener('mouseenter', () => playSound('hover'));
  });

})();
