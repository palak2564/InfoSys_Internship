import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'resident'
  });
  const [message, setMessage] = useState({ text: "", isError: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match", isError: true });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/auth/check-email?email=${formData.email}`);
      const data = await response.json();
      
      if (data.exists) {
        setMessage({ text: "Email already in use. Please use a different email or login.", isError: true });
        return;
      }
      
      if (formData.userType === 'admin') {
        navigate('/admin-register', { 
          state: { email: formData.email, password: formData.password } 
        });
      } else {
        navigate('/resident-register', { 
          state: { email: formData.email, password: formData.password } 
        });
      }
    } catch (error) {
      setMessage({ text: "Server connection error. Please try again.", isError: true });
    }
  };

  return (
    <div className="login_section">
      <div className="login_img">
        <img src="https://media.istockphoto.com/id/1165384568/photo/europe-modern-complex-of-residential-buildings.jpg?s=612x612&w=0&k=20&c=iW4NBiMPKEuvaA7h8wIsPHikhS64eR-5EVPfjQ9GPOA=" alt="Building" />
      </div>
      <div className="login_form">
        <div className="logo">
          <img src="https://media.istockphoto.com/id/1171963676/vector/teamwork-social-network-icon-vector-graphic-illustration-stock-illustration.jpg?s=612x612&w=0&k=20&c=iEOjsh56PBxsjT9evKfDylGh7l0TmFhOVP2LHaz0rwU=" alt="CommUnity Logo" />
          <div className="logo_text">
            <h1>CommUnity</h1>
            <p>Seamless Community Interaction and Management</p>
          </div>
        </div>
        
        <div className="form_container">
          <h2>Create Account</h2>
          <p className="welcome">Sign up to get started</p>
          
          {message.text && (
            <div className={`message ${message.isError ? "error" : "success"}`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form_group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email" 
                required
              />
            </div>
            <div className="form_group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password" 
                required
              />
            </div>
            <div className="form_group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password" 
                required
              />
            </div>
            <div className="form_group">
              <label>I am a:</label>
              <div className="radio_group">
                <label>
                  <input 
                    type="radio" 
                    name="userType" 
                    value="resident" 
                    checked={formData.userType === 'resident'}
                    onChange={handleChange}
                  />
                  Resident
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="userType" 
                    value="admin" 
                    checked={formData.userType === 'admin'}
                    onChange={handleChange}
                  />
                  Admin
                </label>
              </div>
            </div>
            <button type="submit">Continue</button>
          </form>
          <p className="auth_switch">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;