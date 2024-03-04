// UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  const setUser = (userData) => {
    setUsername(userData.username);
    setUserId(userData.userId);
  };
  

  return (
    <UserContext.Provider value={{ username, userId, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
