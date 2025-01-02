export interface Message {
  type: 'user' | 'bot';
  text: string;
  timestamp: string; // Store as ISO string for serialization
}

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: string; // Store as ISO string for serialization
}
