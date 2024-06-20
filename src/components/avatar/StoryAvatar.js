import {Avatar, Skeleton} from '@rneui/themed';
import {Box} from '../../theme';
import {useState, useEffect} from 'react';

const StoryAvatar = ({source}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [source]);

  return (
    <>
      {loading ? (
        <Box marginLeft={'s'}> 
          <Skeleton
            animation="pulse"
            style={{borderRadius: 24}}
            width={48}
            height={48}
          />
        </Box>
      ) : (
        <Box marginLeft={'s'}>
          <Avatar
            containerStyle={{borderWidth: 2, borderColor: 'darkviolet'}}
            source={{uri: source}}
            size="medium"
            rounded
          />
        </Box>
      )}
    </>
  );
};

export default StoryAvatar;
