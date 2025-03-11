import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create context
const AuthContext = createContext();

/**
 * AuthProvider component that manages authentication state
 * @param {Object} props - Component properties
 * @returns {JSX.Element} Auth context provider
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if token exists and load mock user data
  useEffect(() => {
    const validateToken = () => {
      if (token) {
        // Mock user data
        setUser({
          id: 1,
          name: 'Admin Usuario',
          email: 'admin@pestcontrol.com',
          role: 'admin',
          phone: '+34 612 345 678',
          position: 'Administrador Sistema',
          createdAt: '2024-01-15T10:30:00Z',
          lastLogin: '2025-03-10T08:15:00Z'
        });
      }
      
      setLoading(false);
    };

    validateToken();
  }, [token]);

  /**
   * Login function that authenticates user and stores token
   * @param {Object} credentials - User credentials (email, password)
   * @returns {Promise} Login result promise
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Check for demo credentials
      if (credentials.email === 'admin@pestcontrol.com' || credentials.email === 'demo') {
        // Generate mock token
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        // Store token in localStorage and state
        localStorage.setItem('token', mockToken);
        setToken(mockToken);
        
        // Set user data
        const mockUser = {
          id: 1,
          name: 'Admin Usuario',
          email: 'admin@pestcontrol.com',
          role: 'admin',
          phone: '+34 612 345 678',
          position: 'Administrador Sistema',
          createdAt: '2024-01-15T10:30:00Z',
          lastLogin: new Date().toISOString()
        };
        
        setUser(mockUser);
        
        return { success: true };
      } else {
        // For demo purposes, any other credentials will also work
        const mockToken = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('token', mockToken);
        setToken(mockToken);
        
        // Create user with technician role
        const mockUser = {
          id: 2,
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: 'technician',
          phone: '+34 698 765 432',
          position: 'Técnico',
          createdAt: '2024-05-20T14:45:00Z',
          lastLogin: new Date().toISOString()
        };
        
        setUser(mockUser);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Authentication failed'
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout function that clears user session
   */
  const logout = () => {
    // Remove token from localStorage and state
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    
    // Redirect to login page
    navigate('/login');
  };

  /**
   * Check if user has specified role
   * @param {String|Array} roles - Required role(s)
   * @returns {Boolean} Whether user has required role
   */
  const hasRole = (roles) => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.some(role => user.role === role);
    }
    
    return user.role === roles;
  };

  // Create context value object
  const contextValue = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
