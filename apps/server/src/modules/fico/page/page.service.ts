// @file: server/sec/modules/fico/page/page.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zbir/database';
import { JwtRequestUser } from '@/interfaces/jwt-request-user.interface'
import { FicoPanelViewDto, FicoPanelWithOwnerViewDto, PaginationResponse, FicoEntryPanelDto, FicoCategoryPanelDto, FicoPageWithEntriesPanelDto, UserRole, UserRegion, DEFAULT_PAGINATION_LIMIT, SortDirection, FicoPagePanelSortFields, FicoBookPanelDto, FicoBookPanelWithOwnerDto } from '@zbir/types';
import { PageQueryDto } from './page.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PageService {
  constructor(private readonly prisma: PrismaService) { }

  //async getPages(bookId: string, query: PageQueryDto, currentUser: JwtRequestUser): Promise<PaginationResponse<FicoPanelViewDto | FicoPanelWithOwnerViewDto>> {
  async getPages(bookId: string, query: PageQueryDto): Promise<PaginationResponse<FicoPanelViewDto | FicoPanelWithOwnerViewDto>> {
    const { page = 1, limit = DEFAULT_PAGINATION_LIMIT, sortBy = FicoPagePanelSortFields.TIMESTAMP, sortDirection = SortDirection.DESC, search } = query;
    const skip = (page - 1) * limit

    // const noRegion = currentUser.regionAccess === UserRegion.NONE;
    // if (noRegion) { throw new Error('Access denied: No region access'); }

    // const hasAllRegionsAccess = (
    //   currentUser.regionAccess === UserRegion.ALL ||
    //   currentUser.role === UserRole.SKARBNIK ||
    //   currentUser.role === UserRole.ROOT ||
    //   currentUser.role === UserRole.ADMIN
    // );

    const hasAllRegionsAccess = false; // Temporarily set to true for testing

    // Weryfikuj dostęp do książki
    const book = await this.prisma.ficoBook.findUnique({
      where: { id: bookId },
      ...(hasAllRegionsAccess ? { include: { owner: true } } : {}),
    });

    if (!book) throw new Error('FICO book not found');

    // if (!hasAllRegionsAccess && book.region !== currentUser.regionAccess) {
    //   throw new Error('Access denied: Region mismatch');
    // }

    const where = {
      ficoBookId: bookId,
      ...(search && {
        OR: [{ name: { contains: search } }, { invoiceNumber: { contains: search } }],
      }),
    };

    const [pages, total] = await this.prisma.$transaction([
      this.prisma.ficoPage.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy]: sortDirection },
        where,
        include: {
          entries: true,
        },
      }),
      this.prisma.ficoPage.count({ where }),
    ]);

    const categories = await this.prisma.ficoCategory.findMany({
      where: {
        OR: [
          { isCustom: false },
          { isCustom: true, ficoBookId: bookId },
        ],
      },
    });

    const panel = pages.map(() =>
      hasAllRegionsAccess
        ? this.toPanelWithOwnerDto({ book, pages, categories })
        : this.toPanelDto({ book, pages, categories })
    );

    return {
      data: panel,
      total,
      page,
      limit,
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


  private toPageDto(page: any): FicoPageWithEntriesPanelDto {
    return {
      id: page.id,
      name: page.name,
      invoiceNumber: page.invoiceNumber,
      timestamp: page.timestamp,
      type: page.type,
      value: this.toNumber(page.value),
      entries: page.entries.map((entry: any) => this.toEntryDto(entry)),
    };
  }

  private toEntryDto(entry: any): FicoEntryPanelDto {
    return {
      id: entry.id,
      ficoCategoryId: entry.ficoCategoryId,
      amount: this.toNumber(entry.amount),
    };
  }

  private toCategoryDto(cat: any): FicoCategoryPanelDto {
    return {
      id: cat.id,
      name: cat.name,
      type: cat.type,
    };
  }

  private toPanelDto(data: {
    book: any;
    pages: any[];
    categories?: any[] | null;
  }): FicoPanelViewDto {
    return {
      book: this.toBookDto(data.book),
      pages: data.pages.map((page: any) => this.toPageDto(page)),
      categories: data.categories?.map((cat) => this.toCategoryDto(cat)) ?? null,
    };
  }

  private toPanelWithOwnerDto(data: {
    book: any;
    pages: any[];
    categories?: any[] | null;
  }): FicoPanelWithOwnerViewDto {
    return {
      book: this.toBookWithOwnerDto(data.book),
      pages: data.pages.map((page: any) => this.toPageDto(page)),
      categories: data.categories?.map((cat) => this.toCategoryDto(cat)) ?? null,
    };
  }

  private toNumber(val: Decimal | number | null): number {
    if (val === null) return 0;
    if (typeof val === 'number') return val;
    return Number(val.toString());
  }
}
