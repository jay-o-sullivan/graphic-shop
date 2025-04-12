/**
 * Script to fetch sample images for the portfolio
 *
 * This script downloads sample images from Unsplash to use in the portfolio
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

// Sample image URLs (public domain or Creative Commons from Unsplash)
const sampleImages = [
  {
    url: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce',
    filename: 'sample-logo-1.jpg',
    params: '?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1523726491678-bf852e717f6a',
    filename: 'sample-logo-2.jpg',
    params: '?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
    filename: 'sample-icons-1.jpg',
    params: '?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73',
    filename: 'sample-poster-1.jpg',
    params: '?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514',
    filename: 'sample-banner-1.jpg',
    params: '?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1560830889-96266c6dbe96',
    filename: 'sample-illustration-1.jpg',
    params: '?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

// Create the directory if it doesn't exist
const imageDir = path.join(__dirname, '../public/images');

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const fullUrl = `${url}${url.includes('?') ? '&' : '?'}utm_source=graphic_shop&utm_medium=referral`;
    const filePath = path.join(imageDir, filename);

    https.get(fullUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file
        reject(err);
      });
    }).on('error', reject);
  });
}

// Main function
async function fetchSampleImages() {
  try {
    // Ensure the directory exists
    if (!fs.existsSync(imageDir)) {
      await mkdir(imageDir, { recursive: true });
      console.log(`Created directory: ${imageDir}`);
    }

    // Download all images
    console.log('Downloading sample images...');
    await Promise.all(sampleImages.map(img =>
      downloadImage(`${img.url}${img.params || ''}`, img.filename)
    ));

    console.log('All sample images downloaded successfully');
  } catch (error) {
    console.error('Error downloading sample images:', error);
    process.exit(1);
  }
}

// Run the script
fetchSampleImages();
