import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "../styles/SignUp.module.css";
import { FaEnvelope, FaKey } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

interface LoginResponse {
  message: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserRole } = useContext(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post<LoginResponse>(
        "http://192.168.0.107/Sunleaf-Tech/api/Login.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Login response:", response.data);

      if (response.data.message === "Login successful") {
        const role = response.data.user.role.toLowerCase();
        
        // Save to context and localStorage
        setUserRole(role);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userEmail", response.data.user.email);
        localStorage.setItem("userId", response.data.user.id.toString());

        toast.success("Login successful!");
        
        // Redirect based on role
        setTimeout(() => {
          navigate(role === "admin" ? "/admin-dashboard" : "/shop");
        }, 1000);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.response) {
        // Handle specific error messages from server
        const errorMessage = error.response.data?.message || "Invalid credentials";
        toast.error(`Login failed: ${errorMessage}`);
        
        // Clear form on invalid credentials
        if (error.response.status === 401) {
          setFormData({ email: formData.email, password: "" });
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <form id="form1" onSubmit={handleSubmit} method="POST">
          <div className={styles["tag-header"]}>
            <h1>Login</h1>
          </div>

          <div className={styles["input-box"]}>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              autoComplete="username"
            />
            <FaEnvelope className={styles.icon} />
          </div>

          <div className={styles["input-box"]}>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <FaKey className={styles.icon} />
          </div>

          <button 
            type="submit" 
            className={styles.btn} 
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <p style={{ color: "white" }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: "lightblue" }}>
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;