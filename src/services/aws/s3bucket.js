import S3 from 'aws-sdk/clients/s3';
import config from '../../config';
import {Text, View} from 'react-native';

const S3Bucket = () => {
  const s3 = new S3({
    accessKeyId: config.ACCESSKEYID,
    secretAccessKey: config.SECRETACCESSKEY,
    region: config.REGION,
  });

  return (
    <View>
      <Text> {config.BUCKETNAME}</Text>
    </View>
  );
};

export default S3Bucket;