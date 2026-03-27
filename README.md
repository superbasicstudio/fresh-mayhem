# Fresh Mayhem

Interactive learning dashboard for the HackRF One + PortaPack H4M running Mayhem firmware.

**Live:** [freshmayhem.com](https://freshmayhem.com)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=superbasicstudio/fresh-mayhem&type=Date)](https://star-history.com/#superbasicstudio/fresh-mayhem&Date)

## Features

- 10 pages: Overview, Device Controls, RX Apps, TX Apps, Device Tools, Safety, Frequencies, Learn About RF, Quick Start, Where to Buy
- Full i18n support (13 languages with browser auto detection)
- Interactive PortaPack simulator with click wheel navigation
- D3.js gain chain visualizer, frequency spectrum with zoom, interactive band map
- Waterfall display simulation
- Educational "Learn more" content on all 52 app cards
- Community resources tab with curated subreddits
- Where to Buy page with vendor tracking and buying tips
- Comprehensive safety center with penalty infographic and legal references
- Command palette search (Ctrl+K) across 211 indexed items
- Clear visual distinction between screenshots (purple) and interactive elements (cyan)

## Quick Start

    npm install
    npm run dev

Open http://localhost:3022

## Build

    npm run build
    npm run preview

## Test

    npm test

157 tests across 11 test files covering data integrity, component rendering, routing, security, and framework validation.

## Tech Stack

React 18, Vite 5, Tailwind CSS 3, DaisyUI 4, D3.js 7, react-i18next, react-router-dom

## License

GPL-3.0. See LICENSE file.

This license applies to the **web application source code in this repository only**. The Fresh Mayhem desktop applications (Linux, macOS, Windows) are distributed separately under their own license terms in a separate repository. The GPL-3.0 license here covers the React web app, its components, data files, locale translations, and build configuration.

## Disclaimer

Educational resource for learning about SDR and RF concepts. Not legal advice. Always comply with local regulations. Unlicensed RF transmission may violate federal law. Super Basic Studio, LLC and this project are not affiliated with, endorsed by, or sponsored by Great Scott Gadgets, the PortaPack project, or the Mayhem firmware team. HackRF and PortaPack are trademarks of their respective owners.
