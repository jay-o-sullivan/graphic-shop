document.addEventListener('DOMContentLoaded', () => {
  const designTypeSelect = document.getElementById('designType');
  const sizeSelect = document.getElementById('size');
  const priceDisplay = document.getElementById('priceDisplay');
  const quoteForm = document.getElementById('quoteForm');

  // Function to update price
  const updatePrice = async () => {
    const designType = designTypeSelect.value;
    const size = sizeSelect.value;

    if (!designType || !size) {
      priceDisplay.textContent = '$0.00';
      return;
    }

    try {
      const response = await fetch('/orders/calculate-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ designType, size })
      });

      const data = await response.json();

      if (data.price) {
        priceDisplay.textContent = `$${data.price.toFixed(2)}`;
      }
    } catch (err) {
      console.error('Error calculating price:', err);
    }
  };

  // Add event listeners
  designTypeSelect.addEventListener('change', updatePrice);
  sizeSelect.addEventListener('change', updatePrice);

  // If there's a form for submitting the order
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const description = document.getElementById('description').value;
      const additionalRequirements = document.getElementById('additionalRequirements').value;

      try {
        const response = await fetch('/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            designType: designTypeSelect.value,
            size: sizeSelect.value,
            description,
            additionalRequirements
          })
        });

        const data = await response.json();

        if (data.order && data.clientSecret) {
          // Redirect to payment page with the client secret
          window.location.href = `/orders/payment/${data.order.id}?secret=${data.clientSecret}`;
        }
      } catch (err) {
        console.error('Error creating order:', err);
      }
    });
  }
});
