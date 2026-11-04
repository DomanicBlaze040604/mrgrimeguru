import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getGuide, guideImage, guideProduct } from '@/lib/blog'
import { getCleanerOffer } from '@/lib/cleaner-offers'
import { absoluteUrl, breadcrumbs, pageMetadata, SITE_URL } from '@/lib/seo'
import { JsonLd } from '@/components/storefront/JsonLd'

interface Props { params: Promise<{ slug: string }> }
export const revalidate = 300

export async function generateMetadata({ params }: Props) {
  const post = await getGuide((await params).slug)
  if (!post) return { title: 'Guide not found', robots: { index: false } }
  const metadata = pageMetadata(post.meta_title || post.title, post.meta_description || post.excerpt, `/blog/${post.slug}`, guideImage(post))
  return { ...metadata, openGraph: { ...metadata.openGraph, type: 'article' as const, publishedTime: post.published_at, modifiedTime: post.updated_at, authors: ['Mr GrimeGuru editorial team'] } }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getGuide((await params).slug)
  if (!post) notFound()
  const productSlug = guideProduct(post.slug)
  const product = productSlug ? getCleanerOffer(productSlug) : undefined
  const sections = post.content.replace(/^(## [^\n]+)\n/gm, '$1\n\n').split(/\n\n+/)
  const date = (value: string) => new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })
  return <article className="guru-journal guru-article container-wide py-12">
    <JsonLd data={breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Cleaning guides', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }])} />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.excerpt, image: absoluteUrl(guideImage(post)), datePublished: post.published_at, dateModified: post.updated_at, mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`), author: { '@type': 'Organization', name: 'Mr GrimeGuru editorial team', url: absoluteUrl('/about') }, publisher: { '@id': `${SITE_URL}/#organization` } }} />
    <Link href="/blog" className="guru-journal-read">← All cleaning guides</Link>
    <h1>{post.title}</h1><p className="guru-journal-intro">{post.excerpt}</p>
    <div className="guru-article-byline">By Mr GrimeGuru editorial team · {post.reading_time_minutes} min read<br />Published <time dateTime={post.published_at}>{date(post.published_at)}</time> · Updated <time dateTime={post.updated_at}>{date(post.updated_at)}</time></div>
    <div className="guru-article-image"><Image src={guideImage(post)} alt={post.title} fill sizes="(max-width: 900px) 92vw, 860px" preload /></div>
    <div className="guru-article-body">{sections.map((text, index) => text.startsWith('## ') ? <h2 key={index}>{text.slice(3)}</h2> : <p key={index}>{text}</p>)}</div>
    {product && <aside className="guru-article-product"><Image src={`/images/products/${product.slug}-cutout.png`} alt={`${product.name}, 500 ml`} width={100} height={160} /><div><h2>Explore {product.name}</h2><p>Check the current price, offer and compatible-use information before ordering.</p><Link className="guru-button" href={`/shop/${product.slug}`}>View product →</Link></div></aside>}
    <nav aria-label="More cleaning help" className="guru-article-links"><Link href="/blog">More cleaning guides</Link><Link href="/faq">Product & order FAQs</Link><Link href="/contact">Ask our team</Link></nav>
  </article>
}
