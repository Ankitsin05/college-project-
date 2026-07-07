import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function AuthorityDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState([]);
  const [tourist, setTourist] = useState(null);
  const [locations, setLocations] = useState([]);
  const [sosHistory, setSosHistory] = useState([]);
  const [sosAlert, setSosAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState(id ? "single" : "all");

  // Saare users fetch karo
  const fetchAllUsers = async () => {
    try {
      const res = await API.get("/location/all");
      setAllUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Single tourist fetch karo
  const fetchSingleTourist = async () => {
    try {
      setError(null);
      const userRes = await API.get(`/tourist/${id}`);
      setTourist(userRes.data);

      const locRes = await API.get(`/location/user/${id}`);
      setLocations(Array.isArray(locRes.data) ? locRes.data : [locRes.data]);

      const sosRes = await API.get(`/emergency/history/${id}`);
      setSosHistory(sosRes.data);

    } catch (err) {
      setError("Could not load tourist data");
    } finally {
      setLoading(false);
    }
  };

  // SOS check
  const checkSOS = async () => {
    try {
      const res = await API.get("/emergency/check");
      if (res.data.sos) {
        setSosAlert(true);
        new Audio("/ring.mp3").play().catch(() => {});
      } else {
        setSosAlert(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    if (id) fetchSingleTourist();
    else setLoading(false);

    const interval = setInterval(() => {
      fetchAllUsers();
      checkSOS();
      if (id) fetchSingleTourist();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const latest = locations.length > 0 ? locations[locations.length - 1] : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a, #0a2340)",
      padding: "30px 20px",
      paddingTop: "88px",
      color: "white",
      fontFamily: "'DM Sans', sans-serif"
    }}>

      {/* Header */}
      <div style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        padding: "20px 24px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap", gap: "12px"
      }}>
        <div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.4rem", fontWeight: 800,
            margin: 0, color: "white"
          }}>👮 Authority Dashboard</h2>
          <p style={{ color: "#9ca3af", margin: "4px 0 0", fontSize: "0.85rem" }}>
            {id ? `Tourist ID: ${id?.slice(-8).toUpperCase()}` : "All Tourists Overview"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* SOS Alert */}
          {sosAlert && (
            <div style={{
              background: "rgba(239,68,68,0.2)",
              border: "1px solid #ef4444",
              color: "#f87171",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: 700, fontSize: "0.85rem",
              animation: "pulse 1s infinite"
            }}>🚨 SOS ALERT!</div>
          )}

          {/* Tab Buttons */}
          <button
            onClick={() => setView("all")}
            style={{
              padding: "8px 16px",
              background: view === "all" ? "#0f4c81" : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white", borderRadius: "8px",
              cursor: "pointer", fontSize: "0.84rem", fontWeight: 600
            }}
          >👥 All Tourists</button>

          {id && (
            <button
              onClick={() => setView("single")}
              style={{
                padding: "8px 16px",
                background: view === "single" ? "#0f4c81" : "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white", borderRadius: "8px",
                cursor: "pointer", fontSize: "0.84rem", fontWeight: 600
              }}
            >👤 This Tourist</button>
          )}

          {/* Live Indicator */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: "8px", padding: "8px 14px"
          }}>
            <div style={{
              width: "8px", height: "8px",
              background: "#22c55e", borderRadius: "50%"
            }}/>
            <span style={{ color: "#4ade80", fontSize: "0.82rem" }}>Live</span>
          </div>
        </div>
      </div>

      {/* ALL USERS VIEW */}
      {view === "all" && (
        <div>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1rem", fontWeight: 700,
            marginBottom: "16px", color: "white"
          }}>👥 All Registered Tourists ({allUsers.length})</h3>

          {allUsers.length === 0 ? (
            <div style={{
              background: "#111827",
              borderRadius: "14px", padding: "40px",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>👥</div>
              <p style={{ color: "#9ca3af" }}>No tourists registered yet</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "16px"
            }}>
              {allUsers.map((u, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/authority/${u._id}`)}
                  style={{
                    background: "#111827",
                    border: `1px solid ${u.hasLocation ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: "14px", padding: "20px",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Tourist Header */}
                  <div style={{
                    display: "flex", alignItems: "center",
                    gap: "12px", marginBottom: "16px"
                  }}>
                    <div style={{
                      width: "44px", height: "44px",
                      background: "linear-gradient(135deg, #0f4c81, #1a6db5)",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800, fontSize: "0.9rem", color: "white"
                    }}>
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "white", fontSize: "0.95rem" }}>
                        {u.name}
                      </div>
                      <div style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
                        {u.email}
                      </div>
                    </div>
                    <div style={{
                      marginLeft: "auto",
                      background: u.hasLocation ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                      color: u.hasLocation ? "#4ade80" : "#9ca3af",
                      fontSize: "0.7rem", padding: "4px 10px",
                      borderRadius: "100px", fontWeight: 600
                    }}>
                      {u.hasLocation ? "🟢 Active" : "⚫ Offline"}
                    </div>
                  </div>

                  {/* Location Info */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr",
                    gap: "8px"
                  }}>
                    {[
                      { icon: "📍", label: "Location", value: u.lat ? `${u.lat?.toFixed(4)}, ${u.lng?.toFixed(4)}` : "No data" },
                      { icon: "🕒", label: "Last Seen", value: u.time ? new Date(u.time).toLocaleTimeString() : "N/A" },
                    ].map((item, j) => (
                      <div key={j} style={{
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: "8px", padding: "10px"
                      }}>
                        <div style={{ fontSize: "14px", marginBottom: "4px" }}>{item.icon}</div>
                        <div style={{ color: "#9ca3af", fontSize: "0.68rem" }}>{item.label}</div>
                        <div style={{
                          color: "white", fontWeight: 600,
                          fontSize: "0.78rem", marginTop: "2px",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                        }}>{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    marginTop: "12px",
                    color: "#60a5fa", fontSize: "0.78rem",
                    textAlign: "right"
                  }}>View Details →</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SINGLE TOURIST VIEW */}
      {view === "single" && (
        <div>
          {loading ? (
            <div style={{
              background: "#111827", borderRadius: "14px",
              padding: "40px", textAlign: "center",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⏳</div>
              <p style={{ color: "#9ca3af" }}>Loading tourist data...</p>
            </div>

          ) : error ? (
            <div style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "14px", padding: "30px", textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>❌</div>
              <p style={{ color: "#f87171", fontWeight: 600 }}>{error}</p>
            </div>

          ) : (
            <>
              {/* Tourist Info */}
              {tourist && (
                <div style={{
                  background: "#111827",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px", padding: "20px",
                  marginBottom: "20px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "16px"
                }}>
                  {[
                    { icon: "👤", label: "Name", value: tourist.name },
                    { icon: "📧", label: "Email", value: tourist.email },
                    { icon: "🛡️", label: "Status", value: "Verified" },
                    { icon: "📍", label: "Last Seen", value: latest ? `${latest.lat?.toFixed(4)}, ${latest.lng?.toFixed(4)}` : "No data" }
                  ].map((item, i) => (
                    <div key={i} style={{
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: "10px", padding: "14px"
                    }}>
                      <div style={{ fontSize: "20px", marginBottom: "6px" }}>{item.icon}</div>
                      <div style={{ color: "#9ca3af", fontSize: "0.72rem" }}>{item.label}</div>
                      <div style={{
                        color: "white", fontWeight: 600, fontSize: "0.85rem",
                        marginTop: "3px", overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap"
                      }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Live Map */}
              {latest && (
                <div style={{
                  background: "#111827",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px", overflow: "hidden",
                  marginBottom: "20px"
                }}>
                  <div style={{
                    padding: "14px 20px",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    display: "flex", alignItems: "center", gap: "8px"
                  }}>
                    <span>📍</span>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
                      Live Location
                    </span>
                  </div>
                  <iframe
                    key={`${latest.lat}-${latest.lng}`}
                    width="100%" height="380"
                    style={{ border: 0, display: "block" }}
                    loading="lazy" allowFullScreen
                    src={`https://maps.google.com/maps?q=${latest.lat},${latest.lng}&z=15&output=embed`}
                  />
                </div>
              )}

              {/* Movement History */}
              <div style={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px", padding: "20px",
                marginBottom: "20px"
              }}>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "0.95rem", fontWeight: 700,
                  marginBottom: "16px", color: "white"
                }}>🕐 Movement History</h3>
                <div style={{
                  display: "flex", flexDirection: "column", gap: "8px",
                  maxHeight: "200px", overflowY: "auto"
                }}>
                  {locations.length > 0 ? locations.map((loc, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: "8px", padding: "10px 14px"
                    }}>
                      <div style={{
                        width: "8px", height: "8px",
                        background: i === locations.length - 1 ? "#22c55e" : "#60a5fa",
                        borderRadius: "50%", flexShrink: 0
                      }}/>
                      <span style={{ color: "#e2e8f0", fontSize: "0.85rem" }}>
                        {loc.lat?.toFixed(6)}, {loc.lng?.toFixed(6)}
                      </span>
                      {i === locations.length - 1 && (
                        <span style={{
                          marginLeft: "auto",
                          background: "rgba(34,197,94,0.15)",
                          color: "#4ade80",
                          fontSize: "0.7rem", padding: "2px 8px",
                          borderRadius: "100px"
                        }}>Latest</span>
                      )}
                    </div>
                  )) : (
                    <p style={{ color: "#9ca3af" }}>No movement data yet</p>
                  )}
                </div>
              </div>

              {/* SOS History */}
              <div style={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px", padding: "20px"
              }}>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "0.95rem", fontWeight: 700,
                  marginBottom: "16px", color: "white"
                }}>🚨 SOS History</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {sosHistory.length > 0 ? sosHistory.map((sos, i) => (
                    <div key={i} style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      borderRadius: "8px", padding: "12px 14px"
                    }}>
                      <div style={{ color: "#f87171", fontWeight: 600, fontSize: "0.85rem" }}>
                        🚨 SOS Alert
                      </div>
                      <div style={{ color: "#9ca3af", fontSize: "0.78rem", marginTop: "4px" }}>
                        📍 {sos.lat}, {sos.lng}
                      </div>
                      <div style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
                        🕒 {new Date(sos.createdAt).toLocaleString()}
                      </div>
                    </div>
                  )) : (
                    <p style={{ color: "#9ca3af" }}>No SOS history</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}