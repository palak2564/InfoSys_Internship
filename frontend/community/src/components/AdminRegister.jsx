import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Register.css";

// Predefined society options
const SOCIETY_OPTIONS = ["Aravali Hills", "Green Valley", "Sunset Gardens", "Palm Heights", "Lakeside View", "Metro Apartments"];

function AdminRegister() {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNo: "",
        societyName: "",
        address: "",
        city: "",
        district: "",
        postal: "",
    });
    const [message, setMessage] = useState({ text: "", isError: false });

    useEffect(() => {
        // Get email and password from location state if available
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
            const response = await fetch("http://localhost:8080/admins/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage({ text: "Admin registered successfully!", isError: false });
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setMessage({ text: `Error: ${data.error || "Failed to register"}`, isError: true });
            }
        } catch (error) {
            setMessage({ text: "Server connection error. Please try again.", isError: true });
        }
    };

    return (
        <div className="register_section">
            <div className="register_img">
                <img src="https://media.istockphoto.com/id/1165384568/photo/europe-modern-complex-of-residential-buildings.jpg?s=612x612&w=0&k=20&c=iW4NBiMPKEuvaA7h8wIsPHikhS64eR-5EVPfjQ9GPOA=" alt="Building" />
            </div>
            <div className="register_form">
                <h2>Admin Registration</h2>
                {message.text && (
                    <div className={`message ${message.isError ? "error" : "success"}`}>
                        {message.text}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form_group">
                        <label>Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Enter your name" />
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
                        <label>Phone No</label>
                        <input type="text" name="phoneNo" required value={formData.phoneNo} onChange={handleChange} placeholder="Enter phone number" />
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
                        <label>Society Address</label>
                        <input type="text" name="address" required value={formData.address} onChange={handleChange} placeholder="Enter society address" />
                    </div>
                    <div className="form_group">
                        <label>City</label>
                        <input type="text" name="city" required value={formData.city} onChange={handleChange} placeholder="Enter city" />
                    </div>
                    <div className="form_group">
                        <label>District</label>
                        <input type="text" name="district" required value={formData.district} onChange={handleChange} placeholder="Enter district" />
                    </div>
                    <div className="form_group">
                        <label>Postal Code</label>
                        <input type="text" name="postal" required value={formData.postal} onChange={handleChange} placeholder="Enter postal code" />
                    </div>
                    <button type="submit">Register</button>
                </form>
                <p className="auth_switch">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
}

export default AdminRegister;