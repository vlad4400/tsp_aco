import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { urlAPI } from "../../app.config";
import { Message, MessageDTO } from "./message.interface";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly messagesUrlAPI = `${urlAPI}/messages`;

  createMessage(message: MessageDTO): Observable<Message> {
    return this.http.post<Message>(this.messagesUrlAPI, message);
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.messagesUrlAPI);
  }

  getMessage(id: string): Observable<Message> {
    return this.http.get<Message>(`${this.messagesUrlAPI}/${id}`);
  }

  getMessageByStudentIdAndLecturerId(
    studentId: string,
    lecturerId: string
  ): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.messagesUrlAPI}/search`, {
      params: { studentId, lecturerId },
    });
  }

  updateMessage(message: Message): Observable<Message> {
    return this.http.put<Message>(
      `${this.messagesUrlAPI}/${message._id}`,
      message
    );
  }

  deleteMessage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.messagesUrlAPI}/${id}`);
  }
}
