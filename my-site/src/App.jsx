import React, { useState, useCallback, useEffect } from 'react';

import MatrixRain from './Components/matrixRain';

import NavWindow from './Components/nav';
import DecryptedEffect from './Components/DecryptedEffect';
import RetroDesktop from './Components/RetroDesktopFiles/Desktop';
import TerminalIntro from './Components/TerminalIntro';
import './Components/TerminalIntro.css';

const INTRO_KEY = 'hasSeenIntro';

export default function App() {
  const [showDesktop, setShowDesktop] = useState(() => {
    return localStorage.getItem(INTRO_KEY) === 'true';
  });

  //temp remove the css preloader until I clean out navwindow background etc
  useEffect(() => {
    if (!showDesktop) return;
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    preloader.classList.add('hidden');
    // After the CSS transition (360ms) fully remove it from the DOM
    const t = setTimeout(() => preloader.remove(), 400);
    return () => clearTimeout(t);
  }, [showDesktop]);

  // called by NavWindow when correct password is entered
  const handleAuthSuccess = useCallback(() => {
    localStorage.setItem(INTRO_KEY, 'true');
    setShowDesktop(true);
    
    // optional: clear any intro flags, start desktop music etc.
  }, []);

  /*
  return (
    <>
      
      {showDesktop ? (
        <RetroDesktop />
      ) : (
        <>
          {/* Background / intro 
          <MatrixRain introMs={6000} fontSize={16} />

          {/* Pass the onSuccess handler so NavWindow toggles the desktop in-app 
          <NavWindow
            outerScale={0.8}
            innerScale={0.8}
            navClickUrl="/desktop" // harmless fallback if you later remove onSuccess
            semiBgAlpha={0.45}
            onSuccess={handleAuthSuccess}
          />

          <DecryptedEffect />
          
        </>
      )}
    </>
  );

  */

  return(
<>
      {showDesktop ? (
        <RetroDesktop />
      ) : (
        <TerminalIntro onSuccess={handleAuthSuccess} />
      )}
    </>

  );
}