'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export const GA_ID = 'G-K0PBNFRZFW'
export const META_ID = '891508377308340'

type Pixel = (...args: unknown[]) => void
declare global { interface Window { fbq?: Pixel } }

export function Analytics() {
  const pathname = usePathname()
  const lastMetaPage = useRef<string | null>(null)
  const privatePage = /^\/(account|checkout|order-success|login|admin)(\/|$)/.test(pathname)

  function trackMetaPage() {
    if (!privatePage && window.fbq && lastMetaPage.current !== pathname) {
      window.fbq('track', 'PageView')
      lastMetaPage.current = pathname
    }
  }

  useEffect(() => {
    if (!privatePage && window.fbq && lastMetaPage.current !== pathname) {
      window.fbq('track', 'PageView')
      lastMetaPage.current = pathname
    }
  }, [pathname, privatePage])

  if (privatePage) return null
  return <>
    <Script id="guru-google-tag" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    `}</Script>
    <Script id="guru-google-library" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    <Script id="guru-meta-pixel" strategy="afterInteractive" onReady={trackMetaPage}>{`
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
      s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('set', 'autoConfig', false, '${META_ID}');
      fbq('init', '${META_ID}');
    `}</Script>
    <noscript>{/* The standard no-JavaScript fallback requested by the merchant. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img height="1" width="1" style={{ display: 'none' }} alt="" src={`https://www.facebook.com/tr?id=${META_ID}&ev=PageView&noscript=1`} />
    </noscript>
  </>
}
