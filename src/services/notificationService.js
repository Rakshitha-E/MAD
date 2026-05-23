import firestore from '@react-native-firebase/firestore';

export const createNotification = async (userId, notificationData) => {
  await firestore().collection('notifications').add({
    userId,
    ...notificationData,
    createdAt: firestore.FieldValue.serverTimestamp(),
    read: false,
  });
};

export const getNotificationsRealtime = (
  userId,
  callback,
  errorCallback = () => {},
) => {
  return firestore()
    .collection('notifications')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      snapshot => {
        const notifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        callback(notifications);
      },
      error => {
        console.log('getNotificationsRealtime error:', error);
        errorCallback(error);
      },
    );
};