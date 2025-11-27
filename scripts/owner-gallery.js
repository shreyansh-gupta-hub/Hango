// Owner Gallery functionality

// Upload button
const uploadBtn = document.getElementById('uploadBtn');
const uploadModal = document.getElementById('uploadModal');

if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
        uploadModal.classList.add('show');
    });
}

window.closeUploadModal = function() {
    uploadModal.classList.remove('show');
};

// Modal upload zone
const modalUploadZone = document.getElementById('modalUploadZone');
const modalImageUpload = document.getElementById('modalImageUpload');

if (modalUploadZone) {
    modalUploadZone.addEventListener('click', () => {
        modalImageUpload.click();
    });
    
    modalImageUpload.addEventListener('change', (e) => {
        handleImageUpload(e.target.files);
    });
    
    // Drag and drop
    modalUploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        modalUploadZone.classList.add('dragover');
    });
    
    modalUploadZone.addEventListener('dragleave', () => {
        modalUploadZone.classList.remove('dragover');
    });
    
    modalUploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        modalUploadZone.classList.remove('dragover');
        handleImageUpload(e.dataTransfer.files);
    });
}

function handleImageUpload(files) {
    const fileCount = files.length;
    modalUploadZone.innerHTML = `
        <div class="upload-icon-new">✓</div>
        <h3 class="upload-title">${fileCount} image(s) selected</h3>
        <p class="upload-subtitle">Ready to upload</p>
    `;
}

// Delete functionality
const deleteModal = document.getElementById('deleteModal');
let imageToDelete = null;

document.querySelectorAll('.gallery-action-btn.delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        imageToDelete = btn.closest('.gallery-card-new');
        deleteModal.classList.add('show');
    });
});

window.closeModal = function() {
    deleteModal.classList.remove('show');
    imageToDelete = null;
};

window.confirmDelete = function() {
    if (imageToDelete) {
        imageToDelete.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            imageToDelete.remove();
            showToast('Image removed from user portal', 'success');
        }, 300);
    }
    closeModal();
};

// Replace functionality
document.querySelectorAll('.gallery-action-btn.replace').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const card = btn.closest('.gallery-card-new');
                    const img = card.querySelector('img');
                    img.src = e.target.result;
                    showToast('Image updated on user portal', 'success');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });
});

// View toggle
const viewBtns = document.querySelectorAll('.view-btn');
const galleryGrid = document.getElementById('galleryGrid');

viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const view = btn.dataset.view;
        if (view === 'grid') {
            galleryGrid.style.gridAutoRows = '300px';
            document.querySelectorAll('.gallery-card-new').forEach(card => {
                card.style.gridRow = 'span 1';
            });
        } else {
            galleryGrid.style.gridAutoRows = '200px';
            // Reset to masonry layout
            const cards = document.querySelectorAll('.gallery-card-new');
            cards.forEach((card, i) => {
                const spans = [1, 2, 2, 1, 2, 1];
                card.style.gridRow = `span ${spans[i % spans.length]}`;
            });
        }
    });
});

// Filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter gallery items
        const filterText = btn.textContent.toLowerCase();
        const cards = document.querySelectorAll('.gallery-card-new');
        
        cards.forEach(card => {
            const info = card.querySelector('.gallery-card-info h4').textContent.toLowerCase();
            if (filterText.includes('all') || info.includes(filterText.split('(')[0].trim())) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

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

// Add hover tilt effect
const galleryCards = document.querySelectorAll('.gallery-card-new');

galleryCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

console.log('Owner gallery loaded! 🖼️');
