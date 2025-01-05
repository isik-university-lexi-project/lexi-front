import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, InformationCircleIcon, LoginIcon, LogoutIcon, HeartIcon, ShoppingCartIcon, ViewListIcon, PlusCircleIcon, LocationMarkerIcon, ClipboardListIcon } from '@heroicons/react/outline';
import axiosInstance from '../intercepts/axiosConfig';
import ApiDefaults from '../defaults/ApiDefaults';
import authStore from '../stores/authStore';
import { a } from 'react-spring';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      if (authStore.role == "customer") {
        const response = await axiosInstance.get(`${ApiDefaults.BASE_URL}/cart/list/`);
        setCartItemCount(response.data.length);
      }

    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleLogout = () => {
    authStore.logout();
    window.location.reload(); // Sayfayı yenileyerek kullanıcı çıkış yaptıktan sonra güncelleme
  };

  return (
    <nav className="bg-purple-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Lexi</div>
        <div className="hidden md:flex space-x-4">
          {authStore.isLoggedIn && authStore.role === "customer" && (
            <>
              <Link to="/" className="text-white flex items-center">
                <HomeIcon className="w-5 h-5 mr-1" />
                Shop
              </Link>
              <Link to="/favorites" className="text-white flex items-center">
                <HeartIcon className="w-5 h-5 mr-1" />
                My Favorites
              </Link>
              <Link to="/cart" className="text-white flex items-center relative">
                <ShoppingCartIcon className="w-5 h-5 mr-1" />
                My Cart
                {cartItemCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <Link to="/addresses" className="text-white flex items-center">
                <LocationMarkerIcon className="w-5 h-5 mr-1" />
                My Addresses
              </Link>
              <Link to="/orders" className="text-white flex items-center">
                <ClipboardListIcon className="w-5 h-5 mr-1" />
                My Orders
              </Link>
            </>
          )}
          {authStore.isLoggedIn && authStore.role === "seller" && (
            <>
              <Link to="/product-list" className="text-white flex items-center">
                <ViewListIcon className="w-5 h-5 mr-1" />
                My Products
              </Link>
              <Link to="/add-product" className="text-white flex items-center">
                <PlusCircleIcon className="w-5 h-5 mr-1" />
                Add New Product
              </Link>
              <Link to="/seller-orders" className="text-white flex items-center">
                <ClipboardListIcon className="w-5 h-5 mr-1" />
                Seller Orders
              </Link>
            </>
          )}
          {authStore.isLoggedIn ? (
            <button onClick={handleLogout} className="text-white flex items-center">
              <LogoutIcon className="w-5 h-5 mr-1" />
              Log Out
            </button>
          ) : (
            <Link to="/login" className="text-white flex items-center">
              <LoginIcon className="w-5 h-5 mr-1" />
              Login
            </Link>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          {authStore.isLoggedIn && authStore.role === "customer" && (
            <>
              <Link to="/" className="block px-4 py-2 text-white flex items-center">
                <HomeIcon className="w-5 h-5 mr-1" />
                Shop
              </Link>
              <Link to="/about" className="block px-4 py-2 text-white flex items-center">
                <InformationCircleIcon className="w-5 h-5 mr-1" />
                About Us
              </Link>
              <Link to="/favorites" className="block px-4 py-2 text-white flex items-center">
                <HeartIcon className="w-5 h-5 mr-1" />
                My Favorites
              </Link>
              <Link to="/cart" className="block px-4 py-2 text-white flex items-center relative">
                <ShoppingCartIcon className="w-5 h-5 mr-1" />
                My Cart
                {cartItemCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <Link to="/addresses" className="block px-4 py-2 text-white flex items-center">
                <LocationMarkerIcon className="w-5 h-5 mr-1" />
                My Addresses
              </Link>
              <Link to="/orders" className="block px-4 py-2 text-white flex items-center">
                <ClipboardListIcon className="w-5 h-5 mr-1" />
                My Orders
              </Link>
            </>
          )}
          {authStore.isLoggedIn && authStore.role === "seller" && (
            <>
              <Link to="/product-list" className="block px-4 py-2 text-white flex items-center">
                <ViewListIcon className="w-5 h-5 mr-1" />
                My Products
              </Link>
              <Link to="/add-product" className="block px-4 py-2 text-white flex items-center">
                <PlusCircleIcon className="w-5 h-5 mr-1" />
                Add New Product
              </Link>
              <Link to="/seller-orders" className="block px-4 py-2 text-white flex items-center">
                <ClipboardListIcon className="w-5 h-5 mr-1" />
                Seller Orders
              </Link>
            </>
          )}
          {authStore.isLoggedIn ? (
            <button onClick={handleLogout} className="block px-4 py-2 text-white flex items-center">
              <LogoutIcon className="w-5 h-5 mr-1" />
              Log Out
            </button>
          ) : (
            <Link to="/login" className="block px-4 py-2 text-white flex items-center">
              <LoginIcon className="w-5 h-5 mr-1" />
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;