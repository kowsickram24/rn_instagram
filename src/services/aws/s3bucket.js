import S3 from 'aws-sdk/clients/s3';
import Config from 'react-native-config';

//S3 Bucket Configuration
export const S3Bucket = new S3({
  accessKeyId: Config.AWS_ACCESS_KEY_ID,
  secretAccessKey: Config.AWS_SECRET_ACCESS_KEY,
  region: Config.AWS_REGION,
});