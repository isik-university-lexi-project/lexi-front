import React, { useState, useEffect } from 'react';
import axiosInstance from '../intercepts/axiosConfig';
import ApiDefaults from '../defaults/ApiDefaults';

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

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-primary mb-4">Seller Orders</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 pl-2 pr-12 border-b text-center">Order ID</th>
                        <th className="py-2 pl-4 pr-2 border-b text-left">Total Amount</th>
                        <th className="py-2 pl-12 pr-2 border-b text-left">Product</th>
                        <th className="py-2 pl-5 pr-2 border-b text-left">Customer Info</th>
                        <th className="py-2 pl-12 pr-2 border-b text-left">Shipping Address</th>
                        <th className="py-2 pl-2 pr-12 border-b">Order Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => {
                        
                        const [date, time] = order.shippingAddress.dateUpdated.split('T');
                        const formattedTime = time.split('.')[0]; 

                        return (
                            <tr key={order.id}>
                                <td className="py-2 px-3 border-b">{order.order}</td>
                                <td className="py-2 px-3 border-b">{order.product.price * order.quantity} TL</td>
                                <td className="py-2 px-3 border-b">
                                    <div className="flex items-center space-x-2">
                                        <img src={order.product.image} alt={order.product.name} className="w-16 h-16 object-cover rounded" />
                                        <div>
                                            <p className="text-gray-700">{order.product.name}</p>
                                            <p className="text-gray-700">Quantity: {order.quantity}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <p className="text-gray-700">{order.customer.firstName} {order.customer.lastName}</p>
                                    <p className="text-gray-700">{order.customer.email}</p>
                                </td>

                                <td className="py-2 px-3 border-b">
                                    
                                    <div>{order.shippingAddress.address}</div>
                                    <div>{order.shippingAddress.city} , {order.shippingAddress.state}</div>
                                    <div>{order.shippingAddress.zipcode}</div>
                                    <div>{order.shippingAddress.telephone}</div>
                                </td>

                                <td className="py-2 px-3 border-b">
                                    <div>{date}</div>
                                    <div>{formattedTime}</div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SellerOrderPage;
