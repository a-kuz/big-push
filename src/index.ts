import { formatPrivateKey } from './formatPrivateKey'
import { pushNotification } from './pushNotification'
import { Env, QMessage } from './types'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'POST') {
      const message = await request.json() as QMessage

      const { event, deviceToken, body, title, subtitle, badge, threadId, voip } = message
      const privateKey = formatPrivateKey(env.P8)
      await pushNotification(
        deviceToken,
        privateKey,
        event,
        body,
        env,
        title,
        subtitle,
        badge,
        threadId,
        voip,
      )
      // console.log(`Received message: ${message.text}`);
      return new Response('Message received')
    }
    return new Response('Hello, World!')
  },
  async queue(batch, env, ctx): Promise<void> {

    const privateKey = formatPrivateKey(env.P8)

    for (const message of batch.messages) {
      const { event, deviceToken, body, title, subtitle, badge, threadId, voip } = message.body

      try {
        await pushNotification(
          deviceToken,
          privateKey,
          event,
          body,
          env,
          title,
          subtitle,
          badge,
          threadId,
          voip,
        )

        //await silentPush(deviceToken, privateKey, env)

        message.ack()
      } catch (error) {
        console.error('Failed to push notification:', error)
      }
    }
  },
} satisfies ExportedHandler<Env, QMessage>
