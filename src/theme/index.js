import {backgroundColor, color, createTheme} from '@shopify/restyle';
import {createBox, createText} from '@shopify/restyle';
import {Dimensions} from 'react-native';
export const {width, height} = Dimensions.get('screen');
export const Box = createBox();
export const Text = createText();

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
    lightgrey: '#F3F3F3',
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
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
});

export const CHATTHEME = {
  BLUE: {
    color: '#3797EF',
    backgroundColor: 'lightblue',
  },
  GREEN: {
    color: 'lightgreen',
    backgroundColor: 'green',
  },
};
