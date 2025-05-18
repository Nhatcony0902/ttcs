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
      setRatings(productData.ratingResponses || []); // <-- lấy ratings
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
}, [productId]);


  // Kiểm tra xem user có đang follow shop không
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
  }, [userId, shop]);

  const handleFollow = () => {
    fetch(`http://localhost:8081/customer/follow?userId=${userId}&shopId=${shop.id}`)
      .then(res => res.text())
      .then(() => setIsFollowing(true))
      .catch(err => console.error("Lỗi follow", err));
  };

  const handleUnfollow = () => {
    fetch(`http://localhost:8081/customer/unfollow?userId=${userId}&shopId=${shop.id}`)
      .then(res => res.text())
      .then(() => setIsFollowing(false))
      .catch(err => console.error("Lỗi unfollow", err));
  };

  if (loading || !product) return <p>Loading product details...</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="mb-2">{product.description}</p>
      <p className="text-green-700 font-semibold">Price: ${product.price.toFixed(2)}</p>
      <p>Category: {product.category}</p>
      <p>Stock: {product.quantity}</p>
      <p>Rating: {product.rating}</p>

      {product.imageResponses?.length > 0 && (
        <div className="my-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {product.imageResponses.map((img, idx) => (
            <img key={idx} src={img.url} alt={`product-${idx}`} className="h-40 w-full object-cover rounded" />
          ))}
        </div>
      )}
      <AddToCart productId={product.productId} />
      <Link to="/rating" state={{ productId: productId }}>
            Viết đánh giá
          </Link>
      {shop && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Shop Info</h2>
          <p><strong>Name:</strong> {shop.name}</p>
          <p><strong>Type:</strong> {shop.type}</p>
          <p><strong>Rating:</strong> {shop.rating}</p>
          <p><strong>Followers:</strong> {shop.followers}</p>

          <div className="mt-3">
            {isFollowing ? (
              <button onClick={handleUnfollow} className="bg-red-500 text-white px-4 py-1 rounded">
                Unfollow
              </button>
            ) : (
              <button onClick={handleFollow} className="bg-blue-500 text-white px-4 py-1 rounded">
                Follow
              </button>
            )}
          </div>
          
        </div>
      )}
      <div className="mt-6 border-t pt-4">
  <h2 className="text-xl font-semibold mb-2">Đánh giá sản phẩm</h2>
  {ratings.length === 0 ? (
    <p>Chưa có đánh giá nào cho sản phẩm này.</p>
  ) : (
    <div className="space-y-4">
      {ratings.map(rating => (
        <div key={rating.id} className="p-4 border rounded shadow">
          <div className="flex items-center mb-2">
            <img
              src={rating.userRatingResponse.url}
              alt="avatar"
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <div>
              <p className="font-semibold">{rating.userRatingResponse.username}</p>
              <p className="text-yellow-500">Đánh giá: {rating.rating} ⭐</p>
            </div>
          </div>
          <p>{rating.content}</p>
        </div>
      ))}
    </div>
  )}
</div>

    </div>
  );
}

export default ProductDetail;
