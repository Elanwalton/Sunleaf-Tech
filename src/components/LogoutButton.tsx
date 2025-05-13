import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // adjust path if needed

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setUserRole } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await fetch("http://192.168.0.107/Sunleaf-Tech/api/logout.php", {
        method: "POST",
        credentials: "include", // to send PHP session cookie
      });

      // Clear local storage + context
      localStorage.removeItem("userRole");
      localStorage.removeItem("sessionId");
      setUserRole(null);

      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
