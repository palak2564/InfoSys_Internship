import React, { useEffect, useState } from "react";
import "./ResidentEmergency.css";

const blocks = ["A", "B", "C", "D", "E", "F"];

const ResidentEmergency = () => {
  const [guards, setGuards] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchGuards = async () => {
      const res = await fetch("http://localhost:8080/guards");
      const data = await res.json();
      setGuards(data);
    };
    fetchGuards();
  }, []);

  const filtered = filter === "All" ? guards : guards.filter(g => g.block === filter);

  return (
    <div className="emergency-container">
      <h2>Security Guard Details</h2>
      <div className="filter-buttons">
        <button onClick={() => setFilter("All")}>All</button>
        {blocks.map(block => (
          <button key={block} onClick={() => setFilter(block)}>Block - {block}</button>
        ))}
      </div>

      {blocks.map(block => (
        <div key={block}>
          {(filter === "All" || filter === block) && (
            <>
              <h3>Block - {block}</h3>
              <table>
                <thead>
                  <tr><th>No</th><th>Name</th><th>Block</th><th>Phone no</th></tr>
                </thead>
                <tbody>
                  {filtered.filter(g => g.block === block).map((guard, idx) => (
                    <tr key={guard.id}>
                      <td>{idx + 1}</td>
                      <td>{guard.name}</td>
                      <td>{guard.block}</td>
                      <td>{guard.phoneNo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResidentEmergency;
