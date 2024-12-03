"use client";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const MapComponent = ({ mapContainerStyle, center, zoom, markerData }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}>
      <GoogleMap mapContainerStyle={mapContainerStyle}   center={center ? center : { lat: 40.7128, lng: -74.0060 }} 
zoom={zoom}>
        <Marker
          key={markerData.id}
          position={{
            lat: Number(markerData.lat),
            lng: Number(markerData.lng),
          }}
          title={markerData.location} // Optional: You can use this as a title for the marker
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
