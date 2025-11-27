// Load cafés from Firestore and display on user portal
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, query, where, getDocs, onSnapshot, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCR6fyqMDC-cBuARdXhD8KYn7Y3jqiXCVM",
    authDomain: "cafehunt-e84a7.firebaseapp.com",
    projectId: "cafehunt-e84a7",
    storageBucket: "cafehunt-e84a7.firebasestorage.app",
    messagingSenderId: "642019761362",
    appId: "1:642019761362:web:5b757e79afb4409f9f610b",
    measurementId: "G-S76DE68B7K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load cafés from Firestore
export async function loadCafesFromFirestore() {
    try {
        // Simple query to get all cafés
        const cafesQuery = collection(db, 'cafes');
        
        const querySnapshot = await getDocs(cafesQuery);
        const cafes = [];
        
        querySnapshot.forEach((doc) => {
            cafes.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Sort by createdAt in JavaScript
        cafes.sort((a, b) => {
            const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return bTime - aTime;
        });
        
        console.log(`✅ Loaded ${cafes.length} cafés from Firestore`);
        return cafes;
    } catch (error) {
        console.error('Error loading cafés:', error);
        console.log('Using fallback data');
        return [];
    }
}

// Listen for real-time updates
export function listenToCafeUpdates(callback) {
    const cafesQuery = collection(db, 'cafes');
    
    return onSnapshot(cafesQuery, (snapshot) => {
        const cafes = [];
        snapshot.forEach((doc) => {
            cafes.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Sort by createdAt in JavaScript
        cafes.sort((a, b) => {
            const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return bTime - aTime;
        });
        
        console.log(`🔄 Real-time update: ${cafes.length} cafés`);
        callback(cafes);
    }, (error) => {
        console.error('Error listening to cafés:', error);
    });
}

// Display cafés on homepage
export function displayCafesOnHomepage(cafes) {
    // Update featured carousel
    const carouselTrack = document.querySelector('.carousel-track');
    if (carouselTrack && cafes.length > 0) {
        carouselTrack.innerHTML = cafes.slice(0, 6).map(cafe => createCafeCard(cafe)).join('');
    }
    
    // Update top picks grid - Show ALL cafés
    const picksGrid = document.querySelector('.picks-grid');
    if (picksGrid && cafes.length > 0) {
        picksGrid.innerHTML = cafes.map(cafe => createPickCard(cafe)).join('');
    }
}

// Create café card HTML
function createCafeCard(cafe) {
    const image = cafe.images && cafe.images.length > 0 ? cafe.images[0] : 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600';
    const badge = getTimeBadge(cafe.createdAt);
    
    return `
        <a href="cafe-details.html?id=${cafe.id}" class="cafe-card-3d" data-cafe-id="${cafe.id}" style="text-decoration: none; color: inherit;">
            <div class="card-image">
                <img src="${image}" alt="${cafe.name}">
                <div class="card-badge">${badge}</div>
            </div>
            <div class="card-content">
                <h3>${cafe.name}</h3>
                <div class="card-meta">
                    <span class="rating">⭐ ${cafe.rating || '4.5'}</span>
                    <span class="distance">${calculateDistance(cafe.location)}</span>
                </div>
                <p class="card-description">${cafe.description || 'Discover this amazing café'}</p>
            </div>
        </a>
    `;
}

// Create pick card HTML
function createPickCard(cafe) {
    const image = cafe.images && cafe.images.length > 0 ? cafe.images[0] : 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600';
    
    return `
        <a href="cafe-details.html?id=${cafe.id}" class="pick-card">
            <div class="pick-image">
                <img src="${image}" alt="${cafe.name}">
            </div>
            <div class="pick-overlay">
                <h3>${cafe.name}</h3>
                <p>⭐ ${cafe.rating || '4.5'} • ${calculateDistance(cafe.location)}</p>
            </div>
        </a>
    `;
}

// Get time-based badge
function getTimeBadge(createdAt) {
    if (!createdAt) return 'Featured';
    
    const now = new Date();
    const created = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const daysDiff = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 7) return 'New';
    if (daysDiff < 30) return 'Popular';
    return 'Premium';
}

// Calculate distance (placeholder - would use geolocation in production)
function calculateDistance(location) {
    if (!location || !location.lat || !location.lng) return '1.0 km';
    
    // This is a placeholder. In production, you'd calculate actual distance
    // using user's location and the Haversine formula
    const randomDistance = (Math.random() * 3 + 0.3).toFixed(1);
    return `${randomDistance} km`;
}

// Show loading state
export function showLoadingState() {
    const carouselTrack = document.querySelector('.carousel-track');
    const picksGrid = document.querySelector('.picks-grid');
    
    const loadingHTML = `
        <div class="loading-skeleton">
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
        </div>
    `;
    
    if (carouselTrack) carouselTrack.innerHTML = loadingHTML;
    if (picksGrid) picksGrid.innerHTML = loadingHTML;
}

// Show empty state
export function showEmptyState() {
    const carouselTrack = document.querySelector('.carousel-track');
    const picksGrid = document.querySelector('.picks-grid');
    
    const emptyHTML = `
        <div class="empty-state">
            <div class="empty-icon">☕</div>
            <h3>No cafés yet</h3>
            <p>Check back soon for new café listings!</p>
        </div>
    `;
    
    if (carouselTrack) carouselTrack.innerHTML = emptyHTML;
    if (picksGrid) picksGrid.innerHTML = emptyHTML;
}

// Initialize on homepage
export async function initHomepage() {
    showLoadingState();
    
    try {
        // Load initial cafés
        const cafes = await loadCafesFromFirestore();
        
        if (cafes.length > 0) {
            displayCafesOnHomepage(cafes);
            
            // Listen for real-time updates
            listenToCafeUpdates((updatedCafes) => {
                displayCafesOnHomepage(updatedCafes);
                console.log('Cafés updated in real-time! ✨');
            });
        } else {
            showEmptyState();
        }
    } catch (error) {
        console.error('Error initializing homepage:', error);
        showEmptyState();
    }
}

// Load cafés for map view
export async function loadCafesForMap() {
    try {
        const cafes = await loadCafesFromFirestore();
        return cafes.map(cafe => ({
            id: cafe.id,
            name: cafe.name,
            lat: cafe.location?.lat || 40.7580,
            lng: cafe.location?.lng || -73.9855,
            image: cafe.images && cafe.images.length > 0 ? cafe.images[0] : 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600',
            rating: cafe.rating || '4.5',
            reviews: cafe.reviews || '0',
            distance: calculateDistance(cafe.location),
            description: cafe.description || 'Discover this amazing café',
            tags: cafe.tags || ['WiFi', 'Cozy']
        }));
    } catch (error) {
        console.error('Error loading cafés for map:', error);
        return [];
    }
}

// Load single café details
export async function loadCafeDetails(cafeId) {
    try {
        const cafeDoc = await getDocs(query(collection(db, 'cafes'), where('__name__', '==', cafeId)));
        
        if (!cafeDoc.empty) {
            const cafe = cafeDoc.docs[0].data();
            return {
                id: cafeDoc.docs[0].id,
                ...cafe
            };
        }
        return null;
    } catch (error) {
        console.error('Error loading café details:', error);
        return null;
    }
}

console.log('Café loader initialized! 🔥');
