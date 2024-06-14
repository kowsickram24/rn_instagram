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
      containerStyle={{}}
      inputContainerStyle={{
        borderRadius: 4,
        backgroundColor: palette.dullwhite,
        borderBottomWidth: 1,
        borderWidth: 1,
        margin:0.5
      }}
      inputStyle={{
        padding: 10,
      }}
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
