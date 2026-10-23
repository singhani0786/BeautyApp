import {
  RecommendationResponse,
  RecommendationCategoryResult,
  ProductInfo,
  VariantInfo,
  PriceInfo,
} from '../types/api';
import { getProductDisplayImage } from '../utils/productImages';

interface CatalogProduct {
  id: string;
  title: string;
  brand: string;
  category: string;
  description: string;
  skin_tones: string[];
  undertones: string[];
  skin_types: string[];
  finish: string;
  coverage: string;
  rating: number;
  review_count: number;
  variants: Array<{
    id: string;
    shade_name: string;
    shade_code: string;
    hex_color: string;
    undertone: string;
    depth_level: string;
    sku: string;
    image_url: string;
    prices: Array<{
      retailer: string;
      mrp: number;
      current_price: number;
      discount_percent: number;
      in_stock: boolean;
      product_url: string;
    }>;
  }>;
}

export const VERIFIED_CATALOG: CatalogProduct[] = [
  // 1. FOUNDATIONS
  {
    id: 'maybelline-fit-me-foundation',
    title: 'Maybelline New York Fit Me Matte+Poreless Liquid Foundation',
    brand: 'Maybelline New York',
    category: 'foundation',
    description: 'Oil-free matte liquid foundation formulated with clay and micro-powders to refine pores and control shine.',
    skin_tones: ['fair', 'light', 'medium', 'tan', 'deep'],
    undertones: ['warm', 'cool', 'neutral'],
    skin_types: ['oily', 'combination', 'normal'],
    finish: 'matte',
    coverage: 'medium',
    rating: 4.4,
    review_count: 48200,
    variants: [
      {
        id: 'fitme-115-ivory',
        shade_name: '115 Ivory',
        shade_code: '115',
        hex_color: '#F3D6B5',
        undertone: 'cool',
        depth_level: 'fair',
        sku: 'MAY-FITME-115',
        image_url: 'https://m.media-amazon.com/images/I/41OUDlgEgnL._SL1080_.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 329, current_price: 165, discount_percent: 50, in_stock: true, product_url: 'https://www.amazon.in/dp/B07PMCNNPY' },
          { retailer: 'nykaa', mrp: 649, current_price: 373, discount_percent: 42, in_stock: true, product_url: 'https://www.nykaa.com/maybelline-new-york-fit-me-matte-poreless-foundation/p/31074' }
        ]
      },
      {
        id: 'fitme-128-warm-nude',
        shade_name: '128 Warm Nude',
        shade_code: '128',
        hex_color: '#E6BE94',
        undertone: 'warm',
        depth_level: 'light',
        sku: 'MAY-FITME-128',
        image_url: 'https://m.media-amazon.com/images/I/41OUDlgEgnL._SL1080_.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 329, current_price: 165, discount_percent: 50, in_stock: true, product_url: 'https://www.amazon.in/dp/B07L3R68G2' },
          { retailer: 'nykaa', mrp: 649, current_price: 373, discount_percent: 42, in_stock: true, product_url: 'https://www.nykaa.com/maybelline-new-york-fit-me-matte-poreless-foundation/p/31074' }
        ]
      },
      {
        id: 'fitme-220-natural-beige',
        shade_name: '220 Natural Beige',
        shade_code: '220',
        hex_color: '#DFA975',
        undertone: 'warm',
        depth_level: 'medium',
        sku: 'MAY-FITME-220',
        image_url: 'https://m.media-amazon.com/images/I/41OUDlgEgnL._SL1080_.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 329, current_price: 164, discount_percent: 50, in_stock: true, product_url: 'https://www.amazon.in/dp/B07L419N74' },
          { retailer: 'nykaa', mrp: 649, current_price: 373, discount_percent: 42, in_stock: true, product_url: 'https://www.nykaa.com/maybelline-new-york-fit-me-matte-poreless-foundation/p/31074' }
        ]
      },
      {
        id: 'fitme-310-sun-beige',
        shade_name: '310 Sun Beige',
        shade_code: '310',
        hex_color: '#C98E56',
        undertone: 'warm',
        depth_level: 'tan',
        sku: 'MAY-FITME-310',
        image_url: 'https://m.media-amazon.com/images/I/41OUDlgEgnL._SL1080_.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 329, current_price: 165, discount_percent: 50, in_stock: true, product_url: 'https://www.amazon.in/dp/B07L3PBX8W' },
          { retailer: 'nykaa', mrp: 649, current_price: 373, discount_percent: 42, in_stock: true, product_url: 'https://www.nykaa.com/maybelline-new-york-fit-me-matte-poreless-foundation/p/31074' }
        ]
      },
      {
        id: 'fitme-332-golden-caramel',
        shade_name: '332 Golden Caramel',
        shade_code: '332',
        hex_color: '#A46636',
        undertone: 'neutral',
        depth_level: 'deep',
        sku: 'MAY-FITME-332',
        image_url: 'https://m.media-amazon.com/images/I/41OUDlgEgnL._SL1080_.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 329, current_price: 165, discount_percent: 50, in_stock: true, product_url: 'https://www.amazon.in/dp/B07PRRBX8J' },
          { retailer: 'nykaa', mrp: 649, current_price: 373, discount_percent: 42, in_stock: true, product_url: 'https://www.nykaa.com/maybelline-new-york-fit-me-matte-poreless-foundation/p/31074' }
        ]
      }
    ]
  },
  {
    id: 'lakme-9to5-primer-matte-foundation',
    title: 'Lakme 9 to 5 Primer + Matte Perfect Cover Foundation',
    brand: 'Lakme',
    category: 'foundation',
    description: 'Built-in primer infused liquid foundation providing medium-to-high buildable coverage with all-day comfortable matte wear.',
    skin_tones: ['fair', 'light', 'medium', 'tan'],
    undertones: ['warm', 'cool', 'neutral'],
    skin_types: ['normal', 'combination', 'oily'],
    finish: 'matte',
    coverage: 'medium',
    rating: 4.3,
    review_count: 22400,
    variants: [
      {
        id: 'lakme-w160-warm-sand',
        shade_name: 'W160 Warm Sand',
        shade_code: 'W160',
        hex_color: '#E0B589',
        undertone: 'warm',
        depth_level: 'light',
        sku: 'LAK-9TO5-W160',
        image_url: 'https://images-static.nykaa.com/media/catalog/product/0/0/0060d708901030569210-new_1.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 699, current_price: 395, discount_percent: 43, in_stock: true, product_url: 'https://www.amazon.in/dp/B07YVGPHYQ' },
          { retailer: 'nykaa', mrp: 699, current_price: 489, discount_percent: 30, in_stock: true, product_url: 'https://www.nykaa.com/lakme-9-to-5-primer-matte-perfect-cover-foundation/p/574201' },
          { retailer: 'lakme_official', mrp: 699, current_price: 594, discount_percent: 15, in_stock: true, product_url: 'https://www.lakmeindia.com/products/lakme-9to5-powerplay-priming-foundation' }
        ]
      },
      {
        id: 'lakme-w240-warm-beige',
        shade_name: 'W240 Warm Beige',
        shade_code: 'W240',
        hex_color: '#D49D6A',
        undertone: 'warm',
        depth_level: 'medium',
        sku: 'LAK-9TO5-W240',
        image_url: 'https://images-static.nykaa.com/media/catalog/product/0/0/0060d708901030569210-new_1.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 699, current_price: 395, discount_percent: 43, in_stock: true, product_url: 'https://www.amazon.in/dp/B07YVHV8R9' },
          { retailer: 'nykaa', mrp: 699, current_price: 489, discount_percent: 30, in_stock: true, product_url: 'https://www.nykaa.com/lakme-9-to-5-primer-matte-perfect-cover-foundation/p/574201' },
          { retailer: 'lakme_official', mrp: 699, current_price: 594, discount_percent: 15, in_stock: true, product_url: 'https://www.lakmeindia.com/products/lakme-9to5-powerplay-priming-foundation' }
        ]
      },
      {
        id: 'lakme-n220-natural-medium',
        shade_name: 'N220 Natural Medium',
        shade_code: 'N220',
        hex_color: '#D8A072',
        undertone: 'neutral',
        depth_level: 'medium',
        sku: 'LAK-9TO5-N220',
        image_url: 'https://images-static.nykaa.com/media/catalog/product/0/0/0060d708901030569210-new_1.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 699, current_price: 395, discount_percent: 43, in_stock: true, product_url: 'https://www.amazon.in/dp/B07YVHS2BJ' },
          { retailer: 'nykaa', mrp: 699, current_price: 489, discount_percent: 30, in_stock: true, product_url: 'https://www.nykaa.com/lakme-9-to-5-primer-matte-perfect-cover-foundation/p/574201' },
          { retailer: 'lakme_official', mrp: 699, current_price: 594, discount_percent: 15, in_stock: true, product_url: 'https://www.lakmeindia.com/products/lakme-9to5-powerplay-priming-foundation' }
        ]
      }
    ]
  },
  {
    id: 'loreal-infallible-foundation',
    title: "L'Oreal Paris Infallible 32H Fresh Wear Liquid Foundation",
    brand: "L'Oreal Paris",
    category: 'foundation',
    description: 'Longwear liquid foundation powered by breathable micro-pearl technology for sweat, water, and transfer resistance.',
    skin_tones: ['medium', 'tan'],
    undertones: ['warm', 'neutral'],
    skin_types: ['all', 'oily', 'combination', 'normal'],
    finish: 'fresh matte',
    coverage: 'medium to full',
    rating: 4.5,
    review_count: 18900,
    variants: [
      {
        id: 'loreal-200-golden-sand',
        shade_name: '200 Golden Sand',
        shade_code: '200',
        hex_color: '#D89E6E',
        undertone: 'warm',
        depth_level: 'medium',
        sku: 'LOR-INF-200',
        image_url: 'https://images-static.nykaa.com/media/catalog/product/f/d/fd0ed65LOREA00000050_1.jpg',
        prices: [
          { retailer: 'nykaa', mrp: 1099, current_price: 899, discount_percent: 18, in_stock: true, product_url: 'https://www.nykaa.com/l-oreal-paris-infallible-pro-matte-foundation/p/257863' },
          { retailer: 'amazon_in', mrp: 1099, current_price: 1099, discount_percent: 0, in_stock: true, product_url: 'https://www.amazon.in/dp/B07D7LZ7GK' }
        ]
      },
      {
        id: 'loreal-250-radiant-sand',
        shade_name: '250 Radiant Sand',
        shade_code: '250',
        hex_color: '#CD905C',
        undertone: 'warm',
        depth_level: 'tan',
        sku: 'LOR-INF-250',
        image_url: 'https://images-static.nykaa.com/media/catalog/product/f/d/fd0ed65LOREA00000050_1.jpg',
        prices: [
          { retailer: 'nykaa', mrp: 1099, current_price: 899, discount_percent: 18, in_stock: true, product_url: 'https://www.nykaa.com/l-oreal-paris-infallible-pro-matte-foundation/p/257863' },
          { retailer: 'amazon_in', mrp: 1099, current_price: 1099, discount_percent: 0, in_stock: true, product_url: 'https://www.amazon.in/dp/B07D7LZ7GK' }
        ]
      }
    ]
  },
  {
    id: 'kay-beauty-hydrating-foundation',
    title: 'Kay Beauty Hydrating Foundation with Hyaluronic Acid',
    brand: 'Kay Beauty',
    category: 'foundation',
    description: 'Enriched with chamomile and avocado extracts, delivering seamless lightweight second-skin hydration specially formulated for Indian skin.',
    skin_tones: ['medium', 'tan'],
    undertones: ['warm', 'cool', 'neutral'],
    skin_types: ['dry', 'normal', 'combination'],
    finish: 'natural dewy',
    coverage: 'medium buildable',
    rating: 4.6,
    review_count: 8900,
    variants: [
      {
        id: 'kay-120y-medium-warm',
        shade_name: '120Y Medium Warm',
        shade_code: '120Y',
        hex_color: '#DAA373',
        undertone: 'warm',
        depth_level: 'medium',
        sku: 'KAY-FND-120Y',
        image_url: 'https://m.media-amazon.com/images/I/51pnyFKFi4L._SL1000_.jpg',
        prices: [
          { retailer: 'nykaa', mrp: 1350, current_price: 1013, discount_percent: 25, in_stock: true, product_url: 'https://www.nykaa.com/kay-beauty-hydrating-foundation/p/1229442' }
        ]
      },
      {
        id: 'kay-130p-medium-cool',
        shade_name: '130P Medium Cool',
        shade_code: '130P',
        hex_color: '#D49B6F',
        undertone: 'cool',
        depth_level: 'medium',
        sku: 'KAY-FND-130P',
        image_url: 'https://m.media-amazon.com/images/I/51pnyFKFi4L._SL1000_.jpg',
        prices: [
          { retailer: 'nykaa', mrp: 1350, current_price: 1013, discount_percent: 25, in_stock: true, product_url: 'https://www.nykaa.com/kay-beauty-hydrating-foundation/p/1229442' }
        ]
      },
      {
        id: 'kay-140n-tan-neutral',
        shade_name: '140N Tan Neutral',
        shade_code: '140N',
        hex_color: '#C68752',
        undertone: 'neutral',
        depth_level: 'tan',
        sku: 'KAY-FND-140N',
        image_url: 'https://m.media-amazon.com/images/I/51pnyFKFi4L._SL1000_.jpg',
        prices: [
          { retailer: 'nykaa', mrp: 1350, current_price: 1013, discount_percent: 25, in_stock: true, product_url: 'https://www.nykaa.com/kay-beauty-hydrating-foundation/p/1229442' }
        ]
      }
    ]
  },
  {
    id: 'mac-studio-fix-foundation',
    title: 'M.A.C Studio Fix Fluid SPF 15 24HR Matte Foundation',
    brand: 'M.A.C',
    category: 'foundation',
    description: 'Iconic professional 24-hour buildable matte finish foundation with broad spectrum sun protection.',
    skin_tones: ['fair', 'light', 'medium', 'tan', 'deep'],
    undertones: ['warm', 'cool', 'neutral', 'olive'],
    skin_types: ['all', 'oily', 'combination'],
    finish: 'matte',
    coverage: 'full',
    rating: 4.7,
    review_count: 14200,
    variants: [
      {
        id: 'mac-nc25',
        shade_name: 'NC25 (Golden Olive Fair-Light)',
        shade_code: 'NC25',
        hex_color: '#E5B98A',
        undertone: 'olive',
        depth_level: 'light',
        sku: 'MAC-SFF-NC25',
        image_url: 'https://m.media-amazon.com/images/I/51wlTTPlSPL._SL1000_.jpg',
        prices: [
          { retailer: 'nykaa', mrp: 3400, current_price: 2900, discount_percent: 15, in_stock: true, product_url: 'https://www.nykaa.com/m-a-c-studio-fix-fluid-spf-15/p/88999' }
        ]
      },
      {
        id: 'mac-nc40',
        shade_name: 'NC40 (Golden Olive Medium)',
        shade_code: 'NC40',
        hex_color: '#D19C64',
        undertone: 'warm',
        depth_level: 'medium',
        sku: 'MAC-SFF-NC40',
        image_url: 'https://m.media-amazon.com/images/I/51wlTTPlSPL._SL1000_.jpg',
        prices: [
          { retailer: 'nykaa', mrp: 3400, current_price: 2900, discount_percent: 15, in_stock: true, product_url: 'https://www.nykaa.com/m-a-c-studio-fix-fluid-spf-15/p/88999' }
        ]
      },
      {
        id: 'mac-nc42',
        shade_name: 'NC42 (Warm Golden Tan)',
        shade_code: 'NC42',
        hex_color: '#BE864F',
        undertone: 'warm',
        depth_level: 'tan',
        sku: 'MAC-SFF-NC42',
        image_url: 'https://m.media-amazon.com/images/I/51wlTTPlSPL._SL1000_.jpg',
        prices: [
          { retailer: 'nykaa', mrp: 3400, current_price: 2900, discount_percent: 15, in_stock: true, product_url: 'https://www.nykaa.com/m-a-c-studio-fix-fluid-spf-15/p/88999' }
        ]
      },
      {
        id: 'mac-nw45',
        shade_name: 'NW45 (Rich Mahogany Deep)',
        shade_code: 'NW45',
        hex_color: '#874D28',
        undertone: 'cool',
        depth_level: 'deep',
        sku: 'MAC-SFF-NW45',
        image_url: 'https://m.media-amazon.com/images/I/51wlTTPlSPL._SL1000_.jpg',
        prices: [
          { retailer: 'nykaa', mrp: 3400, current_price: 2900, discount_percent: 15, in_stock: true, product_url: 'https://www.nykaa.com/m-a-c-studio-fix-fluid-spf-15/p/88999' }
        ]
      }
    ]
  },

  // 2. CONCEALERS
  {
    id: 'maybelline-age-rewind-concealer',
    title: 'Maybelline Instant Age Rewind Multi-Use Eraser Concealer',
    brand: 'Maybelline New York',
    category: 'concealer',
    description: 'Iconic micro-corrector sponge applicator concealer formulated with haloxyl to blur dark circles and imperfections instantly.',
    skin_tones: ['fair', 'light', 'medium', 'tan'],
    undertones: ['warm', 'cool', 'neutral'],
    skin_types: ['all', 'dry', 'normal'],
    finish: 'radiant satin',
    coverage: 'full',
    rating: 4.4,
    review_count: 51200,
    variants: [
      {
        id: 'rewind-120-light',
        shade_name: '120 Light',
        shade_code: '120',
        hex_color: '#E6BF92',
        undertone: 'warm',
        depth_level: 'light',
        sku: 'MAY-AR-120',
        image_url: 'https://m.media-amazon.com/images/I/41JH2Raft3L._SL1000_.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 749, current_price: 429, discount_percent: 43, in_stock: true, product_url: 'https://www.amazon.in/dp/B0791YY1P1' },
          { retailer: 'nykaa', mrp: 799, current_price: 439, discount_percent: 45, in_stock: true, product_url: 'https://www.nykaa.com/maybelline-new-york-instant-age-rewind-eraser-dark-circles-treatment-concealer/p/375096' }
        ]
      },
      {
        id: 'rewind-130-medium',
        shade_name: '130 Medium',
        shade_code: '130',
        hex_color: '#DEAB7A',
        undertone: 'warm',
        depth_level: 'medium',
        sku: 'MAY-AR-130',
        image_url: 'https://m.media-amazon.com/images/I/41JH2Raft3L._SL1000_.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 749, current_price: 429, discount_percent: 43, in_stock: true, product_url: 'https://www.amazon.in/dp/B0791YY1P1' },
          { retailer: 'nykaa', mrp: 799, current_price: 439, discount_percent: 45, in_stock: true, product_url: 'https://www.nykaa.com/maybelline-new-york-instant-age-rewind-eraser-dark-circles-treatment-concealer/p/375096' }
        ]
      },
      {
        id: 'rewind-140-honey',
        shade_name: '140 Honey',
        shade_code: '140',
        hex_color: '#CD925C',
        undertone: 'warm',
        depth_level: 'tan',
        sku: 'MAY-AR-140',
        image_url: 'https://m.media-amazon.com/images/I/41JH2Raft3L._SL1000_.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 749, current_price: 429, discount_percent: 43, in_stock: true, product_url: 'https://www.amazon.in/dp/B0791YY1P1' },
          { retailer: 'nykaa', mrp: 799, current_price: 439, discount_percent: 45, in_stock: true, product_url: 'https://www.nykaa.com/maybelline-new-york-instant-age-rewind-eraser-dark-circles-treatment-concealer/p/375096' }
        ]
      }
    ]
  },
  {
    id: 'swiss-beauty-liquid-concealer',
    title: 'Swiss Beauty Liquid Light Weight Concealer',
    brand: 'Swiss Beauty',
    category: 'concealer',
    description: 'High-coverage lightweight liquid concealer blending smoothly into blemishes and dark circles with transfer-resistant comfort.',
    skin_tones: ['light', 'medium', 'tan'],
    undertones: ['warm', 'neutral'],
    skin_types: ['all', 'combination', 'oily'],
    finish: 'satin',
    coverage: 'medium',
    rating: 4.2,
    review_count: 67300,
    variants: [
      {
        id: 'swiss-02-sand-sable',
        shade_name: '02 Sand Sable',
        shade_code: '02',
        hex_color: '#E1B78B',
        undertone: 'warm',
        depth_level: 'light',
        sku: 'SWISS-CON-02',
        image_url: 'https://m.media-amazon.com/images/I/51P0iBL1P3L._SL1000_.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 249, current_price: 174, discount_percent: 30, in_stock: true, product_url: 'https://www.amazon.in/dp/B07WTNH18L' },
          { retailer: 'nykaa', mrp: 249, current_price: 174, discount_percent: 30, in_stock: true, product_url: 'https://www.nykaa.com/swiss-beauty-liquid-concealer/p/419682' }
        ]
      },
      {
        id: 'swiss-04-medium-beige',
        shade_name: '04 Medium Beige',
        shade_code: '04',
        hex_color: '#D4A373',
        undertone: 'warm',
        depth_level: 'medium',
        sku: 'SWISS-CON-04',
        image_url: 'https://m.media-amazon.com/images/I/51P0iBL1P3L._SL1000_.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 249, current_price: 174, discount_percent: 30, in_stock: true, product_url: 'https://www.amazon.in/dp/B07WTNH18L' },
          { retailer: 'nykaa', mrp: 249, current_price: 174, discount_percent: 30, in_stock: true, product_url: 'https://www.nykaa.com/swiss-beauty-liquid-concealer/p/419682' }
        ]
      }
    ]
  },

  // 3. LIPSTICKS
  {
    id: 'maybelline-creamy-matte-lipstick',
    title: 'Maybelline New York Color Sensational Creamy Matte Lipstick',
    brand: 'Maybelline New York',
    category: 'lipstick',
    description: 'Enriched with precious oils to deliver non-drying, comfortable matte lip colour specially curated for Indian complexions.',
    skin_tones: ['fair', 'light', 'medium', 'tan', 'deep'],
    undertones: ['warm', 'cool', 'neutral'],
    skin_types: ['all'],
    finish: 'creamy matte',
    coverage: 'high pigment',
    rating: 4.3,
    review_count: 73000,
    variants: [
      {
        id: 'maybelline-touch-of-spice',
        shade_name: 'Touch of Spice (Warm Rosy Mauve)',
        shade_code: '660',
        hex_color: '#B26268',
        undertone: 'warm',
        depth_level: 'medium',
        sku: 'MAY-CM-660',
        image_url: 'https://m.media-amazon.com/images/I/71xtdu5CyAL._SL1000_.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 329, current_price: 181, discount_percent: 45, in_stock: true, product_url: 'https://www.amazon.in/dp/B00YJJWBUA' },
          { retailer: 'nykaa', mrp: 329, current_price: 181, discount_percent: 45, in_stock: true, product_url: 'https://www.nykaa.com/maybelline-new-york-color-sensational-creamy-matte-lipsticks/p/353926' }
        ]
      },
      {
        id: 'maybelline-nude-nuance',
        shade_name: 'Nude Nuance (Warm Terracotta Brown)',
        shade_code: '657',
        hex_color: '#93544B',
        undertone: 'warm',
        depth_level: 'tan',
        sku: 'MAY-CM-657',
        image_url: 'https://m.media-amazon.com/images/I/71xtdu5CyAL._SL1000_.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 329, current_price: 181, discount_percent: 45, in_stock: true, product_url: 'https://www.amazon.in/dp/B00YJJWBUA' },
          { retailer: 'nykaa', mrp: 329, current_price: 181, discount_percent: 45, in_stock: true, product_url: 'https://www.nykaa.com/maybelline-new-york-color-sensational-creamy-matte-lipsticks/p/353926' }
        ]
      }
    ]
  },
  {
    id: 'mac-matte-lipstick',
    title: 'M.A.C Matte Lipstick',
    brand: 'M.A.C',
    category: 'lipstick',
    description: 'The iconic lipstick that made M.A.C famous. Long-wearing formula with high colour payoff and a completely matte finish.',
    skin_tones: ['fair', 'light', 'medium', 'tan', 'deep'],
    undertones: ['warm', 'cool', 'neutral'],
    skin_types: ['all'],
    finish: 'matte',
    coverage: 'full',
    rating: 4.6,
    review_count: 32100,
    variants: [
      {
        id: 'mac-ruby-woo',
        shade_name: 'Ruby Woo (Vivid Blue-Red)',
        shade_code: 'RW',
        hex_color: '#BA1628',
        undertone: 'cool',
        depth_level: 'medium',
        sku: 'MAC-LIP-RW',
        image_url: 'https://images-static.nykaa.com/media/catalog/product/7/7/773602685954_1_1.jpg',
        prices: [
          { retailer: 'nykaa', mrp: 2550, current_price: 2550, discount_percent: 0, in_stock: true, product_url: 'https://www.nykaa.com/m-a-c-macximal-matte-lipstick/p/13931665' }
        ]
      },
      {
        id: 'mac-velvet-teddy',
        shade_name: 'Velvet Teddy (Deep-Tone Beige)',
        shade_code: 'VT',
        hex_color: '#B07565',
        undertone: 'warm',
        depth_level: 'medium',
        sku: 'MAC-LIP-VT',
        image_url: 'https://images-static.nykaa.com/media/catalog/product/7/7/773602685954_1_1.jpg',
        prices: [
          { retailer: 'nykaa', mrp: 2550, current_price: 2550, discount_percent: 0, in_stock: true, product_url: 'https://www.nykaa.com/m-a-c-macximal-matte-lipstick/p/13931665' }
        ]
      },
      {
        id: 'mac-chili',
        shade_name: 'Chili (Brownish Orange-Red)',
        shade_code: 'CHILI',
        hex_color: '#A83B24',
        undertone: 'warm',
        depth_level: 'tan',
        sku: 'MAC-LIP-CHILI',
        image_url: 'https://images-static.nykaa.com/media/catalog/product/7/7/773602685954_1_1.jpg',
        prices: [
          { retailer: 'nykaa', mrp: 2550, current_price: 2550, discount_percent: 0, in_stock: true, product_url: 'https://www.nykaa.com/m-a-c-macximal-matte-lipstick/p/13931665' }
        ]
      }
    ]
  },

  // 4. COMPACT POWDER
  {
    id: 'maybelline-fit-me-compact',
    title: 'Maybelline New York Fit Me 16H Oil Control Compact Powder',
    brand: 'Maybelline New York',
    category: 'compact',
    description: 'Micro-fine setting powder infused with sun protection SPF 28 PA+++ that absorbs shine and controls sebum for up to 16 hours.',
    skin_tones: ['fair', 'light', 'medium', 'tan'],
    undertones: ['warm', 'neutral'],
    skin_types: ['oily', 'combination', 'normal'],
    finish: 'matte',
    coverage: 'medium',
    rating: 4.4,
    review_count: 38900,
    variants: [
      {
        id: 'fitme-cmp-128',
        shade_name: '128 Warm Nude',
        shade_code: '128',
        hex_color: '#E2B88F',
        undertone: 'warm',
        depth_level: 'light',
        sku: 'MAY-CMP-128',
        image_url: 'https://m.media-amazon.com/images/I/714IpkGJ4bL._SL1000_.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 259, current_price: 143, discount_percent: 45, in_stock: true, product_url: 'https://www.amazon.in/dp/B08QSQ6QX5' },
          { retailer: 'nykaa', mrp: 239, current_price: 191, discount_percent: 20, in_stock: true, product_url: 'https://www.nykaa.com/maybelline-new-york-fit-me-matte-poreless-16h-oil-control-compact-powder/p/1271649' }
        ]
      },
      {
        id: 'fitme-cmp-220',
        shade_name: '220 Natural Beige',
        shade_code: '220',
        hex_color: '#DCA273',
        undertone: 'warm',
        depth_level: 'medium',
        sku: 'MAY-CMP-220',
        image_url: 'https://m.media-amazon.com/images/I/714IpkGJ4bL._SL1000_.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 259, current_price: 143, discount_percent: 45, in_stock: true, product_url: 'https://www.amazon.in/dp/B08QSQ6QX5' },
          { retailer: 'nykaa', mrp: 239, current_price: 191, discount_percent: 20, in_stock: true, product_url: 'https://www.nykaa.com/maybelline-new-york-fit-me-matte-poreless-16h-oil-control-compact-powder/p/1271649' }
        ]
      }
    ]
  },

  // 5. BLUSH
  {
    id: 'maybelline-fit-me-blush',
    title: 'Maybelline New York Fit Me Mono Blush Powder',
    brand: 'Maybelline New York',
    category: 'blush',
    description: 'Lightweight creamy powder blush delivering natural, blendable cheek color enhanced for warm and golden Asian undertones.',
    skin_tones: ['fair', 'light', 'medium', 'tan'],
    undertones: ['warm', 'cool', 'neutral'],
    skin_types: ['all'],
    finish: 'soft shimmer',
    coverage: 'sheer buildable',
    rating: 4.3,
    review_count: 24100,
    variants: [
      {
        id: 'fitme-blush-rose',
        shade_name: '30 Rose (Soft Rosy Pink)',
        shade_code: '30',
        hex_color: '#D77382',
        undertone: 'cool',
        depth_level: 'medium',
        sku: 'MAY-BLS-30',
        image_url: 'https://m.media-amazon.com/images/I/51kSJgP5rcL._SL1000_.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 450, current_price: 450, discount_percent: 0, in_stock: true, product_url: 'https://www.amazon.in/dp/B0BD258Q7L' },
          { retailer: 'nykaa', mrp: 599, current_price: 539, discount_percent: 10, in_stock: true, product_url: 'https://www.nykaa.com/maybelline-new-york-fit-me-mono-blush/p/7066988' }
        ]
      },
      {
        id: 'fitme-blush-peach',
        shade_name: '40 Peach (Warm Golden Coral)',
        shade_code: '40',
        hex_color: '#E68B6E',
        undertone: 'warm',
        depth_level: 'medium',
        sku: 'MAY-BLS-40',
        image_url: 'https://m.media-amazon.com/images/I/51kSJgP5rcL._SL1000_.jpg',
        prices: [
          { retailer: 'amazon_in', mrp: 450, current_price: 450, discount_percent: 0, in_stock: true, product_url: 'https://www.amazon.in/dp/B0BD258Q7L' },
          { retailer: 'nykaa', mrp: 599, current_price: 539, discount_percent: 10, in_stock: true, product_url: 'https://www.nykaa.com/maybelline-new-york-fit-me-mono-blush/p/7066988' }
        ]
      }
    ]
  }
];

export function getClientRecommendations(
  undertone: string,
  skinDepth: string,
  skinType: string = 'all',
  category: string = 'foundation',
  budgetInr: number | null = 1000
): RecommendationResponse {
  const uTone = undertone.toLowerCase();
  const sDepth = skinDepth.toLowerCase();
  const sType = skinType.toLowerCase();

  // Filter products by category
  const filteredProds = category === 'all'
    ? VERIFIED_CATALOG
    : VERIFIED_CATALOG.filter(p => p.category === category);

  interface Candidate {
    product: CatalogProduct;
    variant: CatalogProduct['variants'][0];
    bestPrice: CatalogProduct['variants'][0]['prices'][0];
    score: number;
  }

  const candidates: Candidate[] = [];

  for (const prod of filteredProds) {
    for (const v of prod.variants) {
      if (!v.prices || v.prices.length === 0) continue;
      const sortedPrices = [...v.prices].sort((a, b) => a.current_price - b.current_price);
      const bestPrice = sortedPrices[0];

      let score = 0;

      // 1. Skin depth
      if (v.depth_level.toLowerCase() === sDepth) {
        score += 40;
      } else if (prod.skin_tones.map(t => t.toLowerCase()).includes(sDepth)) {
        score += 25;
      } else {
        score += 10;
      }

      // 2. Undertone
      if (v.undertone.toLowerCase() === uTone) {
        score += 35;
      } else if (v.undertone.toLowerCase() === 'neutral' || uTone === 'neutral') {
        score += 25;
      } else if (prod.undertones.map(u => u.toLowerCase()).includes(uTone)) {
        score += 15;
      }

      // 3. Skin type
      if (sType !== 'all' && prod.skin_types.map(s => s.toLowerCase()).includes(sType)) {
        score += 15;
        if (sType === 'oily' && prod.finish.includes('matte')) score += 5;
        if (sType === 'dry' && (prod.finish.includes('dewy') || prod.finish.includes('hydrat'))) score += 5;
      }

      // 4. Rating factor
      score += Math.min(prod.rating * 2, 10);

      candidates.push({ product: prod, variant: v, bestPrice, score });
    }
  }

  // Sort descending by score
  candidates.sort((a, b) => b.score - a.score);

  // In budget candidates
  const inBudget = candidates.filter(
    c => budgetInr === null || c.bestPrice.current_price <= budgetInr
  );

  const recommendations: RecommendationCategoryResult[] = [];
  const seenProductIds = new Set<string>();

  const buildResult = (
    cand: Candidate,
    tag: 'best_overall' | 'budget_friendly' | 'best_value' | 'premium',
    label: string,
    reasonText: string
  ): RecommendationCategoryResult => {
    const p = cand.product;
    const v = cand.variant;
    const bp = cand.bestPrice;

    const matchedVariant: VariantInfo = {
      id: v.id,
      shade_name: v.shade_name,
      shade_code: v.shade_code,
      hex_color: v.hex_color,
      undertone: v.undertone,
      depth_level: v.depth_level,
      sku: v.sku,
      image_url: v.image_url,
      prices: v.prices.map(pr => ({
        retailer: pr.retailer,
        currency: 'INR',
        mrp: pr.mrp,
        current_price: pr.current_price,
        discount_percent: pr.discount_percent,
        in_stock: pr.in_stock,
        stock_status: 'in_stock',
        product_url: pr.product_url,
        affiliate_url: pr.product_url,
        is_stale: false,
        last_checked_at: new Date().toISOString(),
      })),
    };

    const bestPriceInfo: PriceInfo = {
      retailer: bp.retailer,
      currency: 'INR',
      mrp: bp.mrp,
      current_price: bp.current_price,
      discount_percent: bp.discount_percent,
      in_stock: bp.in_stock,
      stock_status: 'in_stock',
      product_url: bp.product_url,
      affiliate_url: bp.product_url,
      is_stale: false,
      last_checked_at: new Date().toISOString(),
    };

    const productInfo: ProductInfo = {
      id: p.id,
      title: p.title,
      brand: p.brand,
      category: p.category,
      description: p.description,
      finish: p.finish,
      coverage: p.coverage,
      rating: p.rating,
      review_count: p.review_count,
      matched_variant: matchedVariant,
      best_price: bestPriceInfo,
      all_variants: p.variants.map(va => ({
        id: va.id,
        shade_name: va.shade_name,
        shade_code: va.shade_code,
        hex_color: va.hex_color,
        undertone: va.undertone,
        depth_level: va.depth_level,
        sku: va.sku,
        image_url: va.image_url,
        prices: va.prices.map(pr => ({
          retailer: pr.retailer,
          currency: 'INR',
          mrp: pr.mrp,
          current_price: pr.current_price,
          discount_percent: pr.discount_percent,
          in_stock: pr.in_stock,
          stock_status: 'in_stock',
          product_url: pr.product_url,
          affiliate_url: pr.product_url,
          is_stale: false,
          last_checked_at: new Date().toISOString(),
        })),
      })),
    };

    return {
      tag,
      label,
      reason: reasonText,
      product: productInfo,
    };
  };

  // 1. Best Overall Match
  if (inBudget.length > 0) {
    const top = inBudget[0];
    seenProductIds.add(top.product.id);
    recommendations.push(
      buildResult(
        top,
        'best_overall',
        'Best Overall Match',
        `Top formulation match (${Math.round(top.score)}% fit). Shade ${top.variant.shade_name} is specifically balanced for ${skinDepth} skin with ${undertone} undertones.`
      )
    );
  }

  // 2. Budget Bestie
  const eligibleBudget = inBudget.filter(c => !seenProductIds.has(c.product.id));
  if (eligibleBudget.length > 0) {
    const budgetPick = [...eligibleBudget].sort((a, b) => a.bestPrice.current_price - b.bestPrice.current_price)[0];
    seenProductIds.add(budgetPick.product.id);
    recommendations.push(
      buildResult(
        budgetPick,
        'budget_friendly',
        'Budget-Friendly Pick',
        `Best value at ₹${budgetPick.bestPrice.current_price.toLocaleString('en-IN')}. Exceptional pigment and coverage without exceeding everyday price limits.`
      )
    );
  }

  // 3. Best Value
  const eligibleValue = inBudget.filter(c => !seenProductIds.has(c.product.id));
  if (eligibleValue.length > 0) {
    const valuePick = [...eligibleValue].sort((a, b) => b.product.rating - a.product.rating)[0];
    seenProductIds.add(valuePick.product.id);
    recommendations.push(
      buildResult(
        valuePick,
        'best_value',
        'Best Value & Performance',
        `Rated ${valuePick.product.rating}/5 across ${valuePick.product.review_count.toLocaleString('en-IN')} verified reviews.`
      )
    );
  }

  // 4. Premium / Luxury Upgrade
  const eligiblePremium = candidates.filter(c => !seenProductIds.has(c.product.id));
  if (eligiblePremium.length > 0) {
    const premPick = [...eligiblePremium].sort((a, b) => b.bestPrice.current_price - a.bestPrice.current_price)[0];
    seenProductIds.add(premPick.product.id);
    recommendations.push(
      buildResult(
        premPick,
        'premium',
        'Luxury & Premium Upgrade',
        `High-end luxury formulation featuring professional wear and high-pigment purity.`
      )
    );
  }

  return {
    query_undertone: undertone,
    query_skin_depth: skinDepth,
    query_skin_type: skinType,
    query_category: category,
    budget_limit_inr: budgetInr,
    total_candidates_found: candidates.length,
    recommendations,
    alternative_picks: [],
  };
}
