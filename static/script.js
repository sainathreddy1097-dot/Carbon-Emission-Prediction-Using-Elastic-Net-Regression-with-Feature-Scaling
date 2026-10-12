/* =========================================================
   CARBONWISE — HIGH-RES ENVIRONMENT + APP INTERACTIONS
   No external animation library required.
========================================================= */

(() => {
  "use strict";

  const canvas = document.getElementById("carbonCanvas");
  const ctx = canvas?.getContext("2d", { alpha: true });
  const root = document.documentElement;

  if (!canvas || !ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let leaves = [];
  let animationId = 0;
  let lastTime = 0;
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isMobile = () => window.innerWidth < 720;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    // Higher DPI keeps the background detail crisp on large screens while staying efficient.
    dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 1.75 : 3.2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createParticles();
    createLeaves();
  }

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 30 + Math.random() * 100;
      this.size = Math.random() * 1.7 + 0.35;
      this.speed = Math.random() * 0.25 + 0.06;
      this.drift = (Math.random() - 0.5) * 0.16;
      this.phase = Math.random() * Math.PI * 2;
      this.alpha = Math.random() * 0.42 + 0.06;
      this.green = Math.random() > 0.78;
    }

    update(dt, time) {
      if (reducedMotion) return;
      this.y -= this.speed * dt;
      this.x += this.drift * dt + Math.sin(time * 0.00035 + this.phase) * 0.08 * dt;

      const dx = this.x - (width * 0.5 + mouseX * 0.12);
      const dy = this.y - (height * 0.45 + mouseY * 0.08);
      const distance = Math.hypot(dx, dy);
      if (distance < 180) {
        const force = (1 - distance / 180) * 0.16;
        this.x += dx * force * 0.01 * dt;
        this.y += dy * force * 0.006 * dt;
      }

      if (this.y < -25 || this.x < -50 || this.x > width + 50) this.reset(false);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.green
        ? `rgba(163,255,114,${this.alpha})`
        : `rgba(170,230,190,${this.alpha * 0.72})`;
      ctx.fill();
    }
  }

  class Leaf {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 30;
      this.size = Math.random() * 5 + 2.5;
      this.speed = Math.random() * 0.25 + 0.08;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.015;
      this.phase = Math.random() * Math.PI * 2;
      this.alpha = Math.random() * 0.16 + 0.035;
    }

    update(dt, time) {
      if (reducedMotion) return;
      this.y -= this.speed * dt;
      this.phase += 0.006 * dt;
      this.angle += this.spin * dt;
      this.x += Math.sin(this.phase) * 0.22 * dt;
      if (this.y < -30) this.reset(false);
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.quadraticCurveTo(this.size * 1.6, -this.size * 0.25, 0, this.size);
      ctx.quadraticCurveTo(-this.size * 1.6, -this.size * 0.25, 0, -this.size);
      ctx.fillStyle = `rgba(163,255,114,${this.alpha})`;
      ctx.fill();
      ctx.restore();
    }
  }

  function createParticles() {
    const count = isMobile() ? 80 : Math.min(270, Math.round((width * height) / 7000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function createLeaves() {
    const count = isMobile() ? 10 : 24;
    leaves = Array.from({ length: count }, () => new Leaf());
  }

  function drawConnections() {
    if (isMobile()) return;
    const maxDistance = 130;
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.08;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(150,255,175,${opacity})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }
  }

  function animate(time) {
    const dt = Math.min((time - lastTime) / 16.67 || 1, 2);
    lastTime = time;

    ctx.clearRect(0, 0, width, height);

    // Smooth mouse parallax rather than moving objects directly with the cursor.
    mouseX += (targetMouseX - mouseX) * 0.045;
    mouseY += (targetMouseY - mouseY) * 0.045;
    root.style.setProperty("--mx", `${mouseX * 0.08}px`);

    particles.forEach((particle) => {
      particle.update(dt, time);
      particle.draw();
    });

    drawConnections();

    leaves.forEach((leaf) => {
      leaf.update(dt, time);
      leaf.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resizeCanvas, { passive: true });
  window.addEventListener("pointermove", (event) => {
    targetMouseX = (event.clientX / Math.max(width, 1) - 0.5) * 2;
    targetMouseY = (event.clientY / Math.max(height, 1) - 0.5) * 2;
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    targetMouseX = 0;
    targetMouseY = 0;
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(animationId);
    else { lastTime = performance.now(); animationId = requestAnimationFrame(animate); }
  });

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  motionQuery.addEventListener?.("change", (event) => { reducedMotion = event.matches; });

  resizeCanvas();
  animationId = requestAnimationFrame(animate);

  // ---------- Generated forest ----------
  const forest = document.getElementById("forest");
  if (forest) {
    const treeCount = isMobile() ? 18 : 34;
    for (let i = 0; i < treeCount; i += 1) {
      const tree = document.createElement("div");
      tree.className = "tree";
      tree.style.setProperty("--tree-width", `${18 + Math.random() * 28}px`);
      tree.style.setProperty("--tree-height", `${58 + Math.random() * 115}px`);
      tree.style.animationDelay = `${-Math.random() * 5}s`;
      forest.appendChild(tree);
    }
  }

  // ---------- Mobile navigation ----------
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }));
  }

  // ---------- Scroll reveal ----------
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  // ---------- Range controls ----------
  const rangeConfig = {
    population: { output: "populationValue", suffix: " people" },
    electricity: { output: "electricityValue", suffix: " MWh/month" },
    fuel: { output: "fuelValue", suffix: " litres/month" },
    transport: { output: "transportValue", suffix: " vehicle-km/month" }
  };

  function formatValue(value) { return Number(value).toLocaleString("en-IN"); }

  Object.entries(rangeConfig).forEach(([id, config]) => {
    const input = document.getElementById(id);
    const output = document.getElementById(config.output);
    if (!input || !output) return;
    const update = () => {
      const min = Number(input.min);
      const max = Number(input.max);
      const value = Number(input.value);
      const percent = ((value - min) / (max - min)) * 100;
      input.style.setProperty("--fill", `${percent}%`);
      output.textContent = `${formatValue(value)}${config.suffix}`;
    };
    input.addEventListener("input", update);
    update();
  });

  // ---------- Prediction UI ----------
  const form = document.getElementById("emissionForm");
  const predictBtn = document.getElementById("predictBtn");

  function animateNumber(element, target) {
    const duration = 950;
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = (target * eased).toLocaleString("en-IN", { maximumFractionDigits: 2 });
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function setBreakdown(inputs) {
    // The bars are an input snapshot, not a scientific contribution calculation.
    const scaled = [
      inputs.population / 1000,
      inputs.electricity / 100000,
      inputs.fuel / 50000,
      inputs.transport / 5000000
    ];
    const ids = ["Population", "Electricity", "Fuel", "Transport"];
    const keys = ["population", "electricity", "fuel", "transport"];
    scaled.forEach((value, index) => {
      const widthPercent = Math.max(2, Math.min(100, value * 100));
      document.getElementById(`bar${ids[index]}`).style.width = `${widthPercent}%`;
      document.getElementById(`bd${ids[index]}`).textContent = formatValue(inputs[keys[index]]);
    });
  }

  function categoryClass(category) {
    const normalized = String(category).toLowerCase().replace(/\s+/g, "-");
    return `category ${normalized}`;
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const inputs = {
      population: Number(document.getElementById("population").value),
      electricity: Number(document.getElementById("electricity").value),
      fuel: Number(document.getElementById("fuel").value),
      transport: Number(document.getElementById("transport").value)
    };

    predictBtn.disabled = true;
    predictBtn.innerHTML = "<span>⏳</span> Predicting...";

    try {
      const response = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Prediction request failed.");

      const prediction = Number(data.prediction);
      if (!Number.isFinite(prediction)) throw new Error("The server returned an invalid prediction.");

      animateNumber(document.getElementById("prediction"), prediction);
      document.getElementById("unit").textContent = data.unit || "tonnes CO₂e / month";

      const category = document.getElementById("category");
      category.textContent = data.category || "Estimated";
      category.className = categoryClass(data.category || "Estimated");

      // Visual gauge only — it is not a scientific scale.
      const angle = Math.max(0, Math.min(360, (prediction / 300) * 360));
      document.getElementById("gauge").style.setProperty("--angle", `${angle}deg`);
      document.getElementById("gaugeText").textContent = `${Math.round(angle / 3.6)}%`;

      setBreakdown(inputs);
    } catch (error) {
      window.alert(`Could not get prediction.\n\n${error.message}\n\nMake sure app.py is running and the model exists.`);
    } finally {
      predictBtn.disabled = false;
      predictBtn.innerHTML = "<span>🌿</span> Predict My Area Carbon Emissions <b>↗</b>";
    }
  });
})();
