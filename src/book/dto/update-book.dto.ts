/* eslint-disable prettier/prettier */
import { IsEmpty, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from '../schemas/book.schema';
import { User } from 'src/auth/schemas/user.schema';

export class UpdateBookDto {

  @IsString()
  @IsOptional()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsString()
  @IsOptional()
  readonly author: string;

  @IsNumber()
  @IsOptional()
  readonly price: number;

  @IsEnum(Category,{message:"please enter correct category"})
  readonly category: Category;

  @IsEmpty({message:"you cannot pass user id"})
  readonly user: User;
}
