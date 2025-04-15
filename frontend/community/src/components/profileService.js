// src/components/ResidentProfile/profileService.js

import axios from "axios";

const API_URL = "http://localhost:8080/residents";

class ProfileService {
  // Fetch resident by ID
  async getResidentById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching resident by ID: " + error.message);
    }
  }

  // Fetch resident by email
  async getResidentByEmail(email) {
    try {
      const response = await axios.get(`${API_URL}/by-email?email=${email}`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching resident by email: " + error.message);
    }
  }

  // Update resident profile
  async updateProfile(id, residentData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, residentData);
      return response.data;
    } catch (error) {
      throw new Error("Error updating resident profile: " + error.message);
    }
  }
}

export default new ProfileService();
