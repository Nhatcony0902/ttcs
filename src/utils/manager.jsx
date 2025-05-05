const API_DOMAIN="http://localhost:8081/";
export const createShop = async (shop) => {
  const res = await fetch(`${API_DOMAIN}/createShop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shop),
  });
  return await res.text(); 
};
export const editShop = async (shop) => {
  const res = await fetch(`${API_DOMAIN}/editShop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shop),
  });
  return await res.text();
};

export const deleteShop = async (shopId) => {
  const res = await fetch(`${API_DOMAIN}/deleteShop/${shopId}`, {
    method: 'DELETE',
  });
  return await res.text();
};

export const createProduct = async (formData) => {
  const res = await fetch(`${API_DOMAIN}/createProduct`, {
    method: 'POST',
    body: formData, // không cần headers ở đây, trình duyệt sẽ tự set đúng
  });
  return await res.text();
};