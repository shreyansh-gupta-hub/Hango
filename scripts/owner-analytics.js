// Owner Analytics functionality

// Initialize charts
function initCharts() {
    // Sparklines
    createSparkline('viewsSparkline', [45, 52, 48, 65, 72, 68, 85]);
    createSparkline('bookmarksSparkline', [30, 35, 42, 38, 45, 52, 58]);
    createSparkline('clicksSparkline', [20, 25, 30, 28, 35, 40, 45]);
    
    // User Visits Chart
    const visitsCtx = document.getElementById('visitsChart');
    if (visitsCtx) {
        new Chart(visitsCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Views',
                        data: [450, 520, 480, 650, 720, 850, 780],
                        borderColor: '#D4AF37',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Unique Visitors',
                        data: [320, 380, 350, 480, 520, 620, 580],
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(212, 175, 55, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        }
                    }
                }
            }
        });
    }
    
    // Bookmark Trends Chart
    const bookmarkCtx = document.getElementById('bookmarkChart');
    if (bookmarkCtx) {
        new Chart(bookmarkCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Bookmarks',
                    data: [45, 52, 48, 65, 72, 85, 68],
                    backgroundColor: 'rgba(212, 175, 55, 0.8)',
                    borderColor: '#D4AF37',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(212, 175, 55, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        }
                    }
                }
            }
        });
    }
}

function createSparkline(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map((_, i) => i),
                datasets: [{
                    data: data,
                    borderColor: '#D4AF37',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    y: {
                        display: false
                    },
                    x: {
                        display: false
                    }
                }
            }
        });
    }
}

// Animate numbers on scroll
function animateNumbers() {
    const numbers = document.querySelectorAll('.analytics-number');
    
    numbers.forEach(number => {
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

// Time filter change
const timeFilter = document.querySelector('.time-filter-new');
if (timeFilter) {
    timeFilter.addEventListener('change', (e) => {
        console.log('Time filter changed:', e.target.value);
        // Reload data based on selected time range
        showToast('Loading data...', 'info');
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
    initCharts();
    
    // Animate numbers after a short delay
    setTimeout(() => {
        animateNumbers();
    }, 500);
});

console.log('Owner analytics loaded! 📈');
