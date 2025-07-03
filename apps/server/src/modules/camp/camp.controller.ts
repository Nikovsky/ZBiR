import { Roles } from '@/decorators/roles.decorator';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@zbir/types';
import { CampService } from './camp.service';
import { CampQueryDto } from './camp.dto';
import { PaginationResponse, CampPanelDto } from '@zbir/types';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { JwtRequestUser } from '@/interfaces/jwt-request-user.interface';


@Controller('camp')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER, UserRole.SKARBNIK, UserRole.SKARBNIK_REGION, UserRole.ADMIN, UserRole.ROOT)
export class CampController {
  constructor(private readonly campService: CampService) { }

  // @Get()
  // async getCamps(
  //     @CurrentUser() user: JwtRequestUser,
  //     @Query() query: CampQueryDto
  // ): Promise<PaginationResponse<CampPanelDto>> {
  //         return this.campService.getCamps(user, query);
  // }

  // @Get(':id')
  // async getCampById(
  //     @Param('id') id: string): Promise<CampPanelDto> {
  //         return this.campService.getCampById(id);
  // }
}
