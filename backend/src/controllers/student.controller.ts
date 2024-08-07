import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Student } from '../schemas/student.schema';
import { StudentService } from '../services/student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async createStudent(@Body() student: Student): Promise<Student> {
    return this.studentService.createStudent(student);
  }

  @Get()
  async getAllStudents(): Promise<Student[]> {
    return this.studentService.getAllStudents();
  }

  @Get(':id')
  async getStudentById(@Param('id') id: string): Promise<Student> {
    return this.studentService.getStudentById(id);
  }

  @Put(':id')
  async updateStudent(
    @Param('id') id: string,
    @Body() student: Student,
  ): Promise<Student> {
    return this.studentService.updateStudent(id, student);
  }

  @Delete(':id')
  async deleteStudent(@Param('id') id: string): Promise<any> {
    return this.studentService.deleteStudent(id);
  }
}
