// Owner Dashboard functionality

// Check if owner is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('ownerLoggedIn');
    if (!isLoggedIn && !window.location.href.includes('owner-login') && !window.location.href.includes('owner-signup')) {
        window.location.href = 'owner-login.html';
    }
}

// Load owner data
function loadOwnerData() {
    const cafeName = localStorage.getItem('cafeName') || 'Artisan Brew House';
    const welcomeText = document.querySelector('.dashboard-header h1');
    if (welcomeText && welcomeText.textContent.includes('Welcome back')) {
        welcomeText.textContent = `Welcome back, ${cafeName}`;
    }
}

// File upload functionality
const imageUpload = document.getElementById('imageUpload');
const menuUpload = document.getElementById('menuUpload');

if (imageUpload) {
    const uploadZone = imageUpload.parentElement;
    
    uploadZone.addEventListener('click', () => {
        imageUpload.click();
    });
    
    imageUpload.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            uploadZone.innerHTML = `
                <div class="upload-icon">✓</div>
                <p>${files.length} image(s) selected</p>
            `;
        }
    });
    
    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--gold)';
        uploadZone.style.background = 'rgba(212, 175, 55, 0.2)';
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = '';
        uploadZone.style.background = '';
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            uploadZone.innerHTML = `
                <div class="upload-icon">✓</div>
                <p>${files.length} image(s) uploaded</p>
            `;
        }
        uploadZone.style.borderColor = '';
        uploadZone.style.background = '';
    });
}

if (menuUpload) {
    const uploadZone = menuUpload.parentElement;
    
    uploadZone.addEventListener('click', () => {
        menuUpload.click();
    });
    
    menuUpload.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            uploadZone.innerHTML = `
                <div class="upload-icon">✓</div>
                <p>${files.length} file(s) selected</p>
            `;
        }
    });
}

// Form submission
const cafeForm = document.querySelector('.cafe-form');

if (cafeForm) {
    cafeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Café published successfully! 🎉');
        window.location.href = 'owner-dashboard-new.html';
    });
}

// Stats animation
function animateStats() {
    const statCards = document.querySelectorAll('.stat-card-3d');
    
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'fadeIn 0.6s ease-out forwards';
        }, index * 100);
    });
}

// Chart animation
function animateChart() {
    const bars = document.querySelectorAll('.bar-3d');
    
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.animation = 'slideUp 0.8s ease-out forwards';
        }, index * 100);
    });
}

// Progress bar animation
function animateProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    
    progressFills.forEach((fill, index) => {
        setTimeout(() => {
            const width = fill.style.width;
            fill.style.width = '0';
            setTimeout(() => {
                fill.style.width = width;
            }, 100);
        }, index * 200);
    });
}

// Gallery hover effects
const galleryItems = document.querySelectorAll('.gallery-item-3d');

galleryItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateZ = (x - centerX) / 50;
        
        item.style.transform = `scale(1.05) rotateZ(${rotateZ}deg)`;
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadOwnerData();
    
    if (document.querySelector('.stat-card-3d')) {
        animateStats();
    }
    
    if (document.querySelector('.bar-3d')) {
        animateChart();
    }
    
    if (document.querySelector('.progress-fill')) {
        animateProgressBars();
    }
});

console.log('Owner dashboard loaded! 📊');
