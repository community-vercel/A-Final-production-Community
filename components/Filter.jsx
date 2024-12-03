'use client';
import React, { useState } from 'react';
import { 
  CitySelect, StateSelect 
} from 'react-country-state-city';
import 'react-country-state-city/dist/react-country-state-city.css';

const FilterBar = ({ filters, onFilterChange, propertyTypes }) => {
    const countryid = 233; // Country ID for the USA
  const [stateid, setstateid] = useState(0); // Stores the selected state ID
  const [selectedState, setSelectedState] = useState(''); // Selected state
  const [selectedCity, setSelectedCity] = useState(''); // Selected city

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Reset empty values to null to avoid filtering with empty strings
    onFilterChange((prevFilters) => ({
      ...prevFilters,
      [name]: value === '' ? null : value,
    }));
  };

  const handleStateChange = (value) => {
    setSelectedState(value); // Update selected state
    setstateid(value.id); // Set the state ID for CitySelect
    onFilterChange((prevFilters) => ({
      ...prevFilters,
      state: value ? value.name : null,
    }));
  };

  const handleCityChange = (value) => {
    setSelectedCity(value); // Update selected city
    onFilterChange((prevFilters) => ({
      ...prevFilters,
      city: value ? value.name : null,
    }));
  };

  return (
    <div className="bg-black text-white p-4 py-4 mt-3">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Purpose */}
      <div>
        <label className="text-xs text-gray-400 uppercase">Purpose</label>
        <select
          name="purpose"
          value={filters.purpose || ''}
          onChange={handleChange}
          className="w-full bg-gray-200 text-black text-sm px-3 py-2 rounded-md border-0"
        >
          <option value="">Select</option>
          <option value="rent">Rent</option>
          <option value="sell">Buy</option>
        </select>
      </div>
  
      {/* State */}
      <div>
        <label className="text-xs text-gray-400 uppercase">State</label>
        <StateSelect
          countryid={countryid}
          onChange={handleStateChange}
          placeHolder="Select State"
          inputClassName="w-full bg-gray-200 text-black text-sm px-3 py-2 rounded-md outline-0 border-0"
          containerClassName="text-black text-sm w-full"
        />
      </div>
  
      {/* City */}
      <div>
        <label className="text-xs text-gray-400 uppercase">City</label>
        <CitySelect
          countryid={countryid}
          stateid={stateid}
          onChange={handleCityChange}
          placeHolder="Select City"
          inputClassName="w-full bg-gray-200 text-black text-sm px-3 py-2 rounded-md border-0 outline-0"
          containerClassName="w-full text-black text-sm"
        />
      </div>
  
      {/* Price Range */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2 col-span-2">
        <div className="w-full">
          <label className="text-xs text-gray-400 uppercase">Price (From)</label>
          <input
            type="number"
            name="price_from"
            value={filters.price_from || ''}
            onChange={handleChange}
            placeholder="0"
            className="w-full bg-gray-200 text-black text-sm px-3 py-2 rounded-md border-0"
          />
        </div>
        <div className="w-full">
          <label className="text-xs text-gray-400 uppercase">Price (To)</label>
          <input
            type="number"
            name="price_to"
            value={filters.price_to || ''}
            onChange={handleChange}
            placeholder="Any"
            className="w-full bg-gray-200 text-black text-sm px-3 py-2 rounded-md border-0"
          />
        </div>
      </div>
  
      {/* Property Type */}
      <div>
        <label className="text-xs text-gray-400 uppercase">Property Type</label>
        <select
          className="w-full bg-gray-200 text-black text-sm px-3 py-2 rounded-md border-0"
          value={filters.property_type || ''}
          onChange={(e) => onFilterChange({ ...filters, property_type: e.target.value })}
        >
          <option value="">All Types</option>
          {propertyTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
  
      {/* Beds and Baths */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2">
        <div>
          <label className="text-xs text-gray-400 uppercase">Beds</label>
          <select
            name="beds"
            value={filters.beds || ''}
            onChange={handleChange}
            className="w-full bg-gray-200 text-black text-sm px-3 py-2 rounded-md border-0"
          >
            <option value="">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </div>
  
        <div>
          <label className="text-xs text-gray-400 uppercase">Baths</label>
          <select
            name="baths"
            value={filters.baths || ''}
            onChange={handleChange}
            className="w-full bg-gray-200 text-black text-sm px-3 py-2 rounded-md border-0"
          >
            <option value="">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </div>
      </div>
  
      {/* Area Range */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2 col-span-2">
        <div>
          <label className="text-xs text-gray-400 uppercase">Area (Marla) (From)</label>
          <input
            type="number"
            name="area_from"
            value={filters.area_from || ''}
            onChange={handleChange}
            placeholder="0"
            className="w-full bg-gray-200 text-black text-sm px-3 py-2 rounded-md border-0"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 uppercase">Area (Marla) (To)</label>
          <input
            type="number"
            name="area_to"
            value={filters.area_to || ''}
            onChange={handleChange}
            placeholder="Any"
            className="w-full bg-gray-200 text-black text-sm px-3 py-2 rounded-md border-0"
          />
        </div>
      </div>
  
      {/* Keyword */}
      <div>
        <label className="text-xs text-gray-400 uppercase">Keyword</label>
        <input
          type="text"
          name="keyword"
          value={filters.keyword || ''}
          onChange={handleChange}
          placeholder="Search"
          className="w-full bg-gray-200 text-black text-sm px-3 py-2 rounded-md border-0"
        />
      </div>
    </div>
  </div>
  
  );
};

export default FilterBar;
