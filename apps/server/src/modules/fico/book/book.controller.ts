// @file: server/sec/modules/fico/book/book.controller.ts
import { Controller, Get, Query, UseGuards, Param, HttpCode, Body, HttpStatus, Post, Patch, Delete } from '@nestjs/common';
import { BookService } from './book.service';
import { BookQueryDto, BookCreateDto, BookUpdateDto, BookApproveDto } from './book.dto';
import { PaginationResponse, FicoBookPanelDto, FicoBookPanelWithOwnerDto, UserRole, APIMessageResponse } from '@zbir/types';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { JwtRequestUser } from '@/interfaces/jwt-request-user.interface'
import { JwtAuthGuard } from '@/guards/jwt-auth.guard'
import { RolesGuard } from '@/guards/roles.guard'
import { Roles } from '@/decorators/roles.decorator'

// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.ADMIN, UserRole.ROOT, UserRole.SKARBNIK, UserRole.SKARBNIK_REGION)
@Controller('fico/book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Get()
  async getBooks(
    @Query() query: BookQueryDto,
    @CurrentUser() currentUser: JwtRequestUser
  ): Promise<PaginationResponse<FicoBookPanelDto | FicoBookPanelWithOwnerDto>> {
    return this.bookService.getBooks(query, currentUser);
  }

  @Get(':id')
  async getBookById(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtRequestUser
  ): Promise<FicoBookPanelDto | FicoBookPanelWithOwnerDto> {
    return this.bookService.getBookById(id, currentUser);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBook(
    @Body() createBookDto: BookCreateDto,
    @CurrentUser() currentUser: JwtRequestUser
  ): Promise<APIMessageResponse> {
    return this.bookService.createBook(createBookDto, currentUser);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: BookUpdateDto,
    @CurrentUser() currentUser: JwtRequestUser
  ): Promise<APIMessageResponse> {
    return this.bookService.updateBook(id, updateBookDto, currentUser);
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  async approveBook(
    @Param('id') id: string,
    @Body() approveBookDto: BookApproveDto,
    @CurrentUser() currentUser: JwtRequestUser
  ): Promise<APIMessageResponse> {
    return this.bookService.approveBook(id, approveBookDto, currentUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteBook(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtRequestUser
  ): Promise<APIMessageResponse> {
    return this.bookService.deleteBook(id, currentUser);
  }
}
