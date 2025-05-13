import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/SignUp.module.css";
import { FaEnvelope, FaKey } from "react-icons/fa";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.secondName.trim()) newErrors.secondName = "Second name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post("http://192.168.0.107/Sunleaf-Tech/api/SignUp.php", formData);
      alert(response.data);
    } catch (error) {
      alert("Signup failed");
    }
  };

  return (
    <div className={styles.pageWrapper}>
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div className={styles["tag-header"]}>
          <span><h1>Register</h1></span>
        </div>

        <div className={styles["names-box"]}>
          <div className={styles["input-box"]}>
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <span style={{ color: "red" }}>{errors.firstName}</span>}
          </div>

          <div className={styles["input-box"]}>
            <input
              type="text"
              name="secondName"
              placeholder="Second name"
              value={formData.secondName}
              onChange={handleChange}
            />
            {errors.secondName && <span style={{ color: "red" }}>{errors.secondName}</span>}
          </div>
        </div>

        <div className={styles["input-box"]}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <FaEnvelope className={styles.icon} />
          {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
        </div>

        <div className={styles["input-box"]}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <FaKey className={styles.icon} />
          {errors.password && <span style={{ color: "red" }}>{errors.password}</span>}
        </div>

        <div className={styles["input-box"]}>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <FaKey className={styles.icon} />
          {errors.confirmPassword && <span style={{ color: "red" }}>{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className={styles.btn}>Sign Up</button>
      </form>
    </div>
    </div>
  );
};

export default SignUp;
