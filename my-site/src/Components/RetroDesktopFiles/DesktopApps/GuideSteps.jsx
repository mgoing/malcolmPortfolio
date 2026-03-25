// ============================================================
// GuideSteps.js  —  NEW FILE
// Defines every step of the new-visitor onboarding guide.
// To add a step: push a new entry into GUIDE_STEPS.
// To change a target: update the `target` field (matches
// data-guide="..." attributes added to DOM elements).
// ============================================================

export const GUIDE_STEPS = [
  {
    id: 'open-info',
    type: 'open-app',           // trigger: user double-clicks the icon
    appId: 'info',              // which icon to glow
    target: 'icon-info',        // data-guide value on the DesktopIcon wrapper
    instruction: 'Double-click the Site Info icon to get started.',
  },
  {
    id: 'scroll-info',
    type: 'scroll',             // trigger: user scrolls ≥50% inside the window
    appId: 'info',
    target: 'window-body-info', // data-guide value on the AppWindow scroll body
    instruction: 'Scroll down to read the site info.',
  },
  {
    id: 'open-info-panel',
    type: 'click',              // trigger: user clicks the [?] button
    appId: 'info',
    target: 'btn-info-info',    // data-guide="btn-info-{appId}" on the [?] button
    instruction: 'Click [?] to open the info panel for this app.',
  },
  {
    id: 'minimize-info',
    type: 'click',
    appId: 'info',
    target: 'btn-minimize-info',// data-guide="btn-minimize-{appId}" on _ button
    instruction: 'Click _ to minimize the window.',
  },
  {
    id: 'restore-info',
    type: 'taskbar',            // trigger: user clicks taskbar button to restore
    appId: 'info',
    target: 'taskbar-info',     // data-guide="taskbar-{appId}" on taskbar button
    instruction: 'Click the taskbar chip to restore the window.',
  },
  {
    id: 'resize-info',
    type: 'resize',             // trigger: ResizeObserver detects size change
    appId: 'info',
    target: 'resize-handle-info',// data-guide on the resize corner overlay
    instruction: 'Resize the window by dragging the bottom-right corner.',
  },
  {
    id: 'close-info',
    type: 'click',
    appId: 'info',
    target: 'btn-close-info',   // data-guide="btn-close-{appId}" on ✕ button
    instruction: 'Click ✕ to close the window.',
  },
  {
    id: 'open-reset',
    type: 'open-app',
    appId: 'reset',
    target: 'icon-reset',       // data-guide="icon-{appId}" on DesktopIcon wrapper
    instruction: 'Double-click Reset Website to finish the tour.',
  },
];

// Total step count — used by GuideOverlay to detect completion
export const GUIDE_TOTAL = GUIDE_STEPS.length;