import { Env, IOSNotification } from './types'

export const sendPushRequest = async (
  url: string,
  jwt: string,
  notification: IOSNotification,
  { APNS_TOPIC }: Env,
  voip?: boolean,
  deviceToken?: string
): Promise<Response> => {
  const headers = voip ? {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + jwt,
    'apns-topic': `${APNS_TOPIC}.voip`,
    'apns-push-type': `voip`,
    'apns-priority': 10
  }
    : {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt,
      'apns-topic': APNS_TOPIC,
    };
  console.log(notification)
  return fetch(url, {
    method: 'POST',
    //@ts-ignore
    headers,
    body: JSON.stringify(notification),
  })
}
