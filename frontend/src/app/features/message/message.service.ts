import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { urlAPI } from "../../app.config";
import { Message, MessageDTO } from "./message.interface";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly studentsUrlAPI = urlAPI + "/messages";

  createMessage(message: MessageDTO) {
    return this.http.post(this.studentsUrlAPI, message);
  }

  getMessages() {
    return this.http.get<Message[]>(this.studentsUrlAPI);
  }

  getMessage(id: string) {
    return this.http.get<Message>(`${this.studentsUrlAPI}/${id}`);
  }

  updateMessage(message: Message) {
    return this.http.put(`${this.studentsUrlAPI}/${message._id}`, message);
  }

  deleteMessage(id: string) {
    return this.http.delete(`${this.studentsUrlAPI}/${id}`);
  }
}
