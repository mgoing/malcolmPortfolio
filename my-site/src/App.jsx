import React from 'react';
import Background from './components/Background';
import MatrixRain from './Components/matrixRain';

export default function App() {
  return (
    <>
      {/* Background mounts and listens for events if you add them later */}

      <MatrixRain introMs={7000} fontSize={16} />
      <Background />

      {/* Minimal page scaffold so you can see layering */}
      <main style={{ position: 'relative', zIndex: 30, padding: 24 }}>
        <h1>React-Bits Faulty Terminal — test</h1>
        <p>Background should appear behind this content (z-index control).</p>
      </main>
    </>
  );
}