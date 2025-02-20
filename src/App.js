import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";
import logoImage from "./assets/logo.png";


const REACT_APP_SUPABASE_URL="https://geqybducuupvfjgowwzg.supabase.co";
const REACT_APP_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlcXliZHVjdXVwdmZqZ293d3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NzQ4NDYsImV4cCI6MjA1NTU1MDg0Nn0.FAEKaffasB773HhZu55DgT-OelJG6pTmZOK_1L38r7k";
        

const supabase = createClient(REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <div className="container">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <img src={logoImage} alt="Logo" className="logo" />
        <h1 className="title">Willkommen beim TC Rot-Weiß</h1>
        <Link to="/login" className="button-link">
          <button className="button home-button">Anmelden</button>
        </Link>
      </motion.div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else if (user) {
      console.log(user)
    } else {
      setMessage("Erfolgreich eingeloggt!");
    }
  };

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Passwort-Reset-E-Mail gesendet!");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login Seite</h1>
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <button onClick={handleLogin} className="button">Anmelden</button>
      <button onClick={handlePasswordReset} className="button secondary">Passwort zurücksetzen</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage("Error resetting password: " + error.message);
    } else {
      setMessage("Password successfully updated.");
    }
  };

  return (
    <div className="reset-password-container">
      <h1 className="reset-title">Reset Password</h1>
      <input 
        type="password" 
        placeholder="Enter new password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="input-field"
      />
      <button onClick={handleReset} className="button">Submit</button>
      {message && <p>{message}</p>}
    </div>
  );
}