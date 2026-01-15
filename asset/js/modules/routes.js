

const ROUTES = [
  { key: "home", path: "/", order: 0 },
  { key: "about", path: "/about/", order: 1 },
  { key: "services", path: "/services/", order: 2 },
  { key: "approach", path: "/skills/", order: 3 },
  { key: "contact", path: "/contact/", order: 4 }
];

let routeStage = null;
let routePanels = new Map();
let currentRouteKey = null;
let heightTimer = null;

const HEIGHT_TRANSITION_MS = 420;
const MOBILE_BREAKPOINT = 768;
const SWIPE_MIN_DISTANCE = 48;
const SWIPE_MAX_VERTICAL = 80;
const SWIPE_LOCK_DISTANCE = 12;
let basePrefix = "";

const normalizePath = (path) => {
  if (!path) {
    return "/";
  }

  const sanitized = path.split("?")[0].split("#")[0];
  let normalized = sanitized.replace(/\/index\.html$/, "/");

  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  if (normalized !== "/" && !normalized.endsWith("/")) {
    return `${normalized}/`;
  }

  return normalized;
};

const getRouteByKey = (key) => ROUTES.find((route) => route.key === key);

const getRouteFromPath = (pathname) => {
  const normalized = normalizePath(pathname || "/");
  const exact = ROUTES.find((route) => route.path === normalized);
  if (exact) {
    return exact;
  }

  const suffixMatch = ROUTES.find(
    (route) => route.path !== "/" && normalized.endsWith(route.path)
  );

  return suffixMatch || ROUTES[0];
};

const getBasePrefix = () => {
  const baseEl = document.querySelector("base");
  if (!baseEl) {
    return "";
  }

  const href = baseEl.getAttribute("href") || "/";
  const baseUrl = new URL(href, window.location.href);
  const normalized = normalizePath(baseUrl.pathname);

  if (normalized === "/") {
    return "";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
};

const getRouteUrl = (route) => {
  const prefix = basePrefix || "";
  return `${prefix}${route.path}`;
};

const getDirection = (currentKey, nextKey) => {
  const current = getRouteByKey(currentKey);
  const next = getRouteByKey(nextKey);

  if (!current) {
    return "forward";
  }

  return next.order >= current.order ? "forward" : "backward";
};

const setStageHeight = (panel) => {
  if (!routeStage || !panel) {
    return;
  }

  routeStage.style.height = `${panel.scrollHeight}px`;
};

const syncHeaderOffset = () => {
  const header = document.querySelector(".site-header");

  if (!header) {
    return;
  }

  const height = header.getBoundingClientRect().height;
  document.documentElement.style.setProperty(
    "--header-offset",
    `${height}px`
  );
};

const resetStageHeight = () => {
  if (!routeStage) {
    return;
  }

  routeStage.style.height = "auto";
};

const scheduleHeightReset = () => {
  if (heightTimer) {
    clearTimeout(heightTimer);
  }

  heightTimer = setTimeout(() => {
    resetStageHeight();
    heightTimer = null;
  }, HEIGHT_TRANSITION_MS);
};

const updateNavState = (activeKey) => {
  document.querySelectorAll("[data-route-link]").forEach((link) => {
    const key = link.dataset.routeKey;
    link.classList.toggle("is-active", key === activeKey);
  });
};

const openMobileNav = () => {
  document.body.classList.add("nav-open");
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-mobile-panel]");
  const overlay = document.querySelector("[data-mobile-overlay]");

  if (toggle) {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "메뉴 닫기");
    toggle.classList.add("is-open");
  }

  if (panel) {
    panel.setAttribute("aria-hidden", "false");
  }

  if (overlay) {
    overlay.setAttribute("aria-hidden", "false");
  }
};

const closeMobileNav = () => {
  document.body.classList.remove("nav-open");
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-mobile-panel]");
  const overlay = document.querySelector("[data-mobile-overlay]");

  if (toggle) {
    toggle.focus();
  }

  if (toggle) {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "메뉴 열기");
    toggle.classList.remove("is-open");
  }

  if (panel) {
    panel.setAttribute("aria-hidden", "true");
  }

  if (overlay) {
    overlay.setAttribute("aria-hidden", "true");
  }
};

const buildRoutePanels = () => {
  const stage = document.querySelector("[data-route-stage]");

  if (!stage) {
    return;
  }

  const sections = Array.from(stage.querySelectorAll("[data-route]"));
  const bucket = {};

  sections.forEach((section) => {
    const key = section.dataset.route || "home";
    bucket[key] = bucket[key] || [];
    bucket[key].push(section);
  });

  stage.textContent = "";
  routePanels = new Map();
  routeStage = stage;

  ROUTES.forEach((route) => {
    const items = bucket[route.key];

    if (!items || !items.length) {
      return;
    }

    const panel = document.createElement("div");
    panel.className = "route-panel";
    panel.dataset.routePanel = route.key;
    panel.style.display = "none";
    items.forEach((item) => panel.appendChild(item));
    stage.appendChild(panel);
    routePanels.set(route.key, panel);
  });
};

const hidePanel = (panel) => {
  if (!panel) {
    return;
  }

  panel.classList.remove("exit-to-left", "exit-to-right", "enter-active");
  panel.classList.remove("enter-from-left", "enter-from-right");
  panel.classList.remove("is-active");
  panel.style.display = "none";
  panel.setAttribute("aria-hidden", "true");
};

const showPanel = (panel, direction) => {
  if (!panel) {
    return;
  }

  panel.style.display = "block";
  panel.setAttribute("aria-hidden", "false");
  panel.dataset.enterDirection = direction;
  panel.classList.remove("exit-to-left", "exit-to-right");
  panel.classList.remove("enter-active");
  panel.classList.remove("enter-from-left", "enter-from-right");

  const startClass =
    direction === "backward" ? "enter-from-left" : "enter-from-right";

  panel.classList.add(startClass);

  requestAnimationFrame(() => {
    panel.classList.add("enter-active", "is-active");
    panel.classList.remove("enter-from-left", "enter-from-right");
  });
};

const changeRoute = (nextRoute, pushHistory = false) => {
  if (!nextRoute || !routeStage || !routePanels.size) {
    return;
  }

  const nextPanel = routePanels.get(nextRoute.key);
  const currentPanel = currentRouteKey
    ? routePanels.get(currentRouteKey)
    : null;

  if (!nextPanel) {
    return;
  }

  if (nextPanel === currentPanel) {
    if (pushHistory) {
      const targetPath = getRouteUrl(nextRoute);
      window.history.pushState({ path: targetPath }, "", targetPath);
    }

    window.scrollTo(0, 0);
    updateNavState(nextRoute.key);
    updateBgState(nextRoute.key);
    setStageHeight(nextPanel);
    scheduleHeightReset();
    currentRouteKey = nextRoute.key;
    if (typeof setupTypingEffect === "function") {
      setupTypingEffect();
    }
    return;
  }

  const direction = getDirection(currentRouteKey, nextRoute.key);
  routeStage.dataset.routeReveal = "off";
  if (currentPanel) {
    setStageHeight(currentPanel);
  }
  nextPanel.style.display = "block";
  setStageHeight(nextPanel);
  scheduleHeightReset();
  routeStage.classList.add("route-transition");
  showPanel(nextPanel, direction);

  if (currentPanel) {
    currentPanel.classList.remove("is-active");
    currentPanel.classList.remove("enter-from-left", "enter-from-right");
    const exitClass =
      direction === "backward" ? "exit-to-right" : "exit-to-left";
    currentPanel.classList.add(exitClass);

    currentPanel.addEventListener(
      "transitionend",
      () => hidePanel(currentPanel),
      { once: true }
    );
  }
  const onEnterEnd = () => {
    routeStage.classList.remove("route-transition");
  };
  nextPanel.addEventListener("transitionend", onEnterEnd, { once: true });
  setTimeout(onEnterEnd, HEIGHT_TRANSITION_MS + 200);

  if (pushHistory) {
    const targetPath = getRouteUrl(nextRoute);
    window.history.pushState({ path: targetPath }, "", targetPath);
  }

  window.scrollTo(0, 0);
  currentRouteKey = nextRoute.key;
  updateNavState(currentRouteKey);
  updateBgState(currentRouteKey);
  if (typeof setupTypingEffect === "function") {
    setupTypingEffect();
  }
};

const initRouteFromPath = () => {
  const initialRoute = getRouteFromPath(window.location.pathname);
  const panel = routePanels.get(initialRoute.key);

  if (panel) {
    panel.style.display = "block";
    panel.classList.add("is-active");
    panel.setAttribute("aria-hidden", "false");
    setStageHeight(panel);
    resetStageHeight();
  }

  currentRouteKey = initialRoute.key;
  updateNavState(currentRouteKey);
  updateBgState(currentRouteKey);
};

const setupRouteLinks = () => {
  document.querySelectorAll("[data-route-link]").forEach((link) => {
    const key = link.dataset.routeKey;
    if (key) {
      const route = getRouteByKey(key);
      if (route) {
        link.setAttribute("href", getRouteUrl(route));
      }
    }

    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href) {
        return;
      }

      const route = getRouteFromPath(href);
      event.preventDefault();
      changeRoute(route, true);
      if (document.body.classList.contains("nav-open")) {
        closeMobileNav();
      }
    });
  });
};

const setupMobileNav = () => {
  const toggle = document.querySelector("[data-nav-toggle]");

  if (!toggle) {
    return;
  }

  toggle.addEventListener("click", () => {
    if (document.body.classList.contains("nav-open")) {
      closeMobileNav();
      return;
    }

    openMobileNav();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      closeMobileNav();
    }
  });
};

const setupRouter = () => {
  basePrefix = getBasePrefix();
  buildRoutePanels();
  if (routeStage) {
    routeStage.dataset.routeReveal = "on";
  }
  const bg = document.querySelector(".bg-shapes");
  if (bg) {
    bg.dataset.bgReady = "0";
  }
  initRouteFromPath();
  setupRouteLinks();

  window.addEventListener("popstate", () => {
    const route = getRouteFromPath(window.location.pathname);
    changeRoute(route, false);
  });

  window.addEventListener("resize", () => {
    if (!currentRouteKey) {
      return;
    }

    syncHeaderOffset();
    const panel = routePanels.get(currentRouteKey);
    setStageHeight(panel);
    scheduleHeightReset();
  });
};

const getNextRoute = (currentKey, direction) => {
  const current = getRouteByKey(currentKey) || ROUTES[0];
  const nextIndex =
    direction === "forward" ? current.order + 1 : current.order - 1;

  return ROUTES.find((route) => route.order === nextIndex) || null;
};



