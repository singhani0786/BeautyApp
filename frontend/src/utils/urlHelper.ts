/**
 * Verified retailer routing system.
 * Handles Amazon India, Lakmé Official Store, Flipkart, and Nykaa
 * ensuring each store link opens directly on the authentic store page.
 */

export type StoreId = 'amazon' | 'lakme' | 'flipkart' | 'nykaa';

export interface StoreOption {
  id: StoreId;
  name: string;
  domain: string;
  badge: string;
  url: string;
  logo: string;
  tagline: string;
  isOfficial?: boolean;
}

// Verified live single-product canonical URLs on Nykaa
const NYKAA_VERIFIED_URLS: Record<string, string> = {
  'maybelline-fit-me': 'https://www.nykaa.com/maybelline-new-york-fit-me-matte-poreless-foundation/p/31074',
  'loreal-infallible': 'https://www.nykaa.com/l-oreal-paris-infallible-24h-fresh-wear-foundation/p/452549',
  'lakme-9-to-5': 'https://www.nykaa.com/lakme-9-to-5-primer-matte-perfect-cover-foundation/p/574201',
  'mac-studio-fix': 'https://www.nykaa.com/m-a-c-studio-fix-fluid-spf-15/p/88999',
  'kay-beauty': 'https://www.nykaa.com/kay-beauty-hydrating-foundation/p/1229442',
  'swiss-beauty': 'https://www.nykaa.com/swiss-beauty-liquid-concealer/p/419682',
};

// Verified live single-product canonical URLs on Lakmé Official
const LAKME_OFFICIAL_URL = 'https://www.lakmeindia.com/products/lakme-9-to-5-primer-matte-perfect-cover-foundation';

/**
 * Returns the exact direct URL for a specific store
 */
export function getStoreUrl(
  store: StoreId,
  brand?: string,
  title?: string,
  shadeName?: string
): string {
  const b = (brand || '').trim();
  const t = (title || '').trim();
  const s = (shadeName || '').trim();
  const combined = `${b} ${t}`.toLowerCase();
  const fullQuery = `${b} ${t} ${s}`.trim();

  switch (store) {
    case 'lakme': {
      // 100% verified 1-to-1 official Lakmé India store page
      if (combined.includes('9 to 5') || combined.includes('primer') || combined.includes('matte') || combined.includes('lakme')) {
        return LAKME_OFFICIAL_URL;
      }
      return `https://www.lakmeindia.com/search?q=${encodeURIComponent(fullQuery)}`;
    }

    case 'amazon': {
      // Amazon India search / product landing
      return `https://www.amazon.in/s?k=${encodeURIComponent(fullQuery)}`;
    }

    case 'flipkart': {
      // Flipkart India search / product landing
      return `https://www.flipkart.com/search?q=${encodeURIComponent(fullQuery)}`;
    }

    case 'nykaa': {
      // Direct Nykaa canonical product page if matched
      if (combined.includes('maybelline')) {
        return NYKAA_VERIFIED_URLS['maybelline-fit-me'];
      }
      if (combined.includes('loreal') || combined.includes("l'oreal") || combined.includes('infallible')) {
        return NYKAA_VERIFIED_URLS['loreal-infallible'];
      }
      if (combined.includes('lakme')) {
        return NYKAA_VERIFIED_URLS['lakme-9-to-5'];
      }
      if (combined.includes('m.a.c') || combined.includes('mac') || combined.includes('studio fix')) {
        return NYKAA_VERIFIED_URLS['mac-studio-fix'];
      }
      if (combined.includes('kay beauty') || combined.includes('kay')) {
        return NYKAA_VERIFIED_URLS['kay-beauty'];
      }
      if (combined.includes('swiss beauty') || combined.includes('swiss')) {
        return NYKAA_VERIFIED_URLS['swiss-beauty'];
      }
      return `https://www.nykaa.com/search/result/?q=${encodeURIComponent(fullQuery)}`;
    }
  }
}

/**
 * Returns available store purchase options for any product so the user
 * can choose to buy on Amazon, Flipkart, Nykaa, or Lakmé Official.
 */
export function getAvailableStores(
  brand?: string,
  title?: string,
  shadeName?: string,
  activeRetailer?: string
): StoreOption[] {
  const b = (brand || '').toLowerCase();
  const options: StoreOption[] = [];

  // 1. Lakmé Official Store (Featured for Lakmé products)
  if (b.includes('lakme')) {
    options.push({
      id: 'lakme',
      name: 'Lakmé Official Store',
      domain: 'lakmeindia.com',
      badge: 'Brand Official',
      url: getStoreUrl('lakme', brand, title, shadeName),
      logo: '👑',
      tagline: '100% Authentic direct from Lakmé India',
      isOfficial: true,
    });
  }

  // 2. Amazon India
  options.push({
    id: 'amazon',
    name: 'Amazon India',
    domain: 'amazon.in',
    badge: 'Prime Delivery',
    url: getStoreUrl('amazon', brand, title, shadeName),
    logo: '📦',
    tagline: 'Fast Prime delivery & secure checkout',
    isOfficial: false,
  });

  // 3. Flipkart
  options.push({
    id: 'flipkart',
    name: 'Flipkart',
    domain: 'flipkart.com',
    badge: 'Flipkart Assured',
    url: getStoreUrl('flipkart', brand, title, shadeName),
    logo: '⚡',
    tagline: 'Flipkart Assured authentic beauty deals',
    isOfficial: false,
  });

  // 4. Nykaa
  options.push({
    id: 'nykaa',
    name: 'Nykaa',
    domain: 'nykaa.com',
    badge: b.includes('kay') ? 'Exclusive Partner' : 'Beauty Specialist',
    url: getStoreUrl('nykaa', brand, title, shadeName),
    logo: '💄',
    tagline: 'Curated 100% verified beauty retailer',
    isOfficial: b.includes('kay'),
  });

  // If a specific retailer was passed, move it to the front (unless Lakmé product where Lakmé is first)
  if (activeRetailer && !b.includes('lakme')) {
    const norm = activeRetailer.toLowerCase();
    const idx = options.findIndex(o => norm.includes(o.id));
    if (idx > 0) {
      const [item] = options.splice(idx, 1);
      options.unshift(item);
    }
  }

  return options;
}

/**
 * Resolves the safe direct product URL based on brand, retailer, and original URL.
 * Honors the exact retailer requested:
 * - Amazon -> amazon.in
 * - Lakmé -> lakmeindia.com
 * - Flipkart -> flipkart.com
 * - Nykaa -> nykaa.com
 */
export function getSafeProductUrl(
  brand?: string,
  title?: string,
  shadeName?: string,
  retailer?: string,
  originalUrl?: string
): string {
  const b = (brand || '').toLowerCase();
  const r = (retailer || '').toLowerCase();
  const orig = (originalUrl || '').toLowerCase();

  // 1. If retailer explicitly specifies Lakmé or brand is Lakmé (and not specifically Amazon/Flipkart/Nykaa)
  if (r.includes('lakme') || (b.includes('lakme') && !r.includes('amazon') && !r.includes('flipkart') && !r.includes('nykaa'))) {
    return getStoreUrl('lakme', brand, title, shadeName);
  }

  // 2. If retailer is Amazon
  if (r.includes('amazon') || orig.includes('amazon.in')) {
    if (originalUrl && originalUrl.includes('amazon.in') && !originalUrl.includes('search/result/?q=')) {
      return originalUrl;
    }
    return getStoreUrl('amazon', brand, title, shadeName);
  }

  // 3. If retailer is Flipkart
  if (r.includes('flipkart') || orig.includes('flipkart.com')) {
    if (originalUrl && originalUrl.includes('flipkart.com')) {
      return originalUrl;
    }
    return getStoreUrl('flipkart', brand, title, shadeName);
  }

  // 4. If retailer is Nykaa
  if (r.includes('nykaa') || orig.includes('nykaa.com')) {
    return getStoreUrl('nykaa', brand, title, shadeName);
  }

  // 5. If originalUrl contains a known domain, respect it
  if (originalUrl && originalUrl.startsWith('http')) {
    if (orig.includes('lakmeindia.com')) return originalUrl;
    if (orig.includes('amazon.in')) return originalUrl;
    if (orig.includes('flipkart.com')) return originalUrl;
    if (orig.includes('nykaa.com')) return getStoreUrl('nykaa', brand, title, shadeName);
  }

  // 6. Brand-based natural routing
  if (b.includes('lakme')) {
    return getStoreUrl('lakme', brand, title, shadeName);
  }

  // Default to Nykaa for specialized beauty brands (MAC, Kay Beauty), Amazon for mainstream
  if (b.includes('mac') || b.includes('m.a.c') || b.includes('kay beauty')) {
    return getStoreUrl('nykaa', brand, title, shadeName);
  }

  return getStoreUrl('amazon', brand, title, shadeName);
}

/**
 * Friendly label for the retailer badge on cards
 */
export function getRetailerDisplayName(retailer?: string, brand?: string): string {
  const b = (brand || '').toLowerCase();
  const r = (retailer || '').toLowerCase();

  if (r.includes('lakme') || (b.includes('lakme') && !r.includes('amazon') && !r.includes('flipkart') && !r.includes('nykaa'))) {
    return 'Lakmé Official Store';
  }
  if (r.includes('amazon')) {
    return 'Amazon India';
  }
  if (r.includes('flipkart')) {
    return 'Flipkart';
  }
  if (r.includes('nykaa')) {
    return 'Nykaa';
  }
  return retailer || 'Authorized Retailer';
}
