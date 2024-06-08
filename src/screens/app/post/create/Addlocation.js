import {createBox, createText} from '@shopify/restyle';
import React, {useState} from 'react';
import {Button, Input} from '@rneui/themed';
import {Loc} from '../../../../constants/assets';

const Box = createBox();
const Text = createText();

const Addlocation = ({navigation}) => {
  const [location, setLocation] = useState('');

  const handleAddLocation = () => {
    console.log(location);
    navigation.navigate('NewPost', {location});
  };

  return (
    <Box flex={1} padding={'m'} backgroundColor={'mainwhite'}>
      <Text fontSize={18} color={'mainblack'}>
        Add Location
      </Text>
      <Input
        leftIcon={<Loc />}
        placeholder="location"
        value={location}
        onChangeText={setLocation}
      />
      <Button
        onPress={handleAddLocation}
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

export default Addlocation;
