import React from 'react';
import Select from 'react-select';
const CustomOption = ({ data, innerRef, innerProps, selectedItems }) => (
    <div
    ref={innerRef}
    {...innerProps}
    className={`p-2 hover:bg-blue-50 flex items-center cursor-pointer ${
      data.isParent ? 'font-bold' : 'ml-4 text-sm'
    }`}
    onClick={() => handleChange(data)}
  >
    <input
      type="checkbox"
      checked={selectedItems.some((item) => item.value === data.value)}
      className="mr-2"
      readOnly
    />
    {data.label}
  </div>
  );


export default CustomOption
