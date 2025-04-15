"use client"

import { useState, useEffect } from "react"
import "./Notices.css"
import { Clock } from "lucide-react"

const NoticesList = () => {
  const [notices, setNotices] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  return (
    <div className="notices-container">
      <div className="notices-header">
        <h2>Notices</h2>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default NoticesList