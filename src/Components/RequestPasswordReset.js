import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Supabase/Client"; // Importiere deinen Supabase-Client
import "../App.css";

export function RequestPasswordReset() {
  const [email, setEmail] = useState(""); // State für die E-Mail
  const [message, setMessage] = useState(""); // State für Erfolgsmeldungen
  const [error, setError] = useState(""); // State für Fehlermeldungen
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault(); // Verhindere das Neuladen der Seite
    setMessage(""); // Setze vorherige Erfolgsmeldungen zurück
    setError(""); // Setze vorherige Fehlermeldungen zurück

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        setError(
          "Es gab ein Problem beim Senden der Passwort-Reset-E-Mail. Bitte überprüfen Sie ihre Eingabe."
        );
      } else {
        setMessage(
          "Eine Passwort-Reset-E-Mail wurde an Ihre E-Mail-Adresse gesendet."
        );
      }
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    }
  };

  return (
    <div className="login-container">
      <h1>Passwort zurücksetzen</h1>
      <p>
        Geben Sie Ihre E-Mail-Adresse ein, um eine E-Mail zum Zurücksetzen Ihres
        Passworts zu erhalten.
      </p>
      <form onSubmit={handlePasswordReset} className="login-form">
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />
        <button type="submit" className="login-button">
          Passwort zurücksetzen
        </button>
      </form>
      {message && <p className="login-success">{message}</p>}{" "}
      {/* Erfolgsmeldung */}
      {error && <p className="login-error">{error}</p>} {/* Fehlermeldung */}
      <button
        className="reset-password-button"
        onClick={() => navigate("/login")}
      >
        Zurück zur Anmeldung
      </button>
    </div>
  );
}
