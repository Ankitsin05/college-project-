import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);

      // 🔥 save user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔥 redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.log(err);

      // 🔥 better error handling
      if (err.response) {
        alert(err.response.data.message || "Login failed ❌");
      } else {
        alert("Server error ❌");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-modal" style={{ position: "relative", margin: "auto" }}>
        
        {/* Logo */}
        <div className="auth-logo">🛡️ SafeYatra</div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-sub">Login to your tourist account</p>

        {/* Tabs */}
        <div className="auth-tabs">
          <button className="auth-tab active">Login</button>
          <Link to="/register" style={{ flex: 1, textDecoration: "none" }}>
            <button className="auth-tab" style={{ width: "100%" }}>
              Register
            </button>
          </Link>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              value={form.email}   // 🔥 added
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={form.password}   // 🔥 added
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>

        {/* Extra UX */}
        <p style={{ textAlign: "center", marginTop: "12px", fontSize: "0.8rem", color: "#9ca3af" }}>
          Use your registered email & password
        </p>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "0.85rem", color: "var(--muted)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}