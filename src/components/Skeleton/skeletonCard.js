import {Skeleton, Card} from '@rneui/themed';
import {Box, Text} from '../../theme';

const SkeletonCard = () => {
  return (
    <Box>
      <Card
        containerStyle={{
          padding: 0,
          margin: 0,
          elevation: 0,
          borderWidth: 0,
        }}>
        <Box padding={'s'} flexDirection="row" alignItems="center" gap={'s'}>
          <Skeleton animation="pulse" circle width={42} height={42} />
          <Box flex={1} flexDirection="row" justifyContent="space-between">
            <Box flexDirection="column" gap={'s'}>
              <Skeleton
                animation="pulse"
                style={{borderRadius: 50}}
                width={100}
                height={10}
              />
              <Skeleton
                animation="pulse"
                style={{borderRadius: 50}}
                width={100}
                height={10}
              />
            </Box>
            <Skeleton animation="pulse" width={30} height={10} />
          </Box>
        </Box>
        <Skeleton animation="pulse" height={400} width="100%" />
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          padding={'s'}>
          <Box flexDirection="row" justifyContent="center" gap={'m'}>
            <Skeleton
              animation="pulse"
              style={{borderRadius: 15}}
              width={30}
              height={30}
            />
            <Skeleton
              animation="pulse"
              style={{borderRadius: 15}}
              width={30}
              height={30}
            />
            <Skeleton
              animation="pulse"
              style={{borderRadius: 15}}
              width={30}
              height={30}
            />
          </Box>
          <Skeleton
            animation="pulse"
            style={{borderRadius: 15}}
            width={30}
            height={30}
          />
        </Box>
        <Box paddingVertical={'s'} paddingHorizontal={'s'}>
          <Skeleton
            animation="pulse"
            style={{borderRadius: 100}}
            width={100}
            height={15}
          />
        </Box>
        <Box paddingVertical={'s'} paddingHorizontal={'s'}>
          <Skeleton
            animation="pulse"
            style={{borderRadius: 100}}
            width={200}
            height={15}
          />
        </Box>
        <Box paddingVertical={'s'} paddingHorizontal={'s'}>
          <Skeleton
            animation="pulse"
            style={{borderRadius: 150}}
            width={150}
            height={15}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default SkeletonCard;
