"use client"
import "./Sidebar.css"
import { FaUsers, FaCalendarAlt, FaBullhorn, FaExclamationCircle, FaCreditCard, FaTools, FaHome, FaParking, FaFileAlt, FaPhone, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa"

const Sidebar = ({ activeTab, setActiveTab, userRole }) => {
  const isAdmin = userRole === "ADMIN"

  const adminMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { id: "residents", label: "Residents", icon: <FaUsers /> },
    { id: "events", label: "Events", icon: <FaCalendarAlt /> },
    { id: "notices", label: "Notices", icon: <FaBullhorn /> },
    { id: "complaints", label: "Complaints", icon: <FaExclamationCircle /> },
    { id: "parking", label: "Parking", icon: <FaParking /> },
    { id: "posts", label: "Posts", icon: <FaFileAlt /> },
    { id: "emergency", label: "Emergency Contacts", icon: <FaPhone /> },
    { id: "billings", label: "Billings", icon: <FaCreditCard /> },
  ]

  const userMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { id: "events", label: "Events", icon: <FaCalendarAlt /> },
    { id: "notices", label: "Notices", icon: <FaBullhorn /> },
    { id: "complaints", label: "Complaints", icon: <FaExclamationCircle /> },
    { id: "service", label: "Services", icon: <FaTools /> },
    { id: "parking", label: "Parking", icon: <FaParking /> },
    { id: "posts", label: "Posts", icon: <FaFileAlt /> },
    { id: "emergency", label: "Emergency Contacts", icon: <FaPhone /> },
    { id: "billings", label: "Billings", icon: <FaCreditCard /> },
  ]

  const menuItems = isAdmin ? adminMenuItems : userMenuItems

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <FaHome />
          <span>CommUnity</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className={activeTab === item.id ? "active" : ""} onClick={() => setActiveTab(item.id)}>
              <div className="nav-item">
                {item.icon}
                <span>{item.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="logout-option">
          <FaSignOutAlt />
          <span>Logout</span>
        </div>
        <p>© 2025 CommUnity</p>
      </div>
    </div>
  )
}

export default Sidebar