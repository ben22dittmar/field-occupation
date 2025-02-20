import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Supabase/Client";

export function RequestReset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordResetRequest = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setMessage("Ein Fehler ist aufgetreten");
    } else {
      setMessage("E-Mail zum Zurücksetzen des Passworts gesendet!");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Passwort zurücksetzen</h1>
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
      />
      <button onClick={handlePasswordResetRequest} className="button">
        Passwort zurücksetzen
      </button>
      <button className="button home-button" onClick={() => navigate("/login")}>
        Zurück zur Anmeldung
      </button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
