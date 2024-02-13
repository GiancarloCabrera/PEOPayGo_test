import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import EmployeeService from './employee.service';
import CreateEmployeeDto from './dto/create-employee.dto';
import { ManageEmployeeGuard } from 'src/auth/guards/mange-employ.guard';
import EditEmployeeDto from './dto/edit-employee.dto';

@ApiTags('Employee')
@ApiHeader({
  name: 'access_token',
  required: true
})
@Controller('employee')
@UseGuards(AuthGuard, RolesGuard, ManageEmployeeGuard)
export default class EmployeeController {
  constructor(private employeeService: EmployeeService) { }

  @Post()
  public async createEmployee(@Body() employee: CreateEmployeeDto) {
    return await this.employeeService.createEmployee(employee);
  }

  @Delete(':id')
  public async deleteEmployee(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.deleteEmployee(id);
  }

  @Put(':id')
  public async editEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: EditEmployeeDto,
  ) {
    return this.employeeService.editEmployee(id, user);
  }

  @Get('/list/:clientId')
  public async getEmployeesList(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Param('clientId', ParseIntPipe) clientId: number
  ) {
    return this.employeeService.getEmployeesList(page, limit, clientId);
  }

  @Get(':id')
  public async getEmployeeById(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.getEmployeeById(id);
  }
}
