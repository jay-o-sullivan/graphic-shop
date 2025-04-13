/**
 * Clean script to remove duplicate elements and fix styling
 */
(function() {
  // Remove duplicate elements
  function removeDuplicates() {
    // Fix duplicate headers
    const headers = document.querySelectorAll('header.header');
    if (headers.length > 1) {
      for (let i = 1; i < headers.length; i++) {
        headers[i].remove();
      }
    }

    // Fix duplicate navigation
    const navContainers = document.querySelectorAll('.nav-container');
    if (navContainers.length > 1) {
      for (let i = 1; i < navContainers.length; i++) {
        navContainers[i].remove();
      }
    }

    // Fix duplicate scripts
    const scriptSrcs = new Set();
    document.querySelectorAll('script').forEach(script => {
      if (script.src) {
        if (scriptSrcs.has(script.src)) {
          script.remove();
        } else {
          scriptSrcs.add(script.src);
        }
      }
    });

    // Fix duplicate stylesheets
    const linkHrefs = new Set();
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      if (linkHrefs.has(link.href)) {
        link.remove();
      } else {
        linkHrefs.add(link.href);
      }
    });
  }

  // Run on DOM content loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeDuplicates);
  } else {
    removeDuplicates();
  }

  // Also run after a short delay to catch dynamic content
  setTimeout(removeDuplicates, 500);
})();
