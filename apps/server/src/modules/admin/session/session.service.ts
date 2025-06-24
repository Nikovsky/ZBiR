// @file: server/src/modules/admin/session/session.service.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@zbir/database'
import { PaginationQuery, PaginationResponse, GroupedUserSession, UserSession, APIMessageResponse, GroupedUserSessionSortBy, UserRole, SortDirection } from '@zbir/types'
import { Prisma } from '@prisma/client'

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) { }

  async getGroupedUsersSessions(
    query: PaginationQuery<GroupedUserSessionSortBy>
  ): Promise<PaginationResponse<GroupedUserSession>> {
    const {
      page = 1,
      limit = 25,
      search,
      sortBy = GroupedUserSessionSortBy.EMAIL,
      sortDirection = SortDirection.ASC,
    } = query

    const skip = (page - 1) * limit
    const where: Prisma.UserWhereInput = {
      ...(search && {
        email: { contains: search },
      }),
      sessions: { some: {} },
    }

    const isDbSortable = [GroupedUserSessionSortBy.EMAIL, GroupedUserSessionSortBy.ROLE].includes(sortBy)
    const prismaSort = isDbSortable ? { [sortBy]: sortDirection.toLowerCase() } : undefined

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        ...(prismaSort && { orderBy: prismaSort }),
        select: {
          id: true,
          email: true,
          role: true,
          sessions: { select: { expires: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ])

    const now = new Date()

    let data: GroupedUserSession[] = users.map((u) => ({
      userId: u.id,
      email: u.email,
      role: u.role as UserRole,
      sessionCount: u.sessions.length,
      activeSessionCount: u.sessions.filter((s) => s.expires > now).length,
    }))

    if (!isDbSortable) {
      data.sort((a, b) => {
        const dir = sortDirection === SortDirection.ASC ? 1 : -1
        switch (sortBy) {
          case GroupedUserSessionSortBy.SESSION_COUNT:
            return dir * (a.sessionCount - b.sessionCount)
          case GroupedUserSessionSortBy.ACTIVE_SESSION_COUNT:
            return dir * (a.activeSessionCount - b.activeSessionCount)
          default:
            return 0
        }
      })
    }

    return { data, total, page, limit }
  }

  async getUserSessions(
    userId: string,
    paginationQuery: PaginationQuery
  ): Promise<PaginationResponse<UserSession>> {
    const { page = 1, limit = 25, search, sortBy, sortDirection } = paginationQuery
    const skip = (page - 1) * limit
    const direction = (sortDirection ?? SortDirection.DESC) as Prisma.SortOrder

    const validFields = ['ip', 'deviceInfo', 'createdAt', 'expires']
    const orderBy: Prisma.SessionOrderByWithRelationInput = {
      [validFields.includes(sortBy || '') ? sortBy! : 'createdAt']: direction,
    }

    const where: Prisma.SessionWhereInput = {
      userId,
      ...(search && {
        OR: [
          { ip: { contains: search } },
          { deviceInfo: { contains: search } },
        ],
      }),
    }

    const now = new Date()

    const [sessions, total] = await Promise.all([
      this.prisma.session.findMany({
        skip,
        take: limit,
        where,
        orderBy,
        select: {
          id: true,
          userId: true,
          ip: true,
          deviceInfo: true,
          expires: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      }),
      this.prisma.session.count({ where }),
    ])

    const data: UserSession[] = sessions.map((s) => ({
      ...s,
      isActive: s.expires > now,
    }))

    return { data, total, page, limit }
  }

  async deleteSession(id: string): Promise<APIMessageResponse> {
    await this.prisma.session.delete({ where: { id } })
    return { message: 'Sesja została usunięta.' }
  }

  async deleteUserSessions(userId: string): Promise<APIMessageResponse> {
    await this.prisma.session.deleteMany({ where: { userId } })
    return { message: 'Wszystkie sesje użytkownika zostały usunięte.' }
  }

  async deleteInactiveUserSessions(userId: string): Promise<APIMessageResponse> {
    console.log(userId)
    await this.prisma.session.deleteMany({
      where: {
        userId,
        expires: { lt: new Date() },
      },
    })
    return { message: 'Nieaktywne sesje użytkownika zostały usunięte.' }
  }

  async deleteAllInactiveSessions(): Promise<APIMessageResponse> {
    await this.prisma.session.deleteMany({
      where: {
        expires: { lt: new Date() },
      },
    })
    return { message: 'Wszystkie nieaktywne sesje zostały usunięte.' }
  }

}
