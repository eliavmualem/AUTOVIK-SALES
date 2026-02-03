// 🎨 מחולל עיצוב חדש - הפרדה בין הזנה לתוצאות

function createNewMonthLayout(month) {
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
                        <input type="number" id="hj-${month}-branch-target" class="input-field" placeholder="הזן יעד" oninput="updateBranchTargetStatus('${month}')">
                    </div>
                    <div class="goal-input-group">
                        <label>סה"כ מסירות בפועל</label>
                        <input type="number" id="hj-${month}-total-cars" class="input-field" readonly value="0">
                    </div>
                    <div class="goal-input-group">
                        <div class="branch-status-badge" id="hj-${month}-target-status">⏳ ממתין לנתונים</div>
                    </div>
                </div>
                <div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-radius: 8px; border: 2px solid #ffc107;">
                    <div style="font-weight: 600; color: #856404; margin-bottom: 5px;">💡 בונוס עמידה ביעד סניף:</div>
                    <div style="color: #856404; font-size: 0.9rem;">
                        אם הסניף עומד ביעד החודשי, <strong>כל נציג מכירות</strong> מקבל בונוס של <strong>10 ש"ח × סה"כ רכבי הסניף</strong>
                    </div>
                </div>
            </div>
            
            <!-- נתוני עובדים -->
            <div class="employees-input-grid">
                <!-- מאיר מועלם - מנהל -->
                <div class="employee-input-card manager-card">
                    <h4 class="employee-card-title manager-title">👔 מאיר מועלם</h4>
                    <p class="result-card-subtitle">מנהל אולם</p>
                    
                    <label class="input-field-label">מסירות רכב</label>
                    <input type="number" id="hj-${month}-meir-cars" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">רכבי הדגמה</label>
                    <input type="number" id="hj-${month}-meir-demo" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">הפרשי עמלות</label>
                    <input type="number" id="hj-${month}-meir-diff" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">מימון (כלמוביל)</label>
                    <input type="number" id="hj-${month}-meir-finance" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">טרייד אין (כלמוביל)</label>
                    <input type="number" id="hj-${month}-meir-tradein" class="input-field-compact" placeholder="0">
                </div>
                
                <!-- דניאל נגר -->
                <div class="employee-input-card salesperson-card">
                    <h4 class="employee-card-title salesperson-title">💼 דניאל נגר</h4>
                    <p class="result-card-subtitle">איש מכירות</p>
                    
                    <label class="input-field-label">יעד אישי (מסירות)</label>
                    <input type="number" id="hj-${month}-daniel-target" class="input-field-compact" placeholder="0" oninput="updateSimulation('${month}', 'daniel')">
                    
                    <label class="input-field-label">מסירות רכב בפועל</label>
                    <input type="number" id="hj-${month}-daniel-cars" class="input-field-compact" placeholder="0" oninput="updateSimulation('${month}', 'daniel')">
                    
                    <!-- סימולציה בזמן אמת -->
                    <div class="simulation-box" id="hj-${month}-daniel-simulation" style="margin-top: 10px; padding: 10px; background: #f0f8ff; border-radius: 8px; font-size: 0.9rem;">
                        <div style="font-weight: 600; margin-bottom: 5px;">🎯 סטטוס יעד אישי:</div>
                        <div id="hj-${month}-daniel-target-status" style="color: #666;">הזן יעד ומסירות</div>
                        <div style="margin-top: 8px; font-size: 0.85rem; color: #888;">
                            💡 100% = בונוס 20 ש"ח לרכב<br>
                            💡 110% = בונוס נוסף 10 ש"ח לרכב
                        </div>
                    </div>
                    
                    <label class="input-field-label">מכירות ביטוח</label>
                    <input type="number" id="hj-${month}-daniel-insurance" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">מכירות טופ סרוויס</label>
                    <input type="number" id="hj-${month}-daniel-topservice" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">פוטנציאל טופ סרוויס</label>
                    <input type="number" id="hj-${month}-daniel-topservice-potential" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">הרחבות אחריות</label>
                    <input type="number" id="hj-${month}-daniel-warranty" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">ציון לקוח סמוי (Mystery Shopper)</label>
                    <input type="number" id="hj-${month}-daniel-mystery" class="input-field-compact" placeholder="0-100" min="0" max="100" oninput="updateMysteryStatus('${month}', 'daniel')">
                    
                    <!-- סטטוס Mystery Shopper -->
                    <div class="mystery-status-box" id="hj-${month}-daniel-mystery-status" style="margin-top: 8px; padding: 8px; border-radius: 6px; font-size: 0.85rem; text-align: center;">
                        <span style="color: #999;">הזן ציון 0-100</span>
                    </div>
                    
                    <label class="input-field-label">רכבי הדגמה</label>
                    <input type="number" id="hj-${month}-daniel-demo" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">הפרשי עמלות</label>
                    <input type="number" id="hj-${month}-daniel-diff" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">מימון (כלמוביל)</label>
                    <input type="number" id="hj-${month}-daniel-finance" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">טרייד אין (כלמוביל)</label>
                    <input type="number" id="hj-${month}-daniel-tradein" class="input-field-compact" placeholder="0">
                </div>
                
                <!-- אלפרד בנד -->
                <div class="employee-input-card salesperson-card">
                    <h4 class="employee-card-title salesperson-title">💼 אלפרד בנד</h4>
                    <p class="result-card-subtitle">איש מכירות</p>
                    
                    <label class="input-field-label">יעד אישי (מסירות)</label>
                    <input type="number" id="hj-${month}-alfred-target" class="input-field-compact" placeholder="0" oninput="updateSimulation('${month}', 'alfred')">
                    
                    <label class="input-field-label">מסירות רכב בפועל</label>
                    <input type="number" id="hj-${month}-alfred-cars" class="input-field-compact" placeholder="0" oninput="updateSimulation('${month}', 'alfred')">
                    
                    <!-- סימולציה בזמן אמת -->
                    <div class="simulation-box" id="hj-${month}-alfred-simulation" style="margin-top: 10px; padding: 10px; background: #f0f8ff; border-radius: 8px; font-size: 0.9rem;">
                        <div style="font-weight: 600; margin-bottom: 5px;">🎯 סטטוס יעד אישי:</div>
                        <div id="hj-${month}-alfred-target-status" style="color: #666;">הזן יעד ומסירות</div>
                        <div style="margin-top: 8px; font-size: 0.85rem; color: #888;">
                            💡 100% = בונוס 20 ש"ח לרכב<br>
                            💡 110% = בונוס נוסף 10 ש"ח לרכב
                        </div>
                    </div>
                    
                    <label class="input-field-label">מכירות ביטוח</label>
                    <input type="number" id="hj-${month}-alfred-insurance" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">מכירות טופ סרוויס</label>
                    <input type="number" id="hj-${month}-alfred-topservice" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">פוטנציאל טופ סרוויס</label>
                    <input type="number" id="hj-${month}-alfred-topservice-potential" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">הרחבות אחריות</label>
                    <input type="number" id="hj-${month}-alfred-warranty" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">ציון לקוח סמוי (Mystery Shopper)</label>
                    <input type="number" id="hj-${month}-alfred-mystery" class="input-field-compact" placeholder="0-100" min="0" max="100" oninput="updateMysteryStatus('${month}', 'alfred')">
                    
                    <!-- סטטוס Mystery Shopper -->
                    <div class="mystery-status-box" id="hj-${month}-alfred-mystery-status" style="margin-top: 8px; padding: 8px; border-radius: 6px; font-size: 0.85rem; text-align: center;">
                        <span style="color: #999;">הזן ציון 0-100</span>
                    </div>
                    
                    <label class="input-field-label">רכבי הדגמה</label>
                    <input type="number" id="hj-${month}-alfred-demo" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">הפרשי עמלות</label>
                    <input type="number" id="hj-${month}-alfred-diff" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">מימון (כלמוביל)</label>
                    <input type="number" id="hj-${month}-alfred-finance" class="input-field-compact" placeholder="0">
                    
                    <label class="input-field-label">טרייד אין (כלמוביל)</label>
                    <input type="number" id="hj-${month}-alfred-tradein" class="input-field-compact" placeholder="0">
                </div>
                
                <!-- דניאל אליה - תפעול -->
                <div class="employee-input-card operations-card">
                    <h4 class="employee-card-title operations-title">⚙️ דניאל אליה</h4>
                    <p class="result-card-subtitle">איש תפעול</p>
                    
                    <label class="input-field-label">מכירות ביטוח</label>
                    <input type="number" id="hj-${month}-daniele-insurance" class="input-field-compact" placeholder="0">
                </div>
            </div>
            
            <!-- כפתורי פעולה -->
            <div class="action-buttons-row">
                <button class="action-button calculate" onclick="calculateMonth('${month}')">🧮 חשב עמלות</button>
                <button class="action-button save" onclick="saveCurrentMonth('${month}')">💾 שמור נתונים</button>
                <button class="action-button clear" onclick="clearMonthForm('${month}')">🗑️ נקה טופס</button>
            </div>
        </div>
        
        <!-- 📈 טבלת סיכום ביצועים -->
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
                <tbody id="hj-${month}-performance-tbody">
                    <tr>
                        <td><strong>מסירות רכב</strong></td>
                        <td id="hj-${month}-perf-cars-target">-</td>
                        <td id="hj-${month}-perf-cars-actual">-</td>
                        <td id="hj-${month}-perf-cars-percent">-</td>
                        <td><span id="hj-${month}-perf-cars-status" class="status-cell">-</span></td>
                    </tr>
                    <tr>
                        <td><strong>טופ סרוויס</strong></td>
                        <td id="hj-${month}-perf-topservice-target">-</td>
                        <td id="hj-${month}-perf-topservice-actual">-</td>
                        <td id="hj-${month}-perf-topservice-percent">-</td>
                        <td><span id="hj-${month}-perf-topservice-status" class="status-cell">-</span></td>
                    </tr>
                    <tr>
                        <td><strong>ביטוח</strong></td>
                        <td id="hj-${month}-perf-insurance-target">-</td>
                        <td id="hj-${month}-perf-insurance-actual">-</td>
                        <td id="hj-${month}-perf-insurance-percent">-</td>
                        <td><span id="hj-${month}-perf-insurance-status" class="status-cell">-</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- 🎯 אזור תוצאות - 4 כרטיסים -->
        <div class="results-area-wrapper">
            <h2 class="results-area-title">🎯 פירוט עמלות לכל עובד</h2>
            
            <div class="results-cards-grid">
                <!-- מאיר מועלם -->
                <div class="employee-result-card manager-result">
                    <div class="result-card-header">
                        <h3 class="result-card-title manager">👔 מאיר מועלם</h3>
                        <p class="result-card-subtitle">מנהל אולם</p>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">עמלות מסירות (200 ש"ח × כמות)</span>
                        <span class="result-value" id="hj-${month}-meir-base-display">₪0</span>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">רכבי הדגמה</span>
                        <span class="result-value" id="hj-${month}-meir-demo-display">₪0</span>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">הפרשי עמלות</span>
                        <span class="result-value" id="hj-${month}-meir-diff-display">₪0</span>
                    </div>
                    
                    <hr class="result-separator">
                    
                    <div class="component-line component-vehicles">
                        <span>🚗 רכיב רכבים</span>
                        <span id="hj-${month}-meir-vehicles-display">₪0</span>
                    </div>
                    
                    <div class="component-line component-tradein">
                        <span>🔄 רכיב טרייד אין</span>
                        <span id="hj-${month}-meir-tradein-display">₪0</span>
                    </div>
                    
                    <div class="component-line component-finance">
                        <span>💰 רכיב מימון</span>
                        <span id="hj-${month}-meir-finance-display">₪0</span>
                    </div>
                    
                    <div class="total-line">
                        <span>סה"כ עמלות</span>
                        <span id="hj-${month}-meir-total-display">₪0</span>
                    </div>
                </div>
                
                <!-- דניאל נגר -->
                <div class="employee-result-card salesperson-result">
                    <div class="result-card-header">
                        <h3 class="result-card-title salesperson">💼 דניאל נגר</h3>
                        <p class="result-card-subtitle">איש מכירות</p>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">עמלות מסירות רכב (כולל בונוסים)</span>
                        <span class="result-value" id="hj-${month}-daniel-base-commission">₪0</span>
                    </div>
                    
                    <div class="result-line" style="font-size: 0.85rem; color: #666; padding-right: 20px;">
                        <span class="result-label">↳ פירוט עמלת מסירות</span>
                        <span class="result-value" id="hj-${month}-daniel-vehicles-breakdown">בסיס + בונוסים</span>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">ביטוח (75 ש"ח × כמות)</span>
                        <span class="result-value" id="hj-${month}-daniel-insurance-display">₪0</span>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">טופ סרוויס</span>
                        <span class="result-value" id="hj-${month}-daniel-topservice-display">₪0</span>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">הרחבות אחריות (60 ש"ח × כמות)</span>
                        <span class="result-value" id="hj-${month}-daniel-warranty-display">₪0</span>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">התאמת לקוח סמוי</span>
                        <span class="result-value" id="hj-${month}-daniel-mystery-display">₪0</span>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">רכבי הדגמה</span>
                        <span class="result-value" id="hj-${month}-daniel-demo-display">₪0</span>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">הפרשי עמלות</span>
                        <span class="result-value" id="hj-${month}-daniel-diff-display">₪0</span>
                    </div>
                    
                    <hr class="result-separator">
                    
                    <div class="component-line component-vehicles">
                        <span>🚗 רכיב רכבים</span>
                        <span id="hj-${month}-daniel-vehicles-display">₪0</span>
                    </div>
                    
                    <div class="component-line component-tradein">
                        <span>🔄 רכיב טרייד אין</span>
                        <span id="hj-${month}-daniel-tradein-display">₪0</span>
                    </div>
                    
                    <div class="component-line component-finance">
                        <span>💰 רכיב מימון</span>
                        <span id="hj-${month}-daniel-finance-display">₪0</span>
                    </div>
                    
                    <div class="total-line">
                        <span>סה"כ עמלות</span>
                        <span id="hj-${month}-daniel-total-display">₪0</span>
                    </div>
                </div>
                
                <!-- אלפרד בנד -->
                <div class="employee-result-card salesperson-result">
                    <div class="result-card-header">
                        <h3 class="result-card-title salesperson">💼 אלפרד בנד</h3>
                        <p class="result-card-subtitle">איש מכירות</p>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">עמלות מסירות רכב (כולל בונוסים)</span>
                        <span class="result-value" id="hj-${month}-alfred-base-commission">₪0</span>
                    </div>
                    
                    <div class="result-line" style="font-size: 0.85rem; color: #666; padding-right: 20px;">
                        <span class="result-label">↳ פירוט עמלת מסירות</span>
                        <span class="result-value" id="hj-${month}-alfred-vehicles-breakdown">בסיס + בונוסים</span>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">ביטוח (75 ש"ח × כמות)</span>
                        <span class="result-value" id="hj-${month}-alfred-insurance-display">₪0</span>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">טופ סרוויס</span>
                        <span class="result-value" id="hj-${month}-alfred-topservice-display">₪0</span>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">הרחבות אחריות (60 ש"ח × כמות)</span>
                        <span class="result-value" id="hj-${month}-alfred-warranty-display">₪0</span>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">התאמת לקוח סמוי</span>
                        <span class="result-value" id="hj-${month}-alfred-mystery-display">₪0</span>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">רכבי הדגמה</span>
                        <span class="result-value" id="hj-${month}-alfred-demo-display">₪0</span>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">הפרשי עמלות</span>
                        <span class="result-value" id="hj-${month}-alfred-diff-display">₪0</span>
                    </div>
                    
                    <hr class="result-separator">
                    
                    <div class="component-line component-vehicles">
                        <span>🚗 רכיב רכבים</span>
                        <span id="hj-${month}-alfred-vehicles-display">₪0</span>
                    </div>
                    
                    <div class="component-line component-tradein">
                        <span>🔄 רכיב טרייד אין</span>
                        <span id="hj-${month}-alfred-tradein-display">₪0</span>
                    </div>
                    
                    <div class="component-line component-finance">
                        <span>💰 רכיב מימון</span>
                        <span id="hj-${month}-alfred-finance-display">₪0</span>
                    </div>
                    
                    <div class="total-line">
                        <span>סה"כ עמלות</span>
                        <span id="hj-${month}-alfred-total-display">₪0</span>
                    </div>
                </div>
                
                <!-- דניאל אליה -->
                <div class="employee-result-card operations-result">
                    <div class="result-card-header">
                        <h3 class="result-card-title operations">⚙️ דניאל אליה</h3>
                        <p class="result-card-subtitle">איש תפעול</p>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">טופ סרוויס (ביצועי סניף)</span>
                        <span class="result-value" id="hj-${month}-daniele-topservice-display">₪0</span>
                    </div>
                    
                    <div class="result-line">
                        <span class="result-label">ביטוח (75 ש"ח × כמות)</span>
                        <span class="result-value" id="hj-${month}-daniele-insurance-display">₪0</span>
                    </div>
                    
                    <hr class="result-separator">
                    
                    <div class="component-line component-vehicles">
                        <span>🚗 רכיב רכבים</span>
                        <span id="hj-${month}-daniele-vehicles-display">₪0</span>
                    </div>
                    
                    <div class="total-line">
                        <span>סה"כ עמלות</span>
                        <span id="hj-${month}-daniele-total-display">₪0</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Export the function to be available globally
window.createNewMonthLayout = createNewMonthLayout;
