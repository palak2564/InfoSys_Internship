"use client"

import { useState, useEffect } from "react"
import "./ResidentsList.css"

const ResidentsList = () => {
  const [residents, setResidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    flatNumber: "",
    familyMembers: 1,
    ownershipType: "OWNER",
  })

  useEffect(() => {
    fetchResidents()
  }, [])

  const fetchResidents = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/api/resident/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setResidents(data)
      } else {
        setError("Failed to load residents")
      }
    } catch (error) {
      console.error("Error fetching residents:", error)
      setError("Server error. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/api/resident/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({
          fullName: "",
          email: "",
          contactNumber: "",
          flatNumber: "",
          familyMembers: 1,
          ownershipType: "OWNER",
        })
        setShowAddForm(false)
        fetchResidents()
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to add resident")
      }
    } catch (error) {
      console.error("Error adding resident:", error)
      setError("Server error. Please try again later.")
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="residents-container">
      <div className="residents-header">
        <h2>Residents</h2>
        <button className="add-resident-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Add Resident"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && (
        <div className="add-resident-form">
          <h3>Add New Resident</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="flatNumber">Flat Number</label>
                <input
                  type="text"
                  id="flatNumber"
                  name="flatNumber"
                  value={formData.flatNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="familyMembers">Family Members</label>
                <input
                  type="number"
                  id="familyMembers"
                  name="familyMembers"
                  value={formData.familyMembers}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="ownershipType">Ownership Type</label>
                <select
                  id="ownershipType"
                  name="ownershipType"
                  value={formData.ownershipType}
                  onChange={handleChange}
                  required
                >
                  <option value="OWNER">Owner</option>
                  <option value="TENANT">Tenant</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Add Resident
              </button>
              <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="residents-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Flat</th>
              <th>Contact</th>
              <th>Type</th>
              <th>Members</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {residents.length > 0 ? (
              residents.map((resident) => (
                <tr key={resident.id}>
                  <td>{resident.fullName}</td>
                  <td>{resident.flatNumber}</td>
                  <td>{resident.contactNumber}</td>
                  <td>{resident.ownershipType === "OWNER" ? "Owner" : "Tenant"}</td>
                  <td>{resident.familyMembers}</td>
                  <td>
                    <button className="action-btn edit">Edit</button>
                    <button className="action-btn delete">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No residents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResidentsList

