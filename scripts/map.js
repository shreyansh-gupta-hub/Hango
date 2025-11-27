// Map page functionality with Leaflet integration and real-time café loading
import { loadCafesForMap } from './load-cafes.js';

const cafeInfoCard = document.getElementById('cafeInfoCard');
const mapLoading = document.getElementById('mapLoading');

// Default café data (fallback) - Bhopal locations
let cafes = [
    {
        id: 1,
        name: 'Cafe Amado',
        lat: 23.2599,
        lng: 77.4126,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600',
        rating: '4.8',
        reviews: '234',
        distance: '0.5 km',
        description: 'Aesthetic minimalist café with pour-over coffee',
        tags: ['WiFi', 'Aesthetic', 'Coffee']
    },
    {
        id: 2,
        name: 'Blue Tokai Coffee',
        lat: 23.2650,
        lng: 77.4180,
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600',
        rating: '4.9',
        reviews: '189',
        distance: '1.2 km',
        description: 'Professional workspace with roasted coffee blends',
        tags: ['WiFi', 'Work Space', 'Coffee']
    },
    {
        id: 3,
        name: 'Bhopal Bakehouse',
        lat: 23.2550,
        lng: 77.4050,
        image: 'https://images.unsplash.com/photo-1559305616-3b04e37e3b60?w=600',
        rating: '4.7',
        reviews: '312',
        distance: '2.1 km',
        description: 'Chic interiors with cheesecakes and macarons',
        tags: ['Bakery', 'Desserts', 'Cozy']
    },
    {
        id: 4,
        name: 'Indian Coffee House',
        lat: 23.2620,
        lng: 77.4200,
        image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600',
        rating: '4.6',
        reviews: '156',
        distance: '0.8 km',
        description: 'Old-school nostalgia with filter coffee',
        tags: ['Classic', 'Budget', 'Filter Coffee']
    },
    {
        id: 5,
        name: 'The Roof Tree',
        lat: 23.2580,
        lng: 77.4100,
        image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600',
        rating: '4.9',
        reviews: '278',
        distance: '1.5 km',
        description: 'Rooftop city view with pasta and mocktails',
        tags: ['Rooftop', 'View', 'Ambience']
    }
];

// Initialize Leaflet map
let map;
let markers = [];
let currentCafe = null;

function initMap() {
    console.log('Initializing map...');
    
    // Create map centered on Bhopal, Madhya Pradesh, India
    map = L.map('map', {
        center: [23.2599, 77.4126], // Bhopal coordinates
        zoom: 13, // Good zoom level to see the city
        zoomControl: true
    });
    
    console.log('Map object created - centered on Bhopal, MP');
    
    // Add OpenStreetMap tiles with dark theme
    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 19,
        minZoom: 10
    }).addTo(map);
    
    tileLayer.on('load', () => {
        console.log('Map tiles loaded successfully');
    });
    
    tileLayer.on('tileerror', (error) => {
        console.error('Tile loading error:', error);
    });
    
    console.log('Tile layer added');
    
    // Custom coffee cup icon
    const coffeeIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div class="marker-pin"><i class="fas fa-mug-hot"></i></div>',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
    
    // Add markers for each café
    cafes.forEach(cafe => {
        const marker = L.marker([cafe.lat, cafe.lng], { icon: coffeeIcon })
            .addTo(map)
            .on('click', () => showCafeInfo(cafe));
        
        markers.push({ marker, cafe });
    });
    
    console.log(`Added ${markers.length} markers to map`);
    
    // Hide loading indicator
    if (mapLoading) {
        mapLoading.style.display = 'none';
    }
    
    // Force map to refresh
    setTimeout(() => {
        map.invalidateSize();
        console.log('Map size invalidated and refreshed');
    }, 100);
    
    console.log(`✓ Map initialized with ${cafes.length} cafés`);
}

// Show café info card
function showCafeInfo(cafe) {
    currentCafe = cafe;
    
    // Update card content
    document.getElementById('cafeImage').src = cafe.image;
    document.getElementById('cafeName').textContent = cafe.name;
    document.getElementById('cafeRating').textContent = `${cafe.rating} (${cafe.reviews} reviews)`;
    document.getElementById('cafeDistance').textContent = cafe.distance + ' away';
    document.getElementById('cafeDescription').textContent = cafe.description;
    
    // Update tags with icons
    const tagsContainer = document.getElementById('cafeTags');
    tagsContainer.innerHTML = cafe.tags.map(tag => {
        let icon = 'fa-tag';
        if (tag.toLowerCase().includes('wifi')) icon = 'fa-wifi';
        else if (tag.toLowerCase().includes('outdoor') || tag.toLowerCase().includes('rooftop')) icon = 'fa-leaf';
        else if (tag.toLowerCase().includes('pet')) icon = 'fa-paw';
        else if (tag.toLowerCase().includes('power') || tag.toLowerCase().includes('outlet')) icon = 'fa-plug';
        else if (tag.toLowerCase().includes('quiet')) icon = 'fa-volume-mute';
        else if (tag.toLowerCase().includes('quick') || tag.toLowerCase().includes('takeaway')) icon = 'fa-bolt';
        else if (tag.toLowerCase().includes('premium')) icon = 'fa-crown';
        else if (tag.toLowerCase().includes('brunch')) icon = 'fa-utensils';
        else if (tag.toLowerCase().includes('pastries') || tag.toLowerCase().includes('dessert')) icon = 'fa-cake-candles';
        
        return `<span class="tag"><i class="fas ${icon}"></i> ${tag}</span>`;
    }).join('');
    
    // Update view details link
    document.getElementById('viewDetailsBtn').href = `cafe-details.html?id=${cafe.id}`;
    
    // Show card
    cafeInfoCard.classList.add('active');
    
    // Center map on selected café
    map.setView([cafe.lat, cafe.lng], 16, { animate: true });
}

// Handle card drag to close
let startY = 0;
let currentY = 0;
let isDragging = false;

const cardHandle = document.querySelector('.card-handle');

if (cardHandle) {
    // Mouse events
    cardHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY = e.clientY;
        cardHandle.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentY = e.clientY - startY;
        if (currentY > 0) {
            cafeInfoCard.style.transform = `translateY(${currentY}px)`;
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        cardHandle.style.cursor = 'grab';
        
        if (currentY > 100) {
            cafeInfoCard.classList.remove('active');
        }
        
        cafeInfoCard.style.transform = '';
        currentY = 0;
    });
    
    // Touch events for mobile
    cardHandle.addEventListener('touchstart', (e) => {
        isDragging = true;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY - startY;
        if (currentY > 0) {
            cafeInfoCard.style.transform = `translateY(${currentY}px)`;
        }
    });
    
    document.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        if (currentY > 100) {
            cafeInfoCard.classList.remove('active');
        }
        
        cafeInfoCard.style.transform = '';
        currentY = 0;
    });
}

// Filter functionality removed - cleaner interface

// Get Directions button
const directionsBtn = document.getElementById('directionsBtn');
if (directionsBtn) {
    directionsBtn.addEventListener('click', () => {
        if (currentCafe) {
            // Open Google Maps with directions
            const url = `https://www.google.com/maps/dir/?api=1&destination=${currentCafe.lat},${currentCafe.lng}`;
            window.open(url, '_blank');
        }
    });
}

// Search functionality
const searchInput = document.getElementById('mapSearchInput');
const searchBtn = document.getElementById('mapSearchBtn');

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        // Show all markers
        markers.forEach(({ marker }) => {
            marker.addTo(map);
        });
        return;
    }
    
    console.log('Searching for:', query);
    
    // Filter cafés based on search query
    let foundCafes = [];
    markers.forEach(({ marker, cafe }) => {
        const matchesName = cafe.name.toLowerCase().includes(query);
        const matchesDescription = cafe.description.toLowerCase().includes(query);
        const matchesTags = cafe.tags.some(tag => tag.toLowerCase().includes(query));
        
        if (matchesName || matchesDescription || matchesTags) {
            marker.addTo(map);
            foundCafes.push(cafe);
        } else {
            map.removeLayer(marker);
        }
    });
    
    // If found cafés, zoom to show them
    if (foundCafes.length > 0) {
        if (foundCafes.length === 1) {
            // Single result - show info card
            showCafeInfo(foundCafes[0]);
        } else {
            // Multiple results - fit bounds
            const bounds = L.latLngBounds(foundCafes.map(c => [c.lat, c.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
        console.log(`Found ${foundCafes.length} café(s)`);
    } else {
        console.log('No cafés found');
        alert('No cafés found matching your search. Try different keywords!');
    }
}

if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Clear search on empty input
    searchInput.addEventListener('input', () => {
        if (searchInput.value === '') {
            markers.forEach(({ marker }) => {
                marker.addTo(map);
            });
        }
    });
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Try to load cafés from Firestore
    try {
        const firestoreCafes = await loadCafesForMap();
        if (firestoreCafes && firestoreCafes.length > 0) {
            cafes = firestoreCafes;
            console.log(`✓ Loaded ${cafes.length} cafés from Firestore`);
        }
    } catch (error) {
        console.log('Using default café data');
    }
    
    // Initialize map
    initMap();
});

console.log('Map page loaded with Leaflet! 🗺️');
