import { sign } from '@tsndr/cloudflare-worker-jwt'
import { Env, P8Key, IOSNotification, NewMessageEvent, Message } from './types'

export default {
  async queue(batch, env): Promise<void> {
    for (const message of batch.messages) {
      const {
        event,
        deviceToken,
        aps: { body, title },
      } = message.body
      await push(deviceToken, env.P8, event, body, title)

      message.ack()
    }
  },
} satisfies ExportedHandler<Env, Message>

const push = async (
  deviceToken: string,
  privateKey: string,
  data: NewMessageEvent,
  body: string,
  title?: string,
) => {
  const pushEndpoint = 'https://api.push.apple.com/3/device/'

  const p8Key = {
    keyId: 'Z8D473D947',
    teamId: 'k2fintech',
    privateKey, // -----BEGIN PRIVATE KEY-----\MIGTAgEAMBMG....
  }

  const notification: IOSNotification = {
    aps: {
      alert: { body, title },
      sound: 'default',
    },
    data,
  }

  // Подготовка JWT для авторизации запроса к APNs
  const jwt = generateJWT(p8Key)

  // Подготовка запроса к APNs
  const response = await fetch(pushEndpoint + deviceToken, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt,
    },
    body: JSON.stringify(notification),
  })
}

// Генерация JWT для авторизации запроса к APNs
function generateJWT(p8Key: P8Key) {
  const jwtPayload = {
    iss: p8Key.teamId,
    iat: Math.floor(Date.now() / 1000),
  }

  const token = sign(jwtPayload, p8Key.privateKey, {
    algorithm: 'ES256',
    header: { alg: 'ES256', kid: p8Key.keyId },
  })

  return token
}
