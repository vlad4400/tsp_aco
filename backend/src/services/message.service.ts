import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageRepository } from '../repositories/message.repository';
import { Message } from '../schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async createMessage(message: Message): Promise<Message> {
    return this.messageRepository.create(message);
  }

  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.findAll();
  }

  async getMessageById(id: string): Promise<Message> {
    const message = await this.messageRepository.findOne(id);
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async updateMessage(id: string, message: Message): Promise<Message> {
    const updatedMessage = await this.messageRepository.update(id, message);
    if (!updatedMessage) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return updatedMessage;
  }

  async deleteMessage(id: string): Promise<any> {
    const deletedMessage = await this.messageRepository.delete(id);
    if (!deletedMessage) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return deletedMessage;
  }
}
