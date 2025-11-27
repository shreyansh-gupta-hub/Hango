// Owner Add Café functionality
let db, storage;

// Import Firebase modules
async function initFirebase() {
    try {
        const { db: database, storage: storageInstance } = await import('./firebase-config.js');
        db = database;
        storage = storageInstance;
        console.log('✓ Firebase initialized');
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}

// Initialize Firebase on load
initFirebase();

// Initialize map
let map, marker;
let selectedLat = 0, selectedLng = 0;

function initMap() {
    map = L.map('map').setView([40.7128, -74.0060], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    map.on('click', function(e) {
        if (marker) {
            map.removeLayer(marker);
        }
        
        marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
        selectedLat = e.latlng.lat;
        selectedLng = e.latlng.lng;
        
        document.getElementById('lat').textContent = selectedLat.toFixed(4);
        document.getElementById('lng').textContent = selectedLng.toFixed(4);
    });
}

// Image upload handling
const imageUploadZone = document.getElementById('imageUploadZone');
const imageUpload = document.getElementById('imageUpload');
const imagePreviewGrid = document.getElementById('imagePreviewGrid');
let uploadedImages = [];

imageUploadZone.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', (e) => {
    handleImageFiles(e.target.files);
});

// Drag and drop
imageUploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageUploadZone.classList.add('dragover');
});

imageUploadZone.addEventListener('dragleave', () => {
    imageUploadZone.classList.remove('dragover');
});

imageUploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    imageUploadZone.classList.remove('dragover');
    handleImageFiles(e.dataTransfer.files);
});

function handleImageFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('Image size should be less than 5MB', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImages.push({
                    file: file,
                    url: e.target.result,
                    name: file.name
                });
                displayImagePreview(e.target.result, uploadedImages.length - 1);
            };
            reader.readAsDataURL(file);
        }
    });
}

function displayImagePreview(url, index) {
    const previewCard = document.createElement('div');
    previewCard.className = 'preview-card';
    previewCard.innerHTML = `
        <img src="${url}" alt="Preview">
        <div class="preview-overlay">
            <button class="preview-action" onclick="removeImage(${index})">🗑️</button>
        </div>
    `;
    imagePreviewGrid.appendChild(previewCard);
}

window.removeImage = function(index) {
    uploadedImages.splice(index, 1);
    imagePreviewGrid.innerHTML = '';
    uploadedImages.forEach((img, i) => {
        displayImagePreview(img.url, i);
    });
};

// Menu upload handling
const menuUploadZone = document.getElementById('menuUploadZone');
const menuUpload = document.getElementById('menuUpload');
const menuPreviewGrid = document.getElementById('menuPreviewGrid');

menuUploadZone.addEventListener('click', () => {
    menuUpload.click();
});

menuUpload.addEventListener('change', (e) => {
    handleMenuFiles(e.target.files);
});

function handleMenuFiles(files) {
    Array.from(files).forEach(file => {
        const menuCard = document.createElement('div');
        menuCard.className = 'menu-preview-card';
        menuCard.innerHTML = `
            <div class="upload-icon-new">📋</div>
            <h4>${file.name}</h4>
            <p>${(file.size / 1024).toFixed(2)} KB</p>
        `;
        menuPreviewGrid.appendChild(menuCard);
    });
}

// Form submission
const cafeForm = document.getElementById('cafeForm');
const successModal = document.getElementById('successModal');

if (cafeForm) {
    cafeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Import Firebase functions dynamically
        const { collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const { ref, uploadBytes, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js');
    
    // Show loading state
    const submitBtn = cafeForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>⏳</span><span>Publishing...</span>';
    submitBtn.disabled = true;
    
    try {
        // Validate required fields
        const cafeName = cafeForm.querySelector('input[type="text"]').value.trim();
        const category = cafeForm.querySelector('select').value;
        const description = cafeForm.querySelector('textarea').value.trim();
        
        if (!cafeName || !category || !description) {
            showToast('Please fill in all required fields', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // Set default location if not selected
        if (selectedLat === 0 && selectedLng === 0) {
            selectedLat = 40.7128;
            selectedLng = -74.0060;
        }
        
        // Upload images to Firebase Storage
        const imageUrls = [];
        
        if (uploadedImages.length > 0) {
            submitBtn.innerHTML = '<span>⏳</span><span>Uploading images...</span>';
            
            try {
                for (let i = 0; i < uploadedImages.length; i++) {
                    const image = uploadedImages[i];
                    const timestamp = Date.now() + i; // Unique timestamp for each image
                    const fileName = `${timestamp}_${image.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
                    const storageRef = ref(storage, `cafes/${fileName}`);
                    
                    // Convert data URL to blob
                    const response = await fetch(image.url);
                    const blob = await response.blob();
                    
                    // Upload to Firebase
                    console.log(`Uploading image ${i + 1}/${uploadedImages.length}...`);
                    await uploadBytes(storageRef, blob);
                    const downloadURL = await getDownloadURL(storageRef);
                    imageUrls.push(downloadURL);
                    console.log(`✓ Image ${i + 1} uploaded successfully`);
                }
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                showToast('Image upload failed. Saving café without images.', 'warning');
                // Continue without images
            }
        }
        
        submitBtn.innerHTML = '<span>⏳</span><span>Publishing café...</span>';
        
        // Collect form data
        const formData = {
            name: cafeName,
            category: category,
            description: description,
            location: {
                lat: selectedLat,
                lng: selectedLng
            },
            images: imageUrls.length > 0 ? imageUrls : [],
            imageCount: imageUrls.length,
            status: 'live',
            rating: '4.5',
            reviews: '0',
            ownerId: localStorage.getItem('ownerId') || 'default-owner',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        
        console.log('Saving café to Firestore:', formData);
        
        // Save to Firestore
        const docRef = await addDoc(collection(db, 'cafes'), formData);
        console.log('✓ Café saved with ID:', docRef.id);
        
        // Show success modal
        if (successModal) {
            successModal.classList.add('show');
        }
        
        // Show toast
        showToast('Café published successfully! 🎉', 'success');
        
        // Reset form after 2 seconds
        setTimeout(() => {
            cafeForm.reset();
            uploadedImages = [];
            imagePreviewGrid.innerHTML = '';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Error publishing café:', error);
        showToast(`Error: ${error.message}`, 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
    });
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification show';
    toast.innerHTML = `
        <div class="toast-icon">${type === 'success' ? '✓' : '✗'}</div>
        <div class="toast-content">
            <h4 class="toast-title">${type === 'success' ? 'Success!' : 'Error'}</h4>
            <p class="toast-message">${message}</p>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('map')) {
        initMap();
    }
});

console.log('Owner add café loaded! ➕');
