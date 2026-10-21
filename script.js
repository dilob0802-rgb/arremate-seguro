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
  // 2. SIMULADOR FINANCEIRO INTERATIVO DE VIABILIDADE
  // ==========================================================================
  const marketPriceInput = document.getElementById('marketPriceInput');
  const marketPriceDisplay = document.getElementById('marketPriceDisplay');
  
  const auctionPriceInput = document.getElementById('auctionPriceInput');
  const auctionPriceDisplay = document.getElementById('auctionPriceDisplay');

  const itbiDisplay = document.getElementById('itbiDisplay');
  const renovationInput = document.getElementById('renovationInput');
  const renovationDisplay = document.getElementById('renovationDisplay');

  const debtsInput = document.getElementById('debtsInput');
  const debtsDisplay = document.getElementById('debtsDisplay');

  const sellingExpensesDisplay = document.getElementById('sellingExpensesDisplay');

  // Elementos de Exibição dos Resultados
  const calcStatusBadge = document.getElementById('calcStatusBadge');
  const calcNetProfitDisplay = document.getElementById('calcNetProfitDisplay');
  const calcNegativeAlert = document.getElementById('calcNegativeAlert');

  const calcDiscountDisplay = document.getElementById('calcDiscountDisplay');
  const calcGrossDiffDisplay = document.getElementById('calcGrossDiffDisplay');
  const calcTotalCostDisplay = document.getElementById('calcTotalCostDisplay');
  const calcMarginDisplay = document.getElementById('calcMarginDisplay');
  const calcMinEntryDisplay = document.getElementById('calcMinEntryDisplay');
  const calcWhatsappBtn = document.getElementById('calcWhatsappBtn');

  // Formatador de Moeda BRL
  function formatBRL(val) {
    if (isNaN(val) || !isFinite(val)) return 'R$ 0';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  }

  // Desformatar string para número
  function parseBRL(str) {
    if (typeof str !== 'string') return Number(str) || 0;
    const clean = str.replace(/[^\d]/g, '');
    return clean ? parseFloat(clean) : 0;
  }

  function calculateSimulation() {
    if (!marketPriceInput || !auctionPriceInput) return;

    let marketVal = parseFloat(marketPriceInput.value) || 0;
    let auctionVal = parseFloat(auctionPriceInput.value) || 0;
    let renovationVal = parseFloat(renovationInput ? renovationInput.value : 0) || 0;
    let debtsVal = parseFloat(debtsInput ? debtsInput.value : 0) || 0;

    // Regra de sanidade: Aquisição não pode ser zero
    if (auctionVal < 10000) auctionVal = 10000;
    if (marketVal < auctionVal) marketVal = auctionVal;

    // 1. Custos de Aquisição: ITBI + Cartório de Imóveis (Estimado em 4,5% sobre a aquisição)
    const itbiAndCartorio = auctionVal * 0.045;

    // 2. Despesas de Venda / Corretagem (Estimado em 5% sobre o valor estimado de mercado)
    const sellingExpenses = marketVal * 0.05;

    // 3. Custo Total Consolidado = Aquisição + ITBI/RGI + Reforma + Débitos informados
    const totalCost = auctionVal + itbiAndCartorio + renovationVal + debtsVal;

    // 4. Diferença Bruta entre Mercado e Aquisição
    const grossDiff = marketVal - auctionVal;

    // 5. Desconto percentual
    const discountPercent = marketVal > 0 ? ((marketVal - auctionVal) / marketVal) * 100 : 0;

    // 6. Resultado Líquido Estimado = Receita de Venda (Mercado) - Custo Total - Despesas de Venda
    const netProfit = marketVal - totalCost - sellingExpenses;

    // 7. Margem sobre o Custo Total
    const marginPercent = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

    // 8. Entrada Mínima Caixa (5% em modalidades financiáveis)
    const minEntry = auctionVal * 0.05;

    // Atualização visual dos campos de entrada
    if (marketPriceDisplay) marketPriceDisplay.value = formatBRL(marketVal);
    if (auctionPriceDisplay) auctionPriceDisplay.value = formatBRL(auctionVal);
    if (itbiDisplay) itbiDisplay.value = formatBRL(itbiAndCartorio);
    if (renovationDisplay) renovationDisplay.value = formatBRL(renovationVal);
    if (debtsDisplay) debtsDisplay.value = formatBRL(debtsVal);
    if (sellingExpensesDisplay) sellingExpensesDisplay.value = formatBRL(sellingExpenses);

    // Atualização dos Resultados
    if (calcDiscountDisplay) {
      calcDiscountDisplay.textContent = `${discountPercent.toFixed(1).replace('.', ',')}% de desconto`;
    }

    if (calcGrossDiffDisplay) {
      calcGrossDiffDisplay.textContent = formatBRL(grossDiff);
    }

    if (calcTotalCostDisplay) {
      calcTotalCostDisplay.textContent = formatBRL(totalCost);
    }

    if (calcMarginDisplay) {
      calcMarginDisplay.textContent = `${marginPercent.toFixed(1).replace('.', ',')}%`;
    }

    if (calcMinEntryDisplay) {
      calcMinEntryDisplay.textContent = formatBRL(minEntry);
    }

    // Tratamento de Cenário Positivo vs Negativo
    if (netProfit < 0) {
      if (calcNetProfitDisplay) {
        calcNetProfitDisplay.textContent = formatBRL(netProfit);
        calcNetProfitDisplay.classList.add('negative');
      }
      if (calcStatusBadge) {
        calcStatusBadge.textContent = 'Margem de Risco Negativa';
        calcStatusBadge.classList.add('negative');
      }
      if (calcNegativeAlert) {
        calcNegativeAlert.classList.add('active');
      }
    } else {
      if (calcNetProfitDisplay) {
        calcNetProfitDisplay.textContent = formatBRL(netProfit);
        calcNetProfitDisplay.classList.remove('negative');
      }
      if (calcStatusBadge) {
        calcStatusBadge.textContent = 'Operação Viável';
        calcStatusBadge.classList.remove('negative');
      }
      if (calcNegativeAlert) {
        calcNegativeAlert.classList.remove('active');
      }
    }

    // Atualização do link dinâmico para WhatsApp
    if (calcWhatsappBtn) {
      const msg = encodeURIComponent(
        `Olá, Tarcis! Simulei uma oportunidade no site Arremate Seguro com os seguintes dados:\n` +
        `• Mercado Estimado: ${formatBRL(marketVal)}\n` +
        `• Aquisição no Edital: ${formatBRL(auctionVal)}\n` +
        `• Custo Total Previsto: ${formatBRL(totalCost)}\n` +
        `• Resultado Líquido Projetado: ${formatBRL(netProfit)}\n\n` +
        `Gostaria de avaliar a viabilidade de oportunidades reais com sua orientação na mentoria.`
      );
      calcWhatsappBtn.href = `https://wa.me/5521986785306?text=${msg}`;
    }
  }

  // Event Listeners nos Sliders
  if (marketPriceInput) {
    marketPriceInput.addEventListener('input', () => {
      calculateSimulation();
    });
  }

  if (auctionPriceInput) {
    auctionPriceInput.addEventListener('input', () => {
      calculateSimulation();
    });
  }

  if (renovationInput) {
    renovationInput.addEventListener('input', () => {
      calculateSimulation();
    });
  }

  if (debtsInput) {
    debtsInput.addEventListener('input', () => {
      calculateSimulation();
    });
  }

  // Suporte a inputs manuais diretos
  if (marketPriceDisplay) {
    marketPriceDisplay.addEventListener('change', () => {
      const val = parseBRL(marketPriceDisplay.value);
      if (val >= 50000 && val <= 3000000) {
        marketPriceInput.value = val;
        calculateSimulation();
      }
    });
  }

  if (auctionPriceDisplay) {
    auctionPriceDisplay.addEventListener('change', () => {
      const val = parseBRL(auctionPriceDisplay.value);
      if (val >= 10000 && val <= 2000000) {
        auctionPriceInput.value = val;
        calculateSimulation();
      }
    });
  }

  // Executar a simulação inicial imediatamente
  calculateSimulation();

  // ==========================================================================
  // 3. FAQ ACORDEÃO ACESSÍVEL
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
