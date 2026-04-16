import QRCard from "../components/QRCard";
import { useNavigate } from "react-router-dom";

export default function TouristDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a, #0f4c81)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      paddingTop: "88px" // navbar height
    }}>
      <div style={{
        background: "#111827",
        borderRadius: "24px",
        padding: "36px",
        width: "100%",
        maxWidth: "440px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.08)"
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "64px", height: "64px",
            background: "linear-gradient(135deg, #0f4c81, #e8401c)",
            borderRadius: "50%",
            display: "flex", alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            margin: "0 auto 16px"
          }}>👤</div>

          <h2 style={{
            color: "white",
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.4rem",
            fontWeight: 800,
            marginBottom: "6px"
          }}>
            Welcome, {user?.name}! 👋
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "0.88rem" }}>
            Your Digital Tourist ID is ready
          </p>
        </div>

        {/* Status Badge */}
        <div style={{
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.3)",
          borderRadius: "10px",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "24px"
        }}>
          <div style={{
            width: "8px", height: "8px",
            background: "#22c55e",
            borderRadius: "50%",
            animation: "pulse 1.5s infinite"
          }}/>
          <span style={{ color: "#4ade80", fontSize: "0.84rem", fontWeight: 500 }}>
            Active & Verified Tourist
          </span>
        </div>

        {/* QR Code Box */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <QRCard />
          <p style={{
            marginTop: "12px",
            color: "#374151",
            fontWeight: 700,
            fontSize: "1rem",
            fontFamily: "'Syne', sans-serif"
          }}>{user?.name}</p>
          <p style={{ color: "#9ca3af", fontSize: "0.78rem" }}>
            Tourist ID: {user?._id?.slice(-8).toUpperCase() || "TXB91234"}
          </p>
        </div>

        {/* Info Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "20px"
        }}>
          {[
            { icon: "📧", label: "Email", value: user?.email },
            { icon: "🛡️", label: "Status", value: "Verified" },
            { icon: "📍", label: "Tracking", value: "Active" },
            { icon: "🆘", label: "SOS", value: "Ready" }
          ].map((item, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "14px"
            }}>
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>{item.icon}</div>
              <div style={{ color: "#9ca3af", fontSize: "0.7rem" }}>{item.label}</div>
              <div style={{
                color: "white", fontSize: "0.82rem",
                fontWeight: 600, marginTop: "2px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
              }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* SOS Button */}
        <button
          onClick={() => navigate("/sos")}
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #dc2626, #b91c1c)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: 700,
            fontFamily: "'Syne', sans-serif",
            cursor: "pointer",
            marginBottom: "10px",
            letterSpacing: "0.05em"
          }}
        >
          🆘 Emergency SOS
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "11px",
            background: "transparent",
            color: "#6b7280",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            fontSize: "0.88rem",
            cursor: "pointer"
          }}
        >
          Logout →
        </button>
      </div>
    </div>
  );
}