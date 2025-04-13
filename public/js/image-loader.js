/**
 * Image loader for GraphicShop
 * Handles lazy loading and SEO optimization for images
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize lazy loading for images
  const lazyImages = document.querySelectorAll('img.lazy-image');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');

            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }

            observer.unobserve(img);
          }
        }
      });
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(img => {
      img.src = img.dataset.src || img.src;
      img.classList.add('loaded');
    });
  }

  // Add structured data for product images (for SEO)
  document.querySelectorAll('.product-card').forEach(card => {
    const productId = card.dataset.productId;
    if (!productId) return;

    const img = card.querySelector('.product-image');
    const title = card.querySelector('.product-title')?.textContent;
    const price = card.querySelector('.product-price')?.textContent.trim();

    if (img && title && price) {
      const productData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": title,
  productCards.forEach(card => {
    const image = card.querySelector('.product-image');
    const title = card.querySelector('.product-title').textContent;
    const price = card.querySelector('.product-price').textContent.trim();
    const url = card.getAttribute('href') || window.location.href;

    // Create structured data for this product
    const structuredData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": title,
      "image": image.src,
      "description": title,
      "offers": {
        "@type": "Offer",
        "url": url,
        "priceCurrency": "USD",
        "price": price.replace(/[^\d.]/g, ''),
        "availability": "https://schema.org/InStock"
      }
    };

    // Add structured data to the page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  });

  // Make alt text visible on hover for better user experience
  document.querySelectorAll('.image-with-alt').forEach(container => {
    const img = container.querySelector('img');
    const altText = img.getAttribute('alt');

    if (altText && altText.trim() !== '') {
      const altDisplay = document.createElement('div');
      altDisplay.className = 'image-alt-text';
      altDisplay.textContent = altText;
      container.appendChild(altDisplay);
    }
  });
});
