import { P8Key, IOSNotification, NewMessageEvent } from './types'
import { generateJWT } from './generateJWT'
import { base64ToHex } from './base64ToHex'
import { sendPushRequest } from './sendPushRequest'

export const pushNotification = async (
  deviceToken: string,
  privateKey: string,
  data: NewMessageEvent,
  body: string,
  title?: string,
) => {
  const pushEndpoint = 'https://api.push.apple.com/3/device/'
  const p8Key: P8Key = {
    keyId: 'Z8D473D947',
    teamId: 'NZG926X62F',
    privateKey,
  }

  const notification: IOSNotification = {
    aps: {
      alert: { body, title },
      sound: 'default',
      badge: 1,
    },
    data,
  }

  try {
    const jwt = await generateJWT(p8Key)
    const response = await sendPushRequest(
      pushEndpoint + base64ToHex(deviceToken),
      jwt,
      notification,
    )

    if (!response.ok) {
      throw new Error(`Push request failed with status: ${response.status}`)
    }
  } catch (error) {
    console.error('Push notification error:', error)
  }
}
