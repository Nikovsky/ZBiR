// @file: server/sec/modules/fico/book/book.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zbir/database';
import { PaginationResponse, FicoBookPanelDto, DEFAULT_PAGINATION_LIMIT, FicoBookPanelSortFields, SortDirection } from '@zbir/types';
import { JwtRequestUser } from '@/interfaces/jwt-request-user.interface'
import { BookQueryDto } from './book.dto';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) { }

  async getBooks(query: BookQueryDto, currentUser: JwtRequestUser): Promise<PaginationResponse<FicoBookPanelDto>> {
    const { page = 1, limit = DEFAULT_PAGINATION_LIMIT, sortBy = FicoBookPanelSortFields.OPENED_AT, sortDirection = SortDirection.DESC, search } = query;
    const skip = (page - 1) * limit

    const where = search
      ? {
        OR: [
          { name: { contains: search } }
        ],
      }
      : {}

    const [books, total] = await this.prisma.$transaction([
      this.prisma.ficoBook.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy]: sortDirection },
        where,
      }),
      this.prisma.ficoBook.count({ where }),
    ]);

    const bookDtos = books.map(this.toBookDto);
    return {
      data: bookDtos,
      total,
      page,
      limit
    };
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
      incomeSum: book.incomeSum,
      expenseSum: book.expenseSum,
      balanceSum: book.balanceSum
    };
  }
}
