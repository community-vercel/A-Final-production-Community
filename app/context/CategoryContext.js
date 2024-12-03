// context/CategoryContext.js
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState()
  const [isSubcategory, setIsSubcategory] = useState(true)


  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory,isSubcategory, setIsSubcategory}}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  return useContext(CategoryContext);
};
