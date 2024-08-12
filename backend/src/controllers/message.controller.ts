import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
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
    const message = await this.messageService.getMessageById(id);
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  @Put(':id')
  async updateMessage(
    @Param('id') id: string,
    @Body() message: Message,
  ): Promise<Message> {
    const updatedMessage = await this.messageService.updateMessage(id, message);
    if (!updatedMessage) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return updatedMessage;
  }

  @Delete(':id')
  async deleteMessage(@Param('id') id: string): Promise<any> {
    const deletedMessage = await this.messageService.deleteMessage(id);
    if (!deletedMessage) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return deletedMessage;
  }
}
