import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erro ao parsear usuário do localStorage:", e);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);
  const login = async (email, password) => {
    setLoading(true); 
    try {
      const response = await fetch(`http://localhost:3001/users?email=${email}`);
      const users = await response.json(); 

      if (users.length > 0) {
        const foundUser = users[0]; 
        if (foundUser.password === password) {
          setUser(foundUser); 
          localStorage.setItem('currentUser', JSON.stringify(foundUser));
          setLoading(false);
          return true; 
        }
      }
      setLoading(false); 
      return false;
    } catch (error) {
      console.error("Erro no login:", error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null); 
    localStorage.removeItem('currentUser'); 
  };

  const isUserAdmin = () => {
    return user && user.role === 'admin';
  };

  const authContextValue = {
    user, 
    isAuthenticated: !!user,
    loading, 
    login, 
    logout, 
    isAdmin: isUserAdmin, 
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};