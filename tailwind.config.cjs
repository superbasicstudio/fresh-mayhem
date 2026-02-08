/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Press Start 2P"', 'monospace'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'fade-in-up': 'fadeInUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        hackrf: {
          "color-scheme": "dark",
          "primary": "#7fff00",
          "primary-content": "#0a1400",
          "secondary": "#39ff14",
          "secondary-content": "#0a1400",
          "accent": "#b4ff4a",
          "accent-content": "#0a1400",
          "neutral": "#1c1c1c",
          "neutral-content": "#d4d4d4",
          "base-100": "#080808",
          "base-200": "#0f0f0f",
          "base-300": "#161616",
          "base-content": "#e0e0e0",
          "info": "#66ff66",
          "info-content": "#0a1400",
          "success": "#39ff14",
          "success-content": "#0a1400",
          "warning": "#facc15",
          "warning-content": "#1a1a00",
          "error": "#f43f5e",
          "error-content": "#ffffff",
          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1rem",
          "--tab-radius": "0.5rem",
        },
      },
    ],
  },
};
