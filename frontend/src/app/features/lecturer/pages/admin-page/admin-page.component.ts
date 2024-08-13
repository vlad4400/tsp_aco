import { Component } from "@angular/core";

import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { effect, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ToolbarModule } from "primeng/toolbar";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { Lecturer } from "../../lecturer.interface";
import { LecturerService } from "../../lecturer.service";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
  ],
  template: `
    <p-toolbar styleClass="mb-4 gap-2">
      <ng-template pTemplate="left">
        <p-button
          severity="primary"
          label="New"
          icon="pi pi-plus"
          class="mr-2"
          (onClick)="openNew()"
        />
      </ng-template>

      <ng-template pTemplate="center"> Wykładowcy </ng-template>

      <ng-template pTemplate="right"> </ng-template>
    </p-toolbar>
    <p-table
      styleClass="p-datatable-striped"
      [value]="rows"
      [columns]="cols"
      [loading]="loading"
    >
      <ng-template pTemplate="header" let-columns>
        <tr>
          <th *ngFor="let col of columns">
            {{ col.header }}
          </th>
          <th width="120"></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-rowData let-columns="columns">
        <tr>
          <td *ngFor="let col of columns">
            {{ rowData[col.field] }}
          </td>
          <td>
            <p-button
              icon="pi pi-pencil"
              class="mr-2"
              [rounded]="true"
              [outlined]="true"
              severity="secondary"
              (onClick)="edit(rowData)"
            />
            <p-button
              icon="pi pi-trash"
              severity="danger"
              [rounded]="true"
              [outlined]="true"
              (onClick)="delete(rowData)"
            />
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog
      [(visible)]="displayDialog"
      [style]="{ width: '450px' }"
      header="Szczegóły wykładowcy"
      [modal]="true"
      styleClass="p-fluid"
    >
      <ng-template pTemplate="content">
        <div class="field">
          <label for="name">Imię</label>
          <input
            type="text"
            pInputText
            id="name"
            [(ngModel)]="item.name"
            required
            autofocus
          />
          <small class="p-error" *ngIf="submitted && !item.name">
            Imię jest wymagane
          </small>
        </div>
        <div class="field">
          <label for="surname">Nazwisko</label>
          <input
            type="text"
            pInputText
            id="surname"
            [(ngModel)]="item.surname"
            required
            autofocus
          />
          <small class="p-error" *ngIf="submitted && !item.surname">
            Nazwisko jest wymagane
          </small>
        </div>
      </ng-template>

      <ng-template pTemplate="footer">
        <p-button
          label="Cancel"
          icon="pi pi-times"
          [text]="true"
          (onClick)="hideDialog()"
        />
        <p-button
          label="Save"
          icon="pi pi-check"
          [text]="true"
          (onClick)="saveItem()"
        />
      </ng-template>
    </p-dialog>
  `,
  styles: ``,
})
export class AdminPageComponent implements OnInit {
  private readonly lecturerSerivice = inject(LecturerService);
  private readonly lecturers = signal<Lecturer[]>([]);

  protected readonly cols: TableColumn<keyof Lecturer>[] = [
    { field: "_id", header: "ID" },
    { field: "name", header: "Imię" },
    { field: "surname", header: "Nazwisko" },
  ];

  protected rows = this.lecturers();

  protected item: Partial<Lecturer> = {};

  protected loading = false;

  protected displayDialog = false;
  protected submitted = false;

  constructor() {
    effect(() => {
      this.rows = this.lecturers();
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  protected openNew(): void {
    this.item = {};
    this.displayDialog = true;
  }

  protected hideDialog(): void {
    this.displayDialog = false;
  }

  protected saveItem(): void {
    this.submitted = true;

    if (!this.item.name || !this.item.surname) {
      return;
    }

    if (this.item._id) {
      this.update(<Lecturer>this.item);
    } else {
      this.create(<Omit<Lecturer, "_id">>this.item);
    }
  }

  protected create(item: Omit<Lecturer, "_id">): void {
    this.loading = true;
    this.lecturerSerivice.createLecturer(item).subscribe({
      next: (lecturer) => {
        this.loading = false;
        this.lecturers.set([...this.lecturers(), lecturer]);
        this.hideDialog();
      },
      error: (error: HttpErrorResponse) => {
        console.error("Failed to create lecturer", error);
        this.loading = false;
      },
    });
  }

  protected update(item: Lecturer): void {
    this.loading = true;
    this.lecturerSerivice.updateLecturer(item).subscribe({
      next: (lecturer) => {
        this.loading = false;
        this.lecturers.update((lecturers) => {
          const index = lecturers.findIndex((s) => s._id === lecturer._id);

          return [
            ...lecturers.slice(0, index),
            lecturer,
            ...lecturers.slice(index + 1),
          ];
        });
        this.hideDialog();
      },
      error: (error: HttpErrorResponse) => {
        console.error("Failed to update lecturer", error);
        this.loading = false;
      },
    });
  }

  protected edit(item: Lecturer): void {
    this.item = { ...item };
    this.displayDialog = true;
  }

  protected delete(item: Lecturer): void {
    this.loading = true;
    this.lecturerSerivice.deleteLecturer(item._id).subscribe({
      next: () => {
        this.loading = false;
        this.lecturers.update((lecturers) =>
          lecturers.filter((s) => s._id !== item._id)
        );
      },
      error: (error: HttpErrorResponse) => {
        console.error("Failed to delete lecturer", error);
        this.loading = false;
      },
    });
  }

  private loadItems(): void {
    this.loading = true;
    this.lecturerSerivice.getLecturers().subscribe({
      next: (lecturers) => {
        this.loading = false;
        this.lecturers.set(lecturers);
      },
      error: (error: HttpErrorResponse) => {
        console.error("Failed to load lecturers", error);
        this.loading = false;
      },
    });
  }
}
