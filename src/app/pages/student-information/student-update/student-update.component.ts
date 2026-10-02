import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RouterModule, ActivatedRoute, Router } from "@angular/router";
import { StudentResponseDto } from "../../../shared/models/library-student.model";
import {
  Gender,
  Category,
  Religion,
  BloodGroup,
  House,
} from "../../../shared/models/student.model";
import { StudentService } from "../../../shared/services/student.service";

@Component({
  selector: "app-student-update",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./student-update.component.html",
})
export class StudentUpdateComponent implements OnInit {
  studentId!: number;
  updateForm!: FormGroup;

  // Form tab state
  activeTab: "basic" | "attributes" | "guardian" | "academic" = "basic";

  // Status flags
  isLoading = true;
  isSaving = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Option lists derived from enums
  genders = Object.values(Gender);
  categories = Object.values(Category);
  religions = Object.values(Religion);
  bloodGroups = Object.values(BloodGroup);
  houses = Object.values(House);

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.extractIdAndLoadStudent();
  }

  private initForm(): void {
    this.updateForm = this.fb.group({
      // --- Basic Info ---
      admissionNumber: ["", [Validators.required, Validators.maxLength(50)]],
      rollNumber: ["", [Validators.maxLength(30)]],
      firstName: ["", [Validators.required, Validators.maxLength(50)]],
      middleName: ["", [Validators.maxLength(50)]],
      lastName: ["", [Validators.required, Validators.maxLength(50)]],
      dateOfBirth: ["", [Validators.required]],
      mobileNo: ["", [Validators.pattern("^[0-9+ -]{7,15}$")]],
      email: ["", [Validators.email]],

      // --- Demographics & Attributes ---
      gender: [""],
      category: [""],
      religion: [""],
      bloodGroup: [""],
      house: [""],
      height: [null, [Validators.min(0)]],
      weight: [null, [Validators.min(0)]],
      measurementDate: [""],

      // --- Guardian Details ---
      fatherName: ["", [Validators.maxLength(100)]],
      fatherPhone: ["", [Validators.pattern("^[0-9+ -]{7,15}$")]],
      fatherOcc: ["", [Validators.maxLength(100)]],
      motherName: ["", [Validators.maxLength(100)]],
      motherPhone: ["", [Validators.pattern("^[0-9+ -]{7,15}$")]],
      motherOcc: ["", [Validators.maxLength(100)]],
      guardianIs: ["Father"],
      guardianName: ["", [Validators.maxLength(100)]],
      guardianRelation: ["", [Validators.maxLength(50)]],
      guardianEmail: ["", [Validators.email]],
      guardianPhone: ["", [Validators.pattern("^[0-9+ -]{7,15}$")]],
      guardianOcc: ["", [Validators.maxLength(100)]],
      guardianAddress: [""],

      // --- Addresses & Academic ---
      currentAddress: [""],
      permanentAddress: [""],
      admissionDate: [""],
      previousSchool: ["", [Validators.maxLength(150)]],
      bankAccountNo: ["", [Validators.maxLength(30)]],
      bankName: ["", [Validators.maxLength(100)]],
      ifscCode: ["", [Validators.maxLength(20)]],
      nationalIdentificationNo: ["", [Validators.maxLength(50)]],
      localIdentificationNo: ["", [Validators.maxLength(50)]],
      note: [""],
    });
  }

  private extractIdAndLoadStudent(): void {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (!idParam) {
      this.errorMessage = "Invalid Student ID specified.";
      this.isLoading = false;
      return;
    }

    this.studentId = +idParam;
    this.studentService.getStudentById(this.studentId).subscribe({
      next: (student: StudentResponseDto) => {
        this.updateForm.patchValue(student);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message || "Failed to load student record details.";
        this.isLoading = false;
      },
    });
  }

  // Quick field error check helper
  isInvalid(controlName: string): boolean {
    const control = this.updateForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      this.errorMessage = "Please fix the validation errors before submitting.";
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.studentService
      .updateStudent(this.studentId, this.updateForm.value)
      .subscribe({
        next: (updatedStudent) => {
          this.isSaving = false;
          this.successMessage = `Student ${updatedStudent.firstName} ${updatedStudent.lastName} updated successfully!`;

          // Auto-clear success banner after 4 seconds
          setTimeout(() => (this.successMessage = null), 4000);
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage =
            err?.error?.message ||
            "An error occurred while updating the student record.";
        },
      });
  }

  onCancel(): void {
    this.router.navigate(["/students"]);
  }
}
