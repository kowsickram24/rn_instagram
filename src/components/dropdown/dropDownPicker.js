import {Dropdown} from 'react-native-element-dropdown';
import {Box, Text} from '../../theme';
const DropdownComponent = ({
  data,
  value,
  onChange,
  Left_icon,
  placeholder,
  searchPlaceholder,
  search,
  label,
}) => {
  return (
    <Box paddingHorizontal={'m'}>
      <Text textAlign="left" fontSize={12}>
        {label}
      </Text>
      <Dropdown
        data={data}
        style={{
          height: 50,
        }}
        containerStyle={{
          width: '70%',
          borderWidth: 0,
          borderColor: 'black',
          backgroundColor: '#fff',
          elevation: 2,
        }}
        itemTextStyle={{color: 'black', fontSize: 14}}
        selectedTextStyle={{color: 'black', fontSize: 14}}
        iconColor="black"
        placeholderStyle={{color: 'black'}}
        renderLeftIcon={() => <>{Left_icon}</>}
        search={search}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        value={value}
        onChange={onChange}
      />
    </Box>
  );
};

export default DropdownComponent;
