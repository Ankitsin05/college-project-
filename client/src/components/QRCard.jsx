import { QRCodeCanvas } from "qrcode.react";

export default function QRCard() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <p>No user</p>;

  // ✅ SPACE hata diya + correct URL
  const qrData = `https://safeyatra-app.vercel.app/authority/${user?._id}`;

  // ✅ correct console
  console.log("QR ID:", user?._id);
  console.log("QR URL:", qrData);

  return (
    <div className="qr-box">
      <QRCodeCanvas value={qrData} size={180} />
    </div>
  );
}