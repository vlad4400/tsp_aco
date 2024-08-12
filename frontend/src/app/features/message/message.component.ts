import { Component, inject, signal } from "@angular/core";
import { urlAPI } from "../../app.config";
import { MessageService } from "./message.service";
import { CommonModule } from "@angular/common";
import { Message } from "./message.interface";
import { HttpClient } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";

@Component({
  selector: "app-message",
  standalone: true,
  imports: [BrowserModule],
  providers: [],
  template: `
    <p>
      message works!
      <ng-container *ngFor="let message of messages()"></ng-container>
    </p>
  `,
  styles: ``,
})
export class MessageComponent {
  private readonly messageService = inject(MessageService);

  protected readonly messages = signal<Message[]>([]);

  constructor() {
    this.messageService.getMessages().subscribe((messages) => {
      console.log("messages", messages);
      this.messages.set(messages);
    });

    // this.messageService.createMessage({
    //   content: "Hello, World!",

    // });
  }
}
