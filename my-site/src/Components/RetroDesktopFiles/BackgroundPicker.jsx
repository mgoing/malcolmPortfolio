// src/components/RetroDesktopFiles/BackgroundPicker.jsx
import React, { useState } from 'react';

// import images so bundler resolves them
import crtGridImg from '../../assets/crt-grid.png';
import retroNeonImg from '../../assets/retroNeonThis.jpg';


const PRESETS = [
  { key: 'crt-grid', label: 'CRT Grid', type: 'preset-image', src: crtGridImg },
  { key: 'retro-neon', label: 'Retro Neon', type: 'preset-image', src: retroNeonImg },
  {
    key: 'wave-gradient',
    label: 'Wave Gradient',
    type: 'gradient',
    // either colors OR css is supported; colors preferred for two-color UI
    colors: ['#041022', '#6a2ea5'],
    css: 'linear-gradient(180deg,#041022 0%, #a0cadc 50%, #6a2ea5 100%)',
  },
  { key: 'soft-blue', label: 'Soft Blue', type: 'solid', color: '#6bbcc5' },
];

// produce CSS from two colors
function gradientCssFromColors(a, b) {
  return `linear-gradient(180deg, ${a} 0%, ${b} 100%)`;
}

// safely extract two colors from preset (colors array preferred, else try to parse css, else default)
function presetColorsOrDefault(preset) {
  if (!preset) return ['#041022', '#6a2ea5'];
  if (Array.isArray(preset.colors) && preset.colors.length >= 2) return [preset.colors[0], preset.colors[1]];
  if (typeof preset.css === 'string') {
    const match = preset.css.match(/#([0-9a-fA-F]{3,8})/g) || [];
    if (match.length >= 2) return [match[0], match[1]];
  }
  // fallback default
  return ['#041022', '#6a2ea5'];
}

export default function BackgroundPicker({ current, onApply, onClose }) {
  // Normalize incoming current into the selection shape the component uses.
  const normalizedDefault = (() => {
    if (!current) {
      const fallback = PRESETS.find(p => p.type === 'gradient') || PRESETS[2];
      const colors = presetColorsOrDefault(fallback);
      return { type: 'gradient', colors, css: gradientCssFromColors(colors[0], colors[1]) };
    }
    if (current.type === 'gradient') {
      // try to extract colors from css if available, otherwise use default gradient preset
      const colors = current.colors || [];
      if (colors.length >= 2) return { type: 'gradient', colors, css: gradientCssFromColors(colors[0], colors[1]) };
      if (typeof current.css === 'string') {
        const match = current.css.match(/#([0-9a-fA-F]{3,8})/g) || [];
        if (match.length >= 2) return { type: 'gradient', colors: [match[0], match[1]], css: current.css };
        return { type: 'gradient', colors: presetColorsOrDefault(PRESETS[2]), css: current.css };
      }
      return { type: 'gradient', colors: presetColorsOrDefault(PRESETS[2]), css: gradientCssFromColors(...presetColorsOrDefault(PRESETS[2])) };
    }
    if (current.type === 'solid') {
      return { type: 'solid', color: current.color || '#00121a' };
    }
    if (current.type === 'preset-image') {
      return { type: 'preset-image', src: current.src || '' };
    }
    return { type: 'gradient', colors: presetColorsOrDefault(PRESETS[2]), css: gradientCssFromColors(...presetColorsOrDefault(PRESETS[2])) };
  })();

  const [selection, setSelection] = useState(normalizedDefault);

  function choosePreset(preset) {
    if (!preset) return;
    if (preset.type === 'preset-image') {
      setSelection({ type: 'preset-image', src: preset.src || '' });
      return;
    }
    if (preset.type === 'gradient') {
      const colors = presetColorsOrDefault(preset);
      setSelection({ type: 'gradient', colors, css: gradientCssFromColors(colors[0], colors[1]) });
      return;
    }
    if (preset.type === 'solid') {
      setSelection({ type: 'solid', color: preset.color || '#00121a' });
      return;
    }
  }

  function handleGradientColorChange(index, value) {
    if (selection.type !== 'gradient') {
      const base = presetColorsOrDefault(PRESETS[2]);
      const colors = [...base];
      colors[index] = value;
      setSelection({ type: 'gradient', colors, css: gradientCssFromColors(colors[0], colors[1]) });
    } else {
      const colors = selection.colors ? [...selection.colors] : presetColorsOrDefault(PRESETS[2]);
      colors[index] = value;
      setSelection({ type: 'gradient', colors, css: gradientCssFromColors(colors[0], colors[1]) });
    }
  }

  function handleSolidChange(e) {
    setSelection({ type: 'solid', color: e.target.value });
  }

  function applySelection() {
    let payload;
    if (selection.type === 'gradient') {
      const a = (selection.colors && selection.colors[0]) || presetColorsOrDefault(PRESETS[2])[0];
      const b = (selection.colors && selection.colors[1]) || presetColorsOrDefault(PRESETS[2])[1];
      payload = { type: 'gradient', css: gradientCssFromColors(a, b) };
    } else if (selection.type === 'solid') {
      payload = { type: 'solid', color: selection.color || '#00121a' };
    } else {
      payload = { type: 'preset-image', src: selection.src || '' };
    }
    if (typeof onApply === 'function') onApply(payload);
    if (typeof onClose === 'function') onClose();
  }

  // preview style
  const previewStyle = {};
  if (selection?.type === 'gradient' && selection.colors && selection.colors.length >= 2) {
    previewStyle.backgroundImage = gradientCssFromColors(selection.colors[0], selection.colors[1]);
    previewStyle.backgroundSize = 'cover';
    previewStyle.backgroundPosition = 'center';
  } else if (selection?.type === 'solid' && selection.color) {
    previewStyle.backgroundColor = selection.color;
  } else if (selection?.type === 'preset-image' && selection.src) {
    previewStyle.backgroundImage = `url("${selection.src}")`;
    previewStyle.backgroundSize = 'cover';
    previewStyle.backgroundPosition = 'center';
    previewStyle.backgroundRepeat = 'no-repeat';
  } else {
    previewStyle.backgroundColor = 'transparent';
  }

  return (
    <div className="p-3 text-sm w-full h-full">
      <h3 className="font-mono mb-2">Background</h3>

      <div className="mb-3">
        <div className="font-mono text-xs mb-1">Presets</div>
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => choosePreset(p)}
              className="w-28 h-16 border rounded overflow-hidden text-xs p-1 no-drag"
              type="button"
            >
              {p.type === 'preset-image' ? (
                <img src={p.src} alt={p.label} className="w-full h-full object-cover" />
              ) : p.type === 'gradient' ? (
                <div style={{ background: gradientCssFromColors(...presetColorsOrDefault(p)), width: '100%', height: '100%' }} />
              ) : (
                <div style={{ background: p.color || '#000', width: '100%', height: '100%' }} />
              )}
              <div className="text-center mt-1">{p.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Gradient picker */}
      <div className="mb-3">
        <div className="font-mono text-xs mb-1">Gradient (pick two colors)</div>
        <div className="flex items-center gap-3">
          <label className="font-mono text-xs">Color A</label>
          <input
            type="color"
            value={
              selection.type === 'gradient' && selection.colors && selection.colors[0]
                ? selection.colors[0]
                : presetColorsOrDefault(PRESETS[2])[0]
            }
            onChange={(e) => handleGradientColorChange(0, e.target.value)}
          />
          <label className="font-mono text-xs">Color B</label>
          <input
            type="color"
            value={
              selection.type === 'gradient' && selection.colors && selection.colors[1]
                ? selection.colors[1]
                : presetColorsOrDefault(PRESETS[2])[1]
            }
            onChange={(e) => handleGradientColorChange(1, e.target.value)}
          />
        </div>
      </div>

      {/* Solid color */}
      <div className="mb-3">
        <div className="font-mono text-xs mb-1">Solid color</div>
        <input type="color" value={selection.type === 'solid' ? selection.color : '#00121a'} onChange={handleSolidChange} />
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={applySelection} className="px-2 py-1 font-mono border rounded">
          Apply
        </button>
        <button onClick={() => onClose && onClose()} className="px-2 py-1 font-mono border rounded">
          Cancel
        </button>
      </div>

      <div className="mt-4">
        <div className="font-mono text-xs mb-1">Preview</div>
        <div className="w-full h-36 border rounded overflow-hidden" style={previewStyle} />
      </div>
    </div>
  );
}
