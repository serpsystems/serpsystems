// ===== LOADING SCREEN & INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initLoadingScreen();
    initMobileMenu();
    initScrollAnimations();
    initHeaderEffects();
    initModalSystem();
    initFormHandling();
    initCounterAnimations();
    initProgressBars();
    initSmoothScrolling();
    initFloatingElements();
    initParallaxEffects();
    initMouseGridMovement();
    // initButtonInteractions(); // Removed - function not defined
    // initPokerCardEffects(); // Removed - function not defined
    // initNetworkBackground(); // Removed - function not defined
});

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.remove();
            }
        }, 500);
    }, 2000);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Trigger counter animations
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
                
                // Trigger progress bar animations
                if (entry.target.classList.contains('tech-progress')) {
                    animateProgressBar(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // Observe stats, progress bars, and metric values
    document.querySelectorAll('.stat-number, .tech-progress, .metric-value').forEach(el => {
        observer.observe(el);
    });
}

// ===== HEADER SCROLL EFFECTS =====
function initHeaderEffects() {
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;
        
        // Add scrolled class when scrolled down
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header based on scroll direction
        if (scrollY > lastScrollY && scrollY > 200) {
            header.style.transform = 'translateY(-100%)';
      } else {
            header.style.transform = 'translateY(0)';
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!mobileMenuToggle || !mobileNav) return;
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close menu when clicking outside
    mobileNav.addEventListener('click', function(e) {
        if (e.target === mobileNav) {
            mobileMenuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mobileMenuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// ===== MODAL SYSTEM =====
function initModalSystem() {
    const modal = document.getElementById('contactModal');
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modalClose = document.getElementById('modalClose');

    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    // Close modal
    modalClose?.addEventListener('click', closeModal);
    
    // Close modal on overlay click
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function openModal() {
        // Prevent scroll before modal opens
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        // Add slight delay for smooth animation
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
        
        // Focus first input with proper timing
        const firstInput = modal.querySelector('input');
        setTimeout(() => {
            firstInput?.focus({ preventScroll: true });
        }, 400);
    }

    function closeModal() {
        modal.classList.remove('active');
        
        // Restore scroll after modal animation completes
        setTimeout(() => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }, 300);
    }
}

// ===== FORM HANDLING =====
function initFormHandling() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;

    // Enhance form inputs
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        // Add validation classes
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidation);
        
        // Floating label effect
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            await submitForm(form);
        }
    });

    function validateField(e) {
        const field = e.target;
        const group = field.parentElement;
        
        if (field.validity.valid && field.value.trim() !== '') {
            group.classList.add('valid');
            group.classList.remove('invalid');
        } else {
            group.classList.add('invalid');
            group.classList.remove('valid');
        }
    }

    function clearValidation(e) {
        const group = e.target.parentElement;
        group.classList.remove('invalid', 'valid');
    }

    function validateForm() {
        let isValid = true;
        inputs.forEach(input => {
            if (!input.validity.valid || input.value.trim() === '') {
                input.parentElement.classList.add('invalid');
                isValid = false;
            }
        });
        return isValid;
    }

    async function submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        
        // Loading state
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Sending...';
        submitBtn.classList.add('loading');
        
        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success state
            submitBtn.querySelector('.btn-text').textContent = 'Message Sent!';
            submitBtn.classList.add('success');
            
            // Reset form
            setTimeout(() => {
                form.reset();
                closeModal();
                resetButton();
            }, 1500);
            
        } catch (error) {
            // Error state
            submitBtn.querySelector('.btn-text').textContent = 'Error - Try Again';
            submitBtn.classList.add('error');
            
            setTimeout(resetButton, 2000);
        }

        function resetButton() {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = originalText;
            submitBtn.classList.remove('loading', 'success', 'error');
        }
    }
}

// ===== COUNTER ANIMATIONS =====
function initCounterAnimations() {
    function animateCounter(element) {
        if (element.classList.contains('counting')) return;
        
        element.classList.add('counting');
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            element.textContent = Math.floor(current);

            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }

    // Make animateCounter available globally
    window.animateCounter = animateCounter;
}

// ===== PROGRESS BAR ANIMATIONS =====
function initProgressBars() {
    function animateProgressBar(element) {
        if (element.classList.contains('animate')) return;
        
        element.classList.add('animate');
        const width = element.dataset.width;
        element.style.width = width;
    }

    // Make animateProgressBar available globally
    window.animateProgressBar = animateProgressBar;
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
        if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
                    top: offsetPosition,
            behavior: 'smooth'
          });
        }
        });
    });
}

// ===== POKER CARDS INTERACTIONS =====
function initFloatingElements() {
    const pokerCards = document.querySelectorAll('.poker-card');
    
    pokerCards.forEach((card, index) => {
        // Enhanced 3D hover effect for poker cards
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 8;
            
            // Get original transform values
            const originalTransforms = getComputedStyle(card).transform;
            
            card.style.transform = `
                ${originalTransforms} 
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(30px)
                scale(1.05)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset to original position - let CSS handle the positioning
            card.style.transform = '';
        });

        // Special effects for winner card
        if (card.classList.contains('winner-card')) {
            card.addEventListener('mouseenter', () => {
                createSparkles(card);
            });
        }
    });

    // Floating animation for code preview
    const codePreview = document.querySelector('.code-preview');
    if (codePreview) {
        codePreview.style.animationDelay = '2s';
    }
}

// ===== SPARKLE EFFECT FOR WINNER CARD =====
function createSparkles(element) {
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 100;
                box-shadow: 0 0 6px var(--primary);
            `;
            
            const rect = element.getBoundingClientRect();
            sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            
            document.body.appendChild(sparkle);
            
            // Animate sparkle
            sparkle.animate([
                { 
                    transform: 'translateY(0) scale(0)',
                    opacity: 1
                },
                {
                    transform: `translateY(-${20 + Math.random() * 20}px) scale(1)`,
                    opacity: 0.8
                },
                {
                    transform: `translateY(-${40 + Math.random() * 30}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => sparkle.remove();
            
        }, i * 100);
    }
}

// ===== PARALLAX EFFECTS =====
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', optimizedScrollHandler(() => {
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(window.pageYOffset * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }));
}

// ===== MOUSE GRID MOVEMENT =====
function initMouseGridMovement() {
    const heroGrid = document.querySelector('.hero-grid');
    if (!heroGrid) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // Smooth animation function
    function animateGrid() {
        // Lerp (linear interpolation) for smooth movement
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;
        
        // Apply transform with subtle movement (reduced scale)
        heroGrid.style.transform = `translate(${currentX * 0.02}px, ${currentY * 0.02}px)`;
        
        requestAnimationFrame(animateGrid);
    }
    
    // Mouse move handler
    document.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Calculate relative position from center
        mouseX = e.clientX - centerX;
        mouseY = e.clientY - centerY;
    });
    
    // Start animation loop
    animateGrid();
}

// ===== BUTTON INTERACTIONS =====
document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Ripple effect
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
  });

// ===== SERVICE CARD INTERACTIONS =====
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===== LOGO INTERACTIONS =====
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add shake animation
        logo.style.animation = 'logoShake 0.5s ease-in-out';
        
        setTimeout(() => {
            logo.style.animation = '';
        }, 500);
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('using-keyboard');
});

// ===== PERFORMANCE OPTIMIZATIONS =====
let ticking = false;

function optimizedScrollHandler(callback) {
    if (!ticking) {
        requestAnimationFrame(() => {
            callback();
            ticking = false;
        });
        ticking = true;
    }
}

// ===== INTERSECTION OBSERVER FOR PERFORMANCE =====
const lazyElements = document.querySelectorAll('[data-lazy]');
const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            element.classList.add('loaded');
            lazyObserver.unobserve(element);
        }
    });
});

lazyElements.forEach(el => lazyObserver.observe(el));

// ===== THEME UTILITIES =====
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function getTheme() {
    return localStorage.getItem('theme') || 'dark';
}

// Initialize theme
document.documentElement.setAttribute('data-theme', getTheme());

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.warn('Script error handled:', e.message);
});

// ===== CSS ANIMATIONS KEYFRAMES (Added via JS for dynamic effects) =====
const style = document.createElement('style');
style.textContent = `
    @keyframes logoShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s linear;
    }
    
    .using-keyboard *:focus {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }
    
    .form-group.valid .input-line {
        background: #10b981;
    }
    
    .form-group.invalid .input-line {
        background: #ef4444;
    }
    
    .form-group.invalid label {
        color: #ef4444;
    }
    
    .cta-btn.loading {
        opacity: 0.8;
        pointer-events: none;
    }
    
    .cta-btn.success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }
    
    .cta-btn.error {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }
    
    [data-lazy] {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    [data-lazy].loaded {
        opacity: 1;
        transform: translateY(0);
    }
`;

document.head.appendChild(style);

// ===== CONSOLE EASTER EGG =====
console.log(`
🚀 Welcome to esempio!

This site was built with:
• Modern CSS Grid & Flexbox
• Glassmorphism Design
• Smooth Animations
• Advanced JavaScript
• Performance Optimizations

Interested in our AI-powered SEO solutions?
Contact us to learn more!

Built with ❤️ and cutting-edge tech.
`);

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.esempio = {
    openModal: () => document.getElementById('contactModal').classList.add('active'),
    closeModal: () => document.getElementById('contactModal').classList.remove('active'),
    // animateCounter, // Removed - function not defined
    // animateProgressBar, // Removed - function not defined  
    // setTheme, // Removed - function not defined
    // getTheme // Removed - function not defined
};

// ===== READY STATE =====
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('ready');
    console.log('🎉 esempio is ready!');
}); 