

const isModalOpen = () => {
  return !!document.querySelector(".footer-modal.is-open");
};

const isInteractiveTarget = (target) => {
  if (!target || !(target instanceof Element)) {
    return false;
  }

  return !!target.closest(
    "a, button, input, textarea, select, [role=\"button\"]"
  );
};

const isMobileViewport = () => window.innerWidth <= MOBILE_BREAKPOINT;

const getTouchPoint = (touchList) => {
  if (!touchList || !touchList.length) {
    return null;
  }

  return touchList[0];
};

const shouldIgnoreSwipeStart = (target) => {
  if (isModalOpen()) {
    return true;
  }

  return isInteractiveTarget(target);
};

const updateSwipeStart = (state, event) => {
  if (!isMobileViewport() || shouldIgnoreSwipeStart(event.target)) {
    state.ignore = true;
    return;
  }

  const touch = getTouchPoint(event.touches);
  if (!touch) {
    return;
  }

  state.ignore = false;
  state.isHorizontal = false;
  state.startX = touch.clientX;
  state.startY = touch.clientY;
};

const updateSwipeMove = (state, event) => {
  if (!isMobileViewport() || state.ignore) {
    return;
  }

  const touch = getTouchPoint(event.touches);
  if (!touch) {
    return;
  }

  const dx = touch.clientX - state.startX;
  const dy = touch.clientY - state.startY;
  if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > SWIPE_MAX_VERTICAL) {
    state.ignore = true;
    state.isHorizontal = false;
    return;
  }

  if (!state.isHorizontal && Math.abs(dx) > Math.abs(dy)) {
    if (Math.abs(dx) > SWIPE_LOCK_DISTANCE) {
      state.isHorizontal = true;
    }
  }

  if (state.isHorizontal && event.cancelable) {
    event.preventDefault();
  }
};

const handleSwipeEnd = (state, event) => {
  if (state.ignore || !currentRouteKey || !isMobileViewport()) {
    return;
  }

  const touch = getTouchPoint(event.changedTouches);
  if (!touch) {
    return;
  }

  const dx = touch.clientX - state.startX;
  const dy = touch.clientY - state.startY;
  if (Math.abs(dx) < SWIPE_MIN_DISTANCE) {
    return;
  }

  if (Math.abs(dy) > SWIPE_MAX_VERTICAL) {
    return;
  }

  const direction = dx < 0 ? "forward" : "backward";
  const nextRoute = getNextRoute(currentRouteKey, direction);
  if (!nextRoute) {
    return;
  }

  changeRoute(nextRoute, true);
};

const setupSwipeNavigation = () => {
  const state = {
    startX: 0,
    startY: 0,
    ignore: false,
    isHorizontal: false
  };

  window.addEventListener("touchstart", (event) => {
    updateSwipeStart(state, event);
  }, { passive: true });

  window.addEventListener("touchmove", (event) => {
    updateSwipeMove(state, event);
  }, { passive: false });

  window.addEventListener("touchend", (event) => {
    handleSwipeEnd(state, event);
  }, { passive: true });
};


