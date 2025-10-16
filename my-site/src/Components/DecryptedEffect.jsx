// src/components/DecryptedEffect.jsx
import React, { useEffect, useState } from 'react';
import DecryptedText from './DecryptedText'; 

export default function DecryptedEffect() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.__navDecrypted) {
    function onNavDecrypted(e) {
      setVisible(Boolean(e?.detail && e.detail.visible));
    }
  }
    window.addEventListener('nav-decrypted', onNavDecrypted);
    return () => window.removeEventListener('nav-decrypted', onNavDecrypted);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 64,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 35,
        pointerEvents: 'none',
        textAlign: 'center',
        color: 'white',
      }}
    >
      <DecryptedText
        text="Use 'A' & 'D' to move and 'Space Bar' to enter. Mobile support coming soon"
        speed={60}
        maxIterations={18}
        characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#"
        animateOn="view"      // optional: you can tune props
        revealDirection="center"
        className="revealed"
        parentClassName="all-letters"
        encryptedClassName="encrypted"
      />
    </div>
  );
}
