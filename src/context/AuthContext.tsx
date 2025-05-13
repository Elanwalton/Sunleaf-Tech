import React, { createContext, useState, useEffect } from 'react';

interface AuthContextProps {
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  userRole: null,
  setUserRole: () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('http://localhost/Sunleaf-Tech/api/getUserRole.php', {
          credentials: 'include',
        });
        const data = await response.json();

        if (data.role) {
          setUserRole(data.role);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

