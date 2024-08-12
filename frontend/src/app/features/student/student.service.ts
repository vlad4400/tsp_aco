import { inject, Injectable } from "@angular/core";
import { urlAPI } from "../../app.config";
import { HttpClient } from "@angular/common/http";
import { Student, StudentDTO } from "./student.interface";

@Injectable({
  providedIn: "root",
})
export class StudentService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly studentsUrlAPI = urlAPI + "/students";

  createStudent(student: StudentDTO) {
    return this.http.post(this.studentsUrlAPI, student);
  }

  getStudents() {
    return this.http.get<Student[]>(this.studentsUrlAPI);
  }

  getStudent(id: string) {
    return this.http.get<Student>(`${this.studentsUrlAPI}/${id}`);
  }

  updateStudent(student: Student) {
    return this.http.put(`${this.studentsUrlAPI}/${student._id}`, student);
  }

  deleteStudent(id: string) {
    return this.http.delete(`${this.studentsUrlAPI}/${id}`);
  }
}
