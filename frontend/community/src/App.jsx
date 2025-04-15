import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import AdminRegister from "./components/AdminRegister";
import ResidentRegister from "./components/ResidentRegister";
import Home from "./components/Home";
import ResidentManagement from "./components/ResidentManagement";
import SocietyManagement from "./components/SocietyManagement";
import ResidentDashboard from "./components/ResidentDashboard";
import ResidentProfile from "./components/ResidentProfile";
import AdminDashboard from "./components/AdminDashboard";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/admin-register" element={<AdminRegister />} />
                <Route path="/resident-register" element={<ResidentRegister />} />

                <Route path="/resident-dashboard" element={<ResidentDashboard />} />
                <Route path="/resident-profile" element={<ResidentProfile />} />

                <Route path="/admin-dashboard" element={<AdminDashboard />} />


                <Route path="/society-management" element={<SocietyManagement />} />
                <Route path="/resident-management" element={<ResidentManagement />} />

            </Routes>
        </Router>
    );
}

export default App;
