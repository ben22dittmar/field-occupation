import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Supabase/Client";

export function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [successful, setStatus] = useState(false);

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage("Ein Fehler ist aufgetreten");
    } else {
      setStatus(true);
    }
  };

  return (
    <div className="container">
      {!successful && (
        <>
          <h1 className="title">Neues Passwort festlegen</h1>
          <input
            type="password"
            placeholder="Neues Passwort eingeben"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <button onClick={handleReset} className="button">
            Submit
          </button>
        </>
      )}
      {successful && (
        <>
          <button
            className="button home-button"
            onClick={() => navigate("/login")}
          >
            Zurück zur Anmeldung
          </button>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}
