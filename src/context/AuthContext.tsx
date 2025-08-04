// context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  PropsWithChildren,
} from 'react';

interface User {
  id: number;
  email: string;
  role: string;
  firstName:string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  lastVerified: number | null;
}

interface VerifyResponse {
  authenticated: boolean;
  user?: User;
  message?: string;
}

interface AuthContextProps extends AuthState {
  isAuthenticated: boolean;
  userRole: string | null;               // ←  exposed for route guards
  setUser: (user: User | null) => void;
  setUserRole: (role: string) => void;
  refreshSession: () => Promise<boolean>;
  clearSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
}

const API = import.meta.env.VITE_API_BASE_URL ?? '/api';
const VERIFY = `${API}/verifySession.php`;
const LOGIN  = `${API}/Login.php`;
const LOGOUT = `${API}/Logout.php`;

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    lastVerified: null,
  });

  const verifySession = useCallback(async (): Promise<boolean> => {
    setState(p => ({ ...p, isLoading: true, error: null }));
    try {
      const res = await fetch(VERIFY, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data: VerifyResponse = await res.json();
      if (data.authenticated && data.user) {
        setState({
          user: data.user,
          isLoading: false,
          error: null,
          lastVerified: Date.now(),
        });
        return true;
      }
      throw new Error(data.message ?? 'Not authenticated');
    } catch (err) {
      setState({
        user: null,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Auth failed',
        lastVerified: null,
      });
      return false;
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setState(p => ({ ...p, isLoading: true, error: null }));
      const res = await fetch(LOGIN, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data: VerifyResponse = await res.json();
      if (!res.ok || !data.authenticated) {
        throw new Error(data.message ?? `Login failed: ${res.status}`);
      }
      await verifySession();
    },
    [verifySession],
  );

  const clearSession = useCallback(async () => {
    try {
      await fetch(LOGOUT, { method: 'POST', credentials: 'include' });
    } finally {
      setState({ user: null, isLoading: false, error: null, lastVerified: null });
    }
  }, []);

  useEffect(() => { verifySession(); }, [verifySession]);

  useEffect(() => {
    const t = setInterval(() => {
      if (state.user && state.lastVerified &&
          Date.now() - state.lastVerified > 4 * 60_000) {
        verifySession();
      }
    }, 60_000);
    return () => clearInterval(t);
  }, [state.user, state.lastVerified, verifySession]);

  const value = useMemo<AuthContextProps>(() => ({
    ...state,
    isAuthenticated: !!state.user,
    userRole: state.user?.role ?? null,          // ←  easy access
    setUser: (user: User | null) => setState(p => ({ ...p, user })),
    setUserRole: (role: string) =>
      setState(p => (p.user ? { ...p, user: { ...p.user, role } } : p)),
    refreshSession: verifySession,
    clearSession,
    login,
  }), [state, verifySession, clearSession, login]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
