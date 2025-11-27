// Owner Settings functionality

// Profile photo change
const changePhotoBtn = document.querySelector('.profile-photo-actions .btn-secondary-new');
const removePhotoBtn = document.querySelector('.btn-text');

if (changePhotoBtn) {
    changePhotoBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const photoLarge = document.querySelector('.profile-photo-large');
                    photoLarge.style.backgroundImage = `url(${e.target.result})`;
                    photoLarge.style.backgroundSize = 'cover';
                    photoLarge.style.backgroundPosition = 'center';
                    photoLarge.innerHTML = '';
                    showToast('Profile photo updated', 'success');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });
}

if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', () => {
        const photoLarge = document.querySelector('.profile-photo-large');
        photoLarge.style.backgroundImage = '';
        photoLarge.innerHTML = '<span>JD</span>';
        showToast('Profile photo removed', 'success');
    });
}

// Save profile changes
const saveBtn = document.querySelector('.form-actions-inline .btn-primary-new');

if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<span>⏳</span><span>Saving...</span>';
        saveBtn.disabled = true;
        
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
            showToast('Profile updated successfully', 'success');
        }, 1500);
    });
}

// Toggle switches
const toggleSwitches = document.querySelectorAll('.toggle-switch input');

toggleSwitches.forEach(toggle => {
    toggle.addEventListener('change', (e) => {
        const notificationItem = e.target.closest('.notification-item');
        const notificationName = notificationItem.querySelector('h4').textContent;
        const status = e.target.checked ? 'enabled' : 'disabled';
        
        showToast(`${notificationName} ${status}`, 'success');
    });
});

// Theme selection
const themeCards = document.querySelectorAll('.theme-card');

themeCards.forEach(card => {
    card.addEventListener('click', () => {
        const themeName = card.querySelector('h4').textContent;
        
        if (themeName === 'Dark Mode') {
            themeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            showToast('Dark mode activated', 'success');
        } else {
            showToast('This theme is coming soon', 'info');
        }
    });
});

// Account actions
const changePasswordBtn = document.querySelector('.account-action-item:nth-child(1) .btn-secondary-new');
const enable2FABtn = document.querySelector('.account-action-item:nth-child(2) .btn-secondary-new');
const deleteAccountBtn = document.querySelector('.account-action-item.danger .btn-danger');

if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', () => {
        const newPassword = prompt('Enter new password:');
        if (newPassword) {
            showToast('Password changed successfully', 'success');
        }
    });
}

if (enable2FABtn) {
    enable2FABtn.addEventListener('click', () => {
        showToast('Two-factor authentication setup initiated', 'info');
        setTimeout(() => {
            enable2FABtn.innerHTML = '<span>✓</span><span>Enabled</span>';
            enable2FABtn.style.background = 'rgba(76, 175, 80, 0.2)';
            enable2FABtn.style.borderColor = 'rgba(76, 175, 80, 0.4)';
            enable2FABtn.style.color = '#4CAF50';
        }, 2000);
    });
}

if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', () => {
        const confirmation = prompt('Type "DELETE" to confirm account deletion:');
        if (confirmation === 'DELETE') {
            showToast('Account deletion initiated. You will be logged out.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        } else if (confirmation !== null) {
            showToast('Account deletion cancelled', 'info');
        }
    });
}

// Logout button
const logoutBtn = document.querySelector('.logout-btn-mini');

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
        toast.remove();
    }, 3000);
}

// Animate settings sections on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.settings-section').forEach(section => {
    observer.observe(section);
});

console.log('Owner settings loaded! ⚙️');
