/**
 * ARREMATE SEGURO — SCRIPTS & INTERATIVIDADE
 * Mentor: Tarcis Riccioni
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. ANO ATUAL DINÂMICO
  const yearDisplay = document.getElementById('yearDisplay');
  if (yearDisplay) yearDisplay.textContent = new Date().getFullYear();

  // 1. FAQ ACCORDION INTERATIVO
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Fecha outros que estiverem abertos
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Alterna o atual
      if (!isActive) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });

  // 2. SIMULADOR DE VIABILIDADE DE LEILÃO EM TEMPO REAL
  const marketPriceInput = document.getElementById('marketPriceInput');
  const auctionPriceInput = document.getElementById('auctionPriceInput');
  const renovationInput = document.getElementById('renovationInput');

  const marketPriceDisplay = document.getElementById('marketPriceDisplay');
  const auctionPriceDisplay = document.getElementById('auctionPriceDisplay');
  const renovationDisplay = document.getElementById('renovationDisplay');

  const discountPercentDisplay = document.getElementById('discountPercentDisplay');
  const totalCostDisplay = document.getElementById('totalCostDisplay');
  const profitDisplay = document.getElementById('profitDisplay');
  const minEntryDisplay = document.getElementById('minEntryDisplay');

  function formatBRL(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  }

  function updateSimulation() {
    if (!marketPriceInput || !auctionPriceInput) return;

    let marketVal = parseFloat(marketPriceInput.value);
    let auctionVal = parseFloat(auctionPriceInput.value);
    let renoVal = parseFloat(renovationInput ? renovationInput.value : 15000);

    // O lance não pode exceder o valor de mercado na simulação
    if (auctionVal > marketVal) {
      auctionVal = marketVal * 0.7;
      auctionPriceInput.value = auctionVal;
    }

    // Atualiza os textos dos sliders
    if (marketPriceDisplay) marketPriceDisplay.textContent = formatBRL(marketVal);
    if (auctionPriceDisplay) auctionPriceDisplay.textContent = formatBRL(auctionVal);
    if (renovationDisplay) renovationDisplay.textContent = formatBRL(renoVal);

    // Cálculos
    // 1. Desconto percentual
    const discountPercent = ((marketVal - auctionVal) / marketVal) * 100;
    
    // 2. Custos operacionais médios: ITBI (~3%), Registro/Cartório (~1.5%) + Reforma/Despesas informadas
    const itbiAndFees = auctionVal * 0.045;
    const totalAcquisitionCost = auctionVal + itbiAndFees + renoVal;

    // 3. Lucro Bruto Estimado na revenda pelo valor de mercado
    const estimatedProfit = marketVal - totalAcquisitionCost;

    // 4. Entrada mínima estimada Caixa (5% do valor da compra em modalidades financiáveis)
    const minEntry = auctionVal * 0.05;

    // Renderização nos resultados
    if (discountPercentDisplay) {
      discountPercentDisplay.textContent = `${Math.round(discountPercent)}% de desconto`;
    }

    if (totalCostDisplay) {
      totalCostDisplay.textContent = formatBRL(totalAcquisitionCost);
    }

    if (profitDisplay) {
      profitDisplay.textContent = formatBRL(estimatedProfit > 0 ? estimatedProfit : 0);
    }

    if (minEntryDisplay) {
      minEntryDisplay.textContent = formatBRL(minEntry);
    }
  }

  if (marketPriceInput && auctionPriceInput) {
    marketPriceInput.addEventListener('input', updateSimulation);
    auctionPriceInput.addEventListener('input', updateSimulation);
    if (renovationInput) renovationInput.addEventListener('input', updateSimulation);
    // Executa a primeira vez
    updateSimulation();
  }

  // 3. CONTROLE DO MODAL DE INSCRIÇÃO & SUPORTE
  const modalOverlay = document.getElementById('inscriptionModal');
  const openModalBtns = document.querySelectorAll('.js-open-modal');
  const closeModalBtns = document.querySelectorAll('.js-close-modal');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 4. MENU MOBILE
  const mobileToggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
    });

    // Fechar ao clicar em qualquer link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });

    // Fechar ao clicar fora do menu
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    });
  }

  // 5. OBSERVER DE ANIMAÇÃO AO ROLAR A PÁGINA
  const animatedElements = document.querySelectorAll('.method-card, .encontro-card, .incluso-card, .calc-card-wrapper, .mentor-card-wrapper');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
});
