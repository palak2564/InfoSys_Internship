"use client"

import { useState, useEffect, useCallback } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { FiEdit, FiTrash2, FiFilter, FiHome, FiUser, FiRefreshCw } from "react-icons/fi"
import "./Apartment.css"

const ViewApartments = () => {
  const { societyId: urlSocietyId } = useParams()
  const [societies, setSocieties] = useState([])
  const [apartments, setApartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedSociety, setSelectedSociety] = useState(urlSocietyId || "")
  const [selectedBlock, setSelectedBlock] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [blocks, setBlocks] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [apartmentToDelete, setApartmentToDelete] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [residents, setResidents] = useState([])
  const adminId = localStorage.getItem("userId")

  const fetchSocieties = useCallback(async () => {
    if (!adminId) return

    try {
      // Match the Spring Boot endpoint
      const response = await axios.get(`http://localhost:8080/api/society/admin/${adminId}`)
      setSocieties(response.data)

      if (urlSocietyId) {
        setSelectedSociety(urlSocietyId)
      } else if (!selectedSociety && response.data.length > 0) {
        setSelectedSociety(response.data[0].id)
      }
    } catch (error) {
      console.error("Error fetching societies:", error)
      setError("Failed to load societies")
    }
  }, [adminId, urlSocietyId, selectedSociety])

  const fetchResidents = useCallback(async () => {
    if (!selectedSociety) return

    try {
      // Match the Spring Boot endpoint
      const response = await axios.get(`http://localhost:8080/api/user/society/${selectedSociety}`)
      setResidents(response.data)
    } catch (error) {
      console.error("Error fetching residents:", error)
    }
  }, [selectedSociety])

  useEffect(() => {
    if (selectedSociety) {
      const society = societies.find((s) => s.id === selectedSociety)
      if (society) {
        setBlocks(society.blocks || [])
        setSelectedBlock("") // Reset block selection
      }
      fetchApartments()
      fetchResidents()
    }
  }, [selectedSociety, societies, fetchResidents])

  useEffect(() => {
    fetchSocieties()

    const intervalId = setInterval(() => {
      fetchSocieties()
      if (selectedSociety) {
        fetchApartments()
        fetchResidents()
      }
    }, 30000)

    return () => clearInterval(intervalId)
  }, [fetchSocieties, selectedSociety])

  const fetchApartments = async () => {
    if (!selectedSociety) return

    setLoading(true)
    try {
      // Match the Spring Boot endpoint
      let url = `http://localhost:8080/api/flat/society/${selectedSociety}`
      const params = []

      if (selectedBlock) {
        params.push(`block=${selectedBlock}`)
      }

      if (selectedStatus) {
        params.push(`status=${selectedStatus}`)
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`
      }

      const response = await axios.get(url)
      setApartments(response.data)
      setError("")
    } catch (error) {
      console.error("Error fetching apartments:", error)
      setError("Failed to load apartments. Please try again.")
      setApartments([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (apartment) => {
    setApartmentToDelete(apartment)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!apartmentToDelete) return

    try {
      // Match the Spring Boot endpoint
      await axios.delete(`http://localhost:8080/api/flat/delete/${apartmentToDelete.id}`)
      setApartments(apartments.filter((a) => a.id !== apartmentToDelete.id))
      setShowDeleteModal(false)
      setApartmentToDelete(null)
    } catch (error) {
      console.error("Error deleting apartment:", error)
      setError("Failed to delete apartment. Please try again.")
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setApartmentToDelete(null)
  }

  // Get resident for an apartment
  const getResidentForApartment = (apartmentId) => {
    return residents.find((resident) => resident.apartmentId === apartmentId)
  }

  // Get status badge class
  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return "status-available"
      case "occupied":
        return "status-occupied"
      case "maintenance":
        return "status-maintenance"
      default:
        return ""
    }
  }

  // Get society name
  const getSocietyName = (societyId) => {
    const society = societies.find((s) => s.id === societyId)
    return society ? society.name : "Unknown Society"
  }

  const applyFilters = () => {
    fetchApartments()
  }

  const resetFilters = () => {
    setSelectedBlock("")
    setSelectedStatus("")
    fetchApartments()
  }

  return (
    <div className="view-apartments-container">
      <div className="section-header">
        <h2>Apartments</h2>
        <div className="header-actions">
          <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
            <FiFilter /> Filters
          </button>
          <button
            className="refresh-btn"
            onClick={() => {
              fetchApartments()
              fetchResidents()
            }}
            title="Refresh"
          >
            <FiRefreshCw />
          </button>
          <Link
            to={selectedSociety ? `/admin/add-apartment/${selectedSociety}` : "/admin/add-apartment"}
            className="add-new-btn"
          >
            + Add New Apartment
          </Link>
        </div>
      </div>

      {/* Filter panel */}
      <div className={`filters-panel ${showFilters ? "show" : ""}`}>
        <div className="filter-group">
          <label htmlFor="society-filter">Society</label>
          <select id="society-filter" value={selectedSociety} onChange={(e) => setSelectedSociety(e.target.value)}>
            <option value="">All Societies</option>
            {societies.map((society) => (
              <option key={society.id} value={society.id}>
                {society.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="block-filter">Block</label>
          <select
            id="block-filter"
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            disabled={!selectedSociety || blocks.length === 0}
          >
            <option value="">All Blocks</option>
            {blocks.map((block) => (
              <option key={block} value={block}>
                Block {block}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select id="status-filter" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Under Maintenance</option>
          </select>
        </div>

        <div className="filter-actions">
          <button className="apply-btn" onClick={applyFilters}>
            Apply Filters
          </button>
          <button className="reset-btn" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading apartments...</p>
        </div>
      ) : apartments.length === 0 ? (
        <div className="empty-state">
          <FiHome size={48} />
          <p>No apartments found for the selected criteria.</p>
          <Link
            to={selectedSociety ? `/admin/add-apartment/${selectedSociety}` : "/admin/add-apartment"}
            className="add-first-btn"
          >
            Add Your First Apartment
          </Link>
        </div>
      ) : (
        <div className="apartments-grid">
          {apartments.map((apartment) => {
            const societyName = getSocietyName(apartment.societyId)
            const resident = getResidentForApartment(apartment.id)

            return (
              <div key={apartment.id} className="apartment-card">
                <div className="apartment-header">
                  <h3>
                    {societyName} - Block {apartment.block} - {apartment.flatNumber}
                  </h3>
                  <span className={`status-badge ${getStatusBadge(apartment.status)}`}>
                    {apartment.status.charAt(0).toUpperCase() + apartment.status.slice(1)}
                  </span>
                </div>

                <div className="apartment-details">
                  {apartment.size && (
                    <div className="detail-item">
                      <span className="detail-label">Size:</span>
                      <span className="detail-value">{apartment.size} sq ft</span>
                    </div>
                  )}

                  <div className="detail-item">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">{apartment.bedrooms} BHK</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Bathrooms:</span>
                    <span className="detail-value">{apartment.bathrooms}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Floor:</span>
                    <span className="detail-value">{apartment.floor}</span>
                  </div>
                </div>

                <div className="apartment-actions">
                  {apartment.status === "occupied" && resident && (
                    <div className="resident-info">
                      <div className="resident-name">
                        <FiUser /> {resident.name}
                      </div>
                      {resident.phone && <div className="resident-phone">{resident.phone}</div>}
                    </div>
                  )}

                  <div className="action-buttons">
                    <button className="edit-btn">
                      <FiEdit />
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteClick(apartment)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete apartment{" "}
              <strong>
                {apartmentToDelete?.block} - {apartmentToDelete?.flatNumber}
              </strong>
              ? This action cannot be undone.
            </p>
            {apartmentToDelete?.status === "occupied" && (
              <p className="warning">
                This apartment is currently occupied! Deleting it will remove any associated resident data.
              </p>
            )}
            <div className="modal-actions">
              <button className="cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="delete-confirm-btn" onClick={confirmDelete}>
                Delete Apartment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewApartments

