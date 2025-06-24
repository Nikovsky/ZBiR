// @file: server/src/modules/admin/session/session.controller.ts
import { Controller, Get, Delete, Param, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { RolesGuard } from '@/guards/roles.guard'
import { JwtAuthGuard } from '@/guards/jwt-auth.guard'
import { Roles } from '@/decorators/roles.decorator'
import { UserRole, PaginationResponse, APIMessageResponse, GroupedUserSession, UserSession } from '@zbir/types'
import { SessionService } from './session.service'
import { GroupedSessionQueryDto, UserSessionQueryDto } from './session.dto'

@Controller('admin/session')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.ROOT)
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }

  @Get()
  getGroupedSessions(
    @Query() paginationQuery: GroupedSessionQueryDto
  ): Promise<PaginationResponse<GroupedUserSession>> {
    return this.sessionService.getGroupedUsersSessions(paginationQuery);
  }

  @Get(':userId')
  getUserSessions(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() paginationQuery: UserSessionQueryDto
  ): Promise<PaginationResponse<UserSession>> {
    return this.sessionService.getUserSessions(userId, paginationQuery);
  }

  @Delete(':id')
  deleteSession(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<APIMessageResponse> {
    return this.sessionService.deleteSession(id);
  }

  @Delete('user/:userId')
  deleteUserSessions(
    @Param('userId', ParseUUIDPipe) userId: string
  ): Promise<APIMessageResponse> {
    return this.sessionService.deleteUserSessions(userId);
  }

  @Delete('user/inactive/:userId')
  deleteInactiveUserSessions(
    @Param('userId', ParseUUIDPipe) userId: string
  ): Promise<APIMessageResponse> {
    return this.sessionService.deleteInactiveUserSessions(userId);
  }

  @Delete('/inactive/all')
  deleteAllInactiveSessions(): Promise<APIMessageResponse> {
    return this.sessionService.deleteAllInactiveSessions();
  }
}
