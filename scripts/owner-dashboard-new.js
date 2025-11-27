// Owner Dashboard functionality

// Update sync indicator time
function updateSyncTime() {
    const syncTime = document.querySelector('.sync-time');
    if (syncTime) {
        let minutes = 0;
        setInterval(() => {
            minutes++;
            syncTime.textContent = `Updated ${minutes}m ago`;
        }, 60000); // Update every minute
    }
}

// Animate stat numbers
function animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(number => {
        const target = parseFloat(number.textContent.replace(/,/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (Number.isInteger(target)) {
                number.textContent = Math.floor(current).toLocaleString();
            } else {
                number.textContent = current.toFixed(1);
            }
        }, 16);
    });
}

// Animate stat cards on load
function animateStatCards() {
    const cards = document.querySelectorAll('.stat-card-3d-new');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Animate update feed items
function animateUpdateFeed() {
    const items = document.querySelectorAll('.update-item');
    
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 500 + (index * 100));
    });
}

// Add new update to feed (simulated real-time)
function addRealtimeUpdate() {
    const updates = [
        {
            icon: 'success',
            title: 'New Bookmark',
            description: 'User saved your café',
            badge: 'live'
        },
        {
            icon: 'success',
            title: 'Photo Viewed',
            description: 'Gallery image opened by user',
            badge: 'live'
        },
        {
            icon: 'info',
            title: 'Profile Visit',
            description: 'User viewed your café details',
            badge: ''
        }
    ];
    
    setInterval(() => {
        const feed = document.querySelector('.updates-feed');
        if (feed && Math.random() > 0.7) { // 30% chance every interval
            const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
            
            const updateItem = document.createElement('div');
            updateItem.className = 'update-item';
            updateItem.style.opacity = '0';
            updateItem.style.transform = 'translateX(-30px)';
            updateItem.innerHTML = `
                <div class="update-icon ${randomUpdate.icon}">${randomUpdate.icon === 'success' ? '✓' : 'ℹ'}</div>
                <div class="update-content">
                    <h4 class="update-title">${randomUpdate.title}</h4>
                    <p class="update-description">${randomUpdate.description}</p>
                    <span class="update-time">Just now</span>
                </div>
                ${randomUpdate.badge ? `<span class="update-badge ${randomUpdate.badge}">Live on User Portal</span>` : '<span class="update-badge">User Activity</span>'}
            `;
            
            feed.insertBefore(updateItem, feed.firstChild);
            
            setTimeout(() => {
                updateItem.style.transition = 'all 0.5s ease-out';
                updateItem.style.opacity = '1';
                updateItem.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove oldest item if more than 5
            if (feed.children.length > 5) {
                const lastItem = feed.lastChild;
                lastItem.style.opacity = '0';
                setTimeout(() => lastItem.remove(), 300);
            }
            
            // Update sync indicator
            const syncTime = document.querySelector('.sync-time');
            if (syncTime) {
                syncTime.textContent = 'Updated just now';
            }
        }
    }, 10000); // Check every 10 seconds
}

// CTA button glow animation
function animateCTAButton() {
    const ctaBtn = document.querySelector('.add-cafe-cta');
    if (ctaBtn) {
        ctaBtn.addEventListener('mouseenter', () => {
            ctaBtn.style.animation = 'pulse 1s ease-in-out infinite';
        });
        
        ctaBtn.addEventListener('mouseleave', () => {
            ctaBtn.style.animation = '';
        });
    }
}

// Quick action cards
const quickActionCards = document.querySelectorAll('.quick-action-card');

quickActionCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// Notification button
const notificationBtn = document.querySelector('.notification-btn');

if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
        showToast('You have 3 new notifications', 'info');
    });
}

// Logout button
const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            showToast('Logging out...', 'info');
            setTimeout(() => {
                localStorage.removeItem('ownerLoggedIn');
                window.location.href = 'Landing-Page/Landing-Page/owner-auth.html';
            }, 1500);
        }
    });
}

// Toast notification
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification show';
    
    let icon = '✓';
    let title = 'Success!';
    
    if (type === 'error') {
        icon = '✗';
        title = 'Error';
    } else if (type === 'info') {
        icon = 'ℹ';
        title = 'Info';
    }
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <h4 class="toast-title">${title}</h4>
            <p class="toast-message">${message}</p>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const coffeeGrain = document.querySelector('.coffee-grain-bg');
    if (coffeeGrain) {
        coffeeGrain.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    updateSyncTime();
    animateStatCards();
    
    setTimeout(() => {
        animateStatNumbers();
        animateUpdateFeed();
    }, 600);
    
    animateCTAButton();
    addRealtimeUpdate();
    
    // Show welcome toast
    setTimeout(() => {
        showToast('Welcome back! Your dashboard is synced.', 'success');
    }, 1000);
});

console.log('Owner dashboard loaded! 📊');
