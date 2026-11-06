// Supabase may infer an array while a one-to-one inventory relation returns an object.
export function hasAvailableProductStock(relation: unknown): boolean {
  const stock: unknown = Array.isArray(relation) ? relation[0] : relation
  if (!stock || typeof stock !== 'object' || !('quantity' in stock) || !('reserved_quantity' in stock)) return false
  return typeof stock.quantity === 'number' && typeof stock.reserved_quantity === 'number'
    && stock.quantity > stock.reserved_quantity
}
