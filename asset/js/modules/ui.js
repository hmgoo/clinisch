

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
  // 사용자의 요청으로 타이핑 애니메이션 효과를 비활성화합니다.
  document.querySelectorAll("[data-typing]").forEach((element) => {
    const text = element.textContent.trim();
    if (text) {
      element.textContent = text;
      element.classList.add("is-done");
    }
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



