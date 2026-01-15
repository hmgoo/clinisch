

document.addEventListener("DOMContentLoaded", () => {
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
  if (typeof setupRoadmap === "function") {
    setupRoadmap();
  }
  if (typeof setupWorkHero === "function") {
    setupWorkHero();
  }

  const initialLanguage = getInitialLanguage();
  applyLanguage(initialLanguage);
  setupLanguageToggle();
  setupRouter();
  setupSwipeNavigation();

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const bgShapes = document.querySelector('.bg-shapes');
  if (bgShapes && !prefersReduced) {
    requestAnimationFrame(() => {
      setTimeout(() => bgShapes.classList.add('animate'), 50);
    });
  }

  const applyPendingRadii = () => {
    if (!bgShapes) {
      return;
    }

    bgShapes.dataset.bgReady = "1";
    if (pendingBgRadii) {
      applyBgRadii(bgShapes, pendingBgRadii);
      pendingBgRadii = null;
    }
  };

  if (bgShapes && prefersReduced) {
    applyPendingRadii();
  }

  if (!prefersReduced && bgShapes) {
    const wraps = bgShapes.querySelectorAll('.shape-wrap');
    const previewOffset = 2000;

    if (!wraps.length) {
      applyPendingRadii();
    }

    wraps.forEach((wrap) => {
      const onEnd = (ev) => {
        if (ev.propertyName !== 'transform') return;
        const shape = wrap.querySelector('.shape');
        if (shape) shape.classList.add('arrived');
        wrap.removeEventListener('transitionend', onEnd);
      };

      requestAnimationFrame(() => wrap.addEventListener('transitionend', onEnd));
    });

    const primaryWrap = wraps[0];
    if (primaryWrap) {
      const duration = 3000;
      const delay = 200;
      const triggerAfter = Math.max(duration + delay - previewOffset, 0);
      setTimeout(applyPendingRadii, triggerAfter);
    }
  }

  const applyStagger = (containerSelector, childSelector, options = {}) => {
    const { base = 0, step = 0.08, max = 0.8 } = options;
    const container = document.querySelector(containerSelector);

    if (!container) return;

    const children = container.querySelectorAll(childSelector);
    children.forEach((el, i) => {
      const delay = Math.min(base + i * step, max);
      el.style.setProperty('--delay', `${delay}s`);
    });
  };

  if (!prefersReduced) {

    applyStagger('.hero', '.reveal', { base: 0, step: 0.06 });

    applyStagger('.service-grid', '.service-card', { base: 0.04, step: 0.06 });

    applyStagger('.panel-grid', '.panel-tile', { base: 0.08, step: 0.05 });
  }

});


