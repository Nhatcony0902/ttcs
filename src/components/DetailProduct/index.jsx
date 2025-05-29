import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AddToCart from '../AddtoCart';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [shop, setShop] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [trigger, setTrigger] = useState(0);
  const [followTrigger, setFollowTrigger] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`http://localhost:8081/home/infoToken?token=${token}`)
        .then(res => res.json())
        .then(data => setUserId(data.id))
        .catch(err => console.error("Lỗi lấy user info", err));
    }
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8081/home/product?id=${productId}`)
      .then(res => res.json())
      .then(productData => {
        setProduct(productData);
        setRatings(productData.ratingResponses || []);
        setLoading(false);

        if (productData.shopId) {
          fetch(`http://localhost:8081/home/infoShop?shopId=${productData.shopId}`)
            .then(res => res.json())
            .then(setShop)
            .catch(err => console.error("Lỗi lấy shop", err));
        }
      })
      .catch(err => {
        console.error("Lỗi lấy product", err);
        setLoading(false);
      });
  }, [productId, trigger]);
  console.log(product);
  useEffect(() => {
    if (userId && shop?.id) {
      fetch(`http://localhost:8081/customer/getAllFollowedShops?userId=${userId}`)
        .then(res => res.json())
        .then(followedShops => {
          const isFollowed = followedShops.some(s => s.id === shop.id);
          setIsFollowing(isFollowed);
        })
        .catch(err => console.error("Lỗi kiểm tra follow", err));
    }
  }, [userId, shop, followTrigger]);

  useEffect(() => {
    if (product?.shopId) {
      fetch(`http://localhost:8081/home/infoShop?shopId=${product.shopId}`)
        .then(res => res.json())
        .then(setShop)
        .catch(err => console.error("Lỗi lấy shop", err));
    }
  }, [product?.shopId, followTrigger]);

  const handleFollow = () => {
    fetch(`http://localhost:8081/customer/follow?userId=${userId}&shopId=${shop.id}`)
      .then(res => res.text())
      .then(() => {
        setIsFollowing(true);
        setFollowTrigger(prev => prev + 1);
      })
      .catch(err => console.error("Lỗi follow", err));
  };

  const handleUnfollow = () => {
    fetch(`http://localhost:8081/customer/unfollow?userId=${userId}&shopId=${shop.id}`)
      .then(res => res.text())
      .then(() => {
        setIsFollowing(false);
        setFollowTrigger(prev => prev + 1);
      })
      .catch(err => console.error("Lỗi unfollow", err));
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Link
          to="/"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại
        </Link>
      </div>
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Image Gallery */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
            {product.imageResponses?.length > 0 ? (
              <img
                src={product.imageResponses[selectedImage].url}
                alt={product.name}
                className="w-full h-full object-center object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          
          {product.imageResponses?.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.imageResponses.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative rounded-lg overflow-hidden ${
                    selectedImage === idx ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} - ${idx + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
          
          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 space-y-6">
              <p>{product.description}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
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
                <span className="ml-2 text-sm text-gray-500">
                  {product.rating ? product.rating.toFixed(1) : "Chưa có đánh giá"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Category:</span>
              <span className="text-sm font-medium text-gray-900">{product.category}</span>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-gray-500">Stock:</span>
              <span className="text-sm font-medium text-gray-900">{product.quantity} units</span>
            </div>
          </div>

          <div className="mt-8">
            <AddToCart productId={product.productId} onAddToCart={() => setTrigger(prev => prev + 1)} />
          </div>

          <div className="mt-8">
            <Link
              to="/rating"
              state={{ productId: productId }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Viết đánh giá
            </Link>
          </div>
        </div>
      </div>

      {/* Shop Info */}
      {shop && (
        <div className="mt-16 border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{shop.name}</h2>
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(shop.rating ?? 0)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {shop.rating ? shop.rating.toFixed(1) : "Chưa có đánh giá"}
                  </span>
                </div>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-gray-500">{shop.followers} followers</span>
              </div>
            </div>
            {userId && (
              <button
                onClick={isFollowing ? handleUnfollow : handleFollow}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isFollowing
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Type: {shop.type}</p>
          </div>
        </div>
      )}

      {/* Ratings Section */}
      <div className="mt-16 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá sản phẩm</h2>
        {ratings.length === 0 ? (
          <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
        ) : (
          <div className="space-y-6">
            {ratings.map(rating => (
              <div key={rating.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={rating.userRatingResponse.url}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {rating.userRatingResponse.username}
                    </p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{rating.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
