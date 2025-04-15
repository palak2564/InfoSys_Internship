"use client"

import { useState, useEffect } from "react"
import "./ComplaintManagement.css"

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("All")
  const [totalComplaints, setTotalComplaints] = useState(0)
  
  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      
      // Modify this URL to match your actual backend endpoint
      const response = await fetch("http://localhost:8080/api/complaints", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Only include auth token if your API requires it
          ...(localStorage.getItem("token") && { 
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          })
        },
        // Important: Add these options to handle CORS issues
        mode: 'cors',
        credentials: 'include'
      })
      
      console.log("Response status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log("Received data:", data)
        setComplaints(data)
        setTotalComplaints(data.length)
        setError("")
      } else {
        console.error("Server responded with error:", response.status)
        // Let's try our fallback data if the server doesn't respond correctly
        useMockData()
      }
    } catch (error) {
      console.error("Error fetching complaints:", error)
      // Use mock data if server is unreachable
      useMockData()
    } finally {
      setLoading(false)
    }
  }
  
  // Function to use mock data when backend fails
  const useMockData = () => {
    console.log("Using mock data")
    // Mock data that matches your model structure
    const mockData = [
      {
        id: "1",
        name: "Pavani",
        room: "A234",
        title: "Tap not working",
        status: "CLOSED"
      },
      {
        id: "2",
        name: "Pavani",
        room: "A234",
        title: "Room services not good",
        status: "CLOSED"
      },
      {
        id: "3",
        name: "Swathi",
        room: "A234",
        title: "Watchman not listening",
        status: "CLOSED"
      },
      {
        id: "4",
        name: "Pavani",
        room: "A234",
        title: "Broken window",
        status: "CLOSED"
      }
    ]
    
    setComplaints(mockData)
    setTotalComplaints(mockData.length)
    setError("")
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleSearch = (e) => {
    // Search functionality will be implemented here
  }

  // Filter complaints based on active tab
  const getFilteredComplaints = () => {
    if (activeTab === "All") return complaints
    if (activeTab === "Open") return complaints.filter(c => c.status !== "CLOSED")
    if (activeTab === "Closed") return complaints.filter(c => c.status === "CLOSED")
    return complaints
  }

  const filteredComplaints = getFilteredComplaints()

  return (
    <div className="complaint-management-container">
      {/* Top stats widget */}
      <div className="stats-widget">
        <div className="stat-card">
          <div className="stat-title">Total no of Complaints in Block B</div>
          <div className="stat-value">{totalComplaints}</div>
        </div>
      </div>

      {/* Main complaint panel */}
      <div className="complaints-panel">
        {/* Filter tabs */}
        <div className="filter-container">
          <div className="tabs">
            <button 
              className={`tab-btn ${activeTab === "All" ? "active" : ""}`} 
              onClick={() => handleTabChange("All")}
            >
              All
            </button>
            <button 
              className={`tab-btn ${activeTab === "Open" ? "active" : ""}`}
              onClick={() => handleTabChange("Open")}
            >
              Open
            </button>
            <button 
              className={`tab-btn ${activeTab === "Closed" ? "active" : ""}`}
              onClick={() => handleTabChange("Closed")}
            >
              Closed
            </button>
          </div>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input"
              onChange={handleSearch}
            />
          </div>
        </div>

        <h2 className="complaints-heading">Complaints List</h2>
        
        {/* Error message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Loading indicator */}
        {loading ? (
          <div className="loading-message">Loading complaints...</div>
        ) : (
          /* Complaints table */
          <div className="complaints-table">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Flat no</th>
                  <th>Complaint</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint, index) => (
                    <tr key={complaint.id || index}>
                      <td>{index + 1}</td>
                      <td>{complaint.name}</td>
                      <td>{complaint.room}</td>
                      <td>{complaint.title}</td>
                      <td>
                        <div className="status-badge closed">
                          CLOSED
                        </div>
                      </td>
                      <td>
                        <button className="close-btn">Close</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data-message">
                      No complaints found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ComplaintManagement