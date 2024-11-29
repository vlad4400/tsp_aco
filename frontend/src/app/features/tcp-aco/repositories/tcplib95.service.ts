import { Injectable, signal } from "@angular/core";

export type City = {
  x: number;
  y: number;
};

@Injectable()
export class Tsplib95Service {
  cities = signal<City[]>([]);

  setBerlin52(cities: City[]): void {
    this.cities.set(cities);
  }
}
