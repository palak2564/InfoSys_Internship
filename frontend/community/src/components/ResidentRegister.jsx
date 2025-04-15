import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Register.css";

const SOCIETY_OPTIONS = ["Aravali Hills", "Green Valley", "Sunset Gardens", "Palm Heights", "Lakeside View", "Metro Apartments"];
const BLOCK_OPTIONS = ["Block A", "Block B", "Block C", "Block D", "Block E", "Block F"];

const ResidentRegister = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNo: "",
        societyName: "",
        block: "",
        flatNo: "",
    });
    const [message, setMessage] = useState({ text: "", isError: false });

    useEffect(() => {
        if (location.state?.email && location.state?.password) {
            setFormData(prevData => ({
                ...prevData,
                email: location.state.email,
                password: location.state.password
            }));
        }
    }, [location.state]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/residents/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage({ text: "Resident registered successfully!", isError: false });
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setMessage({ text: `Error: ${data.error}`, isError: true });
            }
        } catch {
            setMessage({ text: "Server connection error. Please try again.", isError: true });
        }
    };

    return (
        <div className="register_section">
            <div className="register_img">
                <img src="https://media.istockphoto.com/id/1165384568/photo/europe-modern-complex-of-residential-buildings.jpg?s=612x612&w=0&k=20&c=iW4NBiMPKEuvaA7h8wIsPHikhS64eR-5EVPfjQ9GPOA=" alt="Building" />
            </div>
            <div className="register_form">
                <h2>Resident Registration</h2>
                {message.text && <div className={`message ${message.isError ? "error" : "success"}`}>{message.text}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form_group">
                        <label>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required />
                    </div>
                    <div className="form_group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            readOnly={location.state?.email ? true : false}
                            required
                        />
                    </div>
                    <div className="form_group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            readOnly={location.state?.password ? true : false}
                            required
                        />
                    </div>
                    <div className="form_group">
                        <label>Phone</label>
                        <input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} placeholder="Enter your phone number" required />
                    </div>
                    <div className="form_group">
                        <label>Society Name</label>
                        <select 
                            name="societyName" 
                            value={formData.societyName} 
                            onChange={handleChange} 
                            required
                            className="dropdown_select"
                        >
                            <option value="">Select Society</option>
                            {SOCIETY_OPTIONS.map((society) => (
                                <option key={society} value={society}>{society}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form_group">
                        <label>Block</label>
                        <select 
                            name="block" 
                            value={formData.block} 
                            onChange={handleChange} 
                            required
                            className="dropdown_select"
                        >
                            <option value="">Select Block</option>
                            {BLOCK_OPTIONS.map((block) => (
                                <option key={block} value={block}>{block}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form_group">
                        <label>Flat No</label>
                        <input type="text" name="flatNo" value={formData.flatNo} onChange={handleChange} placeholder="Enter flat number" required />
                    </div>
                    <button type="submit">Register</button>
                </form>
                <p className="auth_switch">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default ResidentRegister;