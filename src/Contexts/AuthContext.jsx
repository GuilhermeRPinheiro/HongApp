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
      // AQUI: A requisição para o login deve apontar para o JSON Server (porta 3000)
      const response = await fetch(`http://localhost:3000/users?email=${email}`); 

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na rede ou servidor (login): ${response.status} ${response.statusText}. Detalhes: ${errorText}`);
      }

      const users = await response.json(); 

      if (users.length > 0) {
        const foundUser = users[0]; 
        if (foundUser.password === password) { // Validação de senha no frontend
          setUser(foundUser); 
          localStorage.setItem('currentUser', JSON.stringify(foundUser));
          setLoading(false);
          return true; 
        }
      }
      setLoading(false); 
      return false;
    } catch (error) {
      console.error("ERRO COMPLETO NO LOGIN:", error);
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