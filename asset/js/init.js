

const setupBaseUI = () => {
  renderHeader();
  renderFooter();
  updateFooterYear();
  setupFooterModals();
  blockUserActions();
  syncHeaderOffset();
  setupSmoothScroll();
  setupTypingEffect();
  syncHeroVisualHeight();
  setupMobileNav();
  if (typeof setupHeroVisible === "function") {
    setupHeroVisible();
  }
};

const setupLanguageAndRouting = () => {
  const initialLanguage = getInitialLanguage();
  applyLanguage(initialLanguage);
  setupLanguageToggle();
  setupRouter();
  setupSwipeNavigation();
};

const getPrefersReducedMotion = () => {
  if (!window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const applyPendingRadii = (bgShapes) => {
  if (!bgShapes) {
    return;
  }
  bgShapes.dataset.bgReady = "1";
  if (pendingBgRadii) {
    applyBgRadii(bgShapes, pendingBgRadii);
    pendingBgRadii = null;
  }
};

const setupBgShapesAnimation = (bgShapes) => {
  const wraps = bgShapes.querySelectorAll(".shape-wrap");
  const previewOffset = 2000;

  if (!wraps.length) {
    applyPendingRadii(bgShapes);
  }

  wraps.forEach((wrap) => {
    const onEnd = (ev) => {
      if (ev.propertyName !== "transform") {
        return;
      }
      const shape = wrap.querySelector(".shape");
      if (shape) {
        shape.classList.add("arrived");
      }
      wrap.removeEventListener("transitionend", onEnd);
    };

    requestAnimationFrame(() => {
      wrap.addEventListener("transitionend", onEnd);
    });
  });

  const primaryWrap = wraps[0];
  if (primaryWrap) {
    const duration = 3000;
    const delay = 200;
    const triggerAfter = Math.max(duration + delay - previewOffset, 0);
    setTimeout(() => applyPendingRadii(bgShapes), triggerAfter);
  }
};

const setupBgShapes = (prefersReduced) => {
  const bgShapes = document.querySelector(".bg-shapes");
  if (!bgShapes) {
    return;
  }
  if (!prefersReduced) {
    requestAnimationFrame(() => {
      setTimeout(() => bgShapes.classList.add("animate"), 50);
    });
    setupBgShapesAnimation(bgShapes);
    return;
  }
  applyPendingRadii(bgShapes);
};

const applyStagger = (containerSelector, childSelector, options = {}) => {
  const { base = 0, step = 0.08, max = 0.8 } = options;
  const container = document.querySelector(containerSelector);

  if (!container) {
    return;
  }

  const children = container.querySelectorAll(childSelector);
  children.forEach((el, i) => {
    const delay = Math.min(base + i * step, max);
    el.style.setProperty("--delay", `${delay}s`);
  });
};

const setupRevealStagger = (prefersReduced) => {
  if (prefersReduced) {
    return;
  }

  applyStagger(".hero", ".reveal", { base: 0, step: 0.06 });
  applyStagger(".service-grid", ".service-card", {
    base: 0.04,
    step: 0.06
  });
  applyStagger(".panel-grid", ".panel-tile", { base: 0.08, step: 0.05 });
};

document.addEventListener("DOMContentLoaded", () => {
  setupBaseUI();
  setupLanguageAndRouting();
  const prefersReduced = getPrefersReducedMotion();
  setupBgShapes(prefersReduced);
  setupRevealStagger(prefersReduced);
});


