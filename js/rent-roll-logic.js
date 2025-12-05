document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('rent-roll-app')) return;

    // Ensure ApexCharts is loaded
    if (typeof ApexCharts === 'undefined') {
        console.error('ApexCharts is not loaded');
        return;
    }

    const app = new RentRollApp(window.RENT_ROLL_DATA);
    app.init();
});

class RentRollApp {
    constructor(data) {
        this.data = data || [];
        this.state = {
            activeTab: 'office', // office, parking, warehouse, advertising
            isVATIncluded: true,
            searchQuery: '',
            sortBy: 'tenant',
            sortDir: 'asc'
        };
        this.container = document.getElementById('rent-roll-app');
        this.charts = {}; // Store chart instances to destroy them before re-rendering
    }

    init() {
        this.renderLayout();
        this.updateView();
    }

    // --- RENDERING ---

    renderLayout() {
        this.container.innerHTML = `
            <!-- Top Metrics -->
            <div id="rr-global-metrics" class="metrics-grid"></div>

            <!-- VAT Toggle -->
            <div class="rr-controls-row">
                <div class="rr-vat-toggle-wrapper">
                    <label class="rr-vat-toggle">
                        <input type="checkbox" id="vat-toggle" ${this.state.isVATIncluded ? 'checked' : ''}>
                        <span class="slider round"></span>
                    </label>
                    <span class="rr-vat-label">Цены с НДС</span>
                </div>
            </div>

            <!-- Tabs -->
            <div class="rr-tabs-container">
                <div class="rr-tabs">
                    <button class="rr-tab-btn ${this.state.activeTab === 'office' ? 'active' : ''}" data-tab="office">Офисы</button>
                    <button class="rr-tab-btn ${this.state.activeTab === 'parking' ? 'active' : ''}" data-tab="parking">Машино-места</button>
                    <button class="rr-tab-btn ${this.state.activeTab === 'warehouse' ? 'active' : ''}" data-tab="warehouse">Склады</button>
                    <button class="rr-tab-btn ${this.state.activeTab === 'advertising' ? 'active' : ''}" data-tab="advertising">Реклама</button>
                </div>
            </div>

            <!-- Tab Content -->
            <div id="rr-tab-content" class="rr-tab-content">
                <!-- Metrics for specific type -->
                <div id="rr-local-metrics" class="rr-local-metrics-grid"></div>

                <!-- Charts Row -->
                <div class="rr-charts-grid">
                    <div class="rr-chart-card">
                        <h3>Распределение ставок</h3>
                        <div id="chart-rates"></div>
                    </div>
                    <div class="rr-chart-card">
                        <h3>Сроки договоров</h3>
                        <div id="chart-expiry"></div>
                    </div>
                    <div class="rr-chart-card">
                        <h3>Топ арендаторов</h3>
                        <div id="chart-top-tenants"></div>
                    </div>
                </div>

                <!-- Table Controls -->
                <div class="rr-table-controls">
                    <div class="rr-search-wrapper">
                        <i data-lucide="search"></i>
                        <input type="text" id="rr-search-input" placeholder="Поиск по арендатору или договору..." value="${this.state.searchQuery}">
                    </div>
                </div>

                <!-- Table -->
                <div class="rr-table-container">
                    <div style="overflow-x: auto;">
                        <table class="rr-table">
                            <thead>
                                <tr>
                                    <th data-sort="tenant">Арендатор</th>
                                    <th data-sort="contract_number">Договор</th>
                                    <th data-sort="contract_start">Начало договора</th>
                                    <th data-sort="contract_end">Окончание договора</th>
                                    <th data-sort="condition_start">Начало условий</th>
                                    <th data-sort="condition_end">Окончание условий</th>
                                    <th data-sort="term_desc">Срок договора</th>
                                    <th data-sort="area_actual">Площадь факт.</th>
                                    <th data-sort="area_calculated">Площадь расч.</th>
                                    <th data-sort="coefficient">Коэффициент</th>
                                    <th data-sort="bap_rate">БАП р/м²/год</th>
                                    <th data-sort="opex_rate">ЭП р/м²/год</th>
                                    <th data-sort="map_monthly">МАП р/мес</th>
                                    <th data-sort="total_rate">Ставка р/м²/год</th>
                                </tr>
                            </thead>
                            <tbody id="rr-table-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this.attachGlobalListeners();
    }

    attachGlobalListeners() {
        // Tabs
        this.container.querySelectorAll('.rr-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.state.activeTab = e.target.getAttribute('data-tab');
                this.updateView();
            });
        });

        // VAT Toggle
        const vatToggle = document.getElementById('vat-toggle');
        if (vatToggle) {
            vatToggle.addEventListener('change', (e) => {
                this.state.isVATIncluded = e.target.checked;
                this.updateView();
            });
        }

        // Search
        const searchInput = document.getElementById('rr-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.state.searchQuery = e.target.value.toLowerCase();
                this.renderTable(); // Only re-render table
            });
        }
    }

    updateView() {
        // Update Tab Active Classes
        this.container.querySelectorAll('.rr-tab-btn').forEach(btn => {
            if (btn.getAttribute('data-tab') === this.state.activeTab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        this.renderGlobalMetrics();
        this.renderLocalMetrics();
        this.renderCharts();
        this.renderTable();
        
        // Re-init icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // --- CALCULATIONS ---

    getFilteredData() {
        return this.data.filter(item => item.type === this.state.activeTab);
    }

    getSearchFilteredData() {
        const typeData = this.getFilteredData();
        if (!this.state.searchQuery) return typeData;
        return typeData.filter(item => 
            item.tenant.toLowerCase().includes(this.state.searchQuery) || 
            item.contract_number.toLowerCase().includes(this.state.searchQuery)
        );
    }

    formatMoney(amount) {
        const val = this.state.isVATIncluded ? amount * 1.2 : amount;
        return val.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
    }
    
    formatRate(amount) {
         const val = this.state.isVATIncluded ? amount * 1.2 : amount;
         return val.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    formatArea(area) {
        return area.toLocaleString('ru-RU') + ' м²';
    }

    // --- RENDERERS ---

    renderGlobalMetrics() {
        // Calculate totals across ALL data (or specific logic from PRD)
        const activeContracts = this.data.filter(d => d.status === 'active');
        const tenants = new Set(activeContracts.map(d => d.tenant)).size;
        
        // Sum area for parking
        const parkingCount = activeContracts.filter(d => d.type === 'parking').length; 
        
        const totalAreaActual = activeContracts.filter(d => d.type !== 'parking' && d.type !== 'advertising').reduce((sum, d) => sum + d.area_actual, 0);
        const totalAreaCalc = activeContracts.filter(d => d.type !== 'parking' && d.type !== 'advertising').reduce((sum, d) => sum + d.area_calculated, 0);
        
        const totalMAP = activeContracts.reduce((sum, d) => sum + (d.map_monthly || 0), 0);

        const metrics = [
            { name: 'Кол-во договоров', value: activeContracts.length, icon: 'file-text', class: 'metric-optimization' },
            { name: 'Кол-во арендаторов', value: tenants, icon: 'users', class: 'metric-planning' },
            { name: 'Кол-во парковок', value: parkingCount, icon: 'square-parking', class: 'metric-control' },
            { name: 'Фактическая площадь', value: Math.round(totalAreaActual).toLocaleString() + ' м²', icon: 'box-select', class: 'metric-planning' },
            { name: 'Расчетная площадь', value: Math.round(totalAreaCalc).toLocaleString() + ' м²', icon: 'box-select', class: 'metric-planning' },
            { name: 'МАП (общий)', value: this.formatMoney(totalMAP), icon: 'banknote', class: 'metric-control' }
        ];

        const html = metrics.map(m => `
            <div class="metric-card ${m.class}">
                <div class="metric-icon-circle">
                    <i data-lucide="${m.icon}"></i>
                </div>
                <div class="metric-text-content">
                    <div class="metric-name">${m.name}</div>
                    <div class="metric-value">${m.value}</div>
                </div>
            </div>
        `).join('');

        document.getElementById('rr-global-metrics').innerHTML = html;
    }

    renderLocalMetrics() {
        const data = this.getFilteredData();
        const activeContracts = data.length;
        const tenants = new Set(data.map(d => d.tenant)).size;
        const map = data.reduce((sum, d) => sum + (d.map_monthly || 0), 0);

        const html = `
            <div class="rr-local-metric">
                <span class="label">Активные договоры</span>
                <span class="value">${activeContracts}</span>
            </div>
            <div class="rr-local-metric">
                <span class="label">Кол-во арендаторов</span>
                <span class="value">${tenants}</span>
            </div>
            <div class="rr-local-metric">
                <span class="label">МАП в текущем месяце</span>
                <span class="value">${this.formatMoney(map)}</span>
            </div>
        `;

        document.getElementById('rr-local-metrics').innerHTML = html;
    }

    renderCharts() {
        const data = this.getFilteredData();

        // 1. Rates Distribution (BAP)
        // Bins: <15k, 15-20k, 20-25k, >25k
        const bins = { '<15k': 0, '15k-20k': 0, '20k-25k': 0, '>25k': 0 };
        data.forEach(d => {
            const val = d.bap_rate || 0;
            if (val < 15000) bins['<15k']++;
            else if (val < 20000) bins['15k-20k']++;
            else if (val < 25000) bins['20k-25k']++;
            else bins['>25k']++;
        });

        this.renderChart('chart-rates', {
            chart: { type: 'bar', height: 250, toolbar: { show: false } },
            series: [{ name: 'Договоров', data: Object.values(bins) }],
            xaxis: { categories: Object.keys(bins) },
            colors: ['#8B5CF6'],
            plotOptions: { bar: { borderRadius: 4 } }
        });

        // 2. Expiry (Pie)
        // Short (<1y), Medium (1-3y), Long (>3y)
        const now = new Date();
        const expiryCounts = { 'Краткосрок (<1г)': 0, 'Среднесрок (1-3г)': 0, 'Долгосрок (>3г)': 0 };
        
        data.forEach(d => {
            const end = new Date(d.contract_end);
            const diffYears = (end - now) / (1000 * 60 * 60 * 24 * 365);
            if (diffYears < 1) expiryCounts['Краткосрок (<1г)']++;
            else if (diffYears < 3) expiryCounts['Среднесрок (1-3г)']++;
            else expiryCounts['Долгосрок (>3г)']++;
        });

        this.renderChart('chart-expiry', {
            chart: { type: 'donut', height: 250 },
            series: Object.values(expiryCounts),
            labels: Object.keys(expiryCounts),
            colors: ['#EF4444', '#F59E0B', '#10B981'],
            legend: { position: 'bottom' }
        });

        // 3. Top Tenants (Bar Horizontal)
        const tenantAreas = {};
        data.forEach(d => {
            tenantAreas[d.tenant] = (tenantAreas[d.tenant] || 0) + d.area_actual;
        });
        const sortedTenants = Object.entries(tenantAreas).sort((a, b) => b[1] - a[1]).slice(0, 5);

        this.renderChart('chart-top-tenants', {
            chart: { type: 'bar', height: 250, toolbar: { show: false } },
            series: [{ name: 'Площадь', data: sortedTenants.map(i => i[1]) }],
            xaxis: { categories: sortedTenants.map(i => i[0]) },
            plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
            colors: ['#8B5CF6']
        });
    }

    renderChart(elementId, options) {
        if (this.charts[elementId]) {
            this.charts[elementId].destroy();
        }
        const chart = new ApexCharts(document.getElementById(elementId), options);
        chart.render();
        this.charts[elementId] = chart;
    }

    renderTable() {
        const data = this.getSearchFilteredData();
        const tbody = document.getElementById('rr-table-body');
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="14" style="text-align:center; padding: 20px;">Нет данных</td></tr>';
            return;
        }

        const html = data.map(d => `
            <tr>
                <td class="fw-medium" style="white-space:nowrap;">${d.tenant}</td>
                <td style="white-space:nowrap;">${d.contract_number}</td>
                <td style="white-space:nowrap;">${d.contract_start}</td>
                <td style="white-space:nowrap;">${d.contract_end}</td>
                <td style="white-space:nowrap;">${d.condition_start}</td>
                <td style="white-space:nowrap;">${d.condition_end}</td>
                <td>${d.term_desc}</td>
                <td>${this.formatArea(d.area_actual).replace(' м²', '')} м²</td>
                <td>${this.formatArea(d.area_calculated).replace(' м²', '')} м²</td>
                <td>${d.coefficient}</td>
                <td>${this.formatRate(d.bap_rate)}</td>
                <td>${this.formatRate(d.opex_rate)}</td>
                <td>${this.formatMoney(d.map_monthly)}</td>
                <td>${this.formatRate(d.total_rate)} р/м²</td>
            </tr>
        `).join('');

        tbody.innerHTML = html;
    }
}
