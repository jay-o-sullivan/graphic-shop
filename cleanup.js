/**
 * Project cleanup script
 * - Removes unnecessary files
 * - Cleans up duplicate code
 */
const fs = require('fs');
const path = require('path');

// Files to remove (relative to project root)
const filesToRemove = [
  'public/css/design-fixes.css',
  'public/css/enhanced-style.css',
  'public/css/animations.css',
  'public/css/layout-fixes.css',
  'public/js/design-enhancements.js',
  'public/js/design-upgrades.js',
  'enhance-design.js',
  'fix-views.js',
  'update-views.js',
  'fix-duplicates.js',
  'fix-style.js',
  'fix-partials.js'
];

// Remove unnecessary files
let removedCount = 0;
filesToRemove.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`Removed: ${file}`);
    removedCount++;
  }
});

console.log(`Removed ${removedCount} unnecessary files.`);

// Clean up head.ejs to include only essential styles
const headPath = path.join(__dirname, 'views', 'partials', 'head.ejs');
if (fs.existsSync(headPath)) {
  fs.writeFileSync(headPath, `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><%= typeof title !== 'undefined' ? title : 'GraphicShop' %></title>
<meta name="description" content="<%= typeof description !== 'undefined' ? description : 'Professional graphic design services.' %>">

<!-- Stylesheets -->
<link rel="stylesheet" href="/css/main.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

<!-- Fix script for images -->
<script src="/js/fix-images.js"></script>

<style>
  /* Basic styling fixes */
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
  }

  /* Fix header styling */
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  /* Fix duplicate headers */
  header.header ~ header.header {
    display: none !important;
  }

  /* Fix layout */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }

  /* Clean up images */
  img {
    max-width: 100%;
    height: auto;
  }
</style>`);
  console.log('Updated head.ejs with simplified styling');
}

// Clean up fix-images.js
const fixImagesPath = path.join(__dirname, 'public', 'js', 'fix-images.js');
if (fs.existsSync(fixImagesPath)) {
  fs.writeFileSync(fixImagesPath, `/**
 * Simple image fixer for GraphicShop
 */
(function() {
  // Create placeholder for missing images
  function createPlaceholder(img) {
    const width = img.width || img.getAttribute('width') || 300;
    const height = img.height || img.getAttribute('height') || 200;
    const text = img.alt || 'Image';

    const svg = \`<svg xmlns="http://www.w3.org/2000/svg" width="\${width}" height="\${height}" viewBox="0 0 \${width} \${height}"><rect width="100%" height="100%" fill="#3498db"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">\${text}</text></svg>\`;

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
})();`);
  console.log('Simplified fix-images.js');
}

// Update server.js to handle favicon requests
const serverPath = path.join(__dirname, 'server.js');
if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');

  if (!serverContent.includes('favicon.ico')) {
    // Find a good place to insert the favicon handler
    const newContent = serverContent.replace(
      /app\.use\(express\.static\(.*\)\);/,
      `app.use(express.static(path.join(__dirname, 'public')));\n\n// Handle favicon requests\napp.get('/favicon.ico', (req, res) => {\n  res.type('image/x-icon');\n  res.status(204).end();\n});`
    );

    fs.writeFileSync(serverPath, newContent);
    console.log('Updated server.js with favicon handler');
  }
}

console.log('Cleanup complete!');
