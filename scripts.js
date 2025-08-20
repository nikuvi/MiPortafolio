// Variables globales
let currentTheme = localStorage.getItem('theme') || 'light';

// Inicialización del DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeAnimations();
    initializeSkillBars();
    initializeContactForm();
    initializeCounters();
    initializeSmoothScrolling();
    initializeFloatingElements();
    initializeIntersectionObserver();
});

// Gestión del tema (modo oscuro/claro)
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Aplicar tema guardado
    html.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Event listener para cambiar tema
    themeToggle.addEventListener('click', function() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon(currentTheme);
        
        // Animación de transición suave
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Navegación activa y scroll suave
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const header = document.querySelector('.header');
    
    // Función para actualizar navegación activa
    function updateActiveNavigation() {
        let current = '';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Efecto de fondo del header al hacer scroll
    function handleHeaderBackground() {
        const scrollY = window.pageYOffset;
        
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Event listener para scroll optimizado
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavigation();
                handleHeaderBackground();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Menú móvil
    mobileMenuBtn.addEventListener('click', function() {
        navLinksContainer.classList.toggle('active');
        this.classList.toggle('active');
        
        // Animar las líneas del botón hamburguesa
        const spans = this.querySelectorAll('span');
        if (this.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }
    });
    
    // Cerrar menú móvil al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            
            // Restaurar botón hamburguesa
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        });
    });
}

// Scroll suave personalizado
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer para animaciones
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger counters if it's a stat element
                if (entry.target.classList.contains('stat-card')) {
                    const counter = entry.target.querySelector('.stat-number');
                    if (counter && !counter.classList.contains('animated')) {
                        animateCounter(counter);
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos que necesitan animación
    const animatedElements = document.querySelectorAll(
        '.about-text, .about-stats, .skill-category, .project-card, .contact-info, .contact-form, .tools-grid, .stat-card'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Animaciones al hacer scroll
function initializeAnimations() {
    // Añadir clases de animación
    const slideLeftElements = document.querySelectorAll('.about-text, .contact-info');
    const slideRightElements = document.querySelectorAll('.about-stats, .contact-form');
    const fadeUpElements = document.querySelectorAll('.skill-category, .project-card, .tools-grid');
    
    slideLeftElements.forEach(element => {
        element.classList.add('slide-in-left');
    });
    
    slideRightElements.forEach(element => {
        element.classList.add('slide-in-right');
    });
    
    fadeUpElements.forEach(element => {
        element.classList.add('fade-up');
    });
}

// Animación de barras de habilidades
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                
                setTimeout(() => {
                    skillBar.style.width = width;
                    skillBar.classList.add('animated');
                }, 200);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Contadores animados mejorados
function initializeCounters() {
    // Los contadores ahora se inicializan desde initializeIntersectionObserver
}

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2500; // 2.5 segundos
    const step = target / (duration / 16); // 60fps
    
    let current = 0;
    counter.classList.add('animated');
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
    }, 16);
}

// Formulario de contacto mejorado
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos
        if (!validateForm(this)) {
            return;
        }
        
        // Obtener datos del formulario
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simular envío del formulario
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Enviando...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // Simular delay de envío
        setTimeout(() => {
            // Mostrar mensaje de éxito
            showNotification('¡Mensaje enviado correctamente! Me pondré en contacto contigo pronto.', 'success');
            
            // Resetear formulario
            this.reset();
            clearFormErrors(this);
            
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }, 2000);
    });
    
    // Validación en tiempo real
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// Validación de formulario
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    } else if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, ingresa un email válido';
        }
    } else if (field.name === 'name' && value.length > 0 && value.length < 2) {
        isValid = false;
        errorMessage = 'El nombre debe tener al menos 2 caracteres';
    }
    
    // Actualizar estilos del campo
    if (isValid) {
        field.classList.remove('error');
        removeErrorMessage(field);
    } else {
        field.classList.add('error');
        showErrorMessage(field, errorMessage);
    }
    
    return isValid;
}

function showErrorMessage(field, message) {
    removeErrorMessage(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function clearFormErrors(form) {
    const errorMessages = form.querySelectorAll('.error-message');
    const errorInputs = form.querySelectorAll('.error');
    
    errorMessages.forEach(error => error.remove());
    errorInputs.forEach(input => input.classList.remove('error'));
}

// Sistema de notificaciones mejorado
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="${getNotificationIcon(type)}"></i>
            </div>
            <span class="notification-text">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Estilos de la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: getNotificationColor(type),
        color: 'white',
        padding: 'var(--space-4)',
        borderRadius: 'var(--rounded-lg)',
        boxShadow: 'var(--shadow-xl)',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'var(--transition)',
        maxWidth: '400px',
        minWidth: '300px'
    });
    
    const content = notification.querySelector('.notification-content');
    Object.assign(content.style, {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)'
    });
    
    const icon = notification.querySelector('.notification-icon');
    Object.assign(icon.style, {
        fontSize: '20px',
        flexShrink: '0'
    });
    
    const text = notification.querySelector('.notification-text');
    Object.assign(text.style, {
        flex: '1',
        lineHeight: '1.4'
    });
    
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '0',
        flexShrink: '0'
    });
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Cerrar automáticamente
    const autoClose = setTimeout(() => {
        closeNotification(notification);
    }, 6000);
    
    // Cerrar manualmente
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoClose);
        closeNotification(notification);
    });
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',
        info: 'var(--primary)'
    };
    return colors[type] || colors.info;
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Elementos flotantes animados
function initializeFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        const speed = parseFloat(element.getAttribute('data-speed')) || 1;
        let angle = (Math.PI * 2 * index) / floatingElements.length; // Distribuir uniformemente
        
        function animate() {
            angle += 0.005 * speed; // Movimiento más suave
            const x = Math.cos(angle) * 15;
            const y = Math.sin(angle * 1.5) * 10; // Movimiento en forma de 8
            
            element.style.transform = `translate(${x}px, ${y}px)`;
            requestAnimationFrame(animate);
        }
        
        // Comenzar la animación con delay escalonado
        setTimeout(() => {
            animate();
        }, index * 200);
    });
}

// Efectos de paralaje suave para elementos de fondo
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.floating-elements');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.3 + (index * 0.1); // Velocidades variables
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Usar requestAnimationFrame para mejor rendimiento
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Inicializar paralaje
document.addEventListener('DOMContentLoaded', function() {
    initializeParallax();
});

// Manejo de rendimiento - lazy loading para imágenes
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Optimización para dispositivos táctiles
function initializeTouchOptimizations() {
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Mejorar la experiencia táctil en botones
        const touchElements = document.querySelectorAll('.btn, .social-link, .project-link, .nav-link, .tool-item');
        touchElements.forEach(element => {
            element.style.minHeight = '44px';
            element.style.minWidth = '44px';
        });
    }
}

// Detección de preferencias de animación
function respectMotionPreferences() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduce-motion');
        
        // Desactivar animaciones innecesarias
        const style = document.createElement('style');
        style.innerHTML = `
            .reduce-motion *, .reduce-motion *::before, .reduce-motion *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar todas las optimizaciones
document.addEventListener('DOMContentLoaded', function() {
    initializeTouchOptimizations();
    initializeLazyLoading();
    respectMotionPreferences();
});

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
    showNotification('Oops, algo salió mal. Por favor, recarga la página.', 'error');
});

// Función de utilidad para debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Mejorar la accesibilidad con focus visible
document.addEventListener('DOMContentLoaded', function() {
    // Mejorar la navegación por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('click', function() {
        document.body.classList.remove('keyboard-navigation');
    });
});