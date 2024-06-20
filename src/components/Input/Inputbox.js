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
  rightIcon
}) => {
  return (
    <Input
      rightIcon={rightIcon}
      rightIconContainerStyle={{
        margin:8,
        justifyContent:'center',
      }}
      containerStyle={{}}
      inputContainerStyle={{
        borderRadius: 4,
        backgroundColor: palette.dullwhite,
        borderBottomWidth: 1,
        borderWidth: 1,
        margin: 0.5,
      }}
      inputStyle={{
        padding: 10,
        fontSize: 14,
      }}
      errorStyle={{
        textAlign: 'right',
        padding: 2,
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
