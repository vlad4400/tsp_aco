import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LecturerController } from './controllers/lecturer.controller';
import { MessageController } from './controllers/message.controller';
import { StudentController } from './controllers/student.controller';
import { LecturerRepository } from './repositories/lecturer.repository';
import { MessageRepository } from './repositories/message.repository';
import { StudentRepository } from './repositories/student.repository';
import { Lecturer, LecturerSchema } from './schemas/lecturer.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { Student, StudentSchema } from './schemas/student.schema';
import { LecturerService } from './services/lecturer.service';
import { MessageService } from './services/message.service';
import { StudentService } from './services/student.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Lecturer.name, schema: LecturerSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [
    AppController,
    StudentController,
    LecturerController,
    MessageController,
  ],
  providers: [
    AppService,
    StudentService,
    LecturerService,
    MessageService,
    StudentRepository,
    LecturerRepository,
    MessageRepository,
  ],
})
export class AppModule {}
