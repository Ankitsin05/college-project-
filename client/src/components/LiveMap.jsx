import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";

export default function LiveMap() {
  const [location, setLocation] = useState({
    lat: 28.6139, // default (Delhi)
    lng: 77.2090,
  });

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
                  console.log("LOCATION:", pos);
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

  return (
    <LoadScript googleMapsApiKey="AIzaSyDDp9guTAXelgjLdmAAhTE4gxqD85RY1AI">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={location}
        zoom={15}
      >
        <Marker position={location} />
      </GoogleMap>
    </LoadScript>
  );
}