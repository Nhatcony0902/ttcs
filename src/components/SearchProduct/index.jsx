import React, { useState } from "react";

const SearchProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [params, setParams] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    rating: "",
    shopAddress: "",
    shopName: "",
    shopRating: "",
    shopType: "",
  });

  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams({ ...params, [name]: value });
  };

  const buildQuery = (obj) => {
    const query = Object.entries(obj)
      .filter(([_, value]) => value !== "")
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    return query;
  };

  const handleSearch = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const queryString = buildQuery(params);
    try {
      const response = await fetch(`http://localhost:8081/home/find?${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setMessage(data.length > 0 ? "" : "Không tìm thấy sản phẩm.");
        setIsModalOpen(false);
      } else {
        const error = await response.text();
        setMessage("Lỗi: " + error);
      }
    } catch (err) {
      console.error(err);
      setMessage("Đã xảy ra lỗi khi tìm kiếm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          onClick={() => setIsModalOpen(true)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          readOnly
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Tìm kiếm nâng cao</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.keys(params).map((field) => (
                <div key={field} className="flex flex-col">
                  <label htmlFor={field} className="text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    id={field}
                    name={field}
                    value={params[field]}
                    onChange={handleChange}
                    placeholder={`Nhập ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Hủy
              </button>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tìm kiếm...
                  </span>
                ) : (
                  'Tìm kiếm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="mt-4 p-4 rounded-md bg-yellow-50">
          <p className="text-yellow-800">{message}</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {product.imageResponses && product.imageResponses.length > 0 && (
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={product.imageResponses[0].url}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                
                <div className="space-y-2">
                  <p className="text-lg font-bold text-green-600">${product.price}</p>
                  <p className="text-sm text-gray-500">Loại: {product.category}</p>
                  <p className="text-sm text-gray-500">Số lượng: {product.quantity}</p>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Đánh giá:</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating ?? 0)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm text-gray-500">
                        {product.rating ? product.rating.toFixed(1) : "Chưa có"}
                      </span>
                    </div>
                  </div>
                </div>

                {product.ratingResponses && product.ratingResponses.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Đánh giá chi tiết:</h4>
                    <div className="space-y-2">
                      {product.ratingResponses.map((rate, i) => (
                        <div key={i} className="text-sm text-gray-600">
                          <div className="flex items-center mb-1">
                            {[...Array(5)].map((_, j) => (
                              <svg
                                key={j}
                                className={`w-3 h-3 ${
                                  j < rate.score ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-gray-500">{rate.comment || "Không có bình luận"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProduct;
