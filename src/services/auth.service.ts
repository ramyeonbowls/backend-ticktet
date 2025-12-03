import prisma from '../config/prisma'
import bcrypt from 'bcryptjs'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt'

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10)

export async function registerUser(email: string, password: string, name?: string) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('Email already used')
  const hashed = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await prisma.user.create({ data: { email, password: hashed, name } })
  return { id: user.id, email: user.email }
}

export async function validateCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return null

  return user
}

export async function createTokensForUser(userId: string) {
  const accessToken = signAccessToken({ sub: userId })
  const refreshToken = signRefreshToken({ sub: userId })
  const decoded: any = await new Promise(res => res(require('jsonwebtoken').decode(refreshToken)))
  const expiresAt = new Date((decoded.exp || 0) * 1000)
  await prisma.refreshToken.create({ data: { token: refreshToken, userId, expiresAt } })
  return { accessToken, refreshToken, expiresAt }
}

export async function revokeRefreshToken(token: string) {
  await prisma.refreshToken.deleteMany({ where: { token } })
}

export async function rotateRefreshToken(oldToken: string) {
  const existing = await prisma.refreshToken.findUnique({ where: { token: oldToken } })
  if (!existing) throw new Error('Invalid refresh token')
  // verify signature
  try {
    const payload: any = verifyRefreshToken(oldToken) as any
    const userId = payload.sub
    // delete old
    await prisma.refreshToken.delete({ where: { token: oldToken } })
    // create new tokens
    const { accessToken, refreshToken, expiresAt } = await createTokensForUser(userId)
    return { accessToken, refreshToken, expiresAt }
  } catch (err) {
    throw new Error('Invalid refresh token')
  }
}
