import React, { useEffect, useState } from "react";
import "./AdminEmergency.css";

const blocks = ["A", "B", "C", "D", "E", "F"];

const AdminEmergency = () => {
  const [guards, setGuards] = useState([]);
  const [filter, setFilter] = useState("All");
  const [newGuard, setNewGuard] = useState({ name: "", phoneNo: "", block: "A" });
  const [error, setError] = useState("");

  const fetchGuards = async () => {
    try {
      const res = await fetch("http://localhost:8080/guards");
      const data = await res.json();
      setGuards(data);
    } catch (err) {
      console.error("Failed to fetch guards", err);
    }
  };

  const validate = () => {
    if (!newGuard.name.trim() || !newGuard.phoneNo.trim()) {
      setError("Name and Phone Number are required.");
      return false;
    }
    if (!/^\d{10}$/.test(newGuard.phoneNo)) {
      setError("Phone number must be 10 digits.");
      return false;
    }
    setError("");
    return true;
  };

  const handleAdd = async () => {
    if (!validate()) return;

    try {
      await fetch("http://localhost:8080/guards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGuard),
      });
      setNewGuard({ name: "", phoneNo: "", block: "A" });
      fetchGuards();
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/guards/${id}`, { method: "DELETE" });
    fetchGuards();
  };

  useEffect(() => {
    fetchGuards();
  }, []);

  const filtered = filter === "All" ? guards : guards.filter(g => g.block === filter);

  return (
    <div className="emergency-container">
      <h2>Security Guard Details</h2>

      <div className="filter-buttons">
        <button className={filter === "All" ? "active" : ""} onClick={() => setFilter("All")}>All</button>
        {blocks.map(block => (
          <button
            key={block}
            className={filter === block ? "active" : ""}
            onClick={() => setFilter(block)}
          >
            Block {block}
          </button>
        ))}
      </div>

      <div className="add-guard-form">
        <input
          placeholder="Name"
          value={newGuard.name}
          onChange={(e) => setNewGuard({ ...newGuard, name: e.target.value })}
        />
        <input
          placeholder="Phone"
          value={newGuard.phoneNo}
          onChange={(e) => setNewGuard({ ...newGuard, phoneNo: e.target.value })}
        />
        <select
          value={newGuard.block}
          onChange={(e) => setNewGuard({ ...newGuard, block: e.target.value })}
        >
          {blocks.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <button onClick={handleAdd}>+ Add Security</button>
      </div>
      {error && <div className="error">{error}</div>}

      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Block</th>
            <th>Phone no</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((guard, idx) => (
            <tr key={guard.id}>
              <td>{idx + 1}</td>
              <td>{guard.name}</td>
              <td>{guard.block}</td>
              <td>{guard.phoneNo}</td>
              <td><button onClick={() => handleDelete(guard.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEmergency;
