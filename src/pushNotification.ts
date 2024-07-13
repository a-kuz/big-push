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
  const isSandBox = hexDeviceToken.length > 65
  console.log('hexDeviceToken', hexDeviceToken)
  const pushEndpoint = isSandBox
    ? 'https://api.sandbox.push.apple.com:443/3/device/'
    : 'https://api.push.apple.com:443/3/device/'

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
          'thread-id': threadId,
        },
        data,
      }
  try {
    const token = await jwt(p8Key)
    const response = await sendPushRequest(
      pushEndpoint + base64ToHex(deviceToken),
      token,
      notification,
      env,
      voip,
    )
    logHeaders(response)
  } catch (error) {
    console.error('Push notification error:', error)
  }
}
