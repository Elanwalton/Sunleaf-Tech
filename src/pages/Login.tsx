import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../library/axiosConfig";
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
  session_id?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

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
      const { data } = await api.post<LoginResponse>("/Login.php", formData,
         { withCredentials: true }    
      );
      
      if (data.message === "Login successful") {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role.toLowerCase()
        };
        
        // Save to context and localStorage
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        toast.success("Login successful!");
        
        // Redirect based on role
        navigate(userData.role === "admin" ? "/admin-dashboard" : "/Home");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.response) {
        toast.error(error.response.data?.message || "Login failed");
        if (error.response.status === 401) {
          setFormData(prev => ({ ...prev, password: "" }));
        }
      } else {
        toast.error(error.message || "Network error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <div className={styles["tag-header"]}>
            <h1>Login</h1>
          </div>

          <div className={styles["input-box"]}>
            <input
              type="email"
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
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <FaKey className={styles.icon} />
          </div>

          <button type="submit" className={styles.btn} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className={styles.footer}>
            <p>
              Don't have an account?{" "}
              <Link to="/signup">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;