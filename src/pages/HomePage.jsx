import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../intercepts/axiosConfig';
import ApiDefaults from '../defaults/ApiDefaults';
import StarRating from '../components/StarRating';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/solid';
import authStore from '../stores/authStore';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
    fetchCartItems();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(`${ApiDefaults.BASE_URL}/product/list/`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axiosInstance.get(`${ApiDefaults.BASE_URL}/favorite/list/`);
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchCartItems = async () => {
    //${authStore.userId}
    try {
      const response = await axiosInstance.get(`${ApiDefaults.BASE_URL}/cart/list/`);
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const toggleFavorite = async (productId) => {
    const isFavorite = favorites.some(fav => fav.product === productId);
    try {
      if (isFavorite) {
        const favorite = favorites.find(fav => fav.product === productId);
        await axiosInstance.delete(`${ApiDefaults.BASE_URL}/favorite/${favorite.id}/`);
      } else {
        await axiosInstance.post(`${ApiDefaults.BASE_URL}/favorite/`, { product: productId });
      }
      fetchFavorites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(fav => fav.product === productId);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.product === productId);
  };

  const addToCart = async (productId, quantity, stockCount) => {
    if (stockCount <= 0) { // Stok kontrolü
      alert('This product is out of stock!');
      return; // Stokta yoksa ekleme işlemini durdur
    }

    try {
      await axiosInstance.post(`${ApiDefaults.BASE_URL}/cart/`, { product: productId, quantity });
      fetchCartItems();
      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const calculateAverageRating = (feedbacks) => {
    if (feedbacks.length === 0) return 0;
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    return (totalRating / feedbacks.length).toFixed(1);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-primary mb-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
       
       {products.map((product) => (

          <div key={product.id} className="bg-white p-4 rounded-lg  hover:shadow-lg transition-shadow duration-300">
            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
              <h2 className="text-xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-900 font-bold mb-2">{product.price} TL</p>
              <p className="text-gray-600">Stock: {product.stockCount}</p>
              <p className="text-gray-600">Number of Comments: {product.feedbacks.length}</p>
              <div className="flex items-center">
                <StarRating rating={calculateAverageRating(product.feedbacks)} />
                <span className="ml-2 text-gray-600">{calculateAverageRating(product.feedbacks)}</span>
              </div>
            </Link>
            <div className="mt-4 flex justify-between items-center">
            {product.stockCount <= 0 ? (
                <span className="text-red-500 font-bold">Out-Of-Stock</span>
              ) : isInCart(product.id) ? (
                <span className="text-green-500 font-bold">The product is already in your cart</span>
              ) : (
                <button onClick={() => addToCart(product.id, product.stockCount)} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Add to Cart</button>
              )}

              <button onClick={() => toggleFavorite(product.id)} className={`text-${isFavorite(product.id) ? 'red' : 'gray'}-500 hover:text-${isFavorite(product.id) ? 'red' : 'gray'}-700`}>
                {isFavorite(product.id) ? <HeartSolidIcon className="w-6 h-6" /> : <HeartOutlineIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;