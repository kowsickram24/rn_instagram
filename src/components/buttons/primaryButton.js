import { Button } from '@rneui/themed';

export const PrimaryBtn = ({title, onPress}) => {
  return (
    <Button
      title={title}
      onPress={onPress}
      containerStyle={{
        borderRadius: 5,
        marginVertical: 6,
        flex: 1,
      }}
      titleStyle={{color: '#fff', fontSize: 14}}
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
        flex: 1,
        borderRadius: 5,
        marginVertical: 6,
      }}
      titleStyle={{color: '#000', fontSize: 14}}
      buttonStyle={{
        backgroundColor: '#EAEAF4',
      }}
    />
  );
};


