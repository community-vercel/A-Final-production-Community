'use client';
import React, { useState, useEffect } from 'react';

// Custom Dropdown Component
const CustomDropdown = ({ label, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelected(option.name);
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="text-xs text-gray-400 uppercase">{label}</label>
      <div
        onClick={toggleDropdown}
        style={{
          backgroundColor: '#2d3748', // Change this to desired background color
          color: 'white', // Change this to desired text color
          border: 'none',
          padding: '8px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {selected || 'Select'}
      </div>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            backgroundColor: '#2d3748', // Change this to desired dropdown options background
            color: 'white', // Change this to desired options text color
            borderRadius: '4px',
            zIndex: 1,
            width: '100%',
          }}
        >
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleOptionClick(option)}
              style={{
                padding: '8px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4a5568')} // Change this for hover effect
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};