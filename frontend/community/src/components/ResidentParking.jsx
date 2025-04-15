import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Car, Search, User } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080';

function ResidentParking() {
    const [parkingData, setParkingData] = useState([]);
    const [blocks, setBlocks] = useState(['A', 'B', 'C', 'D', 'E', 'F']); 
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBlock, setSelectedBlock] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch parking data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${API_BASE_URL}/api/parking`);
                setParkingData(response.data);
            } catch (error) {
                setError('Failed to load parking data');
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate statistics
    const calculateStats = () => {
        const total = parkingData.length;
        const occupied = parkingData.filter(item => item.isOccupied).length;
        const unoccupied = total - occupied;
        
        return {
            total,
            occupied,
            unoccupied
        };
    };

    const stats = calculateStats();

    const filteredData = parkingData.filter(item => {
        const matchesSearch = !searchTerm || 
                             item.parkingId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (item.flatNo && item.flatNo.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesBlock = selectedBlock === 'all' || item.block === selectedBlock;
        return matchesSearch && matchesBlock;
    });

    return (
        <div className="parking-container">
            {/* Header */}
            <div className="parking-header">
                <h1 className="text-2xl font-bold">Parking Information</h1>
                <div className="user-info flex items-center gap-2">
                    <div className="rounded-full bg-blue-500 p-2">
                        <User size={20} className="text-white" />
                    </div>
                    <span>Resident</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-cards flex gap-4 mt-4">
                <div className="stat-card bg-blue-100 rounded-lg p-4 flex-1 flex flex-col">
                    <div className="flex justify-between">
                        <h2 className="text-5xl font-bold text-blue-500">{stats.total}</h2>
                        <Car size={24} className="text-blue-500" />
                    </div>
                    <p className="text-sm text-blue-700 mt-2">Total no of Parking lots</p>
                </div>
                
                <div className="stat-card bg-purple-100 rounded-lg p-4 flex-1 flex flex-col">
                    <div className="flex justify-between">
                        <h2 className="text-5xl font-bold text-purple-500">{stats.occupied}</h2>
                        <Car size={24} className="text-purple-500" />
                    </div>
                    <p className="text-sm text-purple-700 mt-2">No of Parking lots Occupied</p>
                </div>
                
                <div className="stat-card bg-blue-100 rounded-lg p-4 flex-1 flex flex-col">
                    <div className="flex justify-between">
                        <h2 className="text-5xl font-bold text-blue-500">{stats.unoccupied}</h2>
                        <Car size={24} className="text-blue-500" />
                    </div>
                    <p className="text-sm text-blue-700 mt-2">No of Parking lots Unoccupied</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-bar mt-6 flex">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search by Parking ID or Flat Number"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border rounded-md px-3 py-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Block Filter Tabs */}
            <div className="block-tabs flex gap-2 mt-6">
                <button 
                    className={`px-6 py-2 rounded-md ${selectedBlock === 'all' ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedBlock('all')}
                >
                    All
                </button>
                {blocks.map(block => (
                    <button 
                        key={block} 
                        className={`px-6 py-2 rounded-md ${selectedBlock === block ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}
                        onClick={() => setSelectedBlock(block)}
                    >
                        Block - {block}
                    </button>
                ))}
            </div>

            {/* Parking List Section */}
            <div className="parking-list mt-8">
                <h2 className="text-xl font-semibold mb-4">Parking Lot List</h2>
                
                {isLoading ? (
                    <div className="loading-spinner">Loading...</div>
                ) : error ? (
                    <div className="error-message p-4 bg-red-100 border border-red-300 rounded-md">
                        {error}
                        <button className="ml-2 text-red-700" onClick={() => setError(null)}>×</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 text-left border-b">No</th>
                                    <th className="py-2 px-4 text-left border-b text-blue-500">Parking ID</th>
                                    <th className="py-2 px-4 text-left border-b text-blue-500">Block</th>
                                    <th className="py-2 px-4 text-left border-b text-blue-500">Flat Number</th>
                                    <th className="py-2 px-4 text-left border-b text-blue-500">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 border-b">{index + 1}</td>
                                        <td className="py-3 px-4 border-b text-blue-500">{item.parkingId}</td>
                                        <td className="py-3 px-4 border-b">{item.block}</td>
                                        <td className="py-3 px-4 border-b">{item.flatNo}</td>
                                        <td className="py-3 px-4 border-b">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${item.isOccupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {item.isOccupied ? 'Occupied' : 'Available'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-4 text-center text-gray-500">
                                            No parking spaces found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResidentParking;