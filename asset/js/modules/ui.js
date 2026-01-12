

const blockUserActions = () => {
  const blockedEvents = [
    "copy",
    "cut",
    "paste",
    "contextmenu",
    "dragstart",
    "selectstart"
  ];

  blockedEvents.forEach((eventName) => {
    document.addEventListener(eventName, (event) => {
      event.preventDefault();
    });
  });

  document.querySelectorAll("img").forEach((image) => {
    image.setAttribute("draggable", "false");
  });
};

const getHeaderOffset = () => {
  const header = document.querySelector(".site-header");

  if (!header) {
    return 0;
  }

  return header.getBoundingClientRect().height;
};

const scrollToSection = (target) => {
  const headerOffset = getHeaderOffset();
  const targetOffset = target.getBoundingClientRect().top + window.pageYOffset;
  const finalOffset = Math.max(targetOffset - headerOffset - 12, 0);

  window.scrollTo({
    top: finalOffset,
    behavior: "smooth"
  });
};

const setupSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");

      if (!hash || hash === "#") {
        return;
      }

      const target = document.querySelector(hash);

      if (!target) {
        return;
      }

      event.preventDefault();

      const allSections = document.querySelectorAll('section, .hero');
      const isSectionTarget = target.tagName === 'SECTION' || target.classList.contains('hero');

      if (isSectionTarget) {
        allSections.forEach((section) => {
          if (section !== target) {
            section.classList.add('section-exit');
          }
        });

        setTimeout(() => {
          target.classList.remove('section-exit');
          target.classList.add('section-enter');

          scrollToSection(target);
        }, 150);
      } else {
        scrollToSection(target);
      }
    });
  });
};

const setupTypingEffect = () => {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const typingSpeed = 20;
  const typingDelay = 1800;

  document.querySelectorAll("[data-typing]").forEach((element) => {
    if (element.__typingTimer) {
      clearInterval(element.__typingTimer);
      element.__typingTimer = null;
    }
    if (element.__typingStartTimer) {
      clearTimeout(element.__typingStartTimer);
      element.__typingStartTimer = null;
    }

    const text = element.textContent.replace(/^[\s\u00a0]+|[\s\u00a0]+$/g, "");
    if (!text) {
      return;
    }

    element.textContent = "";
    element.classList.remove("is-done");

    if (prefersReduced) {
      element.textContent = text;
      element.classList.add("is-done");
      return;
    }

    const chars = Array.from(text);
    let index = 0;

    element.__typingStartTimer = setTimeout(() => {
      element.__typingStartTimer = null;
      element.__typingTimer = setInterval(() => {
        element.textContent = chars.slice(0, index + 1).join("");
        index += 1;

        if (index >= chars.length) {
          clearInterval(element.__typingTimer);
          element.__typingTimer = null;
          element.classList.add("is-done");
        }
      }, typingSpeed);
    }, typingDelay);
  });
};

const syncHeroVisualHeight = () => {
  const heroVisual = document.querySelector(".hero-visual");

  if (!heroVisual) {
    return;
  }

  const img = heroVisual.querySelector("img");
  const setHeight = () => {
    const height = heroVisual.getBoundingClientRect().height;
    if (height > 0) {
      document.documentElement.style.setProperty(
        "--hero-visual-height",
        `${height}px`
      );
    }
  };

  if (img && !img.complete) {
    img.addEventListener("load", setHeight, { once: true });
    return;
  }

  setHeight();
};



