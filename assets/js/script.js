document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Menu de navegação');
        navLinks.setAttribute('aria-hidden', 'true');

        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open');

            const isOpen = navLinks.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isOpen);
            navLinks.setAttribute('aria-hidden', !isOpen);
        });

        mobileMenuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                mobileMenuToggle.click();
            }
        });

        const navLinkItems = navLinks.querySelectorAll('a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navLinks.setAttribute('aria-hidden', 'true');
            });
        });

        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navLinks.setAttribute('aria-hidden', 'true');
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navLinks.setAttribute('aria-hidden', 'true');
            }
        });
    }

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });

    const header = document.querySelector('.header');
    if (header) {
        let lastScrollTop = 0;
        window.addEventListener('scroll', debounce(function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            header.style.background = scrollTop > 50 ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = scrollTop > 50 ? '0 2px 20px rgba(0, 0, 0, 0.1)' : 'none';
            lastScrollTop = scrollTop;
        }, 10));
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .coverage-text, .contact-info, .contact-form').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    const form = document.querySelector('.form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const nome = formData.get('nome');
            const telefone = formData.get('telefone');
            const servico = formData.get('servico');
            const mensagem = formData.get('mensagem');

            if (!nome || !telefone || !servico) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }

            let whatsappMessage = `Olá! Gostaria de solicitar um orçamento:\n\n`;
            whatsappMessage += `👤 *Nome:* ${nome}\n`;
            whatsappMessage += `📱 *Telefone:* ${telefone}\n`;
            whatsappMessage += `🚚 *Serviço:* ${servico}\n`;
            if (mensagem) whatsappMessage += `💬 *Mensagem:* ${mensagem}\n`;
            whatsappMessage += `\nEnviado pelo site Everton Motoboy`;

            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = `https://wa.me/5541996137339?text=${encodedMessage}`;
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;

            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;

            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                window.open(whatsappURL, '_blank');
                form.reset();
                showNotification('Mensagem preparada! Você será redirecionado para o WhatsApp.', 'success');
            }, 1000);
        });
    }

    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length <= 2) value = value.replace(/(\d{0,2})/, '($1');
                else if (value.length <= 7) value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                else value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
            e.target.value = value;
        });
    });

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        });
        document.querySelectorAll('img[loading="lazy"]').forEach(img => imageObserver.observe(img));
    }

    ['assets/images/Logo.webp'].forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'image';
        document.head.appendChild(link);
    });

    // Código do Skip Link foi removido completamente desta seção

    document.querySelectorAll('input, select, textarea, button').forEach(element => {
        element.addEventListener('focus', () => element.closest('.form-group')?.classList.add('focused'));
        element.addEventListener('blur', () => element.closest('.form-group')?.classList.remove('focused'));
    });
});

if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
    });
}

function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
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
    document.body.appendChild(notification);

    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11 ? `(${cleaned.slice(0,2)}) ${cleaned.slice(2,7)}-${cleaned.slice(7)}` : phone;
}

function isMobile() {
    return window.innerWidth <= 768;
}

function getBrazilTime() {
    return new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript Error:', e.error);
    if (window.location.hostname !== 'localhost') {
        showNotification('Ops! Algo deu errado. Tente recarregar a página.', 'error');
    }
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('🚨 Unhandled Promise Rejection:', e.reason);
    e.preventDefault();
});