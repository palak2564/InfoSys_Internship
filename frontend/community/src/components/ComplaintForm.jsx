"use client"

import { useState, useEffect } from "react"
import "./ComplaintForm.css"

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchingComplaints, setFetchingComplaints] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/api/complaint/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setComplaints(data)
      } else {
        console.error("Failed to load complaints")
      }
    } catch (error) {
      console.error("Error fetching complaints:", error)
    } finally {
      setFetchingComplaints(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("token")

      // First, create the complaint
      const complaintResponse = await fetch("http://localhost:8080/api/complaint/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!complaintResponse.ok) {
        const errorData = await complaintResponse.json()
        throw new Error(errorData.message || "Failed to submit complaint")
      }

      const complaintData = await complaintResponse.json()

      // If there's an image, upload it
      if (image) {
        const formData = new FormData()
        formData.append("image", image)

        const imageResponse = await fetch(`http://localhost:8080/api/complaint/upload-image/${complaintData.id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        if (!imageResponse.ok) {
          console.error("Failed to upload image, but complaint was submitted")
        }
      }

      // Reset form and show success message
      setFormData({
        title: "",
        description: "",
      })
      setImage(null)
      setImagePreview(null)
      setSuccess("Complaint submitted successfully")

      // Refresh complaints list
      fetchComplaints()
    } catch (error) {
      console.error("Error submitting complaint:", error)
      setError(error.message || "Failed to submit complaint. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending"
      case "IN_PROGRESS":
        return "status-progress"
      case "RESOLVED":
        return "status-resolved"
      case "REJECTED":
        return "status-rejected"
      default:
        return ""
    }
  }

  return (
    <div className="complaint-form-container">
      <div className="complaint-form-header">
        <h2>Submit a Complaint</h2>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="complaint-form">
        <div className="form-group">
          <label htmlFor="title">Complaint Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter a brief title for your complaint"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Please provide details about your complaint"
          ></textarea>
        </div>

        <div className="image-upload">
          <label>Attach Image (Optional)</label>
          <div className="image-upload-container">
            <input type="file" id="image" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            <label htmlFor="image" className="upload-btn">
              Choose File
            </label>
            <span>{image ? image.name : "No file chosen"}</span>
          </div>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>

      <div className="complaints-history">
        <h3>Your Complaints History</h3>

        {fetchingComplaints ? (
          <div className="loading">Loading complaints...</div>
        ) : complaints.length > 0 ? (
          <div className="complaints-list">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Admin Remarks</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>{complaint.title}</td>
                    <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status ${getStatusClass(complaint.status)}`}>
                        {complaint.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>{complaint.adminRemarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-complaints">You haven't submitted any complaints yet</div>
        )}
      </div>
    </div>
  )
}

export default ComplaintForm

