// SocietyManagement.jsx (add to components folder)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SocietyManagement.css';

const SocietyManagement = () => {
  const [societies, setSocieties] = useState([]);
  const [newSociety, setNewSociety] = useState({
    name: '',
    address: '',
    blocks: ['A'],
    adminId: localStorage.getItem('userId') 
  });
  const [editingSociety, setEditingSociety] = useState(null);
  const [blockInput, setBlockInput] = useState('');

  useEffect(() => {
    fetchSocieties();
  }, []);

  const fetchSocieties = async () => {
    try {
      const adminId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:8080/societies/admin/${adminId}`);
      setSocieties(response.data);
    } catch (error) {
      console.error('Error fetching societies:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSociety({ ...newSociety, [name]: value });
  };

  const addBlock = () => {
    if (blockInput && !newSociety.blocks.includes(blockInput)) {
      setNewSociety({
        ...newSociety,
        blocks: [...newSociety.blocks, blockInput]
      });
      setBlockInput('');
    }
  };

  const removeBlock = (block) => {
    setNewSociety({
      ...newSociety,
      blocks: newSociety.blocks.filter(b => b !== block)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSociety) {
        await axios.put(`http://localhost:8080/societies/${editingSociety.id}`, newSociety);
      } else {
        await axios.post('http://localhost:8080/societies', newSociety);
      }
      fetchSocieties();
      setNewSociety({
        name: '',
        address: '',
        blocks: ['A'],
        adminId: localStorage.getItem('userId')
      });
      setEditingSociety(null);
    } catch (error) {
      console.error('Error saving society:', error);
    }
  };

  const startEditing = (society) => {
    setEditingSociety(society);
    setNewSociety({
      name: society.name,
      address: society.address,
      blocks: society.blocks,
      adminId: society.adminId
    });
  };

  const cancelEditing = () => {
    setEditingSociety(null);
    setNewSociety({
      name: '',
      address: '',
      blocks: ['A'],
      adminId: localStorage.getItem('userId')
    });
  };

  const deleteSociety = async (id) => {
    if (window.confirm('Are you sure you want to delete this society?')) {
      try {
        await axios.delete(`http://localhost:8080/societies/${id}`);
        fetchSocieties();
      } catch (error) {
        console.error('Error deleting society:', error);
      }
    }
  };

  return (
    <div className="society-management">
      <h2>{editingSociety ? 'Edit Society' : 'Add New Society'}</h2>
      
      <form onSubmit={handleSubmit} className="society-form">
        <div className="form-group">
          <label>Society Name:</label>
          <input
            type="text"
            name="name"
            value={newSociety.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={newSociety.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Blocks:</label>
          <div className="blocks-container">
            {newSociety.blocks.map(block => (
              <div key={block} className="block-tag">
                {block}
                <button
                  type="button"
                  className="remove-block"
                  onClick={() => removeBlock(block)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="add-block">
            <input
              type="text"
              value={blockInput}
              onChange={(e) => setBlockInput(e.target.value)}
              placeholder="Add block (e.g., B, C)"
            />
            <button type="button" onClick={addBlock}>+</button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            {editingSociety ? 'Update Society' : 'Add Society'}
          </button>
          {editingSociety && (
            <button type="button" className="cancel-btn" onClick={cancelEditing}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>Your Societies</h2>
      {societies.length === 0 ? (
        <p>No societies found. Add your first society above.</p>
      ) : (
        <div className="societies-list">
          {societies.map(society => (
            <div key={society.id} className="society-card">
              <h3>{society.name}</h3>
              <p><strong>Address:</strong> {society.address}</p>
              <p><strong>Blocks:</strong> {society.blocks.join(', ')}</p>
              <div className="card-actions">
                <button onClick={() => startEditing(society)}>Edit</button>
                <button onClick={() => deleteSociety(society.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocietyManagement;