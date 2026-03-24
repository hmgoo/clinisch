

const setupBaseUI = () => {
  renderHeader();
  renderFooter();
  updateFooterYear();
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
  setupRevealStagger(prefersReduced);
});


