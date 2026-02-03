// 🧮 מנוע חישובים גנרי לכל אולם (מודל יונדאי)

window.calculateGenericMonth = function(showroomId, month) {
    console.log('========================================');
    console.log('🧮 calculateGenericMonth:', showroomId, month);
    console.log('========================================');
    
    try {
        const config = getShowroomConfig(showroomId);
        if (!config) {
            console.error('Config not found for:', showroomId);
            return;
        }
        
        const prefix = config.prefix + '-' + month;
        console.log('Prefix:', prefix);
        
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
        
        // Get branch target
        const branchTarget = getValue(prefix + '-branch-target');
        
        // Get manager data
        const manager = config.employees.manager;
        const managerData = {
            finance: getValue(prefix + `-${manager.id}-finance`),
            tradeIn: getValue(prefix + `-${manager.id}-tradein`),
            demo: getValue(prefix + `-${manager.id}-demo`),
            diff: getValue(prefix + `-${manager.id}-diff`)
        };
        
        // Get salespeople data
        const salespeople = config.employees.salespeople || [];
        const activeSalespeople = salespeople.filter(s => !s.placeholder);
        
        const salespeopleData = {};
        let totalCars = 0;
        let totalTopService = 0;
        let totalTopServicePot = 0;
        let totalInsurance = 0;
        
        activeSalespeople.forEach(sp => {
            const data = {
                target: getValue(prefix + `-${sp.id}-target`),
                cars: getValue(prefix + `-${sp.id}-cars`),
                insurance: getValue(prefix + `-${sp.id}-insurance`),
                topService: getValue(prefix + `-${sp.id}-topservice`),
                topServicePot: getValue(prefix + `-${sp.id}-topservice-potential`),
                warranty: getValue(prefix + `-${sp.id}-warranty`),
                mystery: getValue(prefix + `-${sp.id}-mystery`),
                demo: getValue(prefix + `-${sp.id}-demo`),
                diff: getValue(prefix + `-${sp.id}-diff`),
                finance: getValue(prefix + `-${sp.id}-finance`),
                tradeIn: getValue(prefix + `-${sp.id}-tradein`)
            };
            
            salespeopleData[sp.id] = data;
            totalCars += data.cars;
            totalTopService += data.topService;
            totalTopServicePot += data.topServicePot;
            totalInsurance += data.insurance;
        });
        
        // Get operations data
        const operations = config.employees.operations;
        let operationsData = null;
        if (operations) {
            operationsData = {
                insurance: getValue(prefix + `-${operations.id}-insurance`)
            };
            totalInsurance += operationsData.insurance;
        }
        
        console.log('📊 Totals:', { totalCars, totalTopService, totalTopServicePot, totalInsurance, branchTarget });
        
        // Update total cars display
        const totalCarsEl = document.getElementById(prefix + '-total-cars');
        if (totalCarsEl) totalCarsEl.value = totalCars;
        
        // Check if branch met target
        const branchMetTarget = branchTarget > 0 && totalCars >= branchTarget;
        
        // Update status
        const statusEl = document.getElementById(prefix + '-target-status');
        if (statusEl && branchTarget > 0) {
            const percent = Math.round((totalCars / branchTarget) * 100);
            if (branchMetTarget) {
                statusEl.innerHTML = `<span style="color: #28a745;">✅ עמד ביעד! (${percent}%)</span>`;
                statusEl.style.background = '#d4edda';
            } else {
                statusEl.innerHTML = `<span style="color: #dc3545;">⏳ טרם עמד ביעד (${percent}%)</span>`;
                statusEl.style.background = '#f8d7da';
            }
        }
        
        // Calculate for each salesperson
        const salespeopleResults = {};
        activeSalespeople.forEach(sp => {
            const data = salespeopleData[sp.id];
            const result = calculateSalesperson(data, totalCars, branchMetTarget, totalTopService, totalTopServicePot);
            salespeopleResults[sp.id] = result;
            
            // Display results
            setDisplay(prefix + `-${sp.id}-vehicles-breakdown`, result.vehicleComm);
            setDisplay(prefix + `-${sp.id}-insurance-display`, result.insComm);
            setDisplay(prefix + `-${sp.id}-topservice-display`, result.topComm);
            setDisplay(prefix + `-${sp.id}-warranty-display`, result.warComm);
            setDisplay(prefix + `-${sp.id}-mystery-display`, result.mystAdj);
            setDisplay(prefix + `-${sp.id}-demo-display`, data.demo);
            setDisplay(prefix + `-${sp.id}-diff-display`, data.diff);
            setDisplay(prefix + `-${sp.id}-vehicles-display`, result.vehiclesTotal);
            setDisplay(prefix + `-${sp.id}-tradein-display`, data.tradeIn);
            setDisplay(prefix + `-${sp.id}-finance-display`, data.finance);
            setDisplay(prefix + `-${sp.id}-total-display`, result.total);
        });
        
        // Calculate for operations
        let operationsResult = null;
        if (operations && operationsData) {
            const topSvcPct = totalCars > 0 ? (totalTopService / totalCars) * 100 : 0;
            let rate = 50;
            if (topSvcPct >= 70) rate = 80;
            else if (topSvcPct >= 60) rate = 70;
            
            const topComm = totalTopService * rate;
            const insComm = operationsData.insurance * 75;
            const total = topComm + insComm;
            
            operationsResult = { topComm, insComm, total };
            
            setDisplay(prefix + `-${operations.id}-topservice-display`, topComm);
            setDisplay(prefix + `-${operations.id}-insurance-display`, insComm);
            setDisplay(prefix + `-${operations.id}-vehicles-display`, total);
            setDisplay(prefix + `-${operations.id}-total-display`, total);
        }
        
        // Calculate for manager
        const meirBase = totalCars * 200;
        const meirVehicles = meirBase + managerData.demo + managerData.diff;
        const meirTotal = meirVehicles + managerData.tradeIn + managerData.finance;
        
        setDisplay(prefix + `-${manager.id}-base-display`, meirBase);
        setDisplay(prefix + `-${manager.id}-demo-display`, managerData.demo);
        setDisplay(prefix + `-${manager.id}-diff-display`, managerData.diff);
        setDisplay(prefix + `-${manager.id}-vehicles-display`, meirVehicles);
        setDisplay(prefix + `-${manager.id}-tradein-display`, managerData.tradeIn);
        setDisplay(prefix + `-${manager.id}-finance-display`, managerData.finance);
        setDisplay(prefix + `-${manager.id}-total-display`, meirTotal);
        
        // Update performance table
        updatePerformanceTable(prefix, branchTarget, totalCars, totalTopService, totalTopServicePot, totalInsurance);
        
        // Store calculated results
        window.lastCalculatedResults = window.lastCalculatedResults || {};
        window.lastCalculatedResults[showroomId] = window.lastCalculatedResults[showroomId] || {};
        
        const results = {
            [manager.id]: {
                vehiclesComponent: meirVehicles,
                tradeInComponent: managerData.tradeIn,
                financeComponent: managerData.finance,
                total: meirTotal
            }
        };
        
        activeSalespeople.forEach(sp => {
            results[sp.id] = {
                vehiclesComponent: salespeopleResults[sp.id].vehiclesTotal,
                tradeInComponent: salespeopleData[sp.id].tradeIn,
                financeComponent: salespeopleData[sp.id].finance,
                total: salespeopleResults[sp.id].total
            };
        });
        
        if (operations && operationsResult) {
            results[operations.id] = {
                vehiclesComponent: operationsResult.total,
                tradeInComponent: 0,
                financeComponent: 0,
                total: operationsResult.total
            };
        }
        
        window.lastCalculatedResults[showroomId][month] = results;
        console.log('💾 Stored results for', showroomId, month, ':', results);
        
        console.log('✓ Calculation complete!');
        
    } catch (error) {
        console.error('Error in calculateGenericMonth:', error);
    }
};

// Calculate salesperson commissions (same logic as before)
function calculateSalesperson(data, totalBranchCars, branchMetTarget, totalTopService, totalCars) {
    let vehicleComm = data.cars * 150;
    
    if (branchMetTarget) {
        vehicleComm += totalBranchCars * 10;
    }
    
    if (data.target > 0 && data.cars >= data.target) {
        vehicleComm += data.cars * 20;
        
        const percent = (data.cars / data.target) * 100;
        if (percent >= 110) {
            vehicleComm += data.cars * 10;
        }
    }
    
    const insComm = data.insurance * 75;
    
    // Top service
    const topPotential = data.topServicePot > 0 ? data.topServicePot : data.cars;
    const topPct = topPotential > 0 ? (data.topService / topPotential) * 100 : 0;
    const topRate = topPct >= 60 ? 175 : 150;
    const topComm = data.topService * topRate;
    
    const warComm = data.warranty * 60;
    
    // Mystery shopper
    let mystAdj = 0;
    if (data.mystery > 0) {
        if (data.mystery < 80) {
            mystAdj = -vehicleComm * 0.2;
        } else if (data.mystery >= 90) {
            mystAdj = vehicleComm * 0.2;
        }
    }
    
    const vehiclesTotal = vehicleComm + insComm + topComm + warComm + mystAdj + data.demo + data.diff;
    const total = vehiclesTotal + data.finance + data.tradeIn;
    
    return {
        vehicleComm,
        insComm,
        topComm,
        warComm,
        mystAdj,
        vehiclesTotal,
        total
    };
}

// Update performance table
function updatePerformanceTable(prefix, target, actual, topSvc, topPot, insurance) {
    try {
        // Cars
        const carsPct = target > 0 ? Math.round((actual / target) * 100) : 0;
        const carsTarget = document.getElementById(prefix + '-perf-cars-target');
        const carsActual = document.getElementById(prefix + '-perf-cars-actual');
        const carsPercent = document.getElementById(prefix + '-perf-cars-percent');
        const carsStatus = document.getElementById(prefix + '-perf-cars-status');
        
        if (carsTarget) carsTarget.textContent = target || '-';
        if (carsActual) carsActual.textContent = actual || '-';
        if (carsPercent) carsPercent.textContent = target > 0 ? carsPct + '%' : '-';
        
        if (target > 0 && carsStatus) {
            if (carsPct >= 100) {
                carsStatus.textContent = '✅ מצוין';
                carsStatus.className = 'status-cell status-excellent';
            } else if (carsPct >= 90) {
                carsStatus.textContent = '⚠️ קרוב';
                carsStatus.className = 'status-cell status-good';
            } else {
                carsStatus.textContent = '❌ נמוך';
                carsStatus.className = 'status-cell status-poor';
            }
        }
        
        // Top Service
        const topPct = topPot > 0 ? Math.round((topSvc / topPot) * 100) : 0;
        const topTarget = document.getElementById(prefix + '-perf-topservice-target');
        const topActual = document.getElementById(prefix + '-perf-topservice-actual');
        const topPercent = document.getElementById(prefix + '-perf-topservice-percent');
        const topStatus = document.getElementById(prefix + '-perf-topservice-status');
        
        if (topTarget) topTarget.textContent = topPot || '-';
        if (topActual) topActual.textContent = topSvc || '-';
        if (topPercent) topPercent.textContent = topPot > 0 ? topPct + '%' : '-';
        
        if (topPot > 0 && topStatus) {
            if (topPct >= 60) {
                topStatus.textContent = '✅ מעולה';
                topStatus.className = 'status-cell status-excellent';
            } else if (topPct >= 50) {
                topStatus.textContent = '⚠️ בינוני';
                topStatus.className = 'status-cell status-good';
            } else {
                topStatus.textContent = '❌ חלש';
                topStatus.className = 'status-cell status-poor';
            }
        }
        
        // Insurance
        const insTarget = actual;
        const insPct = actual > 0 ? Math.round((insurance / actual) * 100) : 0;
        const insTargetEl = document.getElementById(prefix + '-perf-insurance-target');
        const insActual = document.getElementById(prefix + '-perf-insurance-actual');
        const insPercent = document.getElementById(prefix + '-perf-insurance-percent');
        const insStatus = document.getElementById(prefix + '-perf-insurance-status');
        
        if (insTargetEl) insTargetEl.textContent = insTarget || '-';
        if (insActual) insActual.textContent = insurance || '-';
        if (insPercent) insPercent.textContent = actual > 0 ? insPct + '%' : '-';
        
        if (actual > 0 && insStatus) {
            if (insPct >= 40) {
                insStatus.textContent = '✅ מעולה';
                insStatus.className = 'status-cell status-excellent';
            } else if (insPct >= 30) {
                insStatus.textContent = '⚠️ בינוני';
                insStatus.className = 'status-cell status-good';
            } else {
                insStatus.textContent = '❌ חלש';
                insStatus.className = 'status-cell status-poor';
            }
        }
    } catch (error) {
        console.error('Error updating performance table:', error);
    }
}

console.log('✓ Generic calculator loaded');
