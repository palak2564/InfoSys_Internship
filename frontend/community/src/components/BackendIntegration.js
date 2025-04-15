// This file contains the backend integration service

const API_URL = "http://localhost:8080/api";

export const ComplaintService = {
  // Get all complaints
  getAllComplaints: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/complaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching complaints:", error);
      throw error;
    }
  },
  
  // Get complaints by status
  getComplaintsByStatus: async (status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/complaints/status/${status}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${status} complaints:`, error);
      throw error;
    }
  },
  
  // Search complaints
  searchComplaints: async (query) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/complaints/search?query=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error searching complaints:", error);
      throw error;
    }
  },
  
  // Update complaint status
  updateComplaintStatus: async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/complaints/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error updating complaint status:", error);
      throw error;
    }
  },
  
  // Close complaint
  closeComplaint: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/complaints/${id}/close`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error closing complaint:", error);
      throw error;
    }
  }
};