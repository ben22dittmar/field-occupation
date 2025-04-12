import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Supabase/Client"; // Importiere deinen Supabase-Client
import "../App.css";

export function SetPassword() {
  const [password, setPassword] = useState(""); // State für das Passwort
  const [confirmPassword, setConfirmPassword] = useState(""); // State für die Passwort-Bestätigung
  const [error, setError] = useState(""); // State für Fehlermeldungen
  const [message, setMessage] = useState(""); // State für Erfolgsmeldungen
  const [isSuccess, setIsSuccess] = useState(false); // State für den Erfolg
  const navigate = useNavigate();

  const handleSetPassword = async (e) => {
    e.preventDefault(); // Verhindere das Neuladen der Seite
    setError(""); // Setze vorherige Fehlermeldungen zurück
    setMessage(""); // Setze vorherige Erfolgsmeldungen zurück

    if (password !== confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError("Es gab ein Problem beim Festlegen des neuen Passworts.");
      } else {
        setMessage("Ihr Passwort wurde erfolgreich geändert.");
        setIsSuccess(true); // Erfolg setzen
      }
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <h1>Neues Passwort festlegen</h1>
        {!isSuccess ? (
          <form onSubmit={handleSetPassword} className="login-form">
            <p>Bitte geben Sie Ihr neues Passwort ein.</p>
            <input
              type="password"
              placeholder="Neues Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <input
              type="password"
              placeholder="Passwort bestätigen"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="login-input"
            />
            <button type="submit" className="login-button">
              Passwort festlegen
            </button>
          </form>
        ) : (
          <div>
            <p className="login-success">{message}</p>
            <button className="login-button" onClick={() => navigate("/login")}>
              Zur Anmeldung
            </button>
          </div>
        )}
        {error && <p className="login-error">{error}</p>} {/* Fehlermeldung */}
      </div>
    </div>
  );
}
