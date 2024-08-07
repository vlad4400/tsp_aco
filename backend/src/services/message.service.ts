import { Injectable } from '@nestjs/common';
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
    return this.messageRepository.findOne(id);
  }

  async updateMessage(id: string, message: Message): Promise<Message> {
    return this.messageRepository.update(id, message);
  }

  async deleteMessage(id: string): Promise<any> {
    return this.messageRepository.delete(id);
  }
}
