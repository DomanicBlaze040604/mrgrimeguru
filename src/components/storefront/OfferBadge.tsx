export function OfferBadge({ hero = false }: { hero?: boolean }) {
  return (
    <span
      className={`guru-offer-badge${hero ? ' guru-offer-badge--hero' : ''}`}
      aria-label="Buy 1 Get 1 Free"
    >
      <span className="guru-offer-badge-inner">
        <span className="guru-offer-badge-line">BUY 1</span>
        <span className="guru-offer-badge-line">GET 1</span>
        <span className="guru-offer-badge-line">FREE</span>
      </span>
    </span>
  )
}

