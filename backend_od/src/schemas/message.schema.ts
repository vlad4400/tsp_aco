import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Student } from './student.schema';
import { Lecturer } from './lecturer.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  details: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: Student.name, required: true })
  student: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Lecturer.name, required: true })
  lecturer: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
