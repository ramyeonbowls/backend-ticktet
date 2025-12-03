export function jsonResponse(status: number, body: any) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const success = (data: any, status = 200) => jsonResponse(status, { success: true, data })
export const fail = (message: string, status = 400) =>
  jsonResponse(status, { success: false, message })
