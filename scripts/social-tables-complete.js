// Complete Social Tables System with Firebase
console.log('🎉 Loading Social Tables...');

import { db } from './firebase-config.js';
import { 
    collection, 
    doc, 
    setDoc, 
    getDocs, 
    getDoc,
    onSnapshot, 
    updateDoc, 
    deleteDoc,
    arrayUnion, 
    arrayRemove,
    increment,
    serverTimestamp,
    query,
    where,
    orderBy
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// User management
let currentUserId = localStorage.getItem('userId') || 'user-' + Date.now();
let currentUserName = localStorage.getItem('userName') || prompt('Enter your name:') || 'Guest User';

// Save user info
localStorage.setItem('userId', currentUserId);
localStorage.setItem('userName', currentUserName);

let allTables = [];
let allCafes = [];
let myTables = [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    console.log('👤 User:', currentUserName, '(ID:', currentUserId + ')');
    await loadCafes();
    await loadTables();
    setupRealTimeSync();
    setupEventListeners();
});

// Load cafés for dropdown
async function loadCafes() {
    try {
        const cafesSnapshot = await getDocs(collection(db, 'cafes'));
        allCafes = [];
        cafesSnapshot.forEach(doc => {
            allCafes.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`✅ Loaded ${allCafes.length} cafés`);
        
        const select = document.getElementById('cafeSelect');
        if (select) {
            select.innerHTML = '<option value="">Choose a café...</option>' +
                allCafes.map(cafe => `<option value="${cafe.id}">${cafe.name} - ${cafe.location?.address || 'Bhopal'}</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading cafés:', error);
    }
}

// Load all tables
async function loadTables() {
    try {
        const tablesSnapshot = await getDocs(collection(db, 'socialTables'));
        allTables = [];
        
        tablesSnapshot.forEach(doc => {
            allTables.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`✅ Loaded ${allTables.length} tables`);
        displayTables();
        updateStats();
    } catch (error) {
        console.error('Error loading tables:', error);
        document.getElementById('loadingState').innerHTML = '<p style="color: #ff6b6b;">Error loading tables</p>';
    }
}

// Real-time sync
function setupRealTimeSync() {
    const tablesRef = collection(db, 'socialTables');
    
    onSnapshot(tablesRef, (snapshot) => {
        allTables = [];
        snapshot.forEach(doc => {
            allTables.push({ id: doc.id, ...doc.data() });
        });
        
        console.log('🔄 Real-time update:', allTables.length, 'tables');
        displayTables();
        updateStats();
    });
}

// Display tables
function displayTables() {
    const grid = document.getElementById('tablesGrid');
    const loadingState = document.getElementById('loadingState');
    
    if (loadingState) loadingState.style.display = 'none';
    
    if (allTables.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-table" style="font-size: 3rem; color: #00d4ff; margin-bottom: 1rem;"></i>
                <h3>No tables yet</h3>
                <p>Be the first to host a social table!</p>
                <button class="btn-primary" onclick="showHostModal()" style="margin-top: 1rem;">Host a Table</button>
            </div>
        `;
        return;
    }
    
    // Filter tables
    const activeFilter = document.querySelector('.filter-chip.active')?.dataset.filter || 'all';
    let filteredTables = allTables;
    
    if (activeFilter === 'filling') {
        filteredTables = allTables.filter(t => t.participants.length < t.maxSeats);
    } else if (activeFilter === 'confirmed') {
        filteredTables = allTables.filter(t => t.participants.length >= t.maxSeats);
    }
    
    // Sort tables
    const sortBy = document.getElementById('sortSelect')?.value || 'newest';
    filteredTables.sort((a, b) => {
        if (sortBy === 'newest') {
            return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
        } else if (sortBy === 'filling') {
            return (b.participants.length / b.maxSeats) - (a.participants.length / a.maxSeats);
        } else if (sortBy === 'popular') {
            return b.participants.length - a.participants.length;
        }
        return 0;
    });
    
    grid.innerHTML = filteredTables.map(table => createTableCard(table)).join('');
    
    // Update my tables
    myTables = allTables.filter(t => 
        t.hostId === currentUserId || t.participants.some(p => p.userId === currentUserId)
    );
    displayMyTables();
}

// Create table card HTML
function createTableCard(table) {
    const cafe = allCafes.find(c => c.id === table.cafeId);
    const isFull = table.participants.length >= table.maxSeats;
    const isHost = table.hostId === currentUserId;
    const isParticipant = table.participants.some(p => p.userId === currentUserId);
    const canJoin = !isFull && !isHost && !isParticipant;
    
    const fillPercentage = (table.participants.length / table.maxSeats) * 100;
    
    return `
        <div class="table-card ${isFull ? 'full' : ''}" data-table-id="${table.id}">
            <div class="table-header">
                <div class="table-theme">
                    <i class="fas fa-hashtag"></i>
                    <span>${table.theme}</span>
                </div>
                <div class="table-status ${isFull ? 'confirmed' : 'filling'}">
                    ${isFull ? '✓ Confirmed' : '⏳ Filling'}
                </div>
            </div>
            
            <div class="table-cafe">
                <i class="fas fa-store"></i>
                <span>${cafe?.name || 'Unknown Café'}</span>
            </div>
            
            <div class="table-datetime">
                <i class="fas fa-calendar-alt"></i>
                <span>${formatDate(table.date)} at ${table.time}</span>
            </div>
            
            <div class="table-seats">
                <div class="seats-info">
                    <i class="fas fa-users"></i>
                    <span>${table.participants.length} / ${table.maxSeats} seats filled</span>
                </div>
                <div class="seats-progress">
                    <div class="progress-fill" style="width: ${fillPercentage}%"></div>
                </div>
            </div>
            
            <div class="table-host">
                <i class="fas fa-crown"></i>
                <span>Hosted by ${table.hostName}</span>
            </div>
            
            ${table.entryRules ? `
                <div class="table-rules">
                    <i class="fas fa-list-check"></i>
                    <span>${table.entryRules}</span>
                </div>
            ` : ''}
            
            <div class="table-actions">
                ${isHost ? `
                    <button class="btn-secondary delete-table-btn" data-table-id="${table.id}">
                        <i class="fas fa-trash"></i> Cancel Table
                    </button>
                ` : canJoin ? `
                    <button class="btn-primary join-table-btn" data-table-id="${table.id}">
                        <i class="fas fa-user-plus"></i> Join Table
                    </button>
                ` : isParticipant ? `
                    <button class="btn-secondary leave-table-btn" data-table-id="${table.id}">
                        <i class="fas fa-user-minus"></i> Leave Table
                    </button>
                ` : `
                    <button class="btn-secondary" disabled>
                        <i class="fas fa-check"></i> Table Full
                    </button>
                `}
            </div>
        </div>
    `;
}

// Display my tables
function displayMyTables() {
    const grid = document.getElementById('myTablesGrid');
    
    if (myTables.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-table"></i>
                <p>You haven't joined or hosted any tables yet</p>
                <button class="btn-primary" onclick="showHostModal()">Host Your First Table</button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = myTables.map(table => createTableCard(table)).join('');
}

// Update stats
function updateStats() {
    const totalParticipants = allTables.reduce((sum, t) => sum + t.participants.length, 0);
    const activeTables = allTables.filter(t => t.participants.length < t.maxSeats).length;
    const confirmedTables = allTables.filter(t => t.participants.length >= t.maxSeats).length;
    
    document.getElementById('totalParticipants').textContent = totalParticipants;
    document.getElementById('activeTables').textContent = activeTables;
    document.getElementById('confirmedTables').textContent = confirmedTables;
}

// Host table modal
window.showHostModal = function() {
    document.getElementById('hostModal').classList.add('active');
    updateSeatsVisual();
};

window.closeHostModal = function() {
    document.getElementById('hostModal').classList.remove('active');
    document.getElementById('hostTableForm').reset();
};

// Adjust seats
window.adjustSeats = function(delta) {
    const input = document.getElementById('maxSeats');
    const current = parseInt(input.value);
    const newValue = Math.max(2, Math.min(20, current + delta));
    input.value = newValue;
    updateSeatsVisual();
};

function updateSeatsVisual() {
    const seats = parseInt(document.getElementById('maxSeats').value);
    const visual = document.getElementById('seatsVisual');
    visual.innerHTML = Array(seats).fill('<i class="fas fa-chair"></i>').join('');
}

// Set theme
window.setTheme = function(theme) {
    document.getElementById('tableNiche').value = theme;
};

// Host table form submission
document.getElementById('hostTableForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const theme = document.getElementById('tableNiche').value;
    const cafeId = document.getElementById('cafeSelect').value;
    const maxSeats = parseInt(document.getElementById('maxSeats').value);
    const date = document.getElementById('tableDate').value;
    const time = document.getElementById('tableTime').value;
    const entryRules = document.getElementById('entryRules').value;
    
    if (!theme || !cafeId || !date || !time) {
        alert('Please fill all required fields');
        return;
    }
    
    try {
        const tableData = {
            theme,
            cafeId,
            maxSeats,
            date,
            time,
            entryRules,
            hostId: currentUserId,
            hostName: currentUserName,
            participants: [{
                userId: currentUserId,
                userName: currentUserName,
                joinedAt: new Date().toISOString()
            }],
            createdAt: serverTimestamp(),
            status: 'active'
        };
        
        await setDoc(doc(collection(db, 'socialTables')), tableData);
        
        closeHostModal();
        showToast('Table created successfully! 🎉');
        
    } catch (error) {
        console.error('Error creating table:', error);
        alert('Error creating table. Please try again.');
    }
});

// Join table
async function joinTable(tableId) {
    try {
        const tableRef = doc(db, 'socialTables', tableId);
        const tableSnap = await getDoc(tableRef);
        
        if (!tableSnap.exists()) {
            alert('Table not found');
            return;
        }
        
        const table = tableSnap.data();
        
        if (table.participants.length >= table.maxSeats) {
            alert('Table is full');
            return;
        }
        
        await updateDoc(tableRef, {
            participants: arrayUnion({
                userId: currentUserId,
                userName: currentUserName,
                joinedAt: new Date().toISOString()
            })
        });
        
        showToast('Successfully joined the table! 🎉');
        
    } catch (error) {
        console.error('Error joining table:', error);
        alert('Error joining table. Please try again.');
    }
}

// Keep window reference for backward compatibility
window.joinTable = joinTable;

// Leave table
async function leaveTable(tableId) {
    if (!confirm('Are you sure you want to leave this table?')) return;
    
    try {
        const tableRef = doc(db, 'socialTables', tableId);
        const tableSnap = await getDoc(tableRef);
        
        if (!tableSnap.exists()) return;
        
        const table = tableSnap.data();
        const participant = table.participants.find(p => p.userId === currentUserId);
        
        if (participant) {
            await updateDoc(tableRef, {
                participants: arrayRemove(participant)
            });
            
            showToast('Left the table');
        }
        
    } catch (error) {
        console.error('Error leaving table:', error);
        alert('Error leaving table. Please try again.');
    }
}

// Keep window reference for backward compatibility
window.leaveTable = leaveTable;

// Delete table
async function deleteTable(tableId) {
    console.log('🗑️ Attempting to delete table:', tableId);
    
    if (!confirm('Are you sure you want to cancel this table?')) {
        console.log('❌ User cancelled deletion');
        return;
    }
    
    try {
        console.log('🔄 Deleting table from Firestore...');
        await deleteDoc(doc(db, 'socialTables', tableId));
        console.log('✅ Table deleted successfully');
        showToast('Table cancelled successfully! 🗑️');
        
    } catch (error) {
        console.error('❌ Error deleting table:', error);
        alert('Error cancelling table: ' + error.message);
    }
}

// Keep window reference for backward compatibility
window.deleteTable = deleteTable;

// Show toast
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

// Setup event listeners
function setupEventListeners() {
    // Filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            displayTables();
        });
    });
    
    // Sort select
    document.getElementById('sortSelect')?.addEventListener('change', displayTables);
    
    // Modal overlay click
    document.querySelector('.modal-overlay')?.addEventListener('click', closeHostModal);
    
    // Set minimum date to today
    const dateInput = document.getElementById('tableDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
    
    // Event delegation for table action buttons
    document.addEventListener('click', async (e) => {
        // Delete table
        if (e.target.closest('.delete-table-btn')) {
            const btn = e.target.closest('.delete-table-btn');
            const tableId = btn.dataset.tableId;
            console.log('🗑️ Delete button clicked for table:', tableId);
            await deleteTable(tableId);
        }
        
        // Join table
        if (e.target.closest('.join-table-btn')) {
            const btn = e.target.closest('.join-table-btn');
            const tableId = btn.dataset.tableId;
            console.log('➕ Join button clicked for table:', tableId);
            await joinTable(tableId);
        }
        
        // Leave table
        if (e.target.closest('.leave-table-btn')) {
            const btn = e.target.closest('.leave-table-btn');
            const tableId = btn.dataset.tableId;
            console.log('➖ Leave button clicked for table:', tableId);
            await leaveTable(tableId);
        }
    });
}

// Scroll to tables
window.scrollToTables = function() {
    document.getElementById('tablesSection').scrollIntoView({ behavior: 'smooth' });
};

console.log('✅ Social Tables initialized!');
