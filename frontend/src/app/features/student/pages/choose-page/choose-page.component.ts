import { CommonModule, isPlatformBrowser } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, effect, Inject, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { AvatarModule } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { DataViewModule } from "primeng/dataview";
import { ProgressBarModule } from "primeng/progressbar";
import { RippleModule } from "primeng/ripple";
import { ToolbarModule } from "primeng/toolbar";
import { SessionStorageKey } from "../../../session-storage-key.enum";
import { Student } from "../../student.interface";
import { StudentService } from "../../student.service";

@Component({
  selector: "app-choose-page",
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    DataViewModule,
    ToolbarModule,
    ButtonModule,
    AvatarModule,
    RippleModule,
    ProgressBarModule,
  ],
  template: `
    <p-toolbar styleClass="mb-4 gap-2">
      <ng-template pTemplate="left"> </ng-template>

      <ng-template pTemplate="center"> Wybór studenta </ng-template>

      <ng-template pTemplate="right"> </ng-template>
    </p-toolbar>
    <div class="card">
      <p-dataView *ngIf="!loading" #dv [value]="rows">
        <ng-template pTemplate="list" let-items>
          <div class="grid grid-nogutter">
            <div
              pRipple
              *ngFor="let item of items; let first = first"
              class="col-12 cursor-pointer"
              (click)="selectStudent(item)"
            >
              <div
                class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
                [ngClass]="{ 'border-top-1 surface-border': !first }"
              >
                <div class="md:w-10rem relative">
                  <p-avatar
                    [label]="item.name[0]"
                    styleClass="mr-2"
                    size="xlarge"
                  />
                </div>
                <div
                  class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4"
                >
                  <div
                    class="flex flex-row md:flex-column justify-content-between align-items-start gap-2"
                  >
                    <div>
                      <span class="font-medium text-secondary text-sm">{{
                        item.category
                      }}</span>
                      <div class="text-lg font-medium text-900 mt-2">
                        {{ item.name }} {{ item.surname }}
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-column md:align-items-end gap-5">
                    <span class="text-xl font-semibold text-900">
                      {{ item.age }} lat
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ng-template>
      </p-dataView>

      <ng-container *ngIf="loading">
        <p-progressBar mode="indeterminate" [style]="{ height: '6px' }" />
      </ng-container>
    </div>
  `,
  styles: `
    .card {
      margin: 0 auto;
      max-width: 600px;
    }
  `,
})
export class ChoosePageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly studentService = inject(StudentService);

  protected readonly students = signal<Student[]>([]);

  protected rows = this.students();
  protected loading = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    effect(() => {
      this.rows = this.students();
    });
  }

  protected selectStudent(student: Student): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(SessionStorageKey.User, JSON.stringify(student));
    }
    this.router.navigate(["message"]);
  }

  ngOnInit(): void {
    this.loadItems();
  }

  private loadItems(): void {
    this.loading = true;
    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.loading = false;
        this.students.set(students);
      },
      error: (error: HttpErrorResponse) => {
        console.error("Failed to load students", error);
        this.loading = false;
      },
    });
  }
}
