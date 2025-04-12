/**
 * GraphicShop Analytics Module
 *
 * Tracks user interactions and e-commerce events to help with marketing
 * and understanding user behavior.
 */

const GraphicShopAnalytics = (function() {
  // Configuration
  const config = {
    enabled: true,
    debug: false,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    endpoint: '/api/analytics',
    cookieName: 'gs_session'
  };

  // Generate or retrieve session ID
  const getSessionId = () => {
    let sessionId = getCookie(config.cookieName);

    if (!sessionId) {
      sessionId = 'gs_' + Math.random().toString(36).substring(2, 15);
      setCookie(config.cookieName, sessionId, 1); // 1 day
    }

    return sessionId;
  };

  // Helper function to set cookies
  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  };

  // Helper function to get cookies
  const getCookie = (name) => {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  // Log to console in debug mode
  const log = (message, data) => {
    if (config.debug) {
      console.log(`[Analytics] ${message}`, data || '');
    }
  };

  // Send data to server
  const sendToServer = (eventType, eventData) => {
    if (!config.enabled) return;

    const data = {
      sessionId: getSessionId(),
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
      eventType,
      eventData
    };

    log('Sending event', data);

    // Use beacon API for unload events
    if (eventType === 'page_exit' && navigator.sendBeacon) {
      navigator.sendBeacon(config.endpoint, JSON.stringify(data));
      return;
    }

    // Regular fetch for other events
    fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      // Don't wait for response for non-critical analytics
      keepalive: true
    }).catch(err => {
      log('Error sending analytics', err);
    });
  };

  // Public API
  return {
    // Initialize the analytics module
    init: function(options = {}) {
      // Merge options with default config
      Object.assign(config, options);
      log('Analytics initialized', config);

      // Track page view on load
      this.trackPageView();

      // Track when user leaves page
      window.addEventListener('beforeunload', () => {
        this.trackEvent('page_exit');
      });

      // Track when page becomes hidden
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.trackEvent('page_hidden');
        } else if (document.visibilityState === 'visible') {
          this.trackEvent('page_visible');
        }
      });
    },

    // Track a page view
    trackPageView: function() {
      sendToServer('page_view', {
        title: document.title,
        path: window.location.pathname
      });
    },

    // Track a product view
    trackProductView: function(product) {
      sendToServer('product_view', product);
    },

    // Track adding to cart
    trackAddToCart: function(product, quantity = 1) {
      sendToServer('add_to_cart', {
        product,
        quantity
      });
    },

    // Track checkout process
    trackCheckout: function(order) {
      sendToServer('checkout', order);
    },

    // Track a purchase
    trackPurchase: function(order) {
      sendToServer('purchase', order);
    },

    // Track custom events
    trackEvent: function(eventName, eventData = {}) {
      sendToServer(eventName, eventData);
    }
  };
})();

// Initialize analytics when the page loads
document.addEventListener('DOMContentLoaded', () => {
  GraphicShopAnalytics.init({
    debug: window.location.hostname === 'localhost'
  });

  // Add event listeners for tracking product interactions
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const productId = card.dataset.productId;
      const productName = card.querySelector('.product-title').textContent;
      const productPrice = card.querySelector('.product-price').textContent.trim();
      const productCategory = card.querySelector('.product-category').textContent;

      GraphicShopAnalytics.trackProductView({
        id: productId,
        name: productName,
        price: productPrice,
        category: productCategory
      });
    });
  });

  // Track add to cart button clicks
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      const card = button.closest('.product-card');
      const productId = card.dataset.productId;
      const productName = card.querySelector('.product-title').textContent;
      const productPrice = card.querySelector('.product-price').textContent.trim();
      const productCategory = card.querySelector('.product-category').textContent;

      GraphicShopAnalytics.trackAddToCart({
        id: productId,
        name: productName,
        price: productPrice,
        category: productCategory
      });

      // Continue with add to cart functionality
    });
  });
});
