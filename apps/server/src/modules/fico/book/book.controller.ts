// @file: server/sec/modules/fico/book/book.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { BookQueryDto } from './book.dto';
import { PaginationResponse, FicoBookPanelDto, FicoBookPanelWithOwnerDto, UserRole } from '@zbir/types';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { JwtRequestUser } from '@/interfaces/jwt-request-user.interface'
import { JwtAuthGuard } from '@/guards/jwt-auth.guard'
import { RolesGuard } from '@/guards/roles.guard'
import { Roles } from '@/decorators/roles.decorator'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.ROOT, UserRole.SKARBNIK, UserRole.SKARBNIK_REGION)
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
}
