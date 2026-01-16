

const BG_SHAPE_RADII = {
  home: {
    sun: "58% 42% 55% 45% / 52% 45% 55% 48%",
    sky: "44% 56% 52% 48% / 60% 40% 54% 46%",
    sand: "62% 38% 50% 50% / 48% 52% 44% 56%",
    slate: "46% 54% 58% 42% / 52% 48% 60% 40%"
  },
  about: {
    sun: "46% 54% 52% 48% / 58% 42% 52% 48%",
    sky: "52% 48% 56% 44% / 44% 56% 50% 50%",
    sand: "58% 42% 48% 52% / 50% 50% 58% 42%",
    slate: "44% 56% 54% 46% / 60% 40% 48% 52%"
  },
  services: {
    sun: "52% 48% 44% 56% / 46% 58% 42% 54%",
    sky: "56% 44% 60% 40% / 48% 52% 44% 56%",
    sand: "50% 50% 58% 42% / 42% 58% 46% 54%",
    slate: "62% 38% 46% 54% / 54% 46% 52% 48%"
  },
  skills: {
    sun: "42% 58% 50% 50% / 54% 46% 58% 42%",
    sky: "54% 46% 62% 38% / 46% 54% 50% 50%",
    sand: "48% 52% 44% 56% / 60% 40% 52% 48%",
    slate: "58% 42% 46% 54% / 44% 56% 58% 42%"
  },
  contact: {
    sun: "54% 46% 56% 44% / 48% 52% 44% 56%",
    sky: "46% 54% 52% 48% / 58% 42% 52% 48%",
    sand: "60% 40% 50% 50% / 46% 54% 60% 40%",
    slate: "50% 50% 62% 38% / 52% 48% 44% 56%"
  }
};

let pendingBgRadii = null;

const applyBgRadii = (bg, radii) => {
  Object.entries(radii).forEach(([name, value]) => {
    const shape = bg.querySelector(`.shape-${name}`);
    if (shape) {
      shape.style.borderRadius = value;
    }
  });
};

const updateBgState = (routeKey) => {
  const bg = document.querySelector(".bg-shapes");

  if (!bg) {
    return;
  }

  const key = routeKey || "home";
  bg.dataset.bgState = key;

  const radii = BG_SHAPE_RADII[key] || BG_SHAPE_RADII.home;
  const isReady = bg.dataset.bgReady === "1";

  if (!isReady) {
    pendingBgRadii = radii;
    return;
  }

  applyBgRadii(bg, radii);
};




