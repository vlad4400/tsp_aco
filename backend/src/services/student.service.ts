import { Injectable } from '@nestjs/common';
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
    return this.studentRepository.findOne(id);
  }

  async updateStudent(id: string, student: Student): Promise<Student> {
    return this.studentRepository.update(id, student);
  }

  async deleteStudent(id: string): Promise<any> {
    return this.studentRepository.delete(id);
  }
}
