export const fetchCheckout = async (orderData) => {
  const response = await fetch('http://localhost/pet-adopt-app/public/api/checkout', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
  });
  
  return response; // Trả về đối tượng phản hồi
};
export const fetchCheckoutVNPAY = async (orderData) => {
  const response = await fetch('http://localhost/pet-adopt-app/public/api/checkout-vnpay', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
  });
  
  return response; // Trả về đối tượng phản hồi
};
