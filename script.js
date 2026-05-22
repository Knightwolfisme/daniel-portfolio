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

  const W = canvas.width;
  const H = canvas.height;

  // Spawn points around the edges + a few internal nodes
  // Cracks travel between these, forming enclosed regions
  function edgePoint() {
    const edge = Math.floor(Math.random() * 4);
    if (edge === 0) return { x: Math.random() * W, y: 0 };
    if (edge === 1) return { x: W, y: Math.random() * H };
    if (edge === 2) return { x: Math.random() * W, y: H };
    return { x: 0, y: Math.random() * H };
  }

  // Build a set of nodes (edge + internal) that cracks connect between
  const nodes = [];
  for (let i = 0; i < 6; i++) nodes.push(edgePoint());
  for (let i = 0; i < 5; i++) nodes.push({
    x: W * 0.15 + Math.random() * W * 0.7,
    y: H * 0.15 + Math.random() * H * 0.7
  });

  // Draw a flowing crack between two points using cubic bezier
  function drawVein(x1, y1, x2, y2, width, alpha) {
    // Control points offset perpendicular to the line for organic curves
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);

    // Perpendicular direction
    const px = -dy / len;
    const py =  dx / len;

    // Random curve bulge
    const bulge1 = (Math.random() - 0.5) * len * 0.45;
    const bulge2 = (Math.random() - 0.5) * len * 0.35;

    const cp1x = x1 + dx * 0.3 + px * bulge1;
    const cp1y = y1 + dy * 0.3 + py * bulge1;
    const cp2x = x1 + dx * 0.7 + px * bulge2;
    const cp2y = y1 + dy * 0.7 + py * bulge2;

    // --- Outer glow (wide, soft) ---
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    ctx.strokeStyle = "rgba(255, 200, 80, 0.12)";
    ctx.lineWidth   = width * 7;
    ctx.lineCap     = "round";
    ctx.globalAlpha = 1;
    ctx.shadowColor = "rgba(201,168,76,0.0)";
    ctx.shadowBlur  = 0;
    ctx.stroke();

    // --- Mid glow ---
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y,

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
