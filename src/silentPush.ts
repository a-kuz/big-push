import { P8Key, IOSNotification, NewMessageEvent, Env } from './types'
import { jwt } from './generateJWT'
import { base64ToHex } from './base64ToHex'
import { sendPushRequest } from './sendPushRequest'
import { logHeaders } from './logHeaders'

export const silentPush = async (deviceToken: string, privateKey: string, env: Env) => {
  const pushEndpoint = 'https://api.push.apple.com:443/3/device/'
  const sandboxPushEndpoint = 'https://api.sandbox.push.apple.com:443/3/device/'
  const p8Key: P8Key = {
    keyId: 'Z8D473D947',
    teamId: 'NZG926X62F',
    privateKey,
  }

  const notification: IOSNotification = {
    aps: {
      'content-available': 1,
    },
    data: { chatId: crypto.randomUUID() },
  }
  try {
    const token = await jwt(p8Key)
    const response = await sendPushRequest(
      pushEndpoint + base64ToHex(deviceToken),
      token,
      notification,
      env,
      false,
      true,
    )
    console.log(base64ToHex(deviceToken))
    logHeaders(response)
    if (!response.ok && env.SANDBOX) {
      console.log('try sandbox')
      try {
        const sandboxResponse = await sendPushRequest(
          sandboxPushEndpoint + base64ToHex(deviceToken),
          token,
          notification,
          env,
          false,
          true,
        )
        logHeaders(sandboxResponse)
        
        if (!sandboxResponse.ok) {
          for (const h of response.headers.entries()) console.log(h[0], h[1])
          return
        } else {
          for (const h of response.headers.entries()) console.log(h[0], h[1])

          console.log('Push notification sent to sandbox')
          return
        }
      } catch (error) {
        console.error('Push notification error:', error)
        return
      }
    } else {
      console.log('Push notification sent')
          return
    }
  } catch (error) {
    console.error('Push notification error:', error)
    return
  }
}
