// 🧮 חישוב עמלות גנרי לכל אולם
console.log('✓ calc-generic.js loaded');

// פונקציית חישוב גנרית לכל אולם
window.calculateGenericMonth = function(showroomId, month) {
    console.log(`🧮 calculateGenericMonth: ${showroomId}, ${month}`);
    
    const config = window.getShowroomConfig(showroomId);
    if (!config) {
        console.error(`❌ No config found for showroom: ${showroomId}`);
        return;
    }
    
    const prefix = config.prefix + '-' + month;
    console.log('Prefix:', prefix);
    
    try {
        // Helper functions
        function getValue(id) {
            const el = document.getElementById(id);
            return el ? (parseFloat(el.value) || 0) : 0;
        }
        
        function setDisplay(id, value) {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = '₪' + Math.round(value).toLocaleString('he-IL');
            }
        }
        
        // Get branch target and other branch-level metrics
        const branchTarget = getValue(`${prefix}-branch-target`);
        const financePercent = getValue(`${prefix}-finance-percent`);
        const stockPercent = getValue(`${prefix}-stock-percent`);
        
        // Get all employees data
        const employeesData = {};
        const employees = window.getShowroomEmployees(showroomId);
        
        employees.forEach(emp => {
            if (emp.placeholder) return; // Skip placeholder employees
            
            const empId = emp.id;
            
            if (emp.type === 'manager') {
                employeesData[empId] = {
                    type: 'manager',
                    cars: getValue(`${prefix}-${empId}-cars`),  // ✅ חדש - מכירות המנהל
                    finance: getValue(`${prefix}-${empId}-finance`),
                    tradeIn: getValue(`${prefix}-${empId}-tradein`),
                    demo: getValue(`${prefix}-${empId}-demo`),
                    diff: getValue(`${prefix}-${empId}-diff`)
                };
            } else if (emp.type === 'selling-manager') {
                // מנהל מוכר - צריך את כל השדות כמו נציג
                employeesData[empId] = {
                    type: 'selling-manager',
                    target: getValue(`${prefix}-${empId}-target`),
                    cars: getValue(`${prefix}-${empId}-cars`),
                    insurance: getValue(`${prefix}-${empId}-insurance`),
                    topService: getValue(`${prefix}-${empId}-topservice`),
                    topServicePot: getValue(`${prefix}-${empId}-topservice-potential`),
                    warranty: getValue(`${prefix}-${empId}-warranty`),
                    mystery: getValue(`${prefix}-${empId}-mystery`),
                    demo: getValue(`${prefix}-${empId}-demo`),
                    diff: getValue(`${prefix}-${empId}-diff`),
                    finance: getValue(`${prefix}-${empId}-finance`),
                    tradeIn: getValue(`${prefix}-${empId}-tradein`)
                };
            } else if (emp.type === 'salesperson') {
                employeesData[empId] = {
                    type: 'salesperson',
                    target: getValue(`${prefix}-${empId}-target`),
                    cars: getValue(`${prefix}-${empId}-cars`),
                    insurance: getValue(`${prefix}-${empId}-insurance`),
                    topService: getValue(`${prefix}-${empId}-topservice`),
                    topServicePot: getValue(`${prefix}-${empId}-topservice-potential`),
                    warranty: getValue(`${prefix}-${empId}-warranty`),
                    mystery: getValue(`${prefix}-${empId}-mystery`),
                    demo: getValue(`${prefix}-${empId}-demo`),
                    diff: getValue(`${prefix}-${empId}-diff`),
                    finance: getValue(`${prefix}-${empId}-finance`),
                    tradeIn: getValue(`${prefix}-${empId}-tradein`)
                };
            } else if (emp.type === 'operations') {
                employeesData[empId] = {
                    type: 'operations',
                    insurance: getValue(`${prefix}-${empId}-insurance`)
                };
            } else if (emp.type === 'kalmobil-manager') {
                employeesData[empId] = {
                    type: 'kalmobil-manager',
                    cars: getValue(`${prefix}-${empId}-cars`),
                    topServicePot: getValue(`${prefix}-${empId}-topservice-pot`),
                    warrantyCommission: getValue(`${prefix}-${empId}-warranty-commission`),
                    topserviceCommission: getValue(`${prefix}-${empId}-topservice-commission`),
                    demo: getValue(`${prefix}-${empId}-demo`),
                    diff: getValue(`${prefix}-${empId}-diff`),
                    finance: getValue(`${prefix}-${empId}-finance`),
                    tradein: getValue(`${prefix}-${empId}-tradein`)
                };
            } else if (emp.type === 'kalmobil-salesperson') {
                employeesData[empId] = {
                    type: 'kalmobil-salesperson',
                    cars: getValue(`${prefix}-${empId}-cars`),
                    topServicePot: getValue(`${prefix}-${empId}-topservice-pot`),
                    warrantyCommission: getValue(`${prefix}-${empId}-warranty-commission`),
                    topserviceCommission: getValue(`${prefix}-${empId}-topservice-commission`),
                    demo: getValue(`${prefix}-${empId}-demo`),
                    diff: getValue(`${prefix}-${empId}-diff`),
                    finance: getValue(`${prefix}-${empId}-finance`),
                    tradein: getValue(`${prefix}-${empId}-tradein`)
                };
            } else if (emp.type === 'kalmobil-operations') {
                employeesData[empId] = {
                    type: 'kalmobil-operations',
                    warrantyCommission: getValue(`${prefix}-${empId}-warranty-commission`),
                    topserviceCommission: getValue(`${prefix}-${empId}-topservice-commission`),
                    diff: getValue(`${prefix}-${empId}-diff`),
                    finance: getValue(`${prefix}-${empId}-finance`),
                    tradein: getValue(`${prefix}-${empId}-tradein`)
                };
            }
        });
        
        console.log('📊 Employees data:', employeesData);
        
        // Calculate totals from salespeople, selling-managers, and manager cars
        let totalCars = 0;
        let totalTopService = 0;
        let totalTopServicePot = 0;
        let totalInsurance = 0;
        
        Object.keys(employeesData).forEach(empId => {
            const emp = employeesData[empId];
            if (emp.type === 'salesperson' || emp.type === 'selling-manager') {
                totalCars += emp.cars || 0;
                totalTopService += emp.topService || 0;
                totalTopServicePot += emp.topServicePot || 0;
                totalInsurance += emp.insurance || 0;
            } else if (emp.type === 'manager') {
                // ✅ חדש - מכירות המנהל נספרות בסה"כ הסניף!
                totalCars += emp.cars || 0;
            } else if (emp.type === 'operations') {
                totalInsurance += emp.insurance || 0;
            } else if (emp.type === 'kalmobil-manager' || emp.type === 'kalmobil-salesperson') {
                // כלמוביל - מספר רכבים ופוטנציאל טופ סרוויס
                totalCars += emp.cars || 0;
                totalTopServicePot += emp.topServicePot || 0;
            }
        });
        
        console.log('📊 Totals:', { totalCars, totalTopService, totalTopServicePot, totalInsurance, branchTarget });
        
        // Update total cars display
        const totalCarsEl = document.getElementById(`${prefix}-total-cars`);
        if (totalCarsEl) totalCarsEl.value = totalCars;
        
        // Check if branch met target
        const branchMetTarget = branchTarget > 0 && totalCars >= branchTarget;
        
        // Update branch status
        const statusEl = document.getElementById(`${prefix}-target-status`);
        if (statusEl && branchTarget > 0) {
            const pct = Math.round((totalCars / branchTarget) * 100);
            if (branchMetTarget) {
                statusEl.innerHTML = `✅ עמד ביעד! (${pct}%)`;
                statusEl.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                statusEl.style.color = 'white';
            } else {
                statusEl.innerHTML = `⚠️ טרם עמד ביעד (${pct}%)`;
                statusEl.style.background = 'linear-gradient(135deg, #ffc107, #fd7e14)';
                statusEl.style.color = '#333';
            }
        }
        
        // Calculate each employee's commissions and store results
        const employeeResults = {};
        Object.keys(employeesData).forEach(empId => {
            const emp = employeesData[empId];
            
            if (emp.type === 'kalmobil-manager') {
                employeeResults[empId] = calculateKalmobilManagerCommissions(prefix, empId, emp, totalCars, branchTarget, financePercent, stockPercent);
            } else if (emp.type === 'kalmobil-salesperson') {
                employeeResults[empId] = calculateKalmobilSalespersonCommissions(prefix, empId, emp, totalCars, branchTarget, financePercent, stockPercent);
            } else if (emp.type === 'kalmobil-operations') {
                employeeResults[empId] = calculateKalmobilOperationsCommissions(prefix, empId, emp);
            } else if (emp.type === 'salesperson') {
                employeeResults[empId] = calculateSalespersonCommissions(prefix, empId, emp, totalCars, branchMetTarget);
            } else if (emp.type === 'selling-manager') {
                // Check if Mitsubishi-style model (Mitsubishi + Omoda)
                if (showroomId === 'mitsubishi-modiin' || showroomId === 'omoda-modiin') {
                    employeeResults[empId] = calculateMitsubishiSellingManagerCommissions(prefix, empId, emp, totalCars);
                } else {
                    employeeResults[empId] = calculateSellingManagerCommissions(prefix, empId, emp, totalCars, branchMetTarget);
                }
            } else if (emp.type === 'manager') {
                employeeResults[empId] = calculateManagerCommissions(prefix, empId, emp, totalCars);
            } else if (emp.type === 'operations') {
                employeeResults[empId] = calculateOperationsCommissions(prefix, empId, emp, totalTopService, branchMetTarget, totalTopServicePot);
            }
        });
        
        // Update summary table
        updateGenericSummaryTable(prefix, showroomId, branchTarget, totalCars, totalTopService, totalTopServicePot, totalInsurance, financePercent, stockPercent);
        
        console.log('✅ Calculation complete!');
        
        // Store results for saving (EXACT FORMAT AS calc-simple.js)
        if (!window.lastCalculatedResults) window.lastCalculatedResults = {};
        window.lastCalculatedResults[month] = employeeResults;  // Direct storage like Autoline
        
        console.log('💾 Stored calculated results for', month, ':', window.lastCalculatedResults[month]);
        
    } catch (error) {
        console.error('❌ Error in calculateGenericMonth:', error);
    }
};

// Calculate salesperson commissions (EXACT COPY from calc-simple.js)
function calculateSalespersonCommissions(prefix, empId, data, totalCars, branchMetTarget) {
    // Base commission: 150 per car
    const baseCarsComm = data.cars * 150;
    
    // Start with base
    let vehicleComm = baseCarsComm;
    
    // Branch bonus: 10 per total cars if branch met target
    let branchBonus = 0;
    if (branchMetTarget) {
        branchBonus = totalCars * 10;
        vehicleComm += branchBonus;
    }
    
    // Personal target bonuses
    const targetPct = data.target > 0 ? (data.cars / data.target) * 100 : 0;
    let targetBonus100 = 0;
    let targetBonus110 = 0;
    if (targetPct >= 100) {
        targetBonus100 = data.cars * 20;  // 100%+: +20 per car
        vehicleComm += targetBonus100;
    }
    if (targetPct >= 110) {
        targetBonus110 = data.cars * 10;  // 110%+: +10 more per car
        vehicleComm += targetBonus110;
    }
    
    // Insurance: 75 per unit
    const insComm = data.insurance * 75;
    
    // Top Service: varies by achievement
    const topBase = data.topServicePot > 0 ? data.topServicePot : data.cars;
    const topPct = topBase > 0 ? (data.topService / topBase) * 100 : 0;
    const topRate = topPct >= 60 ? 175 : 150;
    const topComm = data.topService * topRate;
    
    // Warranty: 60 per unit
    const warComm = data.warranty * 60;
    
    // Mystery shopper adjustment - on TOTAL vehicle commission (including all bonuses)
    let mystAdj = 0;
    if (data.mystery > 0 && data.mystery < 80) {
        mystAdj = -(vehicleComm * 0.2);  // -20% of TOTAL vehicle commission (base + bonuses)
    } else if (data.mystery >= 90) {
        mystAdj = vehicleComm * 0.2;  // +20% of TOTAL vehicle commission (base + bonuses)
    }
    // Between 80-89: no adjustment
    
    // Total vehicles component
    const vehiclesTotal = vehicleComm + insComm + topComm + warComm + mystAdj + data.demo + data.diff;
    const total = vehiclesTotal + data.tradeIn + data.finance;
    
    // Create detailed breakdown for vehicle commission display
    const breakdownParts = [];
    breakdownParts.push(`בסיס ${data.cars}×150 = ₪${baseCarsComm.toLocaleString()}`);
    if (branchBonus > 0) breakdownParts.push(`בונוס סניף ${totalCars}×10 = ₪${branchBonus.toLocaleString()}`);
    if (targetBonus100 > 0) breakdownParts.push(`בונוס 100% = ₪${targetBonus100.toLocaleString()}`);
    if (targetBonus110 > 0) breakdownParts.push(`בונוס 110% = ₪${targetBonus110.toLocaleString()}`);
    const vehicleBreakdown = breakdownParts.join(' + ');
    
    // Update displays
    setDisplay(`${prefix}-${empId}-base-commission`, vehicleComm);
    // Set breakdown as text (not number)
    const breakdownEl = document.getElementById(`${prefix}-${empId}-vehicles-breakdown`);
    if (breakdownEl) breakdownEl.textContent = vehicleBreakdown;
    setDisplay(`${prefix}-${empId}-insurance-commission`, insComm);
    setDisplay(`${prefix}-${empId}-insurance-display`, insComm);
    setDisplay(`${prefix}-${empId}-topservice-commission`, topComm);
    setDisplay(`${prefix}-${empId}-topservice-display`, topComm);
    setDisplay(`${prefix}-${empId}-warranty-commission`, warComm);
    setDisplay(`${prefix}-${empId}-warranty-display`, warComm);
    setDisplay(`${prefix}-${empId}-mystery-adjustment`, mystAdj);
    setDisplay(`${prefix}-${empId}-mystery-display`, mystAdj);
    setDisplay(`${prefix}-${empId}-demo-display`, data.demo);
    setDisplay(`${prefix}-${empId}-diff-display`, data.diff);
    setDisplay(`${prefix}-${empId}-vehicles`, vehiclesTotal);
    setDisplay(`${prefix}-${empId}-vehicles-display`, vehiclesTotal);
    setDisplay(`${prefix}-${empId}-tradein-display`, data.tradeIn);
    setDisplay(`${prefix}-${empId}-finance-display`, data.finance);
    setDisplay(`${prefix}-${empId}-total`, total);
    setDisplay(`${prefix}-${empId}-total-display`, total);
    
    // Return for yearly summary
    return {
        vehiclesComponent: vehiclesTotal,
        tradeInComponent: data.tradeIn,
        financeComponent: data.finance,
        total: total
    };
}

// Calculate selling-manager commissions (מנהל מוכר)
function calculateSellingManagerCommissions(prefix, empId, data, totalCars, branchMetTarget) {
    // Base commission: 200 per car (MANAGER RATE)
    let vehicleComm = data.cars * 200;
    
    // Branch bonus: 10 per total cars if branch met target
    if (branchMetTarget) {
        vehicleComm += totalCars * 10;
    }
    
    // Personal target bonuses (like salesperson)
    const targetPct = data.target > 0 ? (data.cars / data.target) * 100 : 0;
    if (targetPct >= 100) vehicleComm += data.cars * 20;
    if (targetPct >= 110) vehicleComm += data.cars * 10;
    
    // Insurance: 75 per unit (like salesperson)
    const insComm = data.insurance * 75;
    
    // Top Service: SPECIAL TIERED CALCULATION
    const topBase = data.topServicePot > 0 ? data.topServicePot : data.cars;
    const topPct = topBase > 0 ? (data.topService / topBase) * 100 : 0;
    const minRequired = 5; // יעד סף מינימלי
    
    let topComm = 0;
    if (data.topService >= minRequired) {
        if (topPct < 50) {
            topComm = 0; // מתחת ל-50% - אין עמלה
        } else if (topPct >= 50 && topPct < 60) {
            topComm = 750; // בין 50-60 - 750 ש"ח פיקס
        } else if (topPct >= 60 && topPct < 65) {
            topComm = 1000; // בין 60-65 - 1000 ש"ח פיקס
        } else if (topPct >= 65) {
            topComm = 1500; // מעל 65 - 1500 ש"ח פיקס
        }
    }
    
    // Warranty: 60 per unit (like salesperson)
    const warComm = data.warranty * 60;
    
    // Mystery shopper adjustment
    // Adjustment is ONLY on base vehicle commission (200 per car)
    let mystAdj = 0;
    if (data.mystery > 0 && data.mystery < 80) {
        mystAdj = -(vehicleComm * 0.2);  // -20% of base vehicle commission only
    } else if (data.mystery >= 90) {
        mystAdj = vehicleComm * 0.2;  // +20% of base vehicle commission only
    }
    // Between 80-89: no adjustment
    
    // Total vehicles component
    const vehiclesTotal = vehicleComm + insComm + topComm + warComm + mystAdj + data.demo + data.diff;
    const total = vehiclesTotal + data.tradeIn + data.finance;
    
    // Create detailed breakdown for vehicle commission display (selling-manager)
    const breakdownParts = [];
    const baseMgrComm = data.cars * 200;
    breakdownParts.push(`בסיס ${data.cars}×200 = ₪${baseMgrComm.toLocaleString()}`);
    if (branchMetTarget) breakdownParts.push(`בונוס סניף ${totalCars}×10 = ₪${(totalCars * 10).toLocaleString()}`);
    if (data.target > 0 && (data.cars / data.target) >= 1) {
        const targetBonus = data.cars * 20;
        breakdownParts.push(`בונוס 100% = ₪${targetBonus.toLocaleString()}`);
        if ((data.cars / data.target) >= 1.1) {
            const targetBonus110 = data.cars * 10;
            breakdownParts.push(`בונוס 110% = ₪${targetBonus110.toLocaleString()}`);
        }
    }
    const vehicleBreakdown = breakdownParts.join(' + ');
    
    // Update displays
    setDisplay(`${prefix}-${empId}-base-commission`, vehicleComm);
    // Set breakdown as text (not number)
    const breakdownEl = document.getElementById(`${prefix}-${empId}-vehicles-breakdown`);
    if (breakdownEl) breakdownEl.textContent = vehicleBreakdown;
    setDisplay(`${prefix}-${empId}-insurance-commission`, insComm);
    setDisplay(`${prefix}-${empId}-insurance-display`, insComm);
    setDisplay(`${prefix}-${empId}-topservice-commission`, topComm);
    setDisplay(`${prefix}-${empId}-topservice-display`, topComm);
    setDisplay(`${prefix}-${empId}-warranty-commission`, warComm);
    setDisplay(`${prefix}-${empId}-warranty-display`, warComm);
    setDisplay(`${prefix}-${empId}-mystery-adjustment`, mystAdj);
    setDisplay(`${prefix}-${empId}-mystery-display`, mystAdj);
    setDisplay(`${prefix}-${empId}-demo-display`, data.demo);
    setDisplay(`${prefix}-${empId}-diff-display`, data.diff);
    setDisplay(`${prefix}-${empId}-vehicles`, vehiclesTotal);
    setDisplay(`${prefix}-${empId}-vehicles-display`, vehiclesTotal);
    setDisplay(`${prefix}-${empId}-tradein-display`, data.tradeIn);
    setDisplay(`${prefix}-${empId}-finance-display`, data.finance);
    setDisplay(`${prefix}-${empId}-total`, total);
    setDisplay(`${prefix}-${empId}-total-display`, total);
    
    // Return for yearly summary
    return {
        vehiclesComponent: vehiclesTotal,
        tradeInComponent: data.tradeIn,
        financeComponent: data.finance,
        total: total
    };
}

// Calculate manager commissions
function calculateManagerCommissions(prefix, empId, data, totalCars) {
    // Manager commission: 200 per TOTAL BRANCH car deliveries (not just his own)
    const managerCarsComm = totalCars * 200;
    
    const vehiclesTotal = managerCarsComm + data.demo + data.diff;
    const total = vehiclesTotal + data.tradeIn + data.finance;
    
    setDisplay(`${prefix}-${empId}-cars-commission`, managerCarsComm);
    setDisplay(`${prefix}-${empId}-base-display`, managerCarsComm);
    setDisplay(`${prefix}-${empId}-demo-display`, data.demo);
    setDisplay(`${prefix}-${empId}-diff-display`, data.diff);
    setDisplay(`${prefix}-${empId}-vehicles-display`, vehiclesTotal);
    setDisplay(`${prefix}-${empId}-tradein-display`, data.tradeIn);
    setDisplay(`${prefix}-${empId}-finance-display`, data.finance);
    setDisplay(`${prefix}-${empId}-total-display`, total);
    
    // Old IDs
    setDisplay(`${prefix}-${empId}-vehicles`, vehiclesTotal);
    setDisplay(`${prefix}-${empId}-total`, total);
    
    // Return for yearly summary
    return {
        vehiclesComponent: vehiclesTotal,
        tradeInComponent: data.tradeIn,
        financeComponent: data.finance,
        total: total
    };
}

// Calculate operations commissions
function calculateOperationsCommissions(prefix, empId, data, totalTopService, branchMetTarget, totalTopServicePot) {
    // Calculate Top Service percentage based on POTENTIAL (from salespeople)
    const topSvcPct = totalTopServicePot > 0 ? (totalTopService / totalTopServicePot) * 100 : 0;
    
    // Tiered rates based on Top Service achievement
    let topServiceRate = 50;  // < 60%
    if (topSvcPct >= 70) topServiceRate = 80;       // 70%+
    else if (topSvcPct >= 60) topServiceRate = 70;  // 60-69%
    
    const topServiceComm = totalTopService * topServiceRate;
    const insuranceComm = data.insurance * 75;
    const vehiclesTotal = topServiceComm + insuranceComm;
    const total = vehiclesTotal;
    
    // Update displays
    setDisplay(`${prefix}-${empId}-topservice-commission`, topServiceComm);
    setDisplay(`${prefix}-${empId}-topservice-display`, topServiceComm);
    setDisplay(`${prefix}-${empId}-insurance-commission`, insuranceComm);
    setDisplay(`${prefix}-${empId}-insurance-display`, insuranceComm);
    setDisplay(`${prefix}-${empId}-vehicles`, vehiclesTotal);
    setDisplay(`${prefix}-${empId}-vehicles-display`, vehiclesTotal);
    setDisplay(`${prefix}-${empId}-total`, total);
    setDisplay(`${prefix}-${empId}-total-display`, total);
    
    // Return for yearly summary
    return {
        vehiclesComponent: vehiclesTotal,
        tradeInComponent: 0,
        financeComponent: 0,
        total: total
    };
}

// Calculate commissions for Mitsubishi-style selling manager (Shahaf Cohen)
function calculateMitsubishiSellingManagerCommissions(prefix, empId, data, totalCars) {
    // 1. Cars commission: 200 × totalCars (all branch cars, not just personal)
    const carsComm = totalCars * 200;
    
    // 2. Insurance: 75 per unit
    const insuranceComm = (data.insurance || 0) * 75;
    
    // 3. Warranty: 60 per unit
    const warrantyComm = (data.warranty || 0) * 60;
    
    // 4. Top Service: Fixed amount based on tiers
    // Threshold: minimum 5 packages
    // < 50%: ₪0
    // 50-60%: ₪750
    // 60-65%: ₪1,000
    // > 65%: ₪1,500
    const topServicePot = data.topServicePot || 0;
    const topService = data.topService || 0;
    const topServicePct = topServicePot > 0 ? (topService / topServicePot) * 100 : 0;
    
    let topServiceComm = 0;
    if (topService >= 5) {  // Threshold: 5 packages minimum
        if (topServicePct < 50) {
            topServiceComm = 0;
        } else if (topServicePct >= 50 && topServicePct < 60) {
            topServiceComm = 750;
        } else if (topServicePct >= 60 && topServicePct < 65) {
            topServiceComm = 1000;
        } else if (topServicePct >= 65) {
            topServiceComm = 1500;
        }
    }
    
    // 5. Mystery Shopper adjustment
    // Adjustment is ONLY on cars commission (not insurance, warranty, or top service)
    let mysteryAdj = 0;
    const mystery = data.mystery || 0;
    if (mystery > 0 && mystery < 80) {
        mysteryAdj = -(carsComm * 0.2);  // -20% of cars commission only
    } else if (mystery >= 90) {
        mysteryAdj = carsComm * 0.2;  // +20% of cars commission only
    }
    // Between 80-89: no adjustment (mysteryAdj = 0)
    
    // All goes into vehicles component
    const vehiclesTotal = carsComm + insuranceComm + warrantyComm + topServiceComm + mysteryAdj + (data.demo || 0) + (data.diff || 0);
    const total = vehiclesTotal + (data.tradeIn || 0) + (data.finance || 0);
    
    // Update displays
    setDisplay(`${prefix}-${empId}-base-commission`, carsComm);
    setDisplay(`${prefix}-${empId}-insurance-commission`, insuranceComm);
    setDisplay(`${prefix}-${empId}-warranty-commission`, warrantyComm);
    setDisplay(`${prefix}-${empId}-topservice-commission`, topServiceComm);
    setDisplay(`${prefix}-${empId}-mystery-adjustment`, mysteryAdj);
    setDisplay(`${prefix}-${empId}-demo-display`, data.demo || 0);
    setDisplay(`${prefix}-${empId}-diff-display`, data.diff || 0);
    setDisplay(`${prefix}-${empId}-vehicles-display`, vehiclesTotal);
    setDisplay(`${prefix}-${empId}-tradein-display`, data.tradeIn || 0);
    setDisplay(`${prefix}-${empId}-finance-display`, data.finance || 0);
    setDisplay(`${prefix}-${empId}-total-display`, total);
    
    // Old IDs
    setDisplay(`${prefix}-${empId}-vehicles`, vehiclesTotal);
    setDisplay(`${prefix}-${empId}-total`, total);
    
    console.log(`💰 Mitsubishi Manager: cars=${totalCars}×200=₪${carsComm}, ins=${insuranceComm}, war=${warrantyComm}, top=${topServiceComm}, mystery=${mysteryAdj}, total=₪${total}`);
    
    // Return for yearly summary
    return {
        vehiclesComponent: vehiclesTotal,
        tradeInComponent: data.tradeIn || 0,
        financeComponent: data.finance || 0,
        total: total
    };
}

// Update summary table
function updateGenericSummaryTable(prefix, showroomId, target, actualCars, topSvc, topPot, insurance, financePercent, stockPercent) {
    function updateSummaryCell(id, value, format = 'number') {
        const el = document.getElementById(id);
        if (el) {
            if (format === 'percent') {
                el.textContent = value + '%';
            } else {
                el.textContent = value;
            }
        }
    }
    
    // Cars
    const carsPct = target > 0 ? Math.round((actualCars / target) * 100) : 0;
    updateSummaryCell(`${prefix}-perf-cars-target`, target);
    updateSummaryCell(`${prefix}-perf-cars-actual`, actualCars);
    updateSummaryCell(`${prefix}-perf-cars-percent`, carsPct, 'percent');
    
    const carsStatusEl = document.getElementById(`${prefix}-perf-cars-status`);
    if (carsStatusEl && target > 0) {
        if (carsPct >= 100) {
            carsStatusEl.innerHTML = '✅ מצוין';
            carsStatusEl.className = 'status-cell status-excellent';
        } else if (carsPct >= 90) {
            carsStatusEl.innerHTML = '⚠️ קרוב';
            carsStatusEl.className = 'status-cell status-good';
        } else {
            carsStatusEl.innerHTML = '❌ נמוך';
            carsStatusEl.className = 'status-cell status-low';
        }
    }
    
    // Top Service
    const topPct = topPot > 0 ? Math.round((topSvc / topPot) * 100) : 0;
    updateSummaryCell(`${prefix}-perf-topservice-target`, topPot);
    updateSummaryCell(`${prefix}-perf-topservice-actual`, topSvc);
    updateSummaryCell(`${prefix}-perf-topservice-percent`, topPct, 'percent');
    
    const topStatusEl = document.getElementById(`${prefix}-perf-topservice-status`);
    if (topStatusEl && topPot > 0) {
        if (topPct >= 60) {
            topStatusEl.innerHTML = '✅ מעולה';
            topStatusEl.className = 'status-cell status-excellent';
        } else if (topPct >= 50) {
            topStatusEl.innerHTML = '⚠️ בינוני';
            topStatusEl.className = 'status-cell status-good';
        } else {
            topStatusEl.innerHTML = '❌ חלש';
            topStatusEl.className = 'status-cell status-low';
        }
    }
    
    // Insurance
    const insTarget = actualCars; // Target is 40% of total cars
    const insPct = actualCars > 0 ? Math.round((insurance / actualCars) * 100) : 0;
    
    updateSummaryCell(`${prefix}-perf-insurance-target`, insTarget);
    updateSummaryCell(`${prefix}-perf-insurance-actual`, insurance);
    updateSummaryCell(`${prefix}-perf-insurance-percent`, insPct, 'percent');
    
    const insStatusEl = document.getElementById(`${prefix}-perf-insurance-status`);
    if (insStatusEl && actualCars > 0) {
        if (insPct >= 40) {
            insStatusEl.innerHTML = '✅ מעולה';
            insStatusEl.className = 'status-cell status-excellent';
        } else if (insPct >= 30) {
            insStatusEl.innerHTML = '⚠️ בינוני';
            insStatusEl.className = 'status-cell status-good';
        } else {
            insStatusEl.innerHTML = '❌ חלש';
            insStatusEl.className = 'status-cell status-low';
        }
    }
    
    // Stock and Finance (Kalmobil only)
    if (showroomId === 'kalmobil-modiin') {
        // Stock (מלאי)
        const stockTarget = 40; // Target is 40%
        updateSummaryCell(`${prefix}-perf-stock-target`, stockTarget + '%');
        updateSummaryCell(`${prefix}-perf-stock-actual`, stockPercent + '%');
        updateSummaryCell(`${prefix}-perf-stock-percent`, stockPercent, 'percent');
        
        const stockStatusEl = document.getElementById(`${prefix}-perf-stock-status`);
        if (stockStatusEl) {
            if (stockPercent >= 40) {
                stockStatusEl.innerHTML = '✅ מעולה';
                stockStatusEl.className = 'status-cell status-excellent';
            } else if (stockPercent >= 30) {
                stockStatusEl.innerHTML = '⚠️ קרוב';
                stockStatusEl.className = 'status-cell status-good';
            } else {
                stockStatusEl.innerHTML = '❌ נמוך';
                stockStatusEl.className = 'status-cell status-low';
            }
        }
        
        // Finance (מימון)
        const financeTarget = 32; // Target is 32%
        updateSummaryCell(`${prefix}-perf-finance-target`, financeTarget + '%');
        updateSummaryCell(`${prefix}-perf-finance-actual`, financePercent + '%');
        updateSummaryCell(`${prefix}-perf-finance-percent`, financePercent, 'percent');
        
        const financeStatusEl = document.getElementById(`${prefix}-perf-finance-status`);
        if (financeStatusEl) {
            if (financePercent >= 32) {
                financeStatusEl.innerHTML = '✅ מצוין';
                financeStatusEl.className = 'status-cell status-excellent';
            } else if (financePercent >= 25) {
                financeStatusEl.innerHTML = '⚠️ קרוב';
                financeStatusEl.className = 'status-cell status-good';
            } else {
                financeStatusEl.innerHTML = '❌ נמוך';
                financeStatusEl.className = 'status-cell status-low';
            }
        }
    }
}

// Helper to set display
function setDisplay(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = '₪' + Math.round(value).toLocaleString('he-IL');
    }
}

// Save generic month data
window.saveGenericMonth = function(showroomId, month) {
    console.log(`💾 Saving data for ${showroomId}, ${month}`);
    
    // First calculate to ensure we have latest results
    window.calculateGenericMonth(showroomId, month);
    
    const config = window.getShowroomConfig(showroomId);
    if (!config) return;
    
    const prefix = config.prefix + '-' + month;
    
    // Collect all input data
    const data = {};
    const inputs = document.querySelectorAll(`input[id^="${prefix}-"]`);
    inputs.forEach(input => {
        if (input.classList.contains('input-field') || input.classList.contains('input-field-compact')) {
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

// Clear generic month form
window.clearGenericMonthForm = function(showroomId, month) {
    const confirmed = confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים בחודש זה?');
    if (!confirmed) return;
    
    const config = window.getShowroomConfig(showroomId);
    if (!config) return;
    
    const prefix = config.prefix + '-' + month;
    
    // Clear all inputs
    const inputs = document.querySelectorAll(`input[id^="${prefix}-"]`);
    inputs.forEach(input => {
        if (!input.readOnly) {
            input.value = '';
        }
    });
    
    // Recalculate to reset displays
    window.calculateGenericMonth(showroomId, month);
    
    console.log('✓ Form cleared');
};

// ========================================
// כלמוביל - פונקציות חישוב
// ========================================

function calculateKalmobilManagerCommissions(prefix, empId, data, totalCars, branchTarget, financePercent, stockPercent) {
    // 1. מסירות רכב - מדרגות פיקס לפי totalCars
    let carsComm = 0;
    if (totalCars >= 31) {
        carsComm = 10000;
    } else if (totalCars >= 21) {
        carsComm = 8000;
    } else if (totalCars >= 16) {
        carsComm = 7000;
    } else if (totalCars >= 10) {
        carsComm = 5000;
    } else if (totalCars >= 1) {
        carsComm = 4000;
    }
    
    // 2. יעד משולב: יעד מסירות + 32% מימון
    const combinedBonus = (branchTarget > 0 && totalCars >= branchTarget && financePercent >= 32) ? 1000 : 0;
    
    // 3. יעד מלאי: 40%+ מכירות מהמלאי
    const stockBonus = (stockPercent >= 40) ? 1000 : 0;
    
    // 4. הרחבות אחריות (הזנה ידנית)
    const warrantyComm = data.warrantyCommission || 0;
    
    // 5. חבילות שירות/טופ סרוויס (הזנה ידנית)
    const topserviceComm = data.topserviceCommission || 0;
    
    // 6. רכבי הדגמה
    const demo = data.demo || 0;
    
    // 7. הפרשי עמלות
    const diff = data.diff || 0;
    
    // רכיב רכבים
    const vehiclesTotal = carsComm + combinedBonus + stockBonus + warrantyComm + topserviceComm + demo + diff;
    
    // רכיב מימון
    const financeTotal = data.finance || 0;
    
    // רכיב טרייד אין
    const tradeinTotal = data.tradein || 0;
    
    // סה"כ
    const total = vehiclesTotal + financeTotal + tradeinTotal;
    
    // Update displays
    setDisplay(`${prefix}-${empId}-cars-commission`, carsComm);
    setDisplay(`${prefix}-${empId}-combined-bonus`, combinedBonus);
    setDisplay(`${prefix}-${empId}-stock-bonus`, stockBonus);
    setDisplay(`${prefix}-${empId}-warranty-display`, warrantyComm);
    setDisplay(`${prefix}-${empId}-topservice-display`, topserviceComm);
    setDisplay(`${prefix}-${empId}-demo-display`, demo);
    setDisplay(`${prefix}-${empId}-diff-display`, diff);
    setDisplay(`${prefix}-${empId}-vehicles-display`, vehiclesTotal);
    setDisplay(`${prefix}-${empId}-finance-display`, financeTotal);
    setDisplay(`${prefix}-${empId}-tradein-display`, tradeinTotal);
    setDisplay(`${prefix}-${empId}-total-display`, total);
    
    return {
        vehiclesComponent: vehiclesTotal,
        tradeInComponent: tradeinTotal,
        financeComponent: financeTotal,
        total: total
    };
}

function calculateKalmobilSalespersonCommissions(prefix, empId, data, totalCars, branchTarget, financePercent, stockPercent) {
    // 1. מסירות רכב - מדרגות עם רטרו
    let carsComm = 0;
    let breakdown = '';
    
    if (totalCars >= 31) {
        // רכבים 1-10: 200 ש"ח
        const first10 = Math.min(10, totalCars) * 200;
        // רכבים 11+: 450 ש"ח (רטרו)
        const rest = (totalCars - 10) * 450;
        carsComm = first10 + rest;
        breakdown = `1-10: ${Math.min(10, totalCars)}×200=₪${first10.toLocaleString()} + 11-${totalCars}: ${totalCars - 10}×450=₪${rest.toLocaleString()}`;
    } else if (totalCars >= 26) {
        // רכבים 1-10: 200 ש"ח
        const first10 = Math.min(10, totalCars) * 200;
        // רכבים 11+: 400 ש"ח (רטרו)
        const rest = (totalCars - 10) * 400;
        carsComm = first10 + rest;
        breakdown = `1-10: ${Math.min(10, totalCars)}×200=₪${first10.toLocaleString()} + 11-${totalCars}: ${totalCars - 10}×400=₪${rest.toLocaleString()}`;
    } else if (totalCars >= 21) {
        // רכבים 1-10: 200 ש"ח
        const first10 = Math.min(10, totalCars) * 200;
        // רכבים 11+: 350 ש"ח (רטרו)
        const rest = (totalCars - 10) * 350;
        carsComm = first10 + rest;
        breakdown = `1-10: ${Math.min(10, totalCars)}×200=₪${first10.toLocaleString()} + 11-${totalCars}: ${totalCars - 10}×350=₪${rest.toLocaleString()}`;
    } else if (totalCars >= 11) {
        // רכבים 1-10: 200 ש"ח
        const first10 = Math.min(10, totalCars) * 200;
        // רכבים 11+: 300 ש"ח (רטרו)
        const rest = (totalCars - 10) * 300;
        carsComm = first10 + rest;
        breakdown = `1-10: ${Math.min(10, totalCars)}×200=₪${first10.toLocaleString()} + 11-${totalCars}: ${totalCars - 10}×300=₪${rest.toLocaleString()}`;
    } else {
        // עד 10 רכבים: 200 ש"ח
        carsComm = totalCars * 200;
        breakdown = `${totalCars}×200=₪${carsComm.toLocaleString()}`;
    }
    
    // 2. יעד משולב: יעד מסירות + 32% מימון
    const combinedBonus = (branchTarget > 0 && totalCars >= branchTarget && financePercent >= 32) ? 1000 : 0;
    
    // 3. יעד מלאי: 40%+ מכירות מהמלאי
    const stockBonus = (stockPercent >= 40) ? 1000 : 0;
    
    // 4. הרחבות אחריות (הזנה ידנית)
    const warrantyComm = data.warrantyCommission || 0;
    
    // 5. חבילות שירות/טופ סרוויס (הזנה ידנית)
    const topserviceComm = data.topserviceCommission || 0;
    
    // 6. רכבי הדגמה
    const demo = data.demo || 0;
    
    // 7. הפרשי עמלות
    const diff = data.diff || 0;
    
    // רכיב רכבים
    const vehiclesTotal = carsComm + combinedBonus + stockBonus + warrantyComm + topserviceComm + demo + diff;
    
    // רכיב מימון
    const financeTotal = data.finance || 0;
    
    // רכיב טרייד אין
    const tradeinTotal = data.tradein || 0;
    
    // סה"כ
    const total = vehiclesTotal + financeTotal + tradeinTotal;
    
    // Update displays
    setDisplay(`${prefix}-${empId}-cars-commission`, carsComm);
    // Set breakdown as text
    const breakdownEl = document.getElementById(`${prefix}-${empId}-cars-breakdown`);
    if (breakdownEl) breakdownEl.textContent = breakdown;
    
    setDisplay(`${prefix}-${empId}-combined-bonus`, combinedBonus);
    setDisplay(`${prefix}-${empId}-stock-bonus`, stockBonus);
    setDisplay(`${prefix}-${empId}-warranty-display`, warrantyComm);
    setDisplay(`${prefix}-${empId}-topservice-display`, topserviceComm);
    setDisplay(`${prefix}-${empId}-demo-display`, demo);
    setDisplay(`${prefix}-${empId}-diff-display`, diff);
    setDisplay(`${prefix}-${empId}-vehicles-display`, vehiclesTotal);
    setDisplay(`${prefix}-${empId}-finance-display`, financeTotal);
    setDisplay(`${prefix}-${empId}-tradein-display`, tradeinTotal);
    setDisplay(`${prefix}-${empId}-total-display`, total);
    
    return {
        vehiclesComponent: vehiclesTotal,
        tradeInComponent: tradeinTotal,
        financeComponent: financeTotal,
        total: total
    };
}

function calculateKalmobilOperationsCommissions(prefix, empId, data) {
    // 1. הרחבות אחריות (הזנה ידנית)
    const warrantyComm = data.warrantyCommission || 0;
    
    // 2. חבילות שירות/טופ סרוויס (הזנה ידנית)
    const topserviceComm = data.topserviceCommission || 0;
    
    // 3. הפרשי עמלות
    const diff = data.diff || 0;
    
    // רכיב רכבים
    const vehiclesTotal = warrantyComm + topserviceComm + diff;
    
    // רכיב מימון
    const financeTotal = data.finance || 0;
    
    // רכיב טרייד אין
    const tradeinTotal = data.tradein || 0;
    
    // סה"כ
    const total = vehiclesTotal + financeTotal + tradeinTotal;
    
    // Update displays
    setDisplay(`${prefix}-${empId}-warranty-display`, warrantyComm);
    setDisplay(`${prefix}-${empId}-topservice-display`, topserviceComm);
    setDisplay(`${prefix}-${empId}-diff-display`, diff);
    setDisplay(`${prefix}-${empId}-vehicles-display`, vehiclesTotal);
    setDisplay(`${prefix}-${empId}-finance-display`, financeTotal);
    setDisplay(`${prefix}-${empId}-tradein-display`, tradeinTotal);
    setDisplay(`${prefix}-${empId}-total-display`, total);
    
    return {
        vehiclesComponent: vehiclesTotal,
        tradeInComponent: tradeinTotal,
        financeComponent: financeTotal,
        total: total
    };
}

console.log('✓ calc-generic.js ready');
