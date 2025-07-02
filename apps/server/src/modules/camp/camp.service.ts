import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zbir/database';
import { CreateCampDto, EditCampDto, AddCampParticipantDto, AcceptCampParticipantDto, CampParticipantRemoveDto, CampQueryDto } from './camp.dto';
import { CampPanelDto, CampPanelSortFields, DEFAULT_PAGINATION_LIMIT, PaginationResponse, SortDirection, UserRole } from '@zbir/types';
import { JwtRequestUser } from '@/interfaces/jwt-request-user.interface';

@Injectable()
export class CampService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async getCamps(user: JwtRequestUser, query: CampQueryDto):
    Promise<PaginationResponse<CampPanelDto>> {
        const { page = 1, limit = DEFAULT_PAGINATION_LIMIT, sortBy = CampPanelSortFields.YEAR, sortDirection = SortDirection.DESC, search } = query;
        const skip = (page - 1) * limit;

        const baseWhere: any = {}

        if (user.role === UserRole.USER) {
        baseWhere.ownerId = user.id
        } else if (user.role === UserRole.SKARBNIK_REGION) {
        baseWhere.region = user.regionAccess
        }

        const searchWhere = search
        ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { owner: { name: { contains: search, mode: 'insensitive' } } },
            ],
            }
        : {}

        const where = {
        AND: [baseWhere, searchWhere],
        }

        
        const [camps, total] = await this.prisma.$transaction([
            this.prisma.camp.findMany({
                skip,
                take: limit,
                orderBy: { [sortBy]: sortDirection },
                where,
            }),
            this.prisma.camp.count({ where }),
        ]);
        
        const campDtos = camps.map(this.toCampDto)
        return {
            data: campDtos,
            total,
            page,
            limit
        };
    }

    async getCampById(id: string): Promise<CampPanelDto> {
        const camp = await this.prisma.camp.findUnique({
            where: { id },
        })

        if (!camp) {
            throw new Error(`Wydarzenie o ${id} nie zostało znalezione!`);
        }

        return this.toCampDto(camp);
    }

    private toCampDto(camp: any): CampPanelDto {
        return {
            id: camp.id,
            name: camp.name,
            year: camp.year,
            region: camp.region,
            isClosed: camp.isClosed,
            approvedAt: camp.approvedAt,
            incomeSum: camp.incomeSum,
            expenseSum: camp.expenseSum,
            balanceFinal: camp.balanceFinal,
            ownerId: camp.ownerId,
            createdAt: camp.createdAt,
            updatedAt: camp.updatedAt,
        };
    }
}
