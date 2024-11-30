import { CommonModule } from '@angular/common';
import { Component, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CitiesComponent } from './components/cities/cities.component';
import { TcpCollection, Tsplib95Service } from './repositories/tcplib95.service';
import { TcpAcoService } from './tcp-aco.service';

interface CollectinOption extends MenuItem {
  value: TcpCollection;
}

@Component({
  selector: 'app-tcp-aco',
  standalone: true,
  imports: [CommonModule, CitiesComponent, ButtonModule, DropdownModule, FormsModule],
  template: `
    <app-cities [cities]="tcplib95Service.cities()" [path]="tcpAcoService.event()" [loading]="isRunning()"></app-cities>
    <div class="control-panel">
      <h2>Ant Colony Optimization</h2>
      <p-dropdown [(ngModel)]="selectedCollection" [options]="collections" (onChange)="onCollectionChanged($event)"></p-dropdown>
      <div class="buttons">
        <p-button (onClick)="start()">Start</p-button>
        <p-button (onClick)="stop()">Stop</p-button>
      </div>
    </div>
  `,
  providers: [
    Tsplib95Service,
  ],
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      gap: 20px;

      .control-panel {
        width: 200px;
      }
    }
  `]
})
export class TcpAcoComponent implements OnInit {

  protected collections: CollectinOption[] = [
    { label: 'Berlin52', value: 'berlin52' },
    { label: 'Att48', value: 'att48' },
  ];

  protected selectedCollection: TcpCollection = 'berlin52';

  protected isRunning = computed(() => {
    const event = this.tcpAcoService.event();
    return event ? !event.finish : false;
  });

  constructor(
    protected tcpAcoService: TcpAcoService,
    protected tcplib95Service: Tsplib95Service,
  ) { }

  ngOnInit() {
    this.initCollection();
  }

  private initCollection() {
    this.onCollectionChanged({ value: this.selectedCollection });
  }

  protected onCollectionChanged({ value: collection }: { value: TcpCollection }) {
    this.tcpAcoService.getCities(collection).subscribe({
      next: (cities) => {
        this.tcplib95Service.setCities(cities);
      }
    });
  }

  protected start() {
    this.tcpAcoService.startAlgorithm(this.selectedCollection).subscribe();
  }

  protected stop() {
    this.tcpAcoService.stopAlgorithm().subscribe();
  }
}
