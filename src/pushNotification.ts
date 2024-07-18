import { P8Key, IOSNotification, NewMessageEvent, Env } from './types'
import { jwt } from './generateJWT'
import { base64ToHex } from './base64ToHex'
import { sendPushRequest } from './sendPushRequest'
import { logHeaders } from './logHeaders'

export const pushNotification = async (
  deviceToken: string,
  privateKey: string,
  data: NewMessageEvent,
  body: string,
  env: Env,
  title?: string,
  subtitle?: string,
  badge?: number,
  threadId?: string,
  voip?: boolean,
) => {
  const hexDeviceToken = base64ToHex(deviceToken)
  const isEmulator = hexDeviceToken.length > 65
  console.log('hexDeviceToken', hexDeviceToken)
  const sanboxEndpoint = 'https://api.sandbox.push.apple.com:443/3/device/'
  const mainEndpoint = 'https://api.push.apple.com:443/3/device/'
  const pushEndpoints = isEmulator
    ? [sanboxEndpoint]
    : [mainEndpoint, sanboxEndpoint]

  const p8Key: P8Key = {
    keyId: 'Z8D473D947',
    teamId: 'NZG926X62F',
    privateKey,
  }

  const notification: IOSNotification = voip
    ? {
        aps: {
          alert: { body, title, subtitle },
        },
        ...data,
      }
    : {
        aps: {
          alert: { body, title, subtitle },
          sound: 'default',
          badge,
          category: 'message',
          'mutable-content': 1,
          'thread-id': threadId,
        },
        data,
      }
  try {
    const token = await jwt(p8Key)
    for (const pushEndpoint of pushEndpoints) {
      console.log({ url: pushEndpoint + hexDeviceToken, token, notification })
      const response = await sendPushRequest(
        pushEndpoint + hexDeviceToken,
        token,
        notification,
        env,
        voip,
      )
      console.log({ok: response.ok, body : await response.text()})
      logHeaders(response)
      if (response.ok) break
    }
  } catch (error) {
    console.error('Push notification error:', error)
  }
}
