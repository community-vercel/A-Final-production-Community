// components/AddressAutocomplete.js
import React, { useRef, useEffect } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const AddressAutocomplete = ({ onPlaceSelected }) => {
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current,
      { types: ['address'] }
    );
    

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        onPlaceSelected(place);
      }
    });

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [onPlaceSelected]);

  return (
    <input
      ref={autocompleteRef}
      type="text"
      placeholder="Enter your address"
      style={{ width: '100%', padding: '8px' }}
    />
  );
};

const AddressInput = ({ onAddressSelected }) => {
  
    const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    return (
      <LoadScript googleMapsApiKey={googleApiKey} libraries={libraries}>
        <AddressAutocomplete onPlaceSelected={onAddressSelected} />
      </LoadScript>
    )
};

export default AddressInput;
