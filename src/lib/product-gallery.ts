import { getCleanerOffer } from './cleaner-offers'

export type ProductSlide = { src: string; title: string; points: string[]; artwork: boolean; promotion?: boolean }
const details: Record<string, [string, string[]][]> = {
  "kitchen-cleaner": [
    [
      "Grease, meet your Guru.",
      [
        "Foam-powered kitchen cleaning",
        "Tackles everyday grease and residue",
        "500 ml of cleaning power"
      ]
    ],
    [
      "Made for kitchen mess.",
      [
        "Gas hobs and kitchen tiles",
        "Chimney filters and cooking splashes",
        "Use on label-approved surfaces"
      ]
    ],
    [
      "Foam on. Grime gone.",
      [
        "Spray directly on the mess",
        "Give the foam time to work",
        "Wipe away loosened residue"
      ]
    ],
    [
      "Cook. Clean. Repeat.",
      [
        "A fresh start after cooking",
        "Keep a clean cloth close by",
        "Check the label for compatible materials"
      ]
    ],
    [
      "Spray. Wait. Wipe.",
      [
        "1 · Shake the can before use",
        "2 · Spray and wait as directed on the label",
        "3 · Wipe clean with a suitable cloth"
      ]
    ],
    [
      "From grime to shine.",
      [
        "Target everyday cooking marks",
        "Reveal a fresh surface with a cloth",
        "Illustrated cleaning scene; results vary"
      ]
    ]
  ],
  "multipurpose-cleaner": [
    [
      "One spray. Endless everyday.",
      [
        "Foam for everyday dirt and grime",
        "One cleaner for compatible home surfaces",
        "500 ml of cleaning power"
      ]
    ],
    [
      "Room to room. Make way for foam.",
      [
        "Kitchen surfaces, doors and tiles",
        "Compatible furniture, glass and mirrors",
        "Check label guidance for each material"
      ]
    ],
    [
      "Let the foam take its time.",
      [
        "Spray onto the marked surface",
        "Allow the formula time to work",
        "Wipe away loosened dirt and grime"
      ]
    ],
    [
      "Less fuss. More fresh.",
      [
        "Make everyday cleaning a simple routine",
        "Spot-test an inconspicuous area first",
        "Follow the label for surface compatibility"
      ]
    ],
    [
      "Spray. Wait. Wipe.",
      [
        "1 · Shake the can before use",
        "2 · Spray and wait as directed on the label",
        "3 · Wipe with a suitable clean cloth"
      ]
    ],
    [
      "From dirty to fresh.",
      [
        "Give everyday marks a fresh start",
        "Clean one manageable area at a time",
        "Illustrated cleaning scene; results vary"
      ]
    ]
  ],
  "shoe-cleaner": [
    [
      "Fresh kicks. Quick fix.",
      [
        "Foam-powered footwear care",
        "Tackles dirt on compatible shoes",
        "500 ml of cleaning power"
      ]
    ],
    [
      "A little care. A better pair.",
      [
        "Compatible sneakers and canvas shoes",
        "Target dirty soles and everyday marks",
        "Check shoe and cleaner care labels"
      ]
    ],
    [
      "Foam meets the street.",
      [
        "Apply foam to the dirty area",
        "Give the formula time to work",
        "Wipe away loosened everyday grime"
      ]
    ],
    [
      "Keep your clean streak.",
      [
        "Freshen up your everyday footwear",
        "Spot-test first on a hidden area",
        "Let shoes dry as their care label directs"
      ]
    ],
    [
      "Spray. Wait. Wipe.",
      [
        "1 · Shake the can before use",
        "2 · Apply as directed on compatible material",
        "3 · Wipe clean and allow to dry"
      ]
    ],
    [
      "Lose the grime. Step out in prime.",
      [
        "Make shoe care part of your routine",
        "Work gently on marks and soles",
        "Illustrated cleaning scene; results vary"
      ]
    ]
  ]
}

export function getProductInformation(slug: string): ProductSlide[] {
  const offer = getCleanerOffer(slug)
  if (!offer) return []
  return details[offer.slug].map(([title, points], i) => ({ src: `/images/products/gallery/${offer.slug}-${i + 1}.png`, title, points, artwork: true }))
}

export function getProductSlides(slug: string, name: string, image: string, images?: string[]): ProductSlide[] {
  const offer = getCleanerOffer(slug)
  if (!offer) return (images?.length ? images : [image]).map(src => ({ src, title: name, points: [], artwork: false }))
  const slides = getProductInformation(slug)
  const foam: ProductSlide = { src: `/images/products/${offer.slug}-foam.png`, title: `${name} surrounded by rich foam · 500 ml`, points: [], artwork: false }
  const promotion: ProductSlide = { src: `/images/products/${offer.slug}-bogo-transparent.png`, title: `${name} · Buy 1 Get 1 Free · Two 500 ml cans`, points: [], artwork: false, promotion: true }
  return [promotion, { src: `/images/products/${offer.slug}-cutout.png`, title: `${name} · 500 ml`, points: [], artwork: false }, foam, slides[0], slides[3]]
}

