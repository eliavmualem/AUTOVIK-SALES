// Simple calculation that WILL work
console.log('calc-simple.js loaded!');

window.calculateMonth = function(month) {
    console.log('========================================');
    console.log('✓✓✓ calculateMonth called! Month:', month);
    console.log('========================================');
    
    try {
        const prefix = 'hj-' + month;
        console.log('Prefix:', prefix);
        
        // Helper to get value
        function getValue(id) {
            const el = document.getElementById(id);
            return el ? (parseFloat(el.value) || 0) : 0;
        }
        
        // Helper to set display
        function setDisplay(id, value) {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = '₪' + Math.round(value).toLocaleString('he-IL');
            }
        }
        
        // Get all data
        const branchTarget = getValue(prefix + '-branch-target');
        
        const daniel = {
            target: getValue(prefix + '-daniel-target'),
            cars: getValue(prefix + '-daniel-cars'),
            insurance: getValue(prefix + '-daniel-insurance'),
            topService: getValue(prefix + '-daniel-topservice'),
            topServicePot: getValue(prefix + '-daniel-topservice-potential'),
            warranty: getValue(prefix + '-daniel-warranty'),
            mystery: getValue(prefix + '-daniel-mystery'),
            demo: getValue(prefix + '-daniel-demo'),
            diff: getValue(prefix + '-daniel-diff'),
            finance: getValue(prefix + '-daniel-finance'),
            tradeIn: getValue(prefix + '-daniel-tradein')
        };
        
        const alfred = {
            target: getValue(prefix + '-alfred-target'),
            cars: getValue(prefix + '-alfred-cars'),
            insurance: getValue(prefix + '-alfred-insurance'),
            topService: getValue(prefix + '-alfred-topservice'),
            topServicePot: getValue(prefix + '-alfred-topservice-potential'),
            warranty: getValue(prefix + '-alfred-warranty'),
            mystery: getValue(prefix + '-alfred-mystery'),
            demo: getValue(prefix + '-alfred-demo'),
            diff: getValue(prefix + '-alfred-diff'),
            finance: getValue(prefix + '-alfred-finance'),
            tradeIn: getValue(prefix + '-alfred-tradein')
        };
        
        const danielE = {
            insurance: getValue(prefix + '-daniele-insurance') || getValue(prefix + '-daniel-e-insurance')
        };
        
        const meir = {
            cars: getValue(prefix + '-meir-cars'),  // ✅ חדש - מכירות מאיר
            finance: getValue(prefix + '-meir-finance'),
            tradeIn: getValue(prefix + '-meir-tradein'),
            demo: getValue(prefix + '-meir-demo'),
            diff: getValue(prefix + '-meir-diff')
        };
        
        // Calculate totals (including manager's cars)
        const totalCars = daniel.cars + alfred.cars + meir.cars;
        const totalTopService = daniel.topService + alfred.topService;
        const totalTopServicePot = daniel.topServicePot + alfred.topServicePot;
        
        console.log('📊 Totals:', {
            totalCars,
            totalTopService,
            totalTopServicePot,
            branchTarget
        });
        
        // Update total cars display
        const totalCarsEl = document.getElementById(prefix + '-total-cars');
        if (totalCarsEl) totalCarsEl.value = totalCars;
        
        // Update branch target status
        if (typeof updateBranchTargetStatus === 'function') {
            updateBranchTargetStatus(month);
        }
        
        // Branch met target?
        const branchMetTarget = branchTarget > 0 && totalCars >= branchTarget;
        
        // Update status
        const statusEl = document.getElementById(prefix + '-target-status');
        if (statusEl && branchTarget > 0) {
            const pct = Math.round((totalCars / branchTarget) * 100);
            if (branchMetTarget) {
                statusEl.innerHTML = '✅ עמד ביעד! (' + pct + '%)';
                statusEl.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                statusEl.style.color = 'white';
            } else {
                statusEl.innerHTML = '⚠️ טרם עמד ביעד (' + pct + '%)';
                statusEl.style.background = 'linear-gradient(135deg, #ffc107, #fd7e14)';
                statusEl.style.color = '#333';
            }
        }
        
        // Calculate for each salesperson
        function calcSales(data, totalCars, branchMet) {
            // Break down vehicle commission components
            const baseCarsComm = data.cars * 150;
            const branchBonus = branchMet ? totalCars * 10 : 0;
            
            const targetPct = data.target > 0 ? (data.cars / data.target) * 100 : 0;
            const targetBonus100 = targetPct >= 100 ? data.cars * 20 : 0;
            const targetBonus110 = targetPct >= 110 ? data.cars * 10 : 0;
            
            const vehicleComm = baseCarsComm + branchBonus + targetBonus100 + targetBonus110;
            
            const insComm = data.insurance * 75;
            
            const topBase = data.topServicePot > 0 ? data.topServicePot : data.cars;
            const topPct = topBase > 0 ? (data.topService / topBase) * 100 : 0;
            const topRate = topPct >= 60 ? 175 : 150;
            const topComm = data.topService * topRate;
            
            const warComm = data.warranty * 60;
            
            // Mystery shopper adjustment - calculated on TOTAL vehicle commission (base + bonuses)
            let mystAdj = 0;
            if (data.mystery > 0 && data.mystery < 80) {
                mystAdj = -(vehicleComm * 0.2);
            } else if (data.mystery >= 90) {
                mystAdj = vehicleComm * 0.2;
            }
            
            const vehiclesTotal = vehicleComm + insComm + topComm + warComm + mystAdj + data.demo + data.diff;
            
            // Create breakdown text
            const breakdownParts = [];
            breakdownParts.push(`בסיס ${data.cars}×150 = ₪${baseCarsComm.toLocaleString()}`);
            if (branchBonus > 0) breakdownParts.push(`בונוס סניף ${totalCars}×10 = ₪${branchBonus.toLocaleString()}`);
            if (targetBonus100 > 0) breakdownParts.push(`בונוס 100% = ₪${targetBonus100.toLocaleString()}`);
            if (targetBonus110 > 0) breakdownParts.push(`בונוס 110% = ₪${targetBonus110.toLocaleString()}`);
            const breakdown = breakdownParts.join(' + ');
            
            return {
                vehicleComm, insComm, topComm, warComm, mystAdj,
                vehiclesTotal, breakdown,
                total: vehiclesTotal + data.finance + data.tradeIn
            };
        }
        
        const danielRes = calcSales(daniel, totalCars, branchMetTarget);
        const alfredRes = calcSales(alfred, totalCars, branchMetTarget);
        
        // Display Daniel - support both old and new layout
        setDisplay(prefix + '-daniel-base-commission', danielRes.vehicleComm);
        // Set breakdown as text (not number)
        const danielBreakdownEl = document.getElementById(prefix + '-daniel-vehicles-breakdown');
        if (danielBreakdownEl) danielBreakdownEl.textContent = danielRes.breakdown;
        setDisplay(prefix + '-daniel-insurance-commission', danielRes.insComm);
        setDisplay(prefix + '-daniel-insurance-display', danielRes.insComm);  // NEW
        setDisplay(prefix + '-daniel-topservice-commission', danielRes.topComm);
        setDisplay(prefix + '-daniel-topservice-display', danielRes.topComm);  // NEW
        setDisplay(prefix + '-daniel-warranty-commission', danielRes.warComm);
        setDisplay(prefix + '-daniel-warranty-display', danielRes.warComm);  // NEW
        setDisplay(prefix + '-daniel-mystery-adjustment', danielRes.mystAdj);
        setDisplay(prefix + '-daniel-mystery-display', danielRes.mystAdj);  // NEW
        setDisplay(prefix + '-daniel-demo-display', daniel.demo);
        setDisplay(prefix + '-daniel-diff-display', daniel.diff);
        setDisplay(prefix + '-daniel-vehicles', danielRes.vehiclesTotal);
        setDisplay(prefix + '-daniel-vehicles-display', danielRes.vehiclesTotal);  // NEW
        setDisplay(prefix + '-daniel-tradein-display', daniel.tradeIn);
        setDisplay(prefix + '-daniel-finance-display', daniel.finance);
        setDisplay(prefix + '-daniel-total', danielRes.total);
        setDisplay(prefix + '-daniel-total-display', danielRes.total);  // NEW
        
        // Display Alfred - support both old and new layout
        setDisplay(prefix + '-alfred-base-commission', alfredRes.vehicleComm);
        // Set breakdown as text (not number)
        const alfredBreakdownEl = document.getElementById(prefix + '-alfred-vehicles-breakdown');
        if (alfredBreakdownEl) alfredBreakdownEl.textContent = alfredRes.breakdown;
        setDisplay(prefix + '-alfred-insurance-commission', alfredRes.insComm);
        setDisplay(prefix + '-alfred-insurance-display', alfredRes.insComm);  // NEW
        setDisplay(prefix + '-alfred-topservice-commission', alfredRes.topComm);
        setDisplay(prefix + '-alfred-topservice-display', alfredRes.topComm);  // NEW
        setDisplay(prefix + '-alfred-warranty-commission', alfredRes.warComm);
        setDisplay(prefix + '-alfred-warranty-display', alfredRes.warComm);  // NEW
        setDisplay(prefix + '-alfred-mystery-adjustment', alfredRes.mystAdj);
        setDisplay(prefix + '-alfred-mystery-display', alfredRes.mystAdj);  // NEW
        setDisplay(prefix + '-alfred-demo-display', alfred.demo);
        setDisplay(prefix + '-alfred-diff-display', alfred.diff);
        setDisplay(prefix + '-alfred-vehicles', alfredRes.vehiclesTotal);
        setDisplay(prefix + '-alfred-vehicles-display', alfredRes.vehiclesTotal);  // NEW
        setDisplay(prefix + '-alfred-tradein-display', alfred.tradeIn);
        setDisplay(prefix + '-alfred-finance-display', alfred.finance);
        setDisplay(prefix + '-alfred-total', alfredRes.total);
        setDisplay(prefix + '-alfred-total-display', alfredRes.total);  // NEW
        
        // Calculate Daniel E (operations)
        // Calculate Top Service percentage based on POTENTIAL (from salespeople)
        const topSvcPct = totalTopServicePot > 0 ? (totalTopService / totalTopServicePot) * 100 : 0;
        let danielERate = 50;  // < 60%
        if (topSvcPct >= 70) danielERate = 80;       // 70%+
        else if (topSvcPct >= 60) danielERate = 70;  // 60-69%
        
        const danielETop = totalTopService * danielERate;
        const danielEIns = danielE.insurance * 75;
        const danielETotal = danielETop + danielEIns;
        
        // Daniel E displays - support both old and new layout
        setDisplay(prefix + '-daniel-e-topservice-commission', danielETop);
        setDisplay(prefix + '-daniele-topservice-display', danielETop);  // NEW
        setDisplay(prefix + '-daniel-e-insurance-commission', danielEIns);
        setDisplay(prefix + '-daniele-insurance-display', danielEIns);  // NEW
        setDisplay(prefix + '-daniel-e-vehicles', danielETotal);
        setDisplay(prefix + '-daniele-vehicles-display', danielETotal);  // NEW
        setDisplay(prefix + '-daniel-e-total', danielETotal);
        setDisplay(prefix + '-daniele-total-display', danielETotal);  // NEW
        
        // Calculate Meir (manager)
        const meirBase = totalCars * 200;
        const meirVehicles = meirBase + meir.demo + meir.diff;
        const meirTotal = meirVehicles + meir.tradeIn + meir.finance;
        
        // Meir displays - support both old and new layout
        setDisplay(prefix + '-meir-base-commission', meirBase);
        setDisplay(prefix + '-meir-base-display', meirBase);  // NEW
        setDisplay(prefix + '-meir-demo-display', meir.demo);
        setDisplay(prefix + '-meir-diff-display', meir.diff);
        setDisplay(prefix + '-meir-vehicles', meirVehicles);
        setDisplay(prefix + '-meir-vehicles-display', meirVehicles);  // NEW
        setDisplay(prefix + '-meir-tradein-display', meir.tradeIn);
        setDisplay(prefix + '-meir-finance-display', meir.finance);
        setDisplay(prefix + '-meir-total', meirTotal);
        setDisplay(prefix + '-meir-total-display', meirTotal);  // NEW
        
        // Calculate total insurance
        const totalInsurance = daniel.insurance + alfred.insurance + danielE.insurance;
        
        // Update summary table
        updateSummaryTable(prefix, branchTarget, totalCars, totalTopService, totalTopServicePot, totalInsurance);
        
        // Store calculated results for yearly summary
        window.lastCalculatedResults = window.lastCalculatedResults || {};
        window.lastCalculatedResults[month] = {
            meir: {
                vehiclesComponent: meirVehicles,
                tradeInComponent: meir.tradeIn,
                financeComponent: meir.finance,
                total: meirTotal
            },
            daniel: {
                vehiclesComponent: danielRes.vehiclesTotal,
                tradeInComponent: daniel.tradeIn,
                financeComponent: daniel.finance,
                total: danielRes.total
            },
            alfred: {
                vehiclesComponent: alfredRes.vehiclesTotal,
                tradeInComponent: alfred.tradeIn,
                financeComponent: alfred.finance,
                total: alfredRes.total
            },
            danielE: {
                vehiclesComponent: danielETotal,
                tradeInComponent: 0,
                financeComponent: 0,
                total: danielETotal
            }
        };
        
        console.log('💾 Stored calculated results for', month, ':', window.lastCalculatedResults[month]);
        
        console.log('✓ Calculation complete!');
        
    } catch (error) {
        console.error('Error in calculateMonth:', error);
    }
};

function updateSummaryTable(prefix, target, actual, topSvc, topPot, insurance) {
    try {
        // Cars - support both old and new layout
        const carsPct = target > 0 ? Math.round((actual / target) * 100) : 0;
        
        // Old IDs
        const oldTarget = document.getElementById(prefix + '-summary-cars-target');
        const oldActual = document.getElementById(prefix + '-summary-cars-actual');
        const oldPercent = document.getElementById(prefix + '-summary-cars-percent');
        const oldStatus = document.getElementById(prefix + '-summary-cars-status');
        
        // New IDs
        const newTarget = document.getElementById(prefix + '-perf-cars-target');
        const newActual = document.getElementById(prefix + '-perf-cars-actual');
        const newPercent = document.getElementById(prefix + '-perf-cars-percent');
        const newStatus = document.getElementById(prefix + '-perf-cars-status');
        
        // Update both layouts
        if (oldTarget) oldTarget.textContent = target || '-';
        if (newTarget) newTarget.textContent = target || '-';
        if (oldActual) oldActual.textContent = actual || '-';
        if (newActual) newActual.textContent = actual || '-';
        if (oldPercent) oldPercent.textContent = target > 0 ? carsPct + '%' : '-';
        if (newPercent) newPercent.textContent = target > 0 ? carsPct + '%' : '-';
        
        const carsStatus = oldStatus || newStatus;
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
        
        // Top Service - support both old and new layout
        const topPct = topPot > 0 ? Math.round((topSvc / topPot) * 100) : 0;
        
        // Old IDs
        const oldTopTarget = document.getElementById(prefix + '-summary-topservice-target');
        const oldTopActual = document.getElementById(prefix + '-summary-topservice-actual');
        const oldTopPercent = document.getElementById(prefix + '-summary-topservice-percent');
        const oldTopStatus = document.getElementById(prefix + '-summary-topservice-status');
        
        // New IDs
        const newTopTarget = document.getElementById(prefix + '-perf-topservice-target');
        const newTopActual = document.getElementById(prefix + '-perf-topservice-actual');
        const newTopPercent = document.getElementById(prefix + '-perf-topservice-percent');
        const newTopStatus = document.getElementById(prefix + '-perf-topservice-status');
        
        // Update both layouts
        if (oldTopTarget) oldTopTarget.textContent = topPot || '-';
        if (newTopTarget) newTopTarget.textContent = topPot || '-';
        if (oldTopActual) oldTopActual.textContent = topSvc || '-';
        if (newTopActual) newTopActual.textContent = topSvc || '-';
        if (oldTopPercent) oldTopPercent.textContent = topPot > 0 ? topPct + '%' : '-';
        if (newTopPercent) newTopPercent.textContent = topPot > 0 ? topPct + '%' : '-';
        
        const topStatus = oldTopStatus || newTopStatus;
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
        
        // Insurance - support both old and new layout
        // היעד: סך כל המסירות של העובדים
        // עמידה ביעד: אם הביטוחים מהווים 40%+ מהמסירות
        const insTarget = actual; // סך המסירות
        const insPct = actual > 0 ? Math.round((insurance / actual) * 100) : 0;
        
        // Old IDs
        const oldInsTarget = document.getElementById(prefix + '-summary-insurance-target');
        const oldInsActual = document.getElementById(prefix + '-summary-insurance-actual');
        const oldInsPercent = document.getElementById(prefix + '-summary-insurance-percent');
        const oldInsStatus = document.getElementById(prefix + '-summary-insurance-status');
        
        // New IDs
        const newInsTarget = document.getElementById(prefix + '-perf-insurance-target');
        const newInsActual = document.getElementById(prefix + '-perf-insurance-actual');
        const newInsPercent = document.getElementById(prefix + '-perf-insurance-percent');
        const newInsStatus = document.getElementById(prefix + '-perf-insurance-status');
        
        // Update both layouts
        if (oldInsTarget) oldInsTarget.textContent = insTarget || '-';
        if (newInsTarget) newInsTarget.textContent = insTarget || '-';
        if (oldInsActual) oldInsActual.textContent = insurance || '-';
        if (newInsActual) newInsActual.textContent = insurance || '-';
        if (oldInsPercent) oldInsPercent.textContent = actual > 0 ? insPct + '%' : '-';
        if (newInsPercent) newInsPercent.textContent = actual > 0 ? insPct + '%' : '-';
        
        const insStatus = oldInsStatus || newInsStatus;
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
        console.error('Error in updateSummaryTable:', error);
    }
}

console.log('✓ calculateMonth defined as:', typeof window.calculateMonth);
