import type { Metadata } from 'next'
import { CONTACT } from '@/lib/contact'

export const SITE_URL = 'https://www.mrgrimeguru.com'
export const SITE_NAME = 'Mr GrimeGuru'
export const SOCIAL_IMAGE = '/social-image'
export const absoluteUrl = (path = '/') => new URL(path, SITE_URL).href

export function pageMetadata(title: string, description: string, path: string, image = SOCIAL_IMAGE): Metadata {
  return {
    title, description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: { type: 'website', title, description, url: absoluteUrl(path), siteName: SITE_NAME, locale: 'en_IN', images: [{ url: absoluteUrl(image), alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [absoluteUrl(image)] },
  }
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: absoluteUrl(item.path) })) }
}

export const organizationSchema = {
  '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME, url: SITE_URL,
  email: CONTACT.email, telephone: '+918779817007', sameAs: [CONTACT.instagramUrl],
  address: { '@type': 'PostalAddress', streetAddress: 'Shop no E1, Mukund Nagar CHS Ltd, Andheri Kurla Road, Marol Pipeline, JB Nagar, near Mukund Hospital, Andheri East', addressLocality: 'Mumbai', addressRegion: 'Maharashtra', postalCode: '400059', addressCountry: 'IN' },
  contactPoint: { '@type': 'ContactPoint', telephone: '+918779817007', email: CONTACT.email, contactType: 'customer support', areaServed: 'IN' },
}
