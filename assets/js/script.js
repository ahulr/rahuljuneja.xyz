document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const CONFIG = {
        observer: {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        },
        animations: {
            typingDelay: 100,
            typingStartDelay: 500,
            rippleDuration: 600,
            scrollThreshold: 300
        },
        selectors: {
            sections: 'section',
            profileImg: 'header img',
            skillsList: '#skills ul',
            skillsItems: '#skills li',
            headerTitle: 'header h1',
            projectLinks: '.project-link'
        }
    };

    // Utility functions
    const utils = {
        createElement: (tag, className, innerHTML) => {
            const element = document.createElement(tag);
            if (className) element.className = className;
            if (innerHTML) element.innerHTML = innerHTML;
            return element;
        },

        addStyles: (cssText) => {
            const style = document.createElement('style');
            style.textContent = cssText;
            document.head.appendChild(style);
        },

        debounce: (func, wait) => {
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
    };

    // Intersection Observer for fade-in animations
    const createIntersectionObserver = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, CONFIG.observer);

        // Observe sections for fade-in animation
        document.querySelectorAll(CONFIG.selectors.sections).forEach(el => {
            observer.observe(el);
        });
    };

    // Profile Image Hover Effect
    const initProfileImageHover = () => {
        const profileImg = document.querySelector(CONFIG.selectors.profileImg);
        if (!profileImg) return;

        profileImg.addEventListener('mouseenter', () => {
            profileImg.style.transform = 'scale(1.05) rotate(2deg)';
        });
        
        profileImg.addEventListener('mouseleave', () => {
            profileImg.style.transform = 'scale(1) rotate(0deg)';
        });
    };

    // Skills Animation with staggered delay
    const initSkillsAnimation = () => {
        const skillsList = document.querySelector(CONFIG.selectors.skillsList);
        if (!skillsList) return;

        const skillsItems = skillsList.querySelectorAll(CONFIG.selectors.skillsItems);
        skillsItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('fade-in-up');
        });
    };

    // Smooth Scrolling for Internal Links
    const initSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // Typing Effect for Header Title
    const initTypingEffect = () => {
        const headerTitle = document.querySelector(CONFIG.selectors.headerTitle);
        if (!headerTitle) return;

        const text = headerTitle.textContent;
        headerTitle.textContent = '';
        
        // Create span for text and cursor
        const textSpan = utils.createElement('span');
        const cursorSpan = utils.createElement('span', 'typing-cursor', '|');
        
        headerTitle.appendChild(textSpan);
        headerTitle.appendChild(cursorSpan);

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                textSpan.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, CONFIG.animations.typingDelay);
            } else {
                cursorSpan.remove();
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, CONFIG.animations.typingStartDelay);
    };

    // Interactive Skills Cards with Ripple Effect
    const initSkillsRipple = () => {
        const skillItems = document.querySelectorAll('#skills li');
        skillItems.forEach(item => {
            item.addEventListener('click', () => {
                // Create ripple effect
                const ripple = utils.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    left: 50%;
                    top: 50%;
                    width: 20px;
                    height: 20px;
                    margin-left: -10px;
                    margin-top: -10px;
                `;
                
                item.style.position = 'relative';
                item.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, CONFIG.animations.rippleDuration);
            });
        });
    };

    // Scroll Progress Indicator
    const createScrollProgress = () => {
        const progressBar = utils.createElement('div', 'scroll-progress');
        document.body.appendChild(progressBar);

        const updateProgress = utils.debounce(() => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }, 10);

        window.addEventListener('scroll', updateProgress);
    };

    // Back to Top Button
    const createBackToTop = () => {
        const backToTop = utils.createElement('button', 'back-to-top', '↑');
        document.body.appendChild(backToTop);

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Show/hide based on scroll position
        const toggleBackToTop = utils.debounce(() => {
            if (window.pageYOffset > CONFIG.animations.scrollThreshold) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, 10);

        window.addEventListener('scroll', toggleBackToTop);
    };

    // Page Load Animation
    const initPageLoadAnimation = () => {
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });
    };

    // Error handling wrapper
    const safeExecute = (fn, name) => {
        try {
            fn();
        } catch (error) {
            console.warn(`Error in ${name}:`, error);
        }
    };

    // Initialize all components
    const init = () => {
        safeExecute(createIntersectionObserver, 'Intersection Observer');
        safeExecute(initProfileImageHover, 'Profile Image Hover');
        safeExecute(initSkillsAnimation, 'Skills Animation');
        safeExecute(initSmoothScrolling, 'Smooth Scrolling');
        safeExecute(initTypingEffect, 'Typing Effect');
        safeExecute(initSkillsRipple, 'Skills Ripple');
        safeExecute(createScrollProgress, 'Scroll Progress');
        safeExecute(createBackToTop, 'Back to Top');
        safeExecute(initPageLoadAnimation, 'Page Load Animation');
    };

    // Start initialization
    init();
});
