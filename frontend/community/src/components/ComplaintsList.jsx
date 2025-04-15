import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ComplaintsList.css';

const ComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('/api/complaints');
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints', error);
      }
    };

    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    return status === 'CLOSED' ? 'red' : 'blue';
  };

  const filteredComplaints = statusFilter === 'All' 
    ? complaints 
    : complaints.filter(complaint => complaint.status === statusFilter);

  return (
    <div className="complaints-list-container">
      <div className="complaints-summary">
        <div className="summary-card total-complaints">
          <span className="count">4</span>
          <span className="label">Total no of Complaints</span>
        </div>
        <div className="summary-card total-open">
          <span className="count">0</span>
          <span className="label">Total no of Complaints Open</span>
        </div>
        <div className="summary-card total-closed">
          <span className="count">4</span>
          <span className="label">Total no of Complaints Closed</span>
        </div>
      </div>

      <div className="complaints-filter">
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <table className="complaints-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Room</th>
            <th>Complaint</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.map((complaint, index) => (
            <tr key={complaint.id}>
              <td>{index + 1}</td>
              <td>{complaint.name}</td>
              <td>{complaint.room}</td>
              <td>{complaint.title}</td>
              <td>
                <span 
                  className="status-badge" 
                  style={{backgroundColor: getStatusColor(complaint.status)}}
                >
                  {complaint.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintsList;