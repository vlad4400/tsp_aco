import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { urlAPI } from "../../app.config";
import { Lecturer, LecturerDTO } from "./lecturer.interface";

@Injectable({
  providedIn: "root",
})
export class LecturerService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly lecturersUrlAPI = `${urlAPI}/lecturers`;

  createLecturer(lecturer: LecturerDTO): Observable<Lecturer> {
    return this.http.post<Lecturer>(this.lecturersUrlAPI, lecturer);
  }

  getLecturers(): Observable<Lecturer[]> {
    return this.http.get<Lecturer[]>(this.lecturersUrlAPI);
  }

  getLecturer(id: string): Observable<Lecturer> {
    return this.http.get<Lecturer>(`${this.lecturersUrlAPI}/${id}`);
  }

  updateLecturer(lecturer: Lecturer): Observable<Lecturer> {
    return this.http.put<Lecturer>(
      `${this.lecturersUrlAPI}/${lecturer._id}`,
      lecturer
    );
  }

  deleteLecturer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.lecturersUrlAPI}/${id}`);
  }
}
