import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LecturerDocument = Lecturer & Document;

@Schema()
export class Lecturer {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;
}

export const LecturerSchema = SchemaFactory.createForClass(Lecturer);
