import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Supabase/Client"; // Importiere deinen Supabase-Client
import "../App.css";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // State für die E-Mail
  const [password, setPassword] = useState(""); // State für das Passwort
  const [error, setError] = useState(""); // State für Fehlermeldungen

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession(); // Prüfe die aktuelle Session
      if (session) {
        // Benutzer ist eingeloggt, leite zur Übersicht weiter
        //navigate("/overview");
      }
    };

    checkUser();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault(); // Verhindere das Neuladen der Seite
    setError(""); // Setze vorherige Fehlermeldungen zurück

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(
          "Sie haben keine gültigen Anmeldedaten eingegeben, bitte überprüfen Sie ihre Eingabe"
        ); // Zeige die Fehlermeldung an
      } else {
        navigate("/overview"); // Weiterleitung bei erfolgreichem Login
      }
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten."); // Allgemeine Fehlermeldung
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <h1>Anmeldung</h1>
        <p>Bitte geben Sie Ihre Anmeldedaten ein.</p>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            Anmelden
          </button>
        </form>
        {error && <p className="login-error">{error}</p>}{" "}
        {/* Fehlermeldung anzeigen */}
        <button
          className="reset-password-button"
          onClick={() => navigate("/request-password-reset")}
        >
          Passwort vergessen?
        </button>
      </div>
    </div>
  );
}
