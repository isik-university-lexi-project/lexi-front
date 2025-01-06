import React, { useState, useEffect } from 'react';
import axiosInstance from '../intercepts/axiosConfig';
import ApiDefaults from '../defaults/ApiDefaults';
import authStore from '../stores/authStore';
import 'react-confirm-alert/src/react-confirm-alert.css';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFeedbacks();
    fetchProducts();
  }, []);

  const fetchProducts = async (query = '') => {
    try {
      const response = await axiosInstance.get(
        `${ApiDefaults.BASE_URL}/product/list/?seller__id=${authStore.sellerId}&search=${query}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`${ApiDefaults.BASE_URL}/product_feedback/list/`);
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError('Could not fetch feedbacks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAverageRating = (productId) => {
    const productFeedbacks = feedbacks.filter((feedback) => feedback.product === productId);
    if (productFeedbacks.length === 0) return 0;

    const totalRating = productFeedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    return (totalRating / productFeedbacks.length).toFixed(1);
  };

  const getProductImage = (productId) => {
    const product = products.find((product) => product.id === productId);
    return product ? product.image : null;
  };

  const uniqueProducts = Array.from(
    new Set(feedbacks.map((feedback) => feedback.product))
  );

  const productFeedbackData = uniqueProducts.map((productId) => ({
    productId,
    feedbacks: feedbacks.filter((feedback) => feedback.product === productId),
    averageRating: calculateAverageRating(productId),
    image: getProductImage(productId),
  }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-primary mb-4">Feedback Overview</h1>
      {isLoading ? (
        <p>Loading feedbacks...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-8 border-b text-center">Product Image</th>
                <th className="py-2 px-8 border-b text-center">Average Rating</th>
                <th className="py-2 px-8 border-b text-left">Feedback Details</th>
              </tr>
            </thead>

            <tbody>
              {productFeedbackData.map(({ productId, feedbacks, averageRating, image }) => (
                <tr key={productId}>
                  <td className="py-2 px-4 border-b text-center">
                    <img
                      src={image}
                      alt={`Product ${productId}`}
                      className="w-16 h-16 object-cover rounded mx-auto"
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-center">{averageRating}</td>
                  <td className="py-2 px-4 border-b text-left">
                    <ul className="text-left">
                      {feedbacks.map((feedback) => (
                        <li key={feedback.id} className="mb-2">
                          <span className="block text-sm font-medium text-gray-900">
                            Rating: {feedback.rating}
                          </span>
                          <span className="block text-sm italic text-gray-600">
                            {feedback.comment}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
