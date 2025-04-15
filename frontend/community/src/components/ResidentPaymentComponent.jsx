import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./PaymentComponent.css";

const ResidentPaymentComponent = () => {
  const [billings, setBillings] = useState([
    { id: 1, flatNo: "A234", name: "resident2", amount: 3500, status: "Pending" },
  ]);
  const [newBilling, setNewBilling] = useState({ name: "", amount: "" });
  const [userRole, setUserRole] = useState(null);

  // Get user role from localStorage
  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (userProfile && userProfile.role) {
      setUserRole(userProfile.role);
    }
  }, []);

  const handleAddBilling = () => {
    if (!newBilling.name || !newBilling.amount) {
      alert("Please enter both Name and Amount.");
      return;
    }

    const newBill = {
      id: Date.now(),
      flatNo: `A${Math.floor(Math.random() * 10000)}`,
      name: newBilling.name,
      amount: parseFloat(newBilling.amount),
      status: "Pending",
    };

    setBillings([...billings, newBill]);
    setNewBilling({ name: "", amount: "" });
  };

  const handleDelete = (id) => {
    setBillings(billings.filter((billing) => billing.id !== id));
  };

  const handleRazorpayPayment = (billing) => {
    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => initializeRazorpayPayment(billing);
      document.body.appendChild(script);
    } else {
      initializeRazorpayPayment(billing);
    }
  };

  const initializeRazorpayPayment = (billing) => {
    const options = {
      key: "rzp_test_dsVcKukDI9yfCV", // Your Razorpay test API Key
      amount: billing.amount * 100, // Amount in paise
      currency: "INR",
      name: "Your Company",
      description: `Payment for ${billing.name}`,
      handler: (response) => {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        updatePaymentStatus(billing.id);
      },
      prefill: {
        name: billing.name,
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
      modal: {
        ondismiss: function() {
          console.log("Payment dialog closed");
          // You can choose to update status or show a message even on dismissal
          // Uncomment below line if you want to mark as paid even on dismissal for testing
          // updatePaymentStatus(billing.id);
        }
      }
    };

    try {
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      alert("For testing purposes, marking as paid even though Razorpay failed to load");
      updatePaymentStatus(billing.id);
    }
  };

  const updatePaymentStatus = (billingId) => {
    setBillings((prev) =>
      prev.map((b) =>
        b.id === billingId ? { ...b, status: "Paid" } : b
      )
    );
  };

  return (
    <div className="billings-container">
      <h1>Billing Management</h1>

      {/* Add Billing - Only for Admin */}
      {userRole === "admin" && (
        <div className="add-billing">
          <input
            type="text"
            placeholder="Resident Name"
            value={newBilling.name}
            onChange={(e) => setNewBilling({ ...newBilling, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Amount"
            value={newBilling.amount}
            onChange={(e) => setNewBilling({ ...newBilling, amount: e.target.value })}
          />
          <button onClick={handleAddBilling}><FaPlus /> Add Billing</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Flat No</th>
            <th>Name</th>
            <th>Amount (₹)</th>
            <th>Status</th>
            <th>Actions</th>
            {userRole === "admin" && <th>Delete</th>}
          </tr>
        </thead>
        <tbody>
          {billings.map((billing) => (
            <tr key={billing.id}>
              <td>{billing.flatNo}</td>
              <td>{billing.name}</td>
              <td>₹{billing.amount}</td>
              <td>{billing.status}</td>
              <td>
                {billing.status === "Pending" ? (
                  <button onClick={() => handleRazorpayPayment(billing)}>
                    Pay Now
                  </button>
                ) : (
                  <span>Paid</span>
                )}
              </td>
              {userRole === "admin" && (
                <td>
                  <button onClick={() => handleDelete(billing.id)}>
                    <FaTrash />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResidentPaymentComponent;