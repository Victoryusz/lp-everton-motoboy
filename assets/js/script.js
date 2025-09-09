// ==========================================
// MOBILE NAVIGATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    console.log('Mobile menu elements:', { mobileMenuToggle, navLinks });

    if (mobileMenuToggle && navLinks) {
        // Toggle mobile menu
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Mobile menu clicked');
            
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Update aria attributes for accessibility
            const isOpen = navLinks.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isOpen);
            navLinks.setAttribute('aria-hidden', !isOpen);
        });

        // Close mobile menu when clicking on a link
        const navLinkItems = navLinks.querySelectorAll('a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', function() {
                console.log('Nav link clicked - closing menu');
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Update aria attributes
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navLinks.setAttribute('aria-hidden', 'true');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                if (navLinks.classList.contains('active')) {
                    console.log('Clicked outside - closing menu');
                    mobileMenuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    body.classList.remove('menu-open');
                    
                    // Update aria attributes
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    navLinks.setAttribute('aria-hidden', 'true');
                }
            }
        });

        // Handle escape key to close menu
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                console.log('Escape pressed - closing menu');
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Update aria attributes
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navLinks.setAttribute('aria-hidden', 'true');
            }
        });

        // Set initial aria attributes
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Menu de navegação');
        navLinks.setAttribute('aria-hidden', 'true');
    } else {
        console.warn('Mobile menu elements not found!');
    }
});

// ==========================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ==========================================
// HEADER SCROLL EFFECT
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    
    // ✅ VERIFICAÇÃO DE SEGURANÇA: Só executa se o header existir
    if (header) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add background effect when scrolling
            if (scrollTop > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    // Se não houver header, o script simplesmente não faz nada (sem erro!)
});

// ==========================================
// OUTROS SCRIPTS PODEM VIR AQUI
// ==========================================

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.service-card, .coverage-text, .contact-info, .contact-form');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
});

// ==========================================
// FORM HANDLING
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const nome = formData.get('nome');
            const telefone = formData.get('telefone');
            const servico = formData.get('servico');
            const mensagem = formData.get('mensagem');
            
            // Validate form
            if (!nome || !telefone || !servico) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            // Format WhatsApp message
            let whatsappMessage = `Olá! Gostaria de solicitar um orçamento:\n\n`;
            whatsappMessage += `👤 *Nome:* ${nome}\n`;
            whatsappMessage += `📱 *Telefone:* ${telefone}\n`;
            whatsappMessage += `🚚 *Serviço:* ${servico}\n`;
            if (mensagem) {
                whatsappMessage += `💬 *Mensagem:* ${mensagem}\n`;
            }
            whatsappMessage += `\nEnviado pelo site Everton Motoboy`;
            
            // Encode message for WhatsApp URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = `https://wa.me/5541996137339?text=${encodedMessage}`;
            
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;
            
            // Simulate sending delay
            setTimeout(() => {
                // Reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Open WhatsApp
                window.open(whatsappURL, '_blank');
                
                // Reset form
                form.reset();
                
                // Show success message
                showNotification('Mensagem preparada! Você será redirecionado para o WhatsApp.', 'success');
            }, 1000);
        });
    }
});

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
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
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Handle close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ==========================================
// PHONE NUMBER FORMATTING
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value.replace(/(\d{0,2})/, '($1');
                } else if (value.length <= 7) {
                    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    });
});

// ==========================================
// LAZY LOADING FOR IMAGES
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('fade-in');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// ==========================================
// PERFORMANCE MONITORING
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Preload critical resources
    const criticalResources = [
        'assets/images/Logo.webp'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'image';
        document.head.appendChild(link);
    });
    
    // Log performance metrics (only in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const paint = performance.getEntriesByType('paint');
                
                console.log('🚀 Performance Metrics:');
                console.log(`📊 DOM Content Loaded: ${navigation.domContentLoadedEventEnd}ms`);
                console.log(`⚡ Page Load Complete: ${navigation.loadEventEnd}ms`);
                
                paint.forEach(entry => {
                    console.log(`🎨 ${entry.name}: ${entry.startTime}ms`);
                });
            }, 1000);
        });
    }
});

// ==========================================
// ACCESSIBILITY IMPROVEMENTS
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation for mobile menu
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                mobileMenuToggle.click();
            }
        });
    }
    
    // Improve focus management for form elements
    const formElements = document.querySelectorAll('input, select, textarea, button');
    formElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.closest('.form-group')?.classList.add('focused');
        });
        
        element.addEventListener('blur', function() {
            this.closest('.form-group')?.classList.remove('focused');
        });
    });
    
    // Add skip link functionality
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-blue);
        color: white;
        padding: 8px;
        border-radius: 4px;
        text-decoration: none;
        z-index: 10001;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
});

// ==========================================
// SERVICE WORKER REGISTRATION (PWA READY)
// ==========================================
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('🔧 Service Worker registrado com sucesso:', registration.scope);
            })
            .catch(function(error) {
                console.log('❌ Falha ao registrar Service Worker:', error);
            });
    });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Format phone number for display
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return `(${cleaned.slice(0,2)}) ${cleaned.slice(2,7)}-${cleaned.slice(7)}`;
    }
    return phone;
}

// Check if device is mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Get current time for Brazil timezone
function getBrazilTime() {
    return new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo'
    });
}

// ==========================================
// ERROR HANDLING
// ==========================================
window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript Error:', e.error);
    
    // Only show user-friendly message in production
    if (window.location.hostname !== 'localhost') {
        showNotification('Ops! Algo deu errado. Tente recarregar a página.', 'error');
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('🚨 Unhandled Promise Rejection:', e.reason);
    e.preventDefault();
});

// ==========================================
// ANALYTICS AND TRACKING (Ready for integration)
// ==========================================
function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Facebook Pixel event tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }
    
    // Console log for development
    if (window.location.hostname === 'localhost') {
        console.log('📊 Event Tracked:', eventName, eventData);
    }
}

// Track important user interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track WhatsApp clicks
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('whatsapp_click', {
                event_category: 'contact',
                event_label: 'whatsapp_button'
            });
        });
    });
    
    // Track phone clicks
    const phoneLinks = document.querySelectorAll('a[href*="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('phone_click', {
                event_category: 'contact',
                event_label: 'phone_button'
            });
        });
    });
    
    // Track form submissions
    const form = document.querySelector('.form');
    if (form) {
        form.addEventListener('submit', function() {
            trackEvent('form_submit', {
                event_category: 'lead',
                event_label: 'contact_form'
            });
        });
    }
});

console.log('🚚 Everton Motoboy Website - Carregado com sucesso! 🚀');