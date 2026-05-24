import React, {createContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let profileUnsubscribe = null;

    const unsubscribeAuth = auth().onAuthStateChanged(currentUser => {
      if (profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }

      if (currentUser) {
        const profileRef = firestore()
          .collection('users')
          .doc(currentUser.uid);

        setUser(currentUser);
        profileUnsubscribe = profileRef.onSnapshot(
          snapshot => {
            if (snapshot?.exists) {
              setProfile(snapshot.data());
            } else {
              // Fallback profile when Firestore doc is missing so UI shows sensible values
              const fallbackName =
                currentUser.displayName || currentUser.email?.split('@')[0] || 'FairWork User';
              setProfile({
                name: fallbackName,
                email: currentUser.email,
                role: 'user',
              });
            }
            setLoading(false);
          },
          error => {
            console.log('Profile snapshot error:', error);
            const fallbackName =
              currentUser.displayName || currentUser.email?.split('@')[0] || 'FairWork User';
            setProfile({
              name: fallbackName,
              email: currentUser.email,
              role: 'user',
            });
            setLoading(false);
          },
        );
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;