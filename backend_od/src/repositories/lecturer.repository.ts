import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lecturer, LecturerDocument } from 'src/schemas/lecturer.schema';

@Injectable()
export class LecturerRepository {
  constructor(
    @InjectModel(Lecturer.name)
    private readonly lecturerModel: Model<LecturerDocument>,
  ) {}

  async create(lecturer: Lecturer): Promise<Lecturer> {
    const createdLecturer = new this.lecturerModel(lecturer);
    return createdLecturer.save();
  }

  async findAll(): Promise<Lecturer[]> {
    return this.lecturerModel.find().exec();
  }

  async findOne(id: string): Promise<Lecturer> {
    return this.lecturerModel.findById(id).exec();
  }

  async update(id: string, lecturer: Lecturer): Promise<Lecturer> {
    return this.lecturerModel
      .findByIdAndUpdate(id, lecturer, { new: true })
      .exec();
  }

  async delete(id: string): Promise<any> {
    return this.lecturerModel.findByIdAndDelete(id).exec();
  }
}
