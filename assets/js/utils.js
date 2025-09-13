/**
 * 🛠️ UTILITÁRIOS COMUNS
 * Funções utilitárias reutilizáveis para evitar duplicação de código
 */

// Função debounce para otimizar eventos
function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Formatação de telefone brasileiro
function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 11
    ? `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    : phone;
}

// Verificação se é dispositivo mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Obter horário do Brasil
function getBrazilTime() {
  return new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

// Sistema de notificações
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

// Gerenciamento de erros global
function setupGlobalErrorHandling() {
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
}

// Inicialização de componentes comuns
function initializeCommonComponents() {
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

  // Preload de recursos críticos
  ["assets/images/Logo.webp"].forEach((resource) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = resource;
    link.as = "image";
    document.head.appendChild(link);
  });
}

// Exportar funções para uso global
window.Utils = {
  debounce,
  formatPhone,
  isMobile,
  getBrazilTime,
  showNotification,
  setupGlobalErrorHandling,
  initializeCommonComponents,
};
