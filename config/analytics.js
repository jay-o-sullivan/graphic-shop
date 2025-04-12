/**
 * Analytics configuration for GraphicShop
 *
 * Integrates Google Analytics, Facebook Pixel, and custom event tracking
 */

// Helper function to track events safely
const trackEvent = (eventName, eventData = {}) => {
  try {
    // Google Analytics
    if (typeof gtag === 'function') {
      gtag('event', eventName, eventData);
    }

    // Facebook Pixel
    if (typeof fbq === 'function') {
      fbq('track', eventName, eventData);
    }

    // Custom analytics (e.g., server-side tracking)
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event: eventName,
        data: eventData,
        url: window.location.href,
        timestamp: new Date().toISOString()
      }),
      // Use beacon API for exit events to ensure the request completes
      keepalive: true
    }).catch(() => {
      // Silent fail - don't affect user experience if analytics fails
    });
  } catch (error) {
    // Silent fail in production, log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Analytics error:', error);
    }
  }
};

// Export analytics methods
module.exports = {
  // Page view tracking
  trackPageView: (pageTitle, pageUrl) => {
    trackEvent('page_view', {
      page_title: pageTitle,
      page_location: pageUrl
    });
  },

  // E-commerce tracking
  trackProductView: (product) => {
    trackEvent('view_item', {
      items: [{
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price
      }]
    });
  },

  trackAddToCart: (product, quantity = 1) => {
    trackEvent('add_to_cart', {
      items: [{
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity
      }]
    });
  },

  trackCheckout: (order) => {
    trackEvent('begin_checkout', {
      value: order.total,
      items: order.items.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        quantity: item.quantity
      }))
    });
  },

  trackPurchase: (order) => {
    trackEvent('purchase', {
      transaction_id: order.id,
      value: order.total,
      currency: 'USD',
      tax: order.tax,
      shipping: order.shipping,
      items: order.items.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        quantity: item.quantity
      }))
    });
  },

  // Marketing tracking
  trackLead: (source, details = {}) => {
    trackEvent('generate_lead', {
      source,
      ...details
    });
  },

  // Custom event tracking
  trackCustomEvent: (eventName, eventData) => {
    trackEvent(eventName, eventData);
  }
};
