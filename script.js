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