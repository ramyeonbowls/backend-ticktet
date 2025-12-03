import { verifyAccessToken } from '../utils/jwt'
import { fail } from '../utils/response'

export function requireAuth(headers: Headers) {
  const auth = headers.get('authorization') || ''
  const token = auth.replace('Bearer ', '')
  if (!token) throw new Error('No token')
  try {
    const payload = verifyAccessToken(token) as any
    return payload.sub
  } catch (err) {
    throw new Error('Invalid token')
  }
}
