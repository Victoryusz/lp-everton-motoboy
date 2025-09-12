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
      debounce(function () {
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

  // Preload recursos
  ["assets/images/Logo.webp"].forEach((resource) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = resource;
    link.as = "image";
    document.head.appendChild(link);
  });

  // Estilização ao focar nos inputs
  document
    .querySelectorAll("input, select, textarea, button")
    .forEach((element) => {
      element.addEventListener("focus", () =>
        element.closest(".form-group")?.classList.add("focused")
      );
      element.addEventListener("blur", () =>
        element.closest(".form-group")?.classList.remove("focused")
      );
    });
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

// Funções utilitárias
function showNotification(message, type = "info") {
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${
              type === "success"
                ? "fa-check-circle"
                : type === "error"
                ? "fa-exclamation-circle"
                : "fa-info-circle"
            }"></i>
            <span>${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${
          type === "success"
            ? "#10b981"
            : type === "error"
            ? "#ef4444"
            : "#3b82f6"
        };
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        font-family: var(--font-primary);
    `;
  document.body.appendChild(notification);

  setTimeout(() => (notification.style.transform = "translateX(0)"), 100);
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => notification.remove(), 300);
  });
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 11
    ? `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    : phone;
}

function isMobile() {
  return window.innerWidth <= 768;
}

function getBrazilTime() {
  return new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

window.addEventListener("error", function (e) {
  console.error("🚨 JavaScript Error:", e.error);
  if (window.location.hostname !== "localhost") {
    showNotification(
      "Ops! Algo deu errado. Tente recarregar a página.",
      "error"
    );
  }
});

window.addEventListener("unhandledrejection", function (e) {
  console.error("🚨 Unhandled Promise Rejection:", e.reason);
  e.preventDefault();
});

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
    console.log("🍪 Configurações de cookies aplicadas:", consent);
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
    console.log("📊 Scripts de marketing carregados");
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
    const status = document.getElementById("cookieStatus");
    status.textContent = message;
    status.className = `cookie-status show ${type}`;
    setTimeout(() => {
      status.classList.remove("show");
    }, 3000);
  }

  clearConsent() {
    localStorage.removeItem("cookieConsent");
    this.cookieConsent = this.getCookieConsent();
    this.showBanner();
    this.showStatus("Configurações limpas!", "declined");
  }
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
