// Smooth image loading
export function initImageLoading() {
    // Handle all images on the page
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            
            img.addEventListener('error', () => {
                // Fallback for broken images
                img.style.opacity = '0.3';
                console.warn('Image failed to load:', img.src);
            });
        }
    });
}

// Preload images before showing them
export function preloadImages(urls) {
    return Promise.all(
        urls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(url);
                img.onerror = () => reject(url);
                img.src = url;
            });
        })
    );
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageLoading);
} else {
    initImageLoading();
}

console.log('✅ Image loader initialized');
