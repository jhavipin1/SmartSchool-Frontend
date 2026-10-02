import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-student-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./student-admission.component.html",
})
export class StudentAdmissionComponent implements OnInit {
  onFileSelect($event: Event, arg1: string) {
    throw new Error("Method not implemented.");
  }
  addSibling() {
    throw new Error("Method not implemented.");
  }
  studentForm!: FormGroup;

  // Enum Options for Dropdowns
  genderOptions = ["MALE", "FEMALE", "OTHER"];
  categoryOptions = ["GENERAL", "OBC", "SC", "ST", "OTHER"];
  religionOptions = [
    "HINDUISM",
    "ISLAM",
    "CHRISTIANITY",
    "SIKHISM",
    "BUDDHISM",
    "JAINISM",
    "OTHER",
  ];
  bloodGroupOptions = [
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
  ];
  houseOptions = ["RED", "BLUE", "GREEN", "YELLOW"];
  libraryStatusOptions = ["ACTIVE", "INACTIVE"];

  // Mock Dropdown Lists
  classList = [
    { id: 1, name: "Class 1" },
    { id: 2, name: "Class 2" },
  ];
  sectionList = [
    { id: 1, name: "Section A" },
    { id: 2, name: "Section B" },
  ];
  parentList = [
    { id: 1, name: "Parent Group 1" },
    { id: 2, name: "Parent Group 2" },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.setupAddressSync();
  }

  private initForm(): void {
    this.studentForm = this.fb.group({
      // Basic Details
      admissionNumber: ["", [Validators.required, Validators.maxLength(50)]],
      rollNumber: ["", [Validators.maxLength(30)]],
      firstName: ["", [Validators.required, Validators.maxLength(50)]],
      middleName: ["", [Validators.maxLength(50)]],
      lastName: ["", [Validators.required, Validators.maxLength(50)]],
      dateOfBirth: ["", [Validators.required]],
      gender: [""],
      category: [""],
      religion: [""],
      bloodGroup: [""],
      house: [""],

      // Academic Details
      className: [null],
      section: [null],
      admissionDate: [""],
      previousSchool: ["", [Validators.maxLength(150)]],

      // Library Details
      libraryCardNo: ["", [Validators.maxLength(50)]],
      libraryCardStatus: ["INACTIVE"],

      // Contact & Address Info
      mobileNo: ["", [Validators.maxLength(15)]],
      email: ["", [Validators.email, Validators.maxLength(100)]],
      currentAddress: [""],
      sameAsCurrentAddress: [false], // Checkbox control
      permanentAddress: [""],

      // Health Info
      height: [null, [Validators.min(0)]],
      weight: [null, [Validators.min(0)]],
      measurementDate: [""],

      // Guardian Details
      fatherName: ["", [Validators.maxLength(100)]],
      fatherPhone: ["", [Validators.maxLength(15)]],
      fatherOcc: ["", [Validators.maxLength(100)]],
      motherName: ["", [Validators.maxLength(100)]],
      motherPhone: ["", [Validators.maxLength(15)]],
      motherOcc: ["", [Validators.maxLength(100)]],
      guardianIs: ["FATHER"],
      guardianName: ["", [Validators.maxLength(100)]],
      guardianRelation: ["", [Validators.maxLength(50)]],
      guardianEmail: ["", [Validators.email, Validators.maxLength(100)]],
      guardianPhone: ["", [Validators.maxLength(15)]],
      guardianOcc: ["", [Validators.maxLength(100)]],
      guardianAddress: [""],

      // Financial & Legal
      bankAccountNo: ["", [Validators.maxLength(30)]],
      bankName: ["", [Validators.maxLength(100)]],
      ifscCode: ["", [Validators.maxLength(20)]],
      nationalIdentificationNo: ["", [Validators.maxLength(50)]],
      localIdentificationNo: ["", [Validators.maxLength(50)]],
      rte: ["", [Validators.maxLength(10)]],

      // Associated Relationships & Notes
      parent: [null],
      note: [""],
    });
  }

  private setupAddressSync(): void {
    // Sync permanent address when current address changes (if checkbox is checked)
    this.studentForm.get("currentAddress")?.valueChanges.subscribe((value) => {
      if (this.studentForm.get("sameAsCurrentAddress")?.value) {
        this.studentForm.patchValue(
          { permanentAddress: value },
          { emitEvent: false },
        );
      }
    });

    // Sync or clear permanent address when checkbox is toggled
    this.studentForm
      .get("sameAsCurrentAddress")
      ?.valueChanges.subscribe((isChecked) => {
        const permanentControl = this.studentForm.get("permanentAddress");
        if (isChecked) {
          const currentAddr = this.studentForm.get("currentAddress")?.value;
          permanentControl?.setValue(currentAddr);
          permanentControl?.disable(); // Disable permanent address input when auto-filled
        } else {
          permanentControl?.enable();
        }
      });
  }

  isInvalid(controlPath: string): boolean {
    const control = this.studentForm.get(controlPath);
    return !!(control && control.touched && control.invalid);
  }

  onReset(): void {
    this.studentForm.reset({
      libraryCardStatus: "INACTIVE",
      guardianIs: "FATHER",
      sameAsCurrentAddress: false,
    });
    this.studentForm.get("permanentAddress")?.enable();
    this.studentForm.markAsPristine();
    this.studentForm.markAsUntouched();
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      // Get raw value to include permanentAddress even if disabled
      console.log("Form Payload:", this.studentForm.getRawValue());
    } else {
      this.studentForm.markAllAsTouched();
    }
  }
}
