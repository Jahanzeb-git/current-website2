import { format } from 'date-fns';
import { isValid, parseISO } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  let validDate = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(validDate)) {
    return 'Invalid Date';
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (validDate >= today) {
    return format(validDate, 'HH:mm');
  } else if (validDate >= yesterday) {
    return 'Yesterday';
  } else {
    return format(validDate, 'MMM d');
  }
};

export const serializeDate = (date: Date | string): string => {
  const validDate = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(validDate.getTime())) {
    return 'Invalid Date';
  }

  return validDate.toISOString();
};

export const deserializeHistory = (historyString: string | null): HistoryItem[] => {
  if (!historyString) return [];
  return JSON.parse(historyString);
};
