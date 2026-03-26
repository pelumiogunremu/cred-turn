export interface Notification {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type?: 'invoice' | 'payment' | 'score';
  dataId?: string;
}

export const notificationService = {
  createNotification: (title: string, type: Notification['type'] = 'payment', dataId?: string): Notification => {
    return {
      id: `n-${Date.now()}`,
      title,
      time: 'Just now',
      read: false,
      type,
      dataId
    };
  }
};
