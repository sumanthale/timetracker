import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  createdAt: string;
  lastLogin: string;
  role: "user" | "admin"; // Extend roles as needed
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);

    // // Update last login
    // const userRef = doc(db, 'users', result.user.uid);
    // await setDoc(userRef, {
    //   lastLogin: new Date().toISOString()
    // }, { merge: true });
  };

  const register = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Update the user's display name
    await updateProfile(result.user, {
      displayName: fullName,
    });

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: result.user.uid,
      email: result.user.email!,
      fullName,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      role: "user", // Default role
    };

    await setDoc(doc(db, "users", result.user.uid), userProfile);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const fetchUserProfile = async (user: User) => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
