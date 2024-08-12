import { Routes } from "@angular/router";
import { ChoosePageComponent } from "./pages/choose-page/choose-page.component";
import { ProfilePageComponent } from "./pages/profile-page/profile-page.component";
import { AdminPageComponent } from "./pages/admin-page/admin-page.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
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
];
