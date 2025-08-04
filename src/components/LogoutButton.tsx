import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LogoutButton = () => {
  const navigate = useNavigate();
  const { clearSession, setUser } = useContext(AuthContext);  

  const handleLogout = async () => {
    try {
      // hit the PHP logout endpoint THROUGH the proxy
      await fetch('/api/Logout.php', {            
        method: 'POST',
        credentials: 'include',
      });

      // clear React state + any extras you stored
      setUser(null);                              
      localStorage.removeItem('userRole');
      localStorage.removeItem('sessionId');

      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
