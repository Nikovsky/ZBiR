// @file: server/sec/modules/fico/book/book.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { BookQueryDto } from './book.dto';
import { PaginationResponse, FicoBookPanelDto } from '@zbir/types';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { JwtRequestUser } from '@/interfaces/jwt-request-user.interface'

@Controller('fico/book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Get()
  async getBooks(
    @Query() query: BookQueryDto,
    @CurrentUser() currentUser: JwtRequestUser
  ): Promise<PaginationResponse<FicoBookPanelDto>> {
    return this.bookService.getBooks(query, currentUser);
  }
}
