export interface Message {
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: Date;
}
