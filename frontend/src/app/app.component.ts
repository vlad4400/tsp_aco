import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { PrimeNGConfig } from "primeng/api";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  providers: [],
  template: `<router-outlet />`,
  styles: [],
})
export class AppComponent {
  private readonly primengConfig = inject(PrimeNGConfig);

  constructor() {
    this.primengConfig.ripple = true;
  }
}
