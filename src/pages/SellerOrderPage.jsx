import React, { useState, useEffect } from 'react';
import axiosInstance from '../intercepts/axiosConfig';
import ApiDefaults from '../defaults/ApiDefaults';
import { TrashIcon, CheckIcon } from '@heroicons/react/outline';

const SellerOrderPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axiosInstance.get(`${ApiDefaults.BASE_URL}/seller_orders/list/`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleCompleteOrder = async (orderId) => {
        try {
            await axiosInstance.patch(`${ApiDefaults.BASE_URL}/order/${orderId}/`, { status: 'Complete' });
            fetchOrders();
            alert('Sipariş tamamlandı.');
        } catch (error) {
            console.error('Error completing order:', error);
            alert('Sipariş tamamlanırken bir hata oluştu.');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        const confirmDelete = window.confirm('Bu siparişi silmek istediğinizden emin misiniz?');
        if (confirmDelete) {
            try {
                await axiosInstance.delete(`${ApiDefaults.BASE_URL}/order/${orderId}/`);
                fetchOrders();
                alert('Sipariş silindi.');
            } catch (error) {
                console.error('Error deleting order:', error);
                alert('Sipariş silinirken bir hata oluştu.');
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-primary mb-4">Satıcı Siparişleri</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Sipariş ID</th>
                        <th className="py-2 px-4 border-b">Toplam Tutar</th>
                        <th className="py-2 px-4 border-b">Ürün</th>
                        <th className="py-2 px-4 border-b">Müşteri</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td className="py-2 px-4 border-b">{order.order}</td>
                            <td className="py-2 px-4 border-b">{order.product.price * order.quantity} TL</td>

                            <td className="py-2 px-4 border-b">
                                <div className="flex items-center space-x-4">
                                    <img src={order.product.image} alt={order.product.name} className="w-16 h-16 object-cover rounded" />
                                    <div>
                                        <p className="text-gray-700">{order.product.name}</p>
                                        <p className="text-gray-700">Adet: {order.quantity}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-2 px-4 border-b">
                                <p className="text-gray-700">{order.customer.firstName} {order.customer.lastName}</p>
                                <p className="text-gray-700">{order.customer.email}</p>
                            </td>
                            <td className="py-2 px-4 border-b">

                                {/* <button
                                    onClick={() => handleCompleteOrder(order.order)}
                                    className="bg-green-500 text-white p-2 rounded mr-2"
                                >
                                    <CheckIcon className="w-5 h-5" />
                                </button>

                                <button
                                    onClick={() => handleDeleteOrder(order.order)}
                                    className="bg-red-500 text-white p-2 rounded"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SellerOrderPage;