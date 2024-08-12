import { Routes } from "@angular/router";
import { AdminPageComponent } from "./pages/admin-page/admin-page.component";
import { LecturerComponent } from "./lecturer.component";

export const routes: Routes = [
  {
    path: "",
    component: LecturerComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        component: AdminPageComponent,
      },
      {
        path: "**",
        redirectTo: "",
      },
    ],
  },
];
