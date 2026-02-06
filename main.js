// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('LCCWF Website loaded');
    
    // Set current year in footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Add loading animation to stats
    const stats = document.querySelectorAll('.stat h3');
    if (stats.length > 0) {
        stats.forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            let currentValue = 0;
            const increment = finalValue / 50;
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    stat.textContent = finalValue + (stat.textContent.includes('+') ? '+' : '');
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(currentValue);
                }
            }, 30);
        });
    }
    
    // Newsletter Signup
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            // Simple validation
            if (email && email.includes('@')) {
                // Here you would connect to Mailchimp, etc.
                alert('Thank you for subscribing to our newsletter!');
                newsletterForm.reset();
            }
        });
    }
});
// About Page Specific Functions
function initAboutPage() {
    // Map point interactions
    const mapPoints = document.querySelectorAll('.map-point');
    mapPoints.forEach(point => {
        point.addEventListener('click', function() {
            const region = this.getAttribute('data-region');
            alert(`LCCWF operates in the ${region}. Learn more about our work in this region on our Programs page.`);
        });
    });
    
    // Team member hover effects
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // SDG detail card animations
    const sdgCards = document.querySelectorAll('.sdg-detail-card');
    sdgCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s, transform 0.5s';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Download button tracking
    const downloadBtn = document.querySelector('a[href*="annual-report"]');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Track download in analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download', {
                    'event_category': 'Annual Report',
                    'event_label': '2023 Report'
                });
            }
        });
    }
}

// Initialize when page loads
if (document.querySelector('.about-cta')) {
    document.addEventListener('DOMContentLoaded', initAboutPage);
}