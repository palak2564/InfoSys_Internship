import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiUser, FiHome, FiPhone, FiMail } from "react-icons/fi";
import axios from "axios";
import Sidebar from "./Sidebar";
import ServicesList from "./ServicesList";
import ComplaintManagement from "./ComplaintManagement";
import EventManagement from "./EventManagement";
import NoticeManagement from "./NoticeManagement";
import Posts from "./Posts";
import AdminParking from "./AdminParking";
import AdminEmergency from "./AdminEmergency";
import AdminPaymentComponent from "./AdminPaymentComponent";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [societyDropdownOpen, setSocietyDropdownOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState("");
  const [residents, setResidents] = useState([]);
  const navigate = useNavigate();
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchDashboardData();
      fetchBlocks();
      fetchResidents();
    }
  }, []); 
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
      setLoading(false);
    }
  };
  
  const fetchBlocks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/blocks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlocks(response.data);
      
      // Set the default selected block if blocks exist
      if (response.data.length > 0) {
        setSelectedBlock(response.data[0].name);
      }
    } catch (err) {
      console.error("Failed to fetch blocks", err);
    }
  };
  
  const fetchResidents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/residents", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResidents(response.data);
    } catch (err) {
      console.error("Failed to fetch residents", err);
    }
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminWelcomeDashboard dashboardData={dashboardData} blocks={blocks} />;
      case "service":
        return <ServicesList />;
      case "complaints":
        return <ComplaintManagement />;
      case "events":
        return <EventManagement />;
      case "notices":
        return <NoticeManagement />;
      case "posts":
        return <Posts />;
      case "parking":
        return <AdminParking />;
      case "emergency":
        return <AdminEmergency />;
      case "billings":
        return <AdminPaymentComponent />;
      default:
        return <AdminWelcomeDashboard dashboardData={dashboardData} blocks={blocks} />;
    }
  };
  
  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };
  
  const toggleSocietyDropdown = () => {
    setSocietyDropdownOpen(!societyDropdownOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  
  const handleBlockSelect = (blockName) => {
    setSelectedBlock(blockName);
  };
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (error) {
    return <div className="error-container">{error}</div>;
  }
  
  return (
    <div className="admin-dashboard-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="user-actions">
            <div className="user-dropdown">
              <button onClick={toggleUserDropdown} className="user-dropdown-button">
                <div className="user-icon">
                  <FiUser />
                </div>
                <span>{user?.name || "Admin"}</span>
                <FiChevronDown />
              </button>
              {userDropdownOpen && (
                <div className="user-dropdown-content">
                  <div className="user-option" onClick={toggleSocietyDropdown}>View Society</div>
                  <div className="user-option" onClick={() => navigate("/admin-profile")}>Profile</div>
                  <div className="user-option" onClick={() => navigate("/settings")}>Settings</div>
                  <div className="user-option" onClick={handleLogout}>Logout</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="dashboard-main">
          {renderContent()}
        </div>
        
        {societyDropdownOpen && (
          <div className="society-data-modal">
            <div className="society-data-content">
              <div className="society-header">
                <h2>Apartments</h2>
                <div className="society-user">
                  <span>{user?.name || "Admin"}</span>
                </div>
              </div>
              <div className="block-tabs">
                {blocks.map((block, index) => (
                  <button 
                    key={index} 
                    className={`block-tab ${selectedBlock === block.name ? "active" : ""}`}
                    onClick={() => handleBlockSelect(block.name)}
                  >
                    {block.name}
                  </button>
                ))}
              </div>
              
              <div className="resident-cards-container">
                {residents
                  .filter(resident => resident.block === selectedBlock)
                  .map((resident, index) => (
                    <div key={index} className="resident-card">
                      <h3>{resident.name}</h3>
                      <div className="resident-detail">
                        <span className="detail-label">Block - </span>
                        <span>{resident.block.replace("Block ", "")}</span>
                      </div>
                      <div className="resident-detail">
                        <FiHome className="detail-icon" />
                        <span>{resident.flatNo}</span>
                      </div>
                      <div className="resident-detail">
                        <FiPhone className="detail-icon" />
                        <span>{resident.phoneNo}</span>
                      </div>
                      <div className="resident-detail">
                        <FiMail className="detail-icon" />
                        <span>{resident.email}</span>
                      </div>
                    </div>
                  ))}
              </div>
              
              <button className="close-modal" onClick={toggleSocietyDropdown}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Admin Welcome Dashboard Component
const AdminWelcomeDashboard = ({ dashboardData, blocks }) => {
  // Provide default value for dashboardData
  const dashboard = dashboardData || {};
  
  return (
    <div className="welcome-dashboard">
      <div className="metrics-container">
        <div className="metric-card green">
          <h2>{dashboard.totalBlocks || 6}</h2>
          <p>Total no of blocks</p>
        </div>
        <div className="metric-card blue">
          <h2>{dashboard.totalFlats || 120}</h2>
          <p>Total no of Flats</p>
        </div>
        <div className="metric-card purple">
          <h2>{dashboard.occupiedFlats || 0}</h2>
          <p>Total no of Flats Occupied</p>
        </div>
        <div className="metric-card orange">
          <h2>{dashboard.totalResidents || 0}</h2>
          <p>Total no of People in the Society</p>
        </div>
      </div>
      
      <div className="blocks-grid">
        {blocks.map((block, index) => (
          <div key={index} className="block-card">
            <h3>Block - {block.name}</h3>
            <div className="block-details">
              <div className="block-info">
                <p>Total no of flats : {block.totalFlats || 20}</p>
                <p>Total no of Members : {block.totalMembers || 0}</p>
                <p>Total no of flats Occupied : {block.occupiedFlats || 0}</p>
                <p>Total no of flats Unoccupied : {block.totalFlats - block.occupiedFlats || 20}</p>
              </div>
              <div className="occupancy-chart">
                <div 
                  className="chart-circle"
                  style={{
                    background: `conic-gradient(#5BC0EB ${block.occupancyPercentage || 0}%, #E6E6E6 0)`
                  }}
                >
                  <div className="chart-inner">
                    <span className="percentage">{block.occupancyPercentage || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon complaints"></div>
          <h3>{dashboard.totalComplaints || 0}</h3>
          <p>Total Complaints</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon parking"></div>
          <h3>{dashboard.totalParkingSpots || 0}</h3>
          <p>Total Parking Plots</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon vendors"></div>
          <h3>{dashboard.totalVendors || 0}</h3>
          <p>Total Vendors</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon events"></div>
          <h3>{dashboard.upcomingEvents || 0}</h3>
          <p>Total Upcoming Events</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon security"></div>
          <h3>{dashboard.totalSecurity || 0}</h3>
          <p>Total Securities</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;