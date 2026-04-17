import QRCard from "../components/QRCard";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function TouristDashboard() {
   const [coords, setCoords] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const lastSOS = useRef(0);
  const [screen, setScreen] = useState(0);
  const [showMapFull, setShowMapFull] = useState(false);
  const [safetyScore, setSafetyScore] = useState(100);
  const [tapCount, setTapCount] = useState(0);
  const [emergencyContacts] = useState(["xxxxxxxxxxx", "xxxxxxxxxxxx"]);
const [alarmAudio, setAlarmAudio] = useState(null);
  // 📍 LIVE LOCATION TRACKING
 useEffect(() => {
  const interval = setInterval(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const c = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setCoords(c);
        setLocation(c);

        console.log("📍 New location:", c);

        try {
          await API.post("/location/update", {
            userId: user?._id,
            location: c,
            time: new Date(),
          });
          console.log("✅ location sent");
        } catch (err) {
          console.log("❌ location send failed");
        }
      },
      (err) => console.log("Location error:", err)
    );
  }, 15000); // 🔥 हर 15 सेकंड

  return () => clearInterval(interval);
}, []);

  // 🛡️ SAFETY SCORE
  useEffect(() => {
    if (!location) return;
    let score = 100;
    const hour = new Date().getHours();
    if (hour >= 20 || hour <= 6) score -= 20;
    const dangerZones = [
      { lat: 27.5, lng: 94.1 },
      { lat: 26.8, lng: 93.5 },
    ];
    dangerZones.forEach(zone => {
      const dist = Math.sqrt(
        Math.pow(location.lat - zone.lat, 2) +
        Math.pow(location.lng - zone.lng, 2)
      );
      if (dist < 0.1) score -= 30;
    });
    score = Math.max(0, Math.min(100, score));
    setSafetyScore(score);
  }, [location]);

  // 🔕 SILENT SOS — 3 taps
  useEffect(() => {
    if (tapCount >= 3) {
      console.log("🚨 Silent SOS Triggered");
      handleAutoSOS();
      setTapCount(0);
    }
  }, [tapCount]);

  // 🌐 OFFLINE AUTO SYNC
  useEffect(() => {
    const syncOfflineSOS = async () => {
      const stored = JSON.parse(localStorage.getItem("offlineSOS")) || [];
      if (stored.length === 0) return;
      console.log("🌐 Syncing offline SOS...");
      for (let sos of stored) {
        try {
          await fetch("http://localhost:5000/api/emergency/sos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sos),
          });
        } catch (err) {
          return;
        }
      }
      localStorage.removeItem("offlineSOS");
      console.log("✅ Synced all offline SOS");
    };
    window.addEventListener("online", syncOfflineSOS);
    return () => window.removeEventListener("online", syncOfflineSOS);
  }, []);

  // 📳 SHAKE SOS
  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    const handleMotion = (event) => {
      const { x, y, z } = event.accelerationIncludingGravity;
      if (!x || !y || !z) return;
      const delta = Math.abs(x + y + z - lastX - lastY - lastZ);
      if (delta > 25) {
        console.log("📳 Shake detected → SOS");
        handleAutoSOS();
      }
      lastX = x; lastY = y; lastZ = z;
    };
    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [location]);

  // 🔥 AUTO SLIDE
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen(1);
      setShowMapFull(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // 👆 SILENT TAP
  const handleHiddenTap = () => {
    setTapCount(prev => prev + 1);
    setTimeout(() => setTapCount(0), 2000);
  };

  // 🔊 ALARM FUNCTION
const playAlarm = () => {
  const audio = new Audio("/siren.mp3");
  audio.loop = true;

  audio.play().catch(err => {
    console.log("Audio blocked:", err);
  });

  setAlarmAudio(audio);
};

// ⛔ STOP ALARM (optional)
const stopAlarm = () => {
  if (alarmAudio) {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
  }
};

// 📩 SMS FUNCTION
const sendSMS = () => {
  if (!coords) {
    alert("Location not ready ❌");
    return;
  }

  const message = `🚨 SOS ALERT!
I am in danger.
Location: https://maps.google.com/?q=${coords.lat},${coords.lng}`;

  window.location.href = `sms:${emergencyContacts[0]}?body=${encodeURIComponent(message)}`;
};

// 📞 CALL FUNCTION
const makeCall = () => {

  window.location.href = `tel:${emergencyContacts[0]}`;
};

  // 🚨 FULL SOS — Offline + Contacts
  const handleSOS = async () => {
     const now = Date.now();

  if (now - lastSOS.current < 10000) {
    console.log("⏳ Wait before sending SOS again");
    return;
  }

  lastSOS.current = now;

  console.log("🚨 FULL SOS TRIGGERED");

  // 🔊 Alarm
  playAlarm();

  // 📞 Call
  makeCall();

  // 📩 SMS
  sendSMS();

  try {
    if (!location?.lat) {
      console.log("❌ Location not available");
      return;
    }

    await API.post("/emergency/sos", {
      userId: user?._id || "testUser",
      location: {
        lat: location.lat,
        lng: location.lng,
      },
    });

    console.log("🚨 SOS saved to DB");
  } catch (err) {
    console.log("❌ SOS DB error:", err);
  }
};

  // 🚨 AUTO SOS — Shake + Tap
  const handleAutoSOS = async () => {
    if (!location) {
      alert("Location not available ❌");
      return;
    }
    const payload = {
      userId: user?._id,
      lat: location.lat,
      lng: location.lng,
      time: new Date(),
    };

    if (!navigator.onLine) {
      const existing = JSON.parse(localStorage.getItem("offlineSOS")) || [];
      existing.push(payload);
      localStorage.setItem("offlineSOS", JSON.stringify(existing));
      alert("📴 Offline — SOS saved locally");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/emergency/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      emergencyContacts.forEach(num => {
        console.log(`📞 Alert sent to ${num}`);
      });
      alert("🚨 SOS Sent + Contacts Alerted");
    } catch (err) {
      alert("Failed to send SOS ❌");
    }
  };

  // 📞 FAKE CALL
 const triggerFakeCall = async () => {
  alert("📞 Incoming Call: Police Helpline");

  const audio = new Audio("/ring.mp3");

  try {
    await audio.play();
  } catch (err) {
    console.log("Audio blocked:", err);
  }

  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, 8000);
};

  // 🗺️ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🗺️ FULL MAP VIEW
  if (showMapFull && location) {
    return (
      <div style={{
        width: "100%", height: "100vh",
        background: "#000",
        position: "fixed", top: 0, left: 0, zIndex: 999
      }}>
        <button
          onClick={() => setShowMapFull(false)}
          style={{
            position: "absolute", top: "20px", left: "20px", zIndex: 10,
            background: "#111", color: "white", border: "none",
            padding: "10px 14px", borderRadius: "8px", cursor: "pointer"
          }}
        >← Back</button>
        <iframe
          width="100%" height="100%"
          style={{ border: 0 }} loading="lazy" allowFullScreen
          src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
        />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a, #0f4c81)",
      display: "flex", alignItems: "center",
      justifyContent: "center",
      padding: "20px", paddingTop: "88px"
    }}>

      {/* 👆 SILENT TAP LAYER */}
      <div
        onClick={handleHiddenTap}
        style={{
          position: "fixed", top: 0, left: 0,
          width: "100%", height: "100%",
          zIndex: 0, opacity: 0,
        }}
      />

      <div style={{
        background: "#111827", borderRadius: "24px",
        padding: "36px", width: "100%", maxWidth: "440px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.08)",
        position: "relative", zIndex: 1
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "64px", height: "64px",
            background: "linear-gradient(135deg, #0f4c81, #e8401c)",
            borderRadius: "50%",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "28px",
            margin: "0 auto 16px"
          }}>👤</div>
          <h2 style={{
            color: "white", fontFamily: "'Syne', sans-serif",
            fontSize: "1.4rem", fontWeight: 800, marginBottom: "6px"
          }}>Welcome, {user?.name}! 👋</h2>
          <p style={{ color: "#9ca3af", fontSize: "0.88rem" }}>
            Your Digital Tourist ID is ready
          </p>
        </div>

        {/* Status Badge */}
        <div style={{
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.3)",
          borderRadius: "10px", padding: "10px 16px",
          display: "flex", alignItems: "center",
          gap: "10px", marginBottom: "24px"
        }}>
          <div style={{
            width: "8px", height: "8px",
            background: "#22c55e", borderRadius: "50%"
          }}/>
          <span style={{ color: "#4ade80", fontSize: "0.84rem" }}>
            Active & Verified Tourist
          </span>
        </div>

        {/* QR + MAP SLIDER */}
        <div style={{ width: "100%", overflow: "hidden", marginBottom: "20px" }}>
          <div style={{
            display: "flex", width: "200%",
            transform: `translateX(-${screen * 50}%)`,
            transition: "transform 0.6s ease-in-out"
          }}>
            {/* QR Slide */}
            <div style={{
              width: "100%", background: "white",
              borderRadius: "16px", padding: "20px",
              display: "flex", flexDirection: "column", alignItems: "center"
            }}>
              <QRCard />
              <p style={{ marginTop: "12px", color: "#374151", fontWeight: 700 }}>
                {user?.name}
              </p>
              <p style={{ color: "#9ca3af", fontSize: "0.78rem" }}>
                Tourist ID: {user?._id?.slice(-8).toUpperCase()}
              </p>
            </div>

            {/* Map Slide */}
            <div style={{
              width: "100%", background: "#000",
              borderRadius: "16px", overflow: "hidden"
            }}>
              {location ? (
                <iframe
                  width="100%" height="220"
                  style={{ border: 0 }} loading="lazy" allowFullScreen
                  src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
                />
              ) : (
                <p style={{ color: "white", padding: "20px" }}>Loading Map...</p>
              )}
            </div>
          </div>
        </div>

        {/* Slide Dots */}
        <div style={{
          display: "flex", justifyContent: "center",
          gap: "8px", marginBottom: "20px"
        }}>
          {[0, 1].map(i => (
            <div
              key={i}
              onClick={() => { setScreen(i); setShowMapFull(false); }}
              style={{
                width: screen === i ? "20px" : "8px",
                height: "8px", borderRadius: "4px",
                background: screen === i ? "#60a5fa" : "rgba(255,255,255,0.2)",
                cursor: "pointer", transition: "all 0.3s"
              }}
            />
          ))}
        </div>

        {/* Safety Score */}
        <div style={{
          marginBottom: "20px", padding: "14px",
          borderRadius: "12px", textAlign: "center",
          background:
            safetyScore > 70 ? "rgba(34,197,94,0.15)" :
            safetyScore > 40 ? "rgba(234,179,8,0.15)" :
            "rgba(239,68,68,0.15)"
        }}>
          <h3 style={{
            color:
              safetyScore > 70 ? "#22c55e" :
              safetyScore > 40 ? "#eab308" : "#ef4444",
            margin: 0, fontSize: "1rem"
          }}>
            {safetyScore > 70 ? "🟢 Safe" :
             safetyScore > 40 ? "🟠 Risk" : "🔴 Danger"}
          </h3>
          <p style={{ color: "#ccc", marginTop: "5px", fontSize: "0.85rem" }}>
            Safety Score: {safetyScore}%
          </p>
        </div>

        {/* 🚨 SOS BUTTON */}
        <button
          onClick={handleSOS}
          style={{
            width: "100%", padding: "14px",
            background: "linear-gradient(135deg, #ff0000, #b91c1c)",
            color: "white", border: "none", borderRadius: "14px",
            fontWeight: "bold", marginBottom: "12px",
            fontSize: "1rem", cursor: "pointer",
            fontFamily: "'Syne', sans-serif", letterSpacing: "0.05em"
          }}
        >🚨 SEND SOS ALERT</button>

        {/* 📞 FAKE CALL BUTTON */}
        <button
          onClick={triggerFakeCall}
          style={{
            width: "100%", padding: "12px",
            background: "linear-gradient(135deg, #6366f1, #4338ca)",
            color: "white", border: "none", borderRadius: "12px",
            fontWeight: "bold", marginBottom: "20px",
            cursor: "pointer", fontFamily: "'Syne', sans-serif"
          }}
        >📞 Fake Call (Escape)</button>

        {/* Info Cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "12px", marginBottom: "20px"
        }}>
          {[
            { icon: "📧", label: "Email", value: user?.email },
            { icon: "🛡️", label: "Status", value: "Verified" },
            { icon: "📍", label: "Tracking", value: location ? "Active" : "Loading..." },
            { icon: "🆘", label: "SOS", value: "Ready" }
          ].map((item, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "12px", padding: "14px"
            }}>
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>{item.icon}</div>
              <div style={{ color: "#9ca3af", fontSize: "0.7rem" }}>{item.label}</div>
              <div style={{
                color: "white", fontWeight: 600,
                fontSize: "0.82rem", marginTop: "2px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
              }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%", padding: "11px",
            background: "transparent", color: "#6b7280",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif"
          }}
        >Logout →</button>

      </div>
    </div>
  );
}