import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../intercepts/axiosConfig';
import ApiDefaults from '../defaults/ApiDefaults';
import { PencilIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/outline';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import authStore from '../stores/authStore';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (query = '') => {
    try {
      //seller__id=${authStore.userId}&
      const response = await axiosInstance.get(`${ApiDefaults.BASE_URL}/product/list/?seller__id=${authStore.sellerId}&search=${query}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${ApiDefaults.BASE_URL}/product/${id}/`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: 'Deletion Process',
      message: 'Are you sure you want to delete this product?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDelete(id)
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-primary mb-4">Product Listing</h1>
      <div className="mb-4 flex">
        <form onSubmit={handleSearch} className="flex-grow flex">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="p-2 border border-gray-300 rounded-l-lg flex-grow"
          />
          <button type="submit" className="bg-purple-600 text-white p-2 rounded-r-lg">
            Search
          </button>
        </form>
        <Link to="/add-product" className="bg-purple-500 text-white p-2 rounded ml-4 inline-flex items-center">
          <PlusCircleIcon className="w-5 h-5 mr-1" />
          Add Product
        </Link>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-center">Image</th>
            <th className="py-2 px-4 border-b text-center">Product Name</th>
            <th className="py-2 px-4 border-b text-center">Price</th>
            <th className="py-2 px-4 border-b text-center">Stock</th>
            <th className="py-2 px-4 border-b text-center">Average Rating</th>
            <th className="py-2 px-4 border-b text-center">Editing</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="py-2 px-4 border-b text-center">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded mx-auto" />
              </td>
              <td className="py-2 px-4 border-b text-center">{product.name}</td>
              <td className="py-2 px-4 border-b text-center">{product.price} TL</td>
              <td className="py-2 px-4 border-b text-center">{product.stockCount}</td>
              <td className="py-2 px-4 border-b text-center">{calculateAverageRating(product.feedbacks)}</td>
              
              <td className="py-2 px-4 border-b text-center">
                <div className="flex justify-center space-x-2">
                  <Link to={`/edit-product/${product.id}`} className="text-blue-500 hover:text-blue-700">
                    <PencilIcon className="w-5 h-5" />
                  </Link>
                  <button onClick={() => confirmDelete(product.id)} className="text-red-500 hover:text-red-700">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const calculateAverageRating = (feedbacks) => {
  if (feedbacks.length === 0) return 0;
  const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
  return (totalRating / feedbacks.length).toFixed(1);
};

export default ProductListPage;