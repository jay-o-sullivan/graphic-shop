/**
 * Image handler for GraphicShop
 * - Fixes 404 errors for missing images
 * - Creates consistent placeholders for better visual experience
 */
document.addEventListener('DOMContentLoaded', function() {
  // Fix all image errors
  document.querySelectorAll('img').forEach(img => {
    // Only add error handler if image doesn't already have one
    if (!img.hasAttribute('data-error-handled')) {
      img.setAttribute('data-error-handled', 'true');

      // Handle image loading errors
      img.onerror = function() {
        // Get image details
        const alt = this.alt || 'Image';
        const width = this.width || this.getAttribute('width') || 300;
        const height = this.height || this.getAttribute('height') || 200;

        // Determine image type from src or context
        let type = 'default';
        if (this.src.includes('logo')) type = 'logo';
        else if (this.src.includes('product') || this.src.includes('design')) type = 'product';
        else if (this.src.includes('portfolio')) type = 'portfolio';
        else if (this.src.includes('team') || this.src.includes('client')) type = 'person';
        else if (this.src.includes('payment') || this.src.includes('card')) type = 'payment';

        // Set color based on image type
        const colors = {
          logo: '#3498db',      // blue
          product: '#e67e22',   // orange
          portfolio: '#2ecc71', // green
          person: '#9b59b6',    // purple
          payment: '#34495e',   // dark blue
          default: '#95a5a6'    // gray
        };

        // Create SVG for placeholder
        const svgContent = createPlaceholderSVG(width, height, alt, colors[type], type);

        // Set as data URL
        this.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);

        // Remove onerror to prevent infinite loops
        this.onerror = null;
      };
    }
  });

  // Create different SVG placeholder based on content type
  function createPlaceholderSVG(width, height, text, color, type) {
    // Base SVG structure
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="${color}" />`;

    // Add content based on type
    if (type === 'logo') {
      svg += `
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 5}px"
              font-weight="bold" text-anchor="middle" fill="white">GraphicShop</text>`;
    } else if (type === 'person') {
      // Person silhouette
      const centerX = width / 2;
      const centerY = height / 2;
      const headRadius = Math.min(width, height) / 6;

      svg += `
        <circle cx="${centerX}" cy="${centerY - headRadius}" r="${headRadius}" fill="white" opacity="0.8" />
        <path d="M${centerX - headRadius * 1.5},${centerY + headRadius * 1.2}
                 C${centerX - headRadius * 1.5},${centerY + headRadius * 3},
                  ${centerX + headRadius * 1.5},${centerY + headRadius * 3},
                  ${centerX + headRadius * 1.5},${centerY + headRadius * 1.2}"
              fill="white" opacity="0.6" />
        <text x="50%" y="85%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 10}px"
              text-anchor="middle" fill="white">${text}</text>`;
    } else {
      // Standard placeholder with text
      svg += `
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 10}px"
              text-anchor="middle" fill="white">${text}</text>`;
    }

    svg += `</svg>`;
    return svg;
  }

  // Fix favicon
  const createFavicon = () => {
    const faviconLink = document.querySelector('link[rel="icon"]') ||
                         document.querySelector('link[rel="shortcut icon"]');

    if (!faviconLink) {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';

      // Create simple SVG favicon
      const favicon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <rect width="32" height="32" fill="#3498db" />
          <text x="16" y="20" font-family="Arial, sans-serif" font-size="14"
                font-weight="bold" text-anchor="middle" fill="white">G</text>
        </svg>
      `;

      link.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(favicon);
      document.head.appendChild(link);
    }
  };

  createFavicon();
});
