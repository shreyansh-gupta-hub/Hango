// Firebase Configuration for Owner Portal
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCR6fyqMDC-cBuARdXhD8KYn7Y3jqiXCVM",
    authDomain: "cafehunt-e84a7.firebaseapp.com",
    projectId: "cafehunt-e84a7",
    storageBucket: "cafehunt-e84a7.firebasestorage.app",
    messagingSenderId: "642019761362",
    appId: "1:642019761362:web:5b757e79afb4409f9f610b",
    measurementId: "G-S76DE68B7K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

console.log('Firebase initialized! 🔥');
