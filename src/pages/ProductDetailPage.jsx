import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../intercepts/axiosConfig';
import ApiDefaults from '../defaults/ApiDefaults';
import StarRating from '../components/StarRating';
import authStore from '../stores/authStore';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchProduct();
    fetchCartItems();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axiosInstance.get(`${ApiDefaults.BASE_URL}/product/${id}/`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await axiosInstance.get(`${ApiDefaults.BASE_URL}/cart/list/`);
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      await axiosInstance.post(`${ApiDefaults.BASE_URL}/cart/`, { product: productId, quantity });
      fetchCartItems();
      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.product === productId);
  };

  const calculateAverageRating = (feedbacks) => {
    if (feedbacks.length === 0) return 0;
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    return (totalRating / feedbacks.length).toFixed(1);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-primary mb-4">{product.name}</h1>
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover mb-4 rounded" />
      <p className="text-gray-900 font-bold text-xl mb-4">{product.price} TL</p>
      <p className="text-gray-600 mb-4">Stock: {product.stockCount}</p>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <div className="flex items-center mb-4">
        <StarRating rating={calculateAverageRating(product.feedbacks)} />
        <span className="ml-2 text-gray-600">{calculateAverageRating(product.feedbacks)}</span>
      </div>
      {isInCart(product.id) ? (
        <span className="text-green-500 font-bold mb-4">The product is already in your cart</span>
      ) : (
        <button onClick={() => addToCart(product.id, 1)} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mb-4">
          Add to Cart
        </button>
      )}
      <h2 className="text-xl font-bold text-primary mb-4">Comments</h2>
      {product.feedbacks.length > 0 ? (
        product.feedbacks.map((feedback) => (
          <div key={feedback.id} className="mb-4">
            <div className="flex items-center">
              <StarRating rating={feedback.rating} />
              <span className="ml-2 text-gray-600">{feedback.comment}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No comments yet.</p>
      )}
    </div>
  );
};

export default ProductDetailPage;