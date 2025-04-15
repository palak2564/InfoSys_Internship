"use client"

import { useState, useEffect } from "react"
import "./Notices.css"
import { Clock, Plus, X, Eye, Trash, Edit } from "lucide-react"

const NoticeManagement = () => {
  const [notices, setNotices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentNotice, setCurrentNotice] = useState({
    title: "",
    content: "",
    iconBgColor: "#f44336",
    icon: "!"
  })

  // API Base URL
  const NOTICES_API_URL = "http://localhost:8080/api/notices"

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(NOTICES_API_URL)
      if (response.ok) {
        const data = await response.json()
        setNotices(data)
      } else {
        console.error('Failed to fetch notices')
      }
    } catch (error) {
      console.error('Error fetching notices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentNotice({
      ...currentNotice,
      [name]: value
    })
  }

  const openAddModal = () => {
    setCurrentNotice({
      title: "",
      content: "",
      iconBgColor: "#f44336",
      icon: "!"
    })
    setIsEditMode(false)
    setIsModalOpen(true)
  }

  const openEditModal = (notice) => {
    setCurrentNotice({
      ...notice
    })
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const saveNotice = async () => {
    try {
      const method = isEditMode ? 'PUT' : 'POST'
      const url = isEditMode ? `${NOTICES_API_URL}/${currentNotice.id}` : NOTICES_API_URL
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentNotice)
      })

      if (response.ok) {
        fetchNotices()
        closeModal()
      } else {
        console.error('Failed to save notice')
      }
    } catch (error) {
      console.error('Error saving notice:', error)
    }
  }

  const deleteNotice = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        const response = await fetch(`${NOTICES_API_URL}/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          fetchNotices()
        } else {
          console.error('Failed to delete notice')
        }
      } catch (error) {
        console.error('Error deleting notice:', error)
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  return (
    <div className="notices-container admin">
      <div className="notices-header admin-header">
        <h2>Notices</h2>
        <button className="create-notice-btn" onClick={openAddModal}>
          <Plus size={16} /> 
          <span>Create Notice</span>
        </button>
      </div>

      <div className="notices-content">
        {isLoading ? (
          <div className="loading-state">Loading notices...</div>
        ) : notices.length === 0 ? (
          <div className="empty-state">No notices available</div>
        ) : (
          notices.map((notice) => (
            <div key={notice.id} className="notice-card">
              <div className="notice-icon" style={{ backgroundColor: notice.iconBgColor || '#f44336' }}>
                <div className="icon-inner">
                  {notice.icon || '!'}
                </div>
              </div>
              
              <div className="notice-content">
                <h3 className="notice-title">{notice.title}</h3>
                <p className="notice-text">{notice.content}</p>
              </div>
              
              <div className="notice-meta">
                <div className="notice-timestamp">
                  <Clock size={14} />
                  <span>{formatDate(notice.createdAt)}</span>
                </div>
                
                <div className="notice-actions">
                  <button className="action-btn view-btn" title="View Notice">
                    <Eye size={16} />
                  </button>
                  <button 
                    className="action-btn edit-btn" 
                    title="Edit Notice"
                    onClick={() => openEditModal(notice)}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="action-btn delete-btn" 
                    title="Delete Notice"
                    onClick={() => deleteNotice(notice.id)}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Notice Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{isEditMode ? 'Edit Notice' : 'Create Notice'}</h3>
              <button className="close-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="title">Notice Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={currentNotice.title}
                  onChange={handleInputChange}
                  placeholder="Enter notice title"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="content">Notice Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={currentNotice.content}
                  onChange={handleInputChange}
                  placeholder="Enter notice content"
                  required
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="icon">Icon Symbol</label>
                  <input
                    type="text"
                    id="icon"
                    name="icon"
                    value={currentNotice.icon}
                    onChange={handleInputChange}
                    placeholder="!"
                    maxLength="1"
                  />
                </div>
                
                <div className="form-group half">
                  <label htmlFor="iconBgColor">Icon Background Color</label>
                  <input
                    type="color"
                    id="iconBgColor"
                    name="iconBgColor"
                    value={currentNotice.iconBgColor}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="save-btn" onClick={saveNotice}>
                {isEditMode ? 'Update Notice' : 'Publish Notice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoticeManagement