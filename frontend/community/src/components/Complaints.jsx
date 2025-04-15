import React, { useState } from 'react';
import './Complaints.css';
import axios from 'axios';

const Complaints = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/complaints', { name, title, description });
      // Reset form after submission
      setName('');
      setTitle('');
      setDescription('');
      alert('Complaint submitted successfully!');
    } catch (error) {
      console.error('Error submitting complaint', error);
      alert('Failed to submit complaint');
    }
  };

  return (
    <div className="complaints-container">
      <h2>Submit Complaint</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            placeholder="Enter your Name here" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input 
            type="text" 
            placeholder="Enter the title here" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea 
            placeholder="Any Specific details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default Complaints;