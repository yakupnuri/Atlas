import { useState, useCallback } from 'react';

// Generic CRUD hook for education module
export function useEducationData(type) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/education?type=${type}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data || []);
      } else {
        setError(result.error || 'Veri yüklenemedi');
      }
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [type]);

  // Create or Update
  const saveData = useCallback(async (itemData, isEdit = false) => {
    try {
      const response = await fetch('/api/education', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data: itemData })
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchData(); // Refresh data
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error(`Error saving ${type}:`, err);
      return { success: false, error: err.message };
    }
  }, [type, fetchData]);

  // Delete
  const deleteData = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/education?type=${type}&id=${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchData(); // Refresh data
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      return { success: false, error: err.message };
    }
  }, [type, fetchData]);

  return {
    data,
    loading,
    error,
    fetchData,
    saveData,
    deleteData,
    setData // For optimistic updates
  };
}
