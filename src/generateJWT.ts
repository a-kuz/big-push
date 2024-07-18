import { sign } from '@tsndr/cloudflare-worker-jwt'
import { P8Key } from './types'
export type JWT = { token: string; expiration: Date }

let generatedJwt: JWT | undefined = undefined
export const jwt = async (p8Key: P8Key): Promise<string> => {
  if (!generatedJwt || generatedJwt.expiration < new Date()) {
    const token = await generateJWT(p8Key)
    generatedJwt = { token, expiration: new Date(Date.now() + 5 * 60 * 1000) }
  }
  return generatedJwt.token
}

const generateJWT = async (p8Key: P8Key): Promise<string> => {
  const jwtPayload = {
    iss: p8Key.teamId,
    iat: Math.floor(Date.now() / 1000),
  }

  console.warn("generateJWT!!!")
  return sign(jwtPayload, p8Key.privateKey, {
    algorithm: 'ES256',
    header: { alg: 'ES256', kid: p8Key.keyId },
  })
}
