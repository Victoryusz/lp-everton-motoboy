/**
 * 🧩 COMPONENTES REUTILIZÁVEIS
 * Componentes HTML comuns para evitar duplicação de código
 */

// Meta tags comuns
const COMMON_META_TAGS = `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow" />
    
    <!-- Favicons -->
    <link rel="icon" href="assets/images/icon/favicon.ico" type="image/x-icon" />
    <link rel="shortcut icon" href="assets/images/icon/favicon.ico" type="image/x-icon" />
    <link rel="icon" type="image/png" sizes="16x16" href="assets/images/icon/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="assets/images/icon/favicon-32x32.png" />
    <link rel="apple-touch-icon" href="assets/images/icon/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="assets/images/icon/android-chrome-192x192.png" />
    <link rel="icon" type="image/png" sizes="512x512" href="assets/images/icon/android-chrome-512x512.png" />
    
    <!-- Manifest -->
    <link rel="manifest" href="manifest.json" />
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    
    <!-- CSS -->
    <link rel="stylesheet" href="assets/css/main.css" />
    <link rel="stylesheet" href="assets/css/mobile.css" />
`;

// WhatsApp Float Button
const WHATSAPP_FLOAT = `
    <div class="whatsapp-float">
        <a href="https://wa.me/5541996137339?text=Ol%C3%A1%2C%20estou%20precisando%20urgente%20de%20uma%20entrega!" target="_blank" rel="noopener" aria-label="Contato via WhatsApp">
            <i class="fab fa-whatsapp"></i>
        </a>
    </div>
`;

// Header Navigation
const HEADER_NAV = `
    <header class="header">
        <nav class="navbar">
            <div class="container">
                <a href="index.html" class="logo">
                    <img src="assets/images/Logo.webp" alt="Everton Motoboy" class="logo-img" />
                    <span class="logo-text">Everton Motoboy</span>
                </a>
                <div class="nav-links">
                    <a href="index.html">Início</a>
                    <a href="index.html#servicos">Serviços</a>
                    <a href="index.html#areas">Áreas</a>
                    <a href="index.html#contato">Contato</a>
                </div>
                <div class="mobile-menu-toggle" role="button" tabindex="0" aria-label="Menu de navegação">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    </header>
`;

// Footer
const FOOTER = `
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-info">
                    <div class="logo">
                        <img src="assets/images/Logo.webp" alt="Everton Motoboy" class="logo-img" />
                        <span class="logo-text">Everton Motoboy</span>
                    </div>
                    <p>Serviços profissionais de motoboy em Curitiba e região. Agilidade, segurança e confiança.</p>
                </div>
                <div class="footer-contact">
                    <h4>Informações de Contato</h4>
                    <div class="footer-details">
                        <p><i class="fas fa-map-marker-alt"></i> Rua Antônio Moreira Lopes, 1857 - Curitiba/PR</p>
                        <p><i class="fas fa-envelope"></i> evertonsilvestre1986@gmail.com</p>
                        <p><i class="fas fa-id-card"></i> CNPJ: 40.027.960/0001-60</p>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="footer-bottom-content">
                    <p>&copy; 2025 Everton Motoboy. Todos os direitos reservados.</p>
                    <div class="footer-links">
                        <a href="politicas-privacidade.html">Política de Privacidade</a>
                        <a href="termos-uso.html">Termos de Uso</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
`;

// Cookie Banner
const COOKIE_BANNER = `
    <div id="cookieBanner" class="cookie-banner">
        <div class="cookie-container">
            <div class="cookie-content">
                <div class="cookie-title">🍪 Utilizamos Cookies</div>
                <div class="cookie-text">
                    Usamos cookies para melhorar sua experiência, analisar nosso tráfego e personalizar conteúdo. 
                    Ao continuar navegando, você concorda com nossa 
                    <a href="politicas-privacidade.html" class="cookie-link">Política de Privacidade</a>.
                </div>
            </div>
            <div class="cookie-actions">
                <button class="cookie-btn cookie-btn-accept" onclick="acceptCookies()">✓ Aceitar</button>
                <button class="cookie-btn cookie-btn-decline" onclick="declineCookies()">✗ Recusar</button>
                <button class="cookie-btn cookie-btn-settings" onclick="showCookieSettings()">⚙️ Configurar</button>
            </div>
        </div>
    </div>
`;

// Cookie Modal
const COOKIE_MODAL = `
    <div id="cookieModal" class="cookie-modal">
        <div class="cookie-modal-content">
            <div class="cookie-modal-header">
                <h3 class="cookie-modal-title">Configurações de Cookies</h3>
                <button class="cookie-modal-close" onclick="hideCookieSettings()">&times;</button>
            </div>
            <div class="cookie-category">
                <div class="cookie-category-header">
                    <span class="cookie-category-title">Cookies Necessários</span>
                    <div class="cookie-toggle active disabled"></div>
                </div>
                <div class="cookie-category-description">
                    Essenciais para o funcionamento do site. Não podem ser desabilitados.
                    Incluem cookies de sessão e segurança.
                </div>
            </div>
            <div class="cookie-category">
                <div class="cookie-category-header">
                    <span class="cookie-category-title">Cookies Funcionais</span>
                    <div class="cookie-toggle" data-category="functional" onclick="toggleCookie(this)"></div>
                </div>
                <div class="cookie-category-description">
                    Permitem funcionalidades avançadas como lembrar preferências e configurações.
                </div>
            </div>
            <div class="cookie-category">
                <div class="cookie-category-header">
                    <span class="cookie-category-title">Cookies de Análise</span>
                    <div class="cookie-toggle" data-category="analytics" onclick="toggleCookie(this)"></div>
                </div>
                <div class="cookie-category-description">
                    Nos ajudam a entender como os visitantes interagem com o site através do Google Analytics.
                </div>
            </div>
            <div class="cookie-category">
                <div class="cookie-category-header">
                    <span class="cookie-category-title">Cookies de Marketing</span>
                    <div class="cookie-toggle" data-category="marketing" onclick="toggleCookie(this)"></div>
                </div>
                <div class="cookie-category-description">
                    Utilizados para mostrar anúncios relevantes e medir a eficácia das campanhas.
                </div>
            </div>
            <div class="cookie-modal-actions">
                <button class="cookie-btn cookie-btn-decline" onclick="saveCustomSettings(false)">Salvar e Recusar</button>
                <button class="cookie-btn cookie-btn-accept" onclick="saveCustomSettings(true)">Salvar Configurações</button>
            </div>
        </div>
    </div>
`;

// Cookie Status
const COOKIE_STATUS = `<div id="cookieStatus" class="cookie-status"></div>`;

// Scripts comuns
const COMMON_SCRIPTS = `
    <script src="assets/js/script.js"></script>
    <script src="assets/js/contato.js"></script>
`;

// Função para inserir componentes no DOM
function insertComponents() {
  // Inserir meta tags no head
  const head = document.head;
  if (head && !document.querySelector('meta[charset="UTF-8"]')) {
    head.insertAdjacentHTML("afterbegin", COMMON_META_TAGS);
  }

  // Inserir WhatsApp float
  if (!document.querySelector(".whatsapp-float")) {
    document.body.insertAdjacentHTML("afterbegin", WHATSAPP_FLOAT);
  }

  // Inserir header
  if (!document.querySelector(".header")) {
    document.body.insertAdjacentHTML("afterbegin", HEADER_NAV);
  }

  // Inserir footer
  if (!document.querySelector(".footer")) {
    document.body.insertAdjacentHTML("beforeend", FOOTER);
  }

  // Inserir cookie banner
  if (!document.getElementById("cookieBanner")) {
    document.body.insertAdjacentHTML("beforeend", COOKIE_BANNER);
  }

  // Inserir cookie modal
  if (!document.getElementById("cookieModal")) {
    document.body.insertAdjacentHTML("beforeend", COOKIE_MODAL);
  }

  // Inserir cookie status
  if (!document.getElementById("cookieStatus")) {
    document.body.insertAdjacentHTML("beforeend", COOKIE_STATUS);
  }

  // Inserir scripts comuns
  if (!document.querySelector('script[src*="script.js"]')) {
    document.body.insertAdjacentHTML("beforeend", COMMON_SCRIPTS);
  }
}

// Auto-inicializar quando o DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", insertComponents);
} else {
  insertComponents();
}
