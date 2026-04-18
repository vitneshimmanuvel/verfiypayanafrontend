import "./TestimonialSection.css";
import Player from "@vimeo/player";
import React, { useRef, useEffect, useState } from "react";

const TestimonialSection = () => {
  const trackRef = useRef(null);
  const iframeRefs = useRef([]);
  const playersRef = useRef([]);

  const [playingState, setPlayingState] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  /* const videos = [
    // Hardcoded videos removed
  ]; */
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/testimonials`);
        const data = await response.json();
        if (data.success) {
          // Map backend data to component format
          const formattedVideos = data.data.map(t => ({
            id: t.id.toString(),
            name: t.name,
            src: t.video_url
          }));
          setVideos(formattedVideos);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);


  useEffect(() => {
    setPlayingState(Array(videos.length).fill(false));
  }, [videos.length]);

  // Detect desktop
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.matchMedia("(min-width: 1240px)").matches);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Auto-scroll right-to-left when not paused
  useEffect(() => {
    if (!isDesktop) return;
    const track = trackRef.current;
    if (!track) return;

    let animationFrame;
    const speed = 50; // pixels per second
    let last = performance.now();

    const animate = (now) => {
      const delta = now - last;
      if (!isPaused) {
        track.scrollLeft -= (speed * delta) / 1000;
        if (track.scrollLeft <= 0) {
          track.scrollLeft = track.scrollWidth;
        }
      }
      last = now;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isDesktop, isPaused]);

  // Toggle play/pause for individual videos
  const handlePlay = (index) => {
    const video = videos[index];
    const element = iframeRefs.current[index];
    
    if (video.src.includes('player.vimeo.com')) {
        if (!playersRef.current[index]) {
          playersRef.current[index] = new Player(element);
        }
        const player = playersRef.current[index];
        if (playingState[index]) player.pause();
        else player.play();
    } else {
        if (playingState[index]) {
            element.pause();
        } else {
            element.play();
        }
    }

    setPlayingState((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <section className="testimonial-section">
      <div className="text-content">
        <h2><span>Client</span> Testimonials</h2>
        <p>Our Success Stories</p>
      </div>

      <div
        className="testimonial-row"
        ref={trackRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {videos.map((video, idx) => (
          <div
            key={video.id}
            className="video-card"
            data-name={video.name}
            onClick={() => handlePlay(idx)}
          >
            <div className="video-overlay"></div>
            {video.src.includes('player.vimeo.com') ? (
               <iframe
                ref={(el) => (iframeRefs.current[idx] = el)}
                src={video.src}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                title={`Vimeo ${video.id}`}
              ></iframe>
            ) : (
               <video
                ref={(el) => (iframeRefs.current[idx] = el)}
                src={video.src}
                className="w-full h-full object-cover"
                style={{ borderRadius: '20px' }} 
                onEnded={() => {
                    setPlayingState(prev => {
                        const next = [...prev];
                        next[idx] = false;
                        return next;
                    });
                }}
              />
            )}
            
            {!playingState[idx] && (
              <div
                className="play-button"
                onClick={(e) => { e.stopPropagation(); handlePlay(idx); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;