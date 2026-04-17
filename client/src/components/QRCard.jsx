import { QRCodeCanvas } from "qrcode.react";

export default function QRCard() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <p>No user</p>;

  const qrData = JSON.stringify({
    id: user._id,
    name: user.name,
    email: user.email,
  });

  return (
    <div>
      <QRCodeCanvas value={qrData} size={180} />
    </div>
  );
}