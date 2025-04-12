document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  // Accordion functionality
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      this.classList.toggle('active');
      const content = this.nextElementSibling;

      if (this.classList.contains('active')) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  });

  // Initialize carousels if needed
  window.initCarousels = function() {
    // Testimonial slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider && typeof Swiper !== 'undefined') {
      new Swiper(testimonialSlider, {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 5000,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    }
  };

  // Validate forms
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;

          // Add error class
          field.classList.add('error');

          // Create error message if it doesn't exist
          let errorMsg = field.nextElementSibling;
          if (!errorMsg || !errorMsg.classList.contains('error-msg')) {
            errorMsg = document.createElement('div');
            errorMsg.classList.add('error-msg');
            errorMsg.textContent = 'This field is required';
            field.parentNode.insertBefore(errorMsg, field.nextSibling);
          }
        } else {
          // Remove error class and message
          field.classList.remove('error');
          const errorMsg = field.nextElementSibling;
          if (errorMsg && errorMsg.classList.contains('error-msg')) {
            errorMsg.remove();
          }
        }
      });

      if (!isValid) {
        e.preventDefault();
      }
    });
  });
});

// Lazy load images
document.addEventListener('DOMContentLoaded', function() {
  const lazyImages = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
});
