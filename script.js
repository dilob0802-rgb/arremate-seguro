/**
 * ARREMATE SEGURO — SCRIPTS & SIMULADOR FINANCEIRO AVANÇADO
 * Mentor: Tarcis Riccioni
 * Foco: CRO, Simulação Matemática de Precisão e Acessibilidade
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 0. ANO DINÂMICO
  // ==========================================================================
  const yearDisplay = document.getElementById('yearDisplay');
  if (yearDisplay) {
    yearDisplay.textContent = new Date().getFullYear();
  }

  // ==========================================================================
  // 1. SISTEMA DE ANALYTICS / MENSURAÇÃO CRO
  // ==========================================================================
  function trackEvent(category, action, label = '') {
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'cro_interaction',
        event_category: category,
        event_action: action,
        event_label: label
      });
    }
  }

  // Monitorar todos os cliques em links com atributo data-track
  document.querySelectorAll('[data-track]').forEach(el => {
    el.addEventListener('click', () => {
      const trackId = el.getAttribute('data-track');
      trackEvent('Conversion', 'Click', trackId);
    });
  });

  // ==========================================================================
  // 2. FAQ ACORDEÃO ACESSÍVEL
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Fecha todos os outros itens para manter elegância editorial
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-trigger');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Alterna o item clicado
        if (!isActive) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        } else {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  // ==========================================================================
  // 4. MENU MOBILE RESPONSIVO
  // ==========================================================================
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navMenu.classList.contains('active');
      if (isActive) {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        navMenu.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Fechar ao clicar em qualquer link da navegação
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Fechar ao clicar fora do menu
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================================================
  // 5. MODAIS ACESSÍVEIS (TERMOS E PRIVACIDADE)
  // ==========================================================================
  const termsModal = document.getElementById('termsModal');
  const privacyModal = document.getElementById('privacyModal');
  const closeModalsBtns = document.querySelectorAll('.js-close-modals');

  const openTermsBtn = document.querySelector('.js-open-terms');
  const openPrivacyBtn = document.querySelector('.js-open-privacy');

  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAllModals() {
    if (termsModal) termsModal.classList.remove('active');
    if (privacyModal) privacyModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openTermsBtn) {
    openTermsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(termsModal);
    });
  }

  if (openPrivacyBtn) {
    openPrivacyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(privacyModal);
    });
  }

  closeModalsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  // Fechar ao clicar no fundo escuro
  [termsModal, privacyModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeAllModals();
        }
      });
    }
  });

  // Fechar no ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

});
