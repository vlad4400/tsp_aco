import { afterNextRender, Component, inject, signal } from "@angular/core";
import { StudentService } from "./student.service";
import { CommonModule } from "@angular/common";
import { Student } from "./student.interface";
import { first } from "rxjs";
import { routes } from "./student.routes";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-student",
  standalone: true,
  // imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [],
  template: ` <p></p> `,
  styles: ``,
})
export class StudentComponent {
  private readonly studentService = inject(StudentService);
  protected readonly students = signal<Student[]>([]);

  constructor() {
    // setInterval(() => {
    //   this.studentService
    //     .getStudents()
    //     .pipe(first())
    //     .subscribe((students) => {
    //       console.log("students", students);
    //       this.students.set(students);
    //     });
    // }, 5000);
    afterNextRender(() => {
      this.studentService
        .getStudents()
        .pipe(first())
        .subscribe((students) => {
          console.log("students 3", students);
          this.students.set(students);
        });

      // setInterval(() => {
      //   this.studentService
      //     .getStudents()
      //     .pipe(first())
      //     .subscribe((students) => {
      //       console.log("students 4", students);
      //       this.students.set(students);
      //     });
      // }, 5000);
    });

    this.studentService
      .getStudents()
      .pipe(first())
      .subscribe((students) => {
        console.log("students 1", students);
        this.students.set(students);
      });

    this.studentService
      .getStudents()
      .pipe(first())
      .subscribe((students) => {
        console.log("students 2", students);
      });

    // this.studentService
    //   .createStudent({
    //     name: "John Doe",
    //     email: "jdoe@mail.com",
    //     course: "Computer Science",
    //   })
    //   .subscribe();
  }
}
