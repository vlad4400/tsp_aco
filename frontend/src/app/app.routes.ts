import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", redirectTo: "students", pathMatch: "full" },
  {
    path: "students",
    loadComponent: () =>
      import("./features/student/student.component").then(
        (m) => m.StudentComponent
      ),
  },
  {
    path: "lecturer",
    loadComponent: () =>
      import("./features/lecturer/lecturer.component").then(
        (m) => m.LecturerComponent
      ),
  },
  {
    path: "messages",
    loadComponent: () =>
      import("./features/message/message.component").then(
        (m) => m.MessageComponent
      ),
  },
];
