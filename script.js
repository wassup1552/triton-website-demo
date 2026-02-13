// ============================================
// TRITON RESTAURANT - INTERACTIVE FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // NAVIGATION FUNCTIONALITY
    // ============================================
    
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navbar.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navHeight = navbar.offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ============================================
    // MENU PAGE FUNCTIONALITY
    // ============================================
    
    const menuNavBtns = document.querySelectorAll('.menu-nav-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    if (menuNavBtns.length > 0) {
        // Menu category filtering
        menuNavBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Update active button
                menuNavBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter categories
                menuCategories.forEach(cat => {
                    const catCategory = cat.getAttribute('data-category');
                    
                    if (category === 'all' || catCategory === category) {
                        cat.style.display = 'block';
                        // Fade in animation
                        cat.style.opacity = '0';
                        setTimeout(() => {
                            cat.style.transition = 'opacity 0.5s ease';
                            cat.style.opacity = '1';
                        }, 10);
                    } else {
                        cat.style.display = 'none';
                    }
                });
                
                // Scroll to menu content
                const menuContent = document.querySelector('.menu-content');
                if (menuContent) {
                    const navHeight = navbar.offsetHeight;
                    const menuNavHeight = document.querySelector('.menu-nav-container').offsetHeight;
                    const scrollPosition = menuContent.offsetTop - navHeight - menuNavHeight - 20;
                    
                    window.scrollTo({
                        top: scrollPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const fadeElements = document.querySelectorAll('.dish-card, .menu-item, .gallery-item, .feature-item, .info-block');
    
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
    
    // ============================================
    // IMAGE LAZY LOADING
    // ============================================
    
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
    
    // ============================================
    // GALLERY LIGHTBOX (Simple Implementation)
    // ============================================
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                // Create lightbox overlay
                const lightbox = document.createElement('div');
                lightbox.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    animation: fadeIn 0.3s ease;
                `;
                
                // Create image element
                const lightboxImg = document.createElement('img');
                lightboxImg.src = img.src;
                lightboxImg.style.cssText = `
                    max-width: 90%;
                    max-height: 90%;
                    object-fit: contain;
                    box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
                `;
                
                lightbox.appendChild(lightboxImg);
                document.body.appendChild(lightbox);
                
                // Prevent body scroll
                document.body.style.overflow = 'hidden';
                
                // Close on click
                lightbox.addEventListener('click', function() {
                    lightbox.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        document.body.removeChild(lightbox);
                        document.body.style.overflow = '';
                    }, 300);
                });
            }
        });
    });
    
    // ============================================
    // ACTIVE NAVIGATION LINK ON SCROLL
    // ============================================
    
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // ============================================
    // PERFORMANCE OPTIMIZATIONS
    // ============================================
    
    // Debounce function for scroll events
    function debounce(func, wait = 10) {
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
    
    // Apply debounce to scroll events
    window.addEventListener('scroll', debounce(function() {
        // Any additional scroll-based functionality
    }, 10));
    
    // ============================================
    // MENU SEARCH FUNCTIONALITY (Optional Enhancement)
    // ============================================
    
    const menuSearchInput = document.getElementById('menuSearch');
    if (menuSearchInput) {
        menuSearchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const menuItems = document.querySelectorAll('.menu-item');
            
            menuItems.forEach(item => {
                const itemTitle = item.querySelector('h4').textContent.toLowerCase();
                const itemDescription = item.querySelector('.item-description');
                const description = itemDescription ? itemDescription.textContent.toLowerCase() : '';
                
                if (itemTitle.includes(searchTerm) || description.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ============================================
    // CONSOLE MESSAGE
    // ============================================
    
    console.log('%c🍽️ Welcome to Triton Restaurant', 'color: #D4AF37; font-size: 20px; font-weight: bold;');
    console.log('%cWhere Mediterranean heritage meets global flavors', 'color: #2B4162; font-size: 14px; font-style: italic;');
    
});

// ============================================
// CSS ANIMATIONS (Add to styles)
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);
