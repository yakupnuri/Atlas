import { useState, useCallback } from 'react';

export function useMediaLibrary() {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaTarget, setMediaTarget] = useState(null);
  const [selectedCallback, setSelectedCallback] = useState(null);

  const openMediaLibrary = useCallback((target, callback) => {
    setMediaTarget(target);
    setSelectedCallback(() => callback); // Wrap in function to store callback
    setShowMediaLibrary(true);
  }, []);

  const closeMediaLibrary = useCallback(() => {
    setShowMediaLibrary(false);
    setMediaTarget(null);
    setSelectedCallback(null);
  }, []);

  const handleMediaSelect = useCallback((selectedItem) => {
    console.log('Media selected:', selectedItem);
    
    if (selectedCallback) {
      // Extract URL from various formats
      const imageUrl = typeof selectedItem === 'string' 
        ? selectedItem 
        : (selectedItem?.url || selectedItem?.path || selectedItem?.thumb || '');
      
      if (imageUrl) {
        selectedCallback(imageUrl);
      }
    }
    
    closeMediaLibrary();
  }, [selectedCallback, closeMediaLibrary]);

  return {
    showMediaLibrary,
    mediaTarget,
    openMediaLibrary,
    closeMediaLibrary,
    handleMediaSelect
  };
}
