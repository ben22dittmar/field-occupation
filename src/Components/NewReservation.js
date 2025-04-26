import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Supabase/Client";
import { isAdmin } from "../Supabase/Roles"; // Importiere die Rollenprüfung
import "../App.css";

export function NewReservation() {
  const navigate = useNavigate();
  const [date, setDate] = useState(""); // State für das Datum
  const [timeFrom, setTimeFrom] = useState(""); // State für Zeit von
  const [timeTo, setTimeTo] = useState(""); // State für Zeit bis
  const [fields, setFields] = useState([]); // State für alle Felder
  const [availableFields, setAvailableFields] = useState([]); // State für verfügbare Felder
  const [selectedField, setSelectedField] = useState(""); // State für das ausgewählte Feld
  const [error, setError] = useState(""); // State für Fehlermeldungen
  const [isUserAdmin, setIsUserAdmin] = useState(false); // State für Admin-Status
  const [dropdownEnabled, setDropdownEnabled] = useState(false); // Dropdown aktivieren/deaktivieren
  const [userId, setUserId] = useState(null); // State für die Benutzer-ID

  const isCheckAvailabilityDisabled = !date || !timeFrom || !timeTo; // Prüfen, ob alle Felder ausgefüllt sind

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/start"); // Weiterleitung zur Startseite, falls nicht eingeloggt
        return;
      }

      setUserId(session.user.id); // Benutzer-ID aus der Session setzen
      setIsUserAdmin(isAdmin(session.user.id)); // Admin-Status setzen

      // Felder aus der Datenbank abrufen
      const { data, error } = await supabase.from("fields").select("*");
      if (error) {
        setError("Fehler beim Laden der Felder.");
      } else {
        setFields(data || []);
      }
    };

    checkUser();
  }, [navigate]);

  const validateInputs = () => {
    setError("");

    // Datum validieren
    const today = new Date().toISOString().split("T")[0];
    if (!date || date < today) {
      setError("Das Datum muss heute oder in der Zukunft liegen.");
      return false;
    }

    // Zeit validieren
    if (!timeFrom || !timeTo) {
      setError("Bitte wählen Sie eine gültige Zeit aus.");
      return false;
    }

    if (parseInt(timeFrom) >= parseInt(timeTo)) {
      setError("Die Endzeit muss später als die Startzeit sein.");
      return false;
    }

    return true;
  };

  const formatTime = (hour) => {
    // Konvertiere die Stunde in das Format HH:MM:SS
    return `${hour.toString().padStart(2, "0")}:00:00`;
  };

  const checkAvailability = async () => {
    if (!validateInputs()) return;

    setError(""); // Fehler zurücksetzen
    try {
      // Formatiere die Zeitwerte
      const formattedTimeFrom = formatTime(timeFrom);
      const formattedTimeTo = formatTime(timeTo);

      // Prüfe auf Überschneidungen
      const { data, error } = await supabase
        .from("reservations")
        .select("field_id, time_start, time_end")
        .eq("date", date);

      if (error) {
        setError("Fehler beim Prüfen der Verfügbarkeit.");
        return;
      }

      // Finde Felder mit Überschneidungen
      const unavailableFieldIds = data
        .filter((reservation) => {
          const reservationStart = reservation.time_start;
          const reservationEnd = reservation.time_end;

          // Prüfe, ob sich die Zeiträume überschneiden
          return (
            (formattedTimeFrom < reservationEnd && formattedTimeTo > reservationStart)
          );
        })
        .map((reservation) => reservation.field_id);

      // Aktualisiere die Verfügbarkeit der Felder
      const updatedFields = fields.map((field) => ({
        ...field,
        available: !unavailableFieldIds.includes(field.id),
      }));

      setAvailableFields(updatedFields);
      setDropdownEnabled(true); // Dropdown aktivieren
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    }
  };

  const handleReservation = async () => {
    if (!selectedField) {
      setError("Bitte wählen Sie ein Feld aus.");
      return;
    }

    const selectedFieldData = availableFields.find((field) => field.id === parseInt(selectedField));

    if (!selectedFieldData.available && !isUserAdmin) {
      setError("Das ausgewählte Feld ist nicht verfügbar.");
      return;
    }

    if (!selectedFieldData.available && isUserAdmin) {
      if (!window.confirm("Das Feld ist bereits reserviert. Möchten Sie die bestehende Reservierung überschreiben?")) {
        return;
      }

      // Bestehende Reservierung löschen
      await supabase.from("reservations").delete().eq("field_id", selectedField).eq("date", date);
    }

    try {
      // Zeitwerte in das Format HH:MM:SS konvertieren
      const formattedTimeFrom = `${timeFrom.toString().padStart(2, "0")}:00:00`;
      const formattedTimeTo = `${timeTo.toString().padStart(2, "0")}:00:00`;

      const { error } = await supabase.from("reservations").insert({
        field_id: selectedField,
        date,
        time_start: formattedTimeFrom, // Formatiertes Zeitfeld
        time_end: formattedTimeTo, // Formatiertes Zeitfeld
        user_id: userId, // Benutzer-ID aus dem State verwenden
      });

      if (error) {
        console.log(error);
        setError("Fehler beim Speichern der Reservierung.");
      } else {
        navigate("/overview"); // Weiterleitung bei Erfolg
      }
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    }
  };

  const isReservationButtonDisabled = () => {
    if (isUserAdmin) {
      return !selectedField; // Admin: Button aktiv, wenn ein Feld ausgewählt wurde
    }
    // Kein Admin: Button aktiv, wenn ein verfügbares Feld ausgewählt wurde
    const selectedFieldData = availableFields.find((field) => field.id === parseInt(selectedField));
    return !selectedField || (selectedFieldData && !selectedFieldData.available);
  };

  return (
    <div className="page-container">
      <div className="new-reservation-container">
        <h1>Neue Reservierung</h1>
        <p className="new-reservation-description">
          Bitte wählen Sie ein Datum, eine Startzeit und eine Endzeit aus. Nach der Überprüfung der Verfügbarkeit können Sie ein Feld auswählen und die Reservierung bestätigen.
        </p>
        <form className="new-reservation-form">
          <label>Datum</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setDropdownEnabled(false); // Dropdown deaktivieren
              setError(""); // Fehler zurücksetzen
            }}
            className="new-reservation-input"
          />
          <label>Zeit von</label>
          <select
            value={timeFrom}
            onChange={(e) => {
              setTimeFrom(e.target.value);
              setDropdownEnabled(false); // Dropdown deaktivieren
              setError(""); // Fehler zurücksetzen
            }}
            className="new-reservation-input"
          >
            <option value="">--:--</option>
            {[...Array(24).keys()].map((hour) => (
              <option key={hour} value={hour}>
                {hour}:00
              </option>
            ))}
          </select>
          <label>Zeit bis</label>
          <select
            value={timeTo}
            onChange={(e) => {
              setTimeTo(e.target.value);
              setDropdownEnabled(false); // Dropdown deaktivieren
              setError(""); // Fehler zurücksetzen
            }}
            className="new-reservation-input"
          >
            <option value="">--:--</option>
            {[...Array(24).keys()].map((hour) => (
              <option key={hour} value={hour}>
                {hour}:00
              </option>
            ))}
          </select>
          <button
            type="button"
            className="new-reservation-button"
            onClick={checkAvailability}
            disabled={isCheckAvailabilityDisabled} // Button ist deaktiviert, wenn nicht alle Felder ausgefüllt sind
          >
            Verfügbarkeit prüfen
          </button>
        </form>
        <div className="new-reservation-dropdown">
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="new-reservation-input"
            disabled={!dropdownEnabled} // Dropdown ist deaktiviert, bis die Verfügbarkeit geprüft wurde
          >
            <option value="">Feld auswählen</option>
            {availableFields.map((field) => (
              <option
                key={field.id}
                value={field.id}
                disabled={!field.available && !isUserAdmin}
                style={{ color: field.available ? "green" : "red" }}
              >
                {field.name} {field.available ? "(Verfügbar)" : "(Nicht verfügbar)"}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="new-reservation-button"
          onClick={handleReservation}
          disabled={isReservationButtonDisabled()} // Button ist deaktiviert, wenn die Bedingungen nicht erfüllt sind
        >
          Reservierung bestätigen
        </button>
        <button
          type="button"
          className="cancel-button"
          onClick={() => navigate("/overview")} // Zurück zur Übersicht
        >
          Abbrechen
        </button>
        {error && <p className="new-reservation-error">{error}</p>}
      </div>
    </div>
  );
}