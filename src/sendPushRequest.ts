import { Env, IOSNotification } from './types'

export const sendPushRequest = async (
  url: string,
  jwt: string,
  notification: IOSNotification,
  { APNS_TOPIC }: Env,
  voip = false ,
  silent = false,
): Promise<Response> => {
  if (silent && voip) return new Response()
  const headers = voip
    ? {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwt,
        'apns-topic': `${APNS_TOPIC}.voip`,
        'apns-push-type': `voip`,
        'apns-priority': '10',
      }
    : {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwt,
        'apns-topic': APNS_TOPIC,
        ...(silent ? { 'apns-push-type': 'background', 'apns-priority': Math.round(Math.random()*2+8).toString(10) } : {'apns-priority': '10',  'apns-push-type': 'alert'}),
      }
  console.log(notification, {headers})
  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(notification),
  })
}
