// Initialize AOS (Animate On Scroll) library
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,     // animation duration in milliseconds
        once: true,         // whether animation should happen only once - while scrolling down
        offset: 100,        // offset (in px) from the top of the screen to trigger animations
        easing: 'ease-in-out', // easing for animations (smooth acceleration/deceleration)
    });

    // Manually trigger AOS refresh in case dynamic content loads after initial DOM load
    window.addEventListener('load', AOS.refreshHard);
});

// Form Validation and Sanitization
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('main-contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Phone validation regex (Nigerian phone numbers)
    const phoneRegex = /^(\+?234|0)?[789][01]\d{8}$/;

    // Input sanitization function
    function sanitizeInput(input) {
        return input
            .trim()
            .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
            .replace(/\s+/g, ' '); // Normalize whitespace
    }

    // Validation functions
    function validateName() {
        const value = nameInput.value.trim();
        if (value.length < 2) {
            showError(nameInput, 'Name must be at least 2 characters long');
            return false;
        } else if (value.length > 100) {
            showError(nameInput, 'Name must be less than 100 characters');
            return false;
        } else {
            clearError(nameInput);
            return true;
        }
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        if (!value) {
            showError(emailInput, 'Email is required');
            return false;
        } else if (!emailRegex.test(value)) {
            showError(emailInput, 'Please enter a valid email address');
            return false;
        } else {
            clearError(emailInput);
            return true;
        }
    }

    function validatePhone() {
        const value = phoneInput.value.trim();
        if (value && !phoneRegex.test(value)) {
            showError(phoneInput, 'Please enter a valid Nigerian phone number');
            return false;
        } else {
            clearError(phoneInput);
            return true;
        }
    }

    function validateMessage() {
        const value = messageInput.value.trim();
        if (value.length < 10) {
            showError(messageInput, 'Message must be at least 10 characters long');
            return false;
        } else if (value.length > 1000) {
            showError(messageInput, 'Message must be less than 1000 characters');
            return false;
        } else {
            clearError(messageInput);
            return true;
        }
    }

    // Error handling functions
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message text-danger mt-1';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }

    // Event listeners for real-time validation
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim().length > 0) {
            clearError(nameInput);
        }
    });

    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', () => {
        if (emailInput.value.trim().length > 0) {
            clearError(emailInput);
        }
    });

    phoneInput.addEventListener('blur', validatePhone);
    phoneInput.addEventListener('input', () => {
        if (phoneInput.value.trim().length > 0) {
            clearError(phoneInput);
        }
    });

    messageInput.addEventListener('blur', validateMessage);
    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim().length > 0) {
            clearError(messageInput);
        }
    });

    // Form submission with validation and sanitization
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Sanitize all inputs
        const name = sanitizeInput(nameInput.value);
        const email = sanitizeInput(emailInput.value);
        const phone = sanitizeInput(phoneInput.value);
        const message = sanitizeInput(messageInput.value);

        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isMessageValid = validateMessage();

        // If any validation fails, don't submit
        if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
            return;
        }

        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        try {
            // Prepare form data with sanitized values
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('message', message);
            formData.append('_subject', 'New Contact Form Submission');
            formData.append('_template', 'box');
            formData.append('_autoresponse', 'Thank you for your message! We will get back to you soon.');

            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success
                showSuccessMessage('Thank you! Your message has been sent successfully.');
                contactForm.reset();
                
                // Clear all validation states
                [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
                    const formGroup = input.closest('.form-group');
                    const errorElement = formGroup.querySelector('.error-message');
                    if (errorElement) errorElement.remove();
                    input.classList.remove('is-invalid', 'is-valid');
                });
            } else {
                // Server error
                throw new Error('Server error occurred');
            }
        } catch (error) {
            console.error('Submission error:', error);
            showErrorMessage('Oops! There was an error sending your message. Please try again.');
        } finally {
            // Reset button state
            submitButton.innerHTML = 'Send Message';
            submitButton.disabled = false;
        }
    });

    // Success and error message functions
    function showSuccessMessage(message) {
        showMessage(message, 'success');
    }

    function showErrorMessage(message) {
        showMessage(message, 'error');
    }

    function showMessage(message, type) {
        const responseMessageBox = document.getElementById('response-message-box');
        const responseMessageText = document.getElementById('response-message-text');
        
        responseMessageText.textContent = message;
        responseMessageText.className = `message-text ${type}`;
        
        responseMessageBox.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideMessageBox();
        }, 5000);
    }

    // Enhanced hide message box function
    window.hideMessageBox = function() {
        const responseMessageBox = document.getElementById('response-message-box');
        responseMessageBox.classList.remove('show');
        
        // Clear message text
        const responseMessageText = document.getElementById('response-message-text');
        responseMessageText.textContent = '';
    };
});

// Enhanced accessibility features
document.addEventListener('DOMContentLoaded', () => {
    // Add skip to content link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
    `;
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    // Add ARIA labels for better screen reader support
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.setAttribute('aria-label', 'Main navigation');
    }

    const contactForm = document.getElementById('main-contact-form');
    if (contactForm) {
        contactForm.setAttribute('aria-label', 'Contact form');
    }

    // Add focus indicators for better keyboard navigation
    document.querySelectorAll('button, a, input, textarea').forEach(element => {
        element.style.outline = 'none';
        element.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 0 3px rgba(255, 115, 0, 0.3)';
        });
        element.addEventListener('blur', function() {
            this.style.boxShadow = 'none';
        });
    });

    // Add loading states for better UX
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.disabled = true;
                
                // Reset after 3 seconds if not already reset
                setTimeout(() => {
                    if (this.disabled) {
                        this.innerHTML = this.textContent.replace('Loading...', '');
                        this.disabled = false;
                    }
                }, 3000);
            }
        });
    });
});

// Performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Lazy loading for images
    const images = document.querySelectorAll('img');
    if ('loading' in HTMLImageElement.prototype) {
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });

        images.forEach(img => {
            if (img.dataset.src) {
                lazyImageObserver.observe(img);
            }
        });
    }

    // Debounce scroll events for better performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimize scroll event for navbar active state
    const optimizedScrollHandler = debounce(() => {
        updateNavbarActiveState();
    }, 100);

    window.addEventListener('scroll', optimizedScrollHandler);
});

// Performance monitoring and optimization
document.addEventListener('DOMContentLoaded', () => {
    // Performance metrics tracking
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime);
                }
                if (entry.entryType === 'first-input') {
                    console.log('FID:', entry.processingStart - entry.startTime);
                }
            });
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    }

    // Resource preloading for critical assets
    const criticalResources = [
        'styles.css',
        'script.js',
        'praixTech.png'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        if (resource.endsWith('.css')) {
            link.as = 'style';
        } else if (resource.endsWith('.js')) {
            link.as = 'script';
        } else {
            link.as = 'image';
        }
        document.head.appendChild(link);
    });

    // Optimize animations for better performance
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable animations for users who prefer reduced motion
        document.body.style.setProperty('--animation-duration', '0s');
        document.body.style.setProperty('--transition-duration', '0s');
    }

    // Memory management for large DOM operations
    let animationFrameId;
    
    function optimizeDOMUpdates() {
        // Use requestAnimationFrame for smooth DOM updates
        animationFrameId = requestAnimationFrame(() => {
            // DOM update logic here
            updateNavbarActiveState();
        });
    }

    // Cleanup function
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
});

// Enhanced scroll performance
function updateNavbarActiveState() {
    let currentSectionId = '';
    const navbarHeight = document.querySelector('.navbar').offsetHeight;

    // Use a more efficient loop for section detection
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionTop = section.offsetTop - navbarHeight - 20;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (pageYOffset >= sectionTop && pageYOffset < sectionBottom) {
            currentSectionId = section.getAttribute('id');
            break; // Exit loop early when found
        }
    }

    // Update navigation links efficiently
    for (let i = 0; i < navLinks.length; i++) {
        const link = navLinks[i];
        link.classList.remove('active');
        
        if (link.getAttribute('href').includes(currentSectionId) && currentSectionId !== '') {
            link.classList.add('active');
        }
        
        if (currentSectionId === 'hero' && pageYOffset < navbarHeight) {
            document.querySelector('a[href="#hero"]').classList.add('active');
        }
    }
}

// Theme Toggle (Light/Dark Mode) functionality
const themeToggleButton = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

/**
 * Sets the website's theme (light or dark) and updates the theme icon and localStorage.
 * @param {string} theme - The theme to apply ('light' or 'dark').
 */
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode'); // Add dark-mode class to body
        themeIcon.classList.remove('fa-sun'); // Change icon to moon
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark'); // Save preference
    } else {
        document.body.classList.remove('dark-mode'); // Remove dark-mode class
        themeIcon.classList.remove('fa-moon'); // Change icon to sun
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light'); // Save preference
    }
}

// Check for saved theme preference or system preference on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme); // Apply saved theme
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark'); // Default to system dark mode if no preference saved
    } else {
        setTheme('light'); // Default to light mode
    }
});

// Toggle theme on button click event
themeToggleButton.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        setTheme('light');
    } else {
        setTheme('dark');
    }
});

// Smooth Scrolling for Navbar Links
document.querySelectorAll('.navbar-nav .nav-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default anchor click behavior (jumps instantly)

        const targetId = this.getAttribute('href').substring(1); // Get the ID from href (e.g., "hero", "services")
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            // Calculate scroll position to account for the fixed navbar height
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const offsetTop = targetElement.offsetTop - navbarHeight - 10; // Added 10px buffer for spacing

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth' // Smooth scroll animation
            });

            // Close the responsive navbar menu on mobile devices after clicking a link
            // Checks if the navbar toggler is visible (i.e., on mobile) and if the menu is open
            if (window.innerWidth < 992 && document.getElementById('mainNavbar').classList.contains('show')) {
                $('#mainNavbar').collapse('hide'); // Uses Bootstrap's jQuery method to close the collapse menu
            }
        }
    });
});

// Dynamic Navbar Active State on Scroll
// Highlights the current section's link in the navbar as the user scrolls
const sections = document.querySelectorAll('section'); // All sections of the page
const navLinks = document.querySelectorAll('.navbar-nav .nav-link'); // All navigation links

window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const navbarHeight = document.querySelector('.navbar').offsetHeight;

    // Iterate through each section to find which one is currently in view
    sections.forEach(section => {
        // Calculate the top boundary of the section, accounting for fixed navbar and an extra buffer
        const sectionTop = section.offsetTop - navbarHeight - 20; // 20px buffer to make active state trigger slightly before section top
        const sectionBottom = sectionTop + section.offsetHeight; // Bottom boundary of the section

        // Check if current scroll position is within the section's boundaries
        if (pageYOffset >= sectionTop && pageYOffset < sectionBottom) {
            currentSectionId = section.getAttribute('id'); // Get the ID of the current section
        }
    });

    // Update the 'active' class on navigation links based on the current section
    navLinks.forEach(link => {
        link.classList.remove('active'); // Remove 'active' class from all links first
        // Check if the link's href attribute (e.g., "#hero") matches the current section ID (e.g., "hero")
        if (link.getAttribute('href').includes(currentSectionId) && currentSectionId !== '') {
            link.classList.add('active'); // Add 'active' class to the corresponding link
        }
        // Special handling for the "Home" link when at the very top of the page
        if (currentSectionId === 'hero' && pageYOffset < navbarHeight) {
            document.querySelector('a[href="#hero"]').classList.add('active');
        }
    });
});


// Custom Message Box for Form Submission Feedback (replaces browser alerts/redirects)
const contactForm = document.getElementById('main-contact-form');
const responseMessageBox = document.getElementById('response-message-box');
const responseMessageText = document.getElementById('response-message-text');

// Event listener for contact form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission to handle it via JavaScript

    const formData = new FormData(contactForm); // Get form data
    const formAction = contactForm.getAttribute('action'); // Get the FormSubmit.co endpoint

    try {
        const response = await fetch(formAction, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json' // Request JSON response from FormSubmit
            }
        });

        if (response.ok) {
            // If submission is successful
            responseMessageText.textContent = "Thank You! Your message has been successfully sent. We will get back to you shortly.";
            contactForm.reset(); // Clear the form fields
        } else {
            // If submission fails (e.g., validation error from FormSubmit)
            const data = await response.json();
            if (data.message) {
                responseMessageText.textContent = `Error: ${data.message}`;
            } else {
                responseMessageText.textContent = "Oops! There was an error sending your message. Please try again.";
            }
        }
    } catch (error) {
        // Catch network errors or other unexpected issues
        console.error('Submission error:', error);
        responseMessageText.textContent = "Network error. Please check your internet connection and try again.";
    } finally {
        // Always show the custom message box after submission attempt
        responseMessageBox.classList.add('show');
    }
});

/**
 * Hides the custom message box.
 * This function is called by the "Close" button within the message box.
 */
function hideMessageBox() {
    responseMessageBox.classList.remove('show');
}

// Dynamically set the current year in the footer's copyright notice
document.addEventListener('DOMContentLoaded', () => {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear(); // Get current year and update text content
    }
});