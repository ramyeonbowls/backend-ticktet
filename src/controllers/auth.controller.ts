import * as authService from '../services/auth.service'
import { success, fail } from '../utils/response'
import cookie from 'cookie'

export async function registerController(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = body as { email: string; password: string; name: string }
    if (!email || !password) return fail('Email and password required', 400)
    const user = await authService.registerUser(email, password, name)
    return success(user, 201)
  } catch (err: any) {
    return fail(err.message || 'Registration failed', 400)
  }
}

export async function loginController(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body as { email: string; password: string }
    if (!email || !password) return fail('Email and password required', 400)
    const user = await authService.validateCredentials(email, password)
    if (!user) return fail('Invalid credentials', 401)
    const tokens = await authService.createTokensForUser(user.id)
    // set refresh token cookie
    const cookieStr = cookie.serialize('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 30),
      sameSite: 'lax',
    })
    const res = success({ accessToken: tokens.accessToken })
    res.headers.set('Set-Cookie', cookieStr)
    return res
  } catch (err: any) {
    return fail(err.message || 'Login failed', 500)
  }
}

export async function refreshController(req: Request) {
  try {
    const cookies = req.headers.get('cookie') || ''
    const parsed = Object.fromEntries(cookies.split(';').map(s => s.split('=').map(p => p.trim())))
    const token = parsed.refreshToken
    if (!token) return fail('No refresh token', 401)
    const newTokens = await authService.rotateRefreshToken(token)
    const cookieStr = cookie.serialize('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 30),
      sameSite: 'lax',
    })
    const res = success({ accessToken: newTokens.accessToken })
    res.headers.set('Set-Cookie', cookieStr)
    return res
  } catch (err: any) {
    return fail(err.message || 'Refresh failed', 401)
  }
}

export async function logoutController(req: Request) {
  try {
    const cookies = req.headers.get('cookie') || ''
    const parsed = Object.fromEntries(cookies.split(';').map(s => s.split('=').map(p => p.trim())))
    const token = parsed.refreshToken
    if (token) await authService.revokeRefreshToken(token)
    const res = success({ message: 'Logged out' })
    res.headers.set('Set-Cookie', 'refreshToken=; HttpOnly; Path=/; Max-Age=0')
    return res
  } catch (err: any) {
    return fail('Logout failed', 500)
  }
}
