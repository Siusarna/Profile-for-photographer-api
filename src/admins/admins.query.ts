import { getRepository } from 'typeorm';
import { User } from './entities/user.entity';
import { Album } from './entities/album.entity';
import { Category } from './entities/category.entity';
import { Photo } from './entities/photo.entity';

export default class Queries {
  static getUserById(id: number) {
    return getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  static getUserByEmail(email: string) {
    return getRepository(User)
      .createQueryBuilder('user')
      .where('email = :email', { email })
      .getOne();
  }

  static async createUser(body) {
    const user = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
    });
    user.password = user.generatePasswordHash(body.password);
    try {
      await user.save();
      return user;
    } catch (e) {
      if (e.message.includes('duplicate key')) throw new Error('Альбом з таким ім\'ям уже існує');
      throw new Error(e);
    }
  }

  static getCategoryById(id) {
    return getRepository(Category)
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .getOne();
  }

  static async createAlbum(name, category) {
    const album = await Album.create({
      name,
      category,
    });
    try {
      await album.save();
      return album;
    } catch (e) {
      if (e.message.includes('duplicate key')) throw new Error('Альбом з таким ім\'ям уже існує');
      throw new Error(e);
    }
  }

  static async createCategory(name) {
    const category = await Category.create({
      name,
    });
    try {
      await category.save();
      return category;
    } catch (e) {
      if (e.message.includes('duplicate key')) throw new Error('Категорія з таким ім\'ям уже існує');
      throw new Error(e);
    }
  }

  static getAlbumById(id) {
    return getRepository(Album)
      .createQueryBuilder('album')
      .where('album.id = :id', { id })
      .getOne();
  }

  static async createPhoto(url, album) {
    const photo = await Photo.create({
      url,
      album,
    });
    try {
      await photo.save();
      return photo;
    } catch (e) {
      throw new Error(e);
    }
  }

}
