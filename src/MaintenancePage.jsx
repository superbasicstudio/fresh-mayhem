import { useState, useEffect } from 'react';

const messages = [
  { text: "We'll be right back", sub: "Fresh Mayhem is currently being updated." },
  { text: "Volvemos enseguida", sub: "Fresh Mayhem se est\u00e1 actualizando." },
  { text: "Nous revenons tout de suite", sub: "Fresh Mayhem est en cours de mise \u00e0 jour." },
  { text: "Wir sind gleich zur\u00fcck", sub: "Fresh Mayhem wird gerade aktualisiert." },
  { text: "Torniamo subito", sub: "Fresh Mayhem \u00e8 in fase di aggiornamento." },
  { text: "\u3059\u3050\u306b\u623b\u308a\u307e\u3059", sub: "Fresh Mayhem \u306f\u73fe\u5728\u66f4\u65b0\u4e2d\u3067\u3059\u3002" },
  { text: "Voltamos j\u00e1", sub: "Fresh Mayhem est\u00e1 a ser atualizado." },
  { text: "Volta logo", sub: "Fresh Mayhem est\u00e1 sendo atualizado." },
  { text: "We zijn zo terug", sub: "Fresh Mayhem wordt momenteel bijgewerkt." },
  { text: "Vi \u00e4r strax tillbaka", sub: "Fresh Mayhem uppdateras just nu." },
  { text: "Vi er snart tilbage", sub: "Fresh Mayhem opdateres i \u00f8jeblikket." },
  { text: "Palaamme pian", sub: "Fresh Mayhem on p\u00e4ivitett\u00e4v\u00e4n\u00e4." },
  { text: "Hned jsme zp\u00e1tky", sub: "Fresh Mayhem se pr\u00e1v\u011b aktualizuje." },
];

export default function MaintenancePage() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length);
        setFade(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const msg = messages[index];

  return (
    <div className="bg-[#080808] text-[#c8e6c9] min-h-screen flex items-center justify-center font-mono">
      <div className="text-center px-6 max-w-lg">
        <div className="flex justify-center mb-8">
          <svg viewBox="0 0 40 40" className="w-16 h-16 text-[#7fff00] opacity-30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="20" cy="20" r="18" />
            <path d="M20 8v12l6 3" />
          </svg>
        </div>
        <div className={`transition-opacity duration-[400ms] ${fade ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-lg sm:text-xl mb-4 text-[#7fff00] font-bold tracking-wider">
            {msg.text}
          </h1>
          <p className="text-[#6a9f6a] text-sm leading-relaxed">
            {msg.sub}
          </p>
        </div>
        <div className="border border-[#1a3a1a] rounded p-4 bg-[#0a150a] mt-8">
          <pre className="text-[#4a8a4a] text-xs text-left">
{`> deploying updates...
> please stand by
> _`}
          </pre>
        </div>
        <p className="text-[#3a6a3a] text-xs mt-6">
          If this persists, reach out on{" "}
          <a
            href="https://hachyderm.io/@superbasicstudio"
            className="text-[#6a9f6a] underline hover:text-[#7fff00]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mastodon
          </a>
        </p>
        <p className="text-[#1a3a1a] text-[10px] mt-8">
          A <a href="https://superbasic.studio" target="_blank" rel="noopener noreferrer" className="text-[#2a5a2a] hover:text-[#4a8a4a]">Super Basic Studio</a> project
        </p>
      </div>
    </div>
  );
}
