import React from 'react';
import {Input} from '@rneui/themed';
import {Magnify} from '../../constants/assets';

const ChatSearch = ({value, onChangeText}) => {
  return (
    <Input
      onChangeText={onChangeText}
      inputStyle={{fontSize: 14}}
      leftIconContainerStyle={{
        padding: 6,
        margin: 6,
      }}
      inputContainerStyle={{
        marginVertical: 10,
        borderBottomWidth: 0,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 2,
        paddingHorizontal: 10,
      }}
      renderErrorMessage={false}
      containerStyle={{paddingVertical: 0}}
      value={value}
      leftIcon={<Magnify />}
      placeholder="Search"
    />
  );
};

export default ChatSearch;
