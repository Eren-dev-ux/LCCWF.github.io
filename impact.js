// Impact Page Specific JavaScript

function initImpactPage() {
    // Animate impact statistics
    function animateImpactStats() {
        const counters = document.querySelectorAll('.impact-stat .stat-number');
        
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
    
    // Story filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const storyCards = document.querySelectorAll('.story-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter stories
            storyCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Story modal functionality
    const storyModal = document.getElementById('storyModal');
    const closeModal = document.querySelector('.close-modal');
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    const modalContent = document.getElementById('modalStoryContent');
    
    // Story data (in production, this would come from a database)
    const stories = {
        1: {
            title: "Sarah's Journey to Safety",
            category: "Child Protection",
            image: "images/impact/story-1.jpg",
            location: "Central Region",
            year: "2023",
            fullStory: `
                <div class="modal-story">
                    <div class="story-header">
                        <h2>Sarah's Journey to Safety</h2>
                        <div class="story-meta">
                            <span><i class="fas fa-map-marker-alt"></i> Central Region</span>
                            <span><i class="fas fa-calendar"></i> 2023</span>
                            <span class="story-category-tag">Child Protection</span>
                        </div>
                    </div>
                    
                    <div class="story-image-full">
                        <img src="images/impact/story-1.jpg" alt="Sarah's Story">
                    </div>
                    
                    <div class="story-content-full">
                        <p>After losing both parents in a tragic accident, 10-year-old Sarah was left in the care of elderly grandparents who struggled to make ends meet. She was at risk of dropping out of school and facing exploitation in her community.</p>
                        
                        <p>Through our child protection program, Sarah received comprehensive support:</p>
                        
                        <ul>
                            <li><strong>Educational Support:</strong> School fees, uniforms, and learning materials provided</li>
                            <li><strong>Psychosocial Care:</strong> Regular counseling sessions to help process grief</li>
                            <li><strong>Nutrition Support:</strong> Daily school meals to ensure proper nutrition</li>
                            <li><strong>Safe Environment:</strong> Placement in our after-school care program</li>
                        </ul>
                        
                        <p>Today, Sarah is thriving in school with above-average grades. She participates in our life skills program and has become a peer mentor for other vulnerable children in her community.</p>
                        
                        <blockquote>
                            "I want to be a teacher when I grow up, so I can help other children who have lost their parents like me."
                            <cite>- Sarah, Age 10</cite>
                        </blockquote>
                        
                        <div class="story-outcome">
                            <h3><i class="fas fa-check-circle"></i> Outcome</h3>
                            <p>Sarah has maintained perfect school attendance for 18 months and is now ranked 3rd in her class of 45 students.</p>
                        </div>
                    </div>
                </div>
            `
        },
        2: {
            title: "From Dropout to Class President",
            category: "Education",
            image: "images/impact/story-2.jpg",
            location: "Eastern Region",
            year: "2023",
            fullStory: `
                <div class="modal-story">
                    <div class="story-header">
                        <h2>From Dropout to Class President</h2>
                        <div class="story-meta">
                            <span><i class="fas fa-map-marker-alt"></i> Eastern Region</span>
                            <span><i class="fas fa-calendar"></i> 2023</span>
                            <span class="story-category-tag">Education</span>
                        </div>
                    </div>
                    
                    <div class="story-image-full">
                        <img src="images/impact/story-2.jpg" alt="James' Story">
                    </div>
                    
                    <div class="story-content-full">
                        <p>James was on the verge of dropping out of school in 8th grade due to financial difficulties at home. His single mother, a street vendor, could no longer afford school fees and basic necessities.</p>
                        
                        <p>Our educational support program intervened with:</p>
                        
                        <ul>
                            <li><strong>Full Scholarship:</strong> Covered all school fees and examination costs</li>
                            <li><strong>Learning Materials:</strong> Textbooks, notebooks, and school supplies provided</li>
                            <li><strong>Mentorship:</strong> Assigned a volunteer mentor for academic guidance</li>
                            <li><strong>Family Support:</strong> Connected mother to our women's empowerment program</li>
                        </ul>
                        
                        <p>With the burden of school fees lifted, James focused on his studies. His grades improved dramatically, and he discovered leadership abilities he never knew he had.</p>
                        
                        <p>In his final year, James was elected class president by his peers and teachers. He organized study groups for struggling students and represented his school in regional academic competitions.</p>
                        
                        <blockquote>
                            "LCCWF didn't just keep me in school—they showed me I could lead. Today, I'm studying to become a doctor."
                            <cite>- James, Age 17</cite>
                        </blockquote>
                        
                        <div class="story-outcome">
                            <h3><i class="fas fa-check-circle"></i> Outcome</h3>
                            <p>James graduated top of his class with honors and received a full scholarship to study medicine at the national university.</p>
                        </div>
                    </div>
                </div>
            `
        }
        // Add more stories as needed
    };
    
    // Open story modal
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const storyId = this.getAttribute('data-story');
            const story = stories[storyId];
            
            if (story) {
                modalContent.innerHTML = story.fullStory;
                storyModal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            storyModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === storyModal) {
            storyModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Testimonial slider
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
        
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
    }
    
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            showSlide(slideIndex);
        });
    });
    
    // Auto-rotate testimonials
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
    
    // Photo gallery modal
    const galleryModal = document.getElementById('galleryModal');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modalImage = document.getElementById('modalImage');
    const imageCaption = document.getElementById('imageCaption');
    const closeGallery = document.querySelector('.close-gallery');
    const prevGallery = document.querySelector('.prev-gallery');
    const nextGallery = document.querySelector('.next-gallery');
    let currentImageIndex = 0;
    const galleryImages = Array.from(galleryItems);
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            currentImageIndex = index;
            openGallery(img.src, img.alt);
        });
    });
    
    function openGallery(src, alt) {
        modalImage.src = src;
        modalImage.alt = alt;
        imageCaption.textContent = galleryImages[currentImageIndex].getAttribute('data-caption');
        galleryModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function navigateGallery(direction) {
        currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
        const img = galleryImages[currentImageIndex].querySelector('img');
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        imageCaption.textContent = galleryImages[currentImageIndex].getAttribute('data-caption');
    }
    
    if (prevGallery && nextGallery) {
        prevGallery.addEventListener('click', () => navigateGallery(-1));
        nextGallery.addEventListener('click', () => navigateGallery(1));
    }
    
    if (closeGallery) {
        closeGallery.addEventListener('click', () => {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Load more stories
    const loadMoreBtn = document.getElementById('loadMoreStories');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // In production, this would load more stories from an API
            // For now, we'll simulate loading
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                alert('More stories would be loaded from the server in a production environment.');
                this.textContent = 'Load More Stories';
                this.disabled = false;
            }, 1000);
        });
    }
    
    // Initialize
    animateImpactStats();
    
    // Share impact stories
    const shareButtons = document.createElement('div');
    shareButtons.className = 'share-buttons';
    shareButtons.innerHTML = `
        <button class="share-btn" data-platform="facebook"><i class="fab fa-facebook-f"></i></button>
        <button class="share-btn" data-platform="twitter"><i class="fab fa-twitter"></i></button>
        <button class="share-btn" data-platform="linkedin"><i class="fab fa-linkedin-in"></i></button>
    `;
    
    // Add share buttons to each story card
    storyCards.forEach(card => {
        const shareContainer = card.querySelector('.story-content');
        const clone = shareButtons.cloneNode(true);
        clone.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const platform = this.getAttribute('data-platform');
                const storyTitle = card.querySelector('h3').textContent;
                const storyUrl = window.location.href + '?story=' + card.getAttribute('data-category');
                shareContent(platform, storyTitle, storyUrl);
            });
        });
        shareContainer.appendChild(clone);
    });
    
    function shareContent(platform, title, url) {
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
        };
        
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    }
}

// Initialize impact page
if (document.querySelector('.impact-header')) {
    document.addEventListener('DOMContentLoaded', initImpactPage);
}
// Responsive enhancements for Impact page
function initResponsiveFeatures() {
    // Check if mobile
    const isMobile = window.innerWidth <= 768;
    
    // Adjust story card layout for mobile
    if (isMobile) {
        // Make story cards full width on mobile
        const storyCards = document.querySelectorAll('.story-card');
        storyCards.forEach(card => {
            card.style.marginBottom = '20px';
        });
        
        // Adjust filter buttons for touch
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.style.padding = '12px 20px';
            btn.style.margin = '5px';
        });
    }
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newIsMobile = window.innerWidth <= 768;
            if (isMobile !== newIsMobile) {
                location.reload(); // Reload for major layout changes
            }
        }, 250);
    });
    
    // Touch swipe for testimonial slider on mobile
    if ('ontouchstart' in window) {
        const testimonialSlider = document.querySelector('.testimonials-slider');
        let touchStartX = 0;
        let touchEndX = 0;
        
        testimonialSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        testimonialSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    // Swipe right - previous
                    showSlide(currentSlide - 1);
                } else {
                    // Swipe left - next
                    showSlide(currentSlide + 1);
                }
            }
        }
    }
    
    // Adjust modal for mobile
    function adjustModalForMobile() {
        const modalContent = document.querySelector('.story-modal .modal-content');
        if (window.innerWidth <= 768 && modalContent) {
            modalContent.style.maxHeight = '80vh';
            modalContent.style.overflowY = 'auto';
            modalContent.style.WebkitOverflowScrolling = 'touch';
        }
    }
    
    // Call on window resize
    window.addEventListener('resize', adjustModalForMobile);
    adjustModalForMobile(); // Initial call
    
    // Optimize images for mobile
    function optimizeImagesForMobile() {
        const images = document.querySelectorAll('img');
        const isRetina = window.devicePixelRatio > 1;
        
        images.forEach(img => {
            const src = img.src;
            
            // Skip if already optimized
            if (src.includes('mobile-')) return;
            
            // For mobile, we could load smaller images
            if (window.innerWidth <= 768) {
                // In a real implementation, you would have different image sizes
                // This is where you'd implement srcset or switch image sources
                img.loading = 'lazy';
                
                // Add blur-up effect for better UX
                if (!img.complete) {
                    img.style.filter = 'blur(10px)';
                    img.style.transition = 'filter 0.3s';
                    img.onload = function() {
                        this.style.filter = 'blur(0)';
                    };
                }
            }
        });
    }
    
    // Initialize image optimization
    optimizeImagesForMobile();
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            optimizeImagesForMobile();
            adjustModalForMobile();
        }, 100);
    });
}

// Add to DOMContentLoaded
if (document.querySelector('.impact-header')) {
    document.addEventListener('DOMContentLoaded', () => {
        initResponsiveFeatures();
    });
}