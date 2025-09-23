document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const body = document.body;

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileMenuToggle.setAttribute("aria-label", "Menu de navegação");
    navLinks.setAttribute("aria-hidden", "true");

    mobileMenuToggle.addEventListener("click", function (e) {
      e.preventDefault();
      mobileMenuToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
      body.classList.toggle("menu-open");

      const isOpen = navLinks.classList.contains("active");
      mobileMenuToggle.setAttribute("aria-expanded", isOpen);
      navLinks.setAttribute("aria-hidden", !isOpen);
    });

    mobileMenuToggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        mobileMenuToggle.click();
      }
    });

    const navLinkItems = navLinks.querySelectorAll("a");
    navLinkItems.forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenuToggle.classList.remove("active");
        navLinks.classList.remove("active");
        body.classList.remove("menu-open");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        navLinks.setAttribute("aria-hidden", "true");
      });
    });

    document.addEventListener("click", function (e) {
      if (
        !mobileMenuToggle.contains(e.target) &&
        !navLinks.contains(e.target) &&
        navLinks.classList.contains("active")
      ) {
        mobileMenuToggle.classList.remove("active");
        navLinks.classList.remove("active");
        body.classList.remove("menu-open");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        navLinks.setAttribute("aria-hidden", "true");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        mobileMenuToggle.classList.remove("active");
        navLinks.classList.remove("active");
        body.classList.remove("menu-open");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        navLinks.setAttribute("aria-hidden", "true");
      }
    });
  }

  // Rolagem suave para âncoras
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight =
          document.querySelector(".header")?.offsetHeight || 0;
        window.scrollTo({
          top: targetElement.offsetTop - headerHeight - 20,
          behavior: "smooth",
        });
      }
    });
  });

  // Header dinâmico
  const header = document.querySelector(".header");
  if (header) {
    let lastScrollTop = 0;
    window.addEventListener(
      "scroll",
      typeof Utils !== "undefined" && Utils.debounce
        ? Utils.debounce(function () {
            const scrollTop =
              window.pageYOffset || document.documentElement.scrollTop;
            header.style.background =
              scrollTop > 50
                ? "rgba(255, 255, 255, 0.98)"
                : "rgba(255, 255, 255, 0.95)";
            header.style.boxShadow =
              scrollTop > 50 ? "0 2px 20px rgba(0, 0, 0, 0.1)" : "none";
            lastScrollTop = scrollTop;
          }, 10)
        : function () {
            const scrollTop =
              window.pageYOffset || document.documentElement.scrollTop;
            header.style.background =
              scrollTop > 50
                ? "rgba(255, 255, 255, 0.98)"
                : "rgba(255, 255, 255, 0.95)";
            header.style.boxShadow =
              scrollTop > 50 ? "0 2px 20px rgba(0, 0, 0, 0.1)" : "none";
            lastScrollTop = scrollTop;
          }
    );
  }

  // Animações ao rolar
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(
      ".service-card, .coverage-text, .contact-info, .contact-form"
    )
    .forEach((el) => {
      el.classList.add("animate-on-scroll");
      observer.observe(el);
    });

  // Lazy loading imagens
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    });
    document
      .querySelectorAll('img[loading="lazy"]')
      .forEach((img) => imageObserver.observe(img));
  }

  // Inicializar componentes comuns
  if (typeof Utils !== "undefined" && Utils.initializeCommonComponents) {
    Utils.initializeCommonComponents();
  }
});

// Service Worker
if ("serviceWorker" in navigator && window.location.protocol === "https:") {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        console.log(
          "Service Worker registrado com sucesso:",
          registration.scope
        );
      })
      .catch(function (error) {
        console.log("Falha ao registrar Service Worker:", error);
      });
  });
}

// Funções utilitárias estão em assets/js/utils.js

// ===== SISTEMA DE COOKIES LGPD =====
class CookieManager {
  constructor() {
    this.cookieConsent = this.getCookieConsent();
    this.init();
  }

  init() {
    if (!this.cookieConsent.hasConsent) {
      this.showBanner();
    } else {
      this.applyCookieSettings();
    }
  }

  showBanner() {
    const banner = document.getElementById("cookieBanner");
    setTimeout(() => {
      banner.classList.add("show");
    }, 1000);
  }

  hideBanner() {
    const banner = document.getElementById("cookieBanner");
    banner.classList.remove("show");
  }

  getCookieConsent() {
    const consent = localStorage.getItem("cookieConsent");
    if (consent) {
      return JSON.parse(consent);
    }
    return {
      hasConsent: false,
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: null,
    };
  }

  setCookieConsent(consent) {
    consent.timestamp = new Date().toISOString();
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    this.cookieConsent = consent;
  }

  acceptAllCookies() {
    const consent = {
      hasConsent: true,
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    this.setCookieConsent(consent);
    this.hideBanner();
    this.applyCookieSettings();
    this.showStatus("Cookies aceitos!", "accepted");
  }

  declineAllCookies() {
    const consent = {
      hasConsent: true,
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    this.setCookieConsent(consent);
    this.hideBanner();
    this.applyCookieSettings();
    this.showStatus("Cookies recusados!", "declined");
  }

  saveCustomSettings(accept) {
    const functional = document
      .querySelector('[data-category="functional"]')
      .classList.contains("active");
    const analytics = document
      .querySelector('[data-category="analytics"]')
      .classList.contains("active");
    const marketing = document
      .querySelector('[data-category="marketing"]')
      .classList.contains("active");

    const consent = {
      hasConsent: true,
      necessary: true,
      functional: accept ? functional : false,
      analytics: accept ? analytics : false,
      marketing: accept ? marketing : false,
    };

    this.setCookieConsent(consent);
    this.hideBanner();
    this.hideSettings();
    this.applyCookieSettings();
    this.showStatus("Configurações salvas!", "accepted");
  }

  applyCookieSettings() {
    const consent = this.cookieConsent;
    this.removeAnalyticsScripts();
    if (consent.analytics) {
      this.loadGoogleAnalytics();
    }
    if (consent.marketing) {
      this.loadMarketingScripts();
    }
    // Configurações de cookies aplicadas
  }
  loadGoogleAnalytics() {
    if (typeof gtag === "undefined") {
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID";
      document.head.appendChild(script);

      const configScript = document.createElement("script");
      configScript.innerHTML = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'GA_MEASUREMENT_ID');
            `;
      document.head.appendChild(configScript);
    }
  }

  loadMarketingScripts() {
    // Scripts de marketing carregados
  }

  removeAnalyticsScripts() {
    const existingScripts = document.querySelectorAll(
      'script[src*="googletagmanager"]'
    );
    existingScripts.forEach((script) => script.remove());
  }

  showSettings() {
    const modal = document.getElementById("cookieModal");
    modal.classList.add("show");
    const consent = this.cookieConsent;
    this.setToggleState("functional", consent.functional);
    this.setToggleState("analytics", consent.analytics);
    this.setToggleState("marketing", consent.marketing);
  }

  hideSettings() {
    const modal = document.getElementById("cookieModal");
    modal.classList.remove("show");
  }

  setToggleState(category, isActive) {
    const toggle = document.querySelector(`[data-category="${category}"]`);
    if (toggle) {
      if (isActive) {
        toggle.classList.add("active");
      } else {
        toggle.classList.remove("active");
      }
    }
  }

  showStatus(message, type) {
    if (typeof Utils !== "undefined" && Utils.showNotification) {
      Utils.showNotification(message, type);
    } else {
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  }

  clearConsent() {
    localStorage.removeItem("cookieConsent");
    this.cookieConsent = this.getCookieConsent();
    this.showBanner();
    this.showStatus("Configurações limpas!", "declined");
  }
}

// Inicializar gerenciamento de erros global
if (typeof Utils !== "undefined" && Utils.setupGlobalErrorHandling) {
  Utils.setupGlobalErrorHandling();
}

// Instância global do gerenciador de cookies
const cookieManager = new CookieManager();

// Funções globais do sistema de cookies
function acceptCookies() {
  cookieManager.acceptAllCookies();
}
function declineCookies() {
  cookieManager.declineAllCookies();
}
function showCookieSettings() {
  cookieManager.showSettings();
}
function hideCookieSettings() {
  cookieManager.hideSettings();
}
function saveCustomSettings(accept) {
  cookieManager.saveCustomSettings(accept);
}
function toggleCookie(toggle) {
  if (toggle.classList.contains("disabled")) return;
  toggle.classList.toggle("active");
}
function showCookieBanner() {
  cookieManager.showBanner();
}
function clearCookieConsent() {
  cookieManager.clearConsent();
}
function showCookieStatus() {
  const consent = cookieManager.getCookieConsent();
  if (consent.hasConsent) {
    const activeCategories = [];
    if (consent.functional) activeCategories.push("Funcionais");
    if (consent.analytics) activeCategories.push("Análise");
    if (consent.marketing) activeCategories.push("Marketing");
    const message =
      activeCategories.length > 0
        ? `Ativos: ${activeCategories.join(", ")}`
        : "Apenas necessários";
    cookieManager.showStatus(message, "accepted");
  } else {
    cookieManager.showStatus("Nenhum consentimento", "declined");
  }
}

// Event listeners para modal de cookies
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    hideCookieSettings();
  }
});

document.addEventListener("click", function (e) {
  const modal = document.getElementById("cookieModal");
  if (e.target === modal) {
    hideCookieSettings();
  }
});

// ===== CARROSSEL DE PARCEIROS =====
class PartnersCarousel {
  constructor() {
    this.carousel = document.querySelector(".partners-carousel");
    this.track = document.querySelector(".partners-track");
    this.partnerItems = document.querySelectorAll(".partner-item");
    this.animationSpeed = 30; // segundos
    this.init();
  }

  init() {
    if (!this.carousel || !this.track) return;

    // Inicializar parceiros primeiro
    if (typeof initializePartners === "function") {
      initializePartners();
      // Reiniciar animação após carregar parceiros
      setTimeout(() => this.restartAnimation(), 100);
    }

    this.setupEventListeners();
    this.optimizeForMobile();
    this.startAnimation();
  }

  setupEventListeners() {
    // Redimensionar janela
    window.addEventListener(
      "resize",
      typeof Utils !== "undefined" && Utils.debounce
        ? Utils.debounce(() => {
            this.optimizeForMobile();
          }, 250)
        : () => {
            this.optimizeForMobile();
          }
    );
  }

  optimizeForMobile() {
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;

    if (isSmallMobile) {
      this.animationSpeed = 20;
    } else if (isMobile) {
      this.animationSpeed = 25;
    } else {
      this.animationSpeed = 30;
    }

    this.updateAnimationSpeed();
  }

  startAnimation() {
    // Aguardar um pouco para garantir que os elementos estejam carregados
    setTimeout(() => {
      // Verificar se há parceiros carregados
      const partnerItems = this.track.querySelectorAll(".partner-item");
      if (partnerItems.length > 0) {
        this.track.style.animation = `scrollFromRight ${this.animationSpeed}s linear infinite`;
      } else {
        // Tentar novamente em 500ms se não houver parceiros
        setTimeout(() => this.startAnimation(), 500);
      }
    }, 200);
  }

  // Métodos de pausa removidos para animação infinita

  updateAnimationSpeed() {
    this.track.style.animation = `scrollFromRight ${this.animationSpeed}s linear infinite`;
  }

  // Método para reiniciar a animação após carregar parceiros
  restartAnimation() {
    // Parar animação atual
    this.track.style.animation = "none";
    // Forçar reflow
    this.track.offsetHeight;
    // Reiniciar animação
    this.track.style.animation = `scrollFromRight ${this.animationSpeed}s linear infinite`;
  }

  // Método para adicionar novos parceiros dinamicamente
  addPartner(name, url, imageSrc) {
    const partnerItem = document.createElement("div");
    partnerItem.className = "partner-item";

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";

    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = name;

    link.appendChild(img);
    partnerItem.appendChild(link);

    // Adicionar no início e no final para manter o loop
    this.track.appendChild(partnerItem);
    this.track.insertBefore(partnerItem.cloneNode(true), this.track.firstChild);

    // Atualizar lista de itens
    this.partnerItems = document.querySelectorAll(".partner-item");
  }

  // Método para remover parceiros
  removePartner(index) {
    if (this.partnerItems[index]) {
      this.partnerItems[index].remove();
      this.partnerItems = document.querySelectorAll(".partner-item");
    }
  }
}

// Inicializar carrossel quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  // Aguardar um pouco para garantir que todos os elementos estejam renderizados
  setTimeout(() => {
    new PartnersCarousel();
  }, 100);
});

/**
 * 🎨 FORMULÁRIO ORGÂNICO - MICRO-INTERAÇÕES
 * Funcionalidades para o novo design do formulário
 */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formContato");
  const progress = document.getElementById("formProgress");
  const inputs = form?.querySelectorAll("input, select, textarea");
  
  if (!form || !progress || !inputs) return;

  // Animar progresso do formulário
  function updateProgress() {
    const filled = Array.from(inputs).filter(input => {
      if (input.type === "select-one") {
        return input.value.trim() !== "";
      }
      return input.value.trim() !== "";
    }).length;
    
    const percentage = (filled / inputs.length) * 100;
    progress.style.width = percentage + "%";
  }

  // Adicionar listeners para progresso
  inputs.forEach(input => {
    input.addEventListener("input", updateProgress);
    input.addEventListener("focus", updateProgress);
    input.addEventListener("change", updateProgress);
  });

  // Validação visual em tempo real
  function validateField(field) {
    const formGroup = field.closest(".form-group");
    if (!formGroup) return;

    // Remover classes anteriores
    formGroup.classList.remove("valid", "invalid");

    if (field.hasAttribute("required") && !field.value.trim()) {
      formGroup.classList.add("invalid");
      return false;
    }

    // Validação específica por tipo
    if (field.type === "tel") {
      const phoneNumbers = field.value.replace(/\D/g, "");
      if (phoneNumbers.length < 10) {
        formGroup.classList.add("invalid");
        return false;
      }
    }

    if (field.value.trim()) {
      formGroup.classList.add("valid");
    }

    return true;
  }

  // Adicionar validação em tempo real
  inputs.forEach(input => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      // Remover estado de erro enquanto digita
      const formGroup = input.closest(".form-group");
      if (formGroup) {
        formGroup.classList.remove("invalid");
      }
    });
  });

  // Efeito de foco suave
  inputs.forEach(input => {
    input.addEventListener("focus", function() {
      const formGroup = this.closest(".form-group");
      if (formGroup) {
        formGroup.style.transform = "scale(1.02)";
        formGroup.style.transition = "transform 0.2s ease";
      }
    });

    input.addEventListener("blur", function() {
      const formGroup = this.closest(".form-group");
      if (formGroup) {
        formGroup.style.transform = "scale(1)";
      }
    });
  });

  // Animação do botão de envio
  const submitBtn = document.getElementById("btnEnviar");
  if (submitBtn) {
    submitBtn.addEventListener("mouseenter", function() {
      this.style.transform = "translateY(-3px) scale(1.05)";
    });

    submitBtn.addEventListener("mouseleave", function() {
      this.style.transform = "translateY(0) scale(1)";
    });

    submitBtn.addEventListener("mousedown", function() {
      this.style.transform = "translateY(-1px) scale(0.98)";
    });

    submitBtn.addEventListener("mouseup", function() {
      this.style.transform = "translateY(-3px) scale(1.05)";
    });
  }

  // Efeito de digitação no textarea
  const textarea = document.getElementById("mensagem");
  if (textarea) {
    textarea.addEventListener("input", function() {
      const formGroup = this.closest(".form-group");
      if (formGroup) {
        // Adicionar efeito de "digitando"
        formGroup.style.boxShadow = "0 0 20px rgba(220, 38, 38, 0.1)";
        setTimeout(() => {
          formGroup.style.boxShadow = "none";
        }, 200);
      }
    });
  }

  // Animação de entrada dos campos
  const formGroups = form.querySelectorAll(".form-group");
  formGroups.forEach((group, index) => {
    group.style.animationDelay = `${index * 0.1}s`;
  });

  // Efeito de hover nos labels
  const labels = form.querySelectorAll("label");
  labels.forEach(label => {
    label.addEventListener("mouseenter", function() {
      this.style.color = "var(--primary-blue)";
      this.style.transform = "scale(1.05)";
    });

    label.addEventListener("mouseleave", function() {
      const input = document.getElementById(this.getAttribute("for"));
      if (input && !input.value.trim()) {
        this.style.color = "var(--text-gray)";
        this.style.transform = "scale(1)";
      }
    });
  });

  // Feedback visual para validação do formulário
  form.addEventListener("submit", function(e) {
    let isValid = true;
    
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      e.preventDefault();
      
      // Animação de "shake" no formulário
      form.style.animation = "shake 0.5s ease-in-out";
      setTimeout(() => {
        form.style.animation = "none";
      }, 500);

      // Focar no primeiro campo inválido
      const firstInvalid = form.querySelector(".form-group.invalid input, .form-group.invalid select, .form-group.invalid textarea");
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });

  // Inicializar progresso
  updateProgress();
});