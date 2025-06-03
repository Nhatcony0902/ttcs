const API_DOMAIN="http://localhost:8081/";
export const createShop = async (shop) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_DOMAIN}/createShop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(shop),
  });
  return await res.text(); 
};
export const editShop = async (shop) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_DOMAIN}/editShop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(shop),
  });
  return await res.text();
};

export const deleteShop = async (shopId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_DOMAIN}/deleteShop/${shopId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.text();
};

export const createProduct = async (formData) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_DOMAIN}/createProduct`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData, // không cần headers ở đây, trình duyệt sẽ tự set đúng
  });
  return await res.text();
};