'use client';

import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const Map = () => {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = { lat: 40.7128, lng: -74.0060 };  // Default center (e.g., NYC)
  
  // Sample location data
  const locations = [
    { id: 1, lat: 37.7945952, lng: -106.5348379, title: "Marker 1" },
    // Add more locations as needed
  ];

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={{
              lat: location.lat,
              lng: location.lng,
            }}
            title={location.title}  // Optional: You can use this as a title for the marker
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;