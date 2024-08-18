import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/schemas/message.schema';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(message: Message): Promise<Message> {
    const createdMessage = new this.messageModel(message);
    return createdMessage.save();
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel
      .find()
      .populate('student')
      .populate('lecturer')
      .exec();
  }

  async findOne(id: string): Promise<Message> {
    return this.messageModel
      .findById(id)
      .populate('student')
      .populate('lecturer')
      .exec();
  }

  async findByStudentIdAndLecturerId(
    studentId: string,
    lecturerId: string,
  ): Promise<Message[]> {
    return this.messageModel
      .find({ student: studentId, lecturer: lecturerId })
      .exec();
  }

  async update(id: string, message: Message): Promise<Message> {
    return this.messageModel
      .findByIdAndUpdate(id, message, { new: true })
      .exec();
  }

  async delete(id: string): Promise<any> {
    return this.messageModel.findByIdAndDelete(id).exec();
  }
}
