import { useNetInfo } from '@react-native-community/netinfo';
import React, { createContext, useEffect, useState } from 'react';

export const NetworkContext = createContext({
  isConnected: false,
  setIsConnected: () => null,
});

const NetworkProvider = ({children}) => {
  const [isConnected, setIsConnected] = useState(false);
  const netInfo = useNetInfo();

  useEffect(() => {
    setIsConnected(netInfo.isConnected || netInfo.isInternetReachable);
  }, [netInfo]);

  return (
    <NetworkContext.Provider value={{isConnected, setIsConnected}}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
