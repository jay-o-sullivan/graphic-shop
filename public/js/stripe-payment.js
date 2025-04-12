document.addEventListener('DOMContentLoaded', async () => {
  const stripe = Stripe(STRIPE_PUBLIC_KEY);
  const elements = stripe.elements();

  // Create card element
  const cardElement = elements.create('card');
  cardElement.mount('#card-element');

  // Handle form submission
  const form = document.getElementById('payment-form');
  const orderId = form.dataset.orderId;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Disable the submit button to prevent multiple clicks
    document.getElementById('submit-button').disabled = true;

    try {
      // Create payment intent on the server
      const response = await fetch('/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: document.getElementById('name').value
          }
        }
      });

      if (result.error) {
        // Show error to your customer
        showError(result.error.message);
      } else {
        // Payment succeeded
        window.location.href = `/orders/${orderId}/success`;
      }
    } catch (error) {
      console.error('Payment error:', error);
      showError('An unexpected error occurred. Please try again.');
    }

    document.getElementById('submit-button').disabled = false;
  });

  function showError(message) {
    const errorElement = document.getElementById('card-errors');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
});
