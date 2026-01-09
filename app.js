// ===================================
// KLAVYE HIZ TAKİP - MAIN APPLICATION
// ===================================

// Storage Key
const STORAGE_KEY = 'klavye_hiz_takip_data';

// Utility Functions
const Utils = {
    // Get data from localStorage
    getData() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Save data to localStorage
    saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Format date for display
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    },

    // Format date short
    formatDateShort(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    },

    // Get keyboard type label
    getKeyboardLabel(type) {
        const labels = {
            'q-klavye': 'Q Klavye',
            'f-klavye': 'F Klavye'
        };
        return labels[type] || type;
    },

    // Get environment label
    getEnvironmentLabel(env) {
        const labels = {
            'ev': 'Ev',
            'okul': 'Okul',
            'ofis': 'Ofis',
            'kafe': 'Kafe',
            'diger': 'Diğer'
        };
        return labels[env] || env;
    },

    // Get fatigue label
    getFatigueLabel(level) {
        const labels = {
            1: '😊 Enerjik',
            2: '🙂 İyi',
            3: '😐 Normal',
            4: '😓 Yorgun',
            5: '😴 Bitkin'
        };
        return labels[level] || level;
    },

    // Calculate statistics
    calculateStats(data) {
        if (data.length === 0) {
            return { total: 0, avgWpm: 0, bestWpm: 0, avgErrors: 0 };
        }

        const total = data.length;
        const avgWpm = Math.round(data.reduce((sum, d) => sum + d.wpm, 0) / total);
        const bestWpm = Math.max(...data.map(d => d.wpm));
        const avgErrors = Math.round(data.reduce((sum, d) => sum + d.errors, 0) / total * 10) / 10;

        return { total, avgWpm, bestWpm, avgErrors };
    }
};

// ===================================
// DATA ENTRY PAGE (index.html)
// ===================================
function initDataEntryPage() {
    const form = document.getElementById('dataEntryForm');
    if (!form) return;

    // Set default date to today
    const dateInput = document.getElementById('testDate');
    dateInput.valueAsDate = new Date();

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const newEntry = {
            id: Utils.generateId(),
            date: document.getElementById('testDate').value,
            wpm: parseInt(document.getElementById('wpm').value),
            errors: parseInt(document.getElementById('errors').value),
            fatigue: parseInt(document.querySelector('input[name="fatigue"]:checked').value),
            keyboardType: document.getElementById('keyboardType').value,
            environment: document.getElementById('environment').value,
            notes: document.getElementById('notes').value,
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        const data = Utils.getData();
        data.push(newEntry);
        Utils.saveData(data);

        // Show success toast
        const toast = new bootstrap.Toast(document.getElementById('successToast'));
        toast.show();

        // Reset form
        form.reset();
        dateInput.valueAsDate = new Date();

        // Update quick stats
        updateQuickStats();
    });

    // Update quick stats on load
    updateQuickStats();
}

function updateQuickStats() {
    const data = Utils.getData();
    const stats = Utils.calculateStats(data);

    const totalEl = document.getElementById('totalTests');
    const avgEl = document.getElementById('avgWpm');
    const bestEl = document.getElementById('bestWpm');

    if (totalEl) totalEl.textContent = stats.total;
    if (avgEl) avgEl.textContent = stats.avgWpm;
    if (bestEl) bestEl.textContent = stats.bestWpm;
}

// ===================================
// HISTORY PAGE (history.html)
// ===================================
function initHistoryPage() {
    const tableBody = document.getElementById('historyTableBody');
    if (!tableBody) return;

    let deleteTargetId = null;

    // Render table
    function renderTable(data) {
        const emptyState = document.getElementById('emptyState');
        const table = document.getElementById('historyTable');

        if (data.length === 0) {
            emptyState.style.display = 'block';
            table.style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        table.style.display = 'table';

        // Sort by date descending
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        tableBody.innerHTML = data.map(entry => `
            <tr data-id="${entry.id}">
                <td>
                    <strong>${Utils.formatDateShort(entry.date)}</strong>
                </td>
                <td>
                    <span class="badge badge-wpm">${entry.wpm} WPM</span>
                </td>
                <td>
                    <span class="badge badge-error">${entry.errors} hata</span>
                </td>
                <td>
                    <span class="badge badge-fatigue badge-fatigue-${entry.fatigue}">
                        ${Utils.getFatigueLabel(entry.fatigue)}
                    </span>
                </td>
                <td>${Utils.getKeyboardLabel(entry.keyboardType)}</td>
                <td>${Utils.getEnvironmentLabel(entry.environment)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary edit-btn me-1" data-id="${entry.id}" title="Düzenle">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${entry.id}" title="Sil">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Update stats
        updateHistoryStats(data);
    }

    function updateHistoryStats(data) {
        const stats = Utils.calculateStats(data);
        
        document.getElementById('statTotal').textContent = stats.total;
        document.getElementById('statAvgWpm').textContent = stats.avgWpm;
        document.getElementById('statBestWpm').textContent = stats.bestWpm;
        document.getElementById('statAvgErrors').textContent = stats.avgErrors;
    }

    // Initial render
    renderTable(Utils.getData());

    // Search & Filter
    const searchInput = document.getElementById('searchInput');
    const filterKeyboard = document.getElementById('filterKeyboard');
    const filterEnvironment = document.getElementById('filterEnvironment');

    function applyFilters() {
        let data = Utils.getData();
        const search = searchInput.value.toLowerCase();
        const keyboard = filterKeyboard.value;
        const environment = filterEnvironment.value;

        if (search) {
            data = data.filter(d => 
                d.date.includes(search) ||
                d.wpm.toString().includes(search) ||
                d.notes?.toLowerCase().includes(search)
            );
        }

        if (keyboard) {
            data = data.filter(d => d.keyboardType === keyboard);
        }

        if (environment) {
            data = data.filter(d => d.environment === environment);
        }

        renderTable(data);
    }

    searchInput?.addEventListener('input', applyFilters);
    filterKeyboard?.addEventListener('change', applyFilters);
    filterEnvironment?.addEventListener('change', applyFilters);

    // Delete single entry
    tableBody.addEventListener('click', function(e) {
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            deleteTargetId = deleteBtn.dataset.id;
            document.getElementById('deleteModalText').textContent = 'Bu kaydı silmek istediğinizden emin misiniz?';
            const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
            modal.show();
        }

        // Edit entry
        const editBtn = e.target.closest('.edit-btn');
        if (editBtn) {
            const entryId = editBtn.dataset.id;
            const data = Utils.getData();
            const entry = data.find(d => d.id === entryId);
            
            if (entry) {
                // Fill form with existing data
                document.getElementById('editId').value = entry.id;
                document.getElementById('editDate').value = entry.date;
                document.getElementById('editWpm').value = entry.wpm;
                document.getElementById('editErrors').value = entry.errors;
                document.getElementById('editKeyboard').value = entry.keyboardType;
                document.getElementById('editEnvironment').value = entry.environment;
                document.getElementById('editNotes').value = entry.notes || '';
                
                // Set fatigue radio
                const fatigueRadio = document.getElementById(`editFatigue${entry.fatigue}`);
                if (fatigueRadio) fatigueRadio.checked = true;
                
                // Show modal
                const modal = new bootstrap.Modal(document.getElementById('editModal'));
                modal.show();
            }
        }
    });

    // Save edited entry
    document.getElementById('confirmEditBtn')?.addEventListener('click', function() {
        const entryId = document.getElementById('editId').value;
        const data = Utils.getData();
        const entryIndex = data.findIndex(d => d.id === entryId);
        
        if (entryIndex !== -1) {
            // Update entry
            data[entryIndex] = {
                ...data[entryIndex],
                date: document.getElementById('editDate').value,
                wpm: parseInt(document.getElementById('editWpm').value),
                errors: parseInt(document.getElementById('editErrors').value),
                fatigue: parseInt(document.querySelector('input[name="editFatigue"]:checked')?.value || 3),
                keyboardType: document.getElementById('editKeyboard').value,
                environment: document.getElementById('editEnvironment').value,
                notes: document.getElementById('editNotes').value,
                updatedAt: new Date().toISOString()
            };
            
            Utils.saveData(data);
            bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
            renderTable(Utils.getData());
        }
    });

    // Clear all
    document.getElementById('clearAllBtn')?.addEventListener('click', function() {
        deleteTargetId = 'all';
        document.getElementById('deleteModalText').textContent = 'TÜM kayıtları silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!';
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    });

    // Confirm delete
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', function() {
        if (deleteTargetId === 'all') {
            Utils.saveData([]);
        } else {
            const data = Utils.getData().filter(d => d.id !== deleteTargetId);
            Utils.saveData(data);
        }
        
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        renderTable(Utils.getData());
    });
}

// ===================================
// DASHBOARD PAGE (dashboard.html)
// ===================================
function initDashboardPage() {
    const wpmChartCanvas = document.getElementById('wpmLineChart');
    if (!wpmChartCanvas) return;

    const data = Utils.getData();
    
    // Update summary cards
    updateDashboardStats(data);
    
    // Create charts
    if (data.length > 0) {
        createWpmLineChart(data);
        createFatigueErrorsChart(data);
        createKeyboardChart(data);
        createEnvironmentChart(data);
        generateInsights(data);
    } else {
        document.getElementById('noInsights').style.display = 'block';
    }
}

function updateDashboardStats(data) {
    const stats = Utils.calculateStats(data);
    
    document.getElementById('dashTotalTests').textContent = stats.total;
    document.getElementById('dashAvgWpm').textContent = stats.avgWpm;
    document.getElementById('dashBestWpm').textContent = stats.bestWpm;
    document.getElementById('dashAvgErrors').textContent = stats.avgErrors;
}

function createWpmLineChart(data) {
    // Sort by date
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const ctx = document.getElementById('wpmLineChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedData.map(d => Utils.formatDateShort(d.date)),
            datasets: [{
                label: 'WPM',
                data: sortedData.map(d => d.wpm),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(99, 102, 241, 0.1)'
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(99, 102, 241, 0.1)'
                    },
                    ticks: {
                        color: '#64748b'
                    },
                    beginAtZero: false
                }
            }
        }
    });
}

function createFatigueErrorsChart(data) {
    // Group by fatigue level
    const fatigueGroups = {};
    for (let i = 1; i <= 5; i++) {
        fatigueGroups[i] = { errors: [], count: 0 };
    }
    
    data.forEach(d => {
        fatigueGroups[d.fatigue].errors.push(d.errors);
        fatigueGroups[d.fatigue].count++;
    });
    
    const avgErrors = Object.keys(fatigueGroups).map(level => {
        const group = fatigueGroups[level];
        return group.count > 0 ? Math.round(group.errors.reduce((a, b) => a + b, 0) / group.count * 10) / 10 : 0;
    });

    const ctx = document.getElementById('fatigueErrorsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1-Enerjik', '2-İyi', '3-Normal', '4-Yorgun', '5-Bitkin'],
            datasets: [{
                label: 'Ortalama Hata',
                data: avgErrors,
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            size: 10
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(99, 102, 241, 0.1)'
                    },
                    ticks: {
                        color: '#64748b'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function createKeyboardChart(data) {
    // Group by keyboard type
    const keyboardGroups = {};
    data.forEach(d => {
        if (!keyboardGroups[d.keyboardType]) {
            keyboardGroups[d.keyboardType] = { wpm: [], count: 0 };
        }
        keyboardGroups[d.keyboardType].wpm.push(d.wpm);
        keyboardGroups[d.keyboardType].count++;
    });

    const labels = Object.keys(keyboardGroups).map(k => Utils.getKeyboardLabel(k));
    const avgWpms = Object.values(keyboardGroups).map(g => 
        Math.round(g.wpm.reduce((a, b) => a + b, 0) / g.count)
    );

    const ctx = document.getElementById('keyboardChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: avgWpms,
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#94a3b8',
                    callbacks: {
                        label: function(context) {
                            return `Ort. WPM: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });
}

function createEnvironmentChart(data) {
    // Group by environment
    const envGroups = {};
    data.forEach(d => {
        if (!envGroups[d.environment]) {
            envGroups[d.environment] = { wpm: [], count: 0 };
        }
        envGroups[d.environment].wpm.push(d.wpm);
        envGroups[d.environment].count++;
    });

    const labels = Object.keys(envGroups).map(e => Utils.getEnvironmentLabel(e));
    const avgWpms = Object.values(envGroups).map(g => 
        Math.round(g.wpm.reduce((a, b) => a + b, 0) / g.count)
    );

    const ctx = document.getElementById('environmentChart').getContext('2d');
    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                data: avgWpms,
                backgroundColor: [
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(139, 92, 246, 0.7)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#94a3b8',
                    callbacks: {
                        label: function(context) {
                            return `Ort. WPM: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: 'rgba(99, 102, 241, 0.1)'
                    },
                    ticks: {
                        display: false
                    }
                }
            }
        }
    });
}

function generateInsights(data) {
    const container = document.getElementById('insightsContainer');
    const noInsights = document.getElementById('noInsights');
    
    if (data.length < 2) {
        noInsights.style.display = 'block';
        container.innerHTML = '';
        return;
    }

    noInsights.style.display = 'none';
    const insights = [];
    const stats = Utils.calculateStats(data);

    // Sort by date
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Trend analysis
    if (sortedData.length >= 3) {
        const recentData = sortedData.slice(-3);
        const recentAvg = Math.round(recentData.reduce((sum, d) => sum + d.wpm, 0) / 3);
        const overallAvg = stats.avgWpm;
        
        if (recentAvg > overallAvg) {
            insights.push({
                type: 'positive',
                icon: 'bi-graph-up-arrow',
                text: `Harika! Son 3 testinizin ortalaması (${recentAvg} WPM), genel ortalamanızın (${overallAvg} WPM) üzerinde. İlerleme kaydediyorsunuz!`
            });
        } else if (recentAvg < overallAvg - 5) {
            insights.push({
                type: 'negative',
                icon: 'bi-graph-down-arrow',
                text: `Son 3 testinizin ortalaması (${recentAvg} WPM), genel ortalamanızın (${overallAvg} WPM) altında. Dinlenmeyi deneyebilirsiniz.`
            });
        }
    }

    // Fatigue correlation
    const fatigueGroups = {};
    data.forEach(d => {
        if (!fatigueGroups[d.fatigue]) fatigueGroups[d.fatigue] = { wpm: [], errors: [] };
        fatigueGroups[d.fatigue].wpm.push(d.wpm);
        fatigueGroups[d.fatigue].errors.push(d.errors);
    });

    const lowFatigueWpm = fatigueGroups[1] || fatigueGroups[2];
    const highFatigueWpm = fatigueGroups[4] || fatigueGroups[5];

    if (lowFatigueWpm && highFatigueWpm) {
        const lowAvg = Math.round(lowFatigueWpm.wpm.reduce((a, b) => a + b, 0) / lowFatigueWpm.wpm.length);
        const highAvg = Math.round(highFatigueWpm.wpm.reduce((a, b) => a + b, 0) / highFatigueWpm.wpm.length);
        
        if (lowAvg > highAvg + 5) {
            insights.push({
                type: 'neutral',
                icon: 'bi-battery-charging',
                text: `Enerjik olduğunuzda (${lowAvg} WPM) yorgun olduğunuzdan (${highAvg} WPM) daha hızlı yazıyorsunuz. Dinlenmiş olarak pratik yapmanız önerilir.`
            });
        }
    }

    // Best keyboard
    const keyboardGroups = {};
    data.forEach(d => {
        if (!keyboardGroups[d.keyboardType]) keyboardGroups[d.keyboardType] = [];
        keyboardGroups[d.keyboardType].push(d.wpm);
    });

    let bestKeyboard = null;
    let bestKeyboardAvg = 0;

    Object.entries(keyboardGroups).forEach(([type, wpms]) => {
        const avg = wpms.reduce((a, b) => a + b, 0) / wpms.length;
        if (avg > bestKeyboardAvg) {
            bestKeyboardAvg = Math.round(avg);
            bestKeyboard = type;
        }
    });

    if (bestKeyboard && Object.keys(keyboardGroups).length > 1) {
        insights.push({
            type: 'positive',
            icon: 'bi-keyboard',
            text: `En yüksek performansı "${Utils.getKeyboardLabel(bestKeyboard)}" klavyeyle gösteriyorsunuz (Ort. ${bestKeyboardAvg} WPM).`
        });
    }

    // Best environment
    const envGroups = {};
    data.forEach(d => {
        if (!envGroups[d.environment]) envGroups[d.environment] = [];
        envGroups[d.environment].push(d.wpm);
    });

    let bestEnv = null;
    let bestEnvAvg = 0;

    Object.entries(envGroups).forEach(([env, wpms]) => {
        const avg = wpms.reduce((a, b) => a + b, 0) / wpms.length;
        if (avg > bestEnvAvg) {
            bestEnvAvg = Math.round(avg);
            bestEnv = env;
        }
    });

    if (bestEnv && Object.keys(envGroups).length > 1) {
        insights.push({
            type: 'positive',
            icon: 'bi-geo-alt',
            text: `"${Utils.getEnvironmentLabel(bestEnv)}" ortamında en iyi performansı sergiliyorsunuz (Ort. ${bestEnvAvg} WPM).`
        });
    }

    // Best WPM achievement
    const bestEntry = data.reduce((best, current) => current.wpm > best.wpm ? current : best);
    insights.push({
        type: 'positive',
        icon: 'bi-trophy',
        text: `En yüksek hızınız: ${bestEntry.wpm} WPM (${Utils.formatDate(bestEntry.date)} tarihinde).`
    });

    // Render insights
    container.innerHTML = insights.map(insight => `
        <div class="col-md-6 mb-3">
            <div class="insight-item ${insight.type}">
                <i class="bi ${insight.icon}"></i>
                ${insight.text}
            </div>
        </div>
    `).join('');
}

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize based on current page
    const path = window.location.pathname;
    
    if (path.includes('history.html')) {
        initHistoryPage();
    } else if (path.includes('dashboard.html')) {
        initDashboardPage();
    } else {
        initDataEntryPage();
    }
});

