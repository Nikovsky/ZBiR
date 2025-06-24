// @file: server/src/modules/user/dashboard/dashboard.service.ts
import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService, } from '@zbir/database';
import * as argon2 from 'argon2';
import { PublicUserAccountDto, UserRole, Gender, APIMessageResponse } from '@zbir/types';
import { UpdateUserDashboardDto } from './dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) { }

  async getUserDashboard(userId: string): Promise<PublicUserAccountDto> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { personalData: true },
    })

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role as UserRole,
      image: user.image,
      lastLoginAt: user.lastLoginAt,
      personalData: user.personalData
        ? {
          firstName: user.personalData.firstName,
          middleName: user.personalData.middleName,
          lastName: user.personalData.lastName,
          phoneNumber: user.personalData.phoneNumber,
          address: user.personalData.address,
          city: user.personalData.city,
          zipCode: user.personalData.zipCode,
          country: user.personalData.country,
          birthDate: user.personalData.birthDate,
          gender: user.personalData.gender as Gender,
        }
        : null,
    }
  }

  async updateUserData(userId: string, dto: UpdateUserDashboardDto): Promise<APIMessageResponse> {
    if (!dto) throw new BadRequestException('Brak danych do aktualizacji')

    const { username, name, personalData } = dto

    const userUpdateData: any = {}
    if (username !== undefined) userUpdateData.username = username
    if (name !== undefined) userUpdateData.name = name

    const personalUpdateData: any = {}
    for (const [key, value] of Object.entries(personalData)) {
      if (value === undefined || value === null) continue

      if (key === 'birthDate') {
        personalUpdateData.birthDate = new Date(value)
      } else {
        personalUpdateData[key] = value
      }
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...userUpdateData,
        ...(Object.keys(personalUpdateData).length > 0 && {
          personalData: {
            update: personalUpdateData,
          },
        }),
      },
    })

    return { message: 'Profile successful updated' }
  }

  async changeUserPassword(userId: string, dto: { currentPassword: string; newPassword: string }): Promise<APIMessageResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    })

    if (!user) { throw new BadRequestException('User not found.') }

    const isMatch = await argon2.verify(user.password, dto.currentPassword)
    if (!isMatch) { throw new ForbiddenException('Incorrect current password.') }

    const newPasswordHash = await argon2.hash(dto.newPassword)

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash },
    })

    return { message: 'Password updated successfully.' }
  }
}
