/**
 * Generates placeholder images for the GraphicShop application
 * This helps when actual images are not available
 */
document.addEventListener('DOMContentLoaded', function() {
  // Find all images with missing sources
  const images = document.querySelectorAll('img');

  images.forEach(img => {
    img.onerror = function() {
      const src = this.getAttribute('src');
      const alt = this.getAttribute('alt') || 'Image';
      const width = this.getAttribute('width') || this.clientWidth || 300;
      const height = this.getAttribute('height') || this.clientHeight || 200;

      // Get image type from the src
      let imageType = 'default';
      if (src.includes('logo')) imageType = 'logo';
      else if (src.includes('product')) imageType = 'product';
      else if (src.includes('portfolio')) imageType = 'portfolio';
      else if (src.includes('team')) imageType = 'team';
      else if (src.includes('payment')) imageType = 'payment';

      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Set background color based on image type
      switch(imageType) {
        case 'logo':
          ctx.fillStyle = '#3498db';
          break;
        case 'product':
          ctx.fillStyle = '#e67e22';
          break;
        case 'portfolio':
          ctx.fillStyle = '#2ecc71';
          break;
        case 'team':
          ctx.fillStyle = '#9b59b6';
          break;
        case 'payment':
          ctx.fillStyle = '#34495e';
          break;
        default:
          ctx.fillStyle = '#f4f4f4';
      }

      // Draw background
      ctx.fillRect(0, 0, width, height);

      // Add text
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.min(width, height) / 10}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // For portrait images (higher than wide)
      if (height > width) {
        // Split text into multiple lines if needed
        const words = alt.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          if (currentLine.length + words[i].length + 1 <= 15) {
            currentLine += ' ' + words[i];
          } else {
            lines.push(currentLine);
            currentLine = words[i];
          }
        }
        lines.push(currentLine);

        // Draw text lines
        lines.forEach((line, index) => {
          const y = height / 2 - ((lines.length - 1) * 20 / 2) + (index * 20);
          ctx.fillText(line, width / 2, y);
        });
      } else {
        // For landscape or square images
        ctx.fillText(alt, width / 2, height / 2);
      }

      // Replace the image src with the canvas data URL
      this.src = canvas.toDataURL('image/png');
    };

    // Force error if image is empty
    if (!img.src || img.src === window.location.href) {
      img.src = 'non-existent-image.jpg';
    }
  });
});
