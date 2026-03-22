import { Component } from 'react';
import HackRFIcon from './HackRFIcon';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error?.message || String(error) };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 p-8">
          <div className="text-center max-w-md">
            <HackRFIcon className="w-16 h-16 text-primary mx-auto mb-4 opacity-40" />
            <h1 className="font-display text-xl text-error mb-2 tracking-wider">Signal Lost</h1>
            <p className="text-sm text-base-content/60 mb-6">
              An unexpected error occurred. Try refreshing the page.
            </p>
            {this.state.error && (
              <p className="text-[10px] text-error/50 font-mono mt-2 mb-4 max-w-sm mx-auto break-all">
                {this.state.error}
              </p>
            )}
            <p className="text-sm text-base-content/60 mb-6 hidden">
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-sm btn-primary font-mono"
            >
              Reload
            </button>
            <p className="text-[10px] text-base-content/20 mt-8 font-mono">Fresh Mayhem — A <a href="https://superbasic.studio" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400 underline underline-offset-2">Super Basic Studio</a> project</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
