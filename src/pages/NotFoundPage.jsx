import { Link } from 'react-router-dom';
import HackRFIcon from '../../components/HackRFIcon';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <HackRFIcon className="w-20 h-20 text-primary mx-auto mb-6 animate-signal-drift" />
        <h1 className="font-display text-3xl text-primary mb-2 tracking-wider">404</h1>
        <h2 className="font-display text-sm text-base-content/60 mb-4 tracking-wider">Frequency Not Found</h2>
        <p className="text-sm text-base-content/40 mb-8 leading-relaxed">
          No signal detected at this address. The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-sm btn-primary font-mono">
          Return to Overview
        </Link>
        <p className="text-[10px] text-base-content/20 mt-10 font-mono">Fresh Mayhem — A <a href="https://superbasic.studio" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400 underline underline-offset-2">Super Basic Studio</a> project</p>
      </div>
    </div>
  );
}
