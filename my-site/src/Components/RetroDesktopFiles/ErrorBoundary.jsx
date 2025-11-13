import React from 'react';

/**
 * Simple ErrorBoundary that shows a friendly message and exposes
 * an optional onReset callback (e.g., to close the window).
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // you can log error to a service here
    this.setState({ error, info });
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    // clear own state and call optional onReset prop
    this.setState({ hasError: false, error: null, info: null }, () => {
      if (typeof this.props.onReset === 'function') this.props.onReset();
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-3 text-sm">
          <div style={{ color: '#f5c6cb' }}>
            <strong>App failed to load.</strong>
          </div>
          <div style={{ marginTop: 8 }}>
            {String(this.state.error?.toString?.() || 'Unknown error')}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button onClick={this.handleReset} className="px-2 py-1 font-mono border rounded bg-white/5">Close</button>
            <button onClick={() => window.location.reload()} className="px-2 py-1 font-mono border rounded bg-white/5">Reload page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
