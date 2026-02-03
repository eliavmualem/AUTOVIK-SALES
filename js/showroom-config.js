// 🏢 תצורת אולמות ועובדים

window.showroomConfigs = {
    'hyundai-jerusalem': {
        name: 'יונדאי אוטולין ירושלים',
        prefix: 'hj',
        employees: {
            manager: {
                id: 'meir',
                name: 'מאיר מועלם',
                role: 'מנהל אולם',
                icon: '👔',
                type: 'manager'
            },
            salespeople: [
                {
                    id: 'daniel',
                    name: 'דניאל נגר',
                    role: 'איש מכירות',
                    icon: '💼',
                    type: 'salesperson'
                },
                {
                    id: 'alfred',
                    name: 'אלפרד בנד',
                    role: 'איש מכירות',
                    icon: '💼',
                    type: 'salesperson'
                }
            ],
            operations: {
                id: 'daniele',
                name: 'דניאל אליה',
                role: 'איש תפעול',
                icon: '⚙️',
                type: 'operations'
            }
        }
    },
    
    'hyundai-modiin': {
        name: 'יונדאי מודיעין',
        prefix: 'hm',
        employees: {
            manager: {
                id: 'guy',
                name: 'גיא הררי',
                role: 'מנהל אולם',
                icon: '👔',
                type: 'manager'
            },
            salespeople: [
                {
                    id: 'dario',
                    name: 'דריו נוטריקה',
                    role: 'איש מכירות',
                    icon: '💼',
                    type: 'salesperson'
                },
                {
                    id: 'sales2',
                    name: 'איש מכירות 2',
                    role: 'איש מכירות (פתוח)',
                    icon: '💼',
                    type: 'salesperson'
                    // לא placeholder - השדות פתוחים
                }
            ],
            operations: {
                id: 'asher',
                name: 'אשר עמר',
                role: 'איש תפעול',
                icon: '⚙️',
                type: 'operations'
            }
        }
    },
    
    'mitsubishi-modiin': {
        name: 'מיצובישי מודיעין',
        prefix: 'mm',
        employees: {
            manager: {
                id: 'shahaf',
                name: 'שחף כהן',
                role: 'מנהל אולם מוכר',
                icon: '👔',
                type: 'selling-manager'  // מנהל מוכר - מקבל שדות כמו נציג אבל חישוב שונה
            },
            salespeople: [
                {
                    id: 'sales1',
                    name: 'איש מכירות 1',
                    role: 'איש מכירות',
                    icon: '💼',
                    type: 'salesperson',
                    placeholder: true  // נציג ללא שם - מודל עמלות כמו יונדאי
                }
            ],
            operations: null
        }
    },
    
    'omoda-modiin': {
        name: 'אומודה ג\'אקו מודיעין',
        prefix: 'om',
        employees: {
            manager: {
                id: 'hila',
                name: 'הילה שלומי',
                role: 'מנהלת אולם מוכרת',
                icon: '👔',
                type: 'selling-manager'  // מנהלת מוכרת - מקבלת שדות כמו נציג אבל חישוב שונה
            },
            salespeople: [
                {
                    id: 'shir',
                    name: 'שיר עלימה',
                    role: 'איש מכירות',
                    icon: '💼',
                    type: 'salesperson'
                },
                {
                    id: 'yehav',
                    name: 'יהב בן דוד',
                    role: 'איש מכירות',
                    icon: '💼',
                    type: 'salesperson'
                }
            ],
            operations: {
                id: 'asher',
                name: 'אשר עמר',
                role: 'איש תפעול',
                icon: '⚙️',
                type: 'operations'
            }
        }
    },
    
    'kalmobil-modiin': {
            name: 'כלמוביל טרייד אין מודיעין',
            prefix: 'km',
            employees: {
                manager: {
                    id: 'david',
                    name: 'דוד עזרא',
                    role: 'מנהל אולם',
                    icon: '👔',
                    type: 'kalmobil-manager'  // מודל מיוחד
                },
                salespeople: [
                    {
                        id: 'aviad',
                        name: 'אביעד לולאי',
                        role: 'איש מכירות',
                        icon: '💼',
                        type: 'kalmobil-salesperson'  // מודל מיוחד
                    }
                ],
                operations: {
                    id: 'david-h',
                    name: 'דוד הירשהורן',
                    role: 'איש תפעול',
                    icon: '⚙️',
                    type: 'kalmobil-operations'  // מודל מיוחד
                }
            }
    },
    
    // ג'ילי מודיעין
    'geely-modiin': {
        name: 'ג\'ילי מודיעין',
        prefix: 'gm',
        employees: {
            manager: {
                id: 'uri',
                name: 'אורי עסיס',
                role: 'מנהל אולם',
                icon: '👔',
                type: 'geely-manager'
            },
            salespeople: [
                {
                    id: 'daniel',
                    name: 'דניאל עטיה',
                    role: 'איש מכירות',
                    icon: '💼',
                    type: 'geely-salesperson'
                },
                {
                    id: 'meshi',
                    name: 'משי גרמה',
                    role: 'איש מכירות',
                    icon: '💼',
                    type: 'geely-salesperson'
                }
            ],
            operations: null  // אין איש תפעול כרגע
        }
    },
    
    'geely-jerusalem': {
        name: 'ג\'ילי ירושלים',
        prefix: 'gj',
        employees: {
            manager: {
                id: 'shanir',
                name: 'שניר חולי',
                role: 'מנהל אולם',
                icon: '👔',
                type: 'geely-manager'
            },
            salespeople: [
                {
                    id: 'israel',
                    name: 'ישראל לוי',
                    role: 'איש מכירות',
                    icon: '💼',
                    type: 'geely-salesperson'
                }
            ],
            operations: null  // אין איש תפעול כרגע
        }
    }
};

// פונקציה לקבלת תצורת אולם
window.getShowroomConfig = function(showroomId) {
    return showroomConfigs[showroomId];
};

// פונקציה לקבלת כל שמות העובדים באולם
window.getShowroomEmployees = function(showroomId) {
    const config = showroomConfigs[showroomId];
    if (!config) return [];
    
    const employees = [];
    
    // מנהל
    if (config.employees.manager) {
        employees.push(config.employees.manager);
    }
    
    // אנשי מכירות
    if (config.employees.salespeople) {
        employees.push(...config.employees.salespeople);
    }
    
    // תפעול
    if (config.employees.operations) {
        employees.push(config.employees.operations);
    }
    
    return employees;
};

// פונקציה לקבלת רשימה שטוחה של כל העובדים עם פרטיהם
window.getShowroomEmployeesList = function(showroomId) {
    const config = window.showroomConfigs[showroomId];
    if (!config || !config.employees) return [];
    
    const employeesList = [];
    const emp = config.employees;
    
    // הוספת המנהל
    if (emp.manager) {
        employeesList.push({
            id: emp.manager.id,
            name: emp.manager.name,
            role: emp.manager.role || 'מנהל אולם',
            type: emp.manager.type || 'manager'
        });
    }
    
    // הוספת אנשי המכירות
    if (emp.salespeople && Array.isArray(emp.salespeople)) {
        emp.salespeople.forEach(sp => {
            employeesList.push({
                id: sp.id,
                name: sp.name,
                role: sp.role || 'איש מכירות',
                type: sp.type || 'salesperson'
            });
        });
    }
    
    // הוספת איש תפעול
    if (emp.operations) {
        employeesList.push({
            id: emp.operations.id,
            name: emp.operations.name,
            role: emp.operations.role || 'איש תפעול',
            type: emp.operations.type || 'operations'
        });
    }
    
    return employeesList;
};

console.log('✓ Showroom configurations loaded');
