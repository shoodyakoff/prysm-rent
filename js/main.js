document.addEventListener('DOMContentLoaded', async () => {
    // Function to load external HTML components
    async function loadComponent(id, path) {
        const el = document.getElementById(id);
        if (el) {
            try {
                const res = await fetch(path);
                if (res.ok) {
                    el.innerHTML = await res.text();
                } else {
                    console.error(`Failed to load component: ${path}`);
                }
            } catch (e) {
                console.error(`Error loading ${path}:`, e);
            }
        }
    }

    // Get path prefix from body data attribute (default to empty)
    const pathPrefix = document.body.getAttribute('data-path-prefix') || '';

    // Load Header and Sidebar
    await Promise.all([
        loadComponent('header-placeholder', `${pathPrefix}components/header.html`),
        loadComponent('sidebar-placeholder', `${pathPrefix}components/sidebar.html`)
    ]);

    // Fix sidebar links
    const sidebar = document.getElementById('sidebar-placeholder');
    if (sidebar && pathPrefix) {
        const links = sidebar.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('/')) {
                 link.setAttribute('href', pathPrefix + href);
            }
        });
    }

    // 1. Initialize Lucide Icons (AFTER components are loaded)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Highlight Active Menu Item based on body data attribute
    const activeMenuId = document.body.getAttribute('data-active-menu');
    if (activeMenuId) {
        const activeItem = document.getElementById(activeMenuId);
        // Remove 'active' from all first (if any default was set in HTML)
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    // 3. Click handler for Metrics Cards
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('click', () => {
            const metricName = card.getAttribute('data-metric');
            console.log(`Clicked metric: ${metricName}`);
        });
    });

    // 4. Click handler for Active Report Cards
    const activeReportCards = document.querySelectorAll('.report-card.active');
    activeReportCards.forEach(card => {
        card.addEventListener('click', () => {
            const reportName = card.getAttribute('data-report');
            console.log(`Clicked report: ${reportName}`);

            if (reportName === 'Rent Roll') {
                window.location.href = 'rent-roll.html';
            }
        });
    });

    // 5. Sidebar Menu Click Handlers (for visual toggle only)
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
});
