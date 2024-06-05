import { color, createTheme } from '@shopify/restyle';

export const palette = {
  primaryBlue: '#3797EF',
  mainwhite: '#ffffff',
  dullwhite: '#FAFAFA',
  lightgrey: '#767680',
  mainblack: '#000000',
  fadedblack: '#121212',
  darkgrey: '#262626',
};

export const FONT = {
  SFPro: {
    regular: 'SF_Pro_Text_Regular',
  },
  OpenSans: {
    regular: 'OpenSans-Regular',
    bold: 'OpenSans-Bold',
    medium: 'OpenSans-Medium',
    light: 'OpenSans-Light',
    italic: 'OpenSans-italic',
  },
};
export const theme = createTheme({
  colors: {
    primaryBlue: '#3797EF',
    mainwhite: '#ffffff',
    dullwhite: '#FAFAFA',
    lightgrey: '#767680',
    mainblack: '#000000',
    fadedblack: '#121212',
    darkgrey: '#262626',
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadii: {
    s: 4,
    m: 8,
    l: 16,
  },
  container:{
    flex: 1,
    padding: 16,

  },
  textVariants: {
    defaults: {
      fontSize: 16,

    },
    body: {
      fontSize: 16,

    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: FONT.OpenSans.regular
    },
    FBcnt:{
      fontSize: 14,
      color: 'primaryBlue',
      fontFamily: FONT.OpenSans.bold
    },
    Pass:{
      fontSize: 14,
      color: 'primaryBlue',
      fontFamily: FONT.OpenSans.bold
    },
    Linkcnt:{
      fontSize: 14,
      color: 'lightgrey',
      fontFamily: FONT.OpenSans.regular
    },
    Linktxt:{
      fontSize: 14,
      color: 'primaryBlue',
      fontFamily: FONT.OpenSans.regular
    },
    Footertxt:{
      fontSize: 12,
      color: 'lightgrey',
      fontFamily: FONT.OpenSans.regular
    }
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
});

export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    text: palette.mainwhite,
    primary: palette.primaryBlue,
    buttonBackground: palette.primaryBlue,
    buttonText: palette.mainwhite,
  },
  container: {
    flex: 1,
    backgroundColor: palette.mainblack,
  },
};

export const lightTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    text: palette.mainblack,
    primary: palette.primaryBlue,
    buttonBackground: palette.primaryBlue,
    buttonText: palette.mainwhite,
  },
  text:{
   color:'#000',
   fontFamily: FONT.OpenSans.regular
  },
  Linktxt:{
color: palette.primaryBlue
  },
  container: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    backgroundColor: palette.mainwhite,
  },
  FBAuth: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 10,
  },
};
