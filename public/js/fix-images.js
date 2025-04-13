/**
 * Simple image fixer for GraphicShop
 */
(function() {
  // Create placeholder for missing images
  function createPlaceholder(img) {
    const width = img.width || img.getAttribute('width') || 300;
    const height = img.height || img.getAttribute('height') || 200;
    const text = img.alt || 'Image';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#3498db"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`;

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  // Fix all images
  document.querySelectorAll('img').forEach(img => {
    if (!img._hasErrorHandler) {
      img._hasErrorHandler = true;

      img.addEventListener('error', function() {
        this.src = createPlaceholder(this);
      });

      // Check if already failed
      if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
        img.src = createPlaceholder(img);
      }
    }
  });

  // Remove duplicate headers
  const headers = document.querySelectorAll('header.header');
  if (headers.length > 1) {
    for (let i = 1; i < headers.length; i++) {
      headers[i].remove();
    }
  }
})();