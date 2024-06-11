import {createBox, createText} from '@shopify/restyle';
import React, {useState} from 'react';
import ReachTab from '../../../navigation/TopTab/ReachTab';
import {Back} from '../../../constants/assets';
import {TouchableOpacity} from 'react-native';
const Box = createBox();
const Text = createText();

const AccountReach = ({navigation}) => {
  return (
    <Box backgroundColor={'mainwhite'} flex={1}>
      <Box flexDirection="row" padding={'m'} gap={'m'} alignItems="center">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Back />
        </TouchableOpacity>
        <Text color={'mainblack'}>{'Username'}</Text>
      </Box>
      <ReachTab />
    </Box>
  );
};

export default AccountReach;
