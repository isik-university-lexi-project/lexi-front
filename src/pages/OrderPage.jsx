import React, { useState, useEffect } from 'react';
import axiosInstance from '../intercepts/axiosConfig';
import ApiDefaults from '../defaults/ApiDefaults';
import authStore from '../stores/authStore';
import StarRatingForOrder from '../components/StarRatingForOrder';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [feedbacks, setFeedbacks] = useState({});

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axiosInstance.get(`${ApiDefaults.BASE_URL}/order/list/`);
            // Siparişleri tarihe göre sıralıyoruz (en son oluşturulan en üstte olacak şekilde)
            const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
            fetchProducts(sortedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchProducts = async (orders) => {
        try {
            const productIds = orders.flatMap(order => order.items.map(item => item.product));
            const uniqueProductIds = [...new Set(productIds)];
            const productRequests = uniqueProductIds.map(id => axiosInstance.get(`${ApiDefaults.BASE_URL}/product/${id}/`));
            const productResponses = await Promise.all(productRequests);
            const productsData = productResponses.map(res => res.data);
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const getProductDetails = (productId) => {
        return products.find(product => product.id === productId);
    };

    const handleRatingChange = (productId, newRating) => {
        setFeedbacks(prevFeedbacks => ({
            ...prevFeedbacks,
            [productId]: {
                ...prevFeedbacks[productId],
                rating: newRating
            }
        }));
    };

    const handleCommentChange = (productId, event) => {
        const { value } = event.target;
        setFeedbacks(prevFeedbacks => ({
            ...prevFeedbacks,
            [productId]: {
                ...prevFeedbacks[productId],
                comment: value
            }
        }));
    };

    const handleSubmitFeedback = async (productId) => {
        const { rating, comment } = feedbacks[productId] || {};
        if (!rating || !comment) {
            alert('Please enter your rating and comment.');
            return;
        }

        try {
            await axiosInstance.post(`${ApiDefaults.BASE_URL}/product_feedback/`, {
                product: productId,
                rating,
                comment
            });
            alert('Thank you for your evaluation.');
            setFeedbacks(prevFeedbacks => ({
                ...prevFeedbacks,
                [productId]: {
                    rating: 0,
                    comment: ''
                }
            }));
            fetchOrders(); // Değerlendirme yapıldıktan sonra siparişleri yeniden çek
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('An error occurred while submitting the review.');
        }
    };

    const hasCustomerFeedback = (product) => {
        return product.feedbacks.some(feedback => feedback.customer === authStore.customerId);
    };

    const getCustomerFeedback = (product) => {
        return product.feedbacks.find(feedback => feedback.customer === authStore.customerId);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-primary mb-4">My Orders</h1>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-2">Order ID: {order.id}</h2>
                        <p className="text-gray-700 mb-2">State: {order.status}</p>
                        <p className="text-gray-700 mb-2">Total Amount: {order.totalPrice} TL</p>
                        <p className="text-gray-700 mb-2">Creation Date: {new Date(order.createdAt).toLocaleString()}</p>
                        <h3 className="text-lg font-bold mb-2">Products:</h3>
                        <ul className="list-disc list-inside">
                            {order.items.map((item) => {
                                const product = getProductDetails(item.product);
                                if (!product) {
                                    return (
                                        <li key={item.id} className="text-gray-700">Loading product information...</li>
                                    );
                                }
                                const feedback = feedbacks[product.id] || { rating: 0, comment: '' };
                                const customerFeedback = getCustomerFeedback(product);
                                return (
                                    <li key={item.id} className="flex items-center space-x-4">
                                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                                        <div>
                                            <p className="text-gray-700">{product.name}</p>
                                            <p className="text-gray-700">Number: {item.quantity}</p>
                                            <div className="mt-2">
                                                {hasCustomerFeedback(product) ? (
                                                    <div>
                                                        <p className="text-green-500 font-bold">Previously evaluated</p>
                                                        <StarRatingForOrder rating={customerFeedback.rating} onRatingChange={() => { }} />
                                                        <p className="text-gray-700 mt-2">{customerFeedback.comment}</p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="text-blue-500 font-bold">Evaluate:</p>
                                                        <StarRatingForOrder rating={feedback.rating} onRatingChange={(newRating) => handleRatingChange(product.id, newRating)} />
                                                        <textarea
                                                            value={feedback.comment}
                                                            onChange={(event) => handleCommentChange(product.id, event)}
                                                            className="w-full p-2 border border-gray-300 rounded mt-2"
                                                            placeholder="Write your comment"
                                                        />
                                                        <button
                                                            onClick={() => handleSubmitFeedback(product.id)}
                                                            className="bg-purple-500 text-white p-2 rounded mt-2"
                                                        >
                                                            Send
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderPage;
