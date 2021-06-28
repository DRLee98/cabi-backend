import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { DeleteFileOutput } from './dtos/delete-file-dto';
import { UploadFileOutput } from './dtos/upload-file-dto';

const BUCKET_NAME = 'cabia-upload-bucket';

@Injectable()
export class UploadService {
  async uploadFile(file: any): Promise<UploadFileOutput> {
    AWS.config.update({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_PRIVATE_KEY,
      },
    });
    try {
      const objectName = `${Date.now() + file.originalname}`;
      await new AWS.S3()
        .putObject({
          Body: file.buffer,
          Bucket: BUCKET_NAME,
          Key: objectName,
          ACL: 'public-read',
        })
        .promise();
      const encodeName = encodeURIComponent(objectName);
      const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${encodeName}`;
      return {
        ok: true,
        url,
      };
    } catch (e) {
      console.log(e);
      return { ok: false, error: e };
    }
  }

  async deleteFile(url: string): Promise<DeleteFileOutput> {
    try {
      if (url) {
        const Key = url.split(`${BUCKET_NAME}.s3.amazonaws.com/`)[1];
        await new AWS.S3()
          .deleteObject(
            {
              Bucket: BUCKET_NAME,
              Key,
            },
            (err, data) => {
              if (err) {
                throw err;
              }
              return { ok: true };
            },
          )
          .promise();
      }
    } catch (e) {
      console.log(e);
      return { ok: false, error: e };
    }
  }
}
