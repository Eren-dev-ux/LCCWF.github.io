// Programs Page Specific JavaScript

function initProgramsPage() {
    // Animate statistics counters
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target;
                }
            };
            
            // Start counter when element is in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }
    
    // Program component hover effects
    const components = document.querySelectorAll('.component');
    components.forEach(component => {
        component.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = 'var(--shadow-md)';
        });
        
        component.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });
    
    // Smooth scroll for program navigation
    const programLinks = document.querySelectorAll('.nav-links a, a[href^="#"]');
    programLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without refreshing
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
    
    // Program category filter (for future enhancement)
    const programCategories = {
        'child-protection': document.querySelector('#child-protection'),
        'community-health': document.querySelector('#community-health'),
        'education-youth': document.querySelector('#education-youth'),
        'community-empowerment': document.querySelector('#community-empowerment'),
        'substance-prevention': document.querySelector('#substance-prevention')
    };
    
    // Highlight current program when scrolling
    function highlightCurrentProgram() {
        const sections = document.querySelectorAll('.program-section, .initiatives-section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = '#' + section.id;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
                link.style.backgroundColor = 'var(--primary-blue)';
                link.style.color = 'var(--white)';
            } else {
                link.style.backgroundColor = '';
                link.style.color = '';
            }
        });
    }
    
    // Initialize
    animateCounters();
    window.addEventListener('scroll', highlightCurrentProgram);
    highlightCurrentProgram(); // Initial call
    
    // Print program information
    const printButtons = document.querySelectorAll('.print-program');
    if (printButtons.length > 0) {
        printButtons.forEach(button => {
            button.addEventListener('click', function() {
                const programTitle = this.closest('.program-section').querySelector('h2').textContent;
                window.print();
                
                // Track print event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'print', {
                        'event_category': 'Program',
                        'event_label': programTitle
                    });
                }
            });
        });
    }
    
    // Share program functionality
    const shareButtons = document.querySelectorAll('.share-program');
    if (shareButtons.length > 0) {
        shareButtons.forEach(button => {
            button.addEventListener('click', function() {
                const programTitle = this.closest('.program-section').querySelector('h2').textContent;
                const programUrl = window.location.href;
                
                if (navigator.share) {
                    navigator.share({
                        title: programTitle + ' - LCCWF',
                        text: 'Check out this program from Lighthouse Children and Community Wellness Foundation',
                        url: programUrl
                    });
                } else {
                    // Fallback: Copy to clipboard
                    navigator.clipboard.writeText(programUrl).then(() => {
                        alert('Program link copied to clipboard!');
                    });
                }
            });
        });
    }
}

// Initialize programs page
if (document.querySelector('.program-cta')) {
    document.addEventListener('DOMContentLoaded', initProgramsPage);
}