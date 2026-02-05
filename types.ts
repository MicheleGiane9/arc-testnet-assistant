
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: string;
  content?: string;
}

export enum TutorialCategory {
  SWAP = 'swap',
  BRIDGE = 'bridge',
  STAKE = 'stake',
  FAUCET = 'faucet',
  WALLET = 'wallet'
}
