// Global variables
let currentShowroom = 'hyundai-jerusalem';
let currentMonth = '2026-01';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOMContentLoaded - Initializing...');
    
    // Only initialize if we're in index.html (has showroom sections)
    const hasShowrooms = document.querySelector('.showroom-section') !== null;
    if (!hasShowrooms) {
        console.log('⚠️ Not in index.html - skipping full initialization');
        return;
    }
    
    initializeNavigation();
    
    // Initialize all showrooms
    initializeHyundaiJerusalem();
    initializeShowroom('hyundai-modiin');
    initializeShowroom('mitsubishi-modiin');
    initializeShowroom('omoda-modiin');
    initializeShowroom('kalmobil-modiin');
    initializeGeelyShowroom('geely-modiin');
    initializeGeelyShowroom('geely-jerusalem');
    
    loadCurrentMonthData();
    console.log('✓ Initialization complete!');
});

// Initialize main navigation (showrooms)
function initializeNavigation() {
    const mainTabButtons = document.querySelectorAll('.main-tab-button');
    
    if (mainTabButtons.length === 0) {
        console.warn('⚠️ No main-tab-button elements found - skipping navigation init');
        return;
    }
    
    mainTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const showroomId = this.getAttribute('data-showroom');
            switchShowroom(showroomId);
        });
    });
}

// Switch between showrooms
function switchShowroom(showroomId) {
    currentShowroom = showroomId;
    currentMonth = '2026-01'; // Reset to first month when switching showrooms
    
    // Update main tabs
    document.querySelectorAll('.main-tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-showroom="${showroomId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Update showroom sections
    document.querySelectorAll('.showroom-section').forEach(section => {
        section.classList.remove('active');
    });
    const targetShowroom = document.getElementById(showroomId);
    if (targetShowroom) {
        targetShowroom.classList.add('active');
        
        // Show first month content
        showMonthContent('2026-01');
        
        // Update month tabs to show first month as active
        const monthTabs = targetShowroom.querySelectorAll('.month-tab-button');
        monthTabs.forEach(tab => {
            if (tab.getAttribute('data-month') === '2026-01') {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
    
    // Load data for current month
    loadCurrentMonthData();
}

// Generic function to initialize any showroom
function initializeShowroom(showroomId) {
    console.log(`🏢 Initializing showroom: ${showroomId}`);
    
    const config = window.getShowroomConfig(showroomId);
    if (!config) {
        console.error(`❌ No config found for showroom: ${showroomId}`);
        return;
    }
    
    const showroomSection = document.getElementById(showroomId);
    if (!showroomSection) {
        console.error(`❌ No section found for showroom: ${showroomId}`);
        return;
    }
    
    const monthContentWrapper = showroomSection.querySelector('.month-content-wrapper');
    if (!monthContentWrapper) {
        console.error(`❌ No month-content-wrapper found in ${showroomId}`);
        return;
    }
    
    // Create month content for all months
    const months = [
        '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
        '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'
    ];
    
    months.forEach(month => {
        const monthContent = createGenericMonthContent(showroomId, month, config);
        monthContentWrapper.appendChild(monthContent);
        
        // Add real-time calculation event listeners
        addRealtimeCalculation(monthContent, month);
        console.log(`✓ Event listeners added for ${showroomId}, month: ${month}`);
    });
    
    // Create yearly summary
    const yearlySummary = createGenericYearlySummary(showroomId, config);
    monthContentWrapper.appendChild(yearlySummary);
    
    // Initialize month navigation
    initializeMonthNavigation(showroomSection);
    
    // Show first month by default
    showMonthContent('2026-01');
    
    console.log(`✅ Showroom ${showroomId} initialized successfully`);
}

// Initialize Geely showroom with special layout
function initializeGeelyShowroom(showroomId) {
    try {
        console.log(`🏢 Initializing Geely showroom: ${showroomId}`);
        
        const config = window.getShowroomConfig(showroomId);
        if (!config) {
            console.error(`❌ No config found for showroom: ${showroomId}`);
            return;
        }
        
        const showroomSection = document.getElementById(showroomId);
        if (!showroomSection) {
            console.error(`❌ No section found for showroom: ${showroomId}`);
            return;
        }
        
        const monthContentWrapper = showroomSection.querySelector('.month-content-wrapper');
        if (!monthContentWrapper) {
            console.error(`❌ No month-content-wrapper found in ${showroomId}`);
            return;
        }
        
        // Create month content for all months using Geely layout
        const months = [
            '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
            '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'
        ];
        
        months.forEach(month => {
            const monthContent = createGeelyMonthContent(showroomId, month, config);
            monthContentWrapper.appendChild(monthContent);
            
            // Add real-time calculation event listeners for Geely
            addGeelyRealtimeCalculation(monthContent, showroomId, month);
            console.log(`✓ Geely month content created for: ${month}`);
        });
        
        // Initialize month navigation
        initializeMonthNavigation(showroomSection);
    
        // Show first month by default
        showMonthContent('2026-01');
        
        console.log(`✅ Geely showroom ${showroomId} initialized successfully`);
    } catch (error) {
        console.error(`❌ Error initializing Geely showroom ${showroomId}:`, error);
    }
}

// Create Geely month content
function createGeelyMonthContent(showroomId, month, config) {
    const monthDiv = document.createElement('div');
    monthDiv.className = 'month-content';
    monthDiv.setAttribute('data-month-content', month);
    monthDiv.style.display = 'none';
    
    // Use the special Geely layout generator
    monthDiv.innerHTML = window.createGeelyMonthLayout(showroomId, month);
    
    return monthDiv;
}

// Add real-time calculation for Geely inputs
function addGeelyRealtimeCalculation(monthContent, showroomId, month) {
    // Get all Geely inputs (both manager and salesperson)
    const managerInputs = monthContent.querySelectorAll('.geely-input');
    const salespersonInputs = monthContent.querySelectorAll('.geely-input-mini');
    
    const totalInputs = managerInputs.length + salespersonInputs.length;
    console.log(`Adding event listeners to ${totalInputs} Geely inputs for month: ${month} (${managerInputs.length} manager + ${salespersonInputs.length} salespeople)`);
    
    // Add listeners to manager inputs
    managerInputs.forEach(input => {
        input.addEventListener('input', function() {
            window.calculateGeelyMonth(showroomId, month);
        });
    });
    
    // Add listeners to salesperson inputs
    salespersonInputs.forEach(input => {
        input.addEventListener('input', function() {
            window.calculateGeelyMonth(showroomId, month);
        });
    });
    
    console.log(`✓ Event listeners added for Geely ${showroomId}, month: ${month}`);
}

// Initialize Hyundai Jerusalem with month tabs (backward compatibility)
function initializeHyundaiJerusalem() {
    const showroomSection = document.getElementById('hyundai-jerusalem');
    const monthContentWrapper = showroomSection.querySelector('.month-content-wrapper');
    
    // Create month content for all months
    const months = [
        '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
        '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'
    ];
    
    months.forEach(month => {
        const monthContent = createMonthContent(month);
        monthContentWrapper.appendChild(monthContent);
        
        // Add real-time calculation event listeners
        addRealtimeCalculation(monthContent, month);
        console.log('✓ Event listeners added for month:', month);
    });
    
    // Create yearly summary
    const yearlySummary = createYearlySummary();
    monthContentWrapper.appendChild(yearlySummary);
    
    // Initialize month navigation
    initializeMonthNavigation(showroomSection);
    
    // Show first month by default
    showMonthContent('2026-01');
}

// Initialize month navigation
function initializeMonthNavigation(showroomSection) {
    const monthTabButtons = showroomSection.querySelectorAll('.month-tab-button');
    
    monthTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const month = this.getAttribute('data-month');
            switchMonth(month, showroomSection);
        });
    });
}

// Switch between months
function switchMonth(month, showroomSection) {
    currentMonth = month;
    
    if (!showroomSection) {
        console.warn('⚠️ No showroom section provided');
        return;
    }
    
    // Update month tabs
    showroomSection.querySelectorAll('.month-tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = showroomSection.querySelector(`[data-month="${month}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Show corresponding month content
    showMonthContent(month);
    
    // Load data for this month
    if (month !== 'yearly') {
        loadCurrentMonthData();
    } else {
        displayYearlySummary();
    }
}

// Show month content
function showMonthContent(month) {
    const showroomSection = document.getElementById(currentShowroom);
    if (!showroomSection) {
        console.warn('⚠️ Showroom section not found:', currentShowroom);
        return;
    }
    const monthContents = showroomSection.querySelectorAll('.month-content');
    
    // Hide all month contents
    monthContents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    
    // Show the selected month
    const targetContent = showroomSection.querySelector(`[data-month-content="${month}"]`);
    if (targetContent) {
        targetContent.classList.add('active');
        targetContent.style.display = 'block';
    } else {
        console.warn(`⚠️ Month content not found for: ${month}`);
    }
}

// Create month content HTML
function createMonthContent(month) {
    const monthDiv = document.createElement('div');
    monthDiv.className = 'month-content';
    monthDiv.setAttribute('data-month-content', month);
    
    // Use the new layout generator
    monthDiv.innerHTML = createNewMonthLayout(month);
    
    /* OLD LAYOUT:
    monthDiv.innerHTML = `
        <!-- יעדי הסניף -->
        <div class="targets-section">
            <h3>📌 יעדי הסניף לחודש</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>יעד סניף (מסירות רכב)</label>
                    <input type="number" id="hj-${month}-branch-target" class="input-field" placeholder="הזן יעד סניף">
                </div>
                <div class="form-group">
                    <label>סה"כ מסירות בפועל</label>
                    <input type="number" id="hj-${month}-total-cars" class="input-field" readonly style="background: #e9ecef; font-weight: 700; font-size: 1.1rem; color: #667eea;" value="0">
                </div>
                <div class="form-group" style="display: flex; align-items: center; justify-content: center;">
                    <div id="hj-${month}-target-status" style="font-size: 1.2rem; font-weight: 700; padding: 15px; border-radius: 10px; text-align: center; min-width: 200px;">
                        ⏳ ממתין לנתונים
                    </div>
                </div>
            </div>
        </div>

        <!-- אזור הזנת נתונים -->
        <div class="data-input-section">
            <h3>📝 הזנת נתונים כמותיים</h3>
            
            <table class="data-input-table">
                <thead>
                    <tr>
                        <th>עובד</th>
                        <th>יעד אישי</th>
                        <th>מסירות</th>
                        <th>ביטוח</th>
                        <th>טופ סרוויס</th>
                        <th>פוטנציאל טופ</th>
                        <th>אחריות</th>
                        <th>לקוח סמוי</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="manager-row">
                        <td class="employee-name">👔 מאיר מועלם</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr class="salesperson-row">
                        <td class="employee-name">💼 דניאל נגר</td>
                        <td><input type="number" id="hj-${month}-daniel-target" class="compact-input" placeholder="0"></td>
                        <td><input type="number" id="hj-${month}-daniel-cars" class="compact-input" placeholder="0"></td>
                        <td><input type="number" id="hj-${month}-daniel-insurance" class="compact-input" placeholder="0"></td>
                        <td><input type="number" id="hj-${month}-daniel-topservice" class="compact-input" placeholder="0"></td>
                        <td><input type="number" id="hj-${month}-daniel-topservice-potential" class="compact-input" placeholder="0"></td>
                        <td><input type="number" id="hj-${month}-daniel-warranty" class="compact-input" placeholder="0"></td>
                        <td><input type="number" id="hj-${month}-daniel-mystery" class="compact-input" min="0" max="100" placeholder="0-100"></td>
                    </tr>
                    <tr class="salesperson-row">
                        <td class="employee-name">💼 אלפרד בנד</td>
                        <td><input type="number" id="hj-${month}-alfred-target" class="compact-input" placeholder="0"></td>
                        <td><input type="number" id="hj-${month}-alfred-cars" class="compact-input" placeholder="0"></td>
                        <td><input type="number" id="hj-${month}-alfred-insurance" class="compact-input" placeholder="0"></td>
                        <td><input type="number" id="hj-${month}-alfred-topservice" class="compact-input" placeholder="0"></td>
                        <td><input type="number" id="hj-${month}-alfred-topservice-potential" class="compact-input" placeholder="0"></td>
                        <td><input type="number" id="hj-${month}-alfred-warranty" class="compact-input" placeholder="0"></td>
                        <td><input type="number" id="hj-${month}-alfred-mystery" class="compact-input" min="0" max="100" placeholder="0-100"></td>
                    </tr>
                    <tr class="operations-row">
                        <td class="employee-name">⚙️ דניאל אליה</td>
                        <td>-</td>
                        <td>-</td>
                        <td><input type="number" id="hj-${month}-daniel-e-insurance" class="compact-input" placeholder="0"></td>
                        <td colspan="4">-</td>
                    </tr>
                </tbody>
            </table>

            <h4 style="margin-top: 30px;">💰 עמלות ידניות ומיוחדות</h4>
            <div class="manual-commissions-grid">
                <div class="manual-card manager-card">
                    <h5>👔 מאיר מועלם</h5>
                    <div class="manual-inputs">
                        <div class="input-pair">
                            <label>רכבי הדגמה</label>
                            <input type="number" id="hj-${month}-meir-demo" class="compact-input" placeholder="0">
                        </div>
                        <div class="input-pair">
                            <label>הפרשי עמלות</label>
                            <input type="number" id="hj-${month}-meir-diff" class="compact-input" placeholder="0">
                        </div>
                        <div class="input-pair">
                            <label>מימון</label>
                            <input type="number" id="hj-${month}-meir-finance" class="compact-input" placeholder="0">
                        </div>
                        <div class="input-pair">
                            <label>טרייד אין</label>
                            <input type="number" id="hj-${month}-meir-tradein" class="compact-input" placeholder="0">
                        </div>
                    </div>
                </div>

                <div class="manual-card salesperson-card">
                    <h5>💼 דניאל נגר</h5>
                    <div class="manual-inputs">
                        <div class="input-pair">
                            <label>רכבי הדגמה</label>
                            <input type="number" id="hj-${month}-daniel-demo" class="compact-input" placeholder="0">
                        </div>
                        <div class="input-pair">
                            <label>הפרשי עמלות</label>
                            <input type="number" id="hj-${month}-daniel-diff" class="compact-input" placeholder="0">
                        </div>
                        <div class="input-pair">
                            <label>מימון</label>
                            <input type="number" id="hj-${month}-daniel-finance" class="compact-input" placeholder="0">
                        </div>
                        <div class="input-pair">
                            <label>טרייד אין</label>
                            <input type="number" id="hj-${month}-daniel-tradein" class="compact-input" placeholder="0">
                        </div>
                    </div>
                </div>

                <div class="manual-card salesperson-card">
                    <h5>💼 אלפרד בנד</h5>
                    <div class="manual-inputs">
                        <div class="input-pair">
                            <label>רכבי הדגמה</label>
                            <input type="number" id="hj-${month}-alfred-demo" class="compact-input" placeholder="0">
                        </div>
                        <div class="input-pair">
                            <label>הפרשי עמלות</label>
                            <input type="number" id="hj-${month}-alfred-diff" class="compact-input" placeholder="0">
                        </div>
                        <div class="input-pair">
                            <label>מימון</label>
                            <input type="number" id="hj-${month}-alfred-finance" class="compact-input" placeholder="0">
                        </div>
                        <div class="input-pair">
                            <label>טרייד אין</label>
                            <input type="number" id="hj-${month}-alfred-tradein" class="compact-input" placeholder="0">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- מאיר מועלם - מנהל אולם -->
        <div class="employee-section manager">
            <h3>👔 מאיר מועלם - מנהל אולם</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>עמלות רכבי הדגמה (ידני)</label>
                    <input type="number" id="hj-${month}-meir-demo" class="input-field" placeholder="0">
                </div>
                <div class="form-group">
                    <label>הפרשי עמלות (השלמות)</label>
                    <input type="number" id="hj-${month}-meir-diff" class="input-field" placeholder="0">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>עמלות כלמוביל מימון (ידני)</label>
                    <input type="number" id="hj-${month}-meir-finance" class="input-field" placeholder="0">
                </div>
                <div class="form-group">
                    <label>עמלות כלמוביל טרייד אין (ידני)</label>
                    <input type="number" id="hj-${month}-meir-tradein" class="input-field" placeholder="0">
                </div>
            </div>
            <div class="results-box">
                <h4>תוצאות עמלות - מאיר מועלם</h4>
                <div class="result-item">
                    <span>עמלות מסירות רכבים (200 ש"ח × כמות)</span>
                    <span id="hj-${month}-meir-base-commission" class="amount">₪0</span>
                </div>
                <div class="result-item">
                    <span>עמלות רכבי הדגמה</span>
                    <span id="hj-${month}-meir-demo-display" class="amount">₪0</span>
                </div>
                <div class="result-item">
                    <span>הפרשי עמלות (השלמות)</span>
                    <span id="hj-${month}-meir-diff-display" class="amount">₪0</span>
                </div>
                <hr style="margin: 15px 0; border: none; border-top: 2px solid #e0e0e0;">
                <div class="result-item component-vehicles">
                    <span>🚗 סה"כ רכיב רכבים</span>
                    <span id="hj-${month}-meir-vehicles" class="amount">₪0</span>
                </div>
                <div class="result-item component-tradein">
                    <span>🔄 רכיב טרייד אין</span>
                    <span id="hj-${month}-meir-tradein-display" class="amount">₪0</span>
                </div>
                <div class="result-item component-finance">
                    <span>💰 רכיב מימון</span>
                    <span id="hj-${month}-meir-finance-display" class="amount">₪0</span>
                </div>
                <div class="result-item total">
                    <span>סה"כ עמלות</span>
                    <span id="hj-${month}-meir-total" class="amount">₪0</span>
                </div>
            </div>
        </div>

        <!-- אזור תוצאות - 4 עמודות -->
        <div class="results-section">
            <h3>💵 תוצאות עמלות</h3>
            
            <div class="results-columns">
                <!-- מאיר מועלם -->
                <div class="result-column manager-column">
                    <h4>👔 מאיר מועלם</h4>
                    <div class="result-details">
                        <div class="detail-row">
                            <span>עמלות מסירות</span>
                            <span id="hj-${month}-meir-base-commission" class="amount">₪0</span>
                        </div>
                        <div class="detail-row">
                            <span>רכבי הדגמה</span>
                            <span id="hj-${month}-meir-demo-display" class="amount">₪0</span>
                        </div>
                        <div class="detail-row">
                            <span>הפרשי עמלות</span>
                            <span id="hj-${month}-meir-diff-display" class="amount">₪0</span>
                        </div>
                        <hr class="separator">
                        <div class="detail-row component">
                            <span>🚗 רכיב רכבים</span>
                            <span id="hj-${month}-meir-vehicles" class="amount">₪0</span>
                        </div>
                        <div class="detail-row component">
                            <span>🔄 טרייד אין</span>
                            <span id="hj-${month}-meir-tradein-display" class="amount">₪0</span>
                        </div>
                        <div class="detail-row component">
                            <span>💰 מימון</span>
                            <span id="hj-${month}-meir-finance-display" class="amount">₪0</span>
                        </div>
                        <div class="detail-row total-row">
                            <span>סה"כ</span>
                            <span id="hj-${month}-meir-total" class="amount">₪0</span>
                        </div>
                    </div>
                </div>

                <!-- דניאל נגר -->
                <div class="result-column salesperson-column">
                    <h4>💼 דניאל נגר</h4>
                    <div class="result-details">
                        <div class="detail-row">
                            <span>עמלות מסירות</span>
                            <span id="hj-${month}-daniel-base-commission" class="amount">₪0</span>
                        </div>
                        <div class="detail-row">
                            <span>ביטוח</span>
                            <span id="hj-${month}-daniel-insurance-commission" class="amount">₪0</span>
                        </div>
                        <div class="detail-row">
                            <span>טופ סרוויס</span>
                            <span id="hj-${month}-daniel-topservice-commission" class="amount">₪0</span>
                        </div>
                        <div class="detail-row">
                            <span>אחריות</span>
                            <span id="hj-${month}-daniel-warranty-commission" class="amount">₪0</span>
                        </div>
                        <div class="detail-row">
                            <span>לקוח סמוי</span>
                            <span id="hj-${month}-daniel-mystery-adjustment" class="amount">₪0</span>
                        </div>
                        <div class="detail-row">
                            <span>הדגמה</span>
                            <span id="hj-${month}-daniel-demo-display" class="amount">₪0</span>
                        </div>
                        <div class="detail-row">
                            <span>הפרשים</span>
                            <span id="hj-${month}-daniel-diff-display" class="amount">₪0</span>
                        </div>
                        <hr class="separator">
                        <div class="detail-row component">
                            <span>🚗 רכיב רכבים</span>
                            <span id="hj-${month}-daniel-vehicles" class="amount">₪0</span>
                        </div>
                        <div class="detail-row component">
                            <span>🔄 טרייד אין</span>
                            <span id="hj-${month}-daniel-tradein-display" class="amount">₪0</span>
                        </div>
                        <div class="detail-row component">
                            <span>💰 מימון</span>
                            <span id="hj-${month}-daniel-finance-display" class="amount">₪0</span>
                        </div>
                        <div class="detail-row total-row">
                            <span>סה"כ</span>
                            <span id="hj-${month}-daniel-total" class="amount">₪0</span>
                        </div>
                    </div>
                </div>

                <!-- אלפרד בנד -->
                <div class="result-column salesperson-column">
                    <h4>💼 אלפרד בנד</h4>
                    <div class="result-details">
                        <div class="detail-row">
                            <span>עמלות מסירות</span>
                            <span id="hj-${month}-alfred-base-commission" class="amount">₪0</span>
                        </div>
                        <div class="detail-row">
                            <span>ביטוח</span>
                            <span id="hj-${month}-alfred-insurance-commission" class="amount">₪0</span>
                        </div>
                        <div class="detail-row">
                            <span>טופ סרוויס</span>
                            <span id="hj-${month}-alfred-topservice-commission" class="amount">₪0</span>
                        </div>
                        <div class="detail-row">
                            <span>אחריות</span>
                            <span id="hj-${month}-alfred-warranty-commission" class="amount">₪0</span>
                        </div>
                        <div class="detail-row">
                            <span>לקוח סמוי</span>
                            <span id="hj-${month}-alfred-mystery-adjustment" class="amount">₪0</span>
                        </div>
                        <div class="detail-row">
                            <span>הדגמה</span>
                            <span id="hj-${month}-alfred-demo-display" class="amount">₪0</span>
                        </div>
                        <div class="detail-row">
                            <span>הפרשים</span>
                            <span id="hj-${month}-alfred-diff-display" class="amount">₪0</span>
                        </div>
                        <hr class="separator">
                        <div class="detail-row component">
                            <span>🚗 רכיב רכבים</span>
                            <span id="hj-${month}-alfred-vehicles" class="amount">₪0</span>
                        </div>
                        <div class="detail-row component">
                            <span>🔄 טרייד אין</span>
                            <span id="hj-${month}-alfred-tradein-display" class="amount">₪0</span>
                        </div>
                        <div class="detail-row component">
                            <span>💰 מימון</span>
                            <span id="hj-${month}-alfred-finance-display" class="amount">₪0</span>
                        </div>
                        <div class="detail-row total-row">
                            <span>סה"כ</span>
                            <span id="hj-${month}-alfred-total" class="amount">₪0</span>
                        </div>
                    </div>
                </div>

                <!-- דניאל אליה -->
                <div class="result-column operations-column">
                    <h4>⚙️ דניאל אליה</h4>
                    <div class="result-details">
                        <div class="detail-row">
                            <span>טופ סרוויס</span>
                            <span id="hj-${month}-daniel-e-topservice-commission" class="amount">₪0</span>
                        </div>
                        <div class="detail-row">
                            <span>ביטוח</span>
                            <span id="hj-${month}-daniel-e-insurance-commission" class="amount">₪0</span>
                        </div>
                        <hr class="separator">
                        <div class="detail-row component">
                            <span>🚗 רכיב רכבים</span>
                            <span id="hj-${month}-daniel-e-vehicles" class="amount">₪0</span>
                        </div>
                        <div class="detail-row total-row">
                            <span>סה"כ</span>
                            <span id="hj-${month}-daniel-e-total" class="amount">₪0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- טבלת סיכום ביצועי סניף -->
        <div class="branch-summary-section">
            <h3>📊 סיכום ביצועי הסניף</h3>
            <table class="summary-table">
                <thead>
                    <tr>
                        <th>קטגוריה</th>
                        <th>יעד</th>
                        <th>ביצוע</th>
                        <th>אחוז ביצוע</th>
                        <th>סטטוס</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="category-cell">🚗 מסירות רכב</td>
                        <td id="hj-${month}-summary-cars-target" class="target-cell">-</td>
                        <td id="hj-${month}-summary-cars-actual" class="actual-cell">-</td>
                        <td id="hj-${month}-summary-cars-percent" class="percent-cell">-</td>
                        <td id="hj-${month}-summary-cars-status" class="status-cell">⏳</td>
                    </tr>
                    <tr>
                        <td class="category-cell">📦 טופ סרוויס</td>
                        <td id="hj-${month}-summary-topservice-target" class="target-cell">-</td>
                        <td id="hj-${month}-summary-topservice-actual" class="actual-cell">-</td>
                        <td id="hj-${month}-summary-topservice-percent" class="percent-cell">-</td>
                        <td id="hj-${month}-summary-topservice-status" class="status-cell">⏳</td>
                    </tr>
                    <tr>
                        <td class="category-cell">🛡️ ביטוח</td>
                        <td id="hj-${month}-summary-insurance-target" class="target-cell">-</td>
                        <td id="hj-${month}-summary-insurance-actual" class="actual-cell">-</td>
                        <td id="hj-${month}-summary-insurance-percent" class="percent-cell">-</td>
                        <td id="hj-${month}-summary-insurance-status" class="status-cell">⏳</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- כפתורי פעולה -->
        <div class="action-buttons">
            <button class="calculate-btn" onclick="calculateMonth('${month}')">🧮 חשב עמלות</button>
            <button class="save-btn" onclick="saveCurrentMonth('${month}')">💾 שמור נתונים</button>
            <button class="clear-btn" onclick="clearMonthForm('${month}')">🗑️ נקה טופס</button>
        </div>
    `; */  // END OLD LAYOUT COMMENT
    
    // Add real-time calculation - will be set up after page loads
    monthDiv.setAttribute('data-month-id', month);
    
    return monthDiv;
}

// Create salesperson section
function createSalespersonSection(month, employeeId, employeeName) {
    return `
        <div class="employee-section salesperson">
            <h3>💼 ${employeeName} - איש מכירות</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>יעד אישי (מסירות רכב)</label>
                    <input type="number" id="hj-${month}-${employeeId}-target" class="input-field" placeholder="הזן יעד אישי">
                </div>
                <div class="form-group">
                    <label>מסירות רכב חדש</label>
                    <input type="number" id="hj-${month}-${employeeId}-cars" class="input-field" placeholder="0">
                </div>
                <div class="form-group">
                    <label>מכירות ביטוח כלמוביל</label>
                    <input type="number" id="hj-${month}-${employeeId}-insurance" class="input-field" placeholder="0">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>מכירות טופ סרוויס</label>
                    <input type="number" id="hj-${month}-${employeeId}-topservice" class="input-field" placeholder="0">
                </div>
                <div class="form-group">
                    <label>פוטנציאל טופ סרוויס (כמה רכבים אפשריים)</label>
                    <input type="number" id="hj-${month}-${employeeId}-topservice-potential" class="input-field" placeholder="0">
                </div>
                <div class="form-group">
                    <label>הרחבות אחריות</label>
                    <input type="number" id="hj-${month}-${employeeId}-warranty" class="input-field" placeholder="0">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>ציון לקוח סמוי</label>
                    <input type="number" id="hj-${month}-${employeeId}-mystery" class="input-field" min="0" max="100" placeholder="0-100">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>מכירת רכבי הדגמה (ידני)</label>
                    <input type="number" id="hj-${month}-${employeeId}-demo" class="input-field" placeholder="0">
                </div>
                <div class="form-group">
                    <label>הפרשי עמלות (השלמות)</label>
                    <input type="number" id="hj-${month}-${employeeId}-diff" class="input-field" placeholder="0">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>עמלות כלמוביל מימון (ידני)</label>
                    <input type="number" id="hj-${month}-${employeeId}-finance" class="input-field" placeholder="0">
                </div>
                <div class="form-group">
                    <label>עמלות כלמוביל טרייד אין (ידני)</label>
                    <input type="number" id="hj-${month}-${employeeId}-tradein" class="input-field" placeholder="0">
                </div>
            </div>
            <div class="results-box">
                <h4>תוצאות עמלות - ${employeeName}</h4>
                <div class="result-item">
                    <span>עמלות מסירות רכבים (בסיס + בונוסים)</span>
                    <span id="hj-${month}-${employeeId}-base-commission" class="amount">₪0</span>
                </div>
                <div class="result-item">
                    <span>עמלות ביטוח (75 ש"ח × כמות)</span>
                    <span id="hj-${month}-${employeeId}-insurance-commission" class="amount">₪0</span>
                </div>
                <div class="result-item">
                    <span>עמלות טופ סרוויס</span>
                    <span id="hj-${month}-${employeeId}-topservice-commission" class="amount">₪0</span>
                </div>
                <div class="result-item">
                    <span>עמלות הרחבות אחריות (60 ש"ח × כמות)</span>
                    <span id="hj-${month}-${employeeId}-warranty-commission" class="amount">₪0</span>
                </div>
                <div class="result-item">
                    <span>התאמת לקוח סמוי (±20%)</span>
                    <span id="hj-${month}-${employeeId}-mystery-adjustment" class="amount">₪0</span>
                </div>
                <div class="result-item">
                    <span>עמלות רכבי הדגמה</span>
                    <span id="hj-${month}-${employeeId}-demo-display" class="amount">₪0</span>
                </div>
                <div class="result-item">
                    <span>הפרשי עמלות (השלמות)</span>
                    <span id="hj-${month}-${employeeId}-diff-display" class="amount">₪0</span>
                </div>
                <hr style="margin: 15px 0; border: none; border-top: 2px solid #e0e0e0;">
                <div class="result-item component-vehicles">
                    <span>🚗 סה"כ רכיב רכבים</span>
                    <span id="hj-${month}-${employeeId}-vehicles" class="amount">₪0</span>
                </div>
                <div class="result-item component-tradein">
                    <span>🔄 רכיב טרייד אין</span>
                    <span id="hj-${month}-${employeeId}-tradein-display" class="amount">₪0</span>
                </div>
                <div class="result-item component-finance">
                    <span>💰 רכיב מימון</span>
                    <span id="hj-${month}-${employeeId}-finance-display" class="amount">₪0</span>
                </div>
                <div class="result-item total">
                    <span>סה"כ עמלות</span>
                    <span id="hj-${month}-${employeeId}-total" class="amount">₪0</span>
                </div>
            </div>
        </div>
    `;
}

// Create operations section
function createOperationsSection(month) {
    return `
        <div class="employee-section operations">
            <h3>⚙️ דניאל אליה - איש תפעול</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>מכירות ביטוח כלמוביל</label>
                    <input type="number" id="hj-${month}-daniel-e-insurance" class="input-field" placeholder="0">
                </div>
            </div>
            <div class="results-box">
                <h4>תוצאות עמלות - דניאל אליה</h4>
                <div class="result-item">
                    <span>עמלות טופ סרוויס (לפי ביצועי סניף)</span>
                    <span id="hj-${month}-daniel-e-topservice-commission" class="amount">₪0</span>
                </div>
                <div class="result-item">
                    <span>עמלות ביטוח (75 ש"ח × כמות)</span>
                    <span id="hj-${month}-daniel-e-insurance-commission" class="amount">₪0</span>
                </div>
                <hr style="margin: 15px 0; border: none; border-top: 2px solid #e0e0e0;">
                <div class="result-item component-vehicles">
                    <span>🚗 סה"כ רכיב רכבים</span>
                    <span id="hj-${month}-daniel-e-vehicles" class="amount">₪0</span>
                </div>
                <div class="result-item total">
                    <span>סה"כ עמלות</span>
                    <span id="hj-${month}-daniel-e-total" class="amount">₪0</span>
                </div>
            </div>
        </div>
    `;
}

// 🆕 Create generic month content for any showroom
function createGenericMonthContent(showroomId, month, config) {
    const monthDiv = document.createElement('div');
    monthDiv.className = 'month-content';
    monthDiv.setAttribute('data-month-content', month);
    monthDiv.style.display = 'none';
    
    // Use the generic layout generator
    const layoutHTML = window.createGenericMonthLayout ? 
        window.createGenericMonthLayout(showroomId, month) : 
        `<p style="color: red;">שגיאה: פונקציה createGenericMonthLayout לא נמצאה</p>`;
    
    monthDiv.innerHTML = layoutHTML;
    
    return monthDiv;
}

// 🆕 Create generic yearly summary for any showroom
function createGenericYearlySummary(showroomId, config) {
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'month-content';
    summaryDiv.setAttribute('data-month-content', 'yearly');
    summaryDiv.style.display = 'none';
    
    summaryDiv.innerHTML = `
        <div class="yearly-summary-container">
            <h2 style="text-align: center; margin-bottom: 30px; color: #333;">
                📊 סיכום שנתי 2026 - ${config.name}
            </h2>
            <div id="${showroomId}-yearly-summary-content">
                <p style="text-align: center; color: #666; padding: 40px;">
                    ⏳ טוען נתוני סיכום שנתי...
                </p>
            </div>
        </div>
    `;
    
    return summaryDiv;
}

// Create yearly summary section
function createYearlySummary() {
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'month-content';
    summaryDiv.setAttribute('data-month-content', 'yearly');
    
    summaryDiv.innerHTML = `
        <div style="text-align: center; padding: 50px;">
            <h3>📊 סיכום שנתי 2026 - יונדאי אוטולין ירושלים</h3>
            <div id="yearly-summary-content">
                <p>טוען נתונים...</p>
            </div>
        </div>
    `;
    
    return summaryDiv;
}

// Display yearly summary
function displayYearlySummary() {
    console.log('📊 Displaying yearly summary...');
    console.log('Current showroom:', currentShowroom);
    
    // Get showroom config
    const config = window.getShowroomConfig(currentShowroom);
    if (!config) {
        console.error('❌ No config for showroom:', currentShowroom);
        return;
    }
    
    // Get saved data from localStorage
    const allData = getAllData();
    console.log('All data from localStorage:', allData);
    
    const showroomData = allData[currentShowroom] || {};
    console.log(`${currentShowroom} data:`, showroomData);
    
    // Find the summary content element (different ID for each showroom)
    let summaryContent = document.getElementById('yearly-summary-content');
    if (!summaryContent) {
        summaryContent = document.getElementById(`${currentShowroom}-yearly-summary-content`);
    }
    if (!summaryContent) {
        console.error('❌ No summary content element found!');
        return;
    }
    
    if (Object.keys(showroomData).length === 0) {
        summaryContent.innerHTML = `
            <div style="text-align: center; padding: 50px; background: white; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h3 style="color: #764ba2; margin-bottom: 20px;">📊 אין עדיין נתונים לסיכום שנתי</h3>
                <p style="color: #666; margin-bottom: 30px;">כדי לראות סיכום שנתי, עליך לשמור נתונים בחודשים.</p>
                <div style="background: #f5f7fa; padding: 20px; border-radius: 10px; text-align: right; max-width: 500px; margin: 0 auto;">
                    <h4 style="color: #764ba2; margin-bottom: 15px;">📝 הוראות:</h4>
                    <ol style="color: #555; line-height: 2;">
                        <li>עבור לאחד החודשים (למשל: ינואר 2026)</li>
                        <li>הזן נתונים בכל השדות</li>
                        <li>המערכת תחשב אוטומטית</li>
                        <li><strong>לחץ על "💾 שמור נתונים"</strong></li>
                        <li>חזור לכאן לסיכום השנתי</li>
                    </ol>
                </div>
            </div>
        `;
        return;
    }
    
    // Get all employees from showroom config dynamically
    const allEmployees = window.getShowroomEmployeesList(currentShowroom);
    console.log('All employees:', allEmployees);
    
    // Initialize totals for all employees dynamically
    const employeeTotals = {};
    allEmployees.forEach(emp => {
        employeeTotals[emp.id] = { 
            name: emp.name, 
            role: emp.role,
            type: emp.type || 'עובד',
            vehiclesComponent: 0, 
            tradeInComponent: 0, 
            financeComponent: 0, 
            total: 0, 
            months: [] 
        };
    });
    
    const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
                    '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'];
    
    months.forEach(month => {
        console.log(`Checking month ${month}:`, showroomData[month]);
        if (showroomData[month]) {
            console.log(`  - Has data: YES`);
            console.log(`  - Has calculatedResults:`, showroomData[month].calculatedResults ? 'YES' : 'NO');
            
            if (showroomData[month].calculatedResults) {
                const results = showroomData[month].calculatedResults;
                console.log(`  - Results:`, results);
                
                // Read directly from results (EXACT FORMAT AS calc-simple.js)
                Object.keys(results).forEach(empKey => {
                    if (employeeTotals[empKey]) {
                        employeeTotals[empKey].vehiclesComponent += results[empKey].vehiclesComponent || 0;
                        employeeTotals[empKey].tradeInComponent += results[empKey].tradeInComponent || 0;
                        employeeTotals[empKey].financeComponent += results[empKey].financeComponent || 0;
                        employeeTotals[empKey].total += results[empKey].total || 0;
                        employeeTotals[empKey].months.push(month);
                        console.log(`  - Added to ${empKey}:`, results[empKey]);
                    }
                });
            }
        }
    });
    
    console.log('📊 Employee totals:', employeeTotals);
    
    // Check if we have any data at all (generic)
    const hasAnyData = Object.values(employeeTotals).some(emp => emp.months.length > 0);
    
    if (!hasAnyData) {
        summaryContent.innerHTML = `
            <div style="text-align: center; padding: 50px; background: white; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h3 style="color: #ff9800; margin-bottom: 20px;">⚠️ יש נתונים שמורים, אך ללא תוצאות מחושבות</h3>
                <p style="color: #666; margin-bottom: 20px;">הנתונים שנשמרו לא כוללים את התוצאות המחושבות.</p>
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto; border: 2px solid #ffc107;">
                    <h4 style="color: #856404; margin-bottom: 15px;">💡 פתרון:</h4>
                    <ol style="color: #555; text-align: right; line-height: 2;">
                        <li>עבור לכל חודש שהזנת נתונים בו</li>
                        <li>הנתונים יטענו אוטומטית</li>
                        <li>המערכת תחשב מחדש</li>
                        <li><strong>לחץ על "💾 שמור נתונים" שוב</strong></li>
                        <li>חזור לכאן לסיכום השנתי</li>
                    </ol>
                </div>
            </div>
        `;
        return;
    }
    
    // Generate HTML dynamically for all employees
    let employeeCardsHTML = '';
    
    allEmployees.forEach(emp => {
        const empData = employeeTotals[emp.id];
        if (!empData || empData.months.length === 0) return; // Skip if no data
        
        // Determine card class based on type
        let cardClass = 'salesperson-result';
        let titleClass = 'salesperson';
        if (emp.type === 'manager' || emp.type === 'selling-manager') {
            cardClass = 'manager-result';
            titleClass = 'manager';
        } else if (emp.type === 'operations') {
            cardClass = 'operations-result';
            titleClass = 'operations';
        }
        
        employeeCardsHTML += `
            <div class="employee-result-card ${cardClass}">
                <div class="result-card-header">
                    <h3 class="result-card-title ${titleClass}">${emp.icon} ${empData.name}</h3>
                    <p class="result-card-subtitle">${empData.role} - סיכום שנתי</p>
                    <p class="result-card-subtitle" style="font-size: 0.85rem; color: #999;">חודשים עם נתונים: ${empData.months.length}/12</p>
                </div>
                
                <div class="component-line component-vehicles">
                    <span>🚗 רכיב רכבים</span>
                    <span>${formatCurrency(empData.vehiclesComponent)}</span>
                </div>
                
                ${empData.tradeInComponent > 0 ? `
                <div class="component-line component-tradein">
                    <span>🔄 רכיב טרייד אין</span>
                    <span>${formatCurrency(empData.tradeInComponent)}</span>
                </div>
                ` : ''}
                
                ${empData.financeComponent > 0 ? `
                <div class="component-line component-finance">
                    <span>💰 רכיב מימון</span>
                    <span>${formatCurrency(empData.financeComponent)}</span>
                </div>
                ` : ''}
                
                <div class="total-line">
                    <span>סה"כ שנתי</span>
                    <span>${formatCurrency(empData.total)}</span>
                </div>
            </div>
        `;
    });
    
    let html = `
        <div class="results-cards-grid" style="margin-top: 30px;">
            ${employeeCardsHTML}
        </div>
        
        <div style="background: white; padding: 20px; margin-top: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h3 style="color: #764ba2; margin-bottom: 15px;">📅 פירוט לפי חודשים</h3>
            <p style="color: #666;">להצגת פירוט מלא לפי חודשים, עבור לכל חודש בנפרד.</p>
        </div>
    `;
    
    summaryContent.innerHTML = html;
}

// Get employee name from key
function getEmployeeName(key) {
    const names = {
        'meir': 'מאיר מועלם - מנהל אולם',
        'daniel': 'דניאל נגר - איש מכירות',
        'alfred': 'אלפרד בנד - איש מכירות',
        'daniel_e': 'דניאל אליה - איש תפעול'
    };
    return names[key] || key;
}

// Add real-time calculation to inputs
function addRealtimeCalculation(container, month) {
    // Find all input fields (both old and new layout)
    const inputs = container.querySelectorAll('.input-field, .input-field-compact, input[type="number"]');
    console.log('Adding event listeners to', inputs.length, 'inputs for month:', month);
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            console.log('⚡ Input changed:', input.id, '=', input.value, '-> calculating month:', month);
            
            // Determine which showroom this input belongs to based on ID prefix
            const showroomId = currentShowroom;
            
            if (showroomId === 'hyundai-jerusalem') {
                // Use old calculation for Hyundai Jerusalem
                if (typeof window.calculateMonth === 'function') {
                    calculateMonth(month);
                } else {
                    console.error('❌ calculateMonth is not a function!');
                }
            } else {
                // Use new generic calculation for all other showrooms
                if (typeof window.calculateGenericMonth === 'function') {
                    calculateGenericMonth(showroomId, month);
                } else {
                    console.error('❌ calculateGenericMonth is not a function!');
                }
            }
        });
    });
}

// Format currency
window.formatCurrency = function(amount) {
    return '₪' + Math.round(amount).toLocaleString('he-IL');
};

// Get input value safely
window.getInputValue = function(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn('Element not found:', id);
        return 0;
    }
    const value = parseFloat(element.value) || 0;
    console.log('getInputValue:', id, '=', value);
    return value;
};

// Set display value
window.setDisplayValue = function(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = formatCurrency(value);
        console.log('setDisplayValue:', id, '=', formatCurrency(value));
    } else {
        console.warn('Display element not found:', id);
    }
};

// Load current month data
function loadCurrentMonthData() {
    if (currentMonth === 'yearly') return;
    
    const data = window.loadMonthData(currentShowroom, currentMonth);
    if (data) {
        populateFormWithData(currentMonth, data);
        
        // Call appropriate calculation function
        if (currentShowroom === 'hyundai-jerusalem') {
            if (typeof window.calculateMonth === 'function') {
                calculateMonth(currentMonth);
            }
        } else {
            if (typeof window.calculateGenericMonth === 'function') {
                calculateGenericMonth(currentShowroom, currentMonth);
            }
        }
    }
}

// Populate form with saved data
function populateFormWithData(month, data) {
    Object.keys(data).forEach(key => {
        if (key !== 'lastUpdated') {
            const input = document.getElementById(key);
            if (input && typeof data[key] !== 'object') {
                input.value = data[key];
            }
        }
    });
}

// Save current month
window.saveCurrentMonth = function(month) {
    console.log('💾 Saving data for month:', month);
    
    // First calculate to ensure we have the latest results
    calculateMonth(month);
    
    // Collect input data
    const inputData = collectMonthData(month);
    console.log('  - Collected input data:', Object.keys(inputData).length, 'fields');
    
    // Add calculated results
    if (window.lastCalculatedResults && window.lastCalculatedResults[month]) {
        inputData.calculatedResults = window.lastCalculatedResults[month];
        console.log('  - Added calculated results:', window.lastCalculatedResults[month]);
    } else {
        console.warn('  - ⚠️ No calculated results found!');
    }
    
    saveMonthData('hyundai-jerusalem', month, inputData);
    console.log('✓ Data saved for month:', month);
    
    // Show success message with details
    const hasCalcResults = inputData.calculatedResults ? 'כן ✅' : 'לא ❌';
    alert(`✓ הנתונים נשמרו בהצלחה!\n\nשדות שנשמרו: ${Object.keys(inputData).length}\nתוצאות מחושבות: ${hasCalcResults}\n\nכדי לראות בסיכום השנתי, לך לטאב "סיכום שנתי"`);
};

// Collect month data from form
function collectMonthData(month) {
    const data = {};
    const inputs = document.querySelectorAll(`[id^="hj-${month}-"]`);
    
    inputs.forEach(input => {
        // Collect all input fields (both old and new layout)
        if (input.tagName === 'INPUT' && input.type === 'number') {
            data[input.id] = parseFloat(input.value) || 0;
        }
    });
    
    console.log('Collected data for', month, ':', Object.keys(data).length, 'fields');
    return data;
}

// Clear month form
window.clearMonthForm = function(month) {
    if (!confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים בחודש זה?')) {
        return;
    }
    
    const inputs = document.querySelectorAll(`[id^="hj-${month}-"]`);
    inputs.forEach(input => {
        if (input.classList.contains('input-field') && !input.hasAttribute('readonly')) {
            input.value = '';
        }
    });
    
    // Reset results
    if (typeof window.calculateMonth === 'function') {
        window.calculateMonth(month);
    }
    
    // Delete saved data
    deleteMonthData('hyundai-jerusalem', month);
    
    alert('הטופס נוקה בהצלחה!');
};

// NOTE: Real-time calculation listeners are now added in initializeHyundaiJerusalem()
// The old window.load listener has been removed as it's no longer needed
