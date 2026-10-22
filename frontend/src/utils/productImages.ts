/**
 * Category-aware product image resolver.
 * Ensures Lipsticks ALWAYS show Lipsticks, Blushes show Blushes,
 * Compacts show Compacts, Concealers show Concealers, and Foundations show Foundations.
 */

export function getProductDisplayImage(
  category?: string,
  brand?: string,
  title?: string,
  variantImageUrl?: string
): string {
  const cat = (category || '').toLowerCase();
  const b = (brand || '').toLowerCase();
  const t = (title || '').toLowerCase();

  // 1. COMPACT POWDER
  if (cat.includes('compact') || t.includes('compact') || t.includes('powder')) {
    return 'https://m.media-amazon.com/images/I/714IpkGJ4bL._SL1000_.jpg';
  }

  // 2. BLUSH
  if (cat.includes('blush') || t.includes('blush')) {
    return 'https://m.media-amazon.com/images/I/51kSJgP5rcL._SL1000_.jpg';
  }

  // 3. LIPSTICK
  if (cat.includes('lipstick') || t.includes('lipstick') || t.includes('lip ') || t.includes('matte lipstick') || t.includes('creamy matte')) {
    return 'https://m.media-amazon.com/images/I/71xtdu5CyAL._SL1000_.jpg';
  }

  // 4. CONCEALER
  if (cat.includes('concealer') || t.includes('concealer') || t.includes('rewind') || t.includes('eraser')) {
    if (b.includes('swiss') || t.includes('swiss')) {
      return 'https://m.media-amazon.com/images/I/51P0iBL1P3L._SL1000_.jpg';
    }
    return 'https://m.media-amazon.com/images/I/41JH2Raft3L._SL1000_.jpg';
  }

  // 5. FOUNDATIONS (Shade specific or authentic brand PDP images)
  if (variantImageUrl && !variantImageUrl.includes('41OUDlgEgnL')) {
    return variantImageUrl;
  }

  if (b.includes('lakme')) {
    return 'https://images-static.nykaa.com/media/catalog/product/0/0/0060d708901030569210-new_1.jpg';
  }
  if (b.includes('loreal') || b.includes("l'oreal")) {
    return 'https://images-static.nykaa.com/media/catalog/product/f/d/fd0ed65LOREA00000050_1.jpg';
  }
  if (b.includes('mac') || b.includes('m.a.c')) {
    return 'https://m.media-amazon.com/images/I/51wlTTPlSPL._SL1000_.jpg';
  }
  if (b.includes('kay')) {
    return 'https://m.media-amazon.com/images/I/51pnyFKFi4L._SL1000_.jpg';
  }

  return 'https://m.media-amazon.com/images/I/41OUDlgEgnL._SL1080_.jpg';
}
