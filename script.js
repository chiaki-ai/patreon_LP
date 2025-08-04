// Video Modal Functionality
function playVideo() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('heroVideo');
    modal.style.display = 'block';
    video.play();
}

function closeVideo() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('heroVideo');
    modal.style.display = 'none';
    video.pause();
    video.currentTime = 0;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('videoModal');
    if (event.target == modal) {
        closeVideo();
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements on scroll
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.benefit-card, .testimonial, .step');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// CTA Button tracking (for analytics)
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Track button clicks
        console.log('CTA clicked:', this.textContent);
        
        // You can add analytics tracking here
        // gtag('event', 'click', {
        //     event_category: 'CTA',
        //     event_label: this.textContent
        // });
    });
});

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Form validation (if contact form is added)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (scrollButton) {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    }
});

// Preload critical images
function preloadImages() {
    const imageUrls = [
        'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=800&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=600&fit=crop&crop=face'
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Gift sharing functionality
function shareGift(platform) {
    const giftUrl = 'https://www.patreon.com/MesmerizingIndianAILookbook/gift';
    const text = '🎨 Why not gift the world of beautiful AI art? Give someone a special experience!';
    
    let shareUrl = '';
    
    switch(platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(giftUrl)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(giftUrl)}`;
            break;
        case 'line':
            shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(giftUrl)}&text=${encodeURIComponent(text)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function copyGiftLink() {
    const giftUrl = 'https://www.patreon.com/MesmerizingIndianAILookbook/gift';
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(giftUrl).then(() => {
            showCopyNotification();
        }).catch(err => {
            fallbackCopyTextToClipboard(giftUrl);
        });
    } else {
        fallbackCopyTextToClipboard(giftUrl);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotification();
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

function showCopyNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = 'Gift link copied to clipboard!';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    preloadImages();
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Performance optimization
window.addEventListener('load', function() {
    // Remove loading states
    document.querySelectorAll('.loading').forEach(el => {
        el.classList.remove('loading');
    });
});
