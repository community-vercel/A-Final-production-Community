"use client";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];

const MapComponent = ({ mapContainerStyle, center, zoom, markerData }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY, // Replace with your API Key
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center || { lat: 40.7128, lng: -74.0060 }}
      zoom={zoom}
    >
      <Marker
        key={markerData.id}
        position={{
          lat: Number(markerData.lat),
          lng: Number(markerData.lng),
        }}
        title={markerData.location} // Optional title for marker
      />
    </GoogleMap>
  );
};

export default MapComponent;