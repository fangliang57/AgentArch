(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const progress = document.querySelector(".page-progress span");
  const canvas = document.querySelector("#signal-canvas");
  const kvStage = document.querySelector("[data-kv-stage]");
  const kvFrame = kvStage?.querySelector(".kv-frame");
  const form = document.querySelector("#application-form");
  const dialog = document.querySelector("#review-dialog");
  const saveButton = document.querySelector("[data-save-draft]");
  const saveStatus = document.querySelector("[data-save-status]");
  const draftStatus = document.querySelector(".draft-status");
  const tweaksTrigger = document.querySelector(".tweaks-trigger");
  const tweaksPanel = document.querySelector("#tweaks-panel");
  const closeTweaks = document.querySelector("[data-close-tweaks]");
  const gridToggle = document.querySelector("[data-grid-toggle]");
  const motionToggle = document.querySelector("[data-motion-toggle]");
  const architectureScenes = [...document.querySelectorAll("[data-architecture-scene]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const draftKey = "compute-infinite-application-v1";
  const spectrumTheme = body.classList.contains("theme-spectrum");
  const signalPalette = [
    [49, 87, 200],
    [70, 104, 210],
    [38, 72, 170],
    [49, 87, 200],
    [86, 116, 214],
    [38, 72, 170],
  ];

  let animationFrame = 0;
  let scrollUpdateFrame = 0;
  let points = [];

  const updateChrome = () => {
    const scrollable = Math.max(1, root.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / scrollable));
    progress.style.transform = `scaleX(${ratio})`;
    header.classList.toggle("is-compact", window.scrollY > 28);
  };

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -7%" },
  );

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  const resizeCanvas = () => {
    if (!canvas) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);
    const count = Math.max(20, Math.min(64, Math.floor(rect.width / 24)));
    points = Array.from({ length: count }, (_, index) => ({
      x: ((index * 137.5) % count) / count,
      y: ((index * 79.3) % count) / count,
      vx: (Math.sin(index * 2.1) * 0.00008) / ratio,
      vy: (Math.cos(index * 1.7) * 0.00006) / ratio,
    }));
  };

  const drawSignal = () => {
    if (!canvas || body.classList.contains("motion-off") || reduceMotion.matches) return;
    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    context.clearRect(0, 0, width, height);

    points.forEach((point, index) => {
      point.x = (point.x + point.vx + 1) % 1;
      point.y = (point.y + point.vy + 1) % 1;
      const x = point.x * width;
      const y = point.y * height;

      context.beginPath();
      context.arc(x, y, index % 7 === 0 ? 1.8 : 0.8, 0, Math.PI * 2);
      if (spectrumTheme) {
        const [red, green, blue] = signalPalette[index % signalPalette.length];
        const alpha = index % 7 === 0 ? 0.52 : 0.2;
        context.fillStyle = `rgba(${red},${green},${blue},${alpha})`;
      } else {
        context.fillStyle = index % 7 === 0 ? "rgba(244,244,239,.6)" : "rgba(244,244,239,.22)";
      }
      context.fill();

      const next = points[(index + 7) % points.length];
      const nx = next.x * width;
      const ny = next.y * height;
      const distance = Math.hypot(nx - x, ny - y);
      if (distance < width * 0.18) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(nx, ny);
        if (spectrumTheme) {
          const [red, green, blue] = signalPalette[(index + 1) % signalPalette.length];
          context.strokeStyle = `rgba(${red},${green},${blue},.09)`;
        } else {
          context.strokeStyle = "rgba(244,244,239,.07)";
        }
        context.lineWidth = 1;
        context.stroke();
      }
    });

    animationFrame = window.requestAnimationFrame(drawSignal);
  };

  const restartSignal = () => {
    window.cancelAnimationFrame(animationFrame);
    if (!body.classList.contains("motion-off") && !reduceMotion.matches) drawSignal();
  };

  const updateArchitectureScenes = () => {
    const staticMode = body.classList.contains("motion-off") || reduceMotion.matches;
    const viewportHeight = window.innerHeight;

    architectureScenes.forEach((scene) => {
      if (staticMode) {
        scene.style.setProperty("--scene-opacity", "0.1");
        scene.style.setProperty("--scene-y", "0px");
        scene.style.setProperty("--scene-scale", "1");
        scene.style.setProperty("--scene-rotate", "0deg");
        scene.style.setProperty("--scene-dash", "0");
        scene.style.setProperty("--scene-orbit-dash", "0");
        scene.style.setProperty("--node-opacity", "0.72");
        scene.style.setProperty("--node-scale", "1");
        scene.style.setProperty("--rack-x", "0px");
        return;
      }

      const section = scene.closest("section");
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      const travel = viewportHeight + Math.min(bounds.height, viewportHeight) * 0.85;
      const rawProgress = (viewportHeight - bounds.top) / Math.max(1, travel);
      const progress = Math.min(1, Math.max(0, rawProgress));
      const eased = progress * progress * (3 - 2 * progress);
      const nodeProgress = Math.min(1, Math.max(0, (eased - 0.14) / 0.86));

      scene.style.setProperty("--scene-opacity", (eased * 0.13).toFixed(3));
      scene.style.setProperty("--scene-y", `${((1 - eased) * 72).toFixed(1)}px`);
      scene.style.setProperty("--scene-scale", (0.9 + eased * 0.1).toFixed(3));
      scene.style.setProperty("--scene-rotate", `${((1 - eased) * -2).toFixed(2)}deg`);
      scene.style.setProperty("--scene-dash", `${Math.round((1 - eased) * 920)}`);
      scene.style.setProperty("--scene-orbit-dash", `${Math.round((1 - eased) * 560)}`);
      scene.style.setProperty("--node-opacity", (nodeProgress * 0.76).toFixed(3));
      scene.style.setProperty("--node-scale", (0.72 + nodeProgress * 0.28).toFixed(3));
      scene.style.setProperty("--rack-x", `${((1 - eased) * -22).toFixed(1)}px`);
    });
  };

  const queueScrollUpdate = () => {
    if (scrollUpdateFrame) return;
    scrollUpdateFrame = window.requestAnimationFrame(() => {
      scrollUpdateFrame = 0;
      updateChrome();
      updateArchitectureScenes();
    });
  };

  const updateKvParallax = (event) => {
    if (!kvStage || !kvFrame || reduceMotion.matches || body.classList.contains("motion-off")) return;
    const bounds = kvStage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    kvStage.style.setProperty("--kv-x", `${(x * -14).toFixed(2)}px`);
    kvStage.style.setProperty("--kv-y", `${(y * -10).toFixed(2)}px`);
  };

  const resetKvParallax = () => {
    kvStage?.style.setProperty("--kv-x", "0px");
    kvStage?.style.setProperty("--kv-y", "0px");
  };

  const formToObject = () => {
    const data = new FormData(form);
    return Object.fromEntries(data.entries());
  };

  const showSaved = (date = new Date()) => {
    const time = new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
    saveStatus.textContent = `草稿已保存 / ${time}`;
    draftStatus.classList.add("is-saved");
  };

  const saveDraft = () => {
    const payload = { savedAt: Date.now(), fields: formToObject() };
    localStorage.setItem(draftKey, JSON.stringify(payload));
    showSaved(new Date(payload.savedAt));
  };

  const restoreDraft = () => {
    const raw = localStorage.getItem(draftKey);
    if (!raw) return;

    try {
      const payload = JSON.parse(raw);
      Object.entries(payload.fields || {}).forEach(([name, value]) => {
        const elements = form.elements.namedItem(name);
        if (!elements) return;
        if (elements instanceof RadioNodeList) {
          elements.value = value;
        } else {
          elements.value = value;
        }
      });
      showSaved(new Date(payload.savedAt));
    } catch {
      localStorage.removeItem(draftKey);
    }
  };

  const setTweaksOpen = (open) => {
    tweaksPanel.classList.toggle("is-open", open);
    tweaksPanel.setAttribute("aria-hidden", String(!open));
    tweaksTrigger.setAttribute("aria-expanded", String(open));
  };

  saveButton?.addEventListener("click", saveDraft);

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    saveDraft();
    dialog?.showModal();
  });

  tweaksTrigger?.addEventListener("click", () => {
    setTweaksOpen(!tweaksPanel.classList.contains("is-open"));
  });

  closeTweaks?.addEventListener("click", () => setTweaksOpen(false));

  gridToggle?.addEventListener("change", () => {
    body.classList.toggle("no-grid", !gridToggle.checked);
  });

  motionToggle?.addEventListener("change", () => {
    body.classList.toggle("motion-off", !motionToggle.checked);
    resetKvParallax();
    restartSignal();
    updateArchitectureScenes();
  });

  kvStage?.addEventListener("pointermove", updateKvParallax, { passive: true });
  kvStage?.addEventListener("pointerleave", resetKvParallax);

  reduceMotion.addEventListener?.("change", () => {
    restartSignal();
    updateArchitectureScenes();
  });
  window.addEventListener("scroll", queueScrollUpdate, { passive: true });
  window.addEventListener("resize", () => {
    resizeCanvas();
    restartSignal();
    updateArchitectureScenes();
  });

  restoreDraft();
  updateChrome();
  resizeCanvas();
  updateArchitectureScenes();
  restartSignal();
})();
