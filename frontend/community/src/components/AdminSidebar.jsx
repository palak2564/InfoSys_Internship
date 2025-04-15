import { FiHome, FiSettings, FiMessageSquare, FiCalendar, FiBell, FiMessageCircle,  FiPhone, FiCreditCard, FiLogOut } from "react-icons/fi";
import "./AdminSidebar.css";
import { FaCar } from 'react-icons/fa';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FiHome />,
    },
    {
      id: "services",
      label: "Request Services",
      icon: <FiSettings />,
    },
    {
      id: "complaints",
      label: "Complaints",
      icon: <FiMessageSquare />,
    },
    {
      id: "events",
      label: "Events",
      icon: <FiCalendar />,
    },
    {
      id: "notices",
      label: "Notices",
      icon: <FiBell />,
    },
    {
      id: "posts",
      label: "Posts",
      icon: <FiMessageCircle />,
    },
    {
      id: "parking",
      label: "Parking",
      icon: <FiCar />,
    },
    {
      id: "emergency",
      label: "Emergency Contacts",
      icon: <FiPhone />,
    },
    {
      id: "billings",
      label: "Billings",
      icon: <FiCreditCard />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">AM</div>
      </div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            <div className="sidebar-icon">{item.icon}</div>
            <div className="sidebar-label">{item.label}</div>
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-item" onClick={handleLogout}>
          <div className="sidebar-icon">
            <FiLogOut />
          </div>
          <div className="sidebar-label">Logout</div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;