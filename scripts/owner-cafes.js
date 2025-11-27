// Owner Cafés List functionality

// Action buttons
document.querySelectorAll('.action-btn.edit').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'owner-add-cafe-new.html';
    });
});

document.querySelectorAll('.action-btn.preview').forEach(btn => {
    btn.addEventListener('click', () => {
        showToast('Opening user preview...', 'info');
        setTimeout(() => {
            window.open('cafe-details.html', '_blank');
        }, 500);
    });
});

document.querySelectorAll('.action-btn.delete').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.cafe-card-3d');
        const cafeName = card.querySelector('.cafe-card-title').textContent;
        
        if (confirm(`Are you sure you want to delete "${cafeName}"? This will remove it from the user portal.`)) {
            card.style.animation = 'fadeOut 0.4s ease-out';
            setTimeout(() => {
                card.remove();
                showToast('Café removed from user portal', 'success');
            }, 400);
        }
    });
});

// Filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const cafeCards = document.querySelectorAll('.cafe-card-3d');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterText = btn.textContent.toLowerCase();
        
        cafeCards.forEach(card => {
            const statusBadge = card.querySelector('.cafe-status-badge');
            const status = statusBadge ? statusBadge.textContent.toLowerCase() : '';
            
            if (filterText.includes('all')) {
                card.style.display = '';
            } else if (filterText.includes('live') && status.includes('live')) {
                card.style.display = '';
            } else if (filterText.includes('draft') && status.includes('draft')) {
                card.style.display = '';
            } else if (filterText.includes('needs update')) {
                card.style.display = 'none'; // No cards with this status yet
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Search functionality
const searchInput = document.querySelector('.search-box input');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        cafeCards.forEach(card => {
            const title = card.querySelector('.cafe-card-title').textContent.toLowerCase();
            const category = card.querySelector('.cafe-card-category').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Card hover effects
cafeCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// Animate cards on load
function animateCards() {
    cafeCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification show';
    toast.innerHTML = `
        <div class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</div>
        <div class="toast-content">
            <h4 class="toast-title">${type === 'success' ? 'Success!' : 'Info'}</h4>
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
    animateCards();
});

console.log('Owner cafés list loaded! 🏪');
