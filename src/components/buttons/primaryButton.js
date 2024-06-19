import {Button} from '@rneui/themed';
import {Box} from '../../theme';

export const PrimaryBtn = ({title, onPress}) => {
  return (
    <Button
      title={title}
      onPress={onPress}
      containerStyle={{
        borderRadius: 5,
        marginVertical: 6,
        flex:1
        }}
        titleStyle={{color: '#fff', fontSize:14}}
        buttonStyle={{
        backgroundColor: '#3797EF',
      }}
      />
  );
  };
  
  export const SecondaryBtn = ({title, onPress}) => {
      return (
          <Button
          title={title}
          onPress={onPress}
          containerStyle={{
            flex:1,
          borderRadius: 5,
        marginVertical: 6,
      }}
      titleStyle={{color: '#000'}}
      buttonStyle={{
        backgroundColor: '#EAEAF4',
      }}
    />
  );
};

export const ComboBtn = ({title, onPress}) => {
  return (
    <Box flexDirection="row" gap={'s'}>
      <PrimaryBtn title={title} onPress={onPress} />
      <SecondaryBtn title={title} onPress={onPress} />
    </Box>
  );
};
