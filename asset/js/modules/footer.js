

const renderFooter = () => {
  const target = document.getElementById("site-footer");

  if (!target) {
    return;
  }

  target.innerHTML = `
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="footer-brand-row">
            <img
              src="asset/img/Clinisch_Co_wordmark.svg"
              alt="Clinisch &amp; Co."
              class="footer-logo"
            />
            <p class="footer-tagline" data-i18n="footer_company_name">
              (유)클리니쉬앤코
            </p>
          </div>
          <p data-i18n="footer_address_line1">
            인천광역시 연수구 인천타워대로 323 (송도동, 송도센트로드)
          </p>
          <p data-i18n="footer_address_line2">22007</p>
        </div>
        <div class="footer-meta">
          <p class="footer-company" data-i18n="footer_company">
            사업자번호: 696-86-03587
          </p>
          <p>
            <span data-i18n="label_tel">전화</span>: +82 70 8285 0056
          </p>
          <p>
            <span data-i18n="label_email">이메일</span>: Support@clinisch.com
          </p>
        </div>
        <div class="footer-links">
          <button type="button" class="footer-link" data-footer-modal="privacy">
            <span data-i18n="footer_link_privacy">개인정보 미수집 안내</span>
          </button>
          <button type="button" class="footer-link" data-footer-modal="email">
            <span data-i18n="footer_link_email">이메일무단수집거부</span>
          </button>
        </div>
      </div>
      <div class="footer-divider"></div>
      <div class="footer-bottom">
        <p>ⓒ <span data-footer-year></span> Clinisch &amp; Co. All rights reserved.</p>
      </div>
    </footer>
    <div class="footer-modal" data-footer-modal-panel="privacy" aria-hidden="true">
      <div class="footer-modal-backdrop" data-footer-modal-close></div>
      <div class="footer-modal-card" role="dialog" aria-modal="true" aria-labelledby="privacyTitle">
        <button type="button" class="footer-modal-close" data-footer-modal-close aria-label="닫기">
          ×
        </button>
        <h3 id="privacyTitle" data-i18n="footer_modal_privacy_title">개인정보 미수집 안내</h3>
        <p data-i18n="footer_modal_privacy_body_line1">
          본 웹사이트는 별도의 개인정보 입력 기능을 제공하지 않으며,
          분석/광고 스크립트를 사용하지 않습니다.
        </p>
        <p data-i18n="footer_modal_privacy_body_line2">
          방문 기록 (IP 등 기술적 로그)은 호스팅 제공자 (GitHub Pages)의 정책에
          따라 처리될 수 있습니다.
        </p>
      </div>
    </div>
    <div class="footer-modal" data-footer-modal-panel="email" aria-hidden="true">
      <div class="footer-modal-backdrop" data-footer-modal-close></div>
      <div class="footer-modal-card" role="dialog" aria-modal="true" aria-labelledby="emailTitle">
        <button type="button" class="footer-modal-close" data-footer-modal-close aria-label="닫기">
          ×
        </button>
        <h3 id="emailTitle" data-i18n="footer_modal_email_title">이메일 무단수집 거부</h3>
        <p data-i18n="footer_modal_email_body">
          본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의
          기술적 장치를 이용하여 무단으로 수집되는 행위를 거부하며, 이를 위반할
          경우 정보통신망 이용촉진 및 정보보호 등에 관한 법률에 의해 처벌될 수
          있음을 유념하시기 바랍니다.
        </p>
        <p class="footer-modal-date" data-i18n="footer_modal_date">게시일: 2026년 1월 1일</p>
      </div>
    </div>
  `;
};

const updateFooterYear = () => {
  const target = document.querySelector("[data-footer-year]");

  if (!target) {
    return;
  }

  target.textContent = String(new Date().getFullYear());
};

const setupFooterModals = () => {
  const panels = document.querySelectorAll("[data-footer-modal-panel]");
  const openers = document.querySelectorAll("[data-footer-modal]");
  let lastFocused = null;

  if (!panels.length || !openers.length) {
    return;
  }

  const closeAll = () => {
    panels.forEach((panel) => {
      const active = document.activeElement;
      if (active && panel.contains(active)) {
        active.blur();
      }
    });

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    } else if (document.body) {
      document.body.focus();
    }

    panels.forEach((panel) => {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
    });

    lastFocused = null;
  };

  openers.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.footerModal;
      const target = document.querySelector(
        `[data-footer-modal-panel="${key}"]`
      );
      if (!target) {
        return;
      }
      lastFocused = document.activeElement;
      closeAll();
      target.classList.add("is-open");
      target.setAttribute("aria-hidden", "false");
      const focusTarget = target.querySelector(".footer-modal-close");
      if (focusTarget) {
        focusTarget.focus();
      }
    });
  });

  document.querySelectorAll("[data-footer-modal-close]").forEach((closer) => {
    closer.addEventListener("click", () => {
      closeAll();
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAll();
    }
  });
};



