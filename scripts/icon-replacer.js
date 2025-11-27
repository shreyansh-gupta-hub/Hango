// Automatic Emoji to Font Awesome Icon Replacer
// This script runs on page load and replaces all emoji icons with Font Awesome icons

const iconMap = {
    '☕': '<i class="fas fa-mug-hot"></i>',
    '📍': '<i class="fas fa-location-dot"></i>',
    '⭐': '<i class="fas fa-star"></i>',
    '📊': '<i class="fas fa-chart-line"></i>',
    '🏪': '<i class="fas fa-store"></i>',
    '➕': '<i class="fas fa-plus"></i>',
    '📈': '<i class="fas fa-chart-bar"></i>',
    '🖼️': '<i class="fas fa-images"></i>',
    '⚙️': '<i class="fas fa-cog"></i>',
    '🚪': '<i class="fas fa-right-from-bracket"></i>',
    '📸': '<i class="fas fa-camera"></i>',
    '📋': '<i class="fas fa-clipboard"></i>',
    '🗑️': '<i class="fas fa-trash"></i>',
    '🔄': '<i class="fas fa-rotate"></i>',
    '💰': '<i class="fas fa-dollar-sign"></i>',
    '🕐': '<i class="fas fa-clock"></i>',
    '🎯': '<i class="fas fa-bullseye"></i>',
    '♡': '<i class="far fa-heart"></i>',
    '♥': '<i class="fas fa-heart"></i>',
    '❤️': '<i class="fas fa-heart"></i>',
    '📶': '<i class="fas fa-wifi"></i>',
    '🔌': '<i class="fas fa-plug"></i>',
    '🌿': '<i class="fas fa-leaf"></i>',
    '🐕': '<i class="fas fa-paw"></i>',
    '📞': '<i class="fas fa-phone"></i>',
    '📧': '<i class="fas fa-envelope"></i>',
    '✏️': '<i class="fas fa-pen"></i>',
    '👁️': '<i class="fas fa-eye"></i>',
    '🔔': '<i class="fas fa-bell"></i>',
    '🔒': '<i class="fas fa-lock"></i>',
    '🔐': '<i class="fas fa-shield-halved"></i>',
    '⚠️': '<i class="fas fa-triangle-exclamation"></i>',
    'ℹ️': '<i class="fas fa-circle-info"></i>',
    '✓': '<i class="fas fa-check"></i>',
    '✗': '<i class="fas fa-xmark"></i>',
    '×': '<i class="fas fa-xmark"></i>',
    '🔍': '<i class="fas fa-magnifying-glass"></i>',
    '🔥': '<i class="fas fa-fire"></i>',
    '💾': '<i class="fas fa-floppy-disk"></i>',
    '🚀': '<i class="fas fa-rocket"></i>',
    '⏳': '<i class="fas fa-hourglass-half"></i>',
    '📡': '<i class="fas fa-tower-broadcast"></i>',
    '👤': '<i class="fas fa-user"></i>',
    '🗺️': '<i class="fas fa-map"></i>',
    '→': '<i class="fas fa-arrow-right"></i>',
    '←': '<i class="fas fa-arrow-left"></i>',
    '↑': '<i class="fas fa-arrow-up"></i>',
    '↓': '<i class="fas fa-arrow-down"></i>',
    '🟢': '<i class="fas fa-circle" style="color: #4CAF50;"></i>',
    '🟡': '<i class="fas fa-circle" style="color: #FFC107;"></i>',
    '🔴': '<i class="fas fa-circle" style="color: #F44336;"></i>'
};

function replaceEmojisInElement(element) {
    // Skip script and style tags
    if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
        return;
    }
    
    // Process text nodes
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const nodesToReplace = [];
    let node;
    
    while (node = walker.nextNode()) {
        let text = node.textContent;
        let hasEmoji = false;
        
        for (const emoji in iconMap) {
            if (text.includes(emoji)) {
                hasEmoji = true;
                break;
            }
        }
        
        if (hasEmoji) {
            nodesToReplace.push(node);
        }
    }
    
    // Replace emojis in collected nodes
    nodesToReplace.forEach(node => {
        let html = node.textContent;
        
        for (const [emoji, icon] of Object.entries(iconMap)) {
            html = html.split(emoji).join(icon);
        }
        
        // Create a temporary element to parse the HTML
        const temp = document.createElement('span');
        temp.innerHTML = html;
        
        // Replace the text node with the new content
        const parent = node.parentNode;
        while (temp.firstChild) {
            parent.insertBefore(temp.firstChild, node);
        }
        parent.removeChild(node);
    });
}

// Run on DOM content loaded
function initIconReplacer() {
    // Add Font Awesome if not already present
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(link);
    }
    
    // Replace emojis in the entire document
    replaceEmojisInElement(document.body);
    
    console.log('✓ Icons replaced with Font Awesome');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIconReplacer);
} else {
    initIconReplacer();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { replaceEmojisInElement, iconMap };
}
