
const setupRoadmap = () => {
  const section = document.querySelector(".roadmap");

  if (!section) {
    return;
  }

  const cards = section.querySelectorAll(".roadmap-card");

  if (!cards.length) {
    return;
  }

  const prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      cards.forEach((card) => card.classList.add("is-visible"));
      obs.disconnect();
    });
  }, { threshold: 0.2 });

  observer.observe(section);
};
