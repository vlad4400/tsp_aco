import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", redirectTo: "student", pathMatch: "full" },
  {
    path: "student",
    loadChildren: () =>
      import("./features/student/student.routes").then((m) => m.routes),
  },
  {
    path: "lecturer",
    loadChildren: () =>
      import("./features/lecturer/lecturer.routes").then((m) => m.routes),
  },
  {
    path: "message",
    loadChildren: () =>
      import("./features/message/message.routes").then((m) => m.routes),
  },
  {
    path: "**",
    redirectTo: "student",
  },
];
