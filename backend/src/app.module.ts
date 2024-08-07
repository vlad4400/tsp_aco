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

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
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
