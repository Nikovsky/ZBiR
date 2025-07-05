// @file: server/sec/modules/fico/book/book.module.ts
import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  controllers: [BookController],
  providers: [BookService]
})
export class BookModule { }
