import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { ToolbarModule } from "primeng/toolbar";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { Student } from "../../student.interface";
import { StudentService } from "../../student.service";
import { DialogModule } from "primeng/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { InputNumber, InputNumberModule } from "primeng/inputnumber";

@Component({
  selector: "app-admin-page",
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

      <ng-template pTemplate="center"> Studenty </ng-template>

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
      header="Szczegóły studenta"
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
        <div class="field">
          <label for="age">Wiek</label>
          <p-inputNumber
            id="age"
            [(ngModel)]="item.age"
            mode="decimal"
            [showButtons]="true"
            inputId="minmax-buttons"
            [min]="12"
            [max]="120"
          />

          <small class="p-error" *ngIf="submitted && !item.age">
            Wiek jest wymagany
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
  private readonly studentService = inject(StudentService);
  private readonly students = signal<Student[]>([]);

  protected readonly cols: TableColumn<keyof Student>[] = [
    { field: "_id", header: "ID" },
    { field: "name", header: "Imię" },
    { field: "surname", header: "Nazwisko" },
    { field: "age", header: "Wiek" },
  ];

  protected rows = this.students();

  protected item: Partial<Student> = {};

  protected loading = false;

  protected displayDialog = false;
  protected submitted = false;

  constructor() {
    effect(() => {
      this.rows = this.students();
    });
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  protected openNew(): void {
    this.displayDialog = true;
  }

  protected hideDialog(): void {
    this.displayDialog = false;
  }

  protected saveItem(): void {
    this.submitted = true;

    if (!this.item.name || !this.item.surname || !this.item.age) {
      return;
    }

    if (this.item._id) {
      this.update(<Student>this.item);
    } else {
      this.create(<Omit<Student, "_id">>this.item);
    }
  }

  protected create(item: Omit<Student, "_id">): void {
    this.loading = true;
    this.studentService.createStudent(item).subscribe({
      next: (student) => {
        this.loading = false;
        this.students.set([...this.students(), student]);
        this.hideDialog();
      },
      error: (error: HttpErrorResponse) => {
        console.error("Failed to create student", error);
        this.loading = false;
      },
    });
  }

  protected update(item: Student): void {
    this.loading = true;
    this.studentService.updateStudent(item).subscribe({
      next: (student) => {
        this.loading = false;
        this.students.update((students) => {
          const index = students.findIndex((s) => s._id === student._id);

          return [
            ...students.slice(0, index),
            student,
            ...students.slice(index + 1),
          ];
        });
        this.hideDialog();
      },
      error: (error: HttpErrorResponse) => {
        console.error("Failed to update student", error);
        this.loading = false;
      },
    });
  }

  protected edit(item: Student): void {
    this.item = { ...item };
    this.displayDialog = true;
  }

  protected delete(item: Student): void {
    this.loading = true;
    this.studentService.deleteStudent(item._id).subscribe({
      next: () => {
        this.loading = false;
        this.students.update((students) =>
          students.filter((s) => s._id !== item._id)
        );
      },
      error: (error: HttpErrorResponse) => {
        console.error("Failed to delete student", error);
        this.loading = false;
      },
    });
  }

  private loadStudents(): void {
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
