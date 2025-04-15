import { useState, useEffect } from "react";
import "./SocietyDataView.css";

// Predefined society options
const SOCIETY_OPTIONS = ["Aravali Hills", "Green Valley", "Sunset Gardens", "Palm Heights", "Lakeside View", "Metro Apartments"];
const BLOCK_OPTIONS = ["Block A", "Block B", "Block C", "Block D", "Block E", "Block F"];

const SocietyDataView = () => {
    const [selectedSociety, setSelectedSociety] = useState("");
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Mock data for demonstration purposes
    // In a real app, this would come from your API
    const mockResidents = [
        { id: 1, name: "Pavani", block: "Block A", flatNo: "A234", phoneNo: "9728163456", email: "pavani@gmail.com" },
        { id: 2, name: "Nihal Varma", block: "Block A", flatNo: "A128", phoneNo: "6302782498", email: "nihalvarma100@gmail.com" },
        { id: 3, name: "Rahul Singh", block: "Block B", flatNo: "B112", phoneNo: "9876543210", email: "rahul@gmail.com" },
        { id: 4, name: "Priya Sharma", block: "Block B", flatNo: "B305", phoneNo: "8765432109", email: "priya@gmail.com" },
        { id: 5, name: "Amit Kumar", block: "Block C", flatNo: "C217", phoneNo: "7654321098", email: "amit@gmail.com" },
        { id: 6, name: "Sneha Reddy", block: "Block D", flatNo: "D501", phoneNo: "9876123456", email: "sneha@gmail.com" },
    ];

    const fetchResidentsBySociety = (society) => {
        setLoading(true);
        setError("");
        
        // Simulating API call with setTimeout
        setTimeout(() => {
            try {
                // Filter the mock data based on selected society
                // In a real app, you would call your backend API here
                const filteredResidents = mockResidents.filter(
                    resident => resident.societyName === society || true // Always true for mock data
                );
                setResidents(filteredResidents);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch residents data");
                setLoading(false);
            }
        }, 500);
    };

    const handleSocietyChange = (e) => {
        const society = e.target.value;
        setSelectedSociety(society);
        if (society) {
            fetchResidentsBySociety(society);
        } else {
            setResidents([]);
        }
    };

    // Group residents by block
    const residentsByBlock = residents.reduce((acc, resident) => {
        if (!acc[resident.block]) {
            acc[resident.block] = [];
        }
        acc[resident.block].push(resident);
        return acc;
    }, {});

    return (
        <div className="society_view_container">
            <h1>Society Data View</h1>
            
            <div className="society_selector">
                <label htmlFor="society-select">Select Society:</label>
                <select 
                    id="society-select"
                    value={selectedSociety} 
                    onChange={handleSocietyChange}
                    className="society_dropdown"
                >
                    <option value="">-- Select a Society --</option>
                    {SOCIETY_OPTIONS.map(society => (
                        <option key={society} value={society}>{society}</option>
                    ))}
                </select>
            </div>

            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error_message">{error}</div>}
            
            {selectedSociety && !loading && !error && (
                <div className="society_data">
                    <h2>{selectedSociety}</h2>
                    
                    {Object.keys(residentsByBlock).length > 0 ? (
                        BLOCK_OPTIONS.map(block => {
                            if (!residentsByBlock[block]) return null;
                            
                            return (
                                <div key={block} className="block_section">
                                    <h3>{block}</h3>
                                    <div className="residents_grid">
                                        {residentsByBlock[block].map(resident => (
                                            <div key={resident.id} className="resident_card">
                                                <h4>{resident.name}</h4>
                                                <p>Flat: {resident.flatNo}</p>
                                                <p>Phone: {resident.phoneNo}</p>
                                                <p>Email: {resident.email}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="no_data">No residents found in this society.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SocietyDataView;