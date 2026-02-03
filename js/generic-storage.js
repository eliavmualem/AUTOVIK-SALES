// 💾 פונקציות שמירה וטעינה גנריות
// Uses the same STORAGE_KEY as storage.js

// Helper functions for localStorage
function getAllGenericData(showroom) {
    const STORAGE_KEY = 'autoweek_commissions_2026';
    const data = localStorage.getItem(STORAGE_KEY);
    const allData = data ? JSON.parse(data) : {};
    return showroom ? (allData[showroom] || {}) : allData;
}

function saveGenericMonthData(showroom, month, data) {
    const STORAGE_KEY = 'autoweek_commissions_2026';
    const allData = getAllGenericData(); // Get all showrooms data
    if (!allData[showroom]) allData[showroom] = {};
    allData[showroom][month] = {
        ...data,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    console.log(`✓ Saved ${showroom} ${month} to ${STORAGE_KEY}`);
}

function loadGenericMonthData(showroom, month) {
    const allData = getAllGenericData(); // Get all showrooms data
    return allData[showroom]?.[month] || null;
}

// Save current month for any showroom
window.saveGenericMonth = function(showroomId, month) {
    console.log('💾 Saving data for', showroomId, month);
    
    // First calculate to ensure we have the latest results
    calculateGenericMonth(showroomId, month);
    
    // Collect input data
    const inputData = collectGenericMonthData(showroomId, month);
    console.log('  - Collected input data:', Object.keys(inputData).length, 'fields');
    
    // Add calculated results (EXACT FORMAT AS calc-simple.js)
    if (window.lastCalculatedResults && window.lastCalculatedResults[month]) {
        inputData.calculatedResults = window.lastCalculatedResults[month];
        console.log('  - Added calculated results:', inputData.calculatedResults);
    } else {
        console.warn('  - ⚠️ No calculated results found!');
    }
    
    saveGenericMonthData(showroomId, month, inputData);
    console.log('✓ Data saved for', showroomId, month);
    
    // Show success message with details
    const hasCalcResults = inputData.calculatedResults ? 'כן ✅' : 'לא ❌';
    alert(`✓ הנתונים נשמרו בהצלחה!\n\nאולם: ${getShowroomConfig(showroomId).name}\nחודש: ${month}\nשדות שנשמרו: ${Object.keys(inputData).length}\nתוצאות מחושבות: ${hasCalcResults}\n\nכדי לראות בסיכום השנתי, לך לטאב "סיכום שנתי"`);
};

// Collect month data from form
function collectGenericMonthData(showroomId, month) {
    const config = getShowroomConfig(showroomId);
    const prefix = config.prefix + '-' + month;
    const data = {};
    
    const inputs = document.querySelectorAll(`[id^="${prefix}-"]`);
    
    inputs.forEach(input => {
        // Collect all input fields
        if (input.tagName === 'INPUT' && input.type === 'number' && !input.disabled) {
            data[input.id] = parseFloat(input.value) || 0;
        }
    });
    
    console.log('Collected data for', showroomId, month, ':', Object.keys(data).length, 'fields');
    return data;
}

// Clear month form
window.clearGenericMonthForm = function(showroomId, month) {
    if (!confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים בחודש זה?')) {
        return;
    }
    
    const config = getShowroomConfig(showroomId);
    const prefix = config.prefix + '-' + month;
    
    const inputs = document.querySelectorAll(`[id^="${prefix}-"]`);
    inputs.forEach(input => {
        if (input.tagName === 'INPUT' && input.type === 'number' && !input.disabled) {
            input.value = '';
        }
    });
    
    // Clear from localStorage
    const allData = getAllData();
    if (allData[showroomId] && allData[showroomId][month]) {
        delete allData[showroomId][month];
        localStorage.setItem('autovick-commissions', JSON.stringify(allData));
    }
    
    // Recalculate
    calculateGenericMonth(showroomId, month);
    
    alert('✓ הטופס נוקה בהצלחה');
};

// Load month data and populate form
window.loadGenericMonthDataAndPopulate = function(showroomId, month) {
    const data = loadGenericMonthData(showroomId, month);
    if (data) {
        populateGenericFormWithData(showroomId, month, data);
        calculateGenericMonth(showroomId, month);
    }
}

// Populate form with saved data
function populateGenericFormWithData(showroomId, month, data) {
    Object.keys(data).forEach(key => {
        if (key !== 'lastUpdated' && key !== 'calculatedResults') {
            const input = document.getElementById(key);
            if (input && typeof data[key] !== 'object') {
                input.value = data[key];
            }
        }
    });
}

console.log('✓ Generic storage functions loaded');
