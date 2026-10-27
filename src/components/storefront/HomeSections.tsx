import { ProductTrio } from './ProductTrio'
import { ProductImageGallery } from './ProductImageGallery'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Banknote, RotateCcw, Truck, MessagesSquare } from 'lucide-react'

export const range = [
  { slug: 'kitchen-cleaner', name: 'Kitchen Cleaner', category: 'Kitchen', image: 'kitchen-cleaner-cutout.png', color: 'yellow', price: 499, original: 599, line: 'Grease, meet your guru.', description: 'A foam-first fix for cooking splashes, sticky residue and everyday kitchen grease.', tags: ['Gas stoves', 'Chimney filters', 'Kitchen tiles'] },
  { slug: 'multipurpose-cleaner', name: 'Multipurpose Cleaner', category: 'Home', image: 'multipurpose-cleaner-cutout.png', color: 'green', price: 499, original: 599, line: 'Every room. A little more vroom.', description: 'Take on everyday marks and messes across compatible surfaces around your home.', tags: ['Home surfaces', 'Doors & tiles', 'Furniture'] },
  { slug: 'shoe-cleaner', name: 'Shoe Cleaner', category: 'Footwear', image: 'shoe-cleaner-cutout.png', color: 'orange', price: 599, original: 699, line: 'Fresh kicks. Quick fix.', description: 'Give your everyday footwear a fresh start with foam that helps lift dirt and surface marks.', tags: ['Sneakers', 'Soles', 'Compatible uppers'] },
]

export function CircularCategories() {
  return <section className="guru-categories" aria-label="Shop by category"><div className="guru-container guru-category-inner"><div className="guru-category-intro"><span className="guru-eyebrow">PICK YOUR GURU</span><p>A little foam.<br />A cleaner home.</p></div><div className="guru-category-links">{range.map(p => <Link href={`/shop/${p.slug}`} key={p.slug}><span className={`guru-category-circle ${p.color}`}><Image src={`/images/products/${p.image}`} alt={p.name} fill sizes="140px" /></span><strong>{p.name}</strong></Link>)}<Link href="/shop"><span className="guru-category-circle guru-category-all"><ProductTrio compact /></span><strong>All products <ArrowUpRight size={14} /></strong></Link></div></div></section>
}

export function SurfaceBanner() {
  const items = ['Gas stoves', 'Kitchen tiles', 'Sneaker soles', 'Chimney filters', 'Everyday spills', 'Doors & surfaces']
  return <div className="guru-ticker" aria-label={items.join(', ')}><div className="guru-ticker-track" aria-hidden="true">{[0, 1].map(copy => <div key={copy}>{items.map(item => <span key={item}>{item}<b>✦</b></span>)}</div>)}</div></div>
}

export function ProductRange() {
  return <section id="range" className="guru-section guru-range"><div className="guru-container"><div className="guru-section-heading"><div><span className="guru-eyebrow">01 / THE GRIME-FIGHTING RANGE</span><h2>Different mess.<br /><span>Same Guru energy.</span></h2></div><p>Three everyday heroes. One secret-formula story.<br />Pick your mess. Let the Guru do the rest.</p></div><div className="guru-range-grid">{range.map(p => <article key={p.slug} className={`guru-product-card ${p.color}`}><div className="guru-product-art"><span className="guru-product-label">{p.category}</span><span className="guru-art-star" aria-hidden="true">✦</span><ProductImageGallery slug={p.slug} name={p.name} image={`/images/products/${p.image}`} className="guru-range-gallery" /><span className="guru-product-slogan">{p.line}</span></div><Link href={`/shop/${p.slug}`} className="guru-product-details"><h3>{p.name}</h3><p>{p.description}</p><div className="guru-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div><div className="guru-product-price"><div><strong>₹{p.price}</strong> <s>₹{p.original}</s><small>500 ml</small></div><span className="guru-arrow"><ArrowUpRight size={23} /></span></div></Link></article>)}</div><p className="guru-range-note">Find your surface on the label. Spot-test first, then let your Guru get to work.</p></div></section>
}

function FoamIllustration({ foam }: { foam: boolean }) {
  return <svg viewBox="0 0 250 275" role="img" aria-label={foam ? 'Thick Mr GrimeGuru foam clinging to a tiled surface' : 'Thin liquid running down a tiled surface'}><rect width="250" height="275" rx="20" fill={foam ? '#f5ecd5' : '#f0e9da'} /><g stroke="#dfd1b5" strokeWidth="2">{[65, 130, 195].map(x => <path key={x} d={`M${x} 0V275`} />)}{[68, 136, 204].map(y => <path key={y} d={`M0 ${y}H250`} />)}</g><ellipse cx="125" cy="113" rx="67" ry="42" fill="#b48a43" opacity=".5" />{foam ? <><g fill="white" stroke="#ece7dc" strokeWidth="1"><circle cx="76" cy="107" r="31" /><circle cx="111" cy="86" r="33" /><circle cx="151" cy="91" r="34" /><circle cx="174" cy="124" r="33" /><circle cx="139" cy="146" r="35" /><circle cx="101" cy="143" r="34" /><circle cx="66" cy="138" r="26" /></g><g fill="none" stroke="#f7cc58" strokeWidth="2">{[[80,112,8],[113,96,6],[146,117,10],[115,144,7],[161,145,5]].map(([cx,cy,r]) => <circle key={cx} cx={cx} cy={cy} r={r} />)}</g><rect x="174" y="20" width="56" height="30" rx="15" fill="#111" /><text x="202" y="40" fill="#facc15" fontSize="14" fontWeight="bold" textAnchor="middle">30s</text><path d="M55 50l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" fill="#f97316" /></> : <><g stroke="#aac9cc" strokeWidth="8" strokeLinecap="round" opacity=".85"><path d="M72 108v113M105 96v146M143 108v82M180 110v116" /></g><ellipse cx="125" cy="254" rx="98" ry="8" fill="#aac9cc" opacity=".7" /></>}</svg>
}

export function WhyFoam() {
  return <section className="guru-section guru-why" id="why-foam"><div className="guru-container guru-why-grid"><div><span className="guru-eyebrow">02 / THE GURU KNOW-HOW</span><h2>Grime likes to stay.<br /><span>Foam leads the way.</span></h2><p className="guru-section-copy">Give your cleaner a little face time with the grime. Our foam clings where you spray, so the formula can get to work before you wipe.</p><ol className="guru-steps">{[['Spray it. Stay with it.', 'Foam clings to compatible surfaces, right where the mess is.'], ['Take a beat. Tackle the grease.', 'Give the formula time to work, following the directions on your can.'], ['Wipe away. Hello, hooray.', 'Lift away loosened dirt. Less fuss, more fresh.']].map(([title, copy], i) => <li key={title}><span>{i + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></div><div className="guru-comparison"><article><div className="guru-comparison-title">THIN SPRAY <span>runs down</span></div><FoamIllustration foam={false} /><p>Down it goes.<br />The mess still shows.</p></article><article className="guru-foam-card"><div className="guru-comparison-title">GURU FOAM <span>hangs on</span></div><FoamIllustration foam /><p>Stays on the grime.<br />Gets its working time.</p></article><small>Illustration of foam action. Follow product-label contact times.</small></div></div></section>
}

export function BuyingFromUs() {
  const cards = [
    { icon: Banknote, title: 'Your order. Your way.', text: 'Choose from the payment options available at checkout.', href: '/shop', link: 'Find your Guru' },
    { icon: RotateCcw, title: 'A snag? We have your back.', text: 'Find the details on returns, refunds and help with your order.', href: '/returns', link: 'Returns & refunds' },
    { icon: Truck, title: 'From our door to yours.', text: 'Free shipping on orders ₹499+. Delivery details, minus the guesswork.', href: '/shipping', link: 'Shipping information' },
    { icon: MessagesSquare, title: 'Need a hand? Ask the Guru.', text: 'Email support@mrgrimeguru.com for a helping hand. Phone support details are coming soon.', href: '/faq', link: 'Visit the help centre' },
  ]
  return <section className="guru-section guru-buying" id="buying"><div className="guru-container"><span className="guru-eyebrow">04 / BUYING FROM US</span><h2>Easy to choose.<br /><span>No time to lose.</span></h2><div className="guru-buying-grid">{cards.map(({ icon: Icon, title, text, href, link }) => <article key={title}><span className="guru-service-icon"><Icon size={23} /></span><h3>{title}</h3><p>{text}</p><Link href={href}>{link} <ArrowUpRight size={15} /></Link></article>)}</div></div></section>
}
