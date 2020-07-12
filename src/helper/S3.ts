import * as config from 'config';
import { fromBuffer } from 'file-type';
import AWS from '../libs/aws';

class AWSS3 {
  private s3 = new AWS.S3();

  async uploadS3(base64: string, folder: string, subfolder?: string): Promise<string> {
    const base64Data = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const type = base64.split(';')[0].split('/')[1];

    const timestamp = +new Date();
    const filename = `${folder}/${subfolder ? `${subfolder}/` : ''}${timestamp}.${type}`;

    return new Promise((resolve, reject) => {
      this.s3.upload(
        {
          Bucket: config.get('aws.bucketName'),
          Key: filename,
          Prefix: `${folder}/${subfolder}`,
          Body: base64Data,
          ContentEncoding: 'base64',
          ContentType: `image/${type}`,
          ACL: 'public-read',
        },
        (err: any, data: any) => {
          if (err) {
            return reject(err);
          }
          return resolve(data.Location);
        },
      );
    });
  }

  async uploadVideo(body: any, folder: string, subfolder?: string): Promise<string> {
    const timestamp = +new Date();
    const filename = `${folder}/${subfolder ? `${subfolder}/` : ''}${timestamp}.mp4`;

    return new Promise((resolve, reject) => {
      this.s3.upload(
        {
          Bucket: config.get('aws.bucketName'),
          Key: filename,
          Prefix: `${folder}/${subfolder}`,
          Body: body,
          ACL: 'public-read',
        },
        (err: any, data: any) => {
          if (err) {
            return reject(err);
          }
          return resolve(data.Location);
        },
      );
    });
  }
}

export default new AWSS3();
