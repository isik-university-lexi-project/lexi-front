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
            setOrders(response.data);
            fetchProducts(response.data);
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
            alert('Lütfen değerlendirme ve yorum girin.');
            return;
        }

        try {
            await axiosInstance.post(`${ApiDefaults.BASE_URL}/product_feedback/`, {
                product: productId,
                rating,
                comment
            });
            alert('Değerlendirmeniz için teşekkür ederiz.');
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
            alert('Değerlendirme gönderilirken bir hata oluştu.');
        }
    };

    const hasCustomerFeedback = (product) => {

        console.log("feedback", product.feedbacks)
        console.log("authStore.userId", authStore.userId)
        return product.feedbacks.some(feedback => feedback.customer === authStore.customerId);
    };

    const getCustomerFeedback = (product) => {
        return product.feedbacks.find(feedback => feedback.customer === authStore.customerId);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-primary mb-4">Siparişlerim</h1>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-2">Sipariş ID: {order.id}</h2>
                        <p className="text-gray-700 mb-2">Durum: {order.status}</p>
                        <p className="text-gray-700 mb-2">Toplam Tutar: {order.totalPrice} TL</p>
                        <p className="text-gray-700 mb-2">Oluşturulma Tarihi: {new Date(order.createdAt).toLocaleString()}</p>
                        <h3 className="text-lg font-bold mb-2">Ürünler:</h3>
                        <ul className="list-disc list-inside">
                            {order.items.map((item) => {
                                const product = getProductDetails(item.product);
                                if (!product) {
                                    return (
                                        <li key={item.id} className="text-gray-700">Ürün bilgisi yükleniyor...</li>
                                    );
                                }
                                const feedback = feedbacks[product.id] || { rating: 0, comment: '' };
                                const customerFeedback = getCustomerFeedback(product);
                                return (
                                    <li key={item.id} className="flex items-center space-x-4">
                                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                                        <div>
                                            <p className="text-gray-700">{product.name}</p>
                                            <p className="text-gray-700">Adet: {item.quantity}</p>
                                            <div className="mt-2">
                                                {hasCustomerFeedback(product) ? (
                                                    <div>
                                                        <p className="text-green-500 font-bold">Daha önce değerlendirme yapılmış</p>
                                                        <StarRatingForOrder rating={customerFeedback.rating} onRatingChange={() => { }} />
                                                        <p className="text-gray-700 mt-2">{customerFeedback.comment}</p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="text-blue-500 font-bold">Değerlendir:</p>
                                                        <StarRatingForOrder rating={feedback.rating} onRatingChange={(newRating) => handleRatingChange(product.id, newRating)} />
                                                        <textarea
                                                            value={feedback.comment}
                                                            onChange={(event) => handleCommentChange(product.id, event)}
                                                            className="w-full p-2 border border-gray-300 rounded mt-2"
                                                            placeholder="Yorumunuzu yazın"
                                                        />
                                                        <button
                                                            onClick={() => handleSubmitFeedback(product.id)}
                                                            className="bg-purple-500 text-white p-2 rounded mt-2"
                                                        >
                                                            Gönder
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