import QRCard from "../components/QRCard";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

// ✅ FIX 1 — getDistance function define karo
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000; // meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ✅ FIX 2 — dangerZones define karo
const dangerZones = [
  { lat: 27.5, lng: 94.1, radius: 500 },
  { lat: 26.8, lng: 93.5, radius: 500 },
];

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
  const alertCooldown = useRef(0);
  const autoSOSCooldown = useRef(0);
  const [emergencyContacts] = useState(["xxxxxxxxxxx", "xxxxxxxxxxxx"]);
  const alertedRef = useRef(false);
  const [alarmAudio, setAlarmAudio] = useState(null);
  const [isDanger, setIsDanger] = useState(false);
  const[danger,setDanger] = useState(false);

  const checkDanger = async (lat, lng) => {
    try {
      const res = await API.post("/location/check-danger", { lat, lng });
      setIsDanger(res.data.danger ? true : false);
    } catch (err) {
      console.log(err);
    }
  };

  const triggerAlert = () => {
    const now = Date.now();
    if (now - alertCooldown.current < 10000) {
      console.log("⏳ Alert cooldown");
      return;
    }
    alertCooldown.current = now;
    playAlarm();
    console.log("🚨 ALERT TRIGGERED");
  };

  // 📍 LIVE LOCATION TRACKING
  useEffect(() => {
    // ✅ Pehli baar turant location lo
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(c);
        setLocation(c);
        console.log("📍 First location:", c);
        try {
          await API.post("/location/update", {
            userId: user?._id, location: c, time: new Date(),
          });
        } catch (err) {
          console.log("❌ API error:", err);
        }
      },
      (err) => console.log("❌ Location error:", err),
      { enableHighAccuracy: true }
    );

    // ✅ Phir har 15 sec mein update karo
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(c);
          setLocation(c);
          console.log("📍 New location:", c);
          try {
            await API.post("/location/update", {
              userId: user?._id, location: c, time: new Date(),
            });
            const dangerRes = await API.post("/location/check-danger", {
               lat: c.lat,
                   lng: c.lng
                     });

setDanger(dangerRes.data.danger);
            console.log("✅ location sent");
          } catch (err) {
            console.log("❌ API error:", err);
          }
        },
        (err) => console.log("❌ Location error:", err)
      );
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // 🛡️ SAFETY SCORE
  useEffect(() => {
    if (!location) return;
    let score = 100;

    const hour = new Date().getHours();
    if (hour >= 20 || hour <= 6) score -= 20;

    const scoreZones = [
      { lat: 27.5, lng: 94.1 },
      { lat: 26.8, lng: 93.5 },
    ];

    scoreZones.forEach(zone => {
      const dist = getDistance(location.lat, location.lng, zone.lat, zone.lng);
      if (dist < 1000) score -= 30;
    });

    score = Math.max(0, Math.min(100, score));
    setSafetyScore(score);
  }, [location]);

  // 🚨 DANGER ZONE CHECK
  useEffect(() => {
    if (!location) return;

    for (let zone of dangerZones) {
      const dist = getDistance(location.lat, location.lng, zone.lat, zone.lng);

      if (dist < (zone.radius || 200) && !alertedRef.current) {
        alertedRef.current = true;
        console.log("🚨 ENTERED DANGER ZONE");
        alert("⚠️ You are entering a dangerous area!");
        setSafetyScore(prev => Math.max(prev - 30, 0));
        triggerAlert();
        handleAutoSOS();
        API.post("/location/danger", {
          userId: user?._id,
          lat: location.lat,
          lng: location.lng,
        }).catch(() => console.log("❌ danger log failed"));
      }

      if (dist > ((zone.radius || 200) + 50)) {
        alertedRef.current = false;
      }
    }
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

  // ✅ FIX 3 — Auto slide sirf location aane ke baad
  useEffect(() => {
    if (!location) return;
    const timer = setTimeout(() => {
      setScreen(1);
      // ✅ setShowMapFull NAHI karenge — black screen fix
    }, 2000);
    return () => clearTimeout(timer);
  }, [location]);

  // 👆 SILENT TAP
  const handleHiddenTap = () => {
    setTapCount(prev => prev + 1);
    setTimeout(() => setTapCount(0), 2000);
  };

  // 🔊 ALARM
  const playAlarm = () => {
    const audio = new Audio("/siren.mp3");
    audio.loop = true;
    audio.play().catch(err => console.log("Audio blocked:", err));
    setAlarmAudio(audio);
  };

  const stopAlarm = () => {
    if (alarmAudio) {
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
    }
  };

  // 📩 SMS
  const sendSMS = () => {
    if (!coords) { alert("Location not ready ❌"); return; }
    const message = `🚨 SOS ALERT!\nI am in danger.\nLocation: https://maps.google.com/?q=${coords.lat},${coords.lng}`;
    window.location.href = `sms:${emergencyContacts[0]}?body=${encodeURIComponent(message)}`;
  };

  // 📞 CALL
  const makeCall = () => {
    window.location.href = `tel:${emergencyContacts[0]}`;
  };

  // 🚨 MAIN SOS
  const handleSOS = async () => {
    if (!location) return;

    const now = Date.now();
    if (now - autoSOSCooldown.current < 20000) {
      console.log("⏳ Auto SOS cooldown");
      return;
    }
    autoSOSCooldown.current = now;
    console.log("🚨 FULL SOS TRIGGERED");

    playAlarm();
    makeCall();
    sendSMS();

    try {
      if (!location?.lat) return;
      await API.post("/emergency/sos", {
        userId: user?._id || "testUser",
        location: { lat: location.lat, lng: location.lng },
      });
      console.log("🚨 SOS saved to DB");
    } catch (err) {
      console.log("❌ SOS DB error:", err);
    }
  };

  // 🚨 AUTO SOS
  const handleAutoSOS = async () => {
    if (!location) { alert("Location not available ❌"); return; }

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
      emergencyContacts.forEach(num => console.log(`📞 Alert sent to ${num}`));
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
        {danger && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "10px", padding: "10px 16px",
            display: "flex", alignItems: "center",
            gap: "10px", marginBottom: "24px"
          }}>
            <div style={{
              width: "8px", height: "8px",
              background: "#ef4444", borderRadius: "50%",
              animation: "pulse 1.5s infinite"
            }}/>
            <span style={{ color: "#f87171", fontSize: "0.84rem" }}>
              You are in a dangerous area!
            </span>
          </div>
        )}


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
            background: "#22c55e", borderRadius: "50%",
            animation: "pulse 1.5s infinite"
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
              <QRCard  userId={user?._id}/>
              <p style={{ marginTop: "12px", color: "#374151", fontWeight: 700 }}>
                {user?.name}
              </p>
              <p style={{ color: "#9ca3af", fontSize: "0.78rem" }}>
                Tourist ID: {user?._id?.slice(-8).toUpperCase()}
              </p>
            </div>

            {/* ✅ FIX — Map Slide */}
            <div style={{
              width: "100%", background: "#0a1628",
              borderRadius: "16px", overflow: "hidden",
              minHeight: "220px",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              {location ? (
                <iframe
                  key={`${location.lat}-${location.lng}`}
                  width="100%" height="220"
                  style={{ border: 0, display: "block" }}
                  loading="lazy" allowFullScreen
                  src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
                />
              ) : (
                <div style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", gap: "12px", padding: "20px"
                }}>
                  <div style={{ fontSize: "2rem" }}>📍</div>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
                    Getting your location...
                  </p>
                </div>
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
            fontFamily: "'Syne', sans-serif", letterSpacing: "0.05em",
            boxShadow: "0 8px 24px rgba(255,0,0,0.3)"
          }}
        >🚨 SEND SOS ALERT</button>

        {/* 📞 FAKE CALL */}
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