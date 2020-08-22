import Queries from './admins.query';
import { createAndUpdateTokens } from '../helper/jwtToken';
import AWSS3 from '../helper/S3';

export default class Services {
  static async signIn(email, password) {
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

  static async signUp(email, firstName, lastName, password) {
    const user = await Queries.createUser(email.toLowerCase(), firstName, lastName, password);
    const { accessToken, refreshToken } = await createAndUpdateTokens(user.id);
    return {
      accessToken,
      refreshToken,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  static async createAlbum(name, categoryId) {
    const category = await Queries.getCategoryById(categoryId);
    if (!category) throw new Error('Такої категорії не існує');
    const album = await Queries.createAlbum(name, category);
    return {
      success: true,
    };
  }

  static async createCategory(name) {
    await Queries.createCategory(name);
    return {
      success: true,
    };
  }

  static async uploadPhotos(albumId, photos) {
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

  static async deleteAlbum(albumId) {
    const album = await Queries.getAlbumById(albumId);
    if (!album) throw new Error('Такого альбома не існує');
    await album.remove();
    return {
      success: true,
    };
  }

  static async updateAlbum(albumId, newName) {
    const album = await Queries.getAlbumById(albumId);
    if (!album) throw new Error('Такого альбома не існує');
    album.name = newName;
    await album.save();
    return {
      success: true,
    };
  }

  static async getAlbums() {
    const albums = await Queries.getAllAlbums();
    return {
      albums,
    };
  }

  static async getAlbumsByCategory(categoryId) {
    const albums = await Queries.getAllAlbumsByCategory(categoryId);
    return {
      albums,
    };
  }

  static async getAlbumById(albumId) {
    const album = await Queries.getAlbumById(albumId);
    if (!album) throw new Error('Такого альбома не існує');

    const photos = await Queries.getPhotosByAlbumId(albumId);
    return {
      photos,
      name: album.name,
      id: album.id,
    };
  }
}
