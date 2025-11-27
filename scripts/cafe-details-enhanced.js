// Enhanced Café Details - Fully Dynamic
console.log('🚀 Loading enhanced café details...');

import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { preloadImages } from './image-loader.js';

// Get café ID and budget from URL
const urlParams = new URLSearchParams(window.location.search);
const cafeId = urlParams.get('id');
const userBudget = parseInt(urlParams.get('budget')) || null;
const userPeople = parseInt(urlParams.get('people')) || 2;

console.log('📍 Café ID from URL:', cafeId);
if (userBudget) {
    console.log('💰 User budget:', userBudget, 'for', userPeople, 'people');
}

// Load café data from Firebase
if (cafeId) {
    loadCafeDetails(cafeId);
} else {
    console.warn('⚠️ No café ID provided');
    setTimeout(hideLoader, 500);
}

async function loadCafeDetails(cafeId) {
    try {
        console.log('🔄 Fetching café data from Firebase...');
        const cafeRef = doc(db, 'cafes', cafeId);
        const cafeSnap = await getDoc(cafeRef);
        
        if (cafeSnap.exists()) {
            const cafe = { id: cafeSnap.id, ...cafeSnap.data() };
            console.log('✅ Café data loaded:', cafe);
            
            // Preload images
            if (cafe.images && cafe.images.length > 0) {
                console.log('🖼️ Preloading images...');
                try {
                    await preloadImages(cafe.images.slice(0, 3));
                    console.log('✅ Images preloaded');
                } catch (error) {
                    console.warn('⚠️ Some images failed to preload');
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
    console.log('📝 Updating page content...');
    
    // Update page title
    document.title = `${cafe.name || 'Café'} - Cafè Finder`;
    
    // Update header
    updateHeader(cafe);
    
    // Update overview tab
    updateOverview(cafe);
    
    // Update menu tab
    updateMenu(cafe);
    
    // Update sidebar
    updateSidebar(cafe);
    
    console.log('✅ Page content updated');
    hideLoader();
}

function updateHeader(cafe) {
    // Header image
    const headerImage = document.querySelector('.header-image');
    if (headerImage && cafe.images?.[0]) {
        headerImage.src = cafe.images[0];
        headerImage.alt = cafe.name;
    }
    
    // Café name
    const cafeName = document.querySelector('.cafe-name');
    if (cafeName) {
        cafeName.textContent = cafe.name || 'Café';
    }
    
    // Quick info
    const quickRating = document.querySelector('.quick-rating');
    if (quickRating) {
        quickRating.textContent = `⭐ ${cafe.rating || '4.5'}`;
    }
    
    const quickPrice = document.querySelector('.quick-price');
    if (quickPrice) {
        quickPrice.textContent = cafe.priceRange || '₹₹';
    }
}

function updateOverview(cafe) {
    // About section
    const aboutSection = document.querySelector('#overview .info-section p');
    if (aboutSection) {
        aboutSection.textContent = cafe.description || 'Discover this amazing café';
    }
    
    // Amenities
    const amenitiesGrid = document.querySelector('.amenities-grid');
    if (amenitiesGrid && cafe.amenities) {
        const amenityIcons = {
            'WiFi': '📶',
            'Parking': '🅿️',
            'Outdoor': '🌿',
            'Pet Friendly': '🐕',
            'Power Outlets': '🔌',
            'AC': '❄️',
            'Music': '🎵',
            'Rooftop': '🏙️'
        };
        
        amenitiesGrid.innerHTML = cafe.amenities.map(amenity => {
            const icon = Object.keys(amenityIcons).find(key => 
                amenity.toLowerCase().includes(key.toLowerCase())
            );
            return `
                <div class="amenity-item">
                    <span class="amenity-icon">${amenityIcons[icon] || '✓'}</span>
                    <span>${amenity}</span>
                </div>
            `;
        }).join('');
    }
    
    // Hours
    const hoursList = document.querySelector('.hours-list');
    if (hoursList && cafe.hours) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        hoursList.innerHTML = days.map(day => {
            const hours = cafe.hours[day.toLowerCase()] || cafe.hours?.default || '9:00 AM - 6:00 PM';
            return `
                <div class="hour-item">
                    <span>${day}</span>
                    <span>${hours}</span>
                </div>
            `;
        }).join('');
    }
}

function updateMenu(cafe) {
    const menuGrid = document.querySelector('.menu-grid');
    if (!menuGrid) return;
    
    let menuItems = [];
    
    if (cafe.menu && cafe.menu.length > 0) {
        console.log('📋 Rendering menu with', cafe.menu.length, 'items');
        menuItems = cafe.menu;
    } else {
        // Generate sample menu based on café type
        console.log('📋 Generating sample menu');
        menuItems = generateSampleMenu(cafe);
    }
    
    // If user has budget, highlight recommended items
    let recommendedItems = [];
    if (userBudget) {
        const budgetPerPerson = userBudget;
        recommendedItems = menuItems.filter(item => item.price <= budgetPerPerson);
        console.log(`💡 Found ${recommendedItems.length} items within budget of ₹${budgetPerPerson}`);
    }
    
    // Add budget recommendation section if applicable
    if (userBudget && recommendedItems.length > 0) {
        const recommendSection = document.createElement('div');
        recommendSection.className = 'budget-recommendations';
        recommendSection.innerHTML = `
            <div class="budget-banner">
                <h3>💰 Recommended for Your Budget (₹${userBudget} per person)</h3>
                <p>${recommendedItems.length} items within your budget</p>
            </div>
        `;
        menuGrid.parentElement.insertBefore(recommendSection, menuGrid);
    }
    
    menuGrid.innerHTML = menuItems.map(item => {
        const isRecommended = userBudget && item.price <= userBudget;
        return `
            <div class="menu-card-3d ${isRecommended ? 'recommended' : ''}">
                ${isRecommended ? '<div class="recommended-badge">✨ Within Budget</div>' : ''}
                <div class="menu-card-image">
                    <img src="${item.image || cafe.images?.[0] || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'}" 
                         alt="${item.name}"
                         class="loaded">
                </div>
                <div class="menu-card-content">
                    <h3>${item.name}</h3>
                    <p>${item.description || ''}</p>
                    <span class="menu-price">₹${item.price}</span>
                    ${isRecommended ? '<span class="budget-match">Perfect for you!</span>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

function generateSampleMenu(cafe) {
    const basePrice = extractBasePrice(cafe.priceRange);
    
    return [
        {
            name: 'Filter Coffee',
            description: 'Traditional South Indian filter coffee',
            price: Math.round(basePrice * 0.4), // ₹40-60
            image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'
        },
        {
            name: 'Cappuccino',
            description: 'Espresso with steamed milk foam',
            price: Math.round(basePrice * 0.8), // ₹80-120
            image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400'
        },
        {
            name: 'Latte',
            description: 'Smooth espresso with steamed milk',
            price: Math.round(basePrice * 0.9), // ₹90-135
            image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400'
        },
        {
            name: 'Cold Coffee',
            description: 'Refreshing iced coffee',
            price: Math.round(basePrice * 1.0), // ₹100-150
            image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400'
        },
        {
            name: 'Masala Chai',
            description: 'Spiced Indian tea',
            price: Math.round(basePrice * 0.3), // ₹30-45
            image: 'https://images.unsplash.com/photo-1597318181274-17e0c5e4a4c0?w=400'
        },
        {
            name: 'Veg Sandwich',
            description: 'Fresh vegetables on toasted bread',
            price: Math.round(basePrice * 1.2), // ₹120-180
            image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400'
        },
        {
            name: 'Paneer Sandwich',
            description: 'Grilled paneer with spices',
            price: Math.round(basePrice * 1.4), // ₹140-210
            image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400'
        },
        {
            name: 'Pasta',
            description: 'Italian pasta with choice of sauce',
            price: Math.round(basePrice * 1.8), // ₹180-270
            image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400'
        },
        {
            name: 'Samosa (2 pcs)',
            description: 'Crispy fried pastry with potato filling',
            price: Math.round(basePrice * 0.5), // ₹50-75
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'
        },
        {
            name: 'Brownie',
            description: 'Rich chocolate brownie',
            price: Math.round(basePrice * 0.9), // ₹90-135
            image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400'
        }
    ];
}

function extractBasePrice(priceRange) {
    if (!priceRange) return 100;
    const rupeeCount = (priceRange.match(/₹/g) || []).length;
    // More realistic Indian café prices
    // ₹ = Budget (₹100 base)
    // ₹₹ = Mid-range (₹150 base)
    // ₹₹₹ = Premium (₹200 base)
    if (rupeeCount === 1) return 100;
    if (rupeeCount === 2) return 150;
    return 200;
}

function updateSidebar(cafe) {
    // Location
    const locationAddress = document.querySelector('.location-address');
    if (locationAddress && cafe.location) {
        locationAddress.textContent = cafe.location.address || 'Location not available';
    }
    
    // Contact info
    const contactCard = document.querySelector('.sidebar-card:last-child');
    if (contactCard && cafe.contact) {
        contactCard.innerHTML = `
            <h3>Contact</h3>
            ${cafe.contact.phone ? `<p>📞 ${cafe.contact.phone}</p>` : ''}
            ${cafe.contact.email ? `<p>📧 ${cafe.contact.email}</p>` : ''}
            ${cafe.contact.website ? `<p>🌐 <a href="${cafe.contact.website}" target="_blank">Website</a></p>` : ''}
        `;
    }
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
    hideLoader();
    const mainContent = document.querySelector('.cafe-details-page');
    if (mainContent) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: white; min-height: 50vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <h2 style="font-size: 3rem; margin-bottom: 1rem;">😕</h2>
                <h2 style="color: #00d4ff; margin-bottom: 1rem;">${message}</h2>
                <p style="color: rgba(255,255,255,0.7); margin-bottom: 2rem;">The café you're looking for doesn't exist or has been removed.</p>
                <a href="index.html" style="color: #00d4ff; text-decoration: none; padding: 1rem 2rem; border: 2px solid #00d4ff; border-radius: 10px; transition: all 0.3s;">
                    ← Back to Home
                </a>
            </div>
        `;
    }
}

// Tab switching (keep existing functionality)
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

console.log('✅ Enhanced café details initialized');
