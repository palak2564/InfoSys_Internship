import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiUser } from "react-icons/fi";
import "./ResidentDashboard.css";
import Sidebar from "./Sidebar";
import RequestServices from "./RequestServices";
import Complaints from "./Complaints";
import Events from "./Events";
import NoticesList from "./NoticesList";
import Posts from "./Posts";
import ResidentParking from "./ResidentParking";
import ResidentEmergency from "./ResidentEmergency";
import ResidentPaymentComponent from "./ResidentPaymentComponent";

const ResidentDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("user"));
  
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <WelcomeDashboard user={user} />;
      case "service":
        return <RequestServices />;
      case "complaints":
        return <Complaints />;
      case "events":
        return <Events/>;
      case "notices":
        return <NoticesList />;
      case "posts":
        return <Posts />;
      case "parking":
        return <ResidentParking />;
      case "emergency":
        return <ResidentEmergency />;
      case "billings":
        return <ResidentPaymentComponent />;
      default:
        return <WelcomeDashboard user={user} />;
    }
  };
  
  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (error) {
    return <div className="error-container">{error}</div>;
  }
  
  return (
    <div className="resident-dashboard-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Resident Dashboard</h1>
          <div className="user-actions">
            <div className="user-dropdown">
              <button onClick={toggleUserDropdown} className="user-dropdown-button">
                <div className="user-icon">
                  <FiUser />
                </div>
                <span>{user?.name || "Resident"}</span>
                <FiChevronDown />
              </button>
              {userDropdownOpen && (
                <div className="user-dropdown-content">
                  <div className="user-option" onClick={() => navigate("/resident-profile")}>Profile</div>
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
      </div>
    </div>
  );
};

// Welcome Dashboard Component
const WelcomeDashboard = ({ user }) => {
  const getCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="welcome-dashboard">
      <div className="welcome-content">
        <h1>{getCurrentTime()}, {user?.name || "Resident"}!</h1>
        <p>Welcome to your Resident Management Dashboard</p>
        
        <div className="quick-actions">
          <div className="action-grid">
            <div className="action-card">
              <h3>Raise a Service Request</h3>
              <p>Need maintenance or have a special request?</p>
            </div>
            <div className="action-card">
              <h3>Log a Complaint</h3>
              <p>Something needs attention?</p>
            </div>
            <div className="action-card">
              <h3>Upcoming Events</h3>
              <p>Check community activities</p>
            </div>
            <div className="action-card">
              <h3>Notices</h3>
              <p>Stay informed about community updates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;