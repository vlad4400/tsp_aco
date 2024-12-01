import { Routes } from "@angular/router";
import { AdminPageComponent } from "./pages/admin-page/admin-page.component";
import { ChoosePageComponent } from "./pages/choose-page/choose-page.component";
import { ProfilePageComponent } from "./pages/profile-page/profile-page.component";
import { StudentComponent } from "./student.component";

export const routes: Routes = [
  {
    path: "",
    component: StudentComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "choose",
      },
      {
        path: "choose",
        component: ChoosePageComponent,
      },
      {
        path: "profile",
        component: ProfilePageComponent,
      },
      {
        path: "admin",
        component: AdminPageComponent,
      },
      {
        path: "**",
        redirectTo: "choose",
      },
    ],
  },
];
