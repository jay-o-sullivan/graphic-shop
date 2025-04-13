/**
 * Simple image fixer for GraphicShop
 */
(function() {
  // Fix missing images with SVG placeholders
  function createPlaceholder(img) {
    const width = img.width || img.getAttribute('width') || 300;
    const height = img.height || img.getAttribute('height') || 200;
    const text = img.alt || 'Image';

    // Create SVG placeholder
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#3498db"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`;

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  // Create text-based logo
  function fixLogo() {
    const logo = document.querySelector('.logo');
    if (logo && !logo.querySelector('span.logo-text')) {
      logo.innerHTML = '<span class="logo-text" style="font-weight:bold;font-size:1.5rem;"><span style="color:#3498db;">Graphic</span><span style="color:#2c3e50;">Shop</span></span>';
    }
  }

  // Fix all images on page
  function fixAllImages() {
    document.querySelectorAll('img').forEach(img => {
      // Skip images that already have error handlers
      if (img._hasErrorHandler) return;

      // Mark as having handler
      img._hasErrorHandler = true;

      // Add error handler
      img.addEventListener('error', function() {
        this.src = createPlaceholder(this);
      });

      // Check if already failed to load
      if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
        img.src = createPlaceholder(img);
      }
    });
  }

  // Create simple favicon
  function addFavicon() {
    if (!document.querySelector('link[rel="icon"]')) {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="%233498db"/><text x="8" y="12" font-size="10" fill="white" text-anchor="middle">G</text></svg>';
      document.head.appendChild(link);
    }
  }

  // Run immediately
  addFavicon();
  fixLogo();
  fixAllImages();

  // Run again after DOM is fully loaded
  if (document.readyState !== 'complete') {
    window.addEventListener('load', function() {
      fixLogo();
      fixAllImages();
    });
  }
})();
