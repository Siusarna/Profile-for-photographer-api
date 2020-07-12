import Queries from './admins.query';
import { createAndUpdateTokens } from '../helper/jwtToken';
import AWSS3 from '../helper/S3';

export default class Services {
  static async signIn({ email, password }) {
    const user = await Queries.getUserByEmail(email.toLowerCase());
    if (!user.checkPassword(password)) throw new Error('Неправильний логін або пароль');
    const { accessToken, refreshToken } = await createAndUpdateTokens(user.id);
    return {
      accessToken,
      refreshToken,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  static async signUp({ email, ...rest }) {
    const user = await Queries.createUser({ email: email.toLowerCase(), ...rest });
    const { accessToken, refreshToken } = await createAndUpdateTokens(user.id);
    return {
      accessToken,
      refreshToken,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  static async createAlbum({ name, categoryId }) {
    const category = await Queries.getCategoryById(categoryId);
    if (!category) throw new Error('Такої категорії не існує');
    const album = await Queries.createAlbum(name, category);
    return {
      id: album.id,
      name: album.name,
    };
  }

  static async createCategory({ name }) {
    await Queries.createCategory(name);
    return {
      success: true,
    };
  }

  static async uploadPhotos({ albumId, photos }) {
    const album = await Queries.getAlbumById(albumId);
    if (!album) throw new Error('Такого альбома не існує');
    await Promise.all(photos.map(async (photo) => {
      const photoUrl = await AWSS3.uploadS3(photo, 'photos', `album_${album.name}`);
      await Queries.createPhoto(photoUrl, album);
    }));
    return {
      success: true,
    };
  }
}
