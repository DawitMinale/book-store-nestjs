import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from './schemas/book.schema';
import { Query } from 'express-serve-static-core';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(query: Query): Promise<Book[]> {
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword =
      query.keyword && typeof query.keyword === 'string'
        ? {
            title: {
              $regex: new RegExp(query.keyword, 'i'), // Use RegExp with 'i' option for case-insensitive search
            },
          }
        : {};
    // console.log(query);
    const books = await this.bookModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return books;
  }

  async create(book: Book, user: User) {
    const data = Object.assign(book, { user: user._id });
    return await this.bookModel.create(data);
  }
  async findById(id: string): Promise<Book> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('please enter the correct id');
    }
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async updateById(id: string, book: Book): Promise<Book> {
    return await this.bookModel.findByIdAndUpdate(id, book, {
      new: true, //return the updated document rather than the original one
      runValidators: true,
    });
  }
  async deleteBook(id: string): Promise<Book> {
    const deletedBook = (await this.bookModel
      .findByIdAndDelete(id)
      .lean()) as Book;
    return deletedBook;
  }
}
