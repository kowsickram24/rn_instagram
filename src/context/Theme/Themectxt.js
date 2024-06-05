import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {useColorScheme} from 'react-native';
const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const scheme = useColorScheme();
  const [theme, setTheme] = useState(scheme);

  // useEffect(() => {
  //     setTheme(scheme);
  //   },[scheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(() => ({theme, toggleTheme}), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
