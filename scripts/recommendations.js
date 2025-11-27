// Recommendations System with AI-powered matching
console.log('🚀 Starting recommendations.js...');

import { collection, getDocs, doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from './firebase-config.js';

console.log('📦 Firebase modules imported');
console.log('✅ Firebase database ready');

// Global state
let userPreferences = {};
let allCafes = [];

// Counter adjustment
window.adjustCount = function(field, delta) {
    const input = document.getElementById(field);
    const currentValue = parseInt(input.value);
    const newValue = Math.max(1, Math.min(20, currentValue + delta));
    input.value = newValue;
    
    // Animate the change
    input.style.transform = 'scale(1.2)';
    setTimeout(() => {
        input.style.transform = 'scale(1)';
    }, 200);
};

// Budget input validation
const budgetValue = document.getElementById('budgetValue');

if (budgetValue) {
    // Validate on input
    budgetValue.addEventListener('input', (e) => {
        let value = parseInt(e.target.value) || 100;
        if (value < 100) value = 100;
        if (value > 5000) value = 5000;
        animateBudgetChange();
    });
    
    // Ensure valid value on blur
    budgetValue.addEventListener('blur', (e) => {
        let value = parseInt(e.target.value) || 500;
        value = Math.max(100, Math.min(5000, value));
        budgetValue.value = value;
    });
}

function animateBudgetChange() {
    if (budgetValue) {
        budgetValue.style.transform = 'scale(1.05)';
        setTimeout(() => {
            budgetValue.style.transform = 'scale(1)';
        }, 150);
    }
}

// Form submission handler
console.log('🎯 Recommendations script loaded');

// Wait a moment for DOM to be fully ready
setTimeout(() => {
    const form = document.getElementById('recommendationForm');
    if (form) {
        console.log('✅ Form found, attaching submit handler');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('🚀 Form submitted, processing...');
            try {
                await handleFormSubmit();
            } catch (error) {
                console.error('❌ Error in form submission:', error);
                alert('Error processing recommendations. Please check console.');
            }
        });
    } else {
        console.error('❌ Form not found! DOM might not be ready.');
    }
}, 100);

async function handleFormSubmit() {
    try {
        console.log('📝 Collecting form data...');
        
        // Collect form data
        userPreferences = {
            people: parseInt(document.getElementById('people').value),
            budget: parseInt(document.getElementById('budgetValue').value),
            occasion: document.getElementById('occasion').value,
            useLocation: document.getElementById('useLocation').checked,
            dietary: Array.from(document.querySelectorAll('input[name="dietary"]:checked')).map(el => el.value),
            foodType: Array.from(document.querySelectorAll('input[name="foodType"]:checked')).map(el => el.value),
            timestamp: new Date().toISOString()
        };

        console.log('✅ User Preferences:', userPreferences);

        // Show results section
        const formSection = document.getElementById('formSection');
        const resultsSection = document.getElementById('resultsSection');
        const loadingState = document.getElementById('loadingState');
        
        if (!formSection || !resultsSection || !loadingState) {
            throw new Error('Required DOM elements not found');
        }
        
        // Smooth transition
        formSection.classList.add('hiding');
        
        setTimeout(() => {
            formSection.style.display = 'none';
            resultsSection.style.display = 'block';
            loadingState.style.display = 'block';
            formSection.classList.remove('hiding');
        }, 300);

        console.log('🔄 Loading cafés and generating recommendations...');
        
        // Load cafés and get recommendations
        await loadCafesAndRecommend();
        
    } catch (error) {
        console.error('❌ Error in handleFormSubmit:', error);
        alert('Error: ' + error.message);
        throw error;
    }
}

async function loadCafesAndRecommend() {
    try {
        // Load all cafés from Firestore
        const cafesSnapshot = await getDocs(collection(db, 'cafes'));
        allCafes = [];
        
        cafesSnapshot.forEach((doc) => {
            allCafes.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log(`Loaded ${allCafes.length} cafés`);

        // Get AI-powered recommendations
        const recommendations = await getAIRecommendations(userPreferences, allCafes);

        // Hide loading, show results
        setTimeout(() => {
            document.getElementById('loadingState').style.display = 'none';
            displayRecommendations(recommendations);
        }, 1500);

    } catch (error) {
        console.error('Error loading cafés:', error);
        document.getElementById('loadingState').innerHTML = `
            <p style="color: #ff6b6b;">Error loading recommendations. Please try again.</p>
        `;
    }
}

// Enhanced AI-Powered Recommendation Algorithm
async function getAIRecommendations(preferences, cafes) {
    console.log('🤖 AI Analysis: Processing', cafes.length, 'cafés from database...');
    console.log('📊 User Preferences:', preferences);
    
    // Analyze all café data to understand patterns
    const cafeAnalytics = analyzeCafeDatabase(cafes);
    console.log('📈 Database Analytics:', cafeAnalytics);
    
    const scoredCafes = cafes.map(cafe => {
        let score = 0;
        const reasons = [];
        const detailedScores = {};

        // 1. BUDGET INTELLIGENCE (30% weight)
        const budgetAnalysis = analyzeBudgetMatch(cafe, preferences.budget, cafeAnalytics);
        score += budgetAnalysis.score * 0.3;
        detailedScores.budget = budgetAnalysis.score;
        if (budgetAnalysis.reason) reasons.push(budgetAnalysis.reason);

        // 2. DIETARY PREFERENCES (25% weight)
        const dietaryAnalysis = analyzeDietaryMatch(cafe, preferences.dietary);
        score += dietaryAnalysis.score * 0.25;
        detailedScores.dietary = dietaryAnalysis.score;
        if (dietaryAnalysis.reason) reasons.push(dietaryAnalysis.reason);

        // 3. FOOD TYPE MATCHING (20% weight)
        const foodAnalysis = analyzeFoodTypeMatch(cafe, preferences.foodType);
        score += foodAnalysis.score * 0.2;
        detailedScores.foodType = foodAnalysis.score;
        if (foodAnalysis.reason) reasons.push(foodAnalysis.reason);

        // 4. QUALITY & RATING (15% weight)
        const qualityAnalysis = analyzeQuality(cafe, cafeAnalytics);
        score += qualityAnalysis.score * 0.15;
        detailedScores.quality = qualityAnalysis.score;
        if (qualityAnalysis.reason) reasons.push(qualityAnalysis.reason);

        // 5. GROUP SIZE COMPATIBILITY (10% weight)
        const groupAnalysis = analyzeGroupSize(cafe, preferences.people);
        score += groupAnalysis.score * 0.1;
        detailedScores.groupSize = groupAnalysis.score;
        if (groupAnalysis.reason) reasons.push(groupAnalysis.reason);

        // 6. OCCASION CONTEXT (Bonus up to 15%)
        const occasionAnalysis = analyzeOccasion(cafe, preferences.occasion);
        score += occasionAnalysis.score;
        detailedScores.occasion = occasionAnalysis.score;
        if (occasionAnalysis.reason) reasons.push(occasionAnalysis.reason);

        // 7. AMENITIES & FEATURES (Bonus up to 10%)
        const amenitiesAnalysis = analyzeAmenities(cafe, preferences);
        score += amenitiesAnalysis.score;
        detailedScores.amenities = amenitiesAnalysis.score;
        if (amenitiesAnalysis.reason) reasons.push(amenitiesAnalysis.reason);

        // 8. SEMANTIC TEXT ANALYSIS (Bonus up to 10%)
        const semanticAnalysis = analyzeSemanticMatch(cafe, preferences);
        score += semanticAnalysis.score;
        detailedScores.semantic = semanticAnalysis.score;
        if (semanticAnalysis.reason) reasons.push(semanticAnalysis.reason);

        return {
            ...cafe,
            matchScore: Math.min(100, Math.round(score)),
            reasons: reasons.filter(r => r).slice(0, 4), // Top 4 reasons
            detailedScores: detailedScores,
            aiConfidence: calculateConfidence(detailedScores)
        };
    });

    // Sort by score and AI confidence
    const sortedCafes = scoredCafes
        .sort((a, b) => {
            if (Math.abs(a.matchScore - b.matchScore) < 5) {
                return b.aiConfidence - a.aiConfidence;
            }
            return b.matchScore - a.matchScore;
        })
        .slice(0, 6);

    console.log('✅ AI Recommendations Generated:', sortedCafes.map(c => ({
        name: c.name,
        score: c.matchScore,
        confidence: c.aiConfidence
    })));

    return sortedCafes;
}

// Analyze entire café database for patterns
function analyzeCafeDatabase(cafes) {
    const prices = cafes.map(c => extractAvgPrice(c.priceRange)).filter(p => p > 0);
    const ratings = cafes.map(c => parseFloat(c.rating) || 0).filter(r => r > 0);
    
    return {
        avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length || 500,
        minPrice: Math.min(...prices) || 100,
        maxPrice: Math.max(...prices) || 5000,
        avgRating: ratings.reduce((a, b) => a + b, 0) / ratings.length || 4.0,
        totalCafes: cafes.length,
        allTags: [...new Set(cafes.flatMap(c => c.tags || []))],
        allAmenities: [...new Set(cafes.flatMap(c => c.amenities || []))]
    };
}

// Budget intelligence with market analysis
function analyzeBudgetMatch(cafe, userBudget, analytics) {
    const cafePrice = extractAvgPrice(cafe.priceRange);
    const priceDiff = Math.abs(cafePrice - userBudget);
    const priceRatio = priceDiff / userBudget;
    
    let score = 0;
    let reason = '';
    
    if (priceRatio < 0.1) {
        score = 100;
        reason = '💰 Perfect price match';
    } else if (priceRatio < 0.2) {
        score = 90;
        reason = '💵 Excellent value';
    } else if (priceRatio < 0.3) {
        score = 75;
        reason = '✓ Within budget';
    } else if (priceRatio < 0.5) {
        score = 50;
        reason = 'Slightly above budget';
    } else {
        score = Math.max(0, 100 - (priceRatio * 100));
    }
    
    // Bonus for premium value
    if (cafePrice < userBudget && parseFloat(cafe.rating) >= 4.5) {
        score = Math.min(100, score + 10);
        reason = '⭐ Premium quality, great value';
    }
    
    return { score, reason };
}

// Dietary preferences analysis
function analyzeDietaryMatch(cafe, dietaryPrefs) {
    if (!dietaryPrefs || dietaryPrefs.length === 0) {
        return { score: 50, reason: '' }; // Neutral if no preference
    }
    
    const cafeText = [
        cafe.name,
        cafe.description,
        ...(cafe.tags || []),
        ...(cafe.amenities || [])
    ].join(' ').toLowerCase();
    
    const matches = dietaryPrefs.filter(diet => 
        cafeText.includes(diet.toLowerCase())
    );
    
    if (matches.length === dietaryPrefs.length) {
        return { score: 100, reason: `🌱 All dietary needs met (${matches.join(', ')})` };
    } else if (matches.length > 0) {
        return { score: 70, reason: `✓ ${matches.join(', ')} options available` };
    }
    
    return { score: 20, reason: '' };
}

// Food type matching with semantic understanding
function analyzeFoodTypeMatch(cafe, foodTypes) {
    if (!foodTypes || foodTypes.length === 0) {
        return { score: 50, reason: '' };
    }
    
    const cafeText = [
        cafe.name,
        cafe.description,
        ...(cafe.tags || [])
    ].join(' ').toLowerCase();
    
    const foodKeywords = {
        coffee: ['coffee', 'espresso', 'cappuccino', 'latte', 'brew'],
        snacks: ['snack', 'sandwich', 'wrap', 'appetizer', 'finger food'],
        meals: ['meal', 'lunch', 'dinner', 'breakfast', 'brunch', 'main course'],
        desserts: ['dessert', 'cake', 'pastry', 'sweet', 'ice cream'],
        beverages: ['beverage', 'drink', 'juice', 'smoothie', 'tea']
    };
    
    let matchCount = 0;
    const matchedTypes = [];
    
    foodTypes.forEach(type => {
        const keywords = foodKeywords[type] || [type];
        if (keywords.some(keyword => cafeText.includes(keyword))) {
            matchCount++;
            matchedTypes.push(type);
        }
    });
    
    const matchRatio = matchCount / foodTypes.length;
    
    if (matchRatio === 1) {
        return { score: 100, reason: `☕ Serves all: ${matchedTypes.join(', ')}` };
    } else if (matchRatio >= 0.5) {
        return { score: 75, reason: `✓ Great ${matchedTypes.join(' & ')} selection` };
    } else if (matchCount > 0) {
        return { score: 40, reason: '' };
    }
    
    return { score: 10, reason: '' };
}

// Quality analysis with database comparison
function analyzeQuality(cafe, analytics) {
    const rating = parseFloat(cafe.rating) || 0;
    const score = (rating / 5) * 100;
    
    let reason = '';
    if (rating >= analytics.avgRating + 0.5) {
        reason = `⭐ Top rated (${rating}/5)`;
    } else if (rating >= 4.5) {
        reason = `⭐ Highly rated (${rating}/5)`;
    } else if (rating >= 4.0) {
        reason = `✓ Well rated (${rating}/5)`;
    }
    
    return { score, reason };
}

// Group size compatibility
function analyzeGroupSize(cafe, people) {
    let score = 50;
    let reason = '';
    
    if (people <= 2) {
        score = 100;
        reason = '👥 Perfect for couples/solo';
    } else if (people <= 4) {
        score = 90;
        reason = '👥 Ideal for small groups';
    } else if (people <= 6) {
        score = 70;
        reason = '👥 Good for medium groups';
    } else if (people <= 10) {
        score = 50;
        reason = '👥 Can accommodate larger groups';
    } else {
        score = 30;
        reason = 'Large group - call ahead';
    }
    
    return { score, reason };
}

// Occasion context analysis
function analyzeOccasion(cafe, occasion) {
    if (!occasion) return { score: 0, reason: '' };
    
    const occasionLower = occasion.toLowerCase();
    const cafeText = [cafe.name, cafe.description, ...(cafe.tags || []), ...(cafe.amenities || [])].join(' ').toLowerCase();
    
    let score = 0;
    let reason = '';
    
    // Birthday/Celebration
    if (occasionLower.match(/birthday|celebration|party|anniversary/)) {
        if (cafeText.match(/dessert|cake|celebration|party/)) {
            score = 15;
            reason = '🎉 Perfect for celebrations';
        }
    }
    
    // Business/Meeting
    if (occasionLower.match(/business|meeting|work|professional/)) {
        if (cafeText.match(/wifi|quiet|professional|workspace/)) {
            score = 15;
            reason = '💼 Great for business meetings';
        }
    }
    
    // Romantic/Date
    if (occasionLower.match(/date|romantic|couple/)) {
        if (cafeText.match(/romantic|cozy|intimate|ambiance/)) {
            score = 15;
            reason = '💕 Romantic atmosphere';
        }
    }
    
    // Casual/Hangout
    if (occasionLower.match(/casual|hangout|friends|chill/)) {
        if (cafeText.match(/casual|relaxed|friendly|social/)) {
            score = 10;
            reason = '😊 Casual & friendly vibe';
        }
    }
    
    return { score, reason };
}

// Amenities analysis
function analyzeAmenities(cafe, preferences) {
    const amenities = cafe.amenities || [];
    const tags = cafe.tags || [];
    const allFeatures = [...amenities, ...tags].map(a => a.toLowerCase());
    
    let score = 0;
    let reason = '';
    
    const valuableAmenities = {
        'wifi': 3,
        'parking': 3,
        'outdoor': 2,
        'pet friendly': 2,
        'live music': 2,
        'rooftop': 3
    };
    
    Object.entries(valuableAmenities).forEach(([amenity, points]) => {
        if (allFeatures.some(f => f.includes(amenity))) {
            score += points;
        }
    });
    
    if (score >= 8) {
        reason = '✨ Excellent amenities';
    } else if (score >= 5) {
        reason = '✓ Great facilities';
    }
    
    return { score: Math.min(10, score), reason };
}

// Semantic text analysis
function analyzeSemanticMatch(cafe, preferences) {
    if (!preferences.occasion) return { score: 0, reason: '' };
    
    const userWords = preferences.occasion.toLowerCase().split(/\s+/);
    const cafeText = [cafe.name, cafe.description].join(' ').toLowerCase();
    
    const matchingWords = userWords.filter(word => 
        word.length > 3 && cafeText.includes(word)
    );
    
    if (matchingWords.length >= 2) {
        return { score: 10, reason: '🎯 Matches your vibe' };
    } else if (matchingWords.length === 1) {
        return { score: 5, reason: '' };
    }
    
    return { score: 0, reason: '' };
}

// Calculate AI confidence level
function calculateConfidence(scores) {
    const values = Object.values(scores).filter(v => v > 0);
    if (values.length === 0) return 0;
    
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const consistency = 100 - Math.sqrt(variance);
    
    return Math.round(consistency);
}

function extractAvgPrice(priceRange) {
    if (!priceRange) return 500;
    const dollarCount = (priceRange.match(/\$/g) || []).length;
    return dollarCount * 500; // $=500, $$=1000, $$$=1500
}

function displayRecommendations(recommendations) {
    const grid = document.getElementById('resultsGrid');
    
    if (recommendations.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <h3>No matches found</h3>
                <p>Try adjusting your preferences</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = recommendations.map(cafe => `
        <div class="result-card" onclick="viewCafeDetails('${cafe.id}')">
            <img src="${cafe.images?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600'}" 
                 alt="${cafe.name}" 
                 class="result-image">
            <div class="result-content">
                <div class="result-header">
                    <h3 class="result-name">${cafe.name}</h3>
                    <div class="match-score">${cafe.matchScore}% Match</div>
                </div>
                <div class="result-meta">
                    <span><i class="fas fa-star"></i> ${cafe.rating || '4.5'}</span>
                    <span><i class="fas fa-wallet"></i> ${cafe.priceRange || '$$'}</span>
                    <span><i class="fas fa-location-dot"></i> ${calculateDistance(cafe.location)}</span>
                </div>
                <p class="result-description">${cafe.description || 'Discover this amazing café'}</p>
                <div class="result-tags">
                    ${cafe.reasons?.map(reason => `
                        <span class="result-tag"><i class="fas fa-check"></i> ${reason}</span>
                    `).join('') || ''}
                </div>
            </div>
        </div>
    `).join('');

    // Show top dishes section
    displayTopDishes(recommendations, userPreferences.budget);

    // Setup real-time sync
    setupRealTimeSync(recommendations.map(c => c.id));
}

function displayTopDishes(cafes, budgetPerPerson) {
    const section = document.getElementById('topDishesSection');
    const carousel = document.getElementById('dishesCarousel');
    
    // Generate AI-powered custom meal combinations
    const mealCombos = generateCustomMealCombos(budgetPerPerson, userPreferences, cafes);

    if (mealCombos.length > 0) {
        section.style.display = 'block';
        carousel.innerHTML = mealCombos.map(combo => `
            <div class="dish-card meal-combo" onclick="viewCafeDetails('${combo.cafeId}')">
                <div class="combo-badge">${combo.badge}</div>
                <div class="dish-image">
                    <img src="${combo.image}" alt="${combo.name}">
                    <div class="combo-overlay">
                        <span class="combo-items-count">${combo.items.length} items</span>
                    </div>
                </div>
                <div class="dish-info">
                    <h4>${combo.emoji} ${combo.name}</h4>
                    <p class="dish-cafe">${combo.cafe}</p>
                    <div class="combo-items">
                        ${combo.items.map(item => `<span class="combo-item">${item}</span>`).join('')}
                    </div>
                    <div class="dish-footer">
                        <div class="price-breakdown">
                            <span class="dish-price">₹${combo.totalPrice}</span>
                            <span class="savings">${combo.savings > 0 ? `Save ₹${combo.savings}` : ''}</span>
                        </div>
                        <span class="dish-per-person">per person</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// AI-Powered Custom Meal Combo Generator
function generateCustomMealCombos(budget, preferences, cafes) {
    const combos = [];
    
    // Meal component database
    const components = {
        mains: [
            { name: 'Margherita Pizza', price: 350, emoji: '🍕', tags: ['italian', 'vegetarian'] },
            { name: 'Pasta Alfredo', price: 320, emoji: '🍝', tags: ['italian', 'vegetarian'] },
            { name: 'Classic Burger', price: 280, emoji: '🍔', tags: ['american'] },
            { name: 'Grilled Sandwich', price: 200, emoji: '🥪', tags: ['vegetarian'] },
            { name: 'Caesar Salad', price: 250, emoji: '🥗', tags: ['healthy', 'vegetarian'] },
            { name: 'Paneer Wrap', price: 220, emoji: '🌯', tags: ['indian', 'vegetarian'] }
        ],
        beverages: [
            { name: 'Cappuccino', price: 150, emoji: '☕', tags: ['coffee'] },
            { name: 'Cold Brew', price: 180, emoji: '🧊', tags: ['coffee'] },
            { name: 'Fresh Juice', price: 120, emoji: '🥤', tags: ['healthy'] },
            { name: 'Smoothie', price: 160, emoji: '🥤', tags: ['healthy'] },
            { name: 'Iced Tea', price: 100, emoji: '🍹', tags: ['refreshing'] },
            { name: 'Milkshake', price: 140, emoji: '🥛', tags: ['sweet'] }
        ],
        sides: [
            { name: 'French Fries', price: 100, emoji: '🍟', tags: [] },
            { name: 'Garlic Bread', price: 120, emoji: '🥖', tags: ['italian'] },
            { name: 'Nachos', price: 150, emoji: '🌮', tags: ['mexican'] },
            { name: 'Soup', price: 130, emoji: '🍲', tags: ['healthy'] },
            { name: 'Bruschetta', price: 140, emoji: '🥖', tags: ['italian'] }
        ],
        desserts: [
            { name: 'Cheesecake', price: 180, emoji: '🍰', tags: ['sweet'] },
            { name: 'Brownie', price: 140, emoji: '🍫', tags: ['chocolate'] },
            { name: 'Ice Cream', price: 120, emoji: '🍨', tags: ['sweet'] },
            { name: 'Waffle', price: 160, emoji: '🧇', tags: ['sweet'] },
            { name: 'Tiramisu', price: 200, emoji: '🍰', tags: ['italian', 'coffee'] }
        ],
        snacks: [
            { name: 'Croissant', price: 100, emoji: '🥐', tags: ['french'] },
            { name: 'Muffin', price: 90, emoji: '🧁', tags: ['sweet'] },
            { name: 'Cookie', price: 60, emoji: '🍪', tags: ['sweet'] },
            { name: 'Samosa', price: 50, emoji: '🥟', tags: ['indian'] }
        ]
    };

    // Generate combos for top 3 cafes
    cafes.slice(0, 3).forEach(cafe => {
        // Determine combo type based on budget
        let comboTypes = [];
        
        if (budget >= 500) {
            comboTypes = [
                { type: 'premium', components: ['mains', 'beverages', 'desserts'], name: 'Premium Feast' },
                { type: 'complete', components: ['mains', 'sides', 'beverages'], name: 'Complete Meal' }
            ];
        } else if (budget >= 350) {
            comboTypes = [
                { type: 'standard', components: ['mains', 'beverages'], name: 'Classic Combo' },
                { type: 'hearty', components: ['mains', 'sides'], name: 'Hearty Meal' }
            ];
        } else if (budget >= 200) {
            comboTypes = [
                { type: 'light', components: ['snacks', 'beverages'], name: 'Light Bite' },
                { type: 'quick', components: ['sides', 'beverages'], name: 'Quick Snack' }
            ];
        } else {
            comboTypes = [
                { type: 'minimal', components: ['snacks', 'beverages'], name: 'Coffee Break' }
            ];
        }

        // Generate combos
        comboTypes.forEach(comboType => {
            const selectedItems = [];
            let totalPrice = 0;
            
            // Select items from each component category
            comboType.components.forEach(category => {
                const availableItems = components[category] || [];
                const affordableItems = availableItems.filter(item => 
                    totalPrice + item.price <= budget * 0.9
                );
                
                if (affordableItems.length > 0) {
                    // Smart selection based on preferences
                    let selectedItem = affordableItems[0];
                    
                    // Prefer items matching dietary preferences
                    if (preferences.dietary && preferences.dietary.length > 0) {
                        const matchingItem = affordableItems.find(item => 
                            preferences.dietary.some(diet => 
                                item.tags.includes(diet.toLowerCase())
                            )
                        );
                        if (matchingItem) selectedItem = matchingItem;
                    }
                    
                    // Random selection for variety
                    if (Math.random() > 0.5 && affordableItems.length > 1) {
                        selectedItem = affordableItems[Math.floor(Math.random() * affordableItems.length)];
                    }
                    
                    selectedItems.push(selectedItem);
                    totalPrice += selectedItem.price;
                }
            });

            if (selectedItems.length >= 2) {
                // Calculate savings (10% discount on combos)
                const originalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);
                const discountedPrice = Math.round(originalPrice * 0.9);
                const savings = originalPrice - discountedPrice;
                
                combos.push({
                    name: comboType.name,
                    cafe: cafe.name,
                    cafeId: cafe.id,
                    image: cafe.images?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
                    items: selectedItems.map(item => `${item.emoji} ${item.name}`),
                    totalPrice: discountedPrice,
                    originalPrice: originalPrice,
                    savings: savings,
                    emoji: selectedItems[0].emoji,
                    badge: totalPrice <= budget ? '✓ Perfect Match' : 'Premium Choice'
                });
            }
        });
    });

    return combos.slice(0, 6); // Return top 6 combos
}

function calculateDistance(location) {
    if (!location || !location.lat) return '1.0 km';
    // Placeholder - would use actual geolocation
    return `${(Math.random() * 3 + 0.3).toFixed(1)} km`;
}

function setupRealTimeSync(cafeIds) {
    console.log('Setting up real-time sync for:', cafeIds);
    
    // Listen for changes to recommended cafés
    cafeIds.forEach(cafeId => {
        const cafeRef = doc(db, 'cafes', cafeId);
        onSnapshot(cafeRef, (doc) => {
            if (doc.exists()) {
                console.log('Café updated:', doc.id);
                showUpdateNotification(doc.data().name);
            }
        });
    });
}

function showUpdateNotification(cafeName) {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <i class="fas fa-sync-alt"></i>
        <span>${cafeName} updated! <a href="#" onclick="location.reload()">Refresh recommendations</a></span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

window.viewCafeDetails = function(cafeId) {
    // Pass budget to café details page
    const budget = userPreferences.budget || 500;
    const people = userPreferences.people || 2;
    window.location.href = `cafe-details.html?id=${cafeId}&budget=${budget}&people=${people}`;
};

window.showForm = function() {
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

console.log('Recommendations system initialized! 🎯');
