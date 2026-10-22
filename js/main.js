/* ═══════════════════════════════════════════════════════
   MAIN.JS — Cursor, Reveal, Counter, Tilt, Nav
   ═══════════════════════════════════════════════════════ */

(function() {

  // ─── CUSTOM CURSOR ───
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');
  let cx = 0, cy = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => { 
    cx = e.clientX; 
    cy = e.clientY; 
    document.documentElement.style.setProperty('--mouse-x', cx + 'px');
    document.documentElement.style.setProperty('--mouse-y', cy + 'px');
  });

  function updateCursor() {
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    tx += (cx - tx) * 0.1;
    ty += (cy - ty) * 0.1;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  document.querySelectorAll('a, button, .proj-row, .skill-card, .stat-card, .contact-card, .close-btn, .tl-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // ─── CARD SPOTLIGHT GRADIENT TRACKING ───
  document.querySelectorAll('.skill-card, .proj-row, .tl-item, .stat-card, .contact-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--card-mouse-x', `${x}px`);
      card.style.setProperty('--card-mouse-y', `${y}px`);
    });
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

  // ─── AUDIO SYNTHESIZER FEEDBACK ───
  let audioEnabled = false;
  let audioCtx = null;

  function playUiClick(freq = 640, type = 'sine') {
    if (!audioEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.025, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  const soundBtn = document.getElementById('soundToggleBtn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      soundBtn.classList.toggle('sound-on', audioEnabled);
      soundBtn.querySelector('.sound-icon').textContent = audioEnabled ? '🔊' : '🔈';
      if (audioEnabled) playUiClick(880);
    });
  }

  // ─── SCROLL TELEMETRY & SCROLLSPY ───
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scroll-progress-bar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    // 1. Progress Bar
    if (progressBar) {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
    }

    // 2. Navbar Scrolled
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // 3. Scrollspy active link
    const scrollPos = window.scrollY + 200;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });

  // ─── PROJECT ROW HOVER & INTERACTION ───
  document.querySelectorAll('.proj-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.style.transition = 'all .4s';
    });
    row.addEventListener('click', () => {
      playUiClick(580);
    });
  });

  // ─── INTERACTIVE PROJECT FILTER TABS ───
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectRows = document.querySelectorAll('.proj-row');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playUiClick(720);
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');

      projectRows.forEach(row => {
        const cat = row.getAttribute('data-category') || '';
        if (filterVal === 'all' || cat.includes(filterVal)) {
          row.style.display = 'grid';
          setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          row.style.opacity = '0';
          row.style.transform = 'translateY(12px) scale(0.98)';
          setTimeout(() => {
            row.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ─── INTERACTIVE THEME CONTROLLER DOCK ───
  const themeBtns = document.querySelectorAll('[data-set-theme]');
  const currentSavedTheme = localStorage.getItem('portfolio_theme') || 'cyber';

  function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('portfolio_theme', themeName);
    themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-set-theme') === themeName);
    });
    if (typeof window.setThreeTheme === 'function') {
      window.setThreeTheme(themeName);
    }
  }

  // Set initial theme
  applyTheme(currentSavedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playUiClick(940);
      const chosenTheme = btn.getAttribute('data-set-theme');
      applyTheme(chosenTheme);
    });
  });

  // ─── MAGNETIC BUTTONS ───
  document.querySelectorAll('.btn-primary, .btn-ghost, .theme-btn, .filter-tab').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      this.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.transition = 'transform .4s ease';
    });
    btn.addEventListener('click', () => {
      playUiClick(800);
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
  faviconImg.src = 'assets/vishal_optimized.jpg';
  faviconImg.onload = function() {
    const canvas = document.createElement('canvas');
    const size = 64;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    ctx.clip();
    
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

})();
