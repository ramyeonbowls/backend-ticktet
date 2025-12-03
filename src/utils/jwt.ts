import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret'

export function signAccessToken(
  payload: object,
  expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m'
) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn })
}

export function signRefreshToken(
  payload: object,
  days = Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 30)
) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: `${days}d` })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET)
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET)
}
