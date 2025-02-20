import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Supabase/Client";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMessage("Fehler beim Anmelden");
    } else {
      navigate("/dashboard")
    }
  };

  return (
    <div className="container">
      <h1 className="title">Anmeldung</h1>
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
      <button onClick={handleLogin} className="button">
        Anmelden
      </button>
      <button
        className="button home-button"
        onClick={() => navigate("/request-reset")}
      >
        Passwort zurücksetzen
      </button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
