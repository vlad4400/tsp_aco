import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentRepository } from '../repositories/student.repository';
import { Student } from '../schemas/student.schema';

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async createStudent(student: Student): Promise<Student> {
    return this.studentRepository.create(student);
  }

  async getAllStudents(): Promise<Student[]> {
    return this.studentRepository.findAll();
  }

  async getStudentById(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne(id);
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async updateStudent(id: string, student: Student): Promise<Student> {
    const updatedStudent = await this.studentRepository.update(id, student);
    if (!updatedStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return updatedStudent;
  }

  async deleteStudent(id: string): Promise<any> {
    const deletedStudent = await this.studentRepository.delete(id);
    if (!deletedStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return deletedStudent;
  }
}
