import { QRCodeCanvas } from "qrcode.react";

export default function QRCard() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <p>No user</p>;

  return (
    <div className="qr-box">
      <QRCodeCanvas value={user._id} size={180} />
    </div>
  );
}