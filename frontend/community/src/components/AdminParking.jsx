import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Car, Plus, X } from 'lucide-react';
import './Parking.css'
const API_BASE_URL = 'http://localhost:8080';

function AdminParking() {
    const initialForm = () => ({
        parkingId: '',
        block: 'A',
        flatNo: '',
        residentName: '',
        isOccupied: false
    });

    const [parkingData, setParkingData] = useState([]);
    const [blocks] = useState(['A', 'B', 'C', 'D', 'E', 'F']);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newParking, setNewParking] = useState(initialForm());
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [activeBlock, setActiveBlock] = useState('All');
    const [filteredData, setFilteredData] = useState([]);
    
    // Stats
    const TOTAL_PARKING_LOTS = 50;
    const [occupiedCount, setOccupiedCount] = useState(0);
    const [unoccupiedCount, setUnoccupiedCount] = useState(0);

    useEffect(() => {
        fetchParking();
    }, []);

    useEffect(() => {
        // Filter data based on active block
        if (activeBlock === 'All') {
            setFilteredData(parkingData);
        } else {
            const blockLetter = activeBlock.split(' - ')[1];
            setFilteredData(parkingData.filter(item => item.block === blockLetter));
        }

        // Calculate stats
        const occupied = parkingData.filter(item => item.isOccupied).length;
        setOccupiedCount(occupied);
        setUnoccupiedCount(TOTAL_PARKING_LOTS - occupied);
    }, [parkingData, activeBlock]);

    const fetchParking = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/parking`);
            setParkingData(res.data);
        } catch (err) {
            setError("Failed to fetch parking data.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewParking(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!newParking.parkingId.trim()) errors.parkingId = "Parking ID is required";
        if (!newParking.flatNo.trim()) errors.flatNo = "Flat No is required";
        return errors;
    };

    const handleSubmitParking = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            setIsLoading(true);
            if (editingId) {
                const res = await axios.put(`${API_BASE_URL}/api/parking/${editingId}`, newParking);
                // Update parkingData immediately to refresh stats
                setParkingData(prev => prev.map(p => p.id === editingId ? res.data : p));
            } else {
                const res = await axios.post(`${API_BASE_URL}/api/parking`, newParking);
                // Update parkingData immediately to refresh stats
                setParkingData(prev => [...prev, res.data]);
            }

            resetForm();
            setShowAddForm(false);
        } catch (err) {
            setError("An error occurred while saving parking info.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (parking) => {
        setEditingId(parking.id);
        setNewParking(parking);
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this parking slot?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/parking/${id}`);
            // Update parkingData immediately to refresh stats
            setParkingData(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            setError("Failed to delete parking.");
        }
    };

    const resetForm = () => {
        setNewParking(initialForm());
        setEditingId(null);
        setFormErrors({});
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="px-6 py-4">
                <h1 className="text-2xl font-semibold text-center mb-6">Parking Lots</h1>
                
                {/* Stats Cards - All in one row */}
                <div className="flex gap-4 mb-6">
                    <div className="bg-blue-100 rounded-lg p-4 shadow flex-1 relative overflow-hidden">
                        <div className="flex items-center">
                            <div>
                                <h2 className="text-6xl font-bold text-blue-500">{TOTAL_PARKING_LOTS}</h2>
                                <p className="text-sm text-blue-700 mt-1">Total no of Parking lots</p>
                            </div>
                            <div className="absolute top-4 right-4">
                                <Car size={24} className="text-blue-400" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-purple-100 rounded-lg p-4 shadow flex-1 relative overflow-hidden">
                        <div className="flex items-center">
                            <div>
                                <h2 className="text-6xl font-bold text-purple-500">{occupiedCount}</h2>
                                <p className="text-sm text-purple-700 mt-1">No of Parking lots Occupied</p>
                            </div>
                            <div className="absolute top-4 right-4">
                                <Car size={24} className="text-purple-400" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-blue-100 rounded-lg p-4 shadow flex-1 relative overflow-hidden">
                        <div className="flex items-center">
                            <div>
                                <h2 className="text-6xl font-bold text-blue-500">{unoccupiedCount}</h2>
                                <p className="text-sm text-blue-700 mt-1">No of Parking lots Unoccupied</p>
                            </div>
                            <div className="absolute top-4 right-4">
                                <Car size={24} className="text-blue-400" />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Block Filter Buttons - All 6 blocks in one horizontal line */}
                <div className="flex flex-nowrap overflow-x-auto gap-2 mb-6">
                    <button 
                        className={`py-2 px-4 rounded-lg transition-colors whitespace-nowrap ${activeBlock === 'All' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-800'}`}
                        onClick={() => setActiveBlock('All')}
                    >
                        All
                    </button>
                    {blocks.map(block => (
                        <button 
                            key={block}
                            className={`py-2 px-4 rounded-lg transition-colors whitespace-nowrap ${activeBlock === `Block - ${block}` ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-800'}`}
                            onClick={() => setActiveBlock(`Block - ${block}`)}
                        >
                            Block - {block}
                        </button>
                    ))}
                </div>
                
                {/* Parking List Table */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 flex justify-between items-center border-b">
                        <h2 className="text-xl font-semibold">Parking Lot List</h2>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowAddForm(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                        >
                            <Plus size={16} /> Add Parking
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left bg-gray-50">
                                    <th className="py-3 px-6 text-gray-500 font-medium">No</th>
                                    <th className="py-3 px-6 text-gray-500 font-medium">Parking ID</th>
                                    <th className="py-3 px-6 text-gray-500 font-medium">Flat Number</th>
                                    <th className="py-3 px-6 text-gray-500 font-medium">Status</th>
                                    <th className="py-3 px-6 text-gray-500 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={item.id} className="border-t hover:bg-gray-50">
                                            <td className="py-3 px-6 text-gray-500">{index + 1}</td>
                                            <td className="py-3 px-6 text-blue-600">{item.parkingId}</td>
                                            <td className="py-3 px-6">{item.flatNo}</td>
                                            <td className="py-3 px-6">
                                                <span className={`px-2 py-1 rounded-full text-xs ${item.isOccupied ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {item.isOccupied ? 'Occupied' : 'Unoccupied'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 flex gap-2 justify-end">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-4 px-6 text-center text-gray-500">
                                            No parking slots found. Click "Add Parking" to create one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal - White popup */}
            {showAddForm && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">{editingId ? 'Edit' : 'Add'} Parking</h2>
                                <button
                                    onClick={() => {
                                        setShowAddForm(false);
                                        resetForm();
                                    }}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmitParking}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Parking ID *</label>
                                    <input
                                        type="text"
                                        name="parkingId"
                                        value={newParking.parkingId}
                                        onChange={handleInputChange}
                                        placeholder="e.g. P-A234"
                                        className={`w-full px-4 py-2 border rounded-lg ${formErrors.parkingId ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {formErrors.parkingId && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.parkingId}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Block *</label>
                                    <select
                                        name="block"
                                        value={newParking.block}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {blocks.map(block => (
                                            <option key={block} value={block}>{block}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Flat No *</label>
                                    <input
                                        type="text"
                                        name="flatNo"
                                        value={newParking.flatNo}
                                        onChange={handleInputChange}
                                        placeholder="e.g. A234"
                                        className={`w-full px-4 py-2 border rounded-lg ${formErrors.flatNo ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {formErrors.flatNo && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.flatNo}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Resident Name</label>
                                    <input
                                        type="text"
                                        name="residentName"
                                        value={newParking.residentName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-6 flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isOccupied"
                                        name="isOccupied"
                                        checked={newParking.isOccupied}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isOccupied" className="ml-2 text-sm text-gray-600">
                                        Occupied
                                    </label>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            resetForm();
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 border border-transparent rounded-lg text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Saving...' : editingId ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {error && <div className="px-6 mt-4"><p className="text-red-600 text-center">{error}</p></div>}
        </div>
    );
}

export default AdminParking;