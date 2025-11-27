// Main JavaScript for Café Finder

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Search functionality
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-input');
const locationBtn = document.querySelector('.location-btn');

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `map.html?search=${encodeURIComponent(query)}`;
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}

if (locationBtn) {
    locationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            locationBtn.innerHTML = '<span class="loading-spinner"></span>';
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    window.location.href = `map.html?lat=${latitude}&lng=${longitude}`;
                },
                (error) => {
                    alert('Unable to get your location. Please enable location services.');
                    locationBtn.innerHTML = '<span class="location-icon">📍</span>';
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    });
}

// Carousel auto-scroll
const carouselTrack = document.querySelector('.carousel-track');
if (carouselTrack) {
    let isDown = false;
    let startX;
    let scrollLeft;

    carouselTrack.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - carouselTrack.offsetLeft;
        scrollLeft = carouselTrack.scrollLeft;
    });

    carouselTrack.addEventListener('mouseleave', () => {
        isDown = false;
    });

    carouselTrack.addEventListener('mouseup', () => {
        isDown = false;
    });

    carouselTrack.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carouselTrack.offsetLeft;
        const walk = (x - startX) * 2;
        carouselTrack.scrollLeft = scrollLeft - walk;
    });
}

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.cafe-card-3d, .pick-card, .section-title').forEach(el => {
    observer.observe(el);
});

// Parallax effect for hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - scrolled / 500;
    }
});

console.log('Café Finder loaded successfully! ☕');


// Mobile menu functionality
function initMobileMenu() {
    const navbar = document.querySelector('.navbar .nav-container');
    
    if (!navbar) return;
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.setAttribute('aria-label', 'Toggle menu');
    
    // Create mobile nav
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    
    // Clone nav links
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const mobileLinks = navLinks.cloneNode(true);
        mobileNav.appendChild(mobileLinks);
    }
    
    // Add to DOM
    navbar.appendChild(mobileMenuBtn);
    document.body.appendChild(mobileNav);
    
    // Toggle functionality
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        mobileMenuBtn.innerHTML = mobileNav.classList.contains('active') ? '✕' : '☰';
    });
    
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileMenuBtn.innerHTML = '☰';
        });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileNav.classList.remove('active');
            mobileMenuBtn.innerHTML = '☰';
        }
    });
}

// Toast notification system
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Loading overlay
function showLoading() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner-large"></div>
            <p>Loading...</p>
        </div>
    `;
    document.body.appendChild(overlay);
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }
}

// Load cafés from Firestore
async function loadAndDisplayCafes() {
    try {
        // Dynamically import the load-cafes module
        const { initHomepage } = await import('./load-cafes.js');
        await initHomepage();
    } catch (error) {
        console.error('Error loading cafés:', error);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    
    // Load cafés if we're on the homepage
    if (document.querySelector('.featured-cafes') || document.querySelector('.carousel-track')) {
        loadAndDisplayCafes();
    }
});

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
`;
document.head.appendChild(style);

// Expose utility functions globally
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
