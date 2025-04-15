"use client"

import { useState, useEffect } from "react"
import "./ServicesList.css"

const ServicesList = () => {
  const [vendors, setVendors] = useState([
    {
      no: 1,
      name: "Aman",
      service: "Water Can",
      company: "Pure Water Limited",
      phoneNo: "9022569918"
    }
  ])

  return (
    <div className="admin-services-container">
      <div className="vendor-services-section">
        <div className="vendor-services-card">
          <h3>Total Number of Services</h3>
          <p>{vendors.length}</p>
        </div>
      </div>

      <div className="vendors-list-section">
        <div className="vendors-list-header">
          <h2>Vendors List</h2>
          <button className="add-vendor-btn">Add Vendor</button>
        </div>

        <table className="vendors-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Service</th>
              <th>Company</th>
              <th>Phone No</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.no}>
                <td>{vendor.no}</td>
                <td>{vendor.name}</td>
                <td>{vendor.service}</td>
                <td>{vendor.company}</td>
                <td>{vendor.phoneNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ServicesList