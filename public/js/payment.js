document.addEventListener('DOMContentLoaded', () => {
  // Get query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('order');
  const clientSecret = urlParams.get('secret');

  if (!orderId || !clientSecret) {
    document.getElementById('paymentError').textContent = 'Missing order information';
    return;
  }

  // Initialize Stripe
  const stripe = Stripe(stripePublicKey); // This variable should be set in your HTML
  const elements = stripe.elements();

  // Create card element
  const cardElement = elements.create('card', {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  });

  cardElement.mount('#card-element');

  // Handle form submission
  const paymentForm = document.getElementById('payment-form');
  const paymentButton = document.getElementById('paymentButton');
  const paymentError = document.getElementById('paymentError');

  paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable the button to prevent multiple clicks
    paymentButton.disabled = true;
    paymentButton.textContent = 'Processing...';

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: document.getElementById('nameOnCard').value
          }
        }
      });

      if (result.error) {
        // Show error to customer
        paymentError.textContent = result.error.message;
        paymentButton.disabled = false;
        paymentButton.textContent = 'Pay Now';
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // Payment successful, confirm with our server
          const confirmResponse = await fetch('/orders/confirm-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              orderId,
              paymentId: result.paymentIntent.id
            })
          });

          const confirmData = await confirmResponse.json();

          if (confirmData.order) {
            // Redirect to success page
            window.location.href = `/payment-success.html?order=${orderId}`;
          }
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      paymentError.textContent = 'An unexpected error occurred. Please try again.';
      paymentButton.disabled = false;
      paymentButton.textContent = 'Pay Now';
    }
  });
});
