import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ResidentProfile.css";
import profileService from "./profileService.js";

const ResidentProfile = () => {
  const { id: routeId } = useParams();
  const id = routeId || localStorage.getItem("residentId"); // Use route ID or fallback to localStorage ID

  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Resident ID not found in localStorage");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await profileService.getResidentById(id); // Fetch resident data using the ID
        setResident(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!resident) return <div className="error">Profile not found</div>;

  return (
    <div className="user-profile">
      <div className="profile-card">
        <div className="profile-left">
          <h2>{resident.name}</h2>
          <p>Flat - {resident.flatNo}</p>
        </div>
        
        <div className="profile-right">
          <h3 className="section-title">INFORMATION</h3>
          <hr className="divider" />
          
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Society Name</div>
              <div className="info-value">{resident.societyName}</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">Name</div>
              <div className="info-value">{resident.name}</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">Block</div>
              <div className="info-value">{resident.block}</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">Flat No</div>
              <div className="info-value">{resident.flatNo}</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">Phone</div>
              <div className="info-value">{resident.phoneNo}</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">Email</div>
              <div className="info-value">{resident.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentProfile;
