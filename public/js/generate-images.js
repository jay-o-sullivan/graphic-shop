/**
 * This script generates fake image placeholders for development
 * Run with Node.js: node generate-images.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '..', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('Created images directory');
}

// List of images to download with their names
const imagesToDownload = [
  // Products/Services
  { name: 'logo-design.jpg', url: 'https://source.unsplash.com/random/600x400/?logo' },
  { name: 'branding-package.jpg', url: 'https://source.unsplash.com/random/600x400/?branding' },
  { name: 'social-media-pack.jpg', url: 'https://source.unsplash.com/random/600x400/?social-media' },
  { name: 'web-design.jpg', url: 'https://source.unsplash.com/random/600x400/?web-design' },
  { name: 'print-design.jpg', url: 'https://source.unsplash.com/random/600x400/?print' },
  { name: 'business-card.jpg', url: 'https://source.unsplash.com/random/600x400/?business-card' },

  // Portfolio items
  { name: 'portfolio-1.jpg', url: 'https://source.unsplash.com/random/800x600/?graphic-design' },
  { name: 'portfolio-2.jpg', url: 'https://source.unsplash.com/random/800x600/?logo-design' },
  { name: 'portfolio-3.jpg', url: 'https://source.unsplash.com/random/800x600/?branding' },
  { name: 'portfolio-4.jpg', url: 'https://source.unsplash.com/random/800x600/?poster' },
  { name: 'portfolio-5.jpg', url: 'https://source.unsplash.com/random/800x600/?flyer' },
  { name: 'portfolio-6.jpg', url: 'https://source.unsplash.com/random/800x600/?website' },

  // Client avatars
  { name: 'client-1.jpg', url: 'https://source.unsplash.com/random/200x200/?portrait,woman' },
  { name: 'client-2.jpg', url: 'https://source.unsplash.com/random/200x200/?portrait,man' },
  { name: 'client-3.jpg', url: 'https://source.unsplash.com/random/200x200/?portrait,woman' },
  { name: 'client-4.jpg', url: 'https://source.unsplash.com/random/200x200/?portrait,man' },

  // Hero and background images
  { name: 'hero-bg.jpg', url: 'https://source.unsplash.com/random/1600x800/?design,creative' },
  { name: 'about-image.jpg', url: 'https://source.unsplash.com/random/800x600/?office,design' },
  { name: 'contact-bg.jpg', url: 'https://source.unsplash.com/random/1600x800/?office,desk' }
];

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(imagesDir, filename);

    // Skip download if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`File already exists: ${filename}`);
      resolve();
      return;
    }

    console.log(`Downloading: ${filename}`);

    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        downloadImage(redirectUrl, filename)
          .then(resolve)
          .catch(reject);
        return;
      }

      // Check if the request was successful
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: Status code ${response.statusCode}`));
        return;
      }

      // Write the file
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('Starting image download...');

  for (const image of imagesToDownload) {
    try {
      await downloadImage(image.url, image.name);
    } catch (error) {
      console.error(`Error downloading ${image.name}:`, error.message);
    }
  }

  console.log('Image download completed!');
}

// Run the download
downloadAllImages();
