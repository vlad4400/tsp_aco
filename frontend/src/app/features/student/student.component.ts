import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-student",
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: ``,
})
export class StudentComponent {}
