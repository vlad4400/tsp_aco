import { Injectable, signal } from "@angular/core";

export type City = {
  x: number;
  y: number;
};

export type TcpCollection = 'berlin52' | 'att48';

@Injectable()
export class Tsplib95Service {
  cities = signal<City[]>([]);

  setCities(cities: City[]): void {
    this.cities.set(cities);
  }
}
