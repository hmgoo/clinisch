const setupHeroVisible = () => {
  const heroes = document.querySelectorAll(
    ".work-hero-visual, .clients-hero-visual, .contact-hero-visual, .roadmap-hero-visual"
  );

  if (!heroes.length) {
    return;
  }

  const prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    heroes.forEach((hero) => hero.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  heroes.forEach((hero) => observer.observe(hero));
};
