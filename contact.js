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
            
            // Extract form action URL
            const formAction = this.getAttribute('action');
            const formMethod = this.getAttribute('method') || 'POST';
            
            // Send data using Fetch API
            fetch(formAction, {
                method: formMethod,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                // Show success message
                showSuccessToast();
                
                // Reset form
                contactForm.reset();
                
                // Track form submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_form_submission', {
                        'event_category': 'Contact',
                        'event_label': 'Simple Contact Form'
                    });
                }
                
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
                
                // If fetch fails, fall back to traditional form submission
                console.log('Falling back to traditional form submission...');
                
                // For traditional form submission, we need to remove the event listener
                contactForm.removeEventListener('submit', arguments.callee);
                contactForm.submit();
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
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
            
            // Add auto-hide
            setTimeout(() => {
                successToast.style.display = 'none';
            }, 5000);
            
            // Optional: Add close button functionality
            const closeBtn = successToast.querySelector('.toast-close');
            if (closeBtn) {
                closeBtn.onclick = () => {
                    successToast.style.display = 'none';
                };
            }
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
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = email;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    // Show feedback
                    const originalText = this.textContent;
                    this.textContent = '✓ Copied!';
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
            }).catch(err => {
                console.error('Failed to copy: ', err);
                // Fallback
                const textArea = document.createElement('textarea');
                textArea.value = addressText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                const originalHTML = this.innerHTML;
                this.innerHTML = '<span style="color: #4CAF50;">✓ Copied!</span>';
                
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
    
    // Add success toast close button if it doesn't exist
    if (successToast && !successToast.querySelector('.toast-close')) {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'toast-close';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            color: white;
            cursor: pointer;
            margin-left: auto;
        `;
        successToast.appendChild(closeBtn);
    }
}

// Initialize simple contact page
if (document.querySelector('.simple-contact-form')) {
    document.addEventListener('DOMContentLoaded', initSimpleContact);
}

// Add CSS for error messages and toast
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
    
    /* Toast styles */
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: none;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: toastSlideIn 0.3s ease;
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    @keyframes toastSlideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes toastSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .toast.hiding {
        animation: toastSlideOut 0.3s ease;
    }
    
    /* Loading spinner */
    .fa-spinner {
        margin-right: 8px;
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
            bottom: 80px;
            max-width: calc(100vw - 40px);
        }
    }
`;
document.head.appendChild(errorStyles);