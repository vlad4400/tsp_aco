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
import { ButtonModule } from "primeng/button";
import { ToolbarModule } from "primeng/toolbar";
import { Lecturer } from "../../../lecturer/lecturer.interface";
import { LecturerService } from "../../../lecturer/lecturer.service";
import { Student } from "../../../student/student.interface";
import { Message } from "../../message.interface";
import { MessageService } from "../../message.service";
import { SessionStorageKey } from "../../../session-storage-key.enum";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin-page",
  standalone: true,
  imports: [CommonModule, ToolbarModule, ButtonModule],
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
  `,
  styles: ``,
})
export class AdminPageComponent implements OnInit {
  private readonly router = inject(Router);

  private readonly user = signal<Student>(
    JSON.parse(sessionStorage.getItem(SessionStorageKey.User) || "{}")
  );
  protected userFullName = computed(() => {
    return `${this.user().name} ${this.user().surname}`;
  });

  private readonly lecturerSerivice = inject(LecturerService);
  private readonly lecturers = signal<Lecturer[]>([]);

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
    this.router.navigate(['/']);
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
