// DataContext.js
import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [notificationCount, setNotificationCount] = useState(0);
  const [friendRequestCount, setFriendRequestCount] = useState(0);

  return (
    <DataContext.Provider value={{ notificationCount, setNotificationCount, friendRequestCount, setFriendRequestCount }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
