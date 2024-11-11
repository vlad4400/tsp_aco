import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from '../schemas/student.schema';

@Injectable()
export class StudentRepository {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async create(student: Student): Promise<Student> {
    const createdStudent = new this.studentModel(student);
    return createdStudent.save();
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  async findOne(id: string): Promise<Student> {
    return this.studentModel.findById(id).exec();
  }

  async update(id: string, student: Student): Promise<Student> {
    return this.studentModel
      .findByIdAndUpdate(id, student, { new: true })
      .exec();
  }

  async delete(id: string): Promise<any> {
    return this.studentModel.findByIdAndDelete(id).exec();
  }
}
