import React, { useState, useEffect } from 'react';
import axiosInstance from '../intercepts/axiosConfig';
import ApiDefaults from '../defaults/ApiDefaults';
import { TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { HomeIcon, InformationCircleIcon, LoginIcon, LogoutIcon, HeartIcon, ShoppingCartIcon, ViewListIcon, PlusCircleIcon, LocationMarkerIcon } from '@heroicons/react/outline';
import authStore from '../stores/authStore';

const AddressesPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [editingAddress, setEditingAddress] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await axiosInstance.get(`${ApiDefaults.BASE_URL}/shipping_address/list/`);
            setAddresses(response.data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleAddAddress = async (data) => {
        try {
            await axiosInstance.post(`${ApiDefaults.BASE_URL}/shipping_address/`, data);
            fetchAddresses();
            reset();
            setShowForm(false);
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    const handleUpdateAddress = async (data) => {
        try {
            await axiosInstance.patch(`${ApiDefaults.BASE_URL}/shipping_address/${editingAddress.id}/`, data);
            fetchAddresses();
            setEditingAddress(null);
            reset();
            setShowForm(false);
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    const handleDeleteAddress = async () => {
        try {
            await axiosInstance.delete(`${ApiDefaults.BASE_URL}/shipping_address/${addressToDelete}/`);
            fetchAddresses();
            setShowDeleteModal(false);
            setAddressToDelete(null);
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const onSubmit = (data) => {
        if (editingAddress) {
            handleUpdateAddress(data);
        } else {
            handleAddAddress(data);
        }
    };

    const handleEditClick = (address) => {
        setEditingAddress(address);
        reset(address);
        setShowForm(true);
    };

    const handleCancel = () => {
        setEditingAddress(null);
        reset();
        setShowForm(false);
    };

    const handleDeleteClick = (addressId) => {
        setAddressToDelete(addressId);
        setShowDeleteModal(true);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-primary mb-4">My Addresses</h1>
            {!showForm && (
                <button onClick={() => setShowForm(true)} className="bg-purple-500 text-white p-3 text-lg rounded mb-4">
                    Add Addresses
                </button>
            )}
            {showForm && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
                    <div>
                        <label className="block text-gray-700">Phone Number</label>
                        <input
                            {...register('telephone', { required: 'This field is required' })}
                            className="w-full p-3 text-lg border border-gray-300 rounded"
                        />
                        {errors.telephone && <span className="text-red-500">{errors.telephone.message}</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700">Addresses</label>
                        <input
                            {...register('address', { required: 'This field is required' })}
                            className="w-full p-3 text-lg border border-gray-300 rounded"
                        />
                        {errors.address && <span className="text-red-500">{errors.address.message}</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700">City</label>
                        <input
                            {...register('city', { required: 'This field is required' })}
                            className="w-full p-3 text-lg border border-gray-300 rounded"
                        />
                        {errors.city && <span className="text-red-500">{errors.city.message}</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700">Town</label>
                        <input
                            {...register('state', { required: 'This field is required' })}
                            className="w-full p-3 text-lg border border-gray-300 rounded"
                        />
                        {errors.state && <span className="text-red-500">{errors.state.message}</span>}
                    </div>
                    <div>
                        <label className="block text-gray-700">Postal Code</label>
                        <input
                            {...register('zipcode', { required: 'This field is required' })}
                            className="w-full p-3 text-lg border border-gray-300 rounded"
                        />
                        {errors.zipcode && <span className="text-red-500">{errors.zipcode.message}</span>}
                    </div>
                    <div className="flex space-x-4">
                        <button type="submit" className="bg-purple-500 text-white p-3 text-lg rounded">
                            {editingAddress ? 'Update' : 'Add'}
                        </button>
                        <button type="button" onClick={handleCancel} className="bg-gray-500 text-white p-3 text-lg rounded">
                            Cancel
                        </button>
                    </div>
                </form>
            )}
            <div className="space-y-4">
                {addresses.map((address) => (
                    <div key={address.id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <p className="text-lg font-bold">{address.address}</p>
                            <p className="text-gray-700">{address.city}, {address.state}, {address.zipcode}</p>
                            <p className="text-gray-700">{address.telephone}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => handleEditClick(address)} className="text-blue-500 hover:text-blue-700">
                                <PencilIcon className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDeleteClick(address.id)} className="text-red-500 hover:text-red-700">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Delete Addresses</h2>
                        <p>Are you sure you want to delete this address?</p>
                        <div className="flex space-x-4 mt-4">
                            <button onClick={handleDeleteAddress} className="bg-red-500 text-white p-3 text-lg rounded">
                                YES
                            </button>
                            <button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 text-white p-3 text-lg rounded">
                                NO
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressesPage;