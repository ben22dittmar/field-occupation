import { useAuth } from "../Auth/auth";
import { supabase } from "../Supabase/Client";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      {user ? (
        <div className="dashboard-content">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>

          {/* Logout-Button */}
          <button className="logout-button" onClick={handleLogout}>
            Abmelden
          </button>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};
