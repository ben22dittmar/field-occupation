import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Supabase/Client"; // Importiere deinen Supabase-Client
import { isAdmin } from "../Supabase/Roles"; // Importiere die Rollenprüfung
import "../App.css";

export function Overview() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]); // State für Reservierungen
  const [loading, setLoading] = useState(true); // State für den Ladezustand
  const [error, setError] = useState(""); // State für Fehlermeldungen
  const [isUserAdmin, setIsUserAdmin] = useState(false); // State für Admin-Status
  const [showAllReservations, setShowAllReservations] = useState(false); // State für Admin-Toggle

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // Prüfe, ob der Benutzer eingeloggt ist
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          navigate("/start"); // Weiterleitung zur Startseite, falls nicht eingeloggt
          return;
        }

        // Prüfe, ob der Benutzer ein Admin ist
        const userId = session.user.id;
        setIsUserAdmin(isAdmin(userId)); // Setze den Admin-Status

        // Hole die Reservierungen
        await loadReservations(userId, isAdmin(userId) && showAllReservations);
      } catch (err) {
        setError("Ein unerwarteter Fehler ist aufgetreten.");
      } finally {
        setLoading(false); // Ladezustand beenden
      }
    };

    fetchReservations();
  }, [navigate, showAllReservations]);

  const loadReservations = async (userId, fetchAll) => {
    setLoading(true);
    setError("");

    try {
      const query = supabase
        .from("reservations")
        .select("id, field_id, date, time_start, time_end, fields(name)")
        .gte("date", new Date().toISOString().split("T")[0]) // Nur heutige oder zukünftige Reservierungen
        .order("date", { ascending: true });

      if (!fetchAll) {
        query.eq("user_id", userId); // Nur eigene Reservierungen
      }

      const { data, error } = await query;

      if (error) {
        setError("Fehler beim Laden der Reservierungen.");
      } else {
        setReservations(data || []);
      }
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Möchten Sie diese Reservierung wirklich löschen?")) {
      try {
        const { error } = await supabase.from("reservations").delete().eq("id", id);
        if (error) {
          alert("Fehler beim Löschen der Reservierung.");
        } else {
          setReservations((prev) => prev.filter((res) => res.id !== id)); // Entferne die gelöschte Reservierung aus der Liste
        }
      } catch (err) {
        alert("Ein unerwarteter Fehler ist aufgetreten.");
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("de-DE"); // Format: dd.mm.yyyy
  };

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}Z`).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }); // Format: hh:mm
  };

  return (
    <div className="page-container">
      <div className="overview-header">
        <h1>Reservierungen</h1>
      </div>
      <button className="overview-button" onClick={() => navigate("/new-reservation")}>
        Neue Reservierung
      </button>
      {isUserAdmin && (
        <div className="admin-toggle">
          <label>
            <input
              type="checkbox"
              checked={showAllReservations}
              onChange={(e) => setShowAllReservations(e.target.checked)}
            />
            Alle Reservierungen aller Benutzer anzeigen
          </label>
        </div>
      )}
      {loading ? (
        <div className="loading-spinner">Lädt...</div> // Ladekringel
      ) : error ? (
        <p className="error-message">{error}</p> // Fehlermeldung
      ) : reservations.length === 0 ? (
        <p className="no-reservations">Keine Reservierungen gefunden.</p> // Keine Reservierungen
      ) : (
        <div className="reservations-list">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <div className="reservation-info">
                <p><strong>Feld:</strong> {reservation.fields.name}</p>
                <p><strong>Datum:</strong> {formatDate(reservation.date)}</p>
                <p><strong>Zeit:</strong> {formatTime(reservation.time_start)} - {formatTime(reservation.time_end)}</p>
              </div>
              <div className="reservation-menu">
                <button
                  className="delete-button"
                  onClick={() => handleDelete(reservation.id)}
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="logout-button" onClick={() => supabase.auth.signOut().then(() => navigate("/start"))}>
        Abmelden
      </button>
    </div>
  );
}