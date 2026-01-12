

const renderHeader = () => {
  const target = document.getElementById("site-header");

  if (!target) {
    return;
  }

  target.innerHTML = `
    <header class="header">
      <a href="/" class="logo" data-route-link data-route-key="home">
        <img
          src="asset/img/logo/logo.svg"
          alt="Clinisch &amp; Co."
        />
      </a>
      <nav class="nav">
        <a href="/" data-route-link data-route-key="home" data-i18n-text="Top">Top</a>
        <a href="/about/" data-route-link data-route-key="about" data-i18n="nav_about">소개</a>
        <a href="/services/" data-route-link data-route-key="services" data-i18n="nav_services">서비스</a>
        <a href="/skills/" data-route-link data-route-key="approach" data-i18n="nav_approach">핵심역량</a>
        <a href="/contact/" data-route-link data-route-key="contact" class="nav-link-underline" data-i18n="nav_contact">문의하기</a>
        <button
          type="button"
          class="lang-toggle"
          data-lang-toggle
          data-i18n="lang_toggle_aria"
          data-i18n-attr="aria-label"
        >
          <span class="lang-icon" aria-hidden="true">
            <img src="asset/img/icon/language.png" alt="" />
          </span>
          <span class="lang-text">EN</span>
        </button>
      </nav>
      <button
        type="button"
        class="nav-toggle"
        data-nav-toggle
        aria-label="메뉴 열기"
        aria-expanded="false"
      >
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-bar"></span>
      </button>
    </header>
    <div class="mobile-overlay" data-mobile-overlay aria-hidden="true"></div>
    <aside class="mobile-panel" data-mobile-panel aria-hidden="true">
      <div class="mobile-panel-header"></div>
      <div class="mobile-panel-body">
        <nav class="mobile-nav">
          <a href="/" data-route-link data-route-key="home" data-i18n-text="Top">Top</a>
          <a href="/about/" data-route-link data-route-key="about" data-i18n="nav_about">소개</a>
          <a href="/services/" data-route-link data-route-key="services" data-i18n="nav_services">서비스</a>
          <a href="/skills/" data-route-link data-route-key="approach" data-i18n="nav_approach">핵심역량</a>
          <a href="/contact/" data-route-link data-route-key="contact" data-i18n="nav_contact">문의하기</a>
          <button
            type="button"
            class="mobile-lang-toggle"
            data-lang-toggle
            data-i18n="lang_toggle_aria"
            data-i18n-attr="aria-label"
          >
            <span class="lang-text">EN</span>
          </button>
        </nav>
      </div>
    </aside>
  `;
};



