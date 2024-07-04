import React from 'react';
import { Box, Text } from '../../../../theme';

const TagsView = ({user}) => {
  return (
    <Box
      backgroundColor={'mainwhite'}
      flex={1}
      justifyContent="center"
      alignItems="center">
      <Text>No Tags Yet</Text>
    </Box>
  );
};

export default TagsView;
