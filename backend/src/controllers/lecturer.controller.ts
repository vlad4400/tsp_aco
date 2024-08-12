import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { LecturerService } from '../services/lecturer.service';
import { Lecturer } from 'src/schemas/lecturer.schema';

@Controller('lecturers')
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @Post()
  async createLecturer(@Body() lecturer: Lecturer): Promise<Lecturer> {
    return this.lecturerService.createLecturer(lecturer);
  }

  @Get()
  async getAllLecturers(): Promise<Lecturer[]> {
    return this.lecturerService.getAllLecturers();
  }

  @Get(':id')
  async getLecturerById(@Param('id') id: string): Promise<Lecturer> {
    return this.lecturerService.getLecturerById(id);
  }

  @Put(':id')
  async updateLecturer(
    @Param('id') id: string,
    @Body() lecturer: Lecturer,
  ): Promise<Lecturer> {
    return this.lecturerService.updateLecturer(id, lecturer);
  }

  @Delete(':id')
  async deleteLecturer(@Param('id') id: string): Promise<any> {
    return this.lecturerService.deleteLecturer(id);
  }
}
