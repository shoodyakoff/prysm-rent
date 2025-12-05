// Mock Data for Rent Roll Page
// Updated to match the structure required by rent-roll-logic.js and user request

const RENT_ROLL_DATA = [
    // --- OFFICES ---
    {
        id: 1,
        tenant: "ООО ТехноСофт",
        contract_number: "ОФ-2023/001",
        contract_start: "2023-01-15",
        contract_end: "2026-01-14",
        condition_start: "2023-01-15",
        condition_end: "2026-01-14",
        term_desc: "3 г.",
        area_actual: 450.5,
        area_calculated: 450.5,
        coefficient: 1.0,
        bap_rate: 25000, // Base Rent per year per m2
        opex_rate: 3500, // Operating expenses
        map_monthly: 938542, // Monthly Rent
        total_rate: 28500, // Total rate per m2 per year
        type: "office",
        status: "active"
    },
    {
        id: 2,
        tenant: "ИП Иванов А.А.",
        contract_number: "ОФ-2023/015",
        contract_start: "2023-06-01",
        contract_end: "2024-05-31",
        condition_start: "2023-06-01",
        condition_end: "2024-05-31",
        term_desc: "11 мес.",
        area_actual: 85.0,
        area_calculated: 93.5, // +10% BOMA
        coefficient: 1.1,
        bap_rate: 28000,
        opex_rate: 3500,
        map_monthly: 218167,
        total_rate: 31500,
        type: "office",
        status: "active"
    },
    {
        id: 3,
        tenant: "ЗАО ФинКонсалт",
        contract_number: "ОФ-2022/089",
        contract_start: "2022-11-01",
        contract_end: "2027-10-31",
        condition_start: "2022-11-01",
        condition_end: "2027-10-31",
        term_desc: "5 л.",
        area_actual: 1200.0,
        area_calculated: 1200.0,
        coefficient: 1.0,
        bap_rate: 22000,
        opex_rate: 3500,
        map_monthly: 2200000,
        total_rate: 25500,
        type: "office",
        status: "active"
    },

    // --- PARKING ---
    {
        id: 4,
        tenant: "ООО ТехноСофт",
        contract_number: "ММ-2023/001",
        contract_start: "2023-01-15",
        contract_end: "2024-01-14",
        condition_start: "2023-01-15",
        condition_end: "2024-01-14",
        term_desc: "1 г.",
        area_actual: 12.5,
        area_calculated: 12.5,
        coefficient: 1.0,
        bap_rate: 180000, // Price per spot per year
        opex_rate: 0,
        map_monthly: 15000,
        total_rate: 180000,
        type: "parking",
        status: "active"
    },
    {
        id: 5,
        tenant: "ЗАО ФинКонсалт",
        contract_number: "ММ-2022/089",
        contract_start: "2022-11-01",
        contract_end: "2023-10-31",
        condition_start: "2022-11-01",
        condition_end: "2023-10-31",
        term_desc: "11 мес.",
        area_actual: 37.5, // 3 spots
        area_calculated: 37.5,
        coefficient: 1.0,
        bap_rate: 540000,
        opex_rate: 0,
        map_monthly: 45000,
        total_rate: 540000,
        type: "parking",
        status: "active"
    },

    // --- WAREHOUSES ---
    {
        id: 6,
        tenant: "ООО ЛогистПлюс",
        contract_number: "СК-2023/045",
        contract_start: "2023-03-01",
        contract_end: "2025-02-28",
        condition_start: "2023-03-01",
        condition_end: "2025-02-28",
        term_desc: "2 г.",
        area_actual: 200.0,
        area_calculated: 200.0,
        coefficient: 1.0,
        bap_rate: 12000,
        opex_rate: 1500,
        map_monthly: 200000,
        total_rate: 13500,
        type: "warehouse",
        status: "active"
    },
    {
        id: 7,
        tenant: "ИП Петров В.Г.",
        contract_number: "СК-2023/050",
        contract_start: "2023-04-01",
        contract_end: "2024-03-31",
        condition_start: "2023-04-01",
        condition_end: "2024-03-31",
        term_desc: "11 мес.",
        area_actual: 50.0,
        area_calculated: 50.0,
        coefficient: 1.0,
        bap_rate: 14000,
        opex_rate: 1500,
        map_monthly: 58333,
        total_rate: 15500,
        type: "warehouse",
        status: "active"
    },
    {
        id: 8,
        tenant: "ООО РитейлГрупп",
        contract_number: "СК-2022/112",
        contract_start: "2022-12-01",
        contract_end: "2023-11-30",
        condition_start: "2022-12-01",
        condition_end: "2023-11-30",
        term_desc: "11 мес.",
        area_actual: 150.0,
        area_calculated: 150.0,
        coefficient: 1.0,
        bap_rate: 13000,
        opex_rate: 1500,
        map_monthly: 162500,
        total_rate: 14500,
        type: "warehouse",
        status: "active"
    },
    {
        id: 9,
        tenant: "ЗАО ФинКонсалт",
        contract_number: "СК-Архив",
        contract_start: "2022-11-01",
        contract_end: "2027-10-31",
        condition_start: "2022-11-01",
        condition_end: "2027-10-31",
        term_desc: "5 л.",
        area_actual: 20.0,
        area_calculated: 20.0,
        coefficient: 1.0,
        bap_rate: 10000,
        opex_rate: 1000,
        map_monthly: 16667,
        total_rate: 11000,
        type: "warehouse",
        status: "active"
    },

    // --- SIGNS/ADVERTISING ---
    {
        id: 10,
        tenant: "ООО ТехноСофт",
        contract_number: "РЕК-2023/001",
        contract_start: "2023-01-15",
        contract_end: "2026-01-14",
        condition_start: "2023-01-15",
        condition_end: "2026-01-14",
        term_desc: "3 г.",
        area_actual: 0,
        area_calculated: 0,
        coefficient: 1.0,
        bap_rate: 60000, // Fixed price per year
        opex_rate: 0,
        map_monthly: 5000,
        total_rate: 60000,
        type: "advertising",
        status: "active"
    },
    {
        id: 11,
        tenant: "ЗАО ФинКонсалт",
        contract_number: "РЕК-2022/089",
        contract_start: "2022-11-01",
        contract_end: "2027-10-31",
        condition_start: "2022-11-01",
        condition_end: "2027-10-31",
        term_desc: "5 л.",
        area_actual: 0,
        area_calculated: 0,
        coefficient: 1.0,
        bap_rate: 120000,
        opex_rate: 0,
        map_monthly: 10000,
        total_rate: 120000,
        type: "advertising",
        status: "active"
    }
];

// Make it globally available
window.RENT_ROLL_DATA = RENT_ROLL_DATA;
