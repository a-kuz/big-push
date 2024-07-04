import { P8Key, IOSNotification, NewMessageEvent, Env } from './types'
import { generateJWT } from './generateJWT'
import { base64ToHex } from './base64ToHex'
import { sendPushRequest } from './sendPushRequest'

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
  voip?: boolean
) => {
  const pushEndpoint = 'https://api.push.apple.com:443/3/device/'
  const sandboxPushEndpoint = 'https://api.sandbox.push.apple.com:443/3/device/'
  const p8Key: P8Key = {
    keyId: 'Z8D473D947',
    teamId: 'NZG926X62F',
    privateKey,
  }

  const notification: IOSNotification = voip ? {
    aps: {
      alert: { body, title, subtitle }
    },
    ...data
  } : {
    aps: {
      alert: { body, title, subtitle },
      sound: 'default',
      badge,
      category: 'message',
      'mutable-content': 1,
      'content-available': 1,
      'thread-id': threadId
    },
    data,
  }
  try {
    const jwt = await generateJWT(p8Key);
    const response = await sendPushRequest(
      pushEndpoint + base64ToHex(deviceToken),
      jwt,
      notification,
      env,
      voip
    )
    if (!response.ok && env.SANDBOX) {
      try {
        const sandboxResponse = await sendPushRequest(
          sandboxPushEndpoint + base64ToHex(deviceToken),
          jwt,
          notification,
          env,
          voip
        )

        if (!sandboxResponse.ok) {
          throw new Error(`Push request failed with status: ${response.status}`)
        } else {
          for (const h of response.headers.entries()) console.log(h[0], h[1])

          console.log('Push notification sent')
        }
      } catch (error) {
        console.error('Push notification error:', error)
      }
    }
  } catch (error) {
    console.error('Push notification error:', error)
  }
}
