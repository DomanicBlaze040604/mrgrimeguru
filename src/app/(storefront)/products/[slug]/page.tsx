import type { Metadata } from 'next'
import { getCleanerOffer } from '@/lib/cleaner-offers'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductDetailView } from '@/components/storefront/ProductDetailView'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

const DEFAULT_PRODUCTS: Record<string, {
  name: string
  price_paise: number
  compare_at_price_paise?: number
  description: string
  short_description: string
  images: string[]
  category_name: string
  reviews: { id: string; author_name: string; rating: number; title: string; body: string; created_at: string }[]
}> = {
  'kitchen-cleaner': {
    name: 'Mr GrimeGuru Kitchen Cleaner (500 ml)',
    price_paise: 49900,
    compare_at_price_paise: 59900,
    short_description: 'A foam-first fix for everyday kitchen grease and residue.',
    description: 'Give cooking splashes and sticky residue the Guru treatment. Follow the product label for compatible surfaces, application and contact time.',
    images: ['/images/products/kitchen-cleaner-cutout.png'],
    category_name: 'Kitchen Care',
    reviews: [],
  },
  'multipurpose-cleaner': {
    name: 'Mr GrimeGuru Multipurpose Cleaner (500 ml)',
    price_paise: 49900,
    compare_at_price_paise: 59900,
    short_description: 'Foam-powered cleaning for compatible household surfaces.',
    description: 'Take on everyday marks and messes around your home. Check the label for approved surfaces and spot-test before use.',
    images: ['/images/products/multipurpose-cleaner-cutout.png'],
    category_name: 'Home Care',
    reviews: [],
  },
  'laundry-pods': {
    name: 'Mr GrimeGuru 3-in-1 Power Laundry Pods (Pack of 30)',
    price_paise: 39900,
    compare_at_price_paise: 49900,
    short_description: 'Pre-measured 3-chamber capsules with active enzymes, fabric conditioner, and freshness booster.',
    description: 'Triple-chamber laundry capsules with high-potency stain enzyme action, fabric softeners, and long-lasting freshness in hot or cold water. PVA film dissolves in under 30 seconds.',
    images: ['/images/products/laundry-pods.jpg'],
    category_name: 'Laundry Care',
    reviews: [
      {
        id: 'r1',
        author_name: 'Ananya Verma, Mumbai',
        rating: 5,
        title: 'Dissolved perfectly even in quick cold wash!',
        body: 'No white sticky residue like ordinary detergents. Got rid of greasy collar grime effortlessly.',
        created_at: '2026-10-15T00:00:00Z',
      },
      {
        id: 'r2',
        author_name: 'Rahul Sen, Bangalore',
        rating: 5,
        title: 'Smells like high-end linen spray',
        body: 'The fragrance lasts days after drying in the monsoon air. Never going back to liquid detergent.',
        created_at: '2026-10-18T00:00:00Z',
      },
    ],
  },
  'laundry-beads': {
    name: 'Mr GrimeGuru In-Wash Scent Booster Beads (250g)',
    price_paise: 44900,
    compare_at_price_paise: 54900,
    short_description: 'Touch-activated fragrance micro-pearls providing up to 12 weeks of luxury aroma.',
    description: 'In-wash scent booster pearls infused with essential oil micro-capsules that burst slowly throughout wear for unstoppable, luxurious aroma.',
    images: ['/images/products/laundry-beads.jpg'],
    category_name: 'Fragrance Boosters',
    reviews: [
      {
        id: 'r3',
        author_name: 'Deepika Rao, Hyderabad',
        rating: 5,
        title: 'My gym clothes finally stay fresh!',
        body: 'Even after heavy workouts, the micro-capsules burst with ocean freshness. Absolute holy grail product.',
        created_at: '2026-10-12T00:00:00Z',
      },
    ],
  },
  'floor-cleaner': {
    name: 'Mr GrimeGuru Botanical Floor Cleaner Concentrate (1L)',
    price_paise: 34900,
    compare_at_price_paise: 42900,
    short_description: 'Streak-free shine with pet & baby safe neem and citrus botanical extracts.',
    description: 'High-dilution botanical floor cleaning elixir that lifts deep dirt, removes grime, and leaves behind citrus botanical brilliance without harsh residue.',
    images: ['/images/products/multipurpose-cleaner-cutout.png'],
    category_name: 'Surface Care',
    reviews: [
      {
        id: 'r4',
        author_name: 'Pooja Bhatt, Pune',
        rating: 5,
        title: 'Safe for my golden retriever paws',
        body: 'No strong chemical smell that irritates my dog. And the marble floors dry completely streak-free in 2 minutes!',
        created_at: '2026-10-10T00:00:00Z',
      },
    ],
  },
  'kitchen-degreaser': {
    name: 'Mr GrimeGuru Heavy-Duty Kitchen Degreaser Spray (500ml)',
    price_paise: 29900,
    compare_at_price_paise: 37900,
    short_description: 'Melts burnt-on tadka oil and sticky chimney exhaust grease in 60 seconds.',
    description: 'Foaming citrus-solvent degreasing formula that penetrates stubborn chimney soot, exhaust grease, stove burn marks, and fryer crust effortlessly.',
    images: ['/images/products/kitchen-cleaner-cutout.png'],
    category_name: 'Kitchen Care',
    reviews: [
      {
        id: 'r5',
        author_name: 'Vikram Joshi, Delhi',
        rating: 5,
        title: 'Cleaned our greasy chimney filters without scrubbing',
        body: 'Sprayed, waited 60 seconds, and rinsed with hot water. The brown sticky oil literally dripped right off.',
        created_at: '2026-10-14T00:00:00Z',
      },
    ],
  },
  'shoe-cleaner': {
    name: 'Mr GrimeGuru Shoe Cleaner (500 ml)',
    price_paise: 59900,
    compare_at_price_paise: 69900,
    short_description: 'Waterless foaming solution with bristles safe for white sneakers, mesh, and suede.',
    description: 'No-water-soak cleaning foam with dual-density scrub brush that restores dirty white soles and delicate uppers in under 3 minutes.',
    images: ['/images/products/shoe-cleaner-cutout.png'],
    category_name: 'Footwear Care',
    reviews: [
      {
        id: 'r6',
        author_name: 'Karan Mehra, Mumbai',
        rating: 5,
        title: 'Made my muddy white Air Force 1s look brand new',
        body: 'Did not yellow the rubber midsole. So easy to clean right before heading out the door.',
        created_at: '2026-10-19T00:00:00Z',
      },
    ],
  },
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: dbProduct } = await supabase
    .from('products')
    .select('name, short_description')
    .eq('slug', slug)
    .single()

  const fallback = DEFAULT_PRODUCTS[slug]
  const title = dbProduct?.name || fallback?.name || 'Product Details'
  const description = dbProduct?.short_description || fallback?.short_description || 'Mr GrimeGuru cleaning product'

  return {
    title: `${title} — Mr GrimeGuru`,
    description,
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params
  const cleaner = getCleanerOffer(slug)
  if (cleaner) redirect(`/shop/${cleaner.slug}`)
  if (slug === 'laundry-pods') redirect('/shop#coming-soon')
  if (slug === 'laundry-beads') redirect('/shop')
  const supabase = await createClient()

  // Try fetching from Supabase
  const { data: dbProduct } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price_paise,
      compare_at_price_paise,
      description,
      short_description,
      images,
      in_stock,
      category:product_categories(name)
    `)
    .eq('slug', slug)
    .single()

  const fallback = DEFAULT_PRODUCTS[slug]

  if (!dbProduct && !fallback) {
    notFound()
  }

  // Fetch reviews from Supabase
  let reviews: any[] = []
  if (dbProduct?.id) {
    const { data: dbReviews } = await supabase
      .from('reviews')
      .select('id, author_name, rating, title, body, created_at')
      .eq('product_id', dbProduct.id)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (dbReviews && dbReviews.length > 0) {
      reviews = dbReviews
    }
  }

  if (reviews.length === 0 && fallback?.reviews) {
    reviews = fallback.reviews
  }

  const productData = {
    id: dbProduct?.id || `prod_${slug}`,
    name: dbProduct?.name || fallback!.name,
    slug: dbProduct?.slug || slug,
    price_paise: dbProduct?.price_paise || fallback!.price_paise,
    compare_at_price_paise: dbProduct?.compare_at_price_paise || fallback?.compare_at_price_paise,
    description: dbProduct?.description || fallback!.description,
    short_description: dbProduct?.short_description || fallback!.short_description,
    images: Array.isArray(dbProduct?.images) && dbProduct.images.length > 0 ? dbProduct.images : (fallback?.images || ['/images/products/laundry-pods.jpg']),
    in_stock: dbProduct ? dbProduct.in_stock : true,
    category_name: (dbProduct?.category as any)?.name || fallback?.category_name,
    reviews,
  }

  return <ProductDetailView product={productData} />
}
