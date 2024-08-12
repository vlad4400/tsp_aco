import { Routes } from "@angular/router";
import { AdminPageComponent } from "./pages/admin-page/admin-page.component";
import { MessageComponent } from "./message.component";

export const routes: Routes = [
  {
    path: "",
    component: MessageComponent,
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
