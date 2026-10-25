// Shared introductory offers, used by storefronts and server-side order pricing.
// Legacy slugs keep existing database IDs, inventory and order history intact.
const offers = {
  'kitchen-cleaner': { slug: 'kitchen-cleaner', legacySlug: 'kitchen-degreaser', family: 'kitchen_cleaner', databaseFamily: 'kitchen_degreaser', name: 'Kitchen Cleaner', description: 'Foam-powered cleaning for everyday kitchen grease and residue.', price: 49900, original: 59900 },
  'multipurpose-cleaner': { slug: 'multipurpose-cleaner', legacySlug: 'floor-cleaner', family: 'multipurpose_cleaner', databaseFamily: 'floor_cleaner', name: 'Multipurpose Cleaner', description: 'A fresh start for everyday messes on compatible household surfaces.', price: 49900, original: 59900 },
  'shoe-cleaner': { slug: 'shoe-cleaner', legacySlug: 'shoe-cleaner', family: 'shoe_cleaner', databaseFamily: 'shoe_cleaner', name: 'Shoe Cleaner', description: 'Give compatible footwear a fresh start with grime-fighting foam.', price: 59900, original: 69900 },
} as const

export function getCleanerOffer(slug: string) {
  return Object.values(offers).find(offer => offer.slug === slug || offer.legacySlug === slug)
}

export function getDatabaseFamily(family: string) {
  return Object.values(offers).find(offer => offer.family === family)?.databaseFamily ?? family
}
