import { createHmac, timingSafeEqual } from 'node:crypto'

export function signGuestOrder(id: string, secret: string, expires = Date.now() + 7 * 86400000) {
  const body = `${id}.${expires}`
  return `${body}.${createHmac('sha256', secret).update(`guest-order:${body}`).digest('hex')}`
}

export function verifyGuestOrder(value: string | undefined, id: string, secret: string, now = Date.now()) {
  if (!value || !/^[a-f0-9]{24}$/.test(id)) return false
  const [orderId, expires, signature, extra] = value.split('.')
  if (extra || orderId !== id || !/^\d{13}$/.test(expires ?? '') || Number(expires) < now || !/^[a-f0-9]{64}$/.test(signature ?? '')) return false
  const expected = signGuestOrder(id, secret, Number(expires)).split('.')[2]
  return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))
}
