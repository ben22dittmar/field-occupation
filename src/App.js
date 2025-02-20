import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Navigate
} from "react-router-dom";
import { motion } from "framer-motion";
import "./App.css";
import logoImage from "./assets/logo.png";
import { Login } from "./Auth/Login";
import { RequestReset } from "./Auth/RequestPasswordReset";
import { ResetPassword } from "./Auth/ResetPassword";
import { Dashboard } from "./Components/Dashboard";
import PrivateRoute from "./Components/PrivateRoute";
import { AuthProvider } from "./Auth/auth";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/request-reset" element={<RequestReset />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <img src={logoImage} alt="Logo" className="logo" />
        <h1 className="title">Willkommen beim TC Rot-Weiß</h1>
        <button
          className="button home-button"
          onClick={() => navigate("/login")}
        >
          Anmelden
        </button>
      </motion.div>
    </div>
  );
}
