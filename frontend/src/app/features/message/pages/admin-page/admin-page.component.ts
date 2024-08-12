import { Component, inject, signal } from "@angular/core";
import { Message } from "../../message.interface";
import { MessageService } from "../../message.service";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-admin-page",
  standalone: true,
  imports: [CommonModule],
  template: `
    Message admin 2
    <ng-container *ngFor="let message of messages(); let i = index">
      Message[i]
    </ng-container>
  `,
  styles: ``,
})
export class AdminPageComponent {
  private readonly messageService = inject(MessageService);

  protected readonly messages = signal<Message[]>([]);

  constructor() {
    // this.messageService.getMessages().subscribe((messages) => {
    //   console.log("messages", messages);
    //   this.messages.set(messages);
    // });

    // this.messageService.createMessage({
    //   content: "Hello, World!",

    // });
  }
}
