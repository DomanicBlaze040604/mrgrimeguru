# Car Cleaner release

## Product

- Public route: `/shop/vehicle-cleaner`; display name: Car Cleaner.
- Selling price ₹799; comparison price ₹899.
- Each Buy 1 Get 1 Free pack contains two 500 ml cans.
- Opening inventory: 1,000 offer packs. Publication script never resets existing inventory.
- Bikes/two-wheelers are mentioned only in compatibility information, not in the name or artwork.

## Artwork

Generated with the built-in image generation tool, using the existing cleaner packaging and foam image style as references. The final blue can uses orange Mr/Guru lettering, white Grime lettering, CAR CLEANER, a car illustration, and a 500 ml label. No bikes appear in the selected artwork. These are design specifications, not verbatim generation transcripts.

Gallery order and saved files under `public/images/products/`:

1. `vehicle-cleaner-bogo-transparent.png`: two matching cans, orange gift ribbon, FREE tag and Buy 1 Get 1 Free headline, transparent background.
2. `vehicle-cleaner-cutout.png`: orange-capped blue Car Cleaner can, transparent background.
3. `vehicle-cleaner-foam.png`: uncapped can surrounded by dense white foam, transparent background, matching other cleaners.
4. `gallery/vehicle-cleaner-1.png`: car-care setting with a silver car and microfibre cloth.
5. `gallery/vehicle-cleaner-4.png`: driveway setting with a dark blue car and cleaning accessories.

## Supplied videos

`car cleaner 1.mp4`, `car cleaner 2.mp4`, and `car cleaner 3.mp4` are included in the homepage's continuous swipe/drag carousel and the product page. The first clip also powers the floating product preview. Existing homepage modal playback and swipe controls are reused, without arrow controls.

## Verification

The user's `multipurpose clip 3.mp4` is also added to the Multipurpose Cleaner page. Its SHA-256 equals the existing `multipurpose-1.mp4`; the supplied file is retained as requested, with the duplication reported.

`node scripts/verify-vehicle-cleaner.cjs` checks the actual public database product, pricing, stock, five gallery images, checkout payload, admin snapshot and inventory relation shapes. The existing Fastrr suite checks guest checkout, price validation and order syncing without making a payment.

Migration `004_vehicle_cleaner_family.sql` was approved and applied before publishing the new catalog rows. Existing products, bundles and orders are preserved.
