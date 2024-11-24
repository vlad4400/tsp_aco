import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  appIsWorking(): string {
    return 'Backend is running!';
  }
}
