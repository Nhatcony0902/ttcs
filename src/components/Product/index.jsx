import React, { useEffect, useState } from 'react';

function Product () {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8081/home/findAll')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-2xl shadow-md p-4 hover:shadow-lg transition-all"
        >
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          <p className="text-sm text-gray-600 mb-1">{product.description}</p>
          <p className="text-md font-bold text-green-600 mb-1">${product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Category: {product.category}</p>
          <p className="text-sm text-gray-500">In stock: {product.quantity}</p>
          <p className="text-sm text-yellow-600">Rating: {product.rating}</p>

          {product.imageResponses && product.imageResponses.length > 0 && (
            <img
              src={product.imageResponses[0].url} // assuming there's a `url` field
              alt={product.name}
              className="mt-2 rounded-md object-cover h-40 w-full"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Product;
