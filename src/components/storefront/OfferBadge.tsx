export function OfferBadge({ hero = false }: { hero?: boolean }) {
  return (
    <span
      className={`guru-offer-badge${hero ? ' guru-offer-badge--hero' : ''}`}
      aria-label="Buy 1 Get 1 Free"
    >
      <svg className="guru-offer-badge-burst" viewBox="0 0 100 100" aria-hidden="true">
        <polygon points="50,2 56,38 88,12 64,44 98,50 64,56 88,88 56,62 50,98 44,62 12,88 36,56 2,50 36,44 12,12 44,38" />
      </svg>
      <span className="guru-offer-badge-inner">
        <span className="guru-offer-badge-top">BUY 1</span>
        <strong className="guru-offer-badge-main">GET 1</strong>
        <span className="guru-offer-badge-sub">FREE</span>
      </span>
    </span>
  )
}

