import { Injectable, NotFoundException } from '@nestjs/common';
import { LecturerRepository } from 'src/repositories/lecturer.repository';
import { Lecturer } from 'src/schemas/lecturer.schema';

@Injectable()
export class LecturerService {
  constructor(private readonly lecturerRepository: LecturerRepository) {}

  async createLecturer(lecturer: Lecturer): Promise<Lecturer> {
    return this.lecturerRepository.create(lecturer);
  }

  async getAllLecturers(): Promise<Lecturer[]> {
    return this.lecturerRepository.findAll();
  }

  async getLecturerById(id: string): Promise<Lecturer> {
    const lecturer = await this.lecturerRepository.findOne(id);
    if (!lecturer) {
      throw new NotFoundException(`Lecturer with ID ${id} not found`);
    }
    return lecturer;
  }

  async updateLecturer(id: string, lecturer: Lecturer): Promise<Lecturer> {
    const updatedLecturer = await this.lecturerRepository.update(id, lecturer);
    if (!updatedLecturer) {
      throw new NotFoundException(`Lecturer with ID ${id} not found`);
    }
    return updatedLecturer;
  }

  async deleteLecturer(id: string): Promise<any> {
    const deletedLecturer = await this.lecturerRepository.delete(id);
    if (!deletedLecturer) {
      throw new NotFoundException(`Lecturer with ID ${id} not found`);
    }
    return deletedLecturer;
  }
}
