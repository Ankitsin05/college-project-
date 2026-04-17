import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

export default function VerifyUser() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get(`/tourist/${id}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Tourist Verification</h2>

      <div style={{
        background: "#111",
        padding: "20px",
        borderRadius: "10px",
        color: "white"
      }}>
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Status:</b> Verified ✅</p>
      </div>
    </div>
  );
}