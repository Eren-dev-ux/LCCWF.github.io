// Simple Contact Page JavaScript

function initSimpleContact() {
    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    const successToast = document.getElementById('successToast');
    
    if (contactForm) {
        // Add validation
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Collect form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Using FormSubmit.co for email delivery
            // The form's action attribute points to FormSubmit.co
            // This will automatically send the email
            
            // For testing/demo: Simulate success
            setTimeout(() => {
                // Show success message
                showSuccessToast();
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Track form submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_form_submission', {
                        'event_category': 'Contact',
                        'event_label': 'Simple Contact Form'
                    });
                }
                
                // In production, let the form submit normally
                // For now, we'll just show the toast
                console.log('Form data:', data);
                console.log('Email would be sent to: lighthouse.foundation26@gmail.com');
                
            }, 1500);
            
            // Uncomment to enable actual form submission:
            // this.submit();
        });
    }
    
    // Form validation
    function validateForm() {
        const form = document.getElementById('contactForm');
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            // Clear previous errors
            clearError(input);
            
            // Check if empty
            if (!input.value.trim()) {
                showError(input, 'This field is required');
                isValid = false;
            }
            
            // Email validation
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    showError(input, 'Please enter a valid email address');
                    isValid = false;
                }
            }
            
            // Phone validation (optional)
            if (input.type === 'tel' && input.value) {
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(input.value)) {
                    showError(input, 'Please enter a valid phone number');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    function showError(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 5px;
        `;
        
        input.style.borderColor = '#e74c3c';
        input.parentNode.appendChild(errorDiv);
        
        // Clear error on input
        input.addEventListener('input', function clearErrorOnInput() {
            clearError(this);
            this.removeEventListener('input', clearErrorOnInput);
        });
    }
    
    function clearError(input) {
        const errorDiv = input.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.style.borderColor = '';
    }
    
    // Show success toast
    function showSuccessToast() {
        if (successToast) {
            successToast.style.display = 'flex';
            
            setTimeout(() => {
                successToast.style.display = 'none';
            }, 5000);
        }
    }
    
    // Phone number click tracking
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            
            // Track phone call
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'event_category': 'Contact',
                    'event_label': phoneNumber
                });
            }
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // For mobile, confirm the call
            if (window.innerWidth <= 768) {
                const confirmed = confirm(`Call ${phoneNumber}?`);
                if (!confirmed) {
                    return false;
                }
            }
        });
    });
    
    // Email copy functionality
    const emailElements = document.querySelectorAll('.method-content p');
    emailElements.forEach(element => {
        if (element.textContent.includes('@')) {
            element.style.cursor = 'pointer';
            element.title = 'Click to copy email address';
            
            element.addEventListener('click', function() {
                const email = this.textContent.trim();
                navigator.clipboard.writeText(email).then(() => {
                    // Show copied feedback
                    const originalText = this.textContent;
                    this.textContent = '✓ Copied to clipboard!';
                    this.style.color = '#4CAF50';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.color = '';
                    }, 2000);
                });
            });
        }
    });
    
    // Emergency button enhancement
    const emergencyBtn = document.querySelector('.btn-emergency');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function(e) {
            // Track emergency call
            if (typeof gtag !== 'undefined') {
                gtag('event', 'emergency_call', {
                    'event_category': 'Contact',
                    'event_label': 'Emergency Button'
                });
            }
            
            // Add confirmation for emergency calls
            if (window.innerWidth <= 768) {
                const confirmed = confirm('This is an emergency hotline. Are you sure you want to call?');
                if (!confirmed) {
                    e.preventDefault();
                }
            }
        });
    }
    
    // Address copy functionality
    const addressElements = document.querySelectorAll('address');
    addressElements.forEach(address => {
        address.style.cursor = 'pointer';
        address.title = 'Click to copy address';
        
        address.addEventListener('click', function() {
            const addressText = this.textContent.trim();
            navigator.clipboard.writeText(addressText).then(() => {
                // Show copied feedback
                const originalHTML = this.innerHTML;
                this.innerHTML = '<span style="color: #4CAF50;">✓ Address copied to clipboard!</span>';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                }, 2000);
            });
        });
    });
    
    // Auto-format phone number input
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            // Format as 0912 345 6789
            if (value.length > 3 && value.length <= 7) {
                value = value.slice(0, 4) + ' ' + value.slice(4);
            } else if (value.length > 7) {
                value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7, 11);
            }
            
            this.value = value;
        });
    }
}

// Initialize simple contact page
if (document.querySelector('.simple-contact-form')) {
    document.addEventListener('DOMContentLoaded', initSimpleContact);
}

// Add CSS for error messages
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .error-message {
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 5px;
        animation: fadeIn 0.3s;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    /* Toast animation */
    @keyframes toastSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .toast.hiding {
        animation: toastSlideOut 0.3s ease;
    }
    
    /* Copy feedback animation */
    @keyframes copyPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .copy-pulse {
        animation: copyPulse 0.3s ease;
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
        .contact-method {
            flex-direction: column;
            text-align: center;
            padding: var(--space-md);
        }
        
        .method-icon {
            margin-bottom: var(--space-sm);
        }
        
        .emergency-alert {
            flex-direction: column;
            text-align: center;
            gap: var(--space-md);
            padding: var(--space-md);
        }
        
        .btn-emergency {
            width: 100%;
            justify-content: center;
        }
        
        .faq-item {
            padding: var(--space-md);
        }
        
        .toast {
            left: 20px;
            right: 20px;
            bottom: 80px; /* Above mobile browser UI */
        }
    }
`;
document.head.appendChild(errorStyles);