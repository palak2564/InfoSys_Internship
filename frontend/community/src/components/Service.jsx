"use client"

import { useState } from "react"
import "./Service.css"

const Service = () => {
  const [selectedService, setSelectedService] = useState("")
  const [address, setAddress] = useState("")
  const [phoneNo, setPhoneNo] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")

  const serviceTypes = [
    { id: "water-can", label: "Water Can" },
    { id: "house-keeping", label: "House Keeping" },
    { id: "gas", label: "Gas" },
    { id: "plumbing", label: "Plumbing" },
    { id: "garbage-collection", label: "Garbage Collection" }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    // Submit service request logic
    console.log({
      serviceType: selectedService,
      address,
      phoneNo,
      additionalNotes
    })
  }

  return (
    <div className="service-request-container">
      <div className="service-type-selection">
        <h2>Select Service Type</h2>
        <div className="service-type-buttons">
          {serviceTypes.map((service) => (
            <button 
              key={service.id}
              className={`service-type-btn ${selectedService === service.id ? 'active' : ''}`}
              onClick={() => setSelectedService(service.id)}
            >
              {service.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="service-request-form">
        <h3>Service Request Details</h3>
        
        <div className="form-group">
          <label>Address</label>
          <input 
            type="text" 
            placeholder="Enter your Address here"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone no</label>
          <input 
            type="tel" 
            placeholder="Enter the phone no"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea 
            placeholder="Any Specific details"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          ></textarea>
        </div>

        <div className="submit-section">
          <button type="submit" className="send-request-btn">
            Send Request
          </button>
        </div>
      </form>
    </div>
  )
}

export default Service