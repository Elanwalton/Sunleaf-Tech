import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "../styles/SignUp.module.css";
import { FaEnvelope, FaKey } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";


interface LoginResponse {
  message: string;
  sessionId: string;
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

  const navigate = useNavigate();
   // Access setUserRole from the context
   const { setUserRole } = useContext(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        const sessionId = response.data.sessionId;
       

        // Save to localStorage or context
        localStorage.setItem("userRole", role);
        localStorage.setItem("sessionId", sessionId);
        console.log("Stored role:", localStorage.getItem("userRole"));// console log
        setUserRole(role);

        toast.success("Login successful!");
        // console.log(response.data);
        // Redirect based on role
        setTimeout(() => {
          if (role === "admin") {
            navigate("/admin-dashboard");
          } else if (role === "customer") {
            navigate("/shop");
          } else {
            navigate("/"); // fallback
          }
        }, 1000);
      } else {
        toast.error("Login failed: " + response.data.message);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again later.");
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
            />
            <FaKey className={styles.icon} />
          </div>

          <button type="submit" id="login" className={styles.btn} name="submit">
            Login
          </button>

          <div
            className="Register-link"
            style={{ marginTop: "10px", textAlign: "center" }}
          >
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
