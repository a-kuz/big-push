export interface Env {
  readonly PUSH_QUEUE: Queue
  readonly P8: string
	readonly APNS_TOPIC: string;
	readonly SANDBOX: boolean;
}

export interface P8Key {
  keyId: string
  teamId: string
  privateKey: string
}

export interface IOSNotification {
  aps: {
    alert?: {
      title?: string;
      subtitle?: string;
      body?: string;
			'title-loc-key'?: string;
      'title-loc-args'?: string[];
      'action-loc-key'?: string;
      'loc-key'?: string;
      'loc-args'?: string[];
    };
    
    sound?: string;
    badge?: number;
    category?: string;
    'mutable-content'?: number;
    'content-available'?: number;
    'thread-id'?: string;
    'target-content-id'?: string;
    'interruption-level'?: 'active' | 'passive' | 'time-sensitive' | 'critical';
    'relevance-score'?: number;
    'filter-criteria'?: string;
  };
  "custom-data-key"?: string,
  data?: Record<string, any>;
  'collapse-id'?: string;
  'priority'?: 'high' | 'normal';
  'expiration'?: number;
  'apns-id'?: string;
  'apns-topic'?: string;
}


export interface NewMessageEvent {
  chatId: string
  callId?: string
  sender?: string
  message?: string
  timestamp?: number

  messageId: number
  clientMessageId: string
  missed: number

  uid?: number
  token?: string
  appId?: string
  
}

export interface QMessage {
  event: NewMessageEvent
  title: string
  body: string
  deviceToken: string
  badge?: number
  subtitle?: string
  sound?: string
  category?: 'message'
  threadId?: string
  voip: boolean
}
