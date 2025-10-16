//App.jsx
import React from 'react';
import DecryptedText from './Components/DecryptedText';  
import Background from './Components/Background'; 


export default function App() {

 return (
    <>
      {/* Mount the background so it listens for show/hide events */}
      <Background />

      {/* Decrypted text will be handled by DecryptedEffect (it listens to nav-decrypted) */}
      <DecryptedText />

      {/* ...rest of your UI (nav, main content, sprites, etc.) */}
    </>
  );
}