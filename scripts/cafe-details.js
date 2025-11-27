// Café Details page functionality
console.log('🚀 Loading café details...');

import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { preloadImages } from './image-loader.js';

// Get café ID from URL
const urlParams = new URLSearchParams(window.location.search);
const cafeId = urlParams.get('id');

console.log('📍 Café ID from URL:', cafeId);

// Load café data from Firebase
if (cafeId) {
    loadCafeDetails(cafeId);
} else {
    console.warn('⚠️ No café ID provided, showing default content');
    // Still hide loader after a moment
    setTimeout(hideLoader, 500);
}

async function loadCafeDetails(cafeId) {
    try {
        console.log('🔄 Fetching café data from Firebase...');
        const cafeRef = doc(db, 'cafes', cafeId);
        const cafeSnap = await getDoc(cafeRef);
        
        if (cafeSnap.exists()) {
            const cafe = cafeSnap.data();
            console.log('✅ Café data loaded:', cafe);
            
            // Preload images before showing content
            if (cafe.images && cafe.images.length > 0) {
                console.log('🖼️ Preloading images...');
                try {
                    await preloadImages(cafe.images.slice(0, 3)); // Preload first 3 images
                    console.log('✅ Images preloaded');
                } catch (error) {
                    console.warn('⚠️ Some images failed to preload, continuing anyway');
                }
            }
            
            updatePageContent(cafe);
        } else {
            console.error('❌ Café not found');
            showError('Café not found');
        }
    } catch (error) {
        console.error('❌ Error loading café:', error);
        showError('Error loading café details');
    }
}

function updatePageContent(cafe) {
    // Update page title
    document.title = `${cafe.name || 'Café'} - Cafè Finder`;
    
    // Update header image
    const headerImage = document.querySelector('.header-image');
    if (headerImage && cafe.images && cafe.images[0]) {
        headerImage.src = cafe.images[0];
    }
    
    // Update café name
    const cafeName = document.querySelector('.cafe-name');
    if (cafeName) {
        cafeName.textContent = cafe.name || 'Café';
    }
    
    // Update rating
    const ratingValue = document.querySelector('.rating-value');
    if (ratingValue) {
        ratingValue.textContent = cafe.rating || '4.5';
    }
    
    // Update quick rating in header
    const quickRating = document.querySelector('.quick-rating');
    if (quickRating) {
        quickRating.textContent = `⭐ ${cafe.rating || '4.5'}`;
    }
    
    // Update price in header
    const quickPrice = document.querySelector('.quick-price');
    if (quickPrice) {
        quickPrice.textContent = cafe.priceRange || '₹₹';
    }
    
    // Update location
    const locationText = document.querySelector('.location-text');
    if (locationText && cafe.location) {
        locationText.textContent = cafe.location.address || 'Location';
    }
    
    // Update description
    const cafeDescription = document.querySelector('.cafe-description');
    if (cafeDescription) {
        cafeDescription.textContent = cafe.description || 'Discover this amazing café';
    }
    
    // Update price range
    const priceRange = document.querySelector('.price-range');
    if (priceRange) {
        priceRange.textContent = cafe.priceRange || '₹₹';
    }
    
    // Update amenities
    const amenitiesList = document.querySelector('.amenities-list');
    if (amenitiesList && cafe.amenities) {
        amenitiesList.innerHTML = cafe.amenities.map(amenity => `
            <li class="amenity-item">
                <i class="fas fa-check-circle"></i>
                <span>${amenity}</span>
            </li>
        `).join('');
    }
    
    // Update tags
    const tagsContainer = document.querySelector('.tags-container');
    if (tagsContainer && cafe.tags) {
        tagsContainer.innerHTML = cafe.tags.map(tag => `
            <span class="tag">${tag}</span>
        `).join('');
    }
    
    console.log('✅ Page content updated');
    
    // Show content smoothly
    hideLoader();
}

function hideLoader() {
    const loader = document.getElementById('pageLoader');
    const content = document.getElementById('cafeDetailsPage');
    
    if (loader) {
        loader.classList.add('hidden');
    }
    
    if (content) {
        content.classList.add('loaded');
    }
    
    console.log('✅ Page loaded smoothly');
}

function showError(message) {
    const mainContent = document.querySelector('.cafe-details-page');
    if (mainContent) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: white;">
                <h2>😕 ${message}</h2>
                <p>Please try again or go back to the home page.</p>
                <a href="index.html" style="color: #00d4ff;">← Back to Home</a>
            </div>
        `;
    }
}

// Tab switching
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        // Remove active class from all tabs and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Save button functionality
const saveBtn = document.querySelector('.save-btn');
let isSaved = false;

if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        isSaved = !isSaved;
        const heartIcon = saveBtn.querySelector('.heart-icon');
        
        if (isSaved) {
            heartIcon.textContent = '♥';
            saveBtn.style.background = 'rgba(212, 175, 55, 0.3)';
            
            // Add to saved cafés (localStorage)
            const savedCafes = JSON.parse(localStorage.getItem('savedCafes') || '[]');
            savedCafes.push({
                name: document.querySelector('.cafe-name').textContent,
                image: document.querySelector('.header-image').src,
                rating: '4.8',
                distance: '0.5 km'
            });
            localStorage.setItem('savedCafes', JSON.stringify(savedCafes));
        } else {
            heartIcon.textContent = '♡';
            saveBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        }
    });
}

// Parallax effect for header
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.header-image');
    if (header) {
        header.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Menu card hover effect
const menuCards = document.querySelectorAll('.menu-card-3d');

menuCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
        }
    });
}, observerOptions);

document.querySelectorAll('.info-section, .menu-card-3d, .review-card').forEach(el => {
    observer.observe(el);
});

console.log('Café details page loaded! ☕');
