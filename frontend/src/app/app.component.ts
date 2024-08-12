import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  providers: [],
  template: `<router-outlet />`,
  styles: [],
})
export class AppComponent {}
