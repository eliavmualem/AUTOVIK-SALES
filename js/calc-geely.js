// ========================================
// ג'ילי - פונקציות חישוב
// ========================================

// פונקציית עזר לקריאת ערכים
function getValue(id) {
    const el = document.getElementById(id);
    return el ? (parseFloat(el.value) || 0) : 0;
}

// פונקציית עזר לעדכון תצוגה
function setDisplay(id, value) {
    const el = document.getElementById(id);
    if (el) {
        if (typeof value === 'string') {
            el.textContent = value;
        } else {
            el.textContent = '₪' + Math.round(value).toLocaleString('he-IL');
        }
    }
}

// פונקציית עזר לצביעת תא מחושב
function colorizeCell(id, shouldBeGreen, value) {
    const el = document.getElementById(id);
    if (el) {
        const parentTd = el.closest('td');
        if (parentTd) {
            if (shouldBeGreen && value > 0) {
                parentTd.style.background = 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)';
                parentTd.style.color = '#155724';
                parentTd.style.fontWeight = 'bold';
            } else if (value > 0) {
                parentTd.style.background = 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
                parentTd.style.color = '#d35400';
                parentTd.style.fontWeight = 'bold';
            } else {
                parentTd.style.background = 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
                parentTd.style.color = '#d35400';
                parentTd.style.fontWeight = 'bold';
            }
        }
    }
}

// פונקציית עזר לצביעת שדה קלט
function colorizeInput(id, shouldBeGreen) {
    const el = document.getElementById(id);
    if (el && el.value && parseFloat(el.value) > 0) {
        if (shouldBeGreen) {
            el.style.borderColor = '#28a745';
            el.style.background = 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)';
            el.style.color = '#155724';
            el.style.fontWeight = 'bold';
        } else {
            el.style.borderColor = '#ffc107';
            el.style.background = 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)';
            el.style.color = '#856404';
            el.style.fontWeight = 'bold';
        }
    } else if (el) {
        // Reset to default
        el.style.borderColor = '#11998e';
        el.style.background = 'white';
        el.style.color = '#333';
        el.style.fontWeight = 'normal';
    }
}

// חישוב חודש ג'ילי
window.calculateGeelyMonth = function(showroomId, month) {
    console.log('🧮 calculateGeelyMonth:', showroomId, month);
    
    try {
        const config = window.getShowroomConfig(showroomId);
        if (!config) {
            console.error('Config not found for:', showroomId);
            return;
        }
        
        const prefix = config.prefix + '-' + month;
        
        // קריאת נתוני יעדים וביצועים
        const targetDeliveries = getValue(`${prefix}-target-deliveries`);
        const actualDeliveries = getValue(`${prefix}-actual-deliveries`);
        const npsScore = getValue(`${prefix}-nps-score`);
        const totalAccessories = getValue(`${prefix}-total-accessories`);
        const testDrivePercent = getValue(`${prefix}-test-drive-percent`);
        const tradeinCount = getValue(`${prefix}-tradein-count`);
        const servicePackages = getValue(`${prefix}-service-packages`);
        const financePercent = getValue(`${prefix}-finance-percent`);
        const insuranceSales = getValue(`${prefix}-insurance-sales`);
        const mobilityCount = getValue(`${prefix}-mobility-count`);
        
        // קריאת פוטנציאלים
        const potentialAccessories = getValue(`${prefix}-potential-accessories`);
        const potentialService = getValue(`${prefix}-potential-service`);
        const potentialInsurance = getValue(`${prefix}-potential-insurance`);
        
        // חישוב אחוזים ממוצעים
        const deliveryPercent = targetDeliveries > 0 ? (actualDeliveries / targetDeliveries * 100) : 0;
        const avgAccessories = potentialAccessories > 0 ? (totalAccessories / potentialAccessories) : 0;
        const tradeinPercent = actualDeliveries > 0 ? (tradeinCount / actualDeliveries * 100) : 0;
        const servicePercent = potentialService > 0 ? (servicePackages / potentialService * 100) : 0;
        const insurancePercent = potentialInsurance > 0 ? (insuranceSales / potentialInsurance * 100) : 0;
        const mobilityPercent = actualDeliveries > 0 ? (mobilityCount / actualDeliveries * 100) : 0;
        
        // עדכון תצוגת אחוזים וממוצעים
        setDisplay(`${prefix}-delivery-percent`, Math.round(deliveryPercent) + '%');
        setDisplay(`${prefix}-avg-accessories`, '₪' + Math.round(avgAccessories).toLocaleString('he-IL'));
        setDisplay(`${prefix}-tradein-percent`, Math.round(tradeinPercent) + '%');
        setDisplay(`${prefix}-service-percent`, Math.round(servicePercent) + '%');
        setDisplay(`${prefix}-insurance-percent`, Math.round(insurancePercent) + '%');
        setDisplay(`${prefix}-mobility-percent`, Math.round(mobilityPercent) + '%');
        
        // צביעת תאים לפי סף
        colorizeCell(`${prefix}-delivery-percent`, deliveryPercent >= 100, deliveryPercent);
        colorizeCell(`${prefix}-avg-accessories`, avgAccessories >= 1200, avgAccessories);
        colorizeCell(`${prefix}-tradein-percent`, tradeinPercent >= 20, tradeinPercent);
        colorizeCell(`${prefix}-service-percent`, servicePercent >= 60, servicePercent);
        colorizeCell(`${prefix}-insurance-percent`, insurancePercent >= 40, insurancePercent);
        
        // צביעת שדות קלט ישירים
        const satisfactionScore = getValue(`${prefix}-satisfaction-score`);
        colorizeInput(`${prefix}-satisfaction-score`, satisfactionScore >= 80);
        
        colorizeInput(`${prefix}-nps-score`, npsScore >= 75);
        colorizeInput(`${prefix}-finance-percent`, financePercent >= 40);
        
        // חישוב עמלות מנהל
        const manager = config.employees.manager;
        const managerResult = calculateGeelyManagerCommissions(
            prefix,
            manager.id,
            actualDeliveries,
            npsScore,
            totalAccessories,
            avgAccessories,
            tradeinCount,
            tradeinPercent,
            financePercent,
            insurancePercent,
            servicePercent,
            servicePackages
        );
        
        // סנכרון NPS לנציגים
        const salespeople = config.employees.salespeople || [];
        salespeople.forEach(sp => {
            const npsField = document.getElementById(`${prefix}-${sp.id}-nps`);
            if (npsField) {
                npsField.value = npsScore;
            }
        });
        
        // חישוב עמלות נציגים
        const salespeopleResults = {};
        salespeople.forEach(sp => {
            // קריאת נתוני הנציג
            const spDeliveries = getValue(`${prefix}-${sp.id}-deliveries`);
            const spAccessoriesTotal = getValue(`${prefix}-${sp.id}-accessories-total`);
            const spWarranty = getValue(`${prefix}-${sp.id}-warranty`);
            const spInsurance = getValue(`${prefix}-${sp.id}-insurance`);
            const spTradein = getValue(`${prefix}-${sp.id}-tradein`);
            const spDeliveryMeeting = getValue(`${prefix}-${sp.id}-delivery-meeting`);
            const spService = getValue(`${prefix}-${sp.id}-service`);
            const spPotentialAccessories = getValue(`${prefix}-${sp.id}-potential-accessories`);
            const spPotentialInsurance = getValue(`${prefix}-${sp.id}-potential-insurance`);
            const spPotentialService = getValue(`${prefix}-${sp.id}-potential-service`);
            
            // חישוב אחוזים וממוצעים לנציג
            const spAvgAccessories = spPotentialAccessories > 0 ? (spAccessoriesTotal / spPotentialAccessories) : 0;
            const spInsurancePercent = spPotentialInsurance > 0 ? (spInsurance / spPotentialInsurance * 100) : 0;
            const spServicePercent = spPotentialService > 0 ? (spService / spPotentialService * 100) : 0;
            
            // עדכון תצוגה לנציג
            setDisplay(`${prefix}-${sp.id}-accessories-avg`, '₪' + Math.round(spAvgAccessories).toLocaleString('he-IL'));
            setDisplay(`${prefix}-${sp.id}-insurance-percent`, Math.round(spInsurancePercent) + '%');
            setDisplay(`${prefix}-${sp.id}-service-percent`, Math.round(spServicePercent) + '%');
            
            // חישוב עמלות
            salespeopleResults[sp.id] = calculateGeelySalespersonCommissions(
                prefix,
                sp.id,
                spDeliveries,
                npsScore,
                spAccessoriesTotal,
                spWarranty,
                spInsurance,
                spTradein,
                spDeliveryMeeting,
                spService,
                spPotentialAccessories,
                spPotentialInsurance,
                spPotentialService,
                0, 0, 0  // special fields - will be read inside the function
            );
        });
        
        console.log('✅ Calculation complete!');
        
        // שמירת תוצאות
        if (!window.lastCalculatedResults) window.lastCalculatedResults = {};
        window.lastCalculatedResults[month] = {
            [manager.id]: managerResult,
            ...salespeopleResults
        };
        
        console.log('💾 Stored calculated results for', month);
        
    } catch (error) {
        console.error('❌ Error in calculateGeelyMonth:', error);
    }
};

// חישוב עמלות מנהל ג'ילי
function calculateGeelyManagerCommissions(
    prefix, 
    empId,
    actualDeliveries,
    npsScore,
    totalAccessories,
    avgAccessories,
    tradeinCount,
    tradeinPercent,
    financePercent,
    insurancePercent,
    servicePercent,
    servicePackages
) {
    // קבלת כללי העמלות מהקובץ המרכזי
    const showroomId = prefix.split('-')[0] === 'gm' ? 'geely-modiin' : 'geely-jerusalem';
    const rules = window.getCommissionRules(showroomId);
    const managerRules = rules ? rules.manager : null;
    
    // 1. עמלות מסירות - מהכללים או 200 ש"ח כברירת מחדל
    const deliveryRate = managerRules ? managerRules.deliveryRate : 200;
    let deliveryCommission = actualDeliveries * deliveryRate;
    
    // 2. קיזוז NPS - מהכללים או 75% כברירת מחדל
    let npsDeduction = 0;
    const npsThreshold = managerRules && managerRules.nps ? managerRules.nps.threshold : 75;
    const npsPenalty = managerRules && managerRules.nps ? managerRules.nps.penaltyPercent : 0.10;
    
    if (npsScore < npsThreshold && npsScore > 0) {
        npsDeduction = -deliveryCommission * npsPenalty;
    }
    
    // עמלת מסירות נטו (אחרי קיזוז NPS)
    const netDeliveryCommission = deliveryCommission + npsDeduction;
    
    // 3. עמלת אביזרים - מדרגות לפי ממוצע (מהכללים)
    let accessoriesCommission = 0;
    let accessoriesRate = 0;
    
    // ברירת מחדל אם אין כללים
    const defaultTiers = [
        { min: 0, max: 1500, rate: 0.02 },
        { min: 1501, max: 2200, rate: 0.03 },
        { min: 2201, max: 3000, rate: 0.04 },
        { min: 3001, max: 99999, rate: 0.05 }
    ];
    
    const accessoriesTiers = managerRules && managerRules.accessoriesTiers ? managerRules.accessoriesTiers : defaultTiers;
    
    // מציאת המדרגה המתאימה
    for (const tier of accessoriesTiers) {
        if (avgAccessories >= tier.min && avgAccessories <= tier.max) {
            accessoriesRate = tier.rate;
            accessoriesCommission = totalAccessories * tier.rate;
            break;
        }
    }
    
    // 4. עמלת טרייד אין - מדרגות לפי אחוז (מהכללים)
    let tradeinCommission = 0;
    let tradeinRate = 0;
    
    const defaultTradeinTiers = [
        { min: 0, max: 15.0, rate: 120 },
        { min: 15.1, max: 19.9, rate: 150 },
        { min: 20.0, max: 100, rate: 250 }
    ];
    
    const tradeinTiers = managerRules && managerRules.tradeinTiers ? managerRules.tradeinTiers : defaultTradeinTiers;
    
    // מציאת המדרגה המתאימה
    for (const tier of tradeinTiers) {
        if (tradeinPercent >= tier.min && tradeinPercent <= tier.max) {
            tradeinRate = tier.rate;
            tradeinCommission = tradeinCount * tier.rate;
            break;
        }
    }
    
    // 5. עמלת רווח נוסף מטרייד (הזנה ידנית)
    const tradeinProfit = getValue(`${prefix}-${empId}-tradein-profit`);
    
    // 6. עמלת סלקט (הזנה ידנית)
    const selectCommission = getValue(`${prefix}-${empId}-select-commission`);
    
    // 7. בונוס מימון בהסדר - מהכללים או 25% כברירת מחדל
    const financeThreshold = managerRules && managerRules.finance ? managerRules.finance.threshold : 25;
    const financeBonusAmount = managerRules && managerRules.finance ? managerRules.finance.bonus : 500;
    const financeBonus = (financePercent > financeThreshold) ? financeBonusAmount : 0;
    
    // 8. עמלת ביטוח - מדרגות לפי אחוז (מהכללים)
    let insuranceCommission = 0;
    
    const defaultInsuranceTiers = [
        { min: 0, max: 39.9, amount: 0 },
        { min: 40, max: 44.9, amount: 500 },
        { min: 45, max: 49.9, amount: 750 },
        { min: 50, max: 100, amount: 1000 }
    ];
    
    const insuranceTiers = managerRules && managerRules.insuranceTiers ? managerRules.insuranceTiers : defaultInsuranceTiers;
    
    // מציאת המדרגה המתאימה
    for (const tier of insuranceTiers) {
        if (insurancePercent >= tier.min && insurancePercent <= tier.max) {
            insuranceCommission = tier.amount;
            break;
        }
    }
    
    // 9. עמלת טופ סרוויס (חבילות שירות) - מדרגות לפי אחוז (מהכללים)
    let topServiceCommission = 0;
    
    const defaultTopServiceTiers = [
        { min: 0, max: 59.9, amount: 0 },
        { min: 60, max: 69.9, amount: 500 },
        { min: 70, max: 79.9, amount: 750 },
        { min: 80, max: 100, amount: 1250 }
    ];
    
    const topServiceMinPackages = managerRules && managerRules.topService ? managerRules.topService.minPackages : 5;
    const topServiceTiers = managerRules && managerRules.topService && managerRules.topService.tiers ? managerRules.topService.tiers : defaultTopServiceTiers;
    
    // תנאי סף: מינימום חבילות
    if (servicePackages >= topServiceMinPackages) {
        // מציאת המדרגה המתאימה
        for (const tier of topServiceTiers) {
            if (servicePercent >= tier.min && servicePercent <= tier.max) {
                topServiceCommission = tier.amount;
                break;
            }
        }
    }
    
    // 10. שדות הזנה ידנית נוספים
    const specialFocus = getValue(`${prefix}-${empId}-special-focus`);
    const maxFinance = getValue(`${prefix}-${empId}-max-finance`);
    const diff = getValue(`${prefix}-${empId}-diff`);
    
    // סה"כ
    const total = netDeliveryCommission + accessoriesCommission + tradeinCommission + 
                  tradeinProfit + selectCommission + financeBonus + insuranceCommission + 
                  topServiceCommission + specialFocus + maxFinance + diff;
    
    // עדכון תצוגה
    setDisplay(`${prefix}-${empId}-delivery-commission`, deliveryCommission);
    setDisplay(`${prefix}-${empId}-nps-deduction`, npsDeduction);
    setDisplay(`${prefix}-${empId}-accessories-commission`, accessoriesCommission);
    setDisplay(`${prefix}-${empId}-tradein-commission`, tradeinCommission);
    setDisplay(`${prefix}-${empId}-tradein-profit-display`, tradeinProfit);
    setDisplay(`${prefix}-${empId}-select-display`, selectCommission);
    setDisplay(`${prefix}-${empId}-finance-bonus`, financeBonus);
    setDisplay(`${prefix}-${empId}-insurance-commission`, insuranceCommission);
    setDisplay(`${prefix}-${empId}-top-service-commission`, topServiceCommission);
    setDisplay(`${prefix}-${empId}-special-focus-display`, specialFocus);
    setDisplay(`${prefix}-${empId}-max-finance-display`, maxFinance);
    setDisplay(`${prefix}-${empId}-diff-display`, diff);
    setDisplay(`${prefix}-${empId}-total`, total);
    
    console.log(`💰 Manager: deliveries=${actualDeliveries}×200=₪${deliveryCommission}, NPS deduction=₪${npsDeduction}, accessories=${accessoriesRate*100}% of ${totalAccessories}=₪${accessoriesCommission}, tradein=${tradeinCount}×${tradeinRate}=₪${tradeinCommission}, topService=${servicePercent.toFixed(1)}%=₪${topServiceCommission}, total=₪${total}`);
    
    return {
        deliveryCommission,
        npsDeduction,
        accessoriesCommission,
        tradeinCommission,
        financeBonus,
        insuranceCommission,
        topServiceCommission,
        total
    };
}

// חישוב עמלות נציג ג'ילי
function calculateGeelySalespersonCommissions(
    prefix, 
    empId, 
    deliveries, 
    npsScore, 
    accessoriesTotal, 
    warranty, 
    insurance, 
    tradein, 
    deliveryMeeting, 
    service, 
    potentialAccessories, 
    potentialInsurance, 
    potentialService,
    specialFocus,
    maxFinance,
    diff
) {
    
    // חישוב אחוזים וממוצעים
    const avgAccessories = potentialAccessories > 0 ? (accessoriesTotal / potentialAccessories) : 0;
    const insurancePercent = potentialInsurance > 0 ? (insurance / potentialInsurance * 100) : 0;
    const servicePercent = potentialService > 0 ? (service / potentialService * 100) : 0;
    
    // עדכון תצוגת אחוזים וממוצעים
    setDisplay(`${prefix}-${empId}-accessories-avg`, '₪' + Math.round(avgAccessories).toLocaleString('he-IL'));
    setDisplay(`${prefix}-${empId}-insurance-percent`, Math.round(insurancePercent) + '%');
    setDisplay(`${prefix}-${empId}-service-percent`, Math.round(servicePercent) + '%');
    
    // צביעה
    colorizeCell(`${prefix}-${empId}-accessories-avg`, avgAccessories >= 1200, avgAccessories);
    colorizeCell(`${prefix}-${empId}-insurance-percent`, insurancePercent >= 40, insurancePercent);
    colorizeCell(`${prefix}-${empId}-service-percent`, servicePercent >= 60, servicePercent);
    
    // קבלת כללי העמלות מהקובץ המרכזי
    const showroomId = prefix.split('-')[0] === 'gm' ? 'geely-modiin' : 'geely-jerusalem';
    const rules = window.getCommissionRules(showroomId);
    const salespersonRules = rules ? rules.salesperson : null;
    
    // 2. עמלות מסירות - מהכללים או 100 ש"ח כברירת מחדל
    const deliveryRate = salespersonRules ? salespersonRules.deliveryRate : 100;
    let deliveryCommission = deliveries * deliveryRate;
    
    // 3. התאמת NPS (רק אם יש מסירות) - מהכללים
    let npsAdjustment = 0;
    
    const npsPenaltyThreshold = salespersonRules && salespersonRules.nps ? salespersonRules.nps.penaltyThreshold : 75;
    const npsPenaltyPercent = salespersonRules && salespersonRules.nps ? salespersonRules.nps.penaltyPercent : 0.10;
    const npsBonusThreshold = salespersonRules && salespersonRules.nps ? salespersonRules.nps.bonusThreshold : 84;
    const npsBonusPerDelivery = salespersonRules && salespersonRules.nps ? salespersonRules.nps.bonusPerDelivery : 20;
    const npsBonusPerMeeting = salespersonRules && salespersonRules.nps ? salespersonRules.nps.bonusPerMeeting : 20;
    
    if (deliveries > 0) {
        if (npsScore < npsPenaltyThreshold && npsScore > 0) {
            // קיזוז אם מתחת לסף
            npsAdjustment = -deliveryCommission * npsPenaltyPercent;
        } else if (npsScore > npsBonusThreshold) {
            // בונוס אם מעל סף הבונוס
            npsAdjustment = (deliveryMeeting * npsBonusPerMeeting) + (deliveries * npsBonusPerDelivery);
        }
    }
    
    // עמלת מסירות נטו
    const netDeliveryCommission = deliveryCommission + npsAdjustment;
    
    // 4. עמלת אביזרים - מדרגות לפי ממוצע (מהכללים)
    let accessoriesCommission = 0;
    let accessoriesRate = 0;
    
    const defaultSalespersonAccessoriesTiers = [
        { min: 0, max: 1199, rate: 0.00 },
        { min: 1200, max: 1500, rate: 0.03 },
        { min: 1501, max: 2500, rate: 0.06 },
        { min: 2501, max: 99999, rate: 0.07 }
    ];
    
    const salespersonAccessoriesTiers = salespersonRules && salespersonRules.accessoriesTiers ? salespersonRules.accessoriesTiers : defaultSalespersonAccessoriesTiers;
    
    // מציאת המדרגה המתאימה
    for (const tier of salespersonAccessoriesTiers) {
        if (avgAccessories >= tier.min && avgAccessories <= tier.max) {
            accessoriesRate = tier.rate;
            accessoriesCommission = accessoriesTotal * tier.rate;
            break;
        }
    }
    
    // 5. עמלת אחריות - מהכללים או 40 ש"ח כברירת מחדל
    const warrantyRate = salespersonRules && salespersonRules.warranty ? salespersonRules.warranty.rate : 40;
    const warrantyCommission = warranty * warrantyRate;
    
    // 6. עמלת ביטוח - מדרגות לפי אחוז (מהכללים)
    let insuranceCommission = 0;
    let insuranceRate = 0;
    
    const defaultSalespersonInsuranceTiers = [
        { min: 0, max: 25.9, rate: 35 },
        { min: 26, max: 40, rate: 60 },
        { min: 40.1, max: 100, rate: 80 }
    ];
    
    const salespersonInsuranceTiers = salespersonRules && salespersonRules.insuranceTiers ? salespersonRules.insuranceTiers : defaultSalespersonInsuranceTiers;
    
    // מציאת המדרגה המתאימה
    for (const tier of salespersonInsuranceTiers) {
        if (insurancePercent >= tier.min && insurancePercent <= tier.max) {
            insuranceRate = tier.rate;
            insuranceCommission = insurance * tier.rate;
            break;
        }
    }
    
    // 7. עמלת טרייד אין - מהכללים או 120 ש"ח כברירת מחדל
    const tradeinRate = salespersonRules && salespersonRules.tradein ? salespersonRules.tradein.rate : 120;
    const tradeinCommission = tradein * tradeinRate;
    
    // 8. עמלת חבילות שירות - מהכללים או 80 ש"ח כברירת מחדל
    const serviceRate = salespersonRules && salespersonRules.service ? salespersonRules.service.rate : 80;
    const serviceCommission = service * serviceRate;
    
    // 9. שדות הזנה ידנית (קריאה מתוך הטופס)
    const specialFocusVal = getValue(`${prefix}-${empId}-special-focus`);
    const maxFinanceVal = getValue(`${prefix}-${empId}-max-finance`);
    const diffVal = getValue(`${prefix}-${empId}-diff`);
    
    // סה"כ
    const total = netDeliveryCommission + accessoriesCommission + warrantyCommission + 
                  insuranceCommission + tradeinCommission + serviceCommission + 
                  specialFocusVal + maxFinanceVal + diffVal;
    
    // עדכון תצוגה
    setDisplay(`${prefix}-${empId}-delivery-commission`, deliveryCommission);
    setDisplay(`${prefix}-${empId}-nps-adjustment`, npsAdjustment);
    setDisplay(`${prefix}-${empId}-accessories-commission`, accessoriesCommission);
    setDisplay(`${prefix}-${empId}-warranty-commission`, warrantyCommission);
    setDisplay(`${prefix}-${empId}-insurance-commission`, insuranceCommission);
    setDisplay(`${prefix}-${empId}-tradein-commission`, tradeinCommission);
    setDisplay(`${prefix}-${empId}-service-commission`, serviceCommission);
    setDisplay(`${prefix}-${empId}-special-focus-display`, specialFocusVal);
    setDisplay(`${prefix}-${empId}-max-finance-display`, maxFinanceVal);
    setDisplay(`${prefix}-${empId}-diff-display`, diffVal);
    setDisplay(`${prefix}-${empId}-total`, total);
    
    console.log(`💰 Salesperson ${empId}: deliveries=${deliveries}×100=₪${deliveryCommission}, NPS adj=₪${npsAdjustment}, accessories=${accessoriesRate*100}% of ${accessoriesTotal}=₪${accessoriesCommission}, insurance=${insurance}×${insuranceRate}=₪${insuranceCommission}, total=₪${total}`);
    
    return {
        deliveryCommission,
        npsAdjustment,
        accessoriesCommission,
        warrantyCommission,
        insuranceCommission,
        tradeinCommission,
        serviceCommission,
        total
    };
}

// שמירת נתונים
window.saveGeelyMonth = function(showroomId, month) {
    console.log(`💾 Saving data for ${showroomId}, ${month}`);
    
    // First calculate to ensure we have latest results
    window.calculateGeelyMonth(showroomId, month);
    
    const config = window.getShowroomConfig(showroomId);
    if (!config) return;
    
    const prefix = config.prefix + '-' + month;
    
    // Collect all input data
    const data = {};
    const inputs = document.querySelectorAll(`input[id^="${prefix}-"]`);
    inputs.forEach(input => {
        if (input.classList.contains('geely-input')) {
            data[input.id] = parseFloat(input.value) || 0;
        }
    });
    
    // Add calculated results
    if (window.lastCalculatedResults && window.lastCalculatedResults[month]) {
        data.calculatedResults = window.lastCalculatedResults[month];
    }
    
    // Save to localStorage
    window.saveMonthData(showroomId, month, data);
    
    // Show success message
    alert(`✅ הנתונים נשמרו בהצלחה!\n\nאולם: ${config.name}\nחודש: ${month}\nשדות נשמרו: ${Object.keys(data).length}`);
};

// ניקוי טופס
window.clearGeelyMonthForm = function(showroomId, month) {
    const confirmed = confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים בחודש זה?');
    if (!confirmed) return;
    
    const config = window.getShowroomConfig(showroomId);
    if (!config) return;
    
    const prefix = config.prefix + '-' + month;
    
    // Clear all inputs
    const inputs = document.querySelectorAll(`input[id^="${prefix}-"]`);
    inputs.forEach(input => {
        if (input.classList.contains('geely-input')) {
            input.value = '';
        }
    });
    
    // Recalculate to reset displays
    window.calculateGeelyMonth(showroomId, month);
    
    console.log('✓ Form cleared');
};

console.log('✓ calc-geely.js loaded');
