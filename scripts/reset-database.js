// Reset Database - Clear and Add Example Cafés
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Import Firebase config
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Example Cafés Data
const exampleCafes = [
    {
        id: 'cafe-001',
        name: 'Blue Bottle Coffee',
        description: 'Artisanal coffee roasted to perfection with a minimalist aesthetic and exceptional service.',
        address: '450 W 15th St, New York, NY 10011',
        lat: 40.7420,
        lng: -74.0064,
        rating: 4.8,
        reviews: 342,
        priceRange: '$$$',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
        tags: ['WiFi', 'Outdoor Seating', 'Specialty Coffee', 'Pastries'],
        hours: {
            monday: '7:00 AM - 7:00 PM',
            tuesday: '7:00 AM - 7:00 PM',
            wednesday: '7:00 AM - 7:00 PM',
            thursday: '7:00 AM - 7:00 PM',
            friday: '7:00 AM - 8:00 PM',
            saturday: '8:00 AM - 8:00 PM',
            sunday: '8:00 AM - 7:00 PM'
        },
        amenities: ['WiFi', 'Power Outlets', 'Outdoor Seating', 'Pet Friendly'],
        featured: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 'cafe-002',
        name: 'Stumptown Coffee Roasters',
        description: 'Portland-based roaster known for direct trade beans and expertly crafted espresso drinks.',
        address: '18 W 29th St, New York, NY 10001',
        lat: 40.7456,
        lng: -73.9889,
        rating: 4.7,
        reviews: 289,
        priceRange: '$$',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
        tags: ['WiFi', 'Cold Brew', 'Espresso Bar', 'Roastery'],
        hours: {
            monday: '6:30 AM - 8:00 PM',
            tuesday: '6:30 AM - 8:00 PM',
            wednesday: '6:30 AM - 8:00 PM',
            thursday: '6:30 AM - 8:00 PM',
            friday: '6:30 AM - 9:00 PM',
            saturday: '7:00 AM - 9:00 PM',
            sunday: '7:00 AM - 8:00 PM'
        },
        amenities: ['WiFi', 'Power Outlets', 'Cold Brew', 'Merchandise'],
        featured: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 'cafe-003',
        name: 'Intelligentsia Coffee',
        description: 'Third-wave coffee pioneer offering single-origin beans and innovative brewing methods.',
        address: '180 Orchard St, New York, NY 10002',
        lat: 40.7214,
        lng: -73.9877,
        rating: 4.9,
        reviews: 456,
        priceRange: '$$$',
        image: 'https://images.unsplash.com/photo-1559305616-3b04e37e3b60?w=800',
        tags: ['WiFi', 'Specialty Coffee', 'Pour Over', 'Quiet'],
        hours: {
            monday: '7:00 AM - 6:00 PM',
            tuesday: '7:00 AM - 6:00 PM',
            wednesday: '7:00 AM - 6:00 PM',
            thursday: '7:00 AM - 6:00 PM',
            friday: '7:00 AM - 7:00 PM',
            saturday: '8:00 AM - 7:00 PM',
            sunday: '8:00 AM - 6:00 PM'
        },
        amenities: ['WiFi', 'Quiet Space', 'Pour Over Bar', 'Coffee Classes'],
        featured: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 'cafe-004',
        name: 'La Colombe Coffee',
        description: 'Innovative coffee company famous for their draft latte and beautiful café spaces.',
        address: '270 Lafayette St, New York, NY 10012',
        lat: 40.7242,
        lng: -73.9960,
        rating: 4.6,
        reviews: 198,
        priceRange: '$$',
        image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800',
        tags: ['Draft Latte', 'Brunch', 'Instagram-worthy', 'Pastries'],
        hours: {
            monday: '7:00 AM - 7:00 PM',
            tuesday: '7:00 AM - 7:00 PM',
            wednesday: '7:00 AM - 7:00 PM',
            thursday: '7:00 AM - 7:00 PM',
            friday: '7:00 AM - 8:00 PM',
            saturday: '8:00 AM - 8:00 PM',
            sunday: '8:00 AM - 7:00 PM'
        },
        amenities: ['WiFi', 'Brunch Menu', 'Draft Latte', 'Outdoor Seating'],
        featured: false,
        createdAt: new Date().toISOString()
    },
    {
        id: 'cafe-005',
        name: 'Birch Coffee',
        description: 'Neighborhood coffee shop with a warm atmosphere and commitment to sustainability.',
        address: '134 1/2 W 17th St, New York, NY 10011',
        lat: 40.7403,
        lng: -73.9971,
        rating: 4.5,
        reviews: 167,
        priceRange: '$$',
        image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800',
        tags: ['WiFi', 'Cozy', 'Sustainable', 'Local'],
        hours: {
            monday: '7:00 AM - 6:00 PM',
            tuesday: '7:00 AM - 6:00 PM',
            wednesday: '7:00 AM - 6:00 PM',
            thursday: '7:00 AM - 6:00 PM',
            friday: '7:00 AM - 7:00 PM',
            saturday: '8:00 AM - 7:00 PM',
            sunday: '8:00 AM - 6:00 PM'
        },
        amenities: ['WiFi', 'Power Outlets', 'Sustainable', 'Cozy Seating'],
        featured: false,
        createdAt: new Date().toISOString()
    },
    {
        id: 'cafe-006',
        name: 'Devoción',
        description: 'Colombian coffee roastery with a stunning indoor garden and farm-to-cup philosophy.',
        address: '69 Grand St, Brooklyn, NY 11249',
        lat: 40.7133,
        lng: -73.9573,
        rating: 4.8,
        reviews: 523,
        priceRange: '$$$',
        image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
        tags: ['Roastery', 'Indoor Garden', 'Colombian Coffee', 'Instagram-worthy'],
        hours: {
            monday: '7:00 AM - 7:00 PM',
            tuesday: '7:00 AM - 7:00 PM',
            wednesday: '7:00 AM - 7:00 PM',
            thursday: '7:00 AM - 7:00 PM',
            friday: '7:00 AM - 8:00 PM',
            saturday: '8:00 AM - 8:00 PM',
            sunday: '8:00 AM - 7:00 PM'
        },
        amenities: ['WiFi', 'Indoor Garden', 'Roastery Tours', 'Specialty Drinks'],
        featured: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 'cafe-007',
        name: 'Café Grumpy',
        description: 'Brooklyn-born coffee shop known for quality espresso and friendly neighborhood vibe.',
        address: '224 W 20th St, New York, NY 10011',
        lat: 40.7436,
        lng: -73.9989,
        rating: 4.4,
        reviews: 234,
        priceRange: '$$',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
        tags: ['Espresso', 'Local Favorite', 'WiFi', 'Pastries'],
        hours: {
            monday: '7:00 AM - 7:00 PM',
            tuesday: '7:00 AM - 7:00 PM',
            wednesday: '7:00 AM - 7:00 PM',
            thursday: '7:00 AM - 7:00 PM',
            friday: '7:00 AM - 8:00 PM',
            saturday: '8:00 AM - 8:00 PM',
            sunday: '8:00 AM - 7:00 PM'
        },
        amenities: ['WiFi', 'Power Outlets', 'Espresso Bar', 'Pastries'],
        featured: false,
        createdAt: new Date().toISOString()
    },
    {
        id: 'cafe-008',
        name: 'Think Coffee',
        description: 'Fair trade coffee shop with a mission-driven approach and multiple NYC locations.',
        address: '248 Mercer St, New York, NY 10012',
        lat: 40.7282,
        lng: -73.9956,
        rating: 4.3,
        reviews: 189,
        priceRange: '$',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
        tags: ['Fair Trade', 'Student Friendly', 'WiFi', 'Affordable'],
        hours: {
            monday: '6:30 AM - 9:00 PM',
            tuesday: '6:30 AM - 9:00 PM',
            wednesday: '6:30 AM - 9:00 PM',
            thursday: '6:30 AM - 9:00 PM',
            friday: '6:30 AM - 10:00 PM',
            saturday: '7:00 AM - 10:00 PM',
            sunday: '7:00 AM - 9:00 PM'
        },
        amenities: ['WiFi', 'Power Outlets', 'Study Space', 'Fair Trade'],
        featured: false,
        createdAt: new Date().toISOString()
    }
];

// Function to clear all cafés
async function clearAllCafes() {
    console.log('🗑️ Clearing all existing cafés...');
    
    try {
        const cafesSnapshot = await getDocs(collection(db, 'cafes'));
        const deletePromises = [];
        
        cafesSnapshot.forEach((doc) => {
            deletePromises.push(deleteDoc(doc.ref));
        });
        
        await Promise.all(deletePromises);
        console.log(`✅ Deleted ${deletePromises.length} cafés`);
    } catch (error) {
        console.error('❌ Error clearing cafés:', error);
        throw error;
    }
}

// Function to add example cafés
async function addExampleCafes() {
    console.log('📝 Adding example cafés...');
    
    try {
        const addPromises = exampleCafes.map(cafe => 
            setDoc(doc(db, 'cafes', cafe.id), cafe)
        );
        
        await Promise.all(addPromises);
        console.log(`✅ Added ${exampleCafes.length} example cafés`);
    } catch (error) {
        console.error('❌ Error adding cafés:', error);
        throw error;
    }
}

// Main reset function
async function resetDatabase() {
    console.log('🔄 Starting database reset...');
    
    try {
        await clearAllCafes();
        await addExampleCafes();
        
        console.log('✅ Database reset complete!');
        console.log(`📊 Total cafés in database: ${exampleCafes.length}`);
        
        // Display summary
        console.log('\n📋 Added Cafés:');
        exampleCafes.forEach((cafe, index) => {
            console.log(`${index + 1}. ${cafe.name} - ${cafe.rating}⭐ (${cafe.reviews} reviews)`);
        });
        
        return {
            success: true,
            message: 'Database reset successfully',
            cafesAdded: exampleCafes.length
        };
    } catch (error) {
        console.error('❌ Database reset failed:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

// Export for use in HTML
window.resetDatabase = resetDatabase;

// Auto-run if this script is loaded directly
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Database reset script loaded. Call resetDatabase() to reset.');
    });
} else {
    console.log('Database reset script loaded. Call resetDatabase() to reset.');
}
