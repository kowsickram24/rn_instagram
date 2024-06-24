import S3 from 'aws-sdk/clients/s3';
import config from '../../config';


//S3 Bucket Configuration
export const S3Bucket = new S3({
  accessKeyId: config.ACCESSKEYID,
  secretAccessKey: config.SECRETACCESSKEY,
  region: config.REGION,
});
