// src/components/AdPopup.jsx
import React, { useState, useEffect } from 'react';

const AdPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adData, setAdData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchActiveAd();
  }, []);

  // Auto-play interval
  useEffect(() => {
    if (!isOpen || adData.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % adData.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [isOpen, adData.length]);

  const fetchActiveAd = async () => {
    // If we are on a profile assessment route, do not show the popup
    const path = window.location.pathname.toLowerCase();
    if (
      path.includes('workprofile') || 
      path.includes('work-profile') || 
      path.includes('studyprofile') || 
      path.includes('study-profile')
    ) {
      return;
    }

    // If the user has already interacted with/closed the popup in this session, do not show it
    if (sessionStorage.getItem('ad_popup_dismissed') === 'true') {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/ads/active`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const flattenedSlides = [];
        data.data.forEach((ad) => {
          if (ad.type === 'carousel' && Array.isArray(ad.images) && ad.images.length > 0) {
            ad.images.forEach((slide, sIdx) => {
              flattenedSlides.push({
                id: `${ad.id}-${sIdx}-${slide.cloudinary_id || sIdx}`,
                image_url: slide.image_url,
                button_text: slide.button_text,
                button_link: slide.button_link
              });
            });
          } else {
            flattenedSlides.push({
              id: ad.id,
              image_url: ad.image_url,
              button_text: ad.button_text,
              button_link: ad.button_link
            });
          }
        });

        setAdData(flattenedSlides);
        if (flattenedSlides.length > 0) {
          setIsOpen(true);
        }
      }
    } catch (error) {
      console.error('Error fetching active ad:', error);
    }
  };

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem('ad_popup_dismissed', 'true');
  };

  const handleCtaClick = (e, link) => {
    sessionStorage.setItem('ad_popup_dismissed', 'true');
    setIsOpen(false);

    const lowerLink = link.toLowerCase();
    if (lowerLink.includes('workprofile') || lowerLink.includes('work-profile')) {
      e.preventDefault();
      const element = document.getElementById('work-profile-form');
      if (element) {
        const absoluteTop = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: absoluteTop - 80,
          behavior: "smooth"
        });
      }
      window.history.pushState({}, '', '/workprofile');
    } else if (lowerLink.includes('studyprofile') || lowerLink.includes('study-profile')) {
      e.preventDefault();
      const element = document.getElementById('study');
      if (element) {
        const absoluteTop = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: absoluteTop - 80,
          behavior: "smooth"
        });
      }
      window.history.pushState({}, '', '/studyprofile');
    }
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % adData.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + adData.length) % adData.length);
  };

  const goToSlide = (e, index) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev + 1) % adData.length);
    } else if (isRightSwipe) {
      setCurrentIndex((prev) => (prev - 1 + adData.length) % adData.length);
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: isOpen ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999999,
      padding: '20px',
    },
    modalContainer: {
      position: 'relative',
      maxWidth: '850px',
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      border: '1px solid #222',
    },
    closeButton: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      backgroundColor: 'rgba(239, 68, 68, 0.9)',
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      fontSize: '22px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      transition: 'all 0.2s',
    },
    carouselWrapper: {
      position: 'relative',
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr',
    },
    slide: (isActive) => ({
      gridColumn: '1 / 2',
      gridRow: '1 / 2',
      opacity: isActive ? 1 : 0,
      visibility: isActive ? 'visible' : 'hidden',
      pointerEvents: isActive ? 'auto' : 'none',
      transition: 'opacity 0.5s ease-in-out, visibility 0.5s',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
    }),
    imageContainer: {
      position: 'relative',
      width: '100%',
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
      overflow: 'hidden',
      cursor: 'pointer',
    },
    adImage: {
      maxWidth: '100%',
      maxHeight: '70vh',
      height: 'auto',
      display: 'block',
      objectFit: 'contain',
    },
    bannerSection: {
      width: '100%',
      padding: '16px 20px',
      backgroundColor: '#000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderTop: 'none',
    },
    actionButton: {
      backgroundColor: '#dc2626',
      color: '#fff',
      padding: '10px 28px',
      borderRadius: '8px',
      fontWeight: 'bold',
      fontSize: '1rem',
      textDecoration: 'none',
      boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
      transition: 'transform 0.2s, background-color 0.2s',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      width: '44px',
      height: '44px',
      fontSize: '20px',
      cursor: 'pointer',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      transition: 'all 0.2s',
      backdropFilter: 'blur(4px)',
    },
    leftNav: {
      left: '15px',
    },
    rightNav: {
      right: '15px',
    },
    dotsContainer: {
      position: 'absolute',
      bottom: '15px',
      left: '0',
      right: '0',
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      zIndex: 90,
    },
    dot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
    },
  };

  if (!isOpen || adData.length === 0) return null;

  return (
    <div style={styles.overlay} onClick={closePopup}>
      <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <button
          style={styles.closeButton}
          onClick={closePopup}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.backgroundColor = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
          }}
          aria-label="Close popup"
        >
          ×
        </button>
        
        <div 
          style={styles.carouselWrapper}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {adData.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div key={slide.id} style={styles.slide(isActive)}>
                <div style={styles.imageContainer} onClick={nextSlide}>
                  <img
                    src={slide.image_url}
                    alt="Advertisement"
                    style={styles.adImage}
                  />
                  
                  {/* Dots inside the active image container */}
                  {adData.length > 1 && (
                    <div style={styles.dotsContainer}>
                      {adData.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          style={{
                            ...styles.dot,
                            backgroundColor: dotIdx === currentIndex ? '#dc2626' : 'rgba(255, 255, 255, 0.4)',
                            transform: dotIdx === currentIndex ? 'scale(1.2)' : 'scale(1)',
                          }}
                          onClick={(e) => goToSlide(e, dotIdx)}
                          aria-label={`Go to ad ${dotIdx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Banner Button Row */}
                {slide.button_link && slide.button_text && (
                  <div style={styles.bannerSection}>
                    <a 
                      href={slide.button_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => handleCtaClick(e, slide.button_link)}
                      style={styles.actionButton}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05) translateY(-1px)';
                        e.target.style.backgroundColor = '#b91c1c';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1) translateY(0)';
                        e.target.style.backgroundColor = '#dc2626';
                      }}
                    >
                      {slide.button_text}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Slide Nav Buttons */}
          {adData.length > 1 && (
            <>
              <button 
                style={{...styles.navButton, ...styles.leftNav}} 
                onClick={prevSlide}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.45)';
                  e.target.style.transform = 'translateY(-50%) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
                aria-label="Previous ad"
              >
                &#10094;
              </button>
              <button 
                style={{...styles.navButton, ...styles.rightNav}} 
                onClick={nextSlide}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.45)';
                  e.target.style.transform = 'translateY(-50%) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
                aria-label="Next ad"
              >
                &#10095;
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdPopup;
