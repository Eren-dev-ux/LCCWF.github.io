// Get Involved Page JavaScript

function initInvolvementPage() {
    // Donation Form Functionality
    const donationForm = document.getElementById('donationForm');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const amountOptions = document.querySelectorAll('input[name="amount"]');
    const customAmountInput = document.getElementById('customAmount');
    const paymentOptions = document.querySelectorAll('.payment-option');
    const submitDonationBtn = document.getElementById('submitDonation');
    
    // Tab switching for one-time/monthly donation
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update form for donation type
            const donationType = this.getAttribute('data-tab');
            updateDonationType(donationType);
        });
    });
    
    function updateDonationType(type) {
        // Update any form elements based on donation type
        const frequencyLabel = document.querySelector('#step-amount h4');
        const submitButton = document.querySelector('#submitDonation');
        
        if (type === 'monthly') {
            frequencyLabel.textContent = 'Select Monthly Donation Amount';
            submitButton.innerHTML = '<i class="fas fa-lock"></i> Start Monthly Donation';
            // Update impact descriptions for monthly donations
            updateImpactDescriptions(true);
        } else {
            frequencyLabel.textContent = 'Select Donation Amount';
            submitButton.innerHTML = '<i class="fas fa-lock"></i> Complete Donation';
            updateImpactDescriptions(false);
        }
    }
    
    function updateImpactDescriptions(isMonthly) {
        const impactItems = document.querySelectorAll('.impact-description');
        if (isMonthly) {
            impactItems[0].textContent = 'Provides school supplies for 1 child every month';
            impactItems[1].textContent = 'Monthly health kit for a family';
            impactItems[2].textContent = 'Supports ongoing psychosocial counseling for children';
            impactItems[3].textContent = 'Funds regular community health campaigns';
        } else {
            impactItems[0].textContent = 'Provides school supplies for 1 child for a year';
            impactItems[1].textContent = 'Health kit for a family including medicines and hygiene items';
            impactItems[2].textContent = 'Supports 1 month of psychosocial counseling for 5 children';
            impactItems[3].textContent = 'Funds a community health awareness campaign reaching 200 people';
        }
    }
    
    // Amount selection
    amountOptions.forEach(option => {
        option.addEventListener('change', function() {
            customAmountInput.value = '';
        });
    });
    
    customAmountInput.addEventListener('input', function() {
        amountOptions.forEach(option => option.checked = false);
    });
    
    // Form step navigation
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const nextStepId = this.getAttribute('data-next');
            const nextStep = document.getElementById(nextStepId);
            
            // Validate current step before proceeding
            if (validateStep(currentStep)) {
                currentStep.classList.remove('active');
                nextStep.classList.add('active');
                updateProgressBar(nextStepId);
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const prevStepId = this.getAttribute('data-prev');
            const prevStep = document.getElementById(prevStepId);
            
            currentStep.classList.remove('active');
            prevStep.classList.add('active');
            updateProgressBar(prevStepId);
        });
    });
    
    function validateStep(step) {
        const inputs = step.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#e74c3c';
                input.focus();
                
                // Remove error styling on input
                input.addEventListener('input', function() {
                    this.style.borderColor = '';
                }, { once: true });
            }
        });
        
        if (!isValid) {
            showMessage('Please fill in all required fields', 'error');
        }
        
        return isValid;
    }
    
    // Payment method selection
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            
            // Update active payment option
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            document.querySelectorAll('.payment-form').forEach(form => {
                form.style.display = 'none';
            });
            
            if (method === 'paypal') {
                // For PayPal, we would redirect to PayPal
                // For now, show bank details as fallback
                document.getElementById('bankForm').style.display = 'block';
            } else if (method === 'bank') {
                document.getElementById('bankForm').style.display = 'block';
            } else {
                document.getElementById('cardForm').style.display = 'block';
            }
        });
    });
    
    // Credit card input formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            let value = this.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let matches = value.match(/\d{4,16}/g);
            let match = matches && matches[0] || '';
            let parts = [];
            
            for (let i = 0, len = match.length; i < len; i += 4) {
                parts.push(match.substring(i, i + 4));
            }
            
            if (parts.length) {
                this.value = parts.join(' ');
            } else {
                this.value = value;
            }
        });
    }
    
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                this.value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
        });
    }
    
    // Donation form submission
    if (donationForm) {
        donationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            submitDonationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitDonationBtn.disabled = true;
            
            // Get form data
            const formData = {
                type: document.querySelector('.tab-btn.active').getAttribute('data-tab'),
                amount: getSelectedAmount(),
                designation: document.getElementById('donationDesignation').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                paymentMethod: document.querySelector('.payment-option.active').getAttribute('data-method'),
                timestamp: new Date().toISOString()
            };
            
            // Simulate API call (in production, this would connect to payment processor)
            setTimeout(() => {
                // Show success modal
                const successModal = document.getElementById('donationSuccessModal');
                successModal.style.display = 'flex';
                
                // Reset form
                donationForm.reset();
                
                // Reset to first step
                formSteps.forEach(step => step.classList.remove('active'));
                document.getElementById('step-amount').classList.add('active');
                updateProgressBar('step-amount');
                
                // Reset button
                submitDonationBtn.innerHTML = '<i class="fas fa-lock"></i> Complete Donation';
                submitDonationBtn.disabled = false;
                
                // Track donation in analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'donation', {
                        'value': formData.amount,
                        'currency': 'USD',
                        'transaction_id': 'DON_' + Date.now()
                    });
                }
                
                // Send confirmation email (simulated)
                sendDonationConfirmation(formData);
            }, 2000);
        });
    }
    
    function getSelectedAmount() {
        const selectedAmount = document.querySelector('input[name="amount"]:checked');
        if (selectedAmount) {
            return selectedAmount.value;
        } else if (customAmountInput.value) {
            return customAmountInput.value;
        }
        return 0;
    }
    
    function sendDonationConfirmation(data) {
        // In production, this would send an email via your backend
        console.log('Donation confirmation email would be sent to:', data.email);
        console.log('Donation details:', data);
    }
    
    // Volunteer Opportunities
    const applyButtons = document.querySelectorAll('.apply-volunteer');
    const volunteerModal = document.getElementById('volunteerDetailModal');
    const volunteerModalContent = document.getElementById('volunteerModalContent');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Volunteer role details
    const volunteerRoles = {
        'health-educator': {
            title: 'Community Health Educator',
            category: 'Field Work',
            description: 'Deliver health education sessions in communities, conduct workshops on preventive healthcare, and support community health initiatives.',
            responsibilities: [
                'Conduct health education sessions for community groups',
                'Facilitate workshops on topics like hygiene, nutrition, and disease prevention',
                'Support community health campaigns and awareness programs',
                'Collect basic health data and report on sessions conducted',
                'Mobilize community participation in health activities'
            ],
            requirements: [
                'Background in health, nursing, or community development preferred',
                'Excellent communication and facilitation skills',
                'Ability to work with diverse community groups',
                'Willingness to travel to field locations',
                'Minimum 6-month commitment'
            ],
            benefits: [
                'Comprehensive training provided',
                'Field allowance and transportation support',
                'Certificate of service and reference letter',
                'Opportunity for skill development',
                'Meaningful community impact'
            ]
        },
        'social-media': {
            title: 'Social Media Ambassador',
            category: 'Remote Work',
            description: 'Help amplify our message by creating and sharing content across social media platforms.',
            responsibilities: [
                'Create engaging content for Facebook, Twitter, Instagram, and LinkedIn',
                'Schedule and publish posts using our content calendar',
                'Engage with our online community by responding to comments',
                'Monitor social media trends and suggest content ideas',
                'Help grow our social media following'
            ],
            requirements: [
                'Experience with social media platforms',
                'Good writing and communication skills',
                'Creative thinking and attention to detail',
                'Reliable internet connection',
                'Basic graphic design skills a plus'
            ],
            benefits: [
                'Flexible remote work schedule',
                'Social media training and resources',
                'Certificate of recognition',
                'Portfolio of published content',
                'Networking opportunities'
            ]
        }
        // Add more roles as needed
    };
    
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            const roleDetails = volunteerRoles[role];
            
            if (roleDetails) {
                volunteerModalContent.innerHTML = `
                    <div class="volunteer-role-details">
                        <h3>${roleDetails.title}</h3>
                        <div class="role-category">${roleDetails.category}</div>
                        
                        <div class="role-section">
                            <h4>Description</h4>
                            <p>${roleDetails.description}</p>
                        </div>
                        
                        <div class="role-section">
                            <h4>Key Responsibilities</h4>
                            <ul>
                                ${roleDetails.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="role-section">
                            <h4>Requirements</h4>
                            <ul>
                                ${roleDetails.requirements.map(req => `<li>${req}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="role-section">
                            <h4>Benefits</h4>
                            <ul>
                                ${roleDetails.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="role-actions">
                            <button class="btn-primary apply-role" data-role="${role}">Apply for this Role</button>
                            <button class="btn-outline close-details">Back to Opportunities</button>
                        </div>
                    </div>
                `;
                
                volunteerModal.style.display = 'flex';
                
                // Add event listeners to new buttons
                document.querySelector('.apply-role').addEventListener('click', function() {
                    volunteerModal.style.display = 'none';
                    document.getElementById('volunteerForm').scrollIntoView({ behavior: 'smooth' });
                    
                    // Pre-fill the volunteer form with role
                    const roleInput = document.createElement('input');
                    roleInput.type = 'hidden';
                    roleInput.name = 'appliedRole';
                    roleInput.value = role;
                    document.getElementById('volunteerForm').appendChild(roleInput);
                });
                
                document.querySelector('.close-details').addEventListener('click', function() {
                    volunteerModal.style.display = 'none';
                });
            }
        });
    });
    
    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Close success modal
    const closeSuccess = document.querySelector('.close-success');
    if (closeSuccess) {
        closeSuccess.addEventListener('click', function() {
            document.getElementById('donationSuccessModal').style.display = 'none';
        });
    }
    
    // Volunteer form submission
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('.submit-volunteer');
            const originalText = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitButton.disabled = true;
            
            // Collect form data
            const formData = {
                firstName: document.getElementById('vFirstName').value,
                lastName: document.getElementById('vLastName').value,
                email: document.getElementById('vEmail').value,
                phone: document.getElementById('vPhone').value,
                location: document.getElementById('vLocation').value,
                availability: document.getElementById('vAvailability').value,
                skills: Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(cb => cb.value),
                experience: document.getElementById('vExperience').value,
                interest: document.querySelector('input[name="interest"]:checked').value
            };
            
            // Simulate submission
            setTimeout(() => {
                // Show success message
                showMessage('Thank you for your volunteer application! We will contact you within 3-5 business days.', 'success');
                
                // Reset form
                volunteerForm.reset();
                
                // Reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Track volunteer application
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'volunteer_application', {
                        'event_category': 'Engagement',
                        'event_label': 'Volunteer Form Submission'
                    });
                }
            }, 1500);
        });
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email && email.includes('@')) {
                showMessage('Thank you for subscribing to our newsletter!', 'success');
                this.reset();
                
                // Track subscription
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup', {
                        'event_category': 'Engagement',
                        'event_label': 'Advocacy Newsletter'
                    });
                }
            }
        });
    }
    
    // Social sharing
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList.contains('facebook') ? 'facebook' :
                           this.classList.contains('twitter') ? 'twitter' : 'linkedin';
            
            const url = window.location.href;
            const title = 'Support Lighthouse Children and Community Wellness Foundation';
            const text = 'Join me in supporting children and communities through LCCWF.';
            
            shareContent(platform, url, title, text);
        });
    });
    
    function shareContent(platform, url, title, text) {
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`
        };
        
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    }
    
    // Utility functions
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: ${type === 'success' ? '#4CAF50' : '#e74c3c'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            animation: slideIn 0.3s;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
    
    function updateProgressBar(stepId) {
        // Create or update progress bar visualization
        const steps = ['step-amount', 'step-details', 'step-payment'];
        const currentIndex = steps.indexOf(stepId);
        
        const progressBar = document.querySelector('.progress-bar');
        if (!progressBar) {
            // Create progress bar if it doesn't exist
            createProgressBar(steps, currentIndex);
        } else {
            // Update existing progress bar
            updateProgressBarSteps(progressBar, steps, currentIndex);
        }
    }
    
    function createProgressBar(steps, currentIndex) {
        const progressHTML = `
            <div class="progress-bar">
                ${steps.map((step, index) => `
                    <div class="progress-step ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'completed' : ''}">
                        <div class="step-number">${index + 1}</div>
                        <div class="step-label">${getStepLabel(step)}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Insert after donation form container
        const formContainer = document.querySelector('.donation-form-container');
        if (formContainer) {
            formContainer.insertAdjacentHTML('afterbegin', progressHTML);
        }
    }
    
    function updateProgressBarSteps(progressBar, steps, currentIndex) {
        const stepElements = progressBar.querySelectorAll('.progress-step');
        stepElements.forEach((step, index) => {
            step.className = 'progress-step';
            if (index === currentIndex) step.classList.add('active');
            if (index < currentIndex) step.classList.add('completed');
        });
    }
    
    function getStepLabel(stepId) {
        const labels = {
            'step-amount': 'Amount',
            'step-details': 'Details',
            'step-payment': 'Payment'
        };
        return labels[stepId] || stepId;
    }
    
    // Initialize on page load
    updateProgressBar('step-amount');
}

// Initialize involvement page
if (document.querySelector('.involvement-header')) {
    document.addEventListener('DOMContentLoaded', initInvolvementPage);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .alert-message {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
`;
document.head.appendChild(style);
// Mobile-specific optimizations
function optimizeForMobile() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Adjust form layouts for mobile
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.style.marginBottom = '15px';
        });
        
        // Make buttons more tappable
        const buttons = document.querySelectorAll('button, .btn, .option-link');
        buttons.forEach(btn => {
            btn.style.padding = '12px 20px';
            btn.style.minHeight = '44px';
        });
        
        // Adjust donation amount boxes
        const amountBoxes = document.querySelectorAll('.amount-box');
        amountBoxes.forEach(box => {
            box.style.padding = '15px 10px';
            box.style.fontSize = '1.1rem';
        });
        
        // Improve form step visibility
        const formSteps = document.querySelectorAll('.form-step');
        formSteps.forEach(step => {
            step.style.padding = '20px 15px';
        });
        
        // Handle keyboard for better mobile UX
        document.addEventListener('focusin', function(e) {
            if (e.target.matches('input, select, textarea')) {
                setTimeout(() => {
                    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        });
        
        // Prevent zoom on number inputs (iOS)
        const numberInputs = document.querySelectorAll('input[type="number"]');
        numberInputs.forEach(input => {
            input.addEventListener('touchstart', function() {
                this.style.fontSize = '16px';
            });
        });
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            location.reload();
        }, 100);
    });
}

// Initialize mobile optimizations
if (document.querySelector('.involvement-header')) {
    document.addEventListener('DOMContentLoaded', optimizeForMobile);
    window.addEventListener('resize', optimizeForMobile);
}

// Add CSS for better mobile form handling
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    @media (max-width: 768px) {
        /* Prevent form element zoom on iOS */
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="number"],
        select,
        textarea {
            font-size: 16px !important;
        }
        
        /* Better tap targets */
        label {
            display: block;
            margin-bottom: 8px;
            font-size: 16px;
        }
        
        /* Improve select dropdowns on mobile */
        select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url('data:image/svg+xml;utf8,<svg fill="%231a5f7a" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
            background-repeat: no-repeat;
            background-position: right 10px center;
            padding-right: 40px;
        }
        
        /* Custom checkbox and radio styling for mobile */
        .skill-checkbox input[type="checkbox"],
        .interest-radio input[type="radio"] {
            width: 20px;
            height: 20px;
            margin-right: 10px;
        }
        
        /* Smooth scrolling for forms */
        .donation-form-container,
        .volunteer-form-container {
            -webkit-overflow-scrolling: touch;
            overflow-y: auto;
        }
        
        /* Hide number input spinner */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        
        /* Fix for iOS button styling */
        button,
        input[type="button"],
        input[type="submit"] {
            -webkit-appearance: none;
            border-radius: 0;
        }
    }
    
    /* Prevent horizontal scrolling */
    body {
        overflow-x: hidden;
        width: 100%;
    }
    
    /* Better focus states for accessibility */
    :focus {
        outline: 2px solid var(--primary-blue);
        outline-offset: 2px;
    }
    
    /* Improve touch feedback */
    button:active,
    .btn:active,
    .option-link:active {
        opacity: 0.7;
        transform: scale(0.98);
        transition: transform 0.1s, opacity 0.1s;
    }
`;
document.head.appendChild(mobileStyles);