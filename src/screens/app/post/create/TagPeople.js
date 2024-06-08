import {Button, Input} from '@rneui/themed';
import {createBox, createText} from '@shopify/restyle';
import React from 'react';
import {Tag_Ppl} from '../../../../constants/assets';
const Box = createBox();
const Text = createText();
const TagPeople = () => {
  return (
    <Box flex={1} padding={'m'} backgroundColor={'mainwhite'}>
      <Text fontSize={18} color={'mainblack'}>
        Tag People
      </Text>
      <Input leftIcon={<Tag_Ppl />} placeholder="Tag people" />
      <Button
        containerStyle={{
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
        buttonStyle={{
          borderRadius: 5,
        }}
        title={'Continue'}
      />
    </Box>
  );
};

export default TagPeople;
