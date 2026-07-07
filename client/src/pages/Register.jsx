import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    await API.post("/auth/register", form); // ✅ FIXED
    navigate("/login");
  } catch (err) {
    console.log("ERROR ", err.response?.data || err.message);
    alert("Error registering ❌");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="auth-container">
      <div className="auth-modal" style={{ position: "relative", margin: "auto" }}>

        {/* Logo */}
        <div className="auth-logo">🛡️ SafeYatra</div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-sub">Register as a tourist to get your Digital ID</p>

        {/* Tabs */}
        <div className="auth-tabs">
          <Link to="/login" style={{ flex: 1, textDecoration: "none" }}>
            <button className="auth-tab" style={{ width: "100%" }}>Login</button>
          </Link>
          <button className="auth-tab active">Register</button>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Register →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "0.85rem", color: "var(--muted)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}