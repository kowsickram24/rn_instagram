import {createTheme} from '@shopify/restyle';

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
    red: '#FF0000',
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
    xl: 24,
    xxl: 36,
    xxxl: 48,
  },
  container: {
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
      fontSize: 18,
      color: 'mainblack',
      fontWeight: 'bold',
    },
    FBcnt: {
      fontSize: 14,
      color: 'primaryBlue',
      fontFamily: FONT.OpenSans.bold,
    },
    Pass: {
      fontSize: 14,
      color: 'primaryBlue',
      fontFamily: FONT.OpenSans.bold,
    },
    Linkcnt: {
      fontSize: 14,
      color: 'lightgrey',
      fontFamily: FONT.OpenSans.regular,
    },
    Linktxt: {
      fontSize: 14,
      color: 'primaryBlue',
      fontFamily: FONT.OpenSans.regular,
    },
    Footertxt: {
      fontSize: 12,
      color: 'lightgrey',
      fontFamily: FONT.OpenSans.regular,
    },
    ProInfo: {
      fontSize: 14,
      color: 'mainblack',
    },
    ProCount: {
      fontSize: 18,
      color: 'mainblack',
    },
    userName: {
      fontSize: 16,
      color: 'mainblack',
    },
    Logout: {
      fontSize: 16,
      color: 'red',
    },
    Liked: {
      fontSize: 14,
      color: 'mainblack',
    },
    Desc: {
      fontSize: 14,
      color: 'mainblack',
    },
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
});
