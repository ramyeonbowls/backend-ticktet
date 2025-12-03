declare module 'jsonwebtoken' {
  export interface SignOptions {
    expiresIn?: string | number
    algorithm?:
      | 'HS256'
      | 'HS384'
      | 'HS512'
      | 'RS256'
      | 'RS384'
      | 'RS512'
      | 'ES256'
      | 'ES384'
      | 'ES512'
      | 'PS256'
      | 'PS384'
      | 'PS512'
  }

  export interface VerifyOptions {
    algorithms?: string[]
  }

  export interface JwtPayload {
    [key: string]: any
  }

  export function sign(payload: object, secretOrPrivateKey: string, options?: SignOptions): string
  export function verify(
    token: string,
    secretOrPublicKey: string,
    options?: VerifyOptions
  ): JwtPayload | string
  export function decode(token: string): JwtPayload | null

  const _default: {
    sign: typeof sign
    verify: typeof verify
    decode: typeof decode
  }

  export default _default
}
