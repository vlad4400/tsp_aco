import { afterNextRender, Component, inject, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Student } from "../../student.interface";
import { StudentService } from "../../student.service";
import { first } from "rxjs";

@Component({
  selector: "app-choose-page",
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <p class="cursor">User 1</p>
    <p class="cursor">User 2</p>
    <p class="cursor">User 3</p>
  `,
  styles: ``,
})
export class ChoosePageComponent {
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
