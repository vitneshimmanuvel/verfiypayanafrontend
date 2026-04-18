// src/components/AdPopup.jsx
import React, { useState, useEffect } from 'react';

const AdPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adData, setAdData] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchActiveAd();
  }, []);

  const fetchActiveAd = async () => {
    try {
      const response = await fetch(`${API_URL}/ads/active`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setAdData(data.data);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Error fetching active ad:', error);
    }
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: isOpen ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      padding: '20px',
    },
    modalContainer: {
      position: 'relative',
      maxWidth: '900px',
      maxHeight: '80vh', // Limits height to 80% of viewport
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      fontSize: '24px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
      transition: 'background-color 0.3s ease',
    },
    imageWrapper: {
      width: '100%',
      height: '100%',
      overflow: 'auto', // Allows scrolling if image is taller
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    adImage: {
      width: '100%',
      height: 'auto',
      maxHeight: '80vh', // Prevents image from exceeding viewport
      display: 'block',
      objectFit: 'contain', // Maintains aspect ratio
    },
  };

  if (!isOpen || !adData) return null;

  return (
    <div style={styles.overlay} onClick={closePopup}>
      <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <button
          style={styles.closeButton}
          onClick={closePopup}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          }}
          aria-label="Close popup"
        >
          ×
        </button>
        <div style={styles.imageWrapper}>
          <img
            src={adData.image_url}
            alt="Advertisement"
            style={styles.adImage}
          />
        </div>
      </div>
    </div>
  );
};

export default AdPopup;
