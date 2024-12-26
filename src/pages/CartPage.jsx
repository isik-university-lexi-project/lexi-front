import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../intercepts/axiosConfig';
import ApiDefaults from '../defaults/ApiDefaults';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/outline';
import authStore from '../stores/authStore';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
    fetchAddresses();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axiosInstance.get(`${ApiDefaults.BASE_URL}/cart/list/`);
      setCartItems(response.data);
      fetchProducts(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const fetchProducts = async (cartItems) => {
    try {
      const productRequests = cartItems.map(item => axiosInstance.get(`${ApiDefaults.BASE_URL}/product/${item.product}/`));
      const productResponses = await Promise.all(productRequests);
      const productsData = productResponses.map(res => res.data);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get(`${ApiDefaults.BASE_URL}/shipping_address/list/`);
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    try {
      await axiosInstance.patch(`${ApiDefaults.BASE_URL}/cart/${cartItemId}/`, { quantity });
      fetchCartItems();
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const handleRemoveCartItem = async (cartItemId) => {
    try {
      await axiosInstance.delete(`${ApiDefaults.BASE_URL}/cart/${cartItemId}/`);
      fetchCartItems();
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Lütfen bir adres seçin.');
      return;
    }

    const cartItemIds = cartItems.map(item => item.id);

    try {
      await axiosInstance.post(`${ApiDefaults.BASE_URL}/order/from_cart/`, {
        shippingAddress: selectedAddress,
        cartItems: cartItemIds
      });
      alert('Sipariş başarıyla oluşturuldu.');
      navigate('/orders'); // Siparişler sayfasına yönlendirme
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Sipariş oluşturulurken bir hata oluştu.');
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.product);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-primary mb-4">Sepetim</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {cartItems.map((item) => {
            const product = products.find(p => p.id === item.product);
            return product ? (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded mr-4" />
                <div className="flex-grow">
                  <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                  <p className="text-gray-900 font-bold mb-2">{product.price} TL</p>
                  <div className="flex items-center">
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-gray-700">
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      readOnly
                      className="w-16 text-center mx-2 p-2 border border-gray-300 rounded"
                    />
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-gray-700">
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <button onClick={() => handleRemoveCartItem(item.id)} className="text-red-500 hover:text-red-700 ml-4">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ) : null;
          })}
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">Adres Seçimi</h2>
          {addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold">{address.address}</p>
                    <p className="text-gray-700">{address.city}, {address.state}, {address.zipcode}</p>
                    <p className="text-gray-700">{address.telephone}</p>
                  </div>
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={address.id}
                    onChange={() => setSelectedAddress(address.id)}
                    className="ml-4"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700">Adres bulunamadı. <Link to="/addresses" className="text-blue-500">Adres ekleyin</Link>.</p>
          )}
          <div className="mt-4">
            <h3 className="text-lg font-bold text-primary mb-2">Toplam Tutar: {calculateTotalPrice()} TL</h3>
            <button onClick={handlePlaceOrder} className="bg-purple-500 text-white p-3 text-lg rounded mt-4">
              Sipariş Ver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;