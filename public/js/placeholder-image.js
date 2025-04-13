/**
 * This script generates placeholder images for the GraphicShop project
 * in case the actual image files are not available.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Find all image elements that might be missing
  const images = document.querySelectorAll('img');

  images.forEach(img => {
    // Add error handler to each image
    img.addEventListener('error', function() {
      const fileName = img.src.split('/').pop();
      const extension = fileName.split('.').pop().toLowerCase();

      // Only handle JPG, JPEG, PNG, SVG
      if (['jpg', 'jpeg', 'png', 'svg'].includes(extension)) {
        generatePlaceholder(img, fileName);
      }
    });
  });

  /**
   * Generates a placeholder image with canvas and replaces the broken image
   */
  function generatePlaceholder(imgElement, fileName) {
    // Create canvas element
    const canvas = document.createElement('canvas');
    const width = imgElement.width || 300;
    const height = imgElement.height || 200;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    // Fill background
    if (fileName.includes('logo-design')) {
      // Logo design background
      ctx.fillStyle = '#3498db';
    } else if (fileName.includes('visa')) {
      ctx.fillStyle = '#1a1f71';
    } else if (fileName.includes('mastercard')) {
      ctx.fillStyle = '#eb001b';
    } else if (fileName.includes('amex')) {
      ctx.fillStyle = '#006fcf';
    } else if (fileName.includes('discover')) {
      ctx.fillStyle = '#ff6000';
    } else {
      // Default background
      ctx.fillStyle = '#eeeeee';
    }

    ctx.fillRect(0, 0, width, height);

    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.floor(width/10)}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Display file name as text
    let displayText = fileName.split('.')[0];

    // For payment cards, just show the name
    if (['visa', 'mastercard', 'amex', 'discover'].some(card => fileName.includes(card))) {
      displayText = displayText.toUpperCase();
    }

    ctx.fillText(displayText, width/2, height/2);

    // Replace the original image with canvas data
    imgElement.src = canvas.toDataURL('image/png');
  }
});
