import { Component, OnInit, inject, DestroyRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import {
  StudentSearchRequestDto,
  StudentResponseDto,
  LibraryCardUpdateRequestDto,
  LibraryCardAudit,
  OptionItem,
} from "../../../shared/models/library-student.model";

@Component({
  selector: "app-library-student-members",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./add-student.component.html",
})
export class AddStudentComponent implements OnInit {
  private readonly baseUrl = "/api/library/students";

  // Injection tokens
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  // Forms
  searchForm!: FormGroup;
  assignCardForm!: FormGroup;

  // Data
  students: StudentResponseDto[] = [];
  filteredStudents: StudentResponseDto[] = [];
  auditLogs: LibraryCardAudit[] = [];

  // Options
  classes: OptionItem[] = [
    { id: 1, name: "Class 1" },
    { id: 2, name: "Class 2" },
    { id: 3, name: "Class 3" },
  ];

  sections: OptionItem[] = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
    { id: 3, name: "C" },
  ];

  // UI State Controls
  isLoading = false;
  tableSearchText = "";
  pageSize = 50;

  // Modals state
  selectedStudent: StudentResponseDto | null = null;
  showAssignModal = false;
  showAuditModal = false;

  ngOnInit(): void {
    this.initForms();
    this.onSearch();
  }

  private initForms(): void {
    this.searchForm = this.fb.group({
      classId: [1, [Validators.required]],
      sectionId: [1],
    });

    this.assignCardForm = this.fb.group({
      libraryCardNo: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z0-9_-]+$")],
      ],
    });
  }

  // 1. POST /api/library/students/search
  onSearch(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload: StudentSearchRequestDto = this.searchForm.value;

    this.http
      .post<StudentResponseDto[]>(`${this.baseUrl}/search`, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.students = data;
          this.applyTableFilter();
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Failed to fetch students:", err);
          this.isLoading = false;
          this.loadMockData();
        },
      });
  }

  // Table Filter Strategy
  onTableSearch(term: string): void {
    this.tableSearchText = term.trim().toLowerCase();
    this.applyTableFilter();
  }

  applyTableFilter(): void {
    if (!this.tableSearchText) {
      this.filteredStudents = [...this.students];
      return;
    }

    this.filteredStudents = this.students.filter((student) =>
      [
        student.studentName,
        student.admissionNo,
        student.libraryCardNo,
        student.fatherName,
      ].some((field) => field?.toLowerCase().includes(this.tableSearchText)),
    );
  }

  // Modal Handlers: Assign Card
  openAssignModal(student: StudentResponseDto): void {
    this.selectedStudent = student;
    this.assignCardForm.reset({
      libraryCardNo: student.libraryCardNo || "",
    });
    this.showAssignModal = true;
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.selectedStudent = null;
    this.assignCardForm.reset();
  }

  // 2. PATCH /api/library/students/{id}/library-card
  submitLibraryCard(): void {
    if (this.assignCardForm.invalid || !this.selectedStudent) {
      this.assignCardForm.markAllAsTouched();
      return;
    }

    const payload: LibraryCardUpdateRequestDto = this.assignCardForm.value;
    const studentId = this.selectedStudent.id;

    this.http
      .patch<StudentResponseDto>(
        `${this.baseUrl}/${studentId}/library-card`,
        payload,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedStudent) => {
          const index = this.students.findIndex((s) => s.id === studentId);
          if (index !== -1) {
            this.students[index] = {
              ...this.students[index],
              ...updatedStudent,
            };
            this.applyTableFilter();
          }
          this.closeAssignModal();
        },
        error: (err) => {
          console.error("Failed to update library card:", err);
        },
      });
  }

  // 3. GET /api/library/students/{id}/audit
  openAuditLogs(student: StudentResponseDto): void {
    this.selectedStudent = student;

    this.http
      .get<LibraryCardAudit[]>(`${this.baseUrl}/${student.id}/audit`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (logs) => {
          this.auditLogs = logs;
          this.showAuditModal = true;
        },
        error: (err) => {
          console.error("Failed to fetch audit logs:", err);
          this.auditLogs = [
            {
              id: 1,
              studentId: student.id,
              oldLibraryCardNo: "NONE",
              newLibraryCardNo: student.libraryCardNo,
              updatedBy: "Librarian Admin",
              updatedAt: "2026-03-15 10:30 AM",
            },
          ];
          this.showAuditModal = true;
        },
      });
  }

  closeAuditModal(): void {
    this.showAuditModal = false;
    this.auditLogs = [];
    this.selectedStudent = null;
  }

  private loadMockData(): void {
    this.students = [
      {
        id: 1,
        memberId: 59,
        libraryCardNo: "4532",
        admissionNo: "1800011",
        studentName: "Edward Thomas",
        className: "Class 1(A)",
        fatherName: "Olivier Thomas",
        dateOfBirth: "04/08/2020",
        gender: "Male",
        mobileNumber: "98262573272",
        admissionNumber: undefined,
        firstName: undefined,
        middleName: undefined,
        lastName: undefined,
        mobileNo: undefined,
        rollNumber: undefined,
        bloodGroup: undefined,
        category: undefined,
        religion: undefined,
        house: undefined,
        email: undefined,
        fatherPhone: undefined,
        currentAddress: undefined,
        nationalIdentificationNo: undefined,
        previousSchool: undefined,
        bankAccountNo: undefined,
        bankName: undefined,
      },
      {
        id: 2,
        memberId: 60,
        libraryCardNo: "676",
        admissionNo: "002",
        studentName: "Sneha Patel",
        className: "Class 1(A)",
        fatherName: "Ramesh Patel",
        dateOfBirth: "07/15/2016",
        gender: "Female",
        mobileNumber: "9876200001",
        admissionNumber: undefined,
        firstName: undefined,
        middleName: undefined,
        lastName: undefined,
        mobileNo: undefined,
        rollNumber: undefined,
        bloodGroup: undefined,
        category: undefined,
        religion: undefined,
        house: undefined,
        email: undefined,
        fatherPhone: undefined,
        currentAddress: undefined,
        nationalIdentificationNo: undefined,
        previousSchool: undefined,
        bankAccountNo: undefined,
        bankName: undefined,
      },
      {
        id: 3,
        memberId: 62,
        libraryCardNo: "7",
        admissionNo: "003",
        studentName: "Hariom Yadav",
        className: "Class 1(A)",
        fatherName: "Rajesh Yadav",
        dateOfBirth: "04/08/2020",
        gender: "Male",
        mobileNumber: "9812345678",
        admissionNumber: undefined,
        firstName: undefined,
        middleName: undefined,
        lastName: undefined,
        mobileNo: undefined,
        rollNumber: undefined,
        bloodGroup: undefined,
        category: undefined,
        religion: undefined,
        house: undefined,
        email: undefined,
        fatherPhone: undefined,
        currentAddress: undefined,
        nationalIdentificationNo: undefined,
        previousSchool: undefined,
        bankAccountNo: undefined,
        bankName: undefined,
      },
    ];
    this.applyTableFilter();
  }
}
