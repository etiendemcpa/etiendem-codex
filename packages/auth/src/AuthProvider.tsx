import {
  type FirebaseApp,
  getApp,
  getApps,
  initializeApp,
  type FirebaseOptions,
} from "firebase/app";
import {
  type Auth,
  getAuth,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
  firebaseConfig: FirebaseOptions;
  appName?: string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getFirebaseApp = (
  firebaseConfig: FirebaseOptions,
  appName?: string,
): FirebaseApp => {
  if (appName) {
    const existingNamedApp = getApps().find((app) => app.name === appName);
    return existingNamedApp ?? initializeApp(firebaseConfig, appName);
  }

  return getApps().length ? getApp() : initializeApp(firebaseConfig);
};

const getFirebaseAuth = (
  firebaseConfig: FirebaseOptions,
  appName?: string,
): Auth => {
  const app = getFirebaseApp(firebaseConfig, appName);
  return getAuth(app);
};

export const AuthProvider = ({
  children,
  firebaseConfig,
  appName,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const auth = useMemo(
    () => getFirebaseAuth(firebaseConfig, appName),
    [firebaseConfig, appName],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const value = useMemo(
    () => ({
      user,
      loading,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
