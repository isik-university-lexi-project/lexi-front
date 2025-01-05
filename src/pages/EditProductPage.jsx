import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../intercepts/axiosConfig';
import ApiDefaults from '../defaults/ApiDefaults';
import authStore from '../stores/authStore';

const EditProductPage = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`${ApiDefaults.BASE_URL}/product/${id}/`);
        setProduct(response.data);
        setValue('name', response.data.name);
        setValue('description', response.data.description);
        setValue('price', response.data.price);
        setValue('stockCount', response.data.stockCount);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchCartItems = async () => {
      try {

        //${authStore.userId}
        const response = await axiosInstance.get(`${ApiDefaults.BASE_URL}/cart/list/`);
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchProduct();
    fetchCartItems();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('stockCount', data.stockCount);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      await axiosInstance.patch(`${ApiDefaults.BASE_URL}/product/${id}/`, formData);
      navigate('/product-list');
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.product === productId);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-primary mb-4">Update Product</h1>
      {product && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700">Product Name</label>
            <input
              {...register('name', { required: 'This field is required' })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
          </div>
          <div>
            <label className="block text-gray-700">Product Description</label>
            <textarea
              {...register('description', { required: 'This field is required' })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.description && <span className="text-red-500">{errors.description.message}</span>}
          </div>
          <div>
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              {...register('price', { required: 'This field is required' })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.price && <span className="text-red-500">{errors.price.message}</span>}
          </div>
          <div>
            <label className="block text-gray-700">Stock Quantity</label>
            <input
              type="number"
              {...register('stockCount', { required: 'This field is required' })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.stockCount && <span className="text-red-500">{errors.stockCount.message}</span>}
          </div>
          <div>
            <label className="block text-gray-700">Product Image</label>
            <input
              type="file"
              {...register('image')}
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleImageChange}
            />
            {errors.image && <span className="text-red-500">{errors.image.message}</span>}
          </div>
          <div className="flex space-x-4">
            {product.image && (
              <div>
                <p>Current Image:</p>
                <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded" />
              </div>
            )}
            {selectedImage && (
              <div>
                <p>Selected Image:</p>
                <img src={URL.createObjectURL(selectedImage)} alt="Selected" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </div>
          {isInCart(product.id) && (
            <div className="text-green-500 font-bold">The product is already in your cart</div>
          )}
          <button type="submit" className="bg-purple-500 text-white p-2 rounded" disabled={loading}>
            {loading ? 'Loading...' : 'Update'}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditProductPage;


