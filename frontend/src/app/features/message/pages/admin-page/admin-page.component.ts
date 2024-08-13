import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { AvatarModule } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { DataViewModule } from "primeng/dataview";
import { RippleModule } from "primeng/ripple";
import { ToolbarModule } from "primeng/toolbar";
import { Lecturer } from "../../../lecturer/lecturer.interface";
import { LecturerService } from "../../../lecturer/lecturer.service";
import { SessionStorageKey } from "../../../session-storage-key.enum";
import { Student } from "../../../student/student.interface";
import { Message } from "../../message.interface";
import { MessageService } from "../../message.service";

@Component({
  selector: "app-admin-page",
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    DataViewModule,
    AvatarModule,
    RippleModule,
  ],
  template: `
    <p-toolbar styleClass="mb-4 gap-2">
      <ng-template pTemplate="left">{{ userFullName() }}</ng-template>

      <ng-template pTemplate="center"> Powiadomienia </ng-template>

      <ng-template pTemplate="right">
        <p-button
          label="Wyloguj"
          icon="pi pi-sign-out"
          outlined="true"
          (onClick)="exit()"
        />
      </ng-template>
    </p-toolbar>

    <div class="grid m-1 gap-1">
      <div class="col-4 surface-ground border-round">
        <p>Wykładowcy</p>

        <p-dataView #dv [value]="lecturersView">
          <ng-template pTemplate="list" let-items>
            <div class="grid grid-nogutter">
              <ng-container *ngFor="let item of items; let first = first">
                <div
                  class="col-12 cursor-pointer"
                  [class.surface-50]="
                    selectedLecturer()
                      ? selectedLecturer()?._id === item._id
                      : first
                  "
                  pRipple
                  (click)="selectLecturer(item)"
                >
                  <div
                    class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
                    [ngClass]="{ 'border-top-1 surface-border': !first }"
                  >
                    <div class="">
                      <p-avatar [label]="item.name[0]" size="normal" />
                    </div>
                    <div class="">{{ item.name }} {{ item.surname }}</div>
                  </div>
                </div>
              </ng-container>
            </div>
          </ng-template>
        </p-dataView>
      </div>
      <div class="col-7">
        <p>Powiadomienia</p>
        <div class="grid">
          <div
            class="col-12 surface-ground border-round p-4"
            *ngFor="let message of messagesView"
          >
            <div class="flex flex-column gap-1">
              <div class="flex flex-row justify-content-between">
                <div class="font-medium">{{ message.title }}</div>
                <div class="text-secondary">
                  {{ message.lecturer.name }} {{ message.lecturer.surname }}
                </div>
              </div>
              <div class="text-justify">{{ message.details }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class AdminPageComponent implements OnInit {
  private readonly router = inject(Router);

  private readonly currentUser = signal<Student>(
    JSON.parse(sessionStorage.getItem(SessionStorageKey.User) || "{}")
  );
  protected userFullName = computed(() => {
    return `${this.currentUser().name} ${this.currentUser().surname}`;
  });

  private readonly lecturerSerivice = inject(LecturerService);
  private readonly lecturers = signal<Lecturer[]>([]);
  protected readonly selectedLecturer = signal<Lecturer | null>(null);

  private readonly messageService = inject(MessageService);
  protected readonly messages = signal<Message[]>([]);

  protected lecturersView = this.lecturers();
  protected messagesView = this.messages();

  private loading = false;

  constructor() {
    effect(() => {
      this.lecturersView = this.lecturers();
      this.messagesView = this.messages();
    });
  }

  ngOnInit(): void {
    this.loadLecturers();
  }

  protected exit(): void {
    sessionStorage.removeItem(SessionStorageKey.User);
    this.router.navigate(["/"]);
  }

  protected selectLecturer(lecturer: Lecturer): void {
    this.selectedLecturer.set(lecturer);
  }

  private loadLecturers(): void {
    this.loading = true;
    this.lecturerSerivice.getLecturers().subscribe({
      next: (lecturers) => {
        this.lecturers.set(lecturers);
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.loading = false;
      },
    });
  }
}
