// ניהול שמירה וטעינה של נתונים ב-LocalStorage

const STORAGE_KEY = 'autoweek_commissions_2026';

// שמירת נתונים לחודש ספציפי
function saveMonthData(showroom, month, data) {
    const allData = getAllData();
    
    if (!allData[showroom]) {
        allData[showroom] = {};
    }
    
    allData[showroom][month] = {
        ...data,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    showSaveIndicator();
}

// טעינת נתונים לחודש ספציפי
function loadMonthData(showroom, month) {
    const allData = getAllData();
    
    if (allData[showroom] && allData[showroom][month]) {
        return allData[showroom][month];
    }
    
    return null;
}

// קבלת כל הנתונים
function getAllData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
}

// מחיקת נתונים לחודש ספציפי
function deleteMonthData(showroom, month) {
    const allData = getAllData();
    
    if (allData[showroom] && allData[showroom][month]) {
        delete allData[showroom][month];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    }
}

// קבלת סיכום שנתי לאולם
function getYearlySummary(showroom) {
    const allData = getAllData();
    const summary = {
        employees: {},
        months: []
    };
    
    if (!allData[showroom]) {
        return summary;
    }
    
    // עבור על כל החודשים
    const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
                    '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'];
    
    months.forEach(month => {
        if (allData[showroom][month]) {
            summary.months.push(month);
            const monthData = allData[showroom][month];
            
            // צבור נתונים לכל עובד
            Object.keys(monthData).forEach(employeeKey => {
                if (employeeKey !== 'lastUpdated' && typeof monthData[employeeKey] === 'object') {
                    if (!summary.employees[employeeKey]) {
                        summary.employees[employeeKey] = {
                            totalVehicles: 0,
                            totalTradeIn: 0,
                            totalFinance: 0,
                            totalCommissions: 0,
                            monthlyData: {}
                        };
                    }
                    
                    const employee = monthData[employeeKey];
                    summary.employees[employeeKey].totalVehicles += employee.vehiclesComponent || 0;
                    summary.employees[employeeKey].totalTradeIn += employee.tradeInComponent || 0;
                    summary.employees[employeeKey].totalFinance += employee.financeComponent || 0;
                    summary.employees[employeeKey].totalCommissions += employee.total || 0;
                    summary.employees[employeeKey].monthlyData[month] = employee;
                }
            });
        }
    });
    
    return summary;
}

// הצגת אינדיקטור שמירה
function showSaveIndicator() {
    let indicator = document.getElementById('save-indicator');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'save-indicator';
        indicator.className = 'save-indicator';
        indicator.textContent = '✓ נשמר בהצלחה';
        document.body.appendChild(indicator);
    }
    
    indicator.classList.add('show');
    
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 2000);
}

// ייצוא נתונים ל-JSON (לגיבוי)
function exportAllData() {
    const allData = getAllData();
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `autoweek_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// ייבוא נתונים מ-JSON
function importData(fileInput) {
    const file = fileInput.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            alert('הנתונים יובאו בהצלחה! רענן את הדף לראות את השינויים.');
            location.reload();
        } catch (error) {
            alert('שגיאה בייבוא הקובץ. ודא שהקובץ תקין.');
        }
    };
    reader.readAsText(file);
}
