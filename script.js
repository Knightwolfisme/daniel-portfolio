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

  // Force nodes into a grid-like spread so cracks cover the whole canvas
  // then nudge each one randomly so it doesn't look mechanical
  function spreadNodes() {
    const nodes = [];
    const cols = 4, rows = 3;
    const cellW = W / cols;
    const cellH = H / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        nodes.push({
          x: cellW * c + cellW * (0.2 + Math.random() * 0.6),
          y: cellH * r + cellH * (0.2 + Math.random() * 0.6)
        });
      }
    }

    // Add 4 edge entry points so cracks bleed to screen edges
    nodes.push({ x: Math.random() * W,  y: 0 });
    nodes.push({ x: Math.random() * W,  y: H });
    nodes.push({ x: 0,                  y: Math.random() * H });
    nodes.push({ x: W,                  y: Math.random() * H });

    return nodes;
  }

  function drawVein(x1, y1, x2, y2, width, alpha) {
    const dx  = x2 - x1;
    const dy  = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) return;

    const px = -dy / len;
    const py =  dx / len;

    const b1 = (Math.random() - 0.5) * len * 0.5;
    const b2 = (Math.random() - 0.5) * len * 0.4;

    const cp1x = x1 + dx * 0.3 + px * b1;
    const cp1y = y1 + dy * 0.3 + py * b1;
    const cp2x = x1 + dx * 0.7 + px * b2;
    const cp2y = y1 + dy * 0.7 + py * b2;

    const draw = (strokeStyle, lineWidth, globalAlpha) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth   = lineWidth;
      ctx.lineCap     = "round";
      ctx.globalAlpha = globalAlpha;
      ctx.stroke();
    };

    // Layer 1: wide diffuse glow
    draw("rgba(180, 130, 20, 0.08)",  width * 18, 1);
    // Layer 2: mid glow
    draw("rgba(210, 160, 40, 0.2)",   width * 7,  1);
    // Layer 3: core gold
    draw("#c9a84c",                   width,      alpha);
    // Layer 4: bright hot centre
    draw("rgba(255, 230, 130, 0.7)",  width * 0.3, alpha * 0.8);

    ctx.globalAlpha = 1;
  }

  const nodes = spreadNodes();

  // Connect nodes — each to its 2–3 nearest neighbours
  const used = new Set();
  nodes.forEach((a, i) => {
    const nearest = nodes
      .map((b, j) => ({ j, d: Math.hypot(b.x - a.x, b.y - a.y) }))
      .filter(o => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2 + Math.floor(Math.random() * 2));

    nearest.forEach(({ j }) => {
      const key = `${Math.min(i,j)}-${Math.max(i,j)}`;
      if (used.has(key)) return;
      used.add(key);

      const b       = nodes[j];
      const isMajor = Math.random() < 0.5;
      const width   = isMajor ? 2.2 + Math.random() * 1.6 : 0.8 + Math.random() * 0.9;
      const alpha   = isMajor ? 0.9 : 0.55 + Math.random() * 0.25;

      drawVein(a.x, a.y, b.x, b.y, width, alpha);

      // Sub-branch from midpoint ~35% of the time
      if (Math.random() < 0.35) {
        const mid = {
          x: (a.x + b.x) / 2 + (Math.random() - 0.5) * 120,
          y: (a.y + b.y) / 2 + (Math.random() - 0.5) * 120
        };
        const target = nodes[Math.floor(Math.random() * nodes.length)];
        drawVein(mid.x, mid.y, target.x, target.y, width * 0.5, alpha * 0.6);
      }
    });
  });
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
