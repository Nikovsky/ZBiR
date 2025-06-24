// @file: server/src/modules/user/dashboard/dashboard.controller.ts
import { Controller, Get, UseGuards, Req, HttpCode, HttpStatus, Patch, Body } from '@nestjs/common'
import { JwtAuthGuard } from '@/guards/jwt-auth.guard'
import { RolesGuard } from '@/guards/roles.guard'
import { Roles } from '@/decorators/roles.decorator'
import { UserRole } from '@zbir/types'
import { DashboardService } from './dashboard.service'
import { CurrentUser } from '@/decorators/current-user.decorator'
import { JwtRequestUser } from '@/interfaces/jwt-request-user.interface'
import { UpdateUserDashboardDto, ChangePasswordDto } from './dashboard.dto'
import { PublicUserAccountDto, APIMessageResponse } from '@zbir/types';

@Controller('user/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN, UserRole.ROOT)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getDashboard(
    @CurrentUser() user: JwtRequestUser
  ): Promise<PublicUserAccountDto> {
    return this.dashboardService.getUserDashboard(user.id)
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateDashboard(
    @CurrentUser() user: JwtRequestUser,
    @Body() dto: UpdateUserDashboardDto
  ): Promise<APIMessageResponse> {
    return this.dashboardService.updateUserData(user.id, dto)
  }

  @Patch('password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: JwtRequestUser,
    @Body() dto: ChangePasswordDto
  ): Promise<APIMessageResponse> {
    return this.dashboardService.changeUserPassword(user.id, dto)
  }
}
