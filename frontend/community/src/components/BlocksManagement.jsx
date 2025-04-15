import React, { useState, useEffect } from "react";
import axios from "axios";

const BlocksManagement = () => {
  const [residents, setResidents] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState("A");
  const [blocks, setBlocks] = useState(["A", "B", "C", "D", "E", "F"]);
  const [editingResident, setEditingResident] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    block: "",
    flatNumber: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    fetchResidents();
  }, [selectedBlock]);

  const fetchResidents = async () => {
    try {
      const response = await axios.get("/api/residents", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { block: selectedBlock }
      });
      
      if (Array.isArray(response.data)) {
        setResidents(response.data);
      } else {
        console.error("Unexpected API response format:", response.data);
        setResidents([]);
      }
    } catch (error) {
      console.error("Error fetching residents:", error);
    }
  };

  const handleBlockSelect = (block) => {
    setSelectedBlock(block);
  };

  const handleEditClick = (resident) => {
    setEditingResident(resident.id);
    setFormData({
      name: resident.name,
      block: resident.block,
      flatNumber: resident.flatNumber,
      phone: resident.phone,
      email: resident.email
    });
  };

  const handleCancelEdit = () => {
    setEditingResident(null);
    setFormData({
      name: "",
      block: "",
      flatNumber: "",
      phone: "",
      email: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`/api/residents/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      setEditingResident(null);
      fetchResidents();
    } catch (error) {
      console.error("Error updating resident:", error);
    }
  };

  const handleAddResident = async () => {
    try {
      await axios.post("/api/residents", {
        ...formData,
        block: selectedBlock
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      setFormData({
        name: "",
        block: selectedBlock,
        flatNumber: "",
        phone: "",
        email: ""
      });
      
      fetchResidents();
    } catch (error) {
      console.error("Error adding resident:", error);
    }
  };

  const handleDeleteResident = async (id) => {
    if (window.confirm("Are you sure you want to delete this resident?")) {
      try {
        await axios.delete(`/api/residents/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        
        fetchResidents();
      } catch (error) {
        console.error("Error deleting resident:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Apartments</h1>
        <div className="flex items-center">
          <div className="mr-4 flex items-center">
            <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="ml-2">Avinash</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Block Selection */}
      <div className="flex space-x-4 mb-6">
        {blocks.map(block => (
          <button
            key={block}
            onClick={() => handleBlockSelect(block)}
            className={`px-6 py-3 rounded-full ${
              selectedBlock === block
                ? "bg-blue-900 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Block {block}
          </button>
        ))}
      </div>

      {/* Residents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {residents.map(resident => (
          <div key={resident.id} className="bg-white rounded-lg shadow-md p-6">
            {editingResident === resident.id ? (
              // Edit Form
              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Name"
                />
                <input
                  type="text"
                  name="flatNumber"
                  value={formData.flatNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Flat Number"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Phone"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Email"
                />
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit(resident.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              // Display View
              <>
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">{resident.name}</h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditClick(resident)}
                      className="text-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteResident(resident.id)}
                      className="text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-gray-500 mt-1">Block - {resident.block}</p>
                <div className="flex items-center mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="ml-2">{resident.flatNumber}</span>
                </div>
                <div className="flex items-center mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="ml-2">{resident.phone}</span>
                </div>
                <div className="flex items-center mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-2">{resident.email}</span>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Add New Resident Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300 flex flex-col justify-center items-center h-64">
          <button 
            onClick={() => {
              setFormData({
                name: "",
                block: selectedBlock,
                flatNumber: "",
                phone: "",
                email: ""
              });
              setEditingResident("new");
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <span className="mt-2 text-gray-600">Add New Resident</span>

          {editingResident === "new" && (
            <div className="absolute inset-0 bg-white rounded-lg shadow-lg p-6 z-10">
              <h3 className="text-lg font-semibold mb-4">Add New Resident</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Name"
                />
                <input
                  type="text"
                  name="flatNumber"
                  value={formData.flatNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Flat Number"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Phone"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Email"
                />
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddResident}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlocksManagement;