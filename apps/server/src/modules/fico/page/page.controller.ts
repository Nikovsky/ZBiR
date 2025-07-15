import { Controller, Get, Query, UseGuards, Param, HttpCode, Body, HttpStatus, Post, Patch, Delete } from '@nestjs/common';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { JwtRequestUser } from '@/interfaces/jwt-request-user.interface'
import { JwtAuthGuard } from '@/guards/jwt-auth.guard'
import { RolesGuard } from '@/guards/roles.guard'
import { Roles } from '@/decorators/roles.decorator'
import { PageService } from './page.service'
import { FicoPanelViewDto, FicoPanelWithOwnerViewDto, PaginationResponse, UserRole } from '@zbir/types';
import { PageQueryDto, PageCreateDto, EntryCreateDto, CategoryCreateDto, CategoryUpdateDto, PageUpdateDto, EntryUpdateDto } from './page.dto';

// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.ADMIN, UserRole.ROOT, UserRole.SKARBNIK, UserRole.SKARBNIK_REGION)
@Controller('fico/book/:bookId/page')
export class PageController {
  constructor(private readonly pageService: PageService) { }

  // @Get()
  // async getPages(
  //   @Param('bookId') bookId: string,
  //   @Query() query: PageQueryDto,
  //   @CurrentUser() currentUser: JwtRequestUser
  // ): Promise<PaginationResponse<FicoPanelViewDto | FicoPanelWithOwnerViewDto>> {
  //   return this.pageService.getPages(bookId, query, currentUser);
  // }

  @Get()
  async getPages(
    @Param('bookId') bookId: string,
    @Query() query: PageQueryDto,
  ): Promise<PaginationResponse<FicoPanelViewDto | FicoPanelWithOwnerViewDto>> {
    return this.pageService.getPages(bookId, query);
  }
}
