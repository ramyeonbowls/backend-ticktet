import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from './controllers/auth.controller'
import { requireAuth } from './middlewares/auth.middleware'
import { success, fail } from './utils/response'

export default async function router(req: Request) {
  const url = new URL(req.url)
  const path = url.pathname
  const method = req.method

  // AUTH ROUTES
  if (path === '/auth/register' && method === 'POST') {
    return registerController(req)
  }

  if (path === '/auth/login' && method === 'POST') {
    return loginController(req)
  }

  if (path === '/auth/refresh' && method === 'POST') {
    return refreshController(req)
  }

  if (path === '/auth/logout' && method === 'POST') {
    return logoutController(req)
  }

  // PROTECTED EXAMPLE
  if (path === '/me' && method === 'GET') {
    try {
      const userId = requireAuth(req.headers)
      return success({ userId })
    } catch (err: any) {
      return fail(err.message || 'Unauthorized', 401)
    }
  }

  // NOT FOUND HANDLER
  return fail('Not Found', 404)
}
