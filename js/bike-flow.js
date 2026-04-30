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
        this.open(title.includes('Viana 360') ? 'viana360' : 'general');
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
    const headerHtml = `
      <div class="flow-user-header" style="padding-top: 100px;">
        <img src="assets/vishal_optimized.jpg" class="flow-user-img" alt="Vishal Rao M">
        <div class="flow-user-badge">JOURNEY BY ME</div>
        <h1 style="color: white; font-family: 'Playfair Display', serif; font-size: 38px; margin-top: 20px;">
          ${projectId === 'viana360' ? 'Viana 360 Roadmap' : 'Project Journey'}
        </h1>
      </div>
    `;

    if (projectId === 'viana360') {
      items = [
        { 
          pos: 0.15,
          img: 'https://via.placeholder.com/460x996/0a0a0f/ffffff?text=Architecture', 
          title: 'Architecture Design', 
          desc: 'Designing a scalable MVVM architecture using SwiftUI and Combine for robust data flow.',
          stats: { tech: 'SwiftUI', pattern: 'MVVM' }
        },
        { 
          pos: 0.35,
          img: 'https://via.placeholder.com/460x996/0a0a0f/ffffff?text=Monitoring', 
          title: 'Real-time Monitoring', 
          desc: 'Integrating complex REST APIs to provide users with instantaneous system updates.',
          stats: { api: 'REST', latency: 'Low' }
        },
        { 
          pos: 0.55,
          img: 'https://via.placeholder.com/460x996/0a0a0f/ffffff?text=Visualization', 
          title: 'Data Visualization', 
          desc: 'Building custom interactive charts to transform raw data into actionable insights.',
          stats: { framework: 'Swift Charts', type: 'Interactive' }
        },
        { 
          pos: 0.75,
          img: 'https://via.placeholder.com/460x996/0a0a0f/ffffff?text=Alerts', 
          title: 'Intelligent Alerts', 
          desc: 'Implementing a sophisticated notification system for critical institutional events.',
          stats: { system: 'APNs', priority: 'High' }
        },
        { 
          pos: 0.92,
          img: 'https://via.placeholder.com/460x996/0a0a0f/ffffff?text=Launch', 
          title: 'App Store Success', 
          desc: 'Successfully deploying to the App Store with high ratings and positive user feedback.',
          stats: { status: 'Live', rating: '5.0' }
        }
      ];
    } else {
      items = [
        { pos: 0.5, img: 'https://via.placeholder.com/800x450/0a0a0f/00ffff', title: 'Innovation', desc: 'Detailed report content.', stats: { status: 'Live', type: 'Mobile' } }
      ];
    }

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
