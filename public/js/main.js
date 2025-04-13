/**
 * GraphicShop - Main JavaScript file
 * Contains common functionality for the entire site
 */

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Handle form validations
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      let isValid = true;

      // Check required fields
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');

          // Add error message if not already present
          let errorElement = field.nextElementSibling;
          if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.classList.add('error-message');
            errorElement.textContent = 'This field is required';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
          }
        } else {
          field.classList.remove('error');

          // Remove error message if present
          const errorElement = field.nextElementSibling;
          if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
          }
        }
      });

      // Validate email fields
      const emailFields = form.querySelectorAll('input[type="email"]');

      emailFields.forEach(field => {
        if (field.value.trim() && !validateEmail(field.value)) {
          isValid = false;
          field.classList.add('error');

          // Add error message if not already present
          let errorElement = field.nextElementSibling;
          if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.classList.add('error-message');
            errorElement.textContent = 'Please enter a valid email address';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
          }
        }
      });

      if (!isValid) {
        e.preventDefault();
      }
    });
  });

  // Email validation helper
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // Initialize image lazy loading if supported
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = '/js/lazysizes.min.js';
    document.body.appendChild(script);
  }

  // Add tracking for form submissions
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function() {
      if (typeof gtag === 'function') {
        gtag('event', 'form_submission', {
          'event_category': 'Contact',
          'event_label': 'Contact Form'
        });
      }
    });
  }
});
