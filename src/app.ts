import 'dotenv/config'
import router from './routes'

const PORT = Number(process.env.PORT || 3000)

Bun.serve({
  port: PORT,
  async fetch(req) {
    const origin = req.headers.get('origin') || '*'

    // ✅ 1. Tangani preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      })
    }

    try {
      // ✅ 2. Jalankan router
      const response = await router(req)

      // ✅ 3. Tambahkan CORS header ke semua response
      const newHeaders = new Headers(response.headers)
      newHeaders.set('Access-Control-Allow-Origin', origin)
      newHeaders.set('Access-Control-Allow-Credentials', 'true')

      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      })
    } catch (err) {
      console.error('Unhandled error:', err)
      return new Response(JSON.stringify({ success: false, message: 'Server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin,
        },
      })
    }
  },
})

console.log(`🚀 Server running at http://localhost:${PORT}`)
