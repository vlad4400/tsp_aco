import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { urlAPI } from "../../app.config";
import { Student, StudentDTO } from "./student.interface";

@Injectable({
  providedIn: "root",
})
export class StudentService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly studentsUrlAPI = `${urlAPI}/students`;

  createStudent(student: StudentDTO): Observable<Student> {
    return this.http.post<Student>(this.studentsUrlAPI, student);
  }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.studentsUrlAPI);
  }

  getStudent(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.studentsUrlAPI}/${id}`);
  }

  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.studentsUrlAPI}/${student._id}`, student);
  }

  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.studentsUrlAPI}/${id}`);
  }
}
