import { Button } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { palette } from '../../theme';

const AuthButton = ({loading, title, onPress, disabled}) => {
  const buttonStyle = disabled ? styles.disabledBtn : styles.activebtn;

  return (
    <View style={styles.container}>
      <Button
        disabled={disabled}
        onPress={onPress}
        buttonStyle={buttonStyle}
        title={title}
        loading={loading}
      />
    </View>
  );
};

export default AuthButton;

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
  },
  activebtn: {
    borderRadius: 4,
    backgroundColor: palette.primaryBlue,
  },
  disabledBtn: {
    opacity: 0.8,
    backgroundColor: palette.primaryBlue,
  },
});
