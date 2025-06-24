// @file: server/src/modules/admin/user/user.controller.ts
import { Controller, Get, Param, Query, Patch, Post, Body, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service'
import { JwtAuthGuard } from '@/guards/jwt-auth.guard'
import { RolesGuard } from '@/guards/roles.guard'
import { Roles } from '@/decorators/roles.decorator'
import { CurrentUser } from '@/decorators/current-user.decorator'
import { JwtRequestUser } from '@/interfaces/jwt-request-user.interface'
import { APIMessageResponse, AdminPanelUserDto, AdminPanelUserWithPersonalDataDto, AdminPanelUserSortFields, PaginationResponse, PaginationQuery, } from '@zbir/types'
import { CreateUserDto, EditUserWithPersonalDataDto, PasswordChangeDto, UserQueryDto } from './user.dto'
import { UserRole } from '@zbir/types'

@Controller('admin/user')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.ROOT)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getUsers(
    @Query() query: UserQueryDto
  ): Promise<PaginationResponse<AdminPanelUserDto>> {
    return this.userService.getUsers(query);
  }

  @Get(':id')
  async getUserByIdWithPersonalData(
    @Param('id') id: string
  ): Promise<AdminPanelUserWithPersonalDataDto> {
    return this.userService.getUserByIdWithPersonalData(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() currentUser: JwtRequestUser
  ): Promise<APIMessageResponse> {
    return this.userService.createUser(createUserDto, currentUser);
  }

  @Patch(':id')
  async editUser(
    @Param('id') id: string,
    @Body() editUserWithPersonalDataDto: EditUserWithPersonalDataDto,
    @CurrentUser() currentUser: JwtRequestUser
  ): Promise<APIMessageResponse> {
    return this.userService.editUser(id, editUserWithPersonalDataDto, currentUser);
  }

  @Patch(':id/password')
  async changePassword(
    @Param('id') id: string,
    @Body() passwordChangeDto: PasswordChangeDto,
    @CurrentUser() currentUser: JwtRequestUser
  ): Promise<APIMessageResponse> {
    return this.userService.changePassword(id, passwordChangeDto, currentUser);
  }

  @Patch(':id/block')
  @HttpCode(HttpStatus.OK)
  async blockUser(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtRequestUser
  ): Promise<APIMessageResponse> {
    return this.userService.blockUser(id, currentUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtRequestUser
  ): Promise<APIMessageResponse> {
    return this.userService.deleteUser(id, currentUser);
  }
}
