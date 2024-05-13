export interface Env {
  readonly PUSH_QUEUE: Queue
  readonly P8: string
}

export interface P8Key {
  keyId: string
  teamId: string
  privateKey: string
}

export interface IOSNotification {
  aps: {
    alert: {
      title?: string
      body: string
    }
    sound?: string
    badge?: number
    category?: string
    'mutable-content'?: number
  }
  data?: Record<string, any>
}

export interface NewMessageEvent {
  chatId: string
  sender?: string
  message?: string
  timestamp?: number

  messageId: number
  clientMessageId: string
  missed: number
}

export interface Message {
  event: NewMessageEvent
  aps: { title: string; body: string }
  deviceToken: string
}
