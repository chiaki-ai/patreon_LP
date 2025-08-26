/**
 * Main Application JavaScript
 * Refactored for better performance and maintainability
 */

class PatreonLandingApp {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupIntersectionObserver();
        this.setupLazyLoading();
        this.preloadCriticalAssets();
        this.setupAnalytics();
    }

    bindEvents() {
        // DOM Content Loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }

        // Window Load
        window.addEventListener('load', () => this.onWindowLoad());

        // Scroll Events (throttled)
        window.addEventListener('scroll', this.throttle(() => this.onScroll(), 16));

        // Click Events (delegated)
        document.addEventListener('click', (e) => this.handleClicks(e));

        // Modal Events
        window.addEventListener('click', (e) => this.handleModalClick(e));

        // Keyboard Events
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    onDOMReady() {
        this.setupSmoothScrolling();
        this.initializeAnimations();
        document.body.classList.add('loaded');
    }

    onWindowLoad() {
        this.removeLoadingStates();
        this.optimizePerformance();
    }

    onScroll() {
        this.updateScrollButton();
        this.updateProgressBar();
    }

    handleClicks(e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;
        
        switch (action) {
            case 'play-video':
                this.playVideo();
                break;
            case 'close-video':
                this.closeVideo();
                break;
            case 'scroll-to-top':
                this.scrollToTop();
                break;
            case 'share-gift':
                this.shareGift(target.dataset.platform);
                break;
            case 'copy-gift-link':
                this.copyGiftLink();
                break;
            case 'track-cta':
                this.trackCTAClick(target);
                break;
        }
    }

    handleModalClick(e) {
        const modal = document.getElementById('videoModal');
        if (e.target === modal) {
            this.closeVideo();
        }
    }

    handleKeyboard(e) {
        if (e.key === 'Escape') {
            this.closeVideo();
        }
    }

    // Video Modal Management
    playVideo() {
        const modal = document.getElementById('videoModal');
        const video = document.getElementById('heroVideo');
        
        if (modal && video) {
            modal.style.display = 'block';
            video.play().catch(err => console.warn('Video play failed:', err));
            document.body.style.overflow = 'hidden';
        }
    }

    closeVideo() {
        const modal = document.getElementById('videoModal');
        const video = document.getElementById('heroVideo');
        
        if (modal && video) {
            modal.style.display = 'none';
            video.pause();
            video.currentTime = 0;
            document.body.style.overflow = '';
        }
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Intersection Observer for Animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
    }

    initializeAnimations() {
        const animateElements = document.querySelectorAll(
            '.benefit-card, .testimonial, .step, .pricing-card, .meaning-item'
        );
        
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(el);
        });
    }

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    // Lazy Loading
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        imageObserver.unobserve(entry.target);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    loadImage(img) {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        img.classList.add('loaded');
    }

    // Asset Preloading
    preloadCriticalAssets() {
        const criticalImages = [
            '2025-04-12/00005-1269867993.png',
            '2025-04-14/00010-2009244279.png',
            '2025-04-14/00025-2009244294.png'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Social Sharing
    shareGift(platform) {
        const giftUrl = 'https://www.patreon.com/MesmerizingIndianAILookbook/gift';
        const text = '🎨 Why not gift the world of beautiful AI art? Give someone a special experience!';
        
        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(giftUrl)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(giftUrl)}`,
            line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(giftUrl)}&text=${encodeURIComponent(text)}`
        };
        
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400,noopener,noreferrer');
        }
    }

    async copyGiftLink() {
        const giftUrl = 'https://www.patreon.com/MesmerizingIndianAILookbook/gift';
        
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(giftUrl);
            } else {
                this.fallbackCopyText(giftUrl);
            }
            this.showNotification('Gift link copied to clipboard!', 'success');
        } catch (err) {
            console.error('Copy failed:', err);
            this.showNotification('Failed to copy link', 'error');
        }
    }

    fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
        
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            throw new Error('Fallback copy failed');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Scroll Management
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    updateScrollButton() {
        const scrollButton = document.querySelector('.scroll-to-top');
        if (scrollButton) {
            scrollButton.style.display = window.pageYOffset > 300 ? 'block' : 'none';
        }
    }

    updateProgressBar() {
        const progressBar = document.querySelector('.reading-progress');
        if (progressBar) {
            const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = `${Math.min(scrolled, 100)}%`;
        }
    }

    // Analytics
    setupAnalytics() {
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('click', () => this.trackCTAClick(button));
        });
    }

    trackCTAClick(button) {
        const buttonText = button.textContent.trim();
        const buttonHref = button.href || '';
        
        // Console logging for development
        console.log('CTA clicked:', {
            text: buttonText,
            href: buttonHref,
            timestamp: new Date().toISOString()
        });
        
        // Add your analytics tracking here
        // Example: gtag('event', 'click', { event_category: 'CTA', event_label: buttonText });
    }

    // Performance Optimizations
    removeLoadingStates() {
        document.querySelectorAll('.loading').forEach(el => {
            el.classList.remove('loading');
        });
    }

    optimizePerformance() {
        // Defer non-critical scripts
        this.loadNonCriticalScripts();
        
        // Optimize images
        this.optimizeImages();
    }

    loadNonCriticalScripts() {
        // Load analytics or other non-critical scripts after page load
        // Example: Load Google Analytics, Facebook Pixel, etc.
    }

    optimizeImages() {
        // Add loading="lazy" to images below the fold
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach((img, index) => {
            if (index > 2) { // Skip first few images
                img.loading = 'lazy';
            }
        });
    }

    // Utility Functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
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
}

// Initialize the application
const app = new PatreonLandingApp();
