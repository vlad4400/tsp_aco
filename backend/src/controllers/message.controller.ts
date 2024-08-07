import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { Message } from '../schemas/message.schema';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async createMessage(@Body() message: Message): Promise<Message> {
    return this.messageService.createMessage(message);
  }

  @Get()
  async getAllMessages(): Promise<Message[]> {
    return this.messageService.getAllMessages();
  }

  @Get(':id')
  async getMessageById(@Param('id') id: string): Promise<Message> {
    return this.messageService.getMessageById(id);
  }

  @Put(':id')
  async updateMessage(
    @Param('id') id: string,
    @Body() message: Message,
  ): Promise<Message> {
    return this.messageService.updateMessage(id, message);
  }

  @Delete(':id')
  async deleteMessage(@Param('id') id: string): Promise<any> {
    return this.messageService.deleteMessage(id);
  }
}
