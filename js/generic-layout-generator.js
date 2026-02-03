// 🎨 מחולל ממשק גנרי לכל אולם

function createGenericMonthLayout(showroomId, month) {
    const config = getShowroomConfig(showroomId);
    if (!config) {
        return '<p style="color: red;">שגיאה: תצורת אולם לא נמצאה</p>';
    }
    
    const prefix = config.prefix + '-' + month;
    const manager = config.employees.manager;
    const salespeople = config.employees.salespeople || [];
    const operations = config.employees.operations;
    
    // חישוב סך אנשי מכירות (לא כולל placeholder)
    const activeSalespeople = salespeople.filter(s => !s.placeholder);
    const totalSalespeopleIds = activeSalespeople.map(s => s.id).join(' + ');
    
    return `
        <!-- 📊 אזור הזנת נתונים -->
        <div class="input-area-wrapper">
            <h2 class="input-area-title">📊 הזנת נתונים כמותיים</h2>
            
            <!-- יעדי סניף -->
            <div class="branch-goals-box">
                <h3 class="branch-goals-title">🎯 יעדי הסניף לחודש</h3>
                <div class="branch-goals-grid">
                    <div class="goal-input-group">
                        <label>יעד סניף (מסירות רכב)</label>
                        <input type="number" id="${prefix}-branch-target" class="input-field" placeholder="הזן יעד">
                    </div>
                    <div class="goal-input-group">
                        <label>סה"כ מסירות בפועל</label>
                        <input type="number" id="${prefix}-total-cars" class="input-field" readonly value="0">
                    </div>
                    ${showroomId === 'kalmobil-modiin' ? `
                    <div class="goal-input-group">
                        <label>אחוז מימון סניפי (%)</label>
                        <input type="number" id="${prefix}-finance-percent" class="input-field" placeholder="0-100" step="0.1">
                    </div>
                    <div class="goal-input-group">
                        <label>אחוז מכירות מהמלאי (%)</label>
                        <input type="number" id="${prefix}-stock-percent" class="input-field" placeholder="0-100" step="0.1">
                    </div>
                    ` : ''}
                    <div class="goal-input-group">
                        <div class="branch-status-badge" id="${prefix}-target-status">⏳ ממתין לנתונים</div>
                    </div>
                </div>
            </div>
            
            <!-- נתוני עובדים -->
            <div class="employees-input-grid">
                ${manager.type === 'kalmobil-manager' ? createKalmobilManagerInputCard(prefix, manager) : 
                  manager.type === 'selling-manager' ? createSellingManagerInputCard(prefix, manager) : 
                  createManagerInputCard(prefix, manager)}
                ${salespeople.map(sp => 
                    sp.type === 'kalmobil-salesperson' ? createKalmobilSalespersonInputCard(prefix, sp) : 
                    createSalespersonInputCard(prefix, sp)
                ).join('')}
                ${operations ? (
                    operations.type === 'kalmobil-operations' ? createKalmobilOperationsInputCard(prefix, operations) :
                    createOperationsInputCard(prefix, operations)
                ) : ''}
            </div>
            
            <!-- כפתורי פעולה -->
            <div class="action-buttons-row">
                <button class="action-button calculate" onclick="calculateGenericMonth('${showroomId}', '${month}')">🧮 חשב עמלות</button>
                <button class="action-button save" onclick="saveGenericMonth('${showroomId}', '${month}')">💾 שמור נתונים</button>
                <button class="action-button clear" onclick="clearGenericMonthForm('${showroomId}', '${month}')">🗑️ נקה טופס</button>
            </div>
        </div>
        
        ${createPerformanceTable(prefix, showroomId)}
        ${createResultsCards(prefix, config, showroomId)}
    `;
}

// יצירת כרטיס הזנה למנהל
function createManagerInputCard(prefix, manager) {
    return `
        <div class="employee-input-card manager-card">
            <h4 class="employee-card-title manager-title">${manager.icon} ${manager.name}</h4>
            <p class="result-card-subtitle">${manager.role}</p>
            
            <label class="input-field-label">מכירות רכב (200 ש"ח לרכב)</label>
            <input type="number" id="${prefix}-${manager.id}-cars" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">רכבי הדגמה</label>
            <input type="number" id="${prefix}-${manager.id}-demo" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">הפרשי עמלות</label>
            <input type="number" id="${prefix}-${manager.id}-diff" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">מימון (כלמוביל)</label>
            <input type="number" id="${prefix}-${manager.id}-finance" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">טרייד אין (כלמוביל)</label>
            <input type="number" id="${prefix}-${manager.id}-tradein" class="input-field-compact" placeholder="0">
        </div>
    `;
}

// יצירת כרטיס הזנה למנהל מוכר (כמו נציג אבל עם תפקיד מנהל)
function createSellingManagerInputCard(prefix, manager) {
    return `
        <div class="employee-input-card manager-card">
            <h4 class="employee-card-title manager-title">${manager.icon} ${manager.name}</h4>
            <p class="result-card-subtitle">${manager.role}</p>
            
            <label class="input-field-label">יעד אישי (מסירות)</label>
            <input type="number" id="${prefix}-${manager.id}-target" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">מסירות רכב בפועל</label>
            <input type="number" id="${prefix}-${manager.id}-cars" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">מכירות ביטוח</label>
            <input type="number" id="${prefix}-${manager.id}-insurance" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">מכירות טופ סרוויס</label>
            <input type="number" id="${prefix}-${manager.id}-topservice" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">פוטנציאל טופ סרוויס</label>
            <input type="number" id="${prefix}-${manager.id}-topservice-potential" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">הרחבות אחריות</label>
            <input type="number" id="${prefix}-${manager.id}-warranty" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">ציון לקוח סמוי</label>
            <input type="number" id="${prefix}-${manager.id}-mystery" class="input-field-compact" placeholder="0-100">
            
            <label class="input-field-label">רכבי הדגמה</label>
            <input type="number" id="${prefix}-${manager.id}-demo" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">הפרשי עמלות</label>
            <input type="number" id="${prefix}-${manager.id}-diff" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">מימון (כלמוביל)</label>
            <input type="number" id="${prefix}-${manager.id}-finance" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">טרייד אין (כלמוביל)</label>
            <input type="number" id="${prefix}-${manager.id}-tradein" class="input-field-compact" placeholder="0">
        </div>
    `;
}

// יצירת כרטיס הזנה לאיש מכירות
function createSalespersonInputCard(prefix, salesperson) {
    const placeholderNote = salesperson.placeholder ? ' (לא פעיל - להשאיר ריק)' : '';
    
    return `
        <div class="employee-input-card salesperson-card ${salesperson.placeholder ? 'placeholder-card' : ''}">
            <h4 class="employee-card-title salesperson-title">${salesperson.icon} ${salesperson.name}</h4>
            <p class="result-card-subtitle">${salesperson.role}${placeholderNote}</p>
            
            <label class="input-field-label">יעד אישי (מסירות)</label>
            <input type="number" id="${prefix}-${salesperson.id}-target" class="input-field-compact" placeholder="0" ${salesperson.placeholder ? 'disabled' : ''}>
            
            <label class="input-field-label">מסירות רכב בפועל</label>
            <input type="number" id="${prefix}-${salesperson.id}-cars" class="input-field-compact" placeholder="0" ${salesperson.placeholder ? 'disabled' : ''}>
            
            <label class="input-field-label">מכירות ביטוח</label>
            <input type="number" id="${prefix}-${salesperson.id}-insurance" class="input-field-compact" placeholder="0" ${salesperson.placeholder ? 'disabled' : ''}>
            
            <label class="input-field-label">מכירות טופ סרוויס</label>
            <input type="number" id="${prefix}-${salesperson.id}-topservice" class="input-field-compact" placeholder="0" ${salesperson.placeholder ? 'disabled' : ''}>
            
            <label class="input-field-label">פוטנציאל טופ סרוויס</label>
            <input type="number" id="${prefix}-${salesperson.id}-topservice-potential" class="input-field-compact" placeholder="0" ${salesperson.placeholder ? 'disabled' : ''}>
            
            <label class="input-field-label">הרחבות אחריות</label>
            <input type="number" id="${prefix}-${salesperson.id}-warranty" class="input-field-compact" placeholder="0" ${salesperson.placeholder ? 'disabled' : ''}>
            
            <label class="input-field-label">ציון לקוח סמוי</label>
            <input type="number" id="${prefix}-${salesperson.id}-mystery" class="input-field-compact" placeholder="0-100" ${salesperson.placeholder ? 'disabled' : ''}>
            
            <label class="input-field-label">רכבי הדגמה</label>
            <input type="number" id="${prefix}-${salesperson.id}-demo" class="input-field-compact" placeholder="0" ${salesperson.placeholder ? 'disabled' : ''}>
            
            <label class="input-field-label">הפרשי עמלות</label>
            <input type="number" id="${prefix}-${salesperson.id}-diff" class="input-field-compact" placeholder="0" ${salesperson.placeholder ? 'disabled' : ''}>
            
            <label class="input-field-label">מימון (כלמוביל)</label>
            <input type="number" id="${prefix}-${salesperson.id}-finance" class="input-field-compact" placeholder="0" ${salesperson.placeholder ? 'disabled' : ''}>
            
            <label class="input-field-label">טרייד אין (כלמוביל)</label>
            <input type="number" id="${prefix}-${salesperson.id}-tradein" class="input-field-compact" placeholder="0" ${salesperson.placeholder ? 'disabled' : ''}>
        </div>
    `;
}

// יצירת כרטיס הזנה לאיש תפעול
function createOperationsInputCard(prefix, operations) {
    return `
        <div class="employee-input-card operations-card">
            <h4 class="employee-card-title operations-title">${operations.icon} ${operations.name}</h4>
            <p class="result-card-subtitle">${operations.role}</p>
            
            <label class="input-field-label">מכירות ביטוח</label>
            <input type="number" id="${prefix}-${operations.id}-insurance" class="input-field-compact" placeholder="0">
        </div>
    `;
}

// יצירת טבלת ביצועים
function createPerformanceTable(prefix, showroomId) {
    return `
        <div class="performance-table-wrapper">
            <h3 style="text-align: center; color: #764ba2; margin-bottom: 20px; font-size: 1.5rem;">📈 סיכום ביצועי הסניף</h3>
            <table class="performance-table">
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
                        <td><strong>מסירות רכב</strong></td>
                        <td id="${prefix}-perf-cars-target">-</td>
                        <td id="${prefix}-perf-cars-actual">-</td>
                        <td id="${prefix}-perf-cars-percent">-</td>
                        <td><span id="${prefix}-perf-cars-status" class="status-cell">-</span></td>
                    </tr>
                    <tr>
                        <td><strong>טופ סרוויס</strong></td>
                        <td id="${prefix}-perf-topservice-target">-</td>
                        <td id="${prefix}-perf-topservice-actual">-</td>
                        <td id="${prefix}-perf-topservice-percent">-</td>
                        <td><span id="${prefix}-perf-topservice-status" class="status-cell">-</span></td>
                    </tr>
                    <tr>
                        <td><strong>ביטוח</strong></td>
                        <td id="${prefix}-perf-insurance-target">-</td>
                        <td id="${prefix}-perf-insurance-actual">-</td>
                        <td id="${prefix}-perf-insurance-percent">-</td>
                        <td><span id="${prefix}-perf-insurance-status" class="status-cell">-</span></td>
                    </tr>
                    ${showroomId === 'kalmobil-modiin' ? `
                    <tr>
                        <td><strong>מכירות מהמלאי</strong></td>
                        <td id="${prefix}-perf-stock-target">40%</td>
                        <td id="${prefix}-perf-stock-actual">-</td>
                        <td id="${prefix}-perf-stock-percent">-</td>
                        <td><span id="${prefix}-perf-stock-status" class="status-cell">-</span></td>
                    </tr>
                    <tr>
                        <td><strong>מימון</strong></td>
                        <td id="${prefix}-perf-finance-target">32%</td>
                        <td id="${prefix}-perf-finance-actual">-</td>
                        <td id="${prefix}-perf-finance-percent">-</td>
                        <td><span id="${prefix}-perf-finance-status" class="status-cell">-</span></td>
                    </tr>
                    ` : ''}
                </tbody>
            </table>
        </div>
    `;
}

// יצירת כרטיסי תוצאות
function createResultsCards(prefix, config, showroomId) {
    const manager = config.employees.manager;
    const salespeople = config.employees.salespeople || [];
    const operations = config.employees.operations;
    
    let html = `
        <div class="results-area-wrapper">
            <h2 class="results-area-title">🎯 פירוט עמלות לכל עובד</h2>
            <div class="results-cards-grid">
    `;
    
    // מנהל
    if (manager.type === 'kalmobil-manager') {
        html += createKalmobilManagerResultCard(prefix, manager);
    } else if (manager.type === 'selling-manager') {
        // Check if Mitsubishi-style model (Mitsubishi + Omoda)
        if (showroomId === 'mitsubishi-modiin' || showroomId === 'omoda-modiin') {
            html += createMitsubishiSellingManagerResultCard(prefix, manager);
        } else {
            html += createSellingManagerResultCard(prefix, manager);
        }
    } else {
        html += createManagerResultCard(prefix, manager);
    }
    
    // אנשי מכירות
    salespeople.forEach(sp => {
        if (!sp.placeholder) {
            if (sp.type === 'kalmobil-salesperson') {
                html += createKalmobilSalespersonResultCard(prefix, sp);
            } else {
                html += createSalespersonResultCard(prefix, sp);
            }
        }
    });
    
    // תפעול
    if (operations) {
        if (operations.type === 'kalmobil-operations') {
            html += createKalmobilOperationsResultCard(prefix, operations);
        } else {
            html += createOperationsResultCard(prefix, operations);
        }
    }
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

// כרטיס תוצאות למנהל
function createManagerResultCard(prefix, manager) {
    return `
        <div class="employee-result-card manager-result">
            <div class="result-card-header">
                <h3 class="result-card-title manager">${manager.icon} ${manager.name}</h3>
                <p class="result-card-subtitle">${manager.role}</p>
            </div>
            
            <div class="result-line">
                <span class="result-label">עמלות מסירות (200 ש"ח × סה"כ מסירות סניף)</span>
                <span class="result-value" id="${prefix}-${manager.id}-base-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">רכבי הדגמה</span>
                <span class="result-value" id="${prefix}-${manager.id}-demo-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">הפרשי עמלות</span>
                <span class="result-value" id="${prefix}-${manager.id}-diff-display">₪0</span>
            </div>
            
            <hr class="result-separator">
            
            <div class="component-line component-vehicles">
                <span>🚗 רכיב רכבים</span>
                <span id="${prefix}-${manager.id}-vehicles-display">₪0</span>
            </div>
            
            <div class="component-line component-tradein">
                <span>🔄 רכיב טרייד אין</span>
                <span id="${prefix}-${manager.id}-tradein-display">₪0</span>
            </div>
            
            <div class="component-line component-finance">
                <span>💰 רכיב מימון</span>
                <span id="${prefix}-${manager.id}-finance-display">₪0</span>
            </div>
            
            <div class="total-line">
                <span>סה"כ עמלות</span>
                <span id="${prefix}-${manager.id}-total-display">₪0</span>
            </div>
        </div>
    `;
}

// כרטיס תוצאות למנהל מוכר (כמו נציג אבל עם צבע מנהל)
function createMitsubishiSellingManagerResultCard(prefix, manager) {
    return `
        <div class="employee-result-card manager-result">
            <div class="result-card-header">
                <h3 class="result-card-title manager">${manager.icon} ${manager.name}</h3>
                <p class="result-card-subtitle">${manager.role}</p>
            </div>
            
            <div class="result-line">
                <span class="result-label">מסירות רכב (200 ש"ח × סה"כ סניף)</span>
                <span class="result-value" id="${prefix}-${manager.id}-base-commission">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">ביטוח (75 ש"ח × כמות)</span>
                <span class="result-value" id="${prefix}-${manager.id}-insurance-commission">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">הרחבות אחריות (60 ש"ח × כמות)</span>
                <span class="result-value" id="${prefix}-${manager.id}-warranty-commission">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">טופ סרוויס (פיקס לפי מדרגות)</span>
                <span class="result-value" id="${prefix}-${manager.id}-topservice-commission">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">התאמת לקוח סמוי</span>
                <span class="result-value" id="${prefix}-${manager.id}-mystery-adjustment">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">רכבי הדגמה</span>
                <span class="result-value" id="${prefix}-${manager.id}-demo-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">הפרשי עמלות</span>
                <span class="result-value" id="${prefix}-${manager.id}-diff-display">₪0</span>
            </div>
            
            <hr class="result-separator">
            
            <div class="component-line component-vehicles">
                <span>🚗 רכיב רכבים</span>
                <span id="${prefix}-${manager.id}-vehicles-display">₪0</span>
            </div>
            
            <div class="component-line component-tradein">
                <span>🔄 רכיב טרייד אין</span>
                <span id="${prefix}-${manager.id}-tradein-display">₪0</span>
            </div>
            
            <div class="component-line component-finance">
                <span>💰 רכיב מימון</span>
                <span id="${prefix}-${manager.id}-finance-display">₪0</span>
            </div>
            
            <div class="total-line">
                <span>סה"כ עמלות</span>
                <span id="${prefix}-${manager.id}-total-display">₪0</span>
            </div>
        </div>
    `;
}

// כרטיס תוצאות למנהל מוכר (כללי - לא מיצובישי)
function createSellingManagerResultCard(prefix, manager) {
    return `
        <div class="employee-result-card manager-result">
            <div class="result-card-header">
                <h3 class="result-card-title manager">${manager.icon} ${manager.name}</h3>
                <p class="result-card-subtitle">${manager.role}</p>
            </div>
            
            <div class="result-line">
                <span class="result-label">עמלות מסירות רכב (200 ש"ח)</span>
                <span class="result-value" id="${prefix}-${manager.id}-base-commission">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">ביטוח (75 ש"ח × כמות)</span>
                <span class="result-value" id="${prefix}-${manager.id}-insurance-commission">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">טופ סרוויס</span>
                <span class="result-value" id="${prefix}-${manager.id}-topservice-commission">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">הרחבות אחריות (60 ש"ח × כמות)</span>
                <span class="result-value" id="${prefix}-${manager.id}-warranty-commission">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">התאמת לקוח סמוי</span>
                <span class="result-value" id="${prefix}-${manager.id}-mystery-adjustment">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">רכבי הדגמה</span>
                <span class="result-value" id="${prefix}-${manager.id}-demo-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">הפרשי עמלות</span>
                <span class="result-value" id="${prefix}-${manager.id}-diff-display">₪0</span>
            </div>
            
            <hr class="result-separator">
            
            <div class="component-line component-vehicles">
                <span>🚗 רכיב רכבים</span>
                <span id="${prefix}-${manager.id}-vehicles-display">₪0</span>
            </div>
            
            <div class="component-line component-tradein">
                <span>🔄 רכיב טרייד אין</span>
                <span id="${prefix}-${manager.id}-tradein-display">₪0</span>
            </div>
            
            <div class="component-line component-finance">
                <span>💰 רכיב מימון</span>
                <span id="${prefix}-${manager.id}-finance-display">₪0</span>
            </div>
            
            <div class="total-line">
                <span>סה"כ עמלות</span>
                <span id="${prefix}-${manager.id}-total-display">₪0</span>
            </div>
        </div>
    `;
}

// כרטיס תוצאות לאיש מכירות
function createSalespersonResultCard(prefix, salesperson) {
    return `
        <div class="employee-result-card salesperson-result">
            <div class="result-card-header">
                <h3 class="result-card-title salesperson">${salesperson.icon} ${salesperson.name}</h3>
                <p class="result-card-subtitle">${salesperson.role}</p>
            </div>
            
            <div class="result-line">
                <span class="result-label">עמלות מסירות רכב (כולל בונוסים)</span>
                <span class="result-value" id="${prefix}-${salesperson.id}-base-commission">₪0</span>
            </div>
            
            <div class="result-line" style="font-size: 0.85rem; color: #666; padding-right: 20px;">
                <span class="result-label">↳ פירוט עמלת מסירות</span>
                <span class="result-value" id="${prefix}-${salesperson.id}-vehicles-breakdown">בסיס + בונוסים</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">ביטוח (75 ש"ח × כמות)</span>
                <span class="result-value" id="${prefix}-${salesperson.id}-insurance-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">טופ סרוויס</span>
                <span class="result-value" id="${prefix}-${salesperson.id}-topservice-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">הרחבות אחריות (60 ש"ח × כמות)</span>
                <span class="result-value" id="${prefix}-${salesperson.id}-warranty-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">התאמת לקוח סמוי</span>
                <span class="result-value" id="${prefix}-${salesperson.id}-mystery-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">רכבי הדגמה</span>
                <span class="result-value" id="${prefix}-${salesperson.id}-demo-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">הפרשי עמלות</span>
                <span class="result-value" id="${prefix}-${salesperson.id}-diff-display">₪0</span>
            </div>
            
            <hr class="result-separator">
            
            <div class="component-line component-vehicles">
                <span>🚗 רכיב רכבים</span>
                <span id="${prefix}-${salesperson.id}-vehicles-display">₪0</span>
            </div>
            
            <div class="component-line component-tradein">
                <span>🔄 רכיב טרייד אין</span>
                <span id="${prefix}-${salesperson.id}-tradein-display">₪0</span>
            </div>
            
            <div class="component-line component-finance">
                <span>💰 רכיב מימון</span>
                <span id="${prefix}-${salesperson.id}-finance-display">₪0</span>
            </div>
            
            <div class="total-line">
                <span>סה"כ עמלות</span>
                <span id="${prefix}-${salesperson.id}-total-display">₪0</span>
            </div>
        </div>
    `;
}

// כרטיס תוצאות לאיש תפעול
function createOperationsResultCard(prefix, operations) {
    return `
        <div class="employee-result-card operations-result">
            <div class="result-card-header">
                <h3 class="result-card-title operations">${operations.icon} ${operations.name}</h3>
                <p class="result-card-subtitle">${operations.role}</p>
            </div>
            
            <div class="result-line">
                <span class="result-label">טופ סרוויס (ביצועי סניף)</span>
                <span class="result-value" id="${prefix}-${operations.id}-topservice-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">ביטוח (75 ש"ח × כמות)</span>
                <span class="result-value" id="${prefix}-${operations.id}-insurance-display">₪0</span>
            </div>
            
            <hr class="result-separator">
            
            <div class="component-line component-vehicles">
                <span>🚗 רכיב רכבים</span>
                <span id="${prefix}-${operations.id}-vehicles-display">₪0</span>
            </div>
            
            <div class="total-line">
                <span>סה"כ עמלות</span>
                <span id="${prefix}-${operations.id}-total-display">₪0</span>
            </div>
        </div>
    `;
}

// ========================================
// כלמוביל טרייד אין - כרטיסי הזנה מיוחדים
// ========================================

function createKalmobilManagerInputCard(prefix, manager) {
    return `
        <div class="employee-input-card manager-card">
            <h4 class="employee-card-title manager-title">${manager.icon} ${manager.name}</h4>
            <p class="result-card-subtitle">${manager.role}</p>
            
            <label class="input-field-label">מסירות רכב אישיות</label>
            <input type="number" id="${prefix}-${manager.id}-cars" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">פוטנציאל טופ סרוויס</label>
            <input type="number" id="${prefix}-${manager.id}-topservice-pot" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">הרחבות אחריות (עמלה ידנית ₪)</label>
            <input type="number" id="${prefix}-${manager.id}-warranty-commission" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">חבילות שירות/טופ סרוויס (עמלה ידנית ₪)</label>
            <input type="number" id="${prefix}-${manager.id}-topservice-commission" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">רכבי הדגמה (₪)</label>
            <input type="number" id="${prefix}-${manager.id}-demo" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">הפרשי עמלות (₪)</label>
            <input type="number" id="${prefix}-${manager.id}-diff" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">עמלות מימון כלמוביל (₪)</label>
            <input type="number" id="${prefix}-${manager.id}-finance" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">עמלות טרייד כלמוביל (₪)</label>
            <input type="number" id="${prefix}-${manager.id}-tradein" class="input-field-compact" placeholder="0">
        </div>
    `;
}

function createKalmobilSalespersonInputCard(prefix, salesperson) {
    return `
        <div class="employee-input-card salesperson-card">
            <h4 class="employee-card-title salesperson-title">${salesperson.icon} ${salesperson.name}</h4>
            <p class="result-card-subtitle">${salesperson.role}</p>
            
            <label class="input-field-label">מסירות רכב</label>
            <input type="number" id="${prefix}-${salesperson.id}-cars" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">פוטנציאל טופ סרוויס</label>
            <input type="number" id="${prefix}-${salesperson.id}-topservice-pot" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">הרחבות אחריות (עמלה ידנית ₪)</label>
            <input type="number" id="${prefix}-${salesperson.id}-warranty-commission" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">חבילות שירות/טופ סרוויס (עמלה ידנית ₪)</label>
            <input type="number" id="${prefix}-${salesperson.id}-topservice-commission" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">רכבי הדגמה (₪)</label>
            <input type="number" id="${prefix}-${salesperson.id}-demo" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">הפרשי עמלות (₪)</label>
            <input type="number" id="${prefix}-${salesperson.id}-diff" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">עמלות מימון כלמוביל (₪)</label>
            <input type="number" id="${prefix}-${salesperson.id}-finance" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">עמלות טרייד כלמוביל (₪)</label>
            <input type="number" id="${prefix}-${salesperson.id}-tradein" class="input-field-compact" placeholder="0">
        </div>
    `;
}

function createKalmobilOperationsInputCard(prefix, operations) {
    return `
        <div class="employee-input-card operations-card">
            <h4 class="employee-card-title operations-title">${operations.icon} ${operations.name}</h4>
            <p class="result-card-subtitle">${operations.role}</p>
            
            <label class="input-field-label">הרחבות אחריות (עמלה ידנית ₪)</label>
            <input type="number" id="${prefix}-${operations.id}-warranty-commission" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">חבילות שירות/טופ סרוויס (עמלה ידנית ₪)</label>
            <input type="number" id="${prefix}-${operations.id}-topservice-commission" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">הפרשי עמלות (₪)</label>
            <input type="number" id="${prefix}-${operations.id}-diff" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">עמלות מימון כלמוביל (₪)</label>
            <input type="number" id="${prefix}-${operations.id}-finance" class="input-field-compact" placeholder="0">
            
            <label class="input-field-label">עמלות טרייד כלמוביל (₪)</label>
            <input type="number" id="${prefix}-${operations.id}-tradein" class="input-field-compact" placeholder="0">
        </div>
    `;
}

// ========================================
// כלמוביל - כרטיסי תוצאות
// ========================================

function createKalmobilManagerResultCard(prefix, manager) {
    return `
        <div class="employee-result-card manager-result">
            <div class="result-card-header">
                <h3 class="result-card-title manager">${manager.icon} ${manager.name}</h3>
                <p class="result-card-subtitle">${manager.role}</p>
            </div>
            
            <div class="result-line">
                <span class="result-label">מסירות רכב (מדרגות פיקס)</span>
                <span class="result-value" id="${prefix}-${manager.id}-cars-commission">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">יעד משולב (מסירות + 32% מימון)</span>
                <span class="result-value" id="${prefix}-${manager.id}-combined-bonus">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">יעד מלאי (40%+ מכירות מהמלאי)</span>
                <span class="result-value" id="${prefix}-${manager.id}-stock-bonus">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">הרחבות אחריות</span>
                <span class="result-value" id="${prefix}-${manager.id}-warranty-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">חבילות שירות/טופ סרוויס</span>
                <span class="result-value" id="${prefix}-${manager.id}-topservice-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">רכבי הדגמה</span>
                <span class="result-value" id="${prefix}-${manager.id}-demo-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">הפרשי עמלות</span>
                <span class="result-value" id="${prefix}-${manager.id}-diff-display">₪0</span>
            </div>
            
            <hr class="result-separator">
            
            <div class="component-line component-vehicles">
                <span>🚗 רכיב רכבים</span>
                <span id="${prefix}-${manager.id}-vehicles-display">₪0</span>
            </div>
            
            <div class="component-line component-finance">
                <span>💰 רכיב מימון</span>
                <span id="${prefix}-${manager.id}-finance-display">₪0</span>
            </div>
            
            <div class="component-line component-tradein">
                <span>🔄 רכיב טרייד אין</span>
                <span id="${prefix}-${manager.id}-tradein-display">₪0</span>
            </div>
            
            <div class="total-line">
                <span>סה"כ עמלות</span>
                <span id="${prefix}-${manager.id}-total-display">₪0</span>
            </div>
        </div>
    `;
}

function createKalmobilSalespersonResultCard(prefix, salesperson) {
    return `
        <div class="employee-result-card salesperson-result">
            <div class="result-card-header">
                <h3 class="result-card-title salesperson">${salesperson.icon} ${salesperson.name}</h3>
                <p class="result-card-subtitle">${salesperson.role}</p>
            </div>
            
            <div class="result-line">
                <span class="result-label">מסירות רכב (מדרגות + רטרו)</span>
                <span class="result-value" id="${prefix}-${salesperson.id}-cars-commission">₪0</span>
            </div>
            
            <div class="result-line" style="font-size: 0.85rem; color: #666; padding-right: 20px;">
                <span class="result-label">↳ פירוט עמלת מסירות</span>
                <span class="result-value" id="${prefix}-${salesperson.id}-cars-breakdown">פירוט</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">יעד משולב (מסירות + 32% מימון)</span>
                <span class="result-value" id="${prefix}-${salesperson.id}-combined-bonus">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">יעד מלאי (40%+ מכירות מהמלאי)</span>
                <span class="result-value" id="${prefix}-${salesperson.id}-stock-bonus">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">הרחבות אחריות</span>
                <span class="result-value" id="${prefix}-${salesperson.id}-warranty-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">חבילות שירות/טופ סרוויס</span>
                <span class="result-value" id="${prefix}-${salesperson.id}-topservice-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">רכבי הדגמה</span>
                <span class="result-value" id="${prefix}-${salesperson.id}-demo-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">הפרשי עמלות</span>
                <span class="result-value" id="${prefix}-${salesperson.id}-diff-display">₪0</span>
            </div>
            
            <hr class="result-separator">
            
            <div class="component-line component-vehicles">
                <span>🚗 רכיב רכבים</span>
                <span id="${prefix}-${salesperson.id}-vehicles-display">₪0</span>
            </div>
            
            <div class="component-line component-finance">
                <span>💰 רכיב מימון</span>
                <span id="${prefix}-${salesperson.id}-finance-display">₪0</span>
            </div>
            
            <div class="component-line component-tradein">
                <span>🔄 רכיב טרייד אין</span>
                <span id="${prefix}-${salesperson.id}-tradein-display">₪0</span>
            </div>
            
            <div class="total-line">
                <span>סה"כ עמלות</span>
                <span id="${prefix}-${salesperson.id}-total-display">₪0</span>
            </div>
        </div>
    `;
}

function createKalmobilOperationsResultCard(prefix, operations) {
    return `
        <div class="employee-result-card operations-result">
            <div class="result-card-header">
                <h3 class="result-card-title operations">${operations.icon} ${operations.name}</h3>
                <p class="result-card-subtitle">${operations.role}</p>
            </div>
            
            <div class="result-line">
                <span class="result-label">הרחבות אחריות</span>
                <span class="result-value" id="${prefix}-${operations.id}-warranty-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">חבילות שירות/טופ סרוויס</span>
                <span class="result-value" id="${prefix}-${operations.id}-topservice-display">₪0</span>
            </div>
            
            <div class="result-line">
                <span class="result-label">הפרשי עמלות</span>
                <span class="result-value" id="${prefix}-${operations.id}-diff-display">₪0</span>
            </div>
            
            <hr class="result-separator">
            
            <div class="component-line component-vehicles">
                <span>🚗 רכיב רכבים</span>
                <span id="${prefix}-${operations.id}-vehicles-display">₪0</span>
            </div>
            
            <div class="component-line component-finance">
                <span>💰 רכיב מימון</span>
                <span id="${prefix}-${operations.id}-finance-display">₪0</span>
            </div>
            
            <div class="component-line component-tradein">
                <span>🔄 רכיב טרייד אין</span>
                <span id="${prefix}-${operations.id}-tradein-display">₪0</span>
            </div>
            
            <div class="total-line">
                <span>סה"כ עמלות</span>
                <span id="${prefix}-${operations.id}-total-display">₪0</span>
            </div>
        </div>
    `;
}

// Export
window.createGenericMonthLayout = createGenericMonthLayout;

console.log('✓ Generic layout generator loaded');
