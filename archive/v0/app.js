(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const progress = document.querySelector(".page-progress span");
  const canvas = document.querySelector("#signal-canvas");
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
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const draftKey = "compute-infinite-application-v0";

  let animationFrame = 0;
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
      context.fillStyle = index % 7 === 0 ? "rgba(244,244,239,.6)" : "rgba(244,244,239,.22)";
      context.fill();

      const next = points[(index + 7) % points.length];
      const nx = next.x * width;
      const ny = next.y * height;
      const distance = Math.hypot(nx - x, ny - y);
      if (distance < width * 0.18) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(nx, ny);
        context.strokeStyle = "rgba(244,244,239,.07)";
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
    restartSignal();
  });

  reduceMotion.addEventListener?.("change", restartSignal);
  window.addEventListener("scroll", updateChrome, { passive: true });
  window.addEventListener("resize", () => {
    resizeCanvas();
    restartSignal();
  });

  restoreDraft();
  updateChrome();
  resizeCanvas();
  restartSignal();
})();
