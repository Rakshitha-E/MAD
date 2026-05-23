import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin@123';

export const isAdminCredential = (email, password) =>
  email?.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;

export const signupUser = async (
  name,
  email,
  password,
  role,
) => {
  try {
    if (role === 'admin' && !isAdminCredential(email, password)) {
      throw new Error('Admin signup requires admin@gmail.com and password admin@123.');
    }

    const response = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );

    await firestore()
      .collection('users')
      .doc(response.user.uid)
      .set({
        name,
        email,
        role,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    return response.user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await auth().signInWithEmailAndPassword(
      email,
      password,
    );

    return response.user;
  } catch (error) {
    throw error;
  }
};

export const createUserProfile = async ({uid, name, email, role}) => {
  await firestore().collection('users').doc(uid).set({
    name,
    email,
    role,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const logoutUser = async () => {
  await auth().signOut();
};

export const getUserProfile = async uid => {
  const doc = await firestore().collection('users').doc(uid).get();
  return doc.exists ? doc.data() : null;
};

export const getUsersRealtime = (
  callback,
  errorCallback = () => {},
) => {
  return firestore()
    .collection('users')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      snapshot => {
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(users);
      },
      error => {
        console.log('getUsersRealtime error:', error);
        errorCallback(error);
      },
    );
};

export const updateUserRole = async (userId, role) => {
  await firestore().collection('users').doc(userId).update({
    role,
  });
};