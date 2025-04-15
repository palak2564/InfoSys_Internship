import React, { useState } from "react";
import "./RequestServices.css";

const RequestServices = () => {
  const [serviceType, setServiceType] = useState("waterCan");

  return (
    <div className="service-request-container">
      <div className="service-section">
        <h3>Select Service Type</h3>
        <div className="service-types">
          <button 
            className={`service-type-btn ${serviceType === "waterCan" ? "active" : ""}`}
            onClick={() => setServiceType("waterCan")}
          >
            Water Can
          </button>
          <button 
            className={`service-type-btn ${serviceType === "houseKeeping" ? "active" : ""}`}
            onClick={() => setServiceType("houseKeeping")}
          >
            House Keeping
          </button>
          <button 
            className={`service-type-btn ${serviceType === "gas" ? "active" : ""}`}
            onClick={() => setServiceType("gas")}
          >
            Gas
          </button>
          <button 
            className={`service-type-btn ${serviceType === "plumbing" ? "active" : ""}`}
            onClick={() => setServiceType("plumbing")}
          >
            Plumbing
          </button>
          <button 
            className={`service-type-btn ${serviceType === "garbage" ? "active" : ""}`}
            onClick={() => setServiceType("garbage")}
          >
            Garbage Collection
          </button>
        </div>
      </div>

      <div className="service-details">
        <form className="service-form">
          <h3>Service Request Details</h3>
          <div className="form-group">
            <label>Address</label>
            <input type="text" placeholder="Enter your Address here" />
          </div>
          <div className="form-group">
            <label>Phone no</label>
            <input type="text" placeholder="Enter the Phone no" />
          </div>
          <div className="form-group">
            <label>Additional Notes</label>
            <textarea placeholder="Any Specific details"></textarea>
          </div>
        </form>
        <div className="make-request-section">
          <div className="request-illustration">
            <div className="request-bubble">Make a Request</div>
            <div className="request-person">
              <svg viewBox="0 0 100 150" width="100" height="150">
                <circle cx="50" cy="40" r="20" fill="#1f485b" />
                <rect x="30" y="60" width="40" height="60" fill="#1f485b" />
                <rect x="25" y="70" width="50" height="10" fill="#1f485b" rx="5" />
                <rect x="15" y="85" width="15" height="40" fill="#1f485b" />
                <rect x="70" y="85" width="15" height="40" fill="#1f485b" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestServices;