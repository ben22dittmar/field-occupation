import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "../assets/logo.png";

export function Start() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="start-container">
        <img src={logo} alt="TC Rot-Weiss Logo" className="start-logo" />
        <h1 className="start-title">Willkommen beim TC Rot-Weiss</h1>
        <button className="start-button" onClick={() => navigate("/login")}>
          Anmelden
        </button>
      </div>
    </div>
  );
}
