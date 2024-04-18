// UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [userEmail,setUserEmail] = useState('');

  const setUser = (userData) => {
    setUsername(userData.username);
    setUserId(userData.userId);
    setUserEmail(userData.userEmail);
  };
  

  return (
    <UserContext.Provider value={{ username, userId,userEmail, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
