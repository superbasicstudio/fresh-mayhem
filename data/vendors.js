/**
 * Vendor data for "Where to Buy" page.
 *
 * DISCLAIMER: Fresh Mayhem is NOT affiliated with, sponsored by, or endorsed by
 * any vendor listed here. Inclusion does not constitute a recommendation. Always
 * do your own research before purchasing.
 *
 * Criteria for inclusion: vendor is frequently cited in r/hackrf, r/RTLSDR, or
 * SDR community forums as a source of authentic hardware. Vendors are grouped by
 * region and category for convenience only.
 */

export const vendors = [
  // === Official / Original Manufacturer ===
  {
    name: 'Great Scott Gadgets',
    url: 'https://greatscottgadgets.com/hackrf/',
    region: 'us',
    category: 'official',
    products: ['HackRF One'],
    description: 'Original creator and designer of HackRF One. Michael Ossmann\'s company. The definitive source for authentic HackRF boards.',
    note: 'Does not sell PortaPack add-ons — only the HackRF One itself.',
  },
  {
    name: 'OpenSourceSDRLab',
    url: 'https://www.opensourcesdrlab.com/',
    region: 'intl',
    category: 'official',
    products: ['PortaPack H4M', 'HackRF One + PortaPack bundles'],
    description: 'Designer and manufacturer of the PortaPack H4M (the most popular PortaPack variant). Sells direct and through resellers.',
    note: 'Also sells on AliExpress under the OpenSourceSDRLab store.',
  },

  // === Established US Retailers ===
  {
    name: 'Hacker Warehouse',
    url: 'https://hackerwarehouse.com/',
    region: 'us',
    category: 'retailer',
    products: ['HackRF One', 'PortaPack H2', 'Accessories'],
    description: 'Long-running US-based security and hacking hardware retailer. Frequently recommended in the HackRF subreddit.',
  },
  {
    name: 'SparkFun Electronics',
    url: 'https://www.sparkfun.com/',
    region: 'us',
    category: 'retailer',
    products: ['HackRF One'],
    description: 'Major US electronics retailer and educational platform. Authorized HackRF One reseller.',
  },
  {
    name: 'Adafruit Industries',
    url: 'https://www.adafruit.com/',
    region: 'us',
    category: 'retailer',
    products: ['HackRF One'],
    description: 'Well-known US electronics and maker retailer. Carries genuine HackRF One boards.',
  },

  // === European / International Retailers ===
  {
    name: 'Lab401',
    url: 'https://lab401.com/',
    region: 'eu',
    category: 'retailer',
    products: ['HackRF One', 'PortaPack', 'Accessories'],
    description: 'European security hardware retailer based in France. Carries HackRF, PortaPack, and other pentest tools.',
  },
  {
    name: 'Hak5',
    url: 'https://shop.hak5.org/',
    region: 'us',
    category: 'retailer',
    products: ['HackRF One'],
    description: 'Popular security/hacking hardware brand and retailer. Known for their own pentest gear, also carries HackRF.',
  },

  // === Major Distributors ===
  {
    name: 'Mouser Electronics',
    url: 'https://www.mouser.com/',
    region: 'us',
    category: 'distributor',
    products: ['HackRF One'],
    description: 'Major global electronics distributor. Carries official Great Scott Gadgets HackRF One.',
  },
  {
    name: 'Digikey',
    url: 'https://www.digikey.com/',
    region: 'us',
    category: 'distributor',
    products: ['HackRF One'],
    description: 'One of the largest global electronics distributors. Authorized HackRF One source.',
  },

  // === Marketplace Sellers (with caveats) ===
  {
    name: 'Amazon',
    url: 'https://www.amazon.com/',
    region: 'us',
    category: 'marketplace',
    products: ['HackRF One', 'PortaPack bundles', 'Accessories'],
    description: 'Available from various sellers. Quality varies significantly — read reviews carefully and check seller ratings.',
    note: 'High risk of clones and counterfeit boards. Look for sellers with established history and positive reviews specifically mentioning authentic hardware.',
  },
  {
    name: 'AliExpress',
    url: 'https://www.aliexpress.com/',
    region: 'intl',
    category: 'marketplace',
    products: ['HackRF One', 'PortaPack H2/H4M', 'Bundles', 'Accessories'],
    description: 'Common source for HackRF + PortaPack bundles, often at lower prices. OpenSourceSDRLab has an official store here.',
    note: 'Mix of authentic and clone products. Stick to well-reviewed stores with high ratings. The OpenSourceSDRLab official store is generally considered reliable.',
  },
];

export const vendorCategories = [
  { id: 'official', label: 'Original Manufacturers', color: 'badge-ghost', description: 'Companies that design and manufacture the hardware' },
  { id: 'retailer', label: 'Established Retailers', color: 'badge-ghost', description: 'Dedicated hardware stores with established reputations' },
  { id: 'distributor', label: 'Major Distributors', color: 'badge-ghost', description: 'Large-scale electronics distributors' },
  { id: 'marketplace', label: 'Marketplaces', color: 'badge-ghost', description: 'Online marketplaces — extra caution advised' },
];

export const vendorRegions = [
  { id: 'us', label: 'US', flag: '🇺🇸' },
  { id: 'eu', label: 'Europe', flag: '🇪🇺' },
  { id: 'intl', label: 'International', flag: '🌐' },
];

export const buyingTips = [
  {
    title: 'Buy from the source when possible',
    description: 'Great Scott Gadgets designed and sells the HackRF One. OpenSourceSDRLab designed and manufactures the PortaPack H4M. Purchasing directly from the original manufacturer is generally the most reliable way to ensure you receive authentic hardware.',
    severity: 'tip',
  },
  {
    title: 'Clones exist — and they\'re common',
    description: 'HackRF is open-source hardware, so anyone can manufacture it. Clones range from "works fine" to "dead on arrival." The risk is yours.',
    severity: 'warning',
  },
  {
    title: 'If the price seems too good to be true...',
    description: 'Depending on the seller, region, and availability, a genuine HackRF One can cost upwards of $200–$350 USD from established sources. Pricing varies, but boards listed well below the typical range are more likely to be clones. Some clones work fine, many don\'t — your mileage may vary.',
    severity: 'warning',
  },
  {
    title: 'Check the community first',
    description: 'Before buying from an unfamiliar seller, search r/hackrf and r/RTLSDR for reviews. The community is usually quick to flag bad sellers.',
    severity: 'tip',
  },
  {
    title: 'PortaPack versions matter',
    description: 'The H4M is the current recommended PortaPack with the best Mayhem firmware support. Older H1/H2 versions have fewer features and different hardware.',
    severity: 'info',
  },
  {
    title: 'Marketplace bundles — inspect carefully',
    description: 'Amazon and AliExpress bundles often include antennas, cases, and accessories. Quality of included accessories varies wildly regardless of the board itself.',
    severity: 'warning',
  },
];
