/* ===========================
   KINTSUGI BACKGROUND
   Generative gold crack pattern on canvas.
   Runs once on load, redraws on resize.
=========================== */
function drawKintsugi() {
  const canvas = document.getElementById("kintsugi-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const GOLD        = "#c9a84c";
  const GLOW_COLOR  = "rgba(201, 168, 76, 0.4)";
  const NUM_CRACKS  = 6;   // main crack origins
  const MAX_DEPTH   = 4;   // branching depth

  function drawCrack(x, y, angle, length, width, depth) {
    if (depth > MAX_DEPTH || length < 8) return;

    // Organic jitter along the path
    const segments = Math.floor(length / 12);
    const segLen   = length / segments;

    ctx.beginPath();
    ctx.moveTo(x, y);

    let cx = x, cy = y, a = angle;
    for (let i = 0; i < segments; i++) {
      a += (Math.random() - 0.5) * 0.45;   // slight direction wander
      cx += Math.cos(a) * segLen;
      cy += Math.sin(a) * segLen;
      ctx.lineTo(cx, cy);
    }

    // Glow pass
    ctx.shadowColor  = GLOW_COLOR;
    ctx.shadowBlur   = 8;
    ctx.strokeStyle  = GOLD;
    ctx.lineWidth    = width;
    ctx.lineCap      = "round";
    ctx.lineJoin     = "round";
    ctx.globalAlpha  = 0.55 + Math.random() * 0.3;
    ctx.stroke();

    // Reset shadow for sub-cracks
    ctx.shadowBlur  = 0;
    ctx.globalAlpha = 1;

    // Branch 1–2 times along this crack
    const branches = depth < 2 ? 2 : 1;
    for (let b = 0; b < branches; b++) {
      const t        = 0.35 + Math.random() * 0.45;
      const bx       = x + Math.cos(a) * length * t;
      const by       = y + Math.sin(a) * length * t;
      const bAngle   = a + (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.5);
      const bLength  = length * (0.45 + Math.random() * 0.3);
      const bWidth   = width * 0.6;
      drawCrack(bx, by, bAngle, bLength, bWidth, depth + 1);
    }
  }

  // Seed cracks from random positions around the canvas
  for (let i = 0; i < NUM_CRACKS; i++) {
    const x      = Math.random() * canvas.width;
    const y      = Math.random() * canvas.height;
    const angle  = Math.random() * Math.PI * 2;
    const length = 120 + Math.random() * 220;
    const width  = 1.2 + Math.random() * 1.0;
    drawCrack(x, y, angle, length, width, 0);
  }
}

drawKintsugi();
window.addEventListener("resize", drawKintsugi);
gsap.registerPlugin(ScrollTrigger);

/* ===========================
   CUSTOM CURSOR
=========================== */
document.addEventListener("mousemove", (e) => {
  document.body.style.setProperty("--cx", e.clientX + "px");
  document.body.style.setProperty("--cy", e.clientY + "px");
});


/* ===========================
   HERO — fade out on scroll
=========================== */
gsap.to(".title", {
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  },
  y: -180,
  opacity: 0
});

gsap.to(".subtitle, .hero-cta, .hero-tag", {
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "60% top",
    scrub: true
  },
  y: -80,
  opacity: 0,
  stagger: 0.05
});


/* ===========================
   PARALLAX LAYERS
   Fix: removed overflow:hidden from .parallax in CSS,
   so the y movement is now actually visible.
   Mouse parallax and scroll parallax use separate props (y vs scroll-y)
   so they don't conflict.
=========================== */
gsap.to(".back", {
  scrollTrigger: {
    trigger: ".parallax",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  },
  y: -80
});

gsap.to(".mid", {
  scrollTrigger: {
    trigger: ".parallax",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  },
  y: -160
});

gsap.to(".front", {
  scrollTrigger: {
    trigger: ".parallax",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  },
  y: -240
});

/* Parallax text fade in */
gsap.from(".parallax-text", {
  scrollTrigger: {
    trigger: ".parallax",
    start: "top 70%",
    end: "center center",
    scrub: true
  },
  opacity: 0,
  y: 60,
  letterSpacing: "0.3em"
});


/* ===========================
   MOUSE PARALLAX
   Fix: uses xPercent/yPercent instead of x/y
   so it doesn't conflict with scroll-based y animations.
=========================== */
document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  gsap.to(".back",  { xPercent: x * 0.15, yPercent: y * 0.15, duration: 1.5, ease: "power1.out" });
  gsap.to(".mid",   { xPercent: x * 0.3,  yPercent: y * 0.3,  duration: 1.5, ease: "power1.out" });
  gsap.to(".front", { xPercent: x * 0.5,  yPercent: y * 0.5,  duration: 1.5, ease: "power1.out" });
});


/* ===========================
   ABOUT — scroll in
=========================== */
gsap.from(".about-inner", {
  scrollTrigger: {
    trigger: ".about",
    start: "top 60%",
    end: "top 20%",
    scrub: true
  },
  opacity: 0,
  y: 80
});


/* ===========================
   SKILLS — stagger in
=========================== */
gsap.from(".skill", {
  scrollTrigger: {
    trigger: ".skills",
    start: "top 70%"
  },
  opacity: 0,
  y: 30,
  stagger: 0.1,
  duration: 0.8,
  ease: "power2.out"
});


/* ===========================
   PROJECTS — horizontal scroll
   Fix: uses container's actual scrollWidth minus viewport width,
   with a matching end distance so pin and scroll stay in sync.
   Each project is 70vw so the math is predictable.
=========================== */
window.addEventListener("load", () => {
  const section = document.querySelector(".projects");
  const container = document.querySelector(".projects-container");

  if (!section || !container) {
    console.error("Projects elements not found");
    return;
  }

  // Total horizontal distance to scroll
  const totalScroll = () => container.scrollWidth - window.innerWidth;

  gsap.to(container, {
    x: () => -totalScroll(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => "+=" + totalScroll(),
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true  // recalculates on resize
    }
  });
});


/* ===========================
   CONTACT — fade in
=========================== */
gsap.from(".contact-heading", {
  scrollTrigger: {
    trigger: ".contact",
    start: "top 70%",
    end: "top 30%",
    scrub: true
  },
  opacity: 0,
  y: 60
});

gsap.from(".contact-email, .contact-links", {
  scrollTrigger: {
    trigger: ".contact",
    start: "top 60%"
  },
  opacity: 0,
  y: 30,
  stagger: 0.15,
  duration: 1,
  ease: "power2.out"
});
