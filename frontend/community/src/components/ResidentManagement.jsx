import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResidentManagement.css';

const ResidentManagement = () => {
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [flats, setFlats] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [newResidentEmail, setNewResidentEmail] = useState('');
  const [showAddResidentForm, setShowAddResidentForm] = useState(false);
  const [newResident, setNewResident] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  // Fetch societies on component mount
  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const adminId = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:8080/societies/admin/${adminId}`);
        setSocieties(response.data);
      } catch (error) {
        console.error('Error fetching societies:', error);
      }
    };

    fetchSocieties();
  }, []);

  // Fetch flats when society and block are selected
  useEffect(() => {
    if (selectedSociety && selectedBlock) {
      fetchFlats();
    }
  }, [selectedSociety, selectedBlock]);

  const fetchFlats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/flats/society/${selectedSociety}/block/${selectedBlock}`
      );
      setFlats(response.data);
      
      // Fetch residents for these flats
      const residentIds = response.data
        .filter(flat => flat.residentId)
        .map(flat => flat.residentId);
      
      if (residentIds.length > 0) {
        const uniqueIds = [...new Set(residentIds)];
        const residents = await Promise.all(
          uniqueIds.map(async id => {
            const res = await axios.get(`http://localhost:8080/users/${id}`);
            return res.data;
          })
        );
        setResidents(residents);
      } else {
        setResidents([]);
      }
    } catch (error) {
      console.error('Error fetching flats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocietyChange = (e) => {
    setSelectedSociety(e.target.value);
    setSelectedBlock('');
    setFlats([]);
  };

  const getBlocksForSociety = () => {
    const society = societies.find(s => s.id === selectedSociety);
    return society ? society.blocks : [];
  };

  const getResidentForFlat = (flatId) => {
    const flat = flats.find(f => f.id === flatId);
    if (!flat || !flat.residentId) return null;
    return residents.find(r => r.id === flat.residentId);
  };

  const handleAddFlat = async () => {
    try {
      const newFlat = {
        flatNumber: window.prompt('Enter flat number:'),
        block: selectedBlock,
        societyId: selectedSociety,
        residentId: null
      };
      
      if (!newFlat.flatNumber) return;
      
      await axios.post('http://localhost:8080/flats', newFlat);
      fetchFlats();
    } catch (error) {
      console.error('Error adding flat:', error);
    }
  };

  const handleAssignResident = (flat) => {
    setSelectedFlat(flat);
    setShowAddResidentForm(true);
  };

  const handleRemoveResident = async (flat) => {
    try {
      await axios.post(`http://localhost:8080/flats/${flat.id}/unassign`);
      fetchFlats();
    } catch (error) {
      console.error('Error removing resident:', error);
    }
  };

  const handleCheckEmail = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/users/check-email?email=${newResidentEmail}`);
      
      if (response.data.exists) {
        // Email exists, fetch user details
        const userResponse = await axios.get(`http://localhost:8080/users/email/${newResidentEmail}`);
        const user = userResponse.data;
        
        // Assign resident to flat
        await axios.post(`http://localhost:8080/flats/${selectedFlat.id}/assign/${user.id}`);
        fetchFlats();
        resetResidentForm();
      } else {
        // Email doesn't exist, show form to create new resident
        setNewResident({
          ...newResident,
          email: newResidentEmail
        });
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  const handleCreateResident = async (e) => {
    e.preventDefault();
    try {
      // Create new user
      const response = await axios.post('http://localhost:8080/users/register', newResident);
      
      // Extract user ID from response
      const userId = response.data.id || response.data.userId;
      
      // Assign resident to flat
      await axios.post(`http://localhost:8080/flats/${selectedFlat.id}/assign/${userId}`);
      
      fetchFlats();
      resetResidentForm();
    } catch (error) {
      console.error('Error creating resident:', error);
    }
  };

  const resetResidentForm = () => {
    setSelectedFlat(null);
    setShowAddResidentForm(false);
    setNewResidentEmail('');
    setNewResident({
      name: '',
      email: '',
      password: '',
      phoneNumber: ''
    });
  };

  return (
    <div className="resident-management">
      <h2>Resident Management</h2>
      
      <div className="filters">
        <div className="form-group">
          <label>Society:</label>
          <select value={selectedSociety} onChange={handleSocietyChange}>
            <option value="">Select Society</option>
            {societies.map(society => (
              <option key={society.id} value={society.id}>
                {society.name}
              </option>
            ))}
          </select>
        </div>
        
        {selectedSociety && (
          <div className="form-group">
            <label>Block:</label>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
            >
              <option value="">Select Block</option>
              {getBlocksForSociety().map(block => (
                <option key={block} value={block}>
                  Block {block}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {selectedSociety && selectedBlock && (
        <div className="flats-section">
          <div className="section-header">
            <h3>Flats in Block {selectedBlock}</h3>
            <button onClick={handleAddFlat}>Add Flat</button>
          </div>
          
          {loading ? (
            <p>Loading flats...</p>
          ) : flats.length === 0 ? (
            <p>No flats found in this block. Add a flat to get started.</p>
          ) : (
            <div className="flats-grid">
              {flats.map(flat => {
                const resident = getResidentForFlat(flat.id);
                
                return (
                  <div key={flat.id} className="flat-card">
                    <h4>Flat {flat.flatNumber}</h4>
                    
                    {resident ? (
                      <div className="resident-info">
                        <p><strong>Resident:</strong> {resident.name}</p>
                        <p><strong>Phone:</strong> {resident.phoneNumber}</p>
                        <p><strong>Email:</strong> {resident.email}</p>
                        <button
                          onClick={() => handleRemoveResident(flat)}
                          className="remove-btn"
                        >
                          Remove Resident
                        </button>
                      </div>
                    ) : (
                      <div className="no-resident">
                        <p>No resident assigned</p>
                        <button
                          onClick={() => handleAssignResident(flat)}
                          className="assign-btn"
                        >
                          Assign Resident
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      
      {showAddResidentForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={resetResidentForm}>&times;</span>
            
            <h3>Add Resident to Flat {selectedFlat.flatNumber}</h3>
            
            {!newResident.email ? (
              <div className="email-check">
                <p>Enter resident email to check if already registered:</p>
                <div className="input-group">
                  <input
                    type="email"
                    value={newResidentEmail}
                    onChange={(e) => setNewResidentEmail(e.target.value)}
                    placeholder="Email address"
                  />
                  <button onClick={handleCheckEmail}>Check</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateResident}>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={newResident.email}
                    readOnly
                  />
                </div>
                
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={newResident.name}
                    onChange={(e) => setNewResident({...newResident, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone Number:</label>
                  <input
                    type="text"
                    value={newResident.phoneNumber}
                    onChange={(e) => setNewResident({...newResident, phoneNumber: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="password"
                    value={newResident.password}
                    onChange={(e) => setNewResident({...newResident, password: e.target.value})}
                    required
                  />
                </div>
                
                <button type="submit" className="submit-btn">
                  Create Resident
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentManagement;