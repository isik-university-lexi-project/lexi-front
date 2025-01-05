import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../intercepts/axiosConfig';
import ApiDefaults from '../defaults/ApiDefaults';
import { TrashIcon } from '@heroicons/react/outline';
import authStore from '../stores/authStore';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await axiosInstance.get(`${ApiDefaults.BASE_URL}/favorite/list/`);
            //   const userFavorites = response.data.filter(fav => fav.customer === authStore.userId);
            setFavorites(response.data);
            fetchProducts(response.data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const fetchProducts = async (favorites) => {
        try {
            const productRequests = favorites.map(fav => axiosInstance.get(`${ApiDefaults.BASE_URL}/product/${fav.product}/`));
            const productResponses = await Promise.all(productRequests);
            const productsData = productResponses.map(res => res.data);
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleRemoveFavorite = async (favoriteId) => {
        try {
            await axiosInstance.delete(`${ApiDefaults.BASE_URL}/favorite/${favoriteId}/`);
            fetchFavorites();
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-primary mb-4">My Favorite Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <Link to={`/product/${product.id}`}>
                            <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
                            <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                            <p className="text-gray-900 font-bold mb-2">{product.price} TL</p>
                        </Link>
                        <button onClick={() => handleRemoveFavorite(favorites.find(fav => fav.product === product.id).id)} className="text-red-500 hover:text-red-700 mt-2">
                            <TrashIcon className="w-5 h-5" />
                            Remove from Favorites
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoritesPage;