import React, { useState } from 'react';

import MatrixRain from './Components/matrixRain';

import NavWindow from './Components/nav';
import DecryptedEffect from './Components/DecryptedEffect';
import RetroDesktop from './Components/Desktop';


export default function App() {
  const [showDesktop, setShowDesktop] = useState(false);

  // called by NavWindow when correct password is entered
  function handleAuthSuccess() {
    setShowDesktop(true);
    // optional: clear any intro flags, start desktop music etc.
  }

  return (
    <>
      {/* If desktop visible, mount RetroDesktop and hide the intro UI */}
      {showDesktop ? (
        <RetroDesktop />
      ) : (
        <>
          {/* Background / intro */}
          <MatrixRain introMs={7000} fontSize={16} />

          {/* Pass the onSuccess handler so NavWindow toggles the desktop in-app */}
          <NavWindow
            outerScale={0.8}
            innerScale={0.8}
            navClickUrl="/desktop" // harmless fallback if you later remove onSuccess
            semiBgAlpha={0.45}
            onSuccess={handleAuthSuccess}
          />

          <DecryptedEffect />
          {/* ...rest of your intro UI */}
        </>
      )}
    </>
  );
}