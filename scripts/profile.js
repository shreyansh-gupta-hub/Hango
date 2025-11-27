// User Profile page functionality

// Import Firebase (if using modules)
let auth, db, updateProfile, updateEmail, updatePassword, doc, updateDoc, storage, ref, uploadBytes, getDownloadURL;

// Initialize Firebase imports
async function initFirebase() {
    try {
        const { getAuth, updateProfile: up, updateEmail: ue, updatePassword: upw } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const { getFirestore, doc: d, updateDoc: ud } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const { getStorage, ref: r, uploadBytes: ub, getDownloadURL: gdu } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js');
        
        auth = getAuth();
        updateProfile = up;
        updateEmail = ue;
        updatePassword = upw;
        doc = d;
        updateDoc = ud;
        db = getFirestore();
        storage = getStorage();
        ref = r;
        uploadBytes = ub;
        getDownloadURL = gdu;
    } catch (error) {
        console.log('Firebase not available, using localStorage only');
    }
}

// Load user profile
function loadUserProfile() {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userAvatar = localStorage.getItem('userAvatar');
    const isGuest = localStorage.getItem('isGuest') === 'true';
    
    if (userName) {
        document.getElementById('profile-name').textContent = userName;
    }
    
    // Hide email for guest users
    const emailElement = document.getElementById('profile-email');
    if (emailElement) {
        if (isGuest) {
            emailElement.textContent = 'Guest Account';
            emailElement.style.color = 'rgba(212, 175, 55, 0.8)';
        } else if (userEmail) {
            emailElement.textContent = userEmail;
            emailElement.style.color = '';
        } else {
            emailElement.textContent = 'No email set';
            emailElement.style.color = 'rgba(255, 255, 255, 0.5)';
        }
    }
    
    if (userAvatar) {
        document.getElementById('profile-avatar').src = userAvatar;
    }
}

// Handle avatar upload
const avatarUpload = document.getElementById('avatar-upload');
if (avatarUpload) {
    avatarUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }
        
        // Show loading state
        const avatarImg = document.getElementById('profile-avatar');
        const originalSrc = avatarImg.src;
        
        try {
            // Read file as data URL for preview
            const reader = new FileReader();
            reader.onload = async (e) => {
                const imageUrl = e.target.result;
                
                // Update UI immediately
                avatarImg.src = imageUrl;
                localStorage.setItem('userAvatar', imageUrl);
                
                // Upload to Firebase Storage if available
                if (storage && auth && auth.currentUser) {
                    try {
                        const userId = auth.currentUser.uid;
                        const storageRef = ref(storage, `avatars/${userId}`);
                        
                        // Convert data URL to blob
                        const response = await fetch(imageUrl);
                        const blob = await response.blob();
                        
                        // Upload to Firebase
                        await uploadBytes(storageRef, blob);
                        const downloadURL = await getDownloadURL(storageRef);
                        
                        // Update profile with Firebase URL
                        await updateProfile(auth.currentUser, {
                            photoURL: downloadURL
                        });
                        
                        // Update Firestore
                        if (db) {
                            const userId = localStorage.getItem('userId');
                            if (userId) {
                                await updateDoc(doc(db, 'users', userId), {
                                    photoURL: downloadURL
                                });
                            }
                        }
                        
                        // Store Firebase URL in localStorage
                        localStorage.setItem('userAvatar', downloadURL);
                        
                        showToast('Profile photo updated!', 'success');
                    } catch (error) {
                        console.error('Firebase upload error:', error);
                        showToast('Photo saved locally', 'info');
                    }
                } else {
                    showToast('Profile photo updated!', 'success');
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error uploading avatar:', error);
            avatarImg.src = originalSrc;
            showToast('Failed to upload photo', 'error');
        }
    });
}

// Toast notification helper
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast-notification show';
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: rgba(26, 26, 26, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid ${type === 'success' ? 'rgba(76, 175, 80, 0.4)' : type === 'error' ? 'rgba(244, 67, 54, 0.4)' : 'rgba(212, 175, 55, 0.4)'};
        border-radius: 12px;
        color: white;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Saved cafés functionality removed - feature not needed

// Edit Profile Modal
const editBtn = document.getElementById('edit-profile-btn');
const modal = document.getElementById('edit-profile-modal');
const closeModal = document.getElementById('close-modal');
const editForm = document.getElementById('edit-profile-form');

if (editBtn) {
    editBtn.addEventListener('click', () => {
        const isGuest = localStorage.getItem('isGuest') === 'true';
        
        // Load current values
        document.getElementById('edit-name').value = localStorage.getItem('userName') || '';
        document.getElementById('edit-email').value = localStorage.getItem('userEmail') || '';
        document.getElementById('edit-password').value = '';
        
        // Disable email and password fields for guest users
        const emailInput = document.getElementById('edit-email');
        const passwordInput = document.getElementById('edit-password');
        
        if (isGuest) {
            emailInput.disabled = true;
            emailInput.placeholder = 'Not available for guest accounts';
            passwordInput.disabled = true;
            passwordInput.placeholder = 'Not available for guest accounts';
        } else {
            emailInput.disabled = false;
            emailInput.placeholder = 'Enter your email';
            passwordInput.disabled = false;
            passwordInput.placeholder = 'Leave blank to keep current';
        }
        
        // Show modal
        modal.classList.add('active');
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

// Close modal on outside click
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Handle profile update
if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newName = document.getElementById('edit-name').value;
        const newEmail = document.getElementById('edit-email').value;
        const newPassword = document.getElementById('edit-password').value;
        
        const errorDiv = document.getElementById('edit-error-message');
        const successDiv = document.getElementById('edit-success-message');
        
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';
        
        try {
            const isGuest = localStorage.getItem('isGuest') === 'true';
            
            // Update localStorage
            localStorage.setItem('userName', newName);
            
            // Only update email for non-guest users
            if (!isGuest) {
                localStorage.setItem('userEmail', newEmail);
            }
            
            // Update Firebase if available (skip for guest users)
            if (auth && auth.currentUser && !isGuest) {
                // Update display name
                await updateProfile(auth.currentUser, {
                    displayName: newName
                });
                
                // Update email if changed
                if (newEmail !== auth.currentUser.email) {
                    await updateEmail(auth.currentUser, newEmail);
                }
                
                // Update password if provided
                if (newPassword) {
                    await updatePassword(auth.currentUser, newPassword);
                }
                
                // Update Firestore
                if (db) {
                    const userId = localStorage.getItem('userId');
                    if (userId) {
                        await updateDoc(doc(db, 'users', userId), {
                            name: newName,
                            email: newEmail
                        });
                    }
                }
            }
            
            // Show success message
            successDiv.textContent = isGuest ? 'Name updated successfully!' : 'Profile updated successfully!';
            successDiv.style.display = 'block';
            
            // Update UI
            loadUserProfile();
            
            // Close modal after 2 seconds
            setTimeout(() => {
                modal.classList.remove('active');
            }, 2000);
            
        } catch (error) {
            errorDiv.textContent = error.message || 'Failed to update profile';
            errorDiv.style.display = 'block';
        }
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to logout?')) {
            // Sign out from Firebase
            if (auth) {
                try {
                    await auth.signOut();
                } catch (error) {
                    console.error('Firebase signout error:', error);
                }
            }
            
            // Clear localStorage
            localStorage.removeItem('userType');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            
            // Redirect to landing page
            window.location.href = 'Landing-Page/Landing-Page/index.html';
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Firebase
    await initFirebase();
    
    // Load user profile
    loadUserProfile();
});

console.log('Profile page loaded! 👤');
