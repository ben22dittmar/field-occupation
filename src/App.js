import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import "./App.css";
import { Start } from "./Components/Start";
import { Login } from "./Components/Login";
import { RequestPasswordReset } from "./Components/RequestPasswordReset";
import { SetPassword } from "./Components/SetPassword";
import { Overview } from "./Components/Overview";
import { NewReservation } from "./Components/NewReservation";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="start" />} />
        <Route path="/start" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/request-password-reset" element={<RequestPasswordReset />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/new-reservation" element={<NewReservation />} />
        <Route path="*" element={<Navigate to="/start" />} />
      </Routes>
    </Router>
  );
}
