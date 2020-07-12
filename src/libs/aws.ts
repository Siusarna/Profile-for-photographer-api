const AWS = require('aws-sdk');
import * as config from 'config';

const options = {
  accessKeyId: config.get('aws.accessKeyId'),
  secretAccessKey: config.get('aws.secretAccessKey'),
};

AWS.config.update(options);

export default AWS;
