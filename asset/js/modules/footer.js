

const renderFooter = () => {
  const target = document.getElementById("site-footer");

  if (!target) {
    return;
  }

  target.innerHTML = `
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-logo-area">
          <img
            src="asset/img/logo/logo.svg"
            alt="Clinisch &amp; Co."
            class="footer-logo"
          />
          <div class="footer-nav-columns">
            <div class="footer-nav-col">
              <a href="/" data-route-link data-route-key="home" data-i18n-text="Home">Home</a>
              <a href="/approach/" data-route-link data-route-key="approach" data-i18n="nav_approach">Approach</a>
              <button type="button" class="footer-lang-toggle" data-lang-toggle>
                <span data-i18n="nav_lang_toggle"></span>
              </button>
            </div>
            <div class="footer-nav-col">
              <a href="/services/" data-route-link data-route-key="services" data-i18n="nav_services">Services</a>
              <a href="/about/" data-route-link data-route-key="about" data-i18n="nav_about">About</a>
              <a href="/contact/" data-route-link data-route-key="contact" data-i18n="nav_contact">Contact</a>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-legal">
          <a href="terms/terms-of-use.html" class="footer-legal-link" data-i18n="footer_link_tos">Terms of Use</a>
          <span class="footer-legal-divider"></span>
          <a href="privacy/privacy-policy.html" class="footer-legal-link" data-i18n="footer_link_privacy">Privacy Policy</a>
          <span class="footer-legal-divider"></span>
          <a href="accessibility/accessibility-statement.html" class="footer-legal-link" data-i18n="footer_link_accessibility">Accessibility</a>
          <span class="footer-legal-divider"></span>
          <a href="email/no-unsolicited-email-collection.html" class="footer-legal-link" data-i18n="footer_link_terms">No Unsolicited E-mail Collection</a>
        </div>
        <div class="footer-copyright">
          <p>© 2020 - <span data-footer-year></span> <span style="font-weight: 600;">Clinisch & Co.</span> All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  `;
};

const updateFooterYear = () => {
  const target = document.querySelector("[data-footer-year]");

  if (!target) {
    return;
  }

  target.textContent = String(new Date().getFullYear());
};

// Export globals for init.js
window.renderFooter = renderFooter;
window.updateFooterYear = updateFooterYear;




