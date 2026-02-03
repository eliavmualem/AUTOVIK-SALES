// 🎮 עוזרי סימולציה בזמן אמת

// עדכון סטטוס יעד אישי
function updateSimulation(month, employeeId) {
    const prefix = 'hj-' + month;
    const targetId = `${prefix}-${employeeId}-target`;
    const carsId = `${prefix}-${employeeId}-cars`;
    const statusId = `${prefix}-${employeeId}-target-status`;
    
    const target = parseFloat(document.getElementById(targetId)?.value) || 0;
    const cars = parseFloat(document.getElementById(carsId)?.value) || 0;
    const statusEl = document.getElementById(statusId);
    
    if (!statusEl) return;
    
    if (target === 0) {
        statusEl.innerHTML = '<span style="color: #999;">הזן יעד ומסירות</span>';
        return;
    }
    
    const percent = (cars / target) * 100;
    let html = '';
    let color = '';
    
    if (percent >= 110) {
        color = '#28a745';
        html = `
            <div style="color: ${color}; font-weight: 600;">
                ✅ ${Math.round(percent)}% מהיעד (${cars}/${target})
            </div>
            <div style="margin-top: 5px; color: ${color}; font-size: 0.9rem;">
                🎉 בונוס 100%: +${cars * 20} ש"ח<br>
                🎉 בונוס 110%: +${cars * 10} ש"ח<br>
                💰 סה"כ בונוס: +${cars * 30} ש"ח
            </div>
        `;
    } else if (percent >= 100) {
        color = '#20c997';
        html = `
            <div style="color: ${color}; font-weight: 600;">
                ✅ ${Math.round(percent)}% מהיעד (${cars}/${target})
            </div>
            <div style="margin-top: 5px; color: ${color}; font-size: 0.9rem;">
                🎉 בונוס 100%: +${cars * 20} ש"ח
            </div>
        `;
    } else if (percent >= 80) {
        color = '#ffc107';
        html = `
            <div style="color: ${color}; font-weight: 600;">
                ⚠️ ${Math.round(percent)}% מהיעד (${cars}/${target})
            </div>
            <div style="margin-top: 5px; color: #666; font-size: 0.9rem;">
                עוד ${Math.ceil(target - cars)} רכבים לבונוס 100%
            </div>
        `;
    } else {
        color = '#dc3545';
        html = `
            <div style="color: ${color}; font-weight: 600;">
                ❌ ${Math.round(percent)}% מהיעד (${cars}/${target})
            </div>
            <div style="margin-top: 5px; color: #666; font-size: 0.9rem;">
                עוד ${Math.ceil(target - cars)} רכבים לבונוס 100%
            </div>
        `;
    }
    
    statusEl.innerHTML = html;
}

// עדכון סטטוס Mystery Shopper
function updateMysteryStatus(month, employeeId) {
    const prefix = 'hj-' + month;
    const mysteryId = `${prefix}-${employeeId}-mystery`;
    const statusId = `${prefix}-${employeeId}-mystery-status`;
    
    const mystery = parseFloat(document.getElementById(mysteryId)?.value) || 0;
    const statusEl = document.getElementById(statusId);
    
    if (!statusEl) return;
    
    if (mystery === 0) {
        statusEl.innerHTML = '<span style="color: #999;">הזן ציון 0-100</span>';
        statusEl.style.background = '#f5f5f5';
        return;
    }
    
    let html = '';
    let bgColor = '';
    let textColor = '';
    
    if (mystery < 80) {
        bgColor = '#ffe5e5';
        textColor = '#dc3545';
        html = `
            <div style="color: ${textColor}; font-weight: 600;">
                ⚠️ קיזוז 20% מעמלת הרכבים
            </div>
            <div style="margin-top: 3px; font-size: 0.85rem;">
                ציון ${mystery} מתחת ל-80
            </div>
        `;
    } else if (mystery < 90) {
        bgColor = '#e8f4f8';
        textColor = '#17a2b8';
        html = `
            <div style="color: ${textColor}; font-weight: 600;">
                ✅ ללא שינוי בעמלות
            </div>
            <div style="margin-top: 3px; font-size: 0.85rem;">
                ציון ${mystery} (80-89)
            </div>
        `;
    } else {
        bgColor = '#e8f8e8';
        textColor = '#28a745';
        html = `
            <div style="color: ${textColor}; font-weight: 600;">
                🎉 בונוס 20% על עמלת הרכבים!
            </div>
            <div style="margin-top: 3px; font-size: 0.85rem;">
                ציון ${mystery} מעל 90
            </div>
        `;
    }
    
    statusEl.innerHTML = html;
    statusEl.style.background = bgColor;
}

// עדכון סטטוס יעד סניף
function updateBranchTargetStatus(month) {
    const prefix = 'hj-' + month;
    const branchTargetId = `${prefix}-branch-target`;
    const totalCarsId = `${prefix}-total-cars`;
    const statusId = `${prefix}-target-status`;
    
    const branchTarget = parseFloat(document.getElementById(branchTargetId)?.value) || 0;
    const totalCars = parseFloat(document.getElementById(totalCarsId)?.value) || 0;
    const statusEl = document.getElementById(statusId);
    
    if (!statusEl) return;
    
    if (branchTarget === 0) {
        statusEl.innerHTML = '⏳ ממתין לנתונים';
        statusEl.style.background = '#f5f5f5';
        statusEl.style.color = '#999';
        return;
    }
    
    const percent = Math.round((totalCars / branchTarget) * 100);
    
    if (totalCars >= branchTarget) {
        statusEl.innerHTML = `✅ עמד ביעד! (${percent}%)<br><small>כל הנציגים יקבלו בונוס סניף</small>`;
        statusEl.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        statusEl.style.color = 'white';
    } else {
        statusEl.innerHTML = `⚠️ טרם עמד ביעד (${percent}%)<br><small>עוד ${branchTarget - totalCars} רכבים ליעד</small>`;
        statusEl.style.background = 'linear-gradient(135deg, #ffc107, #fd7e14)';
        statusEl.style.color = '#333';
    }
}

console.log('✓ simulation-helpers.js loaded');
