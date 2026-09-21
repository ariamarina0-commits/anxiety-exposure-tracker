import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  getCurrentUser,
  getToken,
  login as loginRequest,
  removeToken,
  saveToken,
  type CurrentUser,
} from '../services/authService';

type AuthContextType = {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener(
      'auth:unauthorized',
      handleUnauthorized
    );

    const restoreSession = async () => {
      const token = getToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        removeToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();

    return () => {
      window.removeEventListener(
        'auth:unauthorized',
        handleUnauthorized
      );
    };
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<void> => {
    const response = await loginRequest({
      email,
      password,
    });

    saveToken(response.token);

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      removeToken();
      setUser(null);
      throw error;
    }
  };

  const logout = (): void => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider.'
    );
  }

  return context;
}