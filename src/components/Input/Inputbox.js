import {View, Text, StyleSheet} from 'react-native';
import {Input} from '@rneui/themed';
import React from 'react';
import { palette } from '../../theme';

const Inputbox = ({placeholder, value, errorMessage}) => {
  return (
    <View>
      <Input
      containerStyle={styles.container}
        inputContainerStyle={styles.inputsttyle}
        value={value}
        placeholder={placeholder}
        errorMessage={errorMessage}
      />
    </View>
  );
};

export default Inputbox;
const styles = StyleSheet.create({
  inputsttyle: {
    borderWidth: 0.5,
    borderRadius: 4,
    backgroundColor: palette.dullwhite
  },
  container:{
  }
});
