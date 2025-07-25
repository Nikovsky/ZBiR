// @file: server/sec/modules/fico/book/book.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zbir/database';
import { PaginationResponse, APIMessageResponse, UserRegion, UserRole, FicoBookPanelDto, DEFAULT_PAGINATION_LIMIT, FicoBookPanelWithOwnerDto, FicoBookPanelSortFields, SortDirection } from '@zbir/types';
import { JwtRequestUser } from '@/interfaces/jwt-request-user.interface'
import { BookQueryDto } from './book.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) { }

  async getBooks(query: BookQueryDto, currentUser: JwtRequestUser): Promise<PaginationResponse<FicoBookPanelDto | FicoBookPanelWithOwnerDto>> {
    const { page = 1, limit = DEFAULT_PAGINATION_LIMIT, sortBy = FicoBookPanelSortFields.OPENED_AT, sortDirection = SortDirection.DESC, search } = query;
    const skip = (page - 1) * limit

    const noRegion = currentUser.regionAccess === UserRegion.NONE;
    if (noRegion) { throw new Error('Access denied: No region access'); }

    const hasAllRegionsAccess = (
      currentUser.regionAccess === UserRegion.ALL ||
      currentUser.role === UserRole.SKARBNIK ||
      currentUser.role === UserRole.ROOT ||
      currentUser.role === UserRole.ADMIN
    );

    const where = {
      ...(search && {
        OR: [{ name: { contains: search } }],
      }),
      ...(!hasAllRegionsAccess && {
        region: currentUser.regionAccess,
      }),
    };

    const [books, total] = await this.prisma.$transaction([
      this.prisma.ficoBook.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy]: sortDirection },
        where,
        ...(hasAllRegionsAccess ? { include: { owner: true } } : {}),
      }),
      this.prisma.ficoBook.count({ where }),
    ]);

    const bookDtos = books.map((book) =>
      hasAllRegionsAccess
        ? this.toBookWithOwnerDto(book)
        : this.toBookDto(book),
    );

    return { data: bookDtos, total, page, limit };
  }

  async getBookById(id: string, currentUser: JwtRequestUser): Promise<FicoBookPanelDto | FicoBookPanelWithOwnerDto> {
    const noRegion = currentUser.regionAccess === UserRegion.NONE;
    if (noRegion) { throw new Error('Access denied: No region access'); }

    const hasAllRegionsAccess = (
      currentUser.regionAccess === UserRegion.ALL ||
      currentUser.role === UserRole.SKARBNIK ||
      currentUser.role === UserRole.ROOT ||
      currentUser.role === UserRole.ADMIN
    );

    const book = await this.prisma.ficoBook.findUnique({
      where: { id },
      ...(hasAllRegionsAccess ? { include: { owner: true } } : {}),
    });

    if (!book) { throw new Error('Book not found'); }

    return hasAllRegionsAccess
      ? this.toBookWithOwnerDto(book)
      : this.toBookDto(book);
  }

  async createBook(createBookDto: any, currentUser: JwtRequestUser): Promise<APIMessageResponse> {
    const noRegion = currentUser.regionAccess === UserRegion.NONE;
    if (noRegion) { throw new Error('Access denied: No region access'); }

    const hasAllRegionsAccess = (
      currentUser.regionAccess === UserRegion.ALL ||
      currentUser.role === UserRole.SKARBNIK ||
      currentUser.role === UserRole.ROOT ||
      currentUser.role === UserRole.ADMIN
    );

    if (!hasAllRegionsAccess && createBookDto.region !== currentUser.regionAccess) {
      throw new Error('Access denied: Cannot create book in different region');
    }

    await this.prisma.ficoBook.create({
      data: {
        ...createBookDto,
        ownerId: currentUser.id,
      },
    });

    return { message: 'Book created successfully' };
  }

  async updateBook(id: string, updateBookDto: any, currentUser: JwtRequestUser): Promise<APIMessageResponse> {
    const noRegion = currentUser.regionAccess === UserRegion.NONE;
    if (noRegion) { throw new Error('Access denied: No region access'); }

    const hasAllRegionsAccess = (
      currentUser.regionAccess === UserRegion.ALL ||
      currentUser.role === UserRole.SKARBNIK ||
      currentUser.role === UserRole.ROOT ||
      currentUser.role === UserRole.ADMIN
    );

    if (!hasAllRegionsAccess && updateBookDto.region !== currentUser.regionAccess) {
      throw new Error('Access denied: Cannot update book in different region');
    }

    await this.prisma.ficoBook.update({
      where: { id },
      data: updateBookDto,
    });

    return { message: 'Book updated successfully' };
  }

  async approveBook(id: string, approveBookDto: any, currentUser: JwtRequestUser): Promise<APIMessageResponse> {
    const noRegion = currentUser.regionAccess === UserRegion.NONE;
    if (noRegion) { throw new Error('Access denied: No region access'); }

    const hasAllRegionsAccess = (
      currentUser.regionAccess === UserRegion.ALL ||
      currentUser.role === UserRole.SKARBNIK ||
      currentUser.role === UserRole.ROOT ||
      currentUser.role === UserRole.ADMIN
    );

    if (!hasAllRegionsAccess) {
      throw new Error('Access denied: Only skarbnik or admin can approve books');
    }

    await this.prisma.ficoBook.update({
      where: { id },
      data: {
        approvedAt: approveBookDto.approvedAt,
      },
    });

    return { message: 'Book approved successfully' };
  }

  async deleteBook(id: string, currentUser: JwtRequestUser): Promise<APIMessageResponse> {
    const noRegion = currentUser.regionAccess === UserRegion.NONE;
    if (noRegion) { throw new Error('Access denied: No region access'); }

    const hasAllRegionsAccess = (
      currentUser.regionAccess === UserRegion.ALL ||
      currentUser.role === UserRole.SKARBNIK ||
      currentUser.role === UserRole.ROOT ||
      currentUser.role === UserRole.ADMIN
    );

    if (!hasAllRegionsAccess) {
      throw new Error('Access denied: Only skarbnik or admin can delete books');
    }

    await this.prisma.ficoBook.delete({
      where: { id },
    });

    return { message: 'Book deleted successfully' };
  }

  private toBookDto(book: any): FicoBookPanelDto {
    return {
      id: book.id,
      name: book.name,
      description: book.description,
      region: book.region,
      openedAt: book.openedAt,
      closedAt: book.closedAt,
      approvedAt: book.approvedAt,
      isClosed: book.isClosed,
      incomeSum: this.toNumber(book.incomeSum),
      expenseSum: this.toNumber(book.expenseSum),
      balanceSum: this.toNumber(book.balanceSum),
    };
  }

  private toBookWithOwnerDto(book: any): FicoBookPanelWithOwnerDto {
    return {
      ...this.toBookDto(book),
      owner: {
        id: book.owner.id,
        name: book.owner.name || null,
        email: book.owner.email,
      },
    };
  }

  private toNumber(val: Decimal | number | null): number {
    if (val === null) return 0;
    if (typeof val === 'number') return val;
    return Number(val.toString());
  }
}
