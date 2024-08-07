import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentController } from './controllers/student.controller';
import { MessageController } from './controllers/message.controller';
import { StudentService } from './services/student.service';
import { MessageService } from './services/message.service';
import { StudentRepository } from './repositories/student.repository';
import { MessageRepository } from './repositories/message.repository';
import { Student, StudentSchema } from './schemas/student.schema';
import { Message, MessageSchema } from './schemas/message.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [AppController, StudentController, MessageController],
  providers: [
    AppService,
    StudentService,
    MessageService,
    StudentRepository,
    MessageRepository,
  ],
})
export class AppModule {}
