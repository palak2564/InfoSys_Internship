"use client"

import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { FiEdit, FiTrash2, FiHome, FiUsers, FiRefreshCw } from "react-icons/fi"
import "./Society.css"

const ViewSocieties = () => {
  const [societies, setSocieties] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [societyToDelete, setSocietyToDelete] = useState(null)
  const adminId = localStorage.getItem("userId")

  const fetchSocieties = useCallback(async () => {
    if (!adminId) return

    setLoading(true)
    try {
      // Match the Spring Boot endpoint
      const response = await axios.get(`http://localhost:8080/api/society/admin/${adminId}`)
      setSocieties(response.data)
      setError("")
    } catch (error) {
      console.error("Error fetching societies:", error)
      setError("Failed to load societies. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [adminId])

  useEffect(() => {
    fetchSocieties()

    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      fetchSocieties()
    }, 30000)

    return () => clearInterval(intervalId)
  }, [fetchSocieties])

  const handleDeleteClick = (society) => {
    setSocietyToDelete(society)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!societyToDelete) return

    try {
      // Match the Spring Boot endpoint
      await axios.delete(`http://localhost:8080/api/society/delete/${societyToDelete.id}`)
      setSocieties(societies.filter((s) => s.id !== societyToDelete.id))
      setShowDeleteModal(false)
      setSocietyToDelete(null)
    } catch (error) {
      console.error("Error deleting society:", error)
      setError("Failed to delete society. Please try again.")
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setSocietyToDelete(null)
  }

  return (
    <div className="view-societies-container">
      <div className="section-header">
        <h2>Your Societies</h2>
        <div className="header-actions">
          <button onClick={fetchSocieties} className="refresh-btn" title="Refresh">
            <FiRefreshCw />
          </button>
          <Link to="/admin/add-society" className="add-new-btn">
            + Add New Society
          </Link>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading societies...</p>
        </div>
      ) : societies.length === 0 ? (
        <div className="empty-state">
          <FiHome size={48} />
          <p>No societies found. Add your first society in the Add Society section.</p>
          <Link to="/admin/add-society" className="add-first-btn">
            Add Your First Society
          </Link>
        </div>
      ) : (
        <div className="societies-grid">
          {societies.map((society) => (
            <div key={society.id} className="society-card">
              <h3>{society.name}</h3>
              <p className="society-address">
                <strong>Address:</strong> {society.address}
              </p>
              <p className="society-blocks">
                <strong>Blocks:</strong> {society.blocks.join(", ")}
              </p>
              <div className="society-stats">
                <div className="stat">
                  <span className="stat-number">{society.flats?.length || 0}</span>
                  <span className="stat-label">Flats</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{society.blocks?.length || 0}</span>
                  <span className="stat-label">Blocks</span>
                </div>
              </div>
              <div className="card-actions">
                <Link to={`/admin/residents/${society.id}`} className="residents-btn">
                  <FiUsers /> Residents
                </Link>
                <Link to={`/admin/apartments/${society.id}`} className="apartments-btn">
                  <FiHome /> Apartments
                </Link>
                <div className="action-buttons">
                  <button className="edit-btn">
                    <FiEdit />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteClick(society)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete <strong>{societyToDelete?.name}</strong>? This action cannot be undone.
            </p>
            <p className="warning">All associated apartments and resident data will also be deleted.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="delete-confirm-btn" onClick={confirmDelete}>
                Delete Society
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewSocieties

