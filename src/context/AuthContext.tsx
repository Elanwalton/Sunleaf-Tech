// AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';

interface UserData {
  id: number | null;
  email: string | null;
}

interface AuthContextProps {
  userRole: string | null;
  setUserRole: (role: string | null) => void;
  isLoading: boolean;
  userData: UserData;
}

export const AuthContext = createContext<AuthContextProps>({
  userRole: null,
  setUserRole: () => {},
  isLoading: true,
  userData: { id: null, email: null },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({ id: null, email: null });
  const [isLoading, setIsLoading] = useState(true);

  const verifySession = async () => {
    try {
      const response = await fetch('http://localhost/Sunleaf-Tech/api/getUserRole.php', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Session verification failed');
      }

      if (data.authenticated) {
        setUserRole(data.user.role);
        setUserData({
          id: data.user.id,
          email: data.user.email
        });
      }
    } catch (error) {
      console.error('Session error:', error);
      setUserRole(null);
      setUserData({ id: null, email: null });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifySession();
  }, []);

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, isLoading, userData }}>
      {children}
    </AuthContext.Provider>
  );
};