

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



