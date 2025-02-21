import { useAuth } from "../Auth/auth";
import { supabase } from "../Supabase/Client";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funktion zum Laden der Reservierungen
  const fetchReservations = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("Reservations")
        .select(`*, Fields(name)`) // Join mit der Fields-Tabelle, um den Namen des Platzes zu bekommen
        .eq("user_id", user.id)
        .order("date", { ascending: true })
        .order("time_start", { ascending: true })
        .limit(2); // Maximale Anzahl anzuzeigender Reservierungen

      if (error) {
        throw error;
      }

      setReservations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Lade die Reservierungen beim ersten Rendern
  useEffect(() => {
    fetchReservations();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/home");
  };

  return (
    <div className="dashboard-container">
      <h1>Willkommen!</h1>
      <div className="dashboard-content">
        <p>{user.email}</p>
        <h2 className="dashboard-title">Meine Reservierungen</h2>

      <div className="reservation-card">
        {loading ? (
          <p>Lade Reservierungen...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : reservations.length === 0 ? (
          <p>Keine Reservierungen vorhanden</p>
        ) : (
          <div className="reservation-list">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="reservation-item">
                <h2 className="reservation-field">{reservation.Fields.name}</h2>
                <p>Datum: {new Date(reservation.date).toLocaleDateString()}</p>
                <p>
                  Zeit: {reservation.time_start} - {reservation.time_end}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="button-container">
          <button className="neutral-button" onClick={() => navigate("/request-reset")}>Alle anzeigen</button>
          <button className="neutral-button">Neue Reservierung</button>
        </div>
      </div>

        <button className="logout-button" onClick={handleLogout}>
          Abmelden
        </button>
      </div>
    </div>
  );
}
