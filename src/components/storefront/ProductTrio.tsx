import Image from 'next/image'

const bottles = [
  ['shoe-cleaner', 'Shoe Cleaner'],
  ['kitchen-cleaner', 'Kitchen Cleaner'],
  ['multipurpose-cleaner', 'Multipurpose Cleaner'],
]

export function ProductTrio({ compact = false }: { compact?: boolean }) {
  return <span className={`guru-trio ${compact ? 'is-compact' : ''}`}>
    {bottles.map(([slug, name]) => <span className="guru-trio-bottle" key={slug}><Image src={`/images/products/${slug}-cutout.png`} alt={name} fill sizes={compact ? '45px' : '(max-width: 700px) 30vw, 20vw'} /></span>)}
  </span>
}
