// src/hooks/useGetCategory.js
import { useState, useEffect } from 'react';

function useGetCategory(url,id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError(null);
const request={
    'category_id':id
}


      try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(request),
          });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const categoryData = await response.json();
        setData(categoryData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  return { data, loading, error };
}

export default useGetCategory;
