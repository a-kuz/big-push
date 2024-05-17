import { IOSNotification } from './types'

export const sendPushRequest = async (
  url: string,
  jwt: string,
  notification: IOSNotification,
): Promise<Response> => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt,
      'apns-topic': 'com.k2fintech.big-messenger-dev',
    },
    body: JSON.stringify(notification),
  })
}
