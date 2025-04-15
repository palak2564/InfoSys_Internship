import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PaymentComponent.css";

const AdminPaymentComponent = () => {
  const [flatNo, setFlatNo] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [status, setStatus] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:8080/api/payments/all");
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching payments", error);
      setError("Failed to load payment data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flatNo || !amount || !paymentId || !status) return;

    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:8080/api/payments/create", {
        flatNo,
        amount,
        paymentId,
        status
      });
      
      // Clear form fields
      setFlatNo("");
      setAmount("");
      setPaymentId("");
      setStatus("");
      
      // Refresh payment list
      fetchPayments();
    } catch (error) {
      console.error("Error adding payment", error);
      setError("Failed to add payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>Admin Payment Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="payment-section">
        <div className="form-container">
          <h3>Add New Payment</h3>
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label htmlFor="flatNo">Flat Number:</label>
              <input
                id="flatNo"
                type="text"
                value={flatNo}
                onChange={(e) => setFlatNo(e.target.value)}
                placeholder="Enter flat number"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="amount">Amount:</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="paymentId">Payment ID:</label>
              <input
                id="paymentId"
                type="text"
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
                placeholder="Enter payment ID"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Status:</label>
              <select 
                id="status"
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Select Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Add Payment"}
            </button>
          </form>
        </div>
        
        <div className="table-container">
          <h3>Payment Records</h3>
          {loading && <div className="loading">Loading payments...</div>}
          
          {payments.length === 0 && !loading ? (
            <div className="no-data">No payment records found</div>
          ) : (
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Flat No</th>
                  <th>Amount</th>
                  <th>Payment ID</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, idx) => (
                  <tr key={idx} className={p.status === "Paid" ? "status-paid" : "status-pending"}>
                    <td>{p.flatNo}</td>
                    <td>₹{p.amount}</td>
                    <td>{p.paymentId}</td>
                    <td>
                      <span className={`status-badge ${p.status.toLowerCase()}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>{p.paymentDate ? new Date(p.paymentDate).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          <button className="refresh-button" onClick={fetchPayments} disabled={loading}>
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentComponent;