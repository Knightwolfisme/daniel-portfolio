/**
 * DANIEL SHAJU — PORTFOLIO CORE ENGINE
 * Features:
 * - Living Generative Kintsugi Canvas (Continuous Molten Pulses, Proximity Bloom, Click Mending)
 * - Custom Dual Cursor with Lerp & Interactive Magnetics
 * - GSAP ScrollTrigger Orchestration (Horizontal Projects Track, Parallax Telemetry, Section Reveals)
 * - Skills Category Filter Matrix
 * - Technical Case Study Modal System
 * - Synthesized Web Audio API (Golden Chime Oscillators)
 * - One-Click Clipboard Copy with Toast Feedback
 */

/* ==========================================================================
   01. SYNTHESIZED WEB AUDIO ENGINE (Zero External Audio Assets)
   ========================================================================== */
class AudioController {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // C D E G A C D E
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.init();
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playGoldChime(freqIndex = null) {
    if (!this.enabled || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      const freq = freqIndex !== null 
        ? this.pentatonicScale[freqIndex % this.pentatonicScale.length] 
        : this.pentatonicScale[Math.floor(Math.random() * this.pentatonicScale.length)];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.Q.setValueAtTime(3, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.95);
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  }

  playClickTick() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }
}

const audioCtrl = new AudioController();

/* ==========================================================================
   02. LIVING KINTSUGI GENERATIVE CANVAS SIMULATION
   ========================================================================== */
class KintsugiSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.nodes = [];
    this.veins = [];
    this.pulses = [];
    this.dustParticles = [];

    this.mouse = { x: -1000, y: -1000, radius: 180 };
    this.lastTime = performance.now();

    this.initSize();
    this.generateNetwork();
    this.initDust();
    this.bindEvents();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  initSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  generateNetwork() {
    this.nodes = [];
    this.veins = [];
    this.pulses = [];

    const cols = Math.max(3, Math.floor(this.width / 320));
    const rows = Math.max(3, Math.floor(this.height / 280));
    const cellW = this.width / cols;
    const cellH = this.height / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.nodes.push({
          x: cellW * c + cellW * (0.15 + Math.random() * 0.7),
          y: cellH * r + cellH * (0.15 + Math.random() * 0.7),
          baseX: cellW * c + cellW * 0.5,
          baseY: cellH * r + cellH * 0.5,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          energy: 0
        });
      }
    }

    // Border nodes to let gold bleed gracefully off edges
    this.nodes.push({ x: Math.random() * this.width, y: -20, baseX: 0, baseY: 0, vx: 0, vy: 0, energy: 0 });
    this.nodes.push({ x: Math.random() * this.width, y: this.height + 20, baseX: 0, baseY: 0, vx: 0, vy: 0, energy: 0 });
    this.nodes.push({ x: -20, y: Math.random() * this.height, baseX: 0, baseY: 0, vx: 0, vy: 0, energy: 0 });
    this.nodes.push({ x: this.width + 20, y: Math.random() * this.height, baseX: 0, baseY: 0, vx: 0, vy: 0, energy: 0 });

    // Connect nodes into organic veins
    const used = new Set();
    this.nodes.forEach((nodeA, i) => {
      const nearest = this.nodes
        .map((nodeB, j) => ({ j, d: Math.hypot(nodeB.x - nodeA.x, nodeB.y - nodeA.y) }))
        .filter(o => o.j !== i && o.d < 650)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2 + Math.floor(Math.random() * 2));

      nearest.forEach(({ j }) => {
        const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
        if (used.has(key)) return;
        used.add(key);

        const nodeB = this.nodes[j];
        const len = Math.hypot(nodeB.x - nodeA.x, nodeB.y - nodeA.y);
        const perpX = -(nodeB.y - nodeA.y) / len;
        const perpY = (nodeB.x - nodeA.x) / len;
        const bow1 = (Math.random() - 0.5) * len * 0.35;
        const bow2 = (Math.random() - 0.5) * len * 0.25;

        this.veins.push({
          nodeA,
          nodeB,
          cp1x: nodeA.x + (nodeB.x - nodeA.x) * 0.35 + perpX * bow1,
          cp1y: nodeA.y + (nodeB.y - nodeA.y) * 0.35 + perpY * bow1,
          cp2x: nodeA.x + (nodeB.x - nodeA.x) * 0.70 + perpX * bow2,
          cp2y: nodeA.y + (nodeB.y - nodeA.y) * 0.70 + perpY * bow2,
          width: Math.random() < 0.4 ? 2.2 : 1.1,
          baseAlpha: 0.45 + Math.random() * 0.35,
          glow: 0
        });
      });
    });

    // Spawn 4-6 initial travelling molten gold pulses
    for (let i = 0; i < 5; i++) {
      this.spawnPulse();
    }
  }

  spawnPulse(startVein = null) {
    if (this.veins.length === 0) return;
    const vein = startVein || this.veins[Math.floor(Math.random() * this.veins.length)];
    this.pulses.push({
      vein,
      progress: 0,
      speed: 0.003 + Math.random() * 0.005,
      size: 3 + Math.random() * 3
    });
  }

  initDust() {
    this.dustParticles = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      this.dustParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: 0.6 + Math.random() * 1.4,
        alpha: 0.15 + Math.random() * 0.45,
        speedY: -0.2 - Math.random() * 0.3,
        swaySpeed: 0.002 + Math.random() * 0.004,
        swayOffset: Math.random() * Math.PI * 2
      });
    }
  }

  triggerMendPulse(clickX, clickY) {
    // Find nearest node or inject a temporary fracture node
    const newNode = {
      x: clickX,
      y: clickY,
      vx: 0,
      vy: 0,
      energy: 1.0
    };
    this.nodes.push(newNode);

    // Connect to 3 nearest nodes
    const sorted = [...this.nodes]
      .filter(n => n !== newNode)
      .map(n => ({ node: n, dist: Math.hypot(n.x - clickX, n.y - clickY) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3);

    sorted.forEach(({ node, dist }) => {
      const perpX = -(node.y - clickY) / dist;
      const perpY = (node.x - clickX) / dist;
      const bow = (Math.random() - 0.5) * dist * 0.3;

      const newVein = {
        nodeA: newNode,
        nodeB: node,
        cp1x: clickX + (node.x - clickX) * 0.4 + perpX * bow,
        cp1y: clickY + (node.y - clickY) * 0.4 + perpY * bow,
        cp2x: clickX + (node.x - clickX) * 0.7 + perpX * bow,
        cp2y: clickY + (node.y - clickY) * 0.7 + perpY * bow,
        width: 2.5,
        baseAlpha: 0.9,
        glow: 1.0
      };
      this.veins.push(newVein);
      this.spawnPulse(newVein);
    });

    audioCtrl.playGoldChime();
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.initSize();
      this.generateNetwork();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('click', (e) => {
      // Don't trigger if clicking navbar, modal, or buttons
      if (e.target.closest('.navbar, .modal-window, .btn, .nav-icon-btn')) return;
      this.triggerMendPulse(e.clientX, e.clientY);
    });
  }

  drawBezier(x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2, strokeStyle, lineWidth, alpha) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = 'round';
    this.ctx.globalAlpha = alpha;
    this.ctx.stroke();
  }

  getBezierPoint(t, p0, p1, p2, p3) {
    const cx = 3 * (p1.x - p0.x);
    const bx = 3 * (p2.x - p1.x) - cx;
    const ax = p3.x - p0.x - cx - bx;

    const cy = 3 * (p1.y - p0.y);
    const by = 3 * (p2.y - p1.y) - cy;
    const ay = p3.y - p0.y - cy - by;

    return {
      x: ax * t * t * t + bx * t * t + cx * t + p0.x,
      y: ay * t * t * t + by * t * t + cy * t + p0.y
    };
  }

  loop(currentTime) {
    const dt = Math.min(currentTime - this.lastTime, 100);
    this.lastTime = currentTime;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Gold Dust Particles
    this.dustParticles.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(currentTime * p.swaySpeed + p.swayOffset) * 0.4;
      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = '#dfbe65';
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fill();
    });

    // 2. Render Kintsugi Gold Veins
    this.veins.forEach(vein => {
      const midX = (vein.nodeA.x + vein.nodeB.x) / 2;
      const midY = (vein.nodeA.y + vein.nodeB.y) / 2;
      const mouseDist = Math.hypot(this.mouse.x - midX, this.mouse.y - midY);

      // Mouse proximity illumination bloom
      let proximityBoost = 0;
      if (mouseDist < this.mouse.radius) {
        proximityBoost = (1 - mouseDist / this.mouse.radius) * 0.5;
      }

      if (vein.glow > 0) {
        vein.glow = Math.max(0, vein.glow - 0.008);
      }

      const totalAlpha = Math.min(1, vein.baseAlpha + proximityBoost + vein.glow);
      const w = vein.width * (1 + proximityBoost * 0.5);

      // Layer 1: Wide Amber Glow
      this.drawBezier(
        vein.nodeA.x, vein.nodeA.y,
        vein.cp1x, vein.cp1y,
        vein.cp2x, vein.cp2y,
        vein.nodeB.x, vein.nodeB.y,
        'rgba(201, 168, 76, 0.12)',
        w * 12,
        totalAlpha * 0.4
      );

      // Layer 2: Radiant Gold Core
      this.drawBezier(
        vein.nodeA.x, vein.nodeA.y,
        vein.cp1x, vein.cp1y,
        vein.cp2x, vein.cp2y,
        vein.nodeB.x, vein.nodeB.y,
        '#c9a84c',
        w,
        totalAlpha
      );

      // Layer 3: Hot Molten Center
      this.drawBezier(
        vein.nodeA.x, vein.nodeA.y,
        vein.cp1x, vein.cp1y,
        vein.cp2x, vein.cp2y,
        vein.nodeB.x, vein.nodeB.y,
        'rgba(255, 245, 200, 0.95)',
        w * 0.35,
        totalAlpha * 0.85
      );
    });

    // 3. Render Traveling Molten Pulses
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const pulse = this.pulses[i];
      pulse.progress += pulse.speed;

      if (pulse.progress >= 1) {
        this.pulses.splice(i, 1);
        this.spawnPulse();
        continue;
      }

      const p0 = { x: pulse.vein.nodeA.x, y: pulse.vein.nodeA.y };
      const p1 = { x: pulse.vein.cp1x, y: pulse.vein.cp1y };
      const p2 = { x: pulse.vein.cp2x, y: pulse.vein.cp2y };
      const p3 = { x: pulse.vein.nodeB.x, y: pulse.vein.nodeB.y };

      const pt = this.getBezierPoint(pulse.progress, p0, p1, p2, p3);

      // Draw pulse glow
      const grad = this.ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pulse.size * 5);
      grad.addColorStop(0, 'rgba(255, 240, 180, 0.9)');
      grad.addColorStop(0.3, 'rgba(217, 180, 77, 0.5)');
      grad.addColorStop(1, 'rgba(201, 168, 76, 0)');

      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, pulse.size * 4, 0, Math.PI * 2);
      this.ctx.fillStyle = grad;
      this.ctx.globalAlpha = 1;
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(this.loop);
  }
}

/* ==========================================================================
   03. DUAL-LAYER PRECISION CURSOR & HOVER MAGNETICS
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Re-apply the -50%/-50% centering offset that gets wiped out by
    // setting style.transform directly (it overwrites the CSS transform).
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Interactive Hover Expansions
  const hoverTargets = document.querySelectorAll(
    'a, button, .project-card, .skill-card, .badge-item, .social-card, .pillar-card, .timeline-content'
  );

  hoverTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    target.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
}

/* ==========================================================================
   04. GSAP SCROLLTRIGGER & KINETIC TIMELINES
   ========================================================================== */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn("GSAP or ScrollTrigger not loaded. Running fallback.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // 1. Hero Kinetic Reveal on scroll
  gsap.to('.title', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    },
    y: -120,
    opacity: 0.15,
    ease: 'power1.out'
  });

  gsap.to('.hero-lead-row, .hero-cta-group', {
    scrollTrigger: {
      trigger: '.hero',
      start: '15% top',
      end: '70% top',
      scrub: 1
    },
    y: -80,
    opacity: 0,
    ease: 'power1.out'
  });

  // 2. Parallax Section & Telemetry HUD
  // Pinned for a fixed, explicit scroll distance (same technique as the
  // Projects horizontal scroll below) instead of relying on CSS `position:
  // sticky` inside a section taller than its own content — that mismatch
  // was leaving a stretch of empty scroll with nothing in it before the
  // About section appeared. Pinning explicitly means the section releases
  // straight into About the instant the animation finishes, no gap.
  const parallaxScrollDistance = () => window.innerHeight * 0.9;

  ScrollTrigger.create({
    trigger: '.parallax',
    start: 'top top',
    end: () => '+=' + parallaxScrollDistance(),
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true
  });

  gsap.to('.back', {
    scrollTrigger: {
      trigger: '.parallax',
      start: 'top top',
      end: () => '+=' + parallaxScrollDistance(),
      scrub: 1
    },
    y: -60
  });
  gsap.to('.mid', {
    scrollTrigger: {
      trigger: '.parallax',
      start: 'top top',
      end: () => '+=' + parallaxScrollDistance(),
      scrub: 1
    },
    y: -110
  });
  gsap.to('.front', {
    scrollTrigger: {
      trigger: '.parallax',
      start: 'top top',
      end: () => '+=' + parallaxScrollDistance(),
      scrub: 1
    },
    y: -160
  });

  // Welcome to my world: shrinks to normal from large as user scrolls down, centered on bg-words
  gsap.fromTo('.parallax-text',
    {
      scale: 2.8,
      opacity: 0.25,
      letterSpacing: '0.12em'
    },
    {
      scale: 1,
      opacity: 1,
      letterSpacing: '0.04em',
      ease: 'power1.out',
      scrollTrigger: {
        trigger: '.parallax',
        start: 'top top',
        end: () => '+=' + parallaxScrollDistance(),
        scrub: 1
      }
    }
  );

  gsap.fromTo('.bg-words',
    {
      scale: 0.88,
      opacity: 0.18
    },
    {
      scale: 1.05,
      opacity: 0.4,
      ease: 'none',
      scrollTrigger: {
        trigger: '.parallax',
        start: 'top top',
        end: () => '+=' + parallaxScrollDistance(),
        scrub: 1
      }
    }
  );

  // 3. About Section Reveal
  gsap.from('.about-heading, .about-bio', {
    scrollTrigger: {
      trigger: '.about',
      start: 'top 75%'
    },
    opacity: 0,
    y: 40,
    stagger: 0.2,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.from('.pillar-card', {
    scrollTrigger: {
      trigger: '.about-pillars',
      start: 'top 80%'
    },
    opacity: 0,
    y: 50,
    stagger: 0.15,
    duration: 0.9,
    ease: 'power2.out'
  });

  // 4. Skills Matrix Stagger
  gsap.from('.skill-card', {
    scrollTrigger: {
      trigger: '.skills',
      start: 'top 75%'
    },
    opacity: 0,
    y: 40,
    stagger: 0.08,
    duration: 0.7,
    ease: 'power2.out'
  });

  // 5. Horizontal Projects Pinned Scroll (Desktop only)
  const isDesktop = window.innerWidth > 800;
  if (isDesktop) {
    const section = document.querySelector('.projects');
    const container = document.querySelector('.projects-container');

    if (section && container) {
      const totalScroll = () => container.scrollWidth - window.innerWidth + window.innerWidth * 0.16;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + (totalScroll() + 500),
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // Brief settle delay while cards are centered in the screen before side-scroll starts:
      tl.to({}, { duration: 0.15 })
        .to(container, {
          x: () => -totalScroll(),
          ease: 'none',
          duration: 1
        });
    }
  }

  // 6. Achievements Timeline Reveal
  gsap.from('.timeline-item', {
    scrollTrigger: {
      trigger: '.achievements',
      start: 'top 70%'
    },
    opacity: 0,
    x: -40,
    stagger: 0.2,
    duration: 0.9,
    ease: 'power2.out'
  });

  // 7. Contact Section Reveal
  gsap.from('.contact-heading, .email-action-box', {
    scrollTrigger: {
      trigger: '.contact',
      start: 'top 75%'
    },
    opacity: 0,
    y: 40,
    stagger: 0.2,
    duration: 1,
    ease: 'power3.out'
  });
}

/* ==========================================================================
   05. SKILLS MATRIX CATEGORY FILTER
   ========================================================================== */
function initSkillsFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.skill-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      audioCtrl.playClickTick();

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   06. CASE STUDY MODAL SYSTEM & DATA MATRIX
   ========================================================================== */
const projectCaseStudies = {
  'aero-ops': {
    title: 'Aero-Ops UAV: Real-Time 3D Scene Reconstruction',
    badge: '🏆 1ST PLACE WINNER // RV COLLEGE OF ENGINEERING',
    tags: ['Autonomous UAV', 'Photogrammetry', 'OpenCV', 'Python', '12-Hour Sprint', '3D Meshing'],
    summary: 'Secured 1st place at RV College of Engineering’s 12-hour UAV and IoT hackathon during 8th Mile 2025. The challenge demanded autonomous aerial surveillance combined with rapid, real-time 3D spatial reconstruction of unknown terrain under strict hardware and time constraints.',
    techDetails: [
      { title: 'Telemetry Pipeline', desc: 'Streamed high-bandwidth video and IMU position data directly from drone transceiver to ground station.' },
      { title: 'Feature Matching', desc: 'Implemented accelerated ORB and optical flow algorithms to link overlapping aerial video keyframes.' },
      { title: 'Point Cloud Synthesis', desc: 'Constructed dense point clouds and textured mesh geometry within minutes of drone flight completion.' },
      { title: 'Obstacle Tagging', desc: 'Identified ground elevation hazards and tagged coordinates for autonomous emergency landing routes.' }
    ],
    results: [
      'Awarded 1st Place Champion out of dozens of university robotics and engineering teams.',
      'Achieved under 15-minute complete scene turnaround from raw drone flight footage to interactive 3D model.',
      'Zero packet drop and seamless telemetry parsing during live demonstration flight.'
    ]
  },
  'isro-iroc': {
    title: 'ISRO Robotics Challenge 2026 (IRoC-U)',
    badge: '🚀 U R RAO SATELLITE CENTRE // NATIONAL COMPETITION',
    tags: ['ISRO URSC', 'Space Robotics', 'Autonomous Navigation', 'Sensor Fusion', 'ROS 2', 'Planetary UAV'],
    summary: 'Selected for the prestigious national robotics challenge organized by ISRO’s U R Rao Satellite Centre (URSC). The challenge centers around developing cutting-edge autonomous unmanned aerial vehicle (UAV) systems capable of navigating GPS-denied planetary terrain simulations.',
    techDetails: [
      { title: 'GPS-Denied Odometry', desc: 'Fused Visual-Inertial Odometry (VIO) with down-facing optical flow to maintain centimeter-level position locks.' },
      { title: 'Terrain Analysis', desc: 'Evaluated simulated extraterrestrial surface slope, crater depth, and obstacle density in real-time.' },
      { title: 'Fail-Safe Logic', desc: 'Engineered hierarchical state machines to handle sensor dropout, sudden turbulence, and communication blackouts.' },
      { title: 'ROS 2 Node Mesh', desc: 'Modular microservice architecture separating vision processing, trajectory generation, and motor commands.' }
    ],
    results: [
      'Advanced to national stage representing premier collegiate engineering robotics.',
      'Formulated autonomous path planning algorithms verified against ISRO URSC terrain specifications.',
      'Designed custom carbon-fiber airframe structure with integrated dampening for precision sensor arrays.'
    ]
  },
  'oneatatime': {
    title: 'OneAtATime: Intelligent Process Orchestrator',
    badge: '⚡ OPEN SOURCE // WINDOWS SYSTEMS UTILITY',
    tags: ['Python', 'Win32 API', 'Steam API', 'Itch.io', 'Process Scheduling', 'RAM Reclamation'],
    summary: 'OneAtATime is a lightweight Windows desktop application created to resolve memory contention and background process clutter for multi-launcher gaming rigs. It automatically monitors running executables across Steam and Itch.io, throttling or suspending idle game instances to maximize CPU and GPU budget for the active session.',
    techDetails: [
      { title: 'Win32 Process Interop', desc: 'Utilized low-level Windows APIs (kernel32, psapi) for real-time process monitoring and thread suspension.' },
      { title: 'Launcher Catalog Parser', desc: 'Reverse-engineered Steam VDF app manifests and Itch library structures to auto-detect installed titles without user input.' },
      { title: 'Smart Memory Reclaiming', desc: 'Triggered working set trimming and process priority demotion on dormant background titles.' },
      { title: 'Minimalist Architecture', desc: 'Operates with less than 18MB RAM footprint and near-zero idle CPU consumption (under 0.05%).' }
    ],
    results: [
      'Completely seamless game switching with automated CPU core assignment.',
      'Demonstrated 12-18% frame rate stability recovery on memory-constrained gaming systems.',
      'Fully open-source utility available to the developer community on GitHub.'
    ]
  },
  'micromouse': {
    title: 'Autonomous Micromouse & Line Follower',
    badge: '🥉 3RD PLACE PODIUM // ROBOTICS INVITATIONAL',
    tags: ['Embedded C', 'PID Control', 'Infrared Arrays', 'Microcontrollers', 'Motor Dynamics'],
    summary: 'Engineered, calibrated, and piloted an autonomous line-follower and micromouse mobile robot in a high-speed competitive robotics trial. The bot had to navigate intricate multi-radius turns, intersections, and speed straights with zero manual intervention.',
    techDetails: [
      { title: 'Sensor Multiplexing', desc: 'High-speed analog-to-digital sampling across a custom 8-element infrared reflectance array.' },
      { title: 'Dual-Loop PID', desc: 'Tuned proportional, integral, and derivative terms with dynamic velocity compensation on tight chicanes.' },
      { title: 'H-Bridge PWM Control', desc: 'Differential drive motor control using ultra-fast switching MOSFET bridges for instant braking.' },
      { title: 'Telemetry Logging', desc: 'Real-time EEPROM logging of error terms to diagnose drift patterns post-run.' }
    ],
    results: [
      'Secured 3rd Place on the podium amidst intense inter-collegiate robotics teams.',
      'Recorded 100% track completion rate across consecutive qualifying and final rounds.',
      'Achieved dynamic speed transitions without wheel slip or loss of trajectory lock.'
    ]
  }
};

function initCaseStudyModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  const dismissBtn = document.getElementById('modal-dismiss');
  const openButtons = document.querySelectorAll('.open-modal-btn');

  const modalTitle = document.getElementById('modal-title');
  const modalBadge = document.getElementById('modal-badge');
  const modalTags = document.getElementById('modal-tags');
  const modalSummary = document.getElementById('modal-summary');
  const modalTech = document.getElementById('modal-tech-details');
  const modalResults = document.getElementById('modal-results');

  function openModal(projectId) {
    const data = projectCaseStudies[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalBadge.textContent = data.badge;
    modalSummary.textContent = data.summary;

    modalTags.innerHTML = data.tags
      .map(tag => `<span class="tag">${tag}</span>`)
      .join('');

    modalTech.innerHTML = data.techDetails
      .map(item => `
        <div class="modal-tech-item">
          <h5>${item.title}</h5>
          <p>${item.desc}</p>
        </div>
      `)
      .join('');

    modalResults.innerHTML = data.results
      .map(res => `<li>${res}</li>`)
      .join('');

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    audioCtrl.playGoldChime(4);
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    audioCtrl.playClickTick();
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = btn.getAttribute('data-target');
      openModal(target);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  dismissBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   07. INTERACTIVE EMAIL COPY & TOAST FEEDBACK
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const targetEmail = document.getElementById('target-email');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  if (!copyBtn || !targetEmail) return;

  function showToast(message) {
    if (!toast) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    audioCtrl.playGoldChime(2);
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  copyBtn.addEventListener('click', async () => {
    const text = targetEmail.textContent.trim();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      const copyLabel = copyBtn.querySelector('.copy-label');
      const iconCopy = copyBtn.querySelector('.icon-copy');
      const iconCheck = copyBtn.querySelector('.icon-check');

      if (copyLabel) copyLabel.textContent = 'Copied!';
      if (iconCopy) iconCopy.classList.add('hidden');
      if (iconCheck) iconCheck.classList.remove('hidden');

      showToast(`Copied ${text} to clipboard!`);

      setTimeout(() => {
        if (copyLabel) copyLabel.textContent = 'Copy Address';
        if (iconCopy) iconCopy.classList.remove('hidden');
        if (iconCheck) iconCheck.classList.add('hidden');
      }, 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      showToast('Manual copy: ' + text);
    }
  });
}

/* ==========================================================================
   08. NAVBAR & AUDIO TOGGLE INTERACTIONS
   ========================================================================== */
function initNavbarAndAudio() {
  const audioBtn = document.getElementById('audio-toggle');
  const iconOff = audioBtn ? audioBtn.querySelector('.icon-sound-off') : null;
  const iconOn = audioBtn ? audioBtn.querySelector('.icon-sound-on') : null;
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isEnabled = audioCtrl.toggle();
      if (isEnabled) {
        iconOff.classList.add('hidden');
        iconOn.classList.remove('hidden');
        audioBtn.style.color = 'var(--gold-bright)';
        audioBtn.style.borderColor = 'var(--gold)';
        audioCtrl.playGoldChime(5);
      } else {
        iconOff.classList.remove('hidden');
        iconOn.classList.add('hidden');
        audioBtn.style.color = '';
        audioBtn.style.borderColor = '';
      }
    });
  }

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // Active section spy
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        links.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });

  // Dynamic Year in footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   09. INITIALIZATION BOOTSTRAP
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('loading');

  // Launch Systems
  new KintsugiSimulation('kintsugi-bg');
  initCustomCursor();
  initSkillsFilter();
  initCaseStudyModal();
  initCopyEmail();
  initNavbarAndAudio();
  initScrollAnimations();
});
