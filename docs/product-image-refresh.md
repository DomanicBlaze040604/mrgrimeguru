# Product image refresh

Generated with the built-in image generation tool. Original JPEGs are preserved.

- Transparent, full-bottle assets: `public/images/products/{kitchen-cleaner,multipurpose-cleaner,shoe-cleaner}-cutout.png`.
- Eighteen separate scenes: `public/images/products/gallery/{cleaner-slug}-{1..6}.png`.
- Foam-covered cans: `public/images/products/{kitchen-cleaner,multipurpose-cleaner,shoe-cleaner}-foam.png`, always in the second carousel position. The main galleries contain eight slides; the information galleries contain seven.
- Full generation prompts and source outputs: `product-image-prompts.json`.
- Readable headings and points are rendered as accessible HTML from `src/lib/product-gallery.ts`.
- Galleries rotate every 3.5 seconds while visible, with hover, tap, keyboard and dot controls. Reduced-motion settings disable automatic rotation. Keyboard focus pauses rotation for reading.

Cutout edit prompt: Remove the black top and bottom bars and studio background from the original cleaner product photo. Preserve the full bottle, orange cap, label artwork and silhouette. Use true transparent alpha and clean natural edges. Update only the stated volume to NET. 500ml.

Final kitchen branding edit prompt: Edit ONLY the Mr GrimeGuru logo lettering on the yellow kitchen cleaner can in image 1. 'Mr' must be orange #F97316, 'Grime' must be white, 'Guru' must be orange #F97316. Use image 2 as the exact approved logo color reference. Thin dark outlines for legibility on yellow. Preserve the scene, lighting, objects, composition, bottle shape, label artwork, all other typography and NET. 500ml. Do not add text or change anything else. Full square unchanged composition.

The kitchen cutout and all six kitchen scenes received this branding correction. Multipurpose and shoe assets already use orange Mr, white Grime and orange Guru.

Generated cleaning scenes are illustrations, not recorded product tests. Existing video demonstrations remain unchanged.
