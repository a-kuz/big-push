import { Env, QMessage } from './types'
import { formatPrivateKey } from './formatPrivateKey'
import { pushNotification } from './pushNotification'

export default {
  async queue(batch, env): Promise<void> {
    const privateKey = formatPrivateKey(env.P8)

    for (const message of batch.messages) {
      const { event, deviceToken, body, title, subtitle, badge, threadId } = message.body

      try {
				console.log(JSON.stringify(message))
        await pushNotification(deviceToken, privateKey, event, body, title, subtitle, badge, threadId, env)
        message.ack()
      } catch (error) {
        console.error('Failed to push notification:', error)
      }
    }
  },
} satisfies ExportedHandler<Env, QMessage>
