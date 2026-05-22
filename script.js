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

  const GOLD       = "#c9a84c";
  const GLOW       = "rgba(201, 168, 76, 0.35)";
  const NUM_CRACKS = 7;
  const MAX_DEPTH  = 4;

  function drawCrack(x, y, angle, length, baseWidth, depth) {
    if (depth > MAX_DEPTH || length < 10) return;

    const segments = Math.max(6, Math.floor(length / 10));
    const segLen   = length / segments;

    let cx = x, cy = y, a = angle;

    for (let i = 0; i < segments; i++) {
      const t = i / segments;

      // Width varies: thick near origin, tapers at tip,
      // with random organic swells in the middle
      const taper   = 1 - t * 0.75;
      const swell   = 1 + (Math.random() - 0.3) * 0.5;
      const segW    = Math.max(0.4, baseWidth * taper * swell);

      a += (Math.random() - 0.5) * 0.5;  // wander
      const nx = cx + Math.cos(a) * segLen;
      const ny = cy + Math.sin(a) * segLen;

      // Glow pass (drawn wider, behind)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle  = GLOW;
      ctx.lineWidth    = segW * 3.5;
      ctx.lineCap      = "round";
      ctx.globalAlpha  = 0.18;
      ctx.shadowBlur   = 0;
      ctx.stroke();

      // Gold line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle  = GOLD;
      ctx.lineWidth    = segW;
      ctx.globalAlpha  = 0.55 + Math.random() * 0.35;
      ctx.stroke();

      cx = nx;
      cy = ny;
    }

    ctx.globalAlpha = 1;

    // Branches
    const numBranches = depth < 2 ? 2 : 1;
    for (let b = 0; b < numBranches; b++) {
      const t       = 0.3 + Math.random() * 0.5;
      const bx      = x + Math.cos(angle) * length * t;
      const by      = y + Math.sin(angle) * length * t;
      const bAngle  = angle + (Math.random() > 0.5 ? 1 : -1) * (0.35 + Math.random() * 0.55);
      const bLen    = length * (0.4 + Math.random() * 0.35);
      // Branch width inherits from parent but thinner
      const bWidth  = baseWidth * (0.45 + Math.random() * 0.25);
      drawCrack(bx, by, bAngle, bLen, bWidth, depth + 1);
    }
  }

  for (let i = 0; i < NUM_CRACKS; i++) {
    const x      = Math.random() * canvas.width;
    const y      = Math.random() * canvas.height;
    const angle  = Math.random() * Math.PI * 2;
    const length = 180 + Math.random() * 280;
    // Bold variation: some cracks are chunky (4–6px), some hairline (1–2px)
    const width  = Math.random() < 0.4
                   ? 3.5 + Math.random() * 2.5   // bold crack
                   : 0.8 + Math.random() * 1.2;  // fine crack
    drawCrack(x, y, angle, length, width, 0);
  }
}

drawKintsugi();
window.addEventListener("resize", drawKintsugi);

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
