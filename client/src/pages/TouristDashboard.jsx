import QRCard from "../components/QRCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TouristDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [screen, setScreen] = useState(0);
  const [showMapFull, setShowMapFull] = useState(false);
 useEffect(() => {
  const watchId = navigator.geolocation.watchPosition(
    (pos) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    },
    (err) => {
      console.log(err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );

  return () => navigator.geolocation.clearWatch(watchId);
}, []);

  // 🔥 AUTO SLIDE
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen(1);
      setShowMapFull(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  
  if (showMapFull && location) {
  return (
    <div style={{
      width: "100%",
      height: "100vh",
      background: "#000",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 999
    }}>

      <button
        onClick={() => setShowMapFull(false)}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
          background: "#111",
          color: "white",
          border: "none",
          padding: "10px 14px",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        ← Back
      </button>

      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
      />
    </div>
  );
}
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a, #0f4c81)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      paddingTop: "88px"
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

        {/* Status */}
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
            borderRadius: "50%"
          }}/>
          <span style={{ color: "#4ade80", fontSize: "0.84rem" }}>
            Active & Verified Tourist
          </span>
        </div>

        {/* 🔥 REAL SLIDER */}
        <div style={{
          width: "100%",
          overflow: "hidden",
          marginBottom: "20px"
        }}>
          <div style={{
            display: "flex",
            width: "200%",
            transform: `translateX(-${screen * 50}%)`,
            transition: "transform 0.6s ease-in-out"
          }}>

            {/* QR SLIDE */}
            <div style={{
              width: "100%",
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              <QRCard />
              <p style={{
                marginTop: "12px",
                color: "#374151",
                fontWeight: 700
              }}>
                {user?.name}
              </p>
              <p style={{ color: "#9ca3af", fontSize: "0.78rem" }}>
                Tourist ID: {user?._id?.slice(-8).toUpperCase()}
              </p>
            </div>

            {/* MAP SLIDE */}
            <div style={{
              width: "100%",
              background: "#000",
              borderRadius: "16px",
              overflow: "hidden"
            }}>
              {location ? (
                <iframe
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
                />
              ) : (
                <p style={{ color: "white", padding: "20px" }}>
                  Loading Map...
                </p>
              )}
            </div>

          </div>
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
              borderRadius: "12px",
              padding: "14px"
            }}>
              <div>{item.icon}</div>
              <div style={{ color: "#9ca3af", fontSize: "0.7rem" }}>{item.label}</div>
              <div style={{ color: "white", fontWeight: 600 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "11px",
            background: "transparent",
            color: "#6b7280",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px"
          }}
        >
          Logout →
        </button>

      </div>
    </div>
  );
}