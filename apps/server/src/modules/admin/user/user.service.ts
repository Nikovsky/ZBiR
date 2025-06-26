// @file: server/src/modules/admin/user/user.service.ts
import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@zbir/database'
import { CreateUserDto, EditUserWithPersonalDataDto, PasswordChangeDto, EditUserDto, EditPersonalDataDto, UserQueryDto } from './user.dto'
import { JwtRequestUser } from '@/interfaces/jwt-request-user.interface'
import { Gender, UserRole, UserRegion } from '@zbir/types'
import { User, PersonalData, Prisma } from '@prisma/client'
import { APIMessageResponse, DEFAULT_PAGINATION_LIMIT, AdminPanelUserDto, AdminPanelUserWithPersonalDataDto, PaginationQuery, AdminPanelUserSortFields, SortDirection, PaginationResponse, AdminPanelPersonalDataDto } from '@zbir/types'
import * as argon2 from 'argon2'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async getUsers(query: UserQueryDto): Promise<PaginationResponse<AdminPanelUserDto>> {
    const { page = 1, limit = DEFAULT_PAGINATION_LIMIT, sortBy = AdminPanelUserSortFields.CREATED_AT, sortDirection = SortDirection.DESC, search } = query
    const skip = (page - 1) * limit

    const where = search
      ? {
        OR: [
          { name: { contains: search } },
          { username: { contains: search } },
          { email: { contains: search } },
        ],
      }
      : {}

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy]: sortDirection },
        where,
      }),
      this.prisma.user.count({ where }),
    ])
    const userDtos = users.map(this.toUserDto)
    return {
      data: userDtos,
      total,
      page,
      limit
    }
  }

  async getUserByIdWithPersonalData(id: string): Promise<AdminPanelUserWithPersonalDataDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { personalData: true },
    })
    if (!user) throw new Error(`User with ID ${id} not found`)

    console.log('user:', user)

    return {
      ...this.toUserDto(user),
      personalData: user.personalData ? this.toPersonalDataDto(user.personalData) : null,
    }
  }

  async changePassword(
    id: string,
    dto: PasswordChangeDto,
    current: JwtRequestUser,
  ): Promise<APIMessageResponse> {
    if (id !== dto.id) { throw new BadRequestException('Identyfikator użytkownika jest niezgodny.') }
    if (id === current.id) { throw new ForbiddenException('Zmień swoje hasło z DASHBOARD.') }
    const hashed = await argon2.hash(dto.newPassword)

    try {
      const updated = await this.prisma.user.update({
        where: { id },
        data: { password: hashed },
        select: { email: true },
      })

      return { message: `Hasło użytkownika ${updated.email} zostało pomyślnie zmienione.`, }
    } catch {
      throw new NotFoundException('Użytkownik nie istnieje.')
    }
  }

  async createUser(dto: CreateUserDto, current: JwtRequestUser): Promise<APIMessageResponse> {
    if (dto.role && this.isRoleHigher(dto.role, current.role)) {
      throw new ForbiddenException('Nie możesz utworzyć użytkownika z wyższą rolą niż Twoja.')
    }

    const hashedPassword = await argon2.hash(dto.password)

    const created = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        username: dto.username ?? '',
        name: dto.name ?? '',
        role: dto.role ?? UserRole.USER,
        regionAccess: dto.regionAccess ?? UserRegion.NONE,
        isActive: dto.isActive ?? true,
        isBlocked: dto.isBlocked ?? false,
        isEmailConfirmed: dto.isEmailConfirmed ?? false,
        twoFactorEnabled: dto.twoFactorEnabled ?? false,
        personalData: {
          create: {},
        },
      },
    })

    return { message: `Użytkownik ${created.email} został utworzony.` }
  }

  async blockUser(id: string, current: JwtRequestUser): Promise<APIMessageResponse> {
    if (id === current.id) { throw new ForbiddenException('Nie możesz zablokować samego siebie.') }

    const updated = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id } })
      if (!user) throw new NotFoundException('Użytkownik nie istnieje.')

      return tx.user.update({
        where: { id },
        data: { isBlocked: !user.isBlocked },
        select: { email: true, isBlocked: true },
      })
    })

    return {
      message: updated.isBlocked
        ? `Użytkownik ${updated.email} został zablokowany.`
        : `Użytkownik ${updated.email} został odblokowany.`,
    }
  }

  async deleteUser(id: string, current: JwtRequestUser): Promise<APIMessageResponse> {
    if (id === current.id) {
      throw new ForbiddenException('Nie możesz usunąć samego siebie.')
    }

    try {
      const deleted = await this.prisma.user.delete({
        where: { id },
        select: { email: true },
      })

      return { message: `Użytkownik ${deleted.email} został usunięty.` }
    } catch {
      throw new NotFoundException('Użytkownik nie istnieje.')
    }
  }

  async editUser(
    id: string,
    dto: EditUserWithPersonalDataDto,
    current: JwtRequestUser,
  ): Promise<APIMessageResponse> {
    const { personalData, ...userFields } = dto

    await this.prisma.$transaction(async (tx) => {
      await this.updateUserTx(id, userFields, current, tx)

      if (personalData) {
        await this.updatePersonalDataTx(id, personalData, tx)
      }
    })

    return { message: 'Dane użytkownika zostały zaktualizowane.' }
  }

  private async updateUserTx(
    id: string,
    dto: EditUserDto,
    current: JwtRequestUser,
    tx: PrismaService | Prisma.TransactionClient
  ) {
    const existing = await tx.user.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Użytkownik nie istnieje.')

    const isSelf = id === current.id
    const isRoleChange = dto.role && dto.role !== existing.role
    const isTryingToSetHigherRole = dto.role && this.isRoleHigher(dto.role, current.role)

    if (isSelf && isRoleChange) {
      throw new ForbiddenException('Nie możesz zmienić swojej roli.')
    }

    if (!isSelf && isTryingToSetHigherRole) {
      throw new ForbiddenException('Nie możesz nadać wyższej roli niż twoja.')
    }

    await tx.user.update({
      where: { id },
      data: {
        name: dto.name?.trim() || undefined,
        username: dto.username?.trim() || undefined,
        emailVerified: dto.emailVerified,
        image: dto.image,
        isActive: dto.isActive,
        isBlocked: dto.isBlocked,
        isEmailConfirmed: dto.isEmailConfirmed,
        twoFactorEnabled: dto.twoFactorEnabled,
        role: dto.role,
        regionAccess: dto.regionAccess,
        updatedAt: new Date(),
      },
    })
  }

  private async updatePersonalDataTx(
    userId: string,
    dto: EditPersonalDataDto,
    tx: PrismaService | Prisma.TransactionClient
  ) {
    await tx.personalData.upsert({
      where: { userId },
      update: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        gender: dto.gender,
      },
      create: {
        ...dto,
        userId,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        gender: dto.gender,
      },
    })
  }

  private toUserDto(user: User): AdminPanelUserDto {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      isActive: user.isActive,
      isBlocked: user.isBlocked,
      isEmailConfirmed: user.isEmailConfirmed,
      twoFactorEnabled: user.twoFactorEnabled,
      failedLoginAttempts: user.failedLoginAttempts,
      lastLoginAt: user.lastLoginAt,
      role: user.role as UserRole,
      regionAccess: user.regionAccess as UserRegion,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

  private toPersonalDataDto(data: PersonalData): AdminPanelPersonalDataDto {
    return {
      id: data.id,
      userId: data.userId,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      address: data.address,
      city: data.city,
      zipCode: data.zipCode,
      country: data.country,
      birthDate: data.birthDate,
      gender: data.gender as Gender,
      canUserEdit: data.canUserEdit,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  private isRoleHigher(target: UserRole, current: UserRole): boolean {
    const priority: Record<UserRole, number> = {
      USER: 1,
      SKARBNIK: 2,
      SKARBNIK_REGION: 3,
      ADMIN: 4,
      SYSTEM: 5,
      ROOT: 6,
    }
    return priority[target] >= priority[current]
  }
}
