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
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AvatarModule } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { DataViewModule } from "primeng/dataview";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { RippleModule } from "primeng/ripple";
import { ToolbarModule } from "primeng/toolbar";
import { Lecturer } from "../../../lecturer/lecturer.interface";
import { LecturerService } from "../../../lecturer/lecturer.service";
import { SessionStorageKey } from "../../../session-storage-key.enum";
import { Student } from "../../../student/student.interface";
import { Message, MessageDTO } from "../../message.interface";
import { MessageService } from "../../message.service";
import { ProgressBarModule } from "primeng/progressbar";

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
    InputTextModule,
    InputTextareaModule,
    FormsModule,
    ProgressBarModule,
  ],
  template: `
    <div style="height: calc(100vh - 16px); overflow: hidden">
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

      <div class="body m-1 gap-1">
        <div class="sidebar border-round">
          <p>Wykładowcy</p>

          <p-dataView #dv [value]="lecturersView">
            <ng-template pTemplate="list" let-items>
              <div
                class="grid grid-nogutter"
                style="max-height: calc(100vh - 175px); overflow: auto"
              >
                <ng-container *ngFor="let item of items; let first = first">
                  <div
                    pRipple
                    class="col-12 cursor-pointer"
                    [class.surface-section]="
                      selectedLecturer()?._id === item._id
                    "
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
        <div class="main">
          <p>Powiadomienia</p>
          <ng-container *ngIf="!loading">
            <div
              *ngIf="!selectedLecturer()"
              class="text-color-secondary text-center"
            >
              Wybierz wykładowcę
            </div>
            <div
              *ngIf="selectedLecturer() && !messagesView.length"
              class="text-color-secondary text-center"
            >
              Brak powiadomień
            </div>
            <div *ngIf="selectedLecturer()" class="grid">
              <div class="col-12" *ngFor="let message of messagesView">
                <div
                  class="m-1 p-3 flex flex-column gap-1 surface-ground border-round"
                >
                  <div class="flex flex-row justify-content-between">
                    <div class="font-medium">{{ message.title }}</div>
                    <div class="right-side">
                      <div class="text-secondary">
                        {{ message.createdAt | date : "dd.MM.yyyy HH:mm" }}
                      </div>
                      <p-button
                        icon="pi pi-times"
                        [rounded]="true"
                        [text]="true"
                        severity="danger"
                        (onClick)="removeItem(message._id)"
                      />
                    </div>
                  </div>
                  <div class="text-justify">{{ message.details }}</div>
                </div>
              </div>
            </div>

            <!-- Fixed input section at the bottom -->
            <div
              *ngIf="selectedLecturer()"
              class="msg-send-box surface-ground border-round p-2"
            >
              <div class="grid">
                <div class="col-9 flex flex-column gap-2">
                  <input
                    type="text"
                    pInputText
                    [(ngModel)]="newMessageTitle"
                    placeholder="Tytuł powiadomienia"
                  />
                  <textarea
                    rows="3"
                    pInputTextarea
                    [(ngModel)]="newMessageDetails"
                    [autoResize]="true"
                    placeholder="Szczegóły powiadomienia"
                  ></textarea>
                </div>
                <div
                  class="
                  w-100
                  col-3
                  flex
                  flex-row
                  justify-content-start
                  align-items-end
                "
                >
                  <p-button
                    label="Wyślij"
                    icon="pi pi-send"
                    (onClick)="sendMessage()"
                  ></p-button>
                </div>
              </div>
            </div>
          </ng-container>

          <ng-container *ngIf="loading">
            <p-progressBar mode="indeterminate" [style]="{ height: '6px' }" />
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: `
    .body {
      display: grid;
      grid-template-columns: 250px 1fr;
      grid-gap: 1rem;
      height: calc(100vh - 16px);
      overflow: hidden;
    }
    .sidebar {
      overflow: auto;
      max-height: calc(100vh - 16px);
      width: 250px;
    }
    .main {
      overflow: hidden auto;
      max-height: calc(100vh - 250px);
      width: 100%;

      .right-side {
        display: flex;
        align-items: center;
      }
      
      .msg-send-box {
        position: fixed;
        bottom: 0;
        right: 0.75rem;
        width: calc(100% - 250px - 2 * 0.75rem - 15px);
      }
    }
  `,
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
  protected newMessageTitle = "";
  protected newMessageDetails = "";

  protected lecturersView = this.lecturers();
  protected messagesView = this.messages();

  protected loading = false;

  constructor() {
    effect(() => {
      this.lecturersView = this.lecturers();
    });

    effect(() => {
      this.messagesView = this.messages();
    });

    effect(() => {
      if (this.selectedLecturer()) {
        this.loadMessages();
      }
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

  protected sendMessage(): void {
    const lecturer = this.selectedLecturer();

    if (!lecturer || !this.newMessageTitle || !this.newMessageDetails) {
      return;
    }

    const message: MessageDTO = {
      title: this.newMessageTitle,
      details: this.newMessageDetails,
      student: this.currentUser()._id,
      lecturer: lecturer._id,
    };

    this.loading = true;
    this.messageService.createMessage(message).subscribe({
      next: (message) => {
        this.loading = false;
        this.messages.set([...this.messages(), message]);
        this.newMessageTitle = "";
        this.newMessageDetails = "";
      },
      error: (error: HttpErrorResponse) => {
        console.error("Failed to send message", error);
        this.loading = false;
      },
    });
  }

  protected removeItem(messageId: string): void {
    this.loading = true;
    this.messageService.deleteMessage(messageId).subscribe({
      next: () => {
        this.loading = false;
        this.messages.set(this.messages().filter((m) => m._id !== messageId));
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.error("Failed to remove message", error);
      },
    });
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

  private loadMessages(): void {
    this.loading = true;
    this.messageService
      .getMessageByStudentIdAndLecturerId(
        this.currentUser()._id,
        this.selectedLecturer()?._id || ""
      )
      .subscribe({
        next: (messages) => {
          this.messages.set(messages);
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.loading = false;
        },
      });
  }
}
