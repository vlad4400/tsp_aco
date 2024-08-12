import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
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
    const student = await this.studentService.getStudentById(id);
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  @Put(':id')
  async updateStudent(
    @Param('id') id: string,
    @Body() student: Student,
  ): Promise<Student> {
    const updatedStudent = await this.studentService.updateStudent(id, student);
    if (!updatedStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return updatedStudent;
  }

  @Delete(':id')
  async deleteStudent(@Param('id') id: string): Promise<any> {
    const deletedStudent = await this.studentService.deleteStudent(id);
    if (!deletedStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return deletedStudent;
  }
}
