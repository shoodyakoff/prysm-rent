document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Click handler for Metrics Cards
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('click', () => {
            const metricName = card.getAttribute('data-metric');
            console.log(`Clicked metric: ${metricName}`);
        });
    });

    // 3. Click handler for Active Report Cards
    const activeReportCards = document.querySelectorAll('.report-card.active');
    activeReportCards.forEach(card => {
        card.addEventListener('click', () => {
            const reportName = card.getAttribute('data-report');
            console.log(`Clicked report: ${reportName}`);
        });
    });

    // 4. Highlight Active Menu Item (Already set in HTML, but ensuring logic exists if needed)
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            menuItems.forEach(i => i.classList.remove('active'));
            // Add to clicked
            item.classList.add('active');
            
            // Update icons color logic if needed (handled by CSS active class)
            // Re-render icons might be needed if using replaceWith, but Lucide <i data-lucide> approach 
            // usually replaces on load. If we change DOM, we might need to re-run createIcons or handle SVGs.
            // Since we just toggle class and CSS handles color fill/stroke, it should be fine for SVG styles 
            // IF the SVG inherits color.
            // Lucide SVGs usually use 'currentColor' for stroke. 
            // Let's check CSS: .menu-item.active i { color: #8B5CF6; }
            // This updates the parent color. If SVG uses currentColor, it updates.
        });
    });

    // Default Active State Enforcement (optional, strictly per TZ)
    const reportsMenuItem = document.getElementById('menu-reports');
    if (reportsMenuItem && !reportsMenuItem.classList.contains('active')) {
        reportsMenuItem.classList.add('active');
    }
});
