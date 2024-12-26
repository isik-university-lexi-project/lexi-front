import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../intercepts/axiosConfig';
import ApiDefaults from '../defaults/ApiDefaults';

const AddProductPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('stockCount', data.stockCount);
    formData.append('image', data.image[0]); // Resim dosyasını ekliyoruz

    try {
      await axiosInstance.post(`${ApiDefaults.BASE_URL}/product/`, formData);
      navigate('/product-list');
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-primary mb-4">Ürün Ekle</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700">Ürün İsmi</label>
          <input
            {...register('name', { required: 'Bu alan zorunludur' })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.name && <span className="text-red-500">{errors.name.message}</span>}
        </div>
        <div>
          <label className="block text-gray-700">Ürün Açıklaması</label>
          <textarea
            {...register('description', { required: 'Bu alan zorunludur' })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.description && <span className="text-red-500">{errors.description.message}</span>}
        </div>
        <div>
          <label className="block text-gray-700">Fiyat</label>
          <input
            type="number"
            {...register('price', { required: 'Bu alan zorunludur' })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.price && <span className="text-red-500">{errors.price.message}</span>}
        </div>
        <div>
          <label className="block text-gray-700">Stok Adedi</label>
          <input
            type="number"
            {...register('stockCount', { required: 'Bu alan zorunludur' })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.stockCount && <span className="text-red-500">{errors.stockCount.message}</span>}
        </div>
        <div>
          <label className="block text-gray-700">Ürün Resmi</label>
          <input
            type="file"
            {...register('image', { required: 'Bu alan zorunludur' })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.image && <span className="text-red-500">{errors.image.message}</span>}
        </div>
        <button type="submit" className="bg-purple-500 text-white p-2 rounded" disabled={loading}>
          {loading ? 'Yükleniyor...' : 'Ürün Ekle'}
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;