import {createTheme} from '@shopify/restyle';
import {StyleSheet} from 'react-native';

const palette = {
  primaryBlue: '#3797EF',
  white: '#ffffff',
  black: '#262626',
};

const theme = createTheme({
  colors: {
    primary: palette.primaryBlue,
    darkbg: palette.black,
    lightbg: palette.white,
    text: palette.black,
    buttonBackground: palette.primaryBlue,
    buttonText: palette.white,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  radii: {
    s: 4,
    m: 8,
    l: 16,
  },
  textVariants: {
    defaults: {
      fontSize: 16,
      color: 'text',
    },
    body: {
      fontSize: 16,
      color: 'text',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'text',
    },
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
});

export default theme;





export const DarkTheme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});

export const LightTheme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
  },
});
