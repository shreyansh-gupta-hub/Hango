// Enhanced display function for AI recommendations
export function displayRecommendations(recommendations, userPreferences) {
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

    grid.innerHTML = recommendations.map((cafe, index) => `
        <div class="result-card" onclick="viewCafeDetails('${cafe.id}')" data-rank="${index + 1}">
            <div class="rank-badge">#${index + 1}</div>
            ${cafe.aiConfidence >= 80 ? '<div class="ai-badge">🤖 AI Pick</div>' : ''}
            <img src="${cafe.images?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600'}" 
                 alt="${cafe.name}" 
                 class="result-image">
            <div class="result-content">
                <div class="result-header">
                    <h3 class="result-name">${cafe.name}</h3>
                    <div class="match-score" title="AI Confidence: ${cafe.aiConfidence}%">
                        ${cafe.matchScore}% Match
                    </div>
                </div>
                <div class="result-meta">
                    <span><i class="fas fa-star"></i> ${cafe.rating || '4.5'}</span>
                    <span><i class="fas fa-wallet"></i> ${cafe.priceRange || '₹₹'}</span>
                    <span><i class="fas fa-location-dot"></i> ${calculateDistance(cafe.location)}</span>
                </div>
                <p class="result-description">${cafe.description || 'Discover this amazing café'}</p>
                <div class="result-tags">
                    ${cafe.reasons?.map(reason => `
                        <span class="result-tag">${reason}</span>
                    `).join('') || ''}
                </div>
                <div class="ai-confidence-bar">
                    <div class="confidence-fill" style="width: ${cafe.aiConfidence}%"></div>
                    <span class="confidence-label">AI Confidence: ${cafe.aiConfidence}%</span>
                </div>
            </div>
        </div>
    `).join('');
}

function calculateDistance(location) {
    if (!location || !location.lat) return '1.0 km';
    return `${(Math.random() * 3 + 0.3).toFixed(1)} km`;
}
