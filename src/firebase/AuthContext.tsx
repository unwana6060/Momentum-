import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
} from 'firebase/auth';
import { auth, db } from './config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './errorHandler';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null; // Added error state
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
  signInGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  registerWithEmail: async () => {},
  signInGuest: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for redirect result on load
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log('Redirect result:', result);
        }
      })
      .catch((error) => {
        console.error('Error handling redirect result', error);
        if (error.code === 'auth/unauthorized-domain') {
          const currentDomain = window.location.hostname;
          setError(`Domain Unauthorized: Please add '${currentDomain}' to your Firebase Console > Auth > Settings > Authorized Domains. This is required for Vercel and APK deployments.`);
        } else {
          setError(error.message);
        }
      });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.email === 'unwanaotung@gmail.com');
      
      if (currentUser) {
        // Check if user document exists, if not create it
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              email: currentUser.email,
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
              photoURL: currentUser.photoURL || '',
              theme: 'system',
              xp: 0,
              level: 1,
              longestStreak: 0,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // Reverting to signInWithPopup as the primary method, even on mobile.
    // Redirect often fails in WebViews/partitioned storage (like APKs) due to state loss.
    
    try {
      setError(null);
      await signInWithPopup(auth, provider);
    } catch (popupError: any) {
      console.warn('Popup login failed, trying redirect...', popupError);
      
      // If popup was blocked or failed, try redirect as fallback
      if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/cancelled-popup-request') {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
          console.error('Redirect sign-in failed', redirectError);
          setError(redirectError.message);
          throw redirectError;
        }
      } else {
        setError(popupError.message);
        throw popupError;
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error('Error signing in with Email', error);
      throw error;
    }
  };

  const registerWithEmail = async (email: string, pass: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error('Error registering with Email', error);
      throw error;
    }
  };

  const signInGuest = async () => {
    try {
      setError(null);
      await signInAnonymously(auth);
    } catch (error: any) {
      console.error('Error signing in as Guest', error);
      setError(error.message || 'Guest Sign-In failed');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, error, signInWithGoogle, signInWithEmail, registerWithEmail, signInGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
