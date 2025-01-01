import { format } from 'date-fns';

export const formatDate = (date: Date): string => {
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date >= today) {
    return format(date, 'HH:mm');
  } else if (date >= yesterday) {
    return 'Yesterday';
  } else {
    return format(date, 'MMM d');
  }
};
