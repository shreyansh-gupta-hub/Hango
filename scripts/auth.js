// Authentication functionality

// Login form
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        
        // Simulate login
        if (email && password) {
            // Store user session
            localStorage.setItem('ownerLoggedIn', 'true');
            localStorage.setItem('ownerEmail', email);
            
            // Redirect to new dashboard
            window.location.href = 'owner-dashboard-new.html';
        }
    });
}

// Signup form
const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const cafeName = signupForm.querySelector('input[type="text"]').value;
        const email = signupForm.querySelector('input[type="email"]').value;
        const password = signupForm.querySelector('input[type="password"]').value;
        
        // Simulate signup
        if (cafeName && email && password) {
            // Store user data
            localStorage.setItem('ownerLoggedIn', 'true');
            localStorage.setItem('ownerEmail', email);
            localStorage.setItem('cafeName', cafeName);
            
            // Redirect to new dashboard
            window.location.href = 'owner-dashboard-new.html';
        }
    });
}

// Particle animation
const particles = document.querySelectorAll('.particle');

particles.forEach((particle, index) => {
    const size = Math.random() * 15 + 5;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
    particle.style.animationDelay = (Math.random() * 2) + 's';
});

console.log('Auth page loaded! 🔐');
