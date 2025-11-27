// Social Tables System with Real-time Sync
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, doc, setDoc, getDocs, onSnapshot, updateDoc, arrayUnion, increment } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentUserId = localStorage.getItem('userId') || 'user-' + Date.now();
let currentUserName = localStorage.getItem('userName') || 'Guest User';
let allTables = [];
let allCafes = [];

// Load cafés for dropdown
async function loadCafes() {
    const cafesSnapshot = await getDocs(collection(db, 'cafes'));
    allCafes = [];
    cafesSnapshot.forEach(doc => {
        allCafes.push({ id: doc.id, ...doc.data() });
    });
    
    const select = document.getElementById('cafeSelect');
    if (select) {
        select.innerHTML = '<option value="">Choose a café...</option>' +
            allCafes.map(cafe => `<option value="${cafe.id}">${cafe.name}</option>`).join('');
    }
}

// Adjust seats
window.adjustSeats = function(delta) {