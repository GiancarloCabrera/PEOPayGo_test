import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { TimesheetService } from './timesheet.service';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { TimesheetAccessGuard } from 'src/auth/guards/timesheet-access.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { EditTimesheetDto } from './dto/edit-timesheet.dto';

@ApiTags('Timsheet')
@ApiHeader({
  name: 'access_token',
  required: true
})
@Controller('timesheet')
@UseGuards(AuthGuard, RolesGuard, TimesheetAccessGuard)
export class TimesheetController {
  constructor(private timesheetService: TimesheetService) { }

  @Roles('CLIENT')
  @Post()
  public async createTimesheet(@Body() timesheet: CreateTimesheetDto) {
    return await this.timesheetService.createTimesheet(timesheet);
  }

  @Roles('CLIENT')
  @Put(':id')
  public async editTimesheet(
    @Param('id', ParseIntPipe) id: number,
    @Body() timesheet: EditTimesheetDto,
  ) {
    return await this.timesheetService.editTimesheet(id, timesheet);
  }

  @Get('/:id')
  public async getTimesheetById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.timesheetService.getTimesheetById(id);
  }

  @Get('/list/:clientId')
  public async getTimesheetListByClientId(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.timesheetService.getTimesheetListByClientId(page, limit, clientId);
  }
}
