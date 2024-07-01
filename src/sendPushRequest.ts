import { Env, IOSNotification } from './types'

export const sendPushRequest = async (
  url: string,
  jwt: string,
  notification: IOSNotification,
  { APNS_TOPIC }: Env,
): Promise<Response> => {
  console.log(notification)
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt,
      'apns-topic': APNS_TOPIC,
    },

    body: JSON.stringify(notification),
  })
}
