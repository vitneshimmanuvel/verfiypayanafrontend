import React, { useEffect } from 'react';
import BannerSection from './Baneer';
import DentalProgram from './DentalProgram';
import HelpCommunity from './HelpCommunity';
import Invest from './Invest';
import Language from './Language';
import MBBSInfo from './MBBSInfo';
import NewsGPT from './NewsGPT';
import StudyOptions from './StudyOptions';
import Techarts from './Techarts';
import TestimonialSection from './TestimonialSection';
import AdPopup from './AdPopup ';

const HomePage = () => {
  // Auto-scroll to section when page loads with hash in URL
  useEffect(() => {
    const scrollToHashElement = () => {
      const { hash } = window.location;
      
      if (!hash) return;
      
      const elementToScroll = document.getElementById(hash.replace("#", ""));

      if (!elementToScroll) return;

      setTimeout(() => {
        window.scrollTo({
          top: elementToScroll.offsetTop - 80,
          behavior: "smooth"
        });
      }, 100);
    };

    scrollToHashElement();
    
    // Listen for hash changes
    window.addEventListener("hashchange", scrollToHashElement);
    return () => window.removeEventListener("hashchange", scrollToHashElement);
  }, []);

  return (
    <>
      <AdPopup />
      <BannerSection />
      
      <div id='tech'>
        <Techarts />
      </div>
      
      <div id='mbbs'>
        <MBBSInfo />
      </div>
      
      <div id='study'>
        <StudyOptions/>
      </div>

      <div id='language'>
        <Language />
      </div>
           
      <div id='work'>
        <HelpCommunity />
      </div>
      
      <div id='invest'>
        <Invest/>
      </div>
      
      <NewsGPT />
      <TestimonialSection />
    </>
  );
};

export default HomePage;
