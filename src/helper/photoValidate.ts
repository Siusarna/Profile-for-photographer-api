import { Context } from 'koa';
import * as Jimp from 'jimp';

export const validateFileTypeAndSize = async (ctx: Context, fieldName: string): Promise<boolean> => {
  const photos = ctx.request.body[fieldName];
  if (!photos || !photos.length || !Array.isArray(photos)) ctx.throw(404, 'Image not found');
  await Promise.all(photos.map(async (photo) => {
    await Jimp.read(Buffer.from(photo.replace(/^data:image\/\w+;base64,/, ''), 'base64'));
  }));

  return true;
};
