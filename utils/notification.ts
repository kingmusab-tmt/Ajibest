interface Notification {
  id: number;
  message: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  // Replace with actual API call
  return [
    { id: 1, message: "Notification 1" },
    { id: 2, message: "Notification 2" },
    // More notifications...
  ];
};
