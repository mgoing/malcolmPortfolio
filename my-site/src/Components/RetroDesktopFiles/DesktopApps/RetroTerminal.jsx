import React, { useEffect, useRef, useState } from "react";

export default function RetroTerminalApp({ app }) {
  const [lines, setLines] = useState([]);
  const intervalRef = useRef(null);
  const lineIndexRef = useRef(0);

  const commands = [
    { type: "output", text: "Initializing CRT-beta Interface..." },
    { type: "output", text: "Loading desktop modules..." },
    { type: "output", text: "System Ready." },
    { type: "command", text: "whoami" },
    { type: "output", text: "MG" },

    { type: "command", text: "cat skills.txt" },
    { type: "output", text: "React | Expo | Firebase | C++ | Face Tracking" },

    { type: "command", text: "ls projects/" },
    { type: "output", text: "desktop-os-ui/  face-tracker/  oneblock-app/" },

    { type: "command", text: "status" },
    { type: "output", text: "SYSTEM ONLINE — ERROR: 400-500-503-508" },
    { type: "output", text: "SYSTEM ERROR — USER INPUT UNAVAILABLE " },
    { type: "output", text: "SERVER RESPONSE - CONTENT UNDER MAINTENENCE" },
    { type: "output", text: "SERVER RESPONSE - CONTACT ADMIN" },
    { type: "output", text: "OUTPUT ." },
    { type: "output", text: "." },
    { type: "output", text: "." },
    { type: "output", text: "." },
    { type: "output", text: "." },
    { type: "output", text: "." },
    
  ];

  const isActive = !app?.minimized;

  useEffect(() => {
    if (!isActive) {
      // important for performance (matches your low CPU requirement)
      if (intervalRef.current) clearInterval(intervalRef.current);
      setLines([]);
      lineIndexRef.current = 0;
      return;
    }

    intervalRef.current = setInterval(() => {
      if (lineIndexRef.current < commands.length) {
        setLines(prev => [...prev, commands[lineIndexRef.current]]);
        lineIndexRef.current++;
      } else {
        setTimeout(() => {
          setLines([]);
          lineIndexRef.current = 0;
        }, 3500);
      }
    }, 700); // slightly faster = more "terminal feel"

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  return (
    <div className="nav-window__inner relative w-full h-full bg-[#02060a] p-3 overflow-hidden">
      
      {/* Subtle phosphor glow layer */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,140,0.06),transparent_70%)]" />

      {/* Terminal content */}
      <div className="relative z-10">
        {lines.map((line, index) => (
          <div key={index} className="terminal-line">
            {line.type === "command" && (
              <>
                <span className="prompt-symbol">{">"}</span>
                <span className="prompt-text">{line.text}</span>
              </>
            )}

            {line.type === "output" && (
              <span style={{ marginLeft: "22px", opacity: 0.9 }}>
                {line.text}
              </span>
            )}
          </div>
        ))}

        {/* Blinking cursor */}
        <div className="terminal-line">
          <span className="prompt-symbol">{">"}</span>
          <span className="terminal-cursor">█</span>
        </div>
      </div>
    </div>
  );
}