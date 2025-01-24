// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  getFirestore 
} from 'firebase/firestore';

const db = getFirestore();
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Helper function for creating user profile in Firestore
  async function createUserProfile(uid, data) {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, data, { merge: true });
  }

  async function signup(email, password, name) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await createUserProfile(result.user.uid, { displayName: name, email });
    return result;
  }

  async function googleSignIn() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await createUserProfile(result.user.uid, {
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL
    });
    return result;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function updateUserProfile(profileData) {
    if (!currentUser) throw new Error('No user logged in');

    await updateProfile(currentUser, {
      displayName: profileData.displayName,
      photoURL: profileData.photoURL
    });

    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: new Date()
    });

    setUserProfile(prevProfile => ({
      ...prevProfile,
      ...profileData
    }));
  }

  async function updateUserEmail(email) {
    if (!currentUser) throw new Error('No user logged in');
    await updateEmail(currentUser, email);
    await updateDoc(doc(db, 'users', currentUser.uid), { email });
  }

  async function updateUserPassword(newPassword) {
    if (!currentUser) throw new Error('No user logged in');
    return updatePassword(currentUser, newPassword);
  }

  async function fetchUserProfile() {
    if (!currentUser) return null;
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const profileData = userSnap.data();
      setUserProfile(profileData);
      return profileData;
    }
    return null;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile();
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    googleSignIn,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}