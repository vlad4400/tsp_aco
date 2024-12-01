import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { finalize } from 'rxjs';
import { CitiesComponent } from './components/cities/cities.component';
import { TcpCollection, Tsplib95Service } from './repositories/tcplib95.service';
import { TcpAcoService } from './tcp-aco.service';

interface CollectinOption extends MenuItem {
  value: TcpCollection;
}

@Component({
  selector: 'app-tcp-aco',
  standalone: true,
  imports: [CommonModule, CitiesComponent, ButtonModule, DropdownModule, FormsModule, SliderModule],
  template: `
    <app-cities @animationLeft [cities]="tcplib95Service.cities()" [path]="tcpAcoService.event()" [loading]="isRunning()"></app-cities>
    <div @animationRight class="control-panel">
      <h2>Ant Colony Optimization</h2>
      <div class="configs">
        <p-dropdown [(ngModel)]="selectedCollection" [options]="collections" [style]="{ width: '200px' }" (onChange)="onCollectionChanged($event)"></p-dropdown>
        <div class="config">
          <label for="alfa">Alfa: {{selectedAlfa}}</label>
          <p-slider styleClass="alfa" [(ngModel)]="selectedAlfa" [step]="0.1" [min]="0.1" [max]="5.0" />
        </div>
        <div class="config">
          <label for="beta">Beta {{selectedBeta}}</label>
          <p-slider styleClass="beta" [(ngModel)]="selectedBeta" [step]="0.1" [min]="1.0" [max]="10.0" />
        </div>
        <div class="config">
          <label for="evaporationRate">Evaporation Rate: {{selectedEvaporationRate}}</label>
          <p-slider styleClass="evaporationRate" [(ngModel)]="selectedEvaporationRate" [step]="0.1" [min]="0.1" [max]="0.8" />
        </div>
        <div class="config">
          <label for="antCount">Ant Count: <span [contentEditable]="true">{{selectedAntCount}}</span></label>
          <p-slider styleClass="antCount" [(ngModel)]="selectedAntCount" [step]="1" [min]="1" [max]="300" />
        </div>
        <div class="config">
          <label for="maxIterations">Max Iterations: <span [contentEditable]="true">{{selectedMaxIterations}}</span></label>
          <p-slider styleClass="maxIterations" [(ngModel)]="selectedMaxIterations" [step]="100" [min]="100" [max]="15000" />
        </div>
      </div>
      <div class="buttons">
        <p-button
          [loading]="request"
          [style]="{ width: '200px' }"
          [label]="isRunning() ? 'Stop' : 'Start'"
          (onClick)="switch()"
        ></p-button>
        <p-button
          [style]="{ width: '200px' }"
          [label]="'Reset'"
          (onClick)="reset()"
          [disabled]="isRunning() || request"
          [styleClass]="'p-button-secondary'"
        ></p-button>
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
      align-items: flex-start;
      gap: 20px;

      .control-panel {
        width: 240px;
        background-color: white;
        background-color: rgb(255, 230, 235, 0.5);
        border-radius: 15px;
        opacity: 0.9;
        backdrop-filter: blur(10px);
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

        .configs {
          display: flex;
          flex-direction: column;
          gap: 15px;

          .config {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
        }

        .buttons {
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
      }
    }
  `],
  animations: [
    trigger('animationLeft', [
      transition(':leave', [
        animate(
          '400ms ease-in',
          style({ transform: 'translateX(-100%)', opacity: 0 })
        ),
      ]),
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate(
          '400ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
    ]),
    trigger('animationRight', [
      transition(':leave', [
        animate(
          '400ms ease-in',
          style({ transform: 'translateX(100%)', opacity: 0 })
        ),
      ]),
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate(
          '400ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class TcpAcoComponent implements OnInit {

  protected collections: CollectinOption[] = [
    { label: 'Berlin52', value: 'berlin52' },
    { label: 'Att48', value: 'att48' },
  ];

  protected selectedCollection: TcpCollection = 'berlin52';
  protected selectedAlfa = 1.2;
  protected selectedBeta = 3.0;
  protected selectedEvaporationRate = 0.3;
  protected selectedAntCount = 50;
  protected selectedMaxIterations = 1500;

  protected request = false;

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

  protected switch() {
    if (this.isRunning()) {
      this.stop();
    } else {
      this.start();
    }
  }

  protected start() {
    this.request = true;
    this.tcpAcoService.startAlgorithm({
      collection: this.selectedCollection,
      alpha: this.selectedAlfa,
      beta: this.selectedBeta,
      evaporation: this.selectedEvaporationRate,
      ants: this.selectedAntCount,
      iterations: this.selectedMaxIterations,
    })
      .pipe(finalize(() => this.request = false))
      .subscribe();
  }

  protected stop() {
    this.request = true;
    this.tcpAcoService.stopAlgorithm()
      .pipe(finalize(() => this.request = false))
      .subscribe();
  }

  protected reset() {
    this.tcpAcoService.event.set(null);
    this.selectedAlfa = 1.2;
    this.selectedBeta = 3.0;
    this.selectedEvaporationRate = 0.3;
    this.selectedAntCount = 50;
    this.selectedMaxIterations = 1500;
  }
}
