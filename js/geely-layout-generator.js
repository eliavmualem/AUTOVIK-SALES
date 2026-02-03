// ========================================
// ג'ילי - Generator Layout מיוחד
// ========================================

window.createGeelyMonthLayout = function(showroomId, month) {
    const config = window.getShowroomConfig(showroomId);
    if (!config) {
        return '<p style="color: red;">שגיאה: תצורת אולם לא נמצאה</p>';
    }
    
    const prefix = config.prefix + '-' + month;
    const manager = config.employees.manager;
    const salespeople = config.employees.salespeople || [];
    
    return `
        <div class="geely-month-container">
            <h2 class="geely-month-title">📅 ${getHebrewMonth(month)} - ${config.name}</h2>
            
            <!-- טבלאות מנהל - גריד 2 עמודות -->
            <div class="manager-tables-grid">
                ${createGeelyTargetsTable(prefix, manager)}
                
                <!-- עמודה ימנית: פוטנציאלים + עמלות ידניות -->
                <div class="manager-right-column">
                    ${createGeelyPotentialsTable(prefix, manager)}
                    ${createGeelyManagerInputCard(prefix, manager)}
                </div>
            </div>
            
            <!-- כרטיסי נציגי מכירות -->
            <div class="geely-employees-section">
                <h3 class="section-title">📝 נציגי מכירות</h3>
                <div class="employees-input-grid">
                    ${salespeople.map(sp => createGeelySalespersonInputCard(prefix, sp)).join('')}
                </div>
            </div>
            
            <!-- כפתורי פעולה -->
            <div class="action-buttons-row">
                <button class="action-btn calculate-btn" onclick="window.calculateGeelyMonth('${showroomId}', '${month}')">
                    🧮 חשב עמלות
                </button>
                <button class="action-btn save-btn" onclick="window.saveGeelyMonth('${showroomId}', '${month}')">
                    💾 שמור נתונים
                </button>
                <button class="action-btn clear-btn" onclick="window.clearGeelyMonthForm('${showroomId}', '${month}')">
                    🗑️ נקה טופס
                </button>
            </div>
            
            <!-- טבלת תוצאות -->
            ${createGeelyResultsCards(prefix, config)}
        </div>
    `;
};

// יצירת טבלת יעדים וביצועים - קומפקטית (2 עמודות לשורה)
function createGeelyTargetsTable(prefix, manager) {
    return `
        <div class="compact-table-wrapper" style="width: 100%;">
            <h5 class="compact-table-title">🎯 יעדים וביצועים - ${manager.name}</h5>
            <table class="compact-data-table" style="width: 100%;">
                <tbody>
                    <!-- שורה 1: מסירות -->
                    <tr>
                        <td class="label-cell" style="width: 16%;">יעד מסירות</td>
                        <td style="width: 18%;"><input type="number" id="${prefix}-target-deliveries" class="geely-input-mini" placeholder="0"></td>
                        <td class="label-cell" style="width: 16%;">ביצוע מסירות</td>
                        <td style="width: 18%;"><input type="number" id="${prefix}-actual-deliveries" class="geely-input-mini" placeholder="0"></td>
                        <td class="calculated-mini" style="width: 16%;" id="${prefix}-delivery-percent">0%</td>
                        <td style="width: 16%;"></td>
                    </tr>
                    <!-- שורה 2: שביעות רצון + NPS -->
                    <tr>
                        <td class="label-cell">שביעות רצון</td>
                        <td><input type="number" id="${prefix}-satisfaction-score" class="geely-input-mini" placeholder="0" step="0.1"></td>
                        <td class="label-cell">ציון NPS</td>
                        <td><input type="number" id="${prefix}-nps-score" class="geely-input-mini" placeholder="0-100" max="100"></td>
                        <td colspan="2"></td>
                    </tr>
                    <!-- שורה 3: אביזרים -->
                    <tr>
                        <td class="label-cell">סה"כ אביזרים (₪)</td>
                        <td><input type="number" id="${prefix}-total-accessories" class="geely-input-mini" placeholder="0"></td>
                        <td class="label-cell">ממוצע אביזרים</td>
                        <td colspan="3" class="calculated-mini" id="${prefix}-avg-accessories">₪0</td>
                    </tr>
                    <!-- שורה 4: נסיעות חוויה + טרייד אין -->
                    <tr>
                        <td class="label-cell">נסיעות חוויה (%)</td>
                        <td><input type="number" id="${prefix}-test-drive-percent" class="geely-input-mini" placeholder="0" max="100" step="0.1"></td>
                        <td class="label-cell">כמות טרייד אין</td>
                        <td><input type="number" id="${prefix}-tradein-count" class="geely-input-mini" placeholder="0"></td>
                        <td class="calculated-mini" id="${prefix}-tradein-percent">0%</td>
                        <td></td>
                    </tr>
                    <!-- שורה 5: חבילות שירות -->
                    <tr>
                        <td class="label-cell">חבילות שירות</td>
                        <td><input type="number" id="${prefix}-service-packages" class="geely-input-mini" placeholder="0"></td>
                        <td class="label-cell">אחוז חבילות</td>
                        <td colspan="3" class="calculated-mini" id="${prefix}-service-percent">0%</td>
                    </tr>
                    <!-- שורה 6: מימון + ביטוח -->
                    <tr>
                        <td class="label-cell">מימון בהסדר (%)</td>
                        <td><input type="number" id="${prefix}-finance-percent" class="geely-input-mini" placeholder="0" max="100" step="0.1"></td>
                        <td class="label-cell">מכירות ביטוח</td>
                        <td><input type="number" id="${prefix}-insurance-sales" class="geely-input-mini" placeholder="0"></td>
                        <td class="calculated-mini" id="${prefix}-insurance-percent">0%</td>
                        <td></td>
                    </tr>
                    <!-- שורה 7: מוביליטי -->
                    <tr>
                        <td class="label-cell">כמות מוביליטי</td>
                        <td><input type="number" id="${prefix}-mobility-count" class="geely-input-mini" placeholder="0"></td>
                        <td class="label-cell">אחוז מוביליטי</td>
                        <td colspan="3" class="calculated-mini" id="${prefix}-mobility-percent">0%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// יצירת טבלת פוטנציאלים - קומפקטית
function createGeelyPotentialsTable(prefix, manager) {
    return `
        <div class="compact-table-wrapper">
            <h5 class="compact-table-title">🎯 פוטנציאלים</h5>
            <table class="compact-data-table">
                <tbody>
                    <tr>
                        <td class="label-cell">פוט' אביזרים</td>
                        <td><input type="number" id="${prefix}-potential-accessories" class="geely-input-mini" placeholder="0"></td>
                    </tr>
                    <tr>
                        <td class="label-cell">פוט' חבילות</td>
                        <td><input type="number" id="${prefix}-potential-service" class="geely-input-mini" placeholder="0"></td>
                    </tr>
                    <tr>
                        <td class="label-cell">פוט' ביטוחים</td>
                        <td><input type="number" id="${prefix}-potential-insurance" class="geely-input-mini" placeholder="0"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// יצירת כרטיס הזנה למנהל - קומפקטי כמו נציגים
function createGeelyManagerInputCard(prefix, manager) {
    return `
        <div class="geely-employee-card manager-card">
            <div class="card-header">
                <h4 class="employee-name">${manager.icon} ${manager.name}</h4>
                <p class="employee-role">${manager.role}</p>
            </div>
            
            <div class="card-body">
                <!-- טבלה קומפקטית לעמלות ידניות -->
                <div class="compact-table-wrapper">
                    <h5 class="compact-table-title">✏️ עמלות ידניות</h5>
                    <table class="compact-data-table">
                        <tr>
                            <td class="label-cell">רווח נוסף מטרייד (₪)</td>
                            <td><input type="number" id="${prefix}-${manager.id}-tradein-profit" class="geely-input-mini" placeholder="0"></td>
                        </tr>
                        <tr>
                            <td class="label-cell">עמלת סלקט (₪)</td>
                            <td><input type="number" id="${prefix}-${manager.id}-select-commission" class="geely-input-mini" placeholder="0"></td>
                        </tr>
                        <tr>
                            <td class="label-cell">רכבים במיקוד (₪)</td>
                            <td><input type="number" id="${prefix}-${manager.id}-special-focus" class="geely-input-mini" placeholder="0"></td>
                        </tr>
                        <tr>
                            <td class="label-cell">מימון מקס (₪)</td>
                            <td><input type="number" id="${prefix}-${manager.id}-max-finance" class="geely-input-mini" placeholder="0"></td>
                        </tr>
                        <tr>
                            <td class="label-cell">הפרשי עמלות (₪)</td>
                            <td><input type="number" id="${prefix}-${manager.id}-diff" class="geely-input-mini" placeholder="0"></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// יצירת כרטיס הזנה לנציג מכירות
function createGeelySalespersonInputCard(prefix, salesperson) {
    return `
        <div class="geely-employee-card salesperson-card">
            <div class="card-header">
                <h4 class="employee-name">${salesperson.icon} ${salesperson.name}</h4>
                <p class="employee-role">${salesperson.role}</p>
            </div>
            
            <div class="card-body">
                <!-- טבלת נתונים ופוטנציאלים צד בצד -->
                <div class="salesperson-tables-grid">
                    <!-- טבלת נתונים -->
                    <div class="compact-table-wrapper">
                        <h5 class="compact-table-title">📊 נתונים</h5>
                        <table class="compact-data-table">
                            <tr>
                                <td class="label-cell">כמות מסירות</td>
                                <td><input type="number" id="${prefix}-${salesperson.id}-deliveries" class="geely-input-mini" placeholder="0"></td>
                            </tr>
                            <tr>
                                <td class="label-cell">NPS</td>
                                <td><input type="number" id="${prefix}-${salesperson.id}-nps" class="geely-input-mini" placeholder="0" readonly></td>
                            </tr>
                            <tr>
                                <td class="label-cell">סה"כ אביזרים (₪)</td>
                                <td><input type="number" id="${prefix}-${salesperson.id}-accessories-total" class="geely-input-mini" placeholder="0"></td>
                            </tr>
                            <tr>
                                <td class="label-cell">ממוצע אביזרים</td>
                                <td class="calculated-mini" id="${prefix}-${salesperson.id}-accessories-avg">₪0</td>
                            </tr>
                            <tr>
                                <td class="label-cell">הרחבת אחריות</td>
                                <td><input type="number" id="${prefix}-${salesperson.id}-warranty" class="geely-input-mini" placeholder="0"></td>
                            </tr>
                            <tr>
                                <td class="label-cell">ביטוח</td>
                                <td><input type="number" id="${prefix}-${salesperson.id}-insurance" class="geely-input-mini" placeholder="0"></td>
                            </tr>
                            <tr>
                                <td class="label-cell">אחוז ביטוח</td>
                                <td class="calculated-mini" id="${prefix}-${salesperson.id}-insurance-percent">0%</td>
                            </tr>
                            <tr>
                                <td class="label-cell">טרייד אין</td>
                                <td><input type="number" id="${prefix}-${salesperson.id}-tradein" class="geely-input-mini" placeholder="0"></td>
                            </tr>
                            <tr>
                                <td class="label-cell">פגישת מסירה</td>
                                <td><input type="number" id="${prefix}-${salesperson.id}-delivery-meeting" class="geely-input-mini" placeholder="0"></td>
                            </tr>
                            <tr>
                                <td class="label-cell">חבילות שירות</td>
                                <td><input type="number" id="${prefix}-${salesperson.id}-service" class="geely-input-mini" placeholder="0"></td>
                            </tr>
                            <tr>
                                <td class="label-cell">אחוז חבילות</td>
                                <td class="calculated-mini" id="${prefix}-${salesperson.id}-service-percent">0%</td>
                            </tr>
                        </table>
                    </div>
                    
                    <!-- טבלת פוטנציאלים -->
                    <div class="compact-table-wrapper">
                        <h5 class="compact-table-title">🎯 פוטנציאלים</h5>
                        <table class="compact-data-table">
                            <tr>
                                <td class="label-cell">פוט' אביזרים</td>
                                <td><input type="number" id="${prefix}-${salesperson.id}-potential-accessories" class="geely-input-mini" placeholder="0"></td>
                            </tr>
                            <tr>
                                <td class="label-cell">פוט' ביטוחים</td>
                                <td><input type="number" id="${prefix}-${salesperson.id}-potential-insurance" class="geely-input-mini" placeholder="0"></td>
                            </tr>
                            <tr>
                                <td class="label-cell">פוט' חבילות</td>
                                <td><input type="number" id="${prefix}-${salesperson.id}-potential-service" class="geely-input-mini" placeholder="0"></td>
                            </tr>
                        </table>
                        
                        <h5 class="compact-table-title" style="margin-top: 15px;">✏️ עמלות ידניות</h5>
                        <table class="compact-data-table">
                            <tr>
                                <td class="label-cell">רכבים במיקוד (₪)</td>
                                <td><input type="number" id="${prefix}-${salesperson.id}-special-focus" class="geely-input-mini" placeholder="0"></td>
                            </tr>
                            <tr>
                                <td class="label-cell">מימון מקס (₪)</td>
                                <td><input type="number" id="${prefix}-${salesperson.id}-max-finance" class="geely-input-mini" placeholder="0"></td>
                            </tr>
                            <tr>
                                <td class="label-cell">הפרשי עמלות (₪)</td>
                                <td><input type="number" id="${prefix}-${salesperson.id}-diff" class="geely-input-mini" placeholder="0"></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// יצירת כרטיסי תוצאות
function createGeelyResultsCards(prefix, config) {
    const manager = config.employees.manager;
    const salespeople = config.employees.salespeople || [];
    
    return `
        <div class="geely-results-section">
            <h3 class="section-title">💰 סיכום עמלות</h3>
            <div class="results-cards-grid">
                ${createGeelyManagerResultCard(prefix, manager)}
                ${salespeople.map(sp => createGeelySalespersonResultCard(prefix, sp)).join('')}
            </div>
        </div>
    `;
}

// כרטיס תוצאות מנהל
function createGeelyManagerResultCard(prefix, manager) {
    return `
        <div class="geely-result-card manager-result">
            <div class="result-header">
                <h4>${manager.icon} ${manager.name}</h4>
                <p>${manager.role}</p>
            </div>
            
            <div class="result-body">
                <div class="result-line">
                    <span>עמלות מסירות (200₪ × כמות)</span>
                    <span id="${prefix}-${manager.id}-delivery-commission">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>קיזוז NPS (אם מתחת ל-75%)</span>
                    <span id="${prefix}-${manager.id}-nps-deduction">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>עמלת אביזרים (2-5%)</span>
                    <span id="${prefix}-${manager.id}-accessories-commission">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>עמלת טרייד אין</span>
                    <span id="${prefix}-${manager.id}-tradein-commission">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>עמלת רווח נוסף מטרייד</span>
                    <span id="${prefix}-${manager.id}-tradein-profit-display">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>עמלת סלקט</span>
                    <span id="${prefix}-${manager.id}-select-display">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>בונוס מימון בהסדר (>25%)</span>
                    <span id="${prefix}-${manager.id}-finance-bonus">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>עמלת ביטוח (40-50%)</span>
                    <span id="${prefix}-${manager.id}-insurance-commission">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>עמלת טופ סרוויס (60-80%+)</span>
                    <span id="${prefix}-${manager.id}-top-service-commission">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>עמלה מיוחדת רכבים במיקוד</span>
                    <span id="${prefix}-${manager.id}-special-focus-display">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>עמלת מימון מקס</span>
                    <span id="${prefix}-${manager.id}-max-finance-display">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>הפרשי עמלות</span>
                    <span id="${prefix}-${manager.id}-diff-display">₪0</span>
                </div>
                
                <hr class="result-separator">
                
                <div class="total-line">
                    <span><strong>סה"כ עמלות</strong></span>
                    <span id="${prefix}-${manager.id}-total"><strong>₪0</strong></span>
                </div>
            </div>
        </div>
    `;
}

// כרטיס תוצאות נציג
function createGeelySalespersonResultCard(prefix, salesperson) {
    return `
        <div class="geely-result-card salesperson-result">
            <div class="result-header">
                <h4>${salesperson.icon} ${salesperson.name}</h4>
                <p>${salesperson.role}</p>
            </div>
            
            <div class="result-body">
                <div class="result-line">
                    <span>עמלות מסירות (100₪ × כמות)</span>
                    <span id="${prefix}-${salesperson.id}-delivery-commission">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>קיזוז/בונוס NPS</span>
                    <span id="${prefix}-${salesperson.id}-nps-adjustment">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>עמלת אביזרים (3-7%)</span>
                    <span id="${prefix}-${salesperson.id}-accessories-commission">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>הרחבות אחריות (40₪)</span>
                    <span id="${prefix}-${salesperson.id}-warranty-commission">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>ביטוח (35-80₪)</span>
                    <span id="${prefix}-${salesperson.id}-insurance-commission">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>טרייד אין (120₪)</span>
                    <span id="${prefix}-${salesperson.id}-tradein-commission">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>חבילות שירות (80₪)</span>
                    <span id="${prefix}-${salesperson.id}-service-commission">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>רכבים במיקוד</span>
                    <span id="${prefix}-${salesperson.id}-special-focus-display">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>מימון מקס</span>
                    <span id="${prefix}-${salesperson.id}-max-finance-display">₪0</span>
                </div>
                
                <div class="result-line">
                    <span>הפרשי עמלות</span>
                    <span id="${prefix}-${salesperson.id}-diff-display">₪0</span>
                </div>
                
                <hr class="result-separator">
                
                <div class="total-line">
                    <span><strong>סה"כ עמלות</strong></span>
                    <span id="${prefix}-${salesperson.id}-total"><strong>₪0</strong></span>
                </div>
            </div>
        </div>
    `;
}

// פונקציית עזר לקבלת שם חודש בעברית
function getHebrewMonth(month) {
    const months = {
        '2026-01': 'ינואר 2026',
        '2026-02': 'פברואר 2026',
        '2026-03': 'מרץ 2026',
        '2026-04': 'אפריל 2026',
        '2026-05': 'מאי 2026',
        '2026-06': 'יוני 2026',
        '2026-07': 'יולי 2026',
        '2026-08': 'אוגוסט 2026',
        '2026-09': 'ספטמבר 2026',
        '2026-10': 'אוקטובר 2026',
        '2026-11': 'נובמבר 2026',
        '2026-12': 'דצמבר 2026'
    };
    return months[month] || month;
}

console.log('✓ Geely layout generator loaded');
