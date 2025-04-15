import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState({ text: "", isError: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", isError: false });
    
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid credentials");
      }

      const data = await response.json();
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('residentId', data.user._id);
      localStorage.setItem('token', data.token);
      setMessage({ text: "Login successful!", isError: false });
      
      // Redirect based on user role (using lowercase comparison)
      setTimeout(() => {
        if (data.user.role && data.user.role.toLowerCase() === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/resident-dashboard');
        }
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setMessage({ 
        text: error.message || "Server connection error. Please try again.", 
        isError: true 
      });
    } finally {
      setIsLoading(false);
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
          <h2>Welcome Back</h2>
          <p className="welcome">Sign in to your account</p>
          
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
              <div className="forgot_password">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            </div>
            <button 
              type="submit" 
              className={isLoading ? "loading" : ""}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="auth_switch">
            Don't have an account? <Link to="/signup">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;