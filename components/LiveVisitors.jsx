import { useState, useEffect } from 'react';

const POLL_INTERVAL = 60_000; // 60 seconds

export default function LiveVisitors() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchCount() {
      try {
        const res = await fetch('/api/visitors');
        if (res.ok) {
          const data = await res.json();
          if (active) setCount(data.count);
        }
      } catch {}
    }

    fetchCount();
    const id = setInterval(fetchCount, POLL_INTERVAL);
    return () => { active = false; clearInterval(id); };
  }, []);

  if (count === null || count === 0) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-base-content/40">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
      </span>
      {count} {count === 1 ? 'exploring' : 'exploring'}
    </span>
  );
}
