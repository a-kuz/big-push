import { sign } from '@tsndr/cloudflare-worker-jwt'
import { P8Key } from './types'

export const generateJWT = async (p8Key: P8Key): Promise<string> => {
  const jwtPayload = {
    iss: p8Key.teamId,
    iat: Math.floor(Date.now() / 1000),
  }

  return sign(jwtPayload, p8Key.privateKey, {
    algorithm: 'ES256',
    header: { alg: 'ES256', kid: p8Key.keyId },
  })
}
