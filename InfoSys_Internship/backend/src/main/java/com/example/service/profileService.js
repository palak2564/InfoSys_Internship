import axios from "axios";

const API_URL = "http://localhost:8080/residents";

class ProfileService {
  async getResidentById(id) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }

  async getResidentByEmail(email) {
    const response = await axios.get(`${API_URL}/by-email?email=${email}`);
    return response.data;
  }

  async updateProfile(id, residentData) {
    const response = await axios.put(`${API_URL}/${id}`, residentData);
    return response.data;
  }
}

export default new ProfileService();