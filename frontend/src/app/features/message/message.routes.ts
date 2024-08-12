import { Routes } from "@angular/router";
import { AdminPageComponent } from "./pages/admin-page/admin-page.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: AdminPageComponent,
  },
];
