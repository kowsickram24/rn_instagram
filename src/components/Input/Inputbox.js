import {View, StyleSheet} from 'react-native';
import {Input} from '@rneui/themed';
import React from 'react';
import {palette} from '../../theme';

const Inputbox = ({
  placeholder,
  value,
  errorMessage,
  onChangeText,
  onBlur,
  secureTextEntry,
}) => {
  return (
    <Input
      containerStyle={styles.container}
      inputContainerStyle={styles.inputstyle}
      value={value}
      placeholder={placeholder}
      errorMessage={errorMessage}
      onChangeText={onChangeText}
      onBlur={onBlur}
      secureTextEntry={secureTextEntry}
    />
  );
};

export default Inputbox;

const styles = StyleSheet.create({
  inputstyle: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderStyle:'dashed',
    backgroundColor: palette.dullwhite,
  },
  container: {},
});
