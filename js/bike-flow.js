/* ═══════════════════════════════════════════════════════
   BIKE-FLOW.JS — Roadmap with Focused Reports
   ═══════════════════════════════════════════════════════ */

class BikeFlow {
  constructor() {
    this.overlay = document.getElementById('project-flow-overlay');
    this.container = document.querySelector('.flow-path-container');
    this.path = document.getElementById('bike-path');
    this.content = document.getElementById('flow-content');
    this.closeBtn = document.getElementById('close-flow-btn');
    
    this.isActive = false;
    this.pathLength = 0;
    
    this.init();
  }

  init() {
    if (this.path) {
      this.pathLength = this.path.getTotalLength();
    }

    this.closeBtn.addEventListener('click', () => this.close());
    
    this.container.addEventListener('scroll', () => {
      requestAnimationFrame(() => this.update());
    });
    
    document.querySelectorAll('.proj-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        const title = row.querySelector('.proj-title').textContent;
        if (title.includes('Viana 360')) {
          this.open('viana360');
        } else if (title.includes('Smart Ulcer')) {
          this.open('ulcer');
        } else if (title.includes('BreathTrack')) {
          this.open('breathtrack');
        } else if (title.includes('CoreCare')) {
          this.open('corecare');
        } else if (title.includes('HairJourney')) {
          this.open('hairjourney');
        } else if (title.includes('School Bus')) {
          this.open('schoolbus');
        } else {
          this.open('general');
        }
      });
    });

    window.addEventListener('resize', () => {
      if (this.isActive) {
        this.pathLength = this.path.getTotalLength();
        this.repositionItems();
        this.update();
      }
    });
  }

  createCardSvg(title, category, color = '#00ffff') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="600" viewBox="0 0 460 600">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0e1322"/>
          <stop offset="100%" stop-color="#05070e"/>
        </linearGradient>
        <linearGradient id="line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      <rect width="460" height="600" rx="16" fill="url(#bg)"/>
      <rect x="2" y="2" width="456" height="596" rx="14" fill="none" stroke="${color}" stroke-opacity="0.25" stroke-width="2"/>
      <circle cx="230" cy="220" r="110" fill="${color}" fill-opacity="0.04"/>
      <circle cx="230" cy="220" r="70" fill="${color}" fill-opacity="0.08"/>
      <circle cx="230" cy="220" r="35" fill="${color}" fill-opacity="0.15"/>
      <rect x="40" y="44" width="100" height="3" rx="1.5" fill="url(#line)"/>
      <text x="40" y="80" fill="${color}" font-family="-apple-system, BlinkMacSystemFont, 'Space Mono', monospace" font-size="12" letter-spacing="3" text-transform="uppercase">${category}</text>
      <text x="40" y="460" fill="#ffffff" font-family="'Playfair Display', Georgia, serif" font-size="28" font-weight="700">${title}</text>
      <text x="40" y="495" fill="rgba(255,255,255,0.4)" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" letter-spacing="1">APPLE ECOSYSTEM ENGINEERING</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  open(projectId) {
    this.isActive = true;
    this.overlay.classList.add('active');
    this.overlay.classList.remove('hidden');
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    this.container.scrollTop = 0;
    
    if (!this.container.querySelector('.flow-path-inner')) {
      const spacer = document.createElement('div');
      spacer.className = 'flow-path-inner';
      this.container.appendChild(spacer);
    }
    
    this.loadContent(projectId);
    
    setTimeout(() => {
      this.pathLength = this.path.getTotalLength();
      this.repositionItems();
      this.update();
    }, 100);
  }

  close() {
    this.isActive = false;
    this.overlay.classList.remove('active');
    setTimeout(() => {
      this.overlay.classList.add('hidden');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }, 800);
  }

  loadContent(projectId) {
    let items = [];
    let projectTitle = 'Project Journey';

    if (projectId === 'viana360') {
      projectTitle = 'Viana 360 Roadmap';
      items = [
        { 
          pos: 0.15,
          img: this.createCardSvg('Architecture Design', 'SwiftUI & Combine', '#00f0ff'), 
          title: 'Architecture Design', 
          desc: 'Designing a scalable MVVM architecture using SwiftUI and Combine for robust, reactive data flow.',
          stats: { tech: 'SwiftUI', pattern: 'MVVM' }
        },
        { 
          pos: 0.35,
          img: this.createCardSvg('Real-time Monitoring', 'REST Streaming', '#00f0ff'), 
          title: 'Real-time Monitoring', 
          desc: 'Integrating complex institutional REST APIs to provide users with instantaneous system status updates.',
          stats: { api: 'REST', latency: 'Low' }
        },
        { 
          pos: 0.55,
          img: this.createCardSvg('Data Visualization', 'Interactive Charts', '#00f0ff'), 
          title: 'Data Visualization', 
          desc: 'Building custom interactive charts to transform raw telemetry into high-impact actionable insights.',
          stats: { framework: 'Swift Charts', type: 'Interactive' }
        },
        { 
          pos: 0.75,
          img: this.createCardSvg('Intelligent Alerts', 'APNs Notification', '#00f0ff'), 
          title: 'Intelligent Alerts', 
          desc: 'Implementing an urgent event notification system for critical institutional thresholds.',
          stats: { system: 'APNs', priority: 'High' }
        },
        { 
          pos: 0.92,
          img: this.createCardSvg('App Store Success', 'Production Release', '#00f0ff'), 
          title: 'App Store Success', 
          desc: 'Successfully deploying to the App Store for iPhone & iPad with stellar performance metrics.',
          stats: { status: 'Live', platform: 'iOS/iPadOS' }
        }
      ];
    } else if (projectId === 'ulcer') {
      projectTitle = 'Smart Ulcer Predictor Roadmap';
      items = [
        { 
          pos: 0.15,
          img: this.createCardSvg('Core ML Pipeline', 'Deep Learning', '#a855f7'), 
          title: 'Deep Learning Pipeline', 
          desc: 'Trained and optimized vision models with Core ML for clinical wound recognition and classification.',
          stats: { model: 'Core ML', domain: 'Vision' }
        },
        { 
          pos: 0.35,
          img: this.createCardSvg('Image Preprocessing', 'Camera & Photos', '#a855f7'), 
          title: 'Image Preprocessing', 
          desc: 'High-resolution image ingestion with automatic normalization and ROI cropping for reliable inference.',
          stats: { input: 'High-Res', crop: 'ROI Auto' }
        },
        { 
          pos: 0.55,
          img: this.createCardSvg('Inference Engine', 'Sub-second AI', '#a855f7'), 
          title: 'On-Device AI Inference', 
          desc: 'Zero-latency on-device predictions categorizing Healing, Not Healing, or Normal Skin states.',
          stats: { latency: '<250ms', privacy: 'On-Device' }
        },
        { 
          pos: 0.75,
          img: this.createCardSvg('Clinical UX & Safety', 'Medical Guidelines', '#a855f7'), 
          title: 'Clinical UX & Safety', 
          desc: 'Engineered safe clinician workflows with transparent confidence metrics and diagnostic guidance.',
          stats: { safety: 'Verified', ux: 'Clean' }
        },
        { 
          pos: 0.92,
          img: this.createCardSvg('App Store Launch', 'Live on App Store', '#a855f7'), 
          title: 'App Store Success', 
          desc: 'Published live on the App Store under Medical category with verified high user feedback.',
          stats: { status: 'Live', rating: '5.0' }
        }
      ];
    } else if (projectId === 'breathtrack') {
      projectTitle = 'BreathTrack Roadmap';
      items = [
        { 
          pos: 0.15,
          img: this.createCardSvg('Care Ecosystem', 'Telehealth Arch', '#38bdf8'), 
          title: 'Collaborative Care Platform', 
          desc: 'Bridging patients and pulmonologists with synchronous data pipelines tailored for COPD management.',
          stats: { arch: 'Dual-Portal', sync: 'Live' }
        },
        { 
          pos: 0.35,
          img: this.createCardSvg('Biometric Vitals', 'SpO2 & Capacity', '#38bdf8'), 
          title: 'Vitals & HealthKit', 
          desc: 'Continuous tracking for oxygen saturation levels, body temperature, and peak lung capacity.',
          stats: { biometrics: 'SpO2/PFT', source: 'HealthKit' }
        },
        { 
          pos: 0.55,
          img: this.createCardSvg('Inhaler Reminders', 'Adherence Engine', '#38bdf8'), 
          title: 'Adherence & Medication', 
          desc: 'Smart recurring reminders for inhaler doses, vaccination timelines, and daily symptom surveys.',
          stats: { reminders: 'Smart APNs', compliance: 'High' }
        },
        { 
          pos: 0.75,
          img: this.createCardSvg('Clinician Portal', 'Diagnostic Review', '#38bdf8'), 
          title: 'Clinician Diagnostic Portal', 
          desc: 'Dedicated portal empowering physicians to review PFT and ABG values, manage appointments, and guide care.',
          stats: { diagnostics: 'PFT/ABG', access: 'Clinician' }
        },
        { 
          pos: 0.92,
          img: this.createCardSvg('App Store Release', 'MedTech Live', '#38bdf8'), 
          title: 'App Store Success', 
          desc: 'Deployed on the App Store to advance respiratory disease management and proactive compliance.',
          stats: { status: 'Live', sector: 'MedTech' }
        }
      ];
    } else if (projectId === 'corecare') {
      projectTitle = 'CoreCare Roadmap';
      items = [
        { 
          pos: 0.15,
          img: this.createCardSvg('Wellness Core', 'Multi-Metric Hub', '#34d399'), 
          title: 'Holistic Wellness Hub', 
          desc: 'Unified architecture coordinating daily nutrition, workout activity, hydration, mood, and vital stats.',
          stats: { modules: '5 Core', pattern: 'Combine' }
        },
        { 
          pos: 0.35,
          img: this.createCardSvg('Habit Tracking', 'Core Data Local', '#34d399'), 
          title: 'Fast Local Habit Logging', 
          desc: 'Minimal-tap logging optimized for high frequency daily interactions with encrypted local storage.',
          stats: { storage: 'Core Data', speed: 'Instant' }
        },
        { 
          pos: 0.55,
          img: this.createCardSvg('Analytics Engine', 'Trend Synthesis', '#34d399'), 
          title: 'Dynamic Health Analytics', 
          desc: 'Interactive Swift Charts uncovering multi-week correlation trends between sleep, activity, and mood.',
          stats: { charts: 'Swift Charts', trends: 'Weekly' }
        },
        { 
          pos: 0.75,
          img: this.createCardSvg('Sensory UX', 'Micro-interactions', '#34d399'), 
          title: 'Sensory Haptics & Polish', 
          desc: 'Rewarding milestone achievements with fluid SwiftUI spring animations and subtle tactile feedback.',
          stats: { feel: 'Haptic', animations: 'Springs' }
        },
        { 
          pos: 0.92,
          img: this.createCardSvg('App Store Launch', 'Live on App Store', '#34d399'), 
          title: 'App Store Success', 
          desc: 'Officially published on the App Store to help users achieve balanced lifestyle goals.',
          stats: { status: 'Live', category: 'Wellness' }
        }
      ];
    } else if (projectId === 'hairjourney') {
      projectTitle = 'HairJourneyTracker Roadmap';
      items = [
        { 
          pos: 0.15,
          img: this.createCardSvg('Visual Timeline', 'PhotosUI Studio', '#f43f5e'), 
          title: 'Visual Photo Timeline', 
          desc: 'Photo-first timeline built with PhotosUI to capture and organize chronological hair growth milestones.',
          stats: { framework: 'PhotosUI', mode: 'Timeline' }
        },
        { 
          pos: 0.35,
          img: this.createCardSvg('Regimen Engine', 'Routine Protocols', '#f43f5e'), 
          title: 'Regimen & Product Tracker', 
          desc: 'Structured cataloging for wash routines, conditioning treatments, oils, and product effectiveness.',
          stats: { database: 'Core Data', routines: 'Custom' }
        },
        { 
          pos: 0.55,
          img: this.createCardSvg('Before & After', 'Dual Comparison', '#f43f5e'), 
          title: 'Side-by-Side Comparison', 
          desc: 'Interactive comparative slider enabling users to visually verify progress across months.',
          stats: { ui: 'Interactive', precision: 'Side-by-side' }
        },
        { 
          pos: 0.75,
          img: this.createCardSvg('Smart Schedules', 'Wash Day Reminders', '#f43f5e'), 
          title: 'Wash Day & Treatment Timers', 
          desc: 'Context-aware local notifications reminding users of scheduled scalp treatments and trimming cycles.',
          stats: { alerts: 'Notifications', schedule: 'Recurring' }
        },
        { 
          pos: 0.92,
          img: this.createCardSvg('App Store Launch', 'Live on App Store', '#f43f5e'), 
          title: 'App Store Success', 
          desc: 'Live on the App Store with a 5.0 rating, supporting thousands in tracking consistent hair health.',
          stats: { status: 'Live', rating: '5.0' }
        }
      ];
    } else if (projectId === 'schoolbus') {
      projectTitle = 'School Bus Tracking Roadmap';
      items = [
        { 
          pos: 0.15,
          img: this.createCardSvg('Dual Ecosystem', 'Parent & Driver', '#f59e0b'), 
          title: 'Dual-App Ecosystem', 
          desc: 'Engineered coordinated Parent and Driver iOS applications with role-specific authentication and views.',
          stats: { apps: 'Parent/Driver', arch: 'Modular' }
        },
        { 
          pos: 0.35,
          img: this.createCardSvg('Live Telemetry', 'CoreLocation & MapKit', '#f59e0b'), 
          title: 'Real-time GPS Tracking', 
          desc: 'Battery-optimized live coordinate streaming with smooth MapKit polyline trajectory rendering.',
          stats: { gps: 'Real-Time', map: 'MapKit' }
        },
        { 
          pos: 0.55,
          img: this.createCardSvg('Dynamic Geofencing', 'Safe Perimeter', '#f59e0b'), 
          title: 'Geofencing & ETA Triggers', 
          desc: 'Automated entry and exit notifications triggered when the bus enters school and neighborhood zones.',
          stats: { geofence: 'Active', eta: 'Dynamic' }
        },
        { 
          pos: 0.75,
          img: this.createCardSvg('Safety Boarding', 'Attendance Verification', '#f59e0b'), 
          title: 'Automated Attendance', 
          desc: 'Instant boarding confirmation giving parents absolute peace of mind during transit.',
          stats: { safety: 'Verified', alerts: 'Instant' }
        },
        { 
          pos: 0.92,
          img: this.createCardSvg('Fleet Operations', 'Production Live', '#f59e0b'), 
          title: 'Production Deployment', 
          desc: 'Deployed for real-world school fleet management with high availability and resilient connection handling.',
          stats: { status: 'Active', reliability: '99.9%' }
        }
      ];
    } else {
      items = [
        { pos: 0.5, img: this.createCardSvg('Innovation', 'Mobile Dev', '#00ffff'), title: 'Engineering Innovation', desc: 'Crafting top-tier iOS mobile applications.', stats: { status: 'Live', type: 'Mobile' } }
      ];
    }

    const headerHtml = `
      <div class="flow-user-header" style="padding-top: 100px;">
        <img src="assets/vishal_optimized.jpg" class="flow-user-img" alt="Vishal Rao M">
        <div class="flow-user-badge">JOURNEY BY ME</div>
        <h1 style="color: white; font-family: 'Playfair Display', serif; font-size: 38px; margin-top: 20px;">
          ${projectTitle}
        </h1>
      </div>
    `;

    this.content.innerHTML = headerHtml + items.map(item => `
      <div class="flow-item" data-pos="${item.pos}">
        <div class="flow-img-wrap">
          <img src="${item.img}" class="flow-img" alt="${item.title}">
        </div>
        <div class="detail-report">
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
          <div class="detail-stats">
            ${Object.entries(item.stats).map(([k, v]) => `
              <div class="stat-box">
                <span class="stat-label">${k}</span>
                <span class="stat-val">${v}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('') + `
      <div style="height: 400px;"></div>
    `;

    this.repositionItems();
  }

  repositionItems() {
    const flowItems = this.content.querySelectorAll('.flow-item');
    if (!this.pathLength) return;
    
    flowItems.forEach(item => {
      const pos = parseFloat(item.dataset.pos);
      const point = this.path.getPointAtLength(pos * this.pathLength);
      item.style.top = `${point.y}px`;
      
      if (window.innerWidth > 600) {
        const offset = 220; // Distance from path
        const nextPoint = this.path.getPointAtLength((pos + 0.01) * this.pathLength);
        const isRight = nextPoint.x > point.x;
        
        if (isRight) {
          item.style.left = `calc(50% + ${point.x - 500 + offset}px)`;
        } else {
          item.style.left = `calc(50% - ${500 - point.x + offset}px)`;
        }
      } else {
        item.style.left = '50%';
        item.style.transform = 'translateX(-50%)';
      }
    });
  }

  update() {
    if (!this.isActive) return;

    const centerY = window.innerHeight / 2;
    const flowItems = this.content.querySelectorAll('.flow-item');
    
    let closestItem = null;
    let minDistance = Infinity;

    flowItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - centerY);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestItem = item;
      }
      
      item.classList.remove('focused');
    });

    if (closestItem && minDistance < 250) {
      closestItem.classList.add('focused');
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.bikeFlow = new BikeFlow();
});
