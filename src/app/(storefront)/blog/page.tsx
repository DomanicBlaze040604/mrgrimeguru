import Link from 'next/link'
import Image from 'next/image'
import { getGuides, guideImage } from '@/lib/blog'
import { pageMetadata, breadcrumbs, absoluteUrl } from '@/lib/seo'
import { JsonLd } from '@/components/storefront/JsonLd'

export const metadata = pageMetadata('Cleaning Guides & Practical Home Care Tips', 'Practical guides to kitchen grease, shoe care, compatible surfaces and everyday cleaning routines from Mr GrimeGuru.', '/blog')
export const revalidate = 300

export default async function BlogListingPage() {
  const posts = await getGuides()
  return <div className="guru-journal container-wide py-12">
    <JsonLd data={breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Cleaning guides', path: '/blog' }])} />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Cleaning guides', url: absoluteUrl('/blog'), mainEntity: { '@type': 'ItemList', itemListElement: posts.map((post, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteUrl(`/blog/${post.slug}`), name: post.title })) } }} />
    <span className="guru-eyebrow">A LITTLE KNOW-HOW</span>
    <h1>Cleaning guides for everyday messes</h1>
    <p className="guru-journal-intro">Practical steps, material checks and routines you can use at home. Always follow your product label and the surface maker’s care instructions.</p>
    <div className="guru-journal-grid">{posts.map(post => <article key={post.slug}>
      <Link href={`/blog/${post.slug}`} className="guru-journal-cover"><Image src={guideImage(post)} alt={post.title} fill sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw" /></Link>
      <div className="guru-journal-card-copy"><span>{post.reading_time_minutes} min read · Mr GrimeGuru editorial team</span>
      <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p>
      <Link href={`/blog/${post.slug}`} className="guru-journal-read">Read the guide →</Link></div>
    </article>)}</div>
    <p className="mt-10">Need help with a particular surface? <Link href="/contact">Contact our team</Link> or <Link href="/shop">explore the cleaner range</Link>.</p>
  </div>
}
