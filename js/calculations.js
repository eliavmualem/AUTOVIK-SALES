// חישוב עמלות לחודש ספציפי
window.calculateMonth = function(month) {
    console.log('=== calculateMonth START ===');
    console.log('Month:', month);
    
    // Check if helper functions exist
    if (typeof window.getInputValue !== 'function') {
        console.error('getInputValue not found!');
        return;
    }
    
    // Create local aliases for helper functions
    const getInputValue = window.getInputValue;
    const setDisplayValue = window.setDisplayValue;
    
    const prefix = `hj-${month}`;
    
    // קריאת יעדים
    const branchTarget = window.getInputValue(`${prefix}-branch-target`);
    console.log('Branch target ID:', `${prefix}-branch-target`, 'Value:', branchTarget);
    
    // קריאת נתוני דניאל נגר
    const danielData = {
        target: getInputValue(`${prefix}-daniel-target`),
        cars: getInputValue(`${prefix}-daniel-cars`),
        insurance: getInputValue(`${prefix}-daniel-insurance`),
        topService: getInputValue(`${prefix}-daniel-topservice`),
        topServicePotential: getInputValue(`${prefix}-daniel-topservice-potential`),
        warranty: getInputValue(`${prefix}-daniel-warranty`),
        mystery: getInputValue(`${prefix}-daniel-mystery`),
        demo: getInputValue(`${prefix}-daniel-demo`),
        finance: getInputValue(`${prefix}-daniel-finance`),
        tradeIn: getInputValue(`${prefix}-daniel-tradein`)
    };
    
    // קריאת נתוני אלפרד בנד
    const alfredData = {
        target: getInputValue(`${prefix}-alfred-target`),
        cars: getInputValue(`${prefix}-alfred-cars`),
        insurance: getInputValue(`${prefix}-alfred-insurance`),
        topService: getInputValue(`${prefix}-alfred-topservice`),
        topServicePotential: getInputValue(`${prefix}-alfred-topservice-potential`),
        warranty: getInputValue(`${prefix}-alfred-warranty`),
        mystery: getInputValue(`${prefix}-alfred-mystery`),
        demo: getInputValue(`${prefix}-alfred-demo`),
        finance: getInputValue(`${prefix}-alfred-finance`),
        tradeIn: getInputValue(`${prefix}-alfred-tradein`)
    };
    
    // קריאת נתוני דניאל אליה (תפעול)
    const danielEData = {
        insurance: getInputValue(`${prefix}-daniel-e-insurance`)
    };
    
    // קריאת נתוני מאיר מועלם (מנהל)
    const meirData = {
        finance: getInputValue(`${prefix}-meir-finance`),
        tradeIn: getInputValue(`${prefix}-meir-tradein`),
        demo: getInputValue(`${prefix}-meir-demo`)
    };
    
    // סה"כ מסירות בסניף
    const totalBranchCars = danielData.cars + alfredData.cars;
    
    // עדכון תצוגת סה"כ מסירות
    const totalCarsInput = document.getElementById(`${prefix}-total-cars`);
    if (totalCarsInput) {
        totalCarsInput.value = totalBranchCars;
    }
    
    // בדיקה אם הסניף עמד ביעד
    const branchMetTarget = branchTarget > 0 && totalBranchCars >= branchTarget;
    
    // עדכון סטטוס יעד
    const targetStatus = document.getElementById(`${prefix}-target-status`);
    if (targetStatus && branchTarget > 0) {
        const percentage = Math.round((totalBranchCars / branchTarget) * 100);
        if (branchMetTarget) {
            targetStatus.innerHTML = `✅ עמד ביעד! (${percentage}%)`;
            targetStatus.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            targetStatus.style.color = 'white';
        } else {
            targetStatus.innerHTML = `⚠️ טרם עמד ביעד (${percentage}%)`;
            targetStatus.style.background = 'linear-gradient(135deg, #ffc107, #fd7e14)';
            targetStatus.style.color = '#333';
        }
    } else if (targetStatus) {
        targetStatus.innerHTML = '⏳ הזן יעד סניף';
        targetStatus.style.background = '#f8f9fa';
        targetStatus.style.color = '#6c757d';
    }
    
    // חישוב עמלות דניאל נגר
    const danielResults = calculateSalespersonCommissions(
        danielData.cars,
        danielData.target,
        danielData.insurance,
        danielData.topService,
        danielData.topServicePotential,
        danielData.warranty,
        danielData.mystery,
        danielData.demo,
        totalBranchCars,
        branchMetTarget
    );
    
    // הצגת תוצאות דניאל - פירוט מלא
    setDisplayValue(`${prefix}-daniel-base-commission`, danielResults.vehiclesCommission);
    setDisplayValue(`${prefix}-daniel-insurance-commission`, danielResults.insuranceCommission);
    setDisplayValue(`${prefix}-daniel-topservice-commission`, danielResults.topServiceCommission);
    setDisplayValue(`${prefix}-daniel-warranty-commission`, danielResults.warrantyCommission);
    setDisplayValue(`${prefix}-daniel-mystery-adjustment`, danielResults.mysteryAdjustment);
    setDisplayValue(`${prefix}-daniel-demo-display`, danielData.demo);
    // סיכום ל-3 רכיבים
    setDisplayValue(`${prefix}-daniel-vehicles`, danielResults.vehiclesComponent);
    setDisplayValue(`${prefix}-daniel-tradein-display`, danielData.tradeIn);
    setDisplayValue(`${prefix}-daniel-finance-display`, danielData.finance);
    setDisplayValue(`${prefix}-daniel-total`, danielResults.vehiclesComponent + danielData.tradeIn + danielData.finance);
    
    // חישוב עמלות אלפרד בנד
    const alfredResults = calculateSalespersonCommissions(
        alfredData.cars,
        alfredData.target,
        alfredData.insurance,
        alfredData.topService,
        alfredData.topServicePotential,
        alfredData.warranty,
        alfredData.mystery,
        alfredData.demo,
        totalBranchCars,
        branchMetTarget
    );
    
    // הצגת תוצאות אלפרד - פירוט מלא
    setDisplayValue(`${prefix}-alfred-base-commission`, alfredResults.vehiclesCommission);
    setDisplayValue(`${prefix}-alfred-insurance-commission`, alfredResults.insuranceCommission);
    setDisplayValue(`${prefix}-alfred-topservice-commission`, alfredResults.topServiceCommission);
    setDisplayValue(`${prefix}-alfred-warranty-commission`, alfredResults.warrantyCommission);
    setDisplayValue(`${prefix}-alfred-mystery-adjustment`, alfredResults.mysteryAdjustment);
    setDisplayValue(`${prefix}-alfred-demo-display`, alfredData.demo);
    // סיכום ל-3 רכיבים
    setDisplayValue(`${prefix}-alfred-vehicles`, alfredResults.vehiclesComponent);
    setDisplayValue(`${prefix}-alfred-tradein-display`, alfredData.tradeIn);
    setDisplayValue(`${prefix}-alfred-finance-display`, alfredData.finance);
    setDisplayValue(`${prefix}-alfred-total`, alfredResults.vehiclesComponent + alfredData.tradeIn + alfredData.finance);
    
    // חישוב עמלות דניאל אליה (תפעול)
    const totalTopService = danielData.topService + alfredData.topService;
    const topServicePercentage = totalBranchCars > 0 ? (totalTopService / totalBranchCars) * 100 : 0;
    
    let danielETopServiceRate = 50; // בסיס
    if (topServicePercentage >= 70) {
        danielETopServiceRate = 80;
    } else if (topServicePercentage >= 60) {
        danielETopServiceRate = 70;
    }
    
    const danielETopServiceCommission = totalTopService * danielETopServiceRate;
    const danielEInsuranceCommission = danielEData.insurance * 75;
    const danielEVehiclesComponent = danielETopServiceCommission + danielEInsuranceCommission;
    
    // הצגת תוצאות דניאל אליה - פירוט מלא
    setDisplayValue(`${prefix}-daniel-e-topservice-commission`, danielETopServiceCommission);
    setDisplayValue(`${prefix}-daniel-e-insurance-commission`, danielEInsuranceCommission);
    // סיכום
    setDisplayValue(`${prefix}-daniel-e-vehicles`, danielEVehiclesComponent);
    setDisplayValue(`${prefix}-daniel-e-total`, danielEVehiclesComponent);
    
    // חישוב עמלות מאיר מועלם (מנהל)
    const meirBaseCommission = totalBranchCars * 200;
    const meirVehiclesComponent = meirBaseCommission + meirData.demo;
    
    // הצגת תוצאות מאיר - פירוט מלא
    setDisplayValue(`${prefix}-meir-base-commission`, meirBaseCommission);
    setDisplayValue(`${prefix}-meir-demo-display`, meirData.demo);
    // סיכום ל-3 רכיבים
    setDisplayValue(`${prefix}-meir-vehicles`, meirVehiclesComponent);
    setDisplayValue(`${prefix}-meir-tradein-display`, meirData.tradeIn);
    setDisplayValue(`${prefix}-meir-finance-display`, meirData.finance);
    setDisplayValue(`${prefix}-meir-total`, meirVehiclesComponent + meirData.tradeIn + meirData.finance);
    
    // שמירת נתונים מחושבים לשימוש בסיכום שנתי
    saveCalculatedResults(month, {
        meir: {
            vehiclesComponent: meirVehiclesComponent,
            tradeInComponent: meirData.tradeIn,
            financeComponent: meirData.finance,
            total: meirVehiclesComponent + meirData.tradeIn + meirData.finance
        },
        daniel: {
            vehiclesComponent: danielResults.vehiclesComponent,
            tradeInComponent: danielData.tradeIn,
            financeComponent: danielData.finance,
            total: danielResults.vehiclesComponent + danielData.tradeIn + danielData.finance
        },
        alfred: {
            vehiclesComponent: alfredResults.vehiclesComponent,
            tradeInComponent: alfredData.tradeIn,
            financeComponent: alfredData.finance,
            total: alfredResults.vehiclesComponent + alfredData.tradeIn + alfredData.finance
        },
        daniel_e: {
            vehiclesComponent: danielEVehiclesComponent,
            tradeInComponent: 0,
            financeComponent: 0,
            total: danielEVehiclesComponent
        }
    });
    
    // עדכון טבלת סיכום ביצועי סניף
    const totalTopService = danielData.topService + alfredData.topService;
    const totalTopServicePotential = danielData.topServicePotential + alfredData.topServicePotential;
    updateBranchSummaryTable(month, branchTarget, totalBranchCars, totalTopService, totalTopServicePotential);
    
    console.log('=== calculateMonth END ===');
};

// חישוב עמלות איש מכירות - מחזיר רכיב רכבים מאוחד
window.calculateSalespersonCommissions = function(
    personalCars,
    personalTarget,
    insurance,
    topService,
    topServicePotential,
    warranty,
    mysteryScore,
    demo,
    totalBranchCars,
    branchMetTarget
) {
    let vehiclesCommission = 0;
    
    // עמלה בסיסית: 150 ש"ח לכל רכב
    vehiclesCommission += personalCars * 150;
    
    // בונוס אם הסניף עמד ביעד: 10 ש"ח כפול כל רכבי הסניף
    if (branchMetTarget) {
        vehiclesCommission += totalBranchCars * 10;
    }
    
    // בדיקת עמידה ביעד אישי
    const personalTargetPercentage = personalTarget > 0 ? (personalCars / personalTarget) * 100 : 0;
    
    // אם הגיע ל-100% יעד אישי: תוספת 20 ש"ח כפול מסירות אישיות
    if (personalTargetPercentage >= 100) {
        vehiclesCommission += personalCars * 20;
    }
    
    // אם עבר 110% יעד אישי: תוספת נוספת של 10 ש"ח כפול מסירות אישיות
    if (personalTargetPercentage >= 110) {
        vehiclesCommission += personalCars * 10;
    }
    
    // עמלות ביטוח: 75 ש"ח לכל ביטוח
    const insuranceCommission = insurance * 75;
    
    // עמלות טופ סרוויס
    let topServiceRate = 150; // בסיס
    // חישוב אחוז לפי פוטנציאל (אם הוזן), אחרת לפי מסירות
    const topServiceBase = topServicePotential > 0 ? topServicePotential : personalCars;
    const topServicePercentage = topServiceBase > 0 ? (topService / topServiceBase) * 100 : 0;
    
    // אם עבר 60% - בונוס רטרואקטיבי של 25 ש"ח (סה"כ 175)
    if (topServicePercentage >= 60) {
        topServiceRate = 175;
    }
    
    const topServiceCommission = topService * topServiceRate;
    
    // עמלות הרחבות אחריות: 60 ש"ח לכל הרחבה
    const warrantyCommission = warranty * 60;
    
    // חישוב התאמת לקוח סמוי (פועל רק על עמלות רכבים)
    let mysteryAdjustment = 0;
    if (mysteryScore < 80) {
        mysteryAdjustment = -(vehiclesCommission * 0.2); // קנס 20%
    } else if (mysteryScore >= 90) {
        mysteryAdjustment = vehiclesCommission * 0.2; // בונוס 20%
    }
    
    // רכיב רכבים = הכל חוץ מטרייד אין ומימון
    const vehiclesComponent = vehiclesCommission + insuranceCommission + topServiceCommission + 
                              warrantyCommission + mysteryAdjustment + demo;
    
    return {
        vehiclesComponent: vehiclesComponent,
        vehiclesCommission: vehiclesCommission,
        insuranceCommission: insuranceCommission,
        topServiceCommission: topServiceCommission,
        warrantyCommission: warrantyCommission,
        mysteryAdjustment: mysteryAdjustment,
        demo: demo
    };
};

// שמירת תוצאות מחושבות
window.saveCalculatedResults = function(month, results) {
    const currentData = loadMonthData('hyundai-jerusalem', month) || {};
    const updatedData = { ...currentData, ...results };
    saveMonthData('hyundai-jerusalem', month, updatedData);
};

// עדכון טבלת סיכום ביצועי סניף
window.updateBranchSummaryTable = function(month, branchTarget, totalCars, totalTopService, totalTopServicePotential) {
    const prefix = `hj-${month}-summary`;
    
    // מסירות רכב
    const carsTarget = branchTarget;
    const carsActual = totalCars;
    const carsPercent = carsTarget > 0 ? Math.round((carsActual / carsTarget) * 100) : 0;
    
    document.getElementById(`${prefix}-cars-target`).textContent = carsTarget || '-';
    document.getElementById(`${prefix}-cars-actual`).textContent = carsActual || '-';
    document.getElementById(`${prefix}-cars-percent`).textContent = carsTarget > 0 ? `${carsPercent}%` : '-';
    
    const carsStatusCell = document.getElementById(`${prefix}-cars-status`);
    if (carsTarget > 0) {
        if (carsPercent >= 100) {
            carsStatusCell.textContent = '✅ מצוין';
            carsStatusCell.style.background = '#28a745';
            carsStatusCell.style.color = 'white';
        } else if (carsPercent >= 90) {
            carsStatusCell.textContent = '⚠️ קרוב';
            carsStatusCell.style.background = '#ffc107';
            carsStatusCell.style.color = '#333';
        } else {
            carsStatusCell.textContent = '❌ נמוך';
            carsStatusCell.style.background = '#dc3545';
            carsStatusCell.style.color = 'white';
        }
    } else {
        carsStatusCell.textContent = '⏳';
        carsStatusCell.style.background = '#6c757d';
        carsStatusCell.style.color = 'white';
    }
    
    // טופ סרוויס
    const topServiceTarget = totalTopServicePotential;
    const topServiceActual = totalTopService;
    const topServicePercent = topServiceTarget > 0 ? Math.round((topServiceActual / topServiceTarget) * 100) : 0;
    
    document.getElementById(`${prefix}-topservice-target`).textContent = topServiceTarget || '-';
    document.getElementById(`${prefix}-topservice-actual`).textContent = topServiceActual || '-';
    document.getElementById(`${prefix}-topservice-percent`).textContent = topServiceTarget > 0 ? `${topServicePercent}%` : '-';
    
    const topServiceStatusCell = document.getElementById(`${prefix}-topservice-status`);
    if (topServiceTarget > 0) {
        if (topServicePercent >= 60) {
            topServiceStatusCell.textContent = '✅ מעולה';
            topServiceStatusCell.style.background = '#28a745';
            topServiceStatusCell.style.color = 'white';
        } else if (topServicePercent >= 50) {
            topServiceStatusCell.textContent = '⚠️ בינוני';
            topServiceStatusCell.style.background = '#ffc107';
            topServiceStatusCell.style.color = '#333';
        } else {
            topServiceStatusCell.textContent = '❌ חלש';
            topServiceStatusCell.style.background = '#dc3545';
            topServiceStatusCell.style.color = 'white';
        }
    } else {
        topServiceStatusCell.textContent = '⏳';
        topServiceStatusCell.style.background = '#6c757d';
        topServiceStatusCell.style.color = 'white';
    }
};
