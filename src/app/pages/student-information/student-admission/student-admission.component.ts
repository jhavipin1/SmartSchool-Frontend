import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from "@angular/forms";
import { Subject, combineLatest } from "rxjs";
import { takeUntil, startWith } from "rxjs/operators";
import {
  Gender,
  Category,
  Religion,
  BloodGroup,
  House,
  GuardianType,
  StudentRequestDto,
  ClassNameResponseDto,
  SectionResponseDto,
} from "../../../shared/models/student.model";
import { StudentService } from "../../../shared/services/student.service";

@Component({
  selector: "app-student-registration",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./student-admission.component.html",
})
export class StudentAdmissionComponent implements OnInit, OnDestroy {
  public activeTab = 1;
  public isSubmitting = false;
  public isLoadingClasses = false;
  public successMessage: string | null = null;
  public errorMessage: string | null = null;

  public studentForm!: FormGroup;
  public classList: ClassNameResponseDto[] = [];
  public sectionList: SectionResponseDto[] = [];
  private readonly destroy$ = new Subject<void>();

  public steps = [
    { id: 1, title: "Personal Details" },
    { id: 2, title: "Academic Placement" },
    { id: 3, title: "Contact & Health" },
    { id: 4, title: "Address Details" },
    { id: 5, title: "Parent & Guardian" },
    { id: 6, title: "Financial & Misc" },
  ];

  public genderOptions = Object.values(Gender);
  public categoryOptions = Object.values(Category);
  public religionOptions = Object.values(Religion);
  public bloodGroupOptions = Object.values(BloodGroup);
  public houseOptions = Object.values(House);
  public guardianTypes = Object.values(GuardianType);

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClasses();
    this.setupClassSectionCascade();
    this.setupAddressToggle();
    this.setupGuardianToggle();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.studentForm = this.fb.group({
      admissionNumber: ["", [Validators.required, Validators.maxLength(50)]],
      rollNumber: ["", [Validators.maxLength(50)]],
      firstName: ["", [Validators.required, Validators.maxLength(100)]],
      middleName: ["", [Validators.maxLength(100)]],
      lastName: ["", [Validators.required, Validators.maxLength(100)]],
      dateOfBirth: ["", [Validators.required]],
      gender: [""],
      category: [""],
      religion: [""],
      bloodGroup: [""],
      house: [""],

      classNameId: ["", [Validators.required]],
      sectionId: [{ value: "", disabled: true }, [Validators.required]],
      admissionDate: [""],
      previousSchool: ["", [Validators.maxLength(255)]],

      mobileNo: ["", [Validators.pattern("^[0-9]{10,15}$")]],
      email: ["", [Validators.email]],
      measurementDate: [""],
      height: [null, [Validators.min(0)]],
      weight: [null, [Validators.min(0)]],

      currentAddress: ["", [Validators.maxLength(500)]],
      sameAsCurrentAddress: [false],
      permanentAddress: ["", [Validators.maxLength(500)]],

      fatherName: ["", [Validators.maxLength(100)]],
      fatherPhone: ["", [Validators.pattern("^[0-9]{10,15}$")]],
      fatherOcc: ["", [Validators.maxLength(100)]],
      motherName: ["", [Validators.maxLength(100)]],
      motherPhone: ["", [Validators.pattern("^[0-9]{10,15}$")]],
      motherOcc: ["", [Validators.maxLength(100)]],
      guardianIs: [GuardianType.FATHER],
      guardianName: ["", [Validators.required, Validators.maxLength(100)]],
      guardianRelation: [
        "Father",
        [Validators.required, Validators.maxLength(50)],
      ],
      guardianPhone: [
        "",
        [Validators.required, Validators.pattern("^[0-9]{10,15}$")],
      ],
      guardianEmail: ["", [Validators.email]],
      guardianOccupation: ["", [Validators.maxLength(100)]],
      guardianAddress: ["", [Validators.maxLength(500)]],

      bankName: ["", [Validators.maxLength(100)]],
      bankAccountNo: ["", [Validators.maxLength(50)]],
      ifscCode: ["", [Validators.maxLength(20)]],
      nationalIdentificationNo: ["", [Validators.maxLength(50)]],
      localIdentificationNo: ["", [Validators.maxLength(50)]],
      rte: [false],
      note: ["", [Validators.maxLength(1000)]],
    });
  }

  /**
   * Fetches classes with their embedded sections from backend
   */
  private loadClasses(): void {
    this.isLoadingClasses = true;

    this.studentService
      .getAllClasses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Robust mapping in case the endpoint returns a wrapped response object
          this.classList = Array.isArray(response)
            ? response
            : (response as any)?.data || [];
          this.isLoadingClasses = false;
        },
        error: (err) => {
          console.error("Failed to load classes:", err);
          this.isLoadingClasses = false;
          this.errorMessage = "Failed to load class options. Please try again.";
        },
      });
  }

  /**
   * Cascades sections when class selection changes
   */
  private setupClassSectionCascade(): void {
    const classControl = this.studentForm.get("classNameId");
    const sectionControl = this.studentForm.get("sectionId");

    if (!classControl || !sectionControl) return;

    classControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedClassId) => {
        sectionControl.reset("");

        if (!selectedClassId) {
          this.sectionList = [];
          sectionControl.disable();
          return;
        }

        // Search using string conversion to handle type mismatches (number vs string)
        const selectedClass = this.classList.find(
          (cls) => String(cls.id) === String(selectedClassId),
        );

        if (
          selectedClass &&
          selectedClass.sections &&
          selectedClass.sections.length > 0
        ) {
          this.sectionList = selectedClass.sections;
          sectionControl.enable();
        } else {
          this.sectionList = [];
          sectionControl.disable();
        }
      });
  }

  private setupAddressToggle(): void {
    const currentAddressControl = this.studentForm.get("currentAddress");
    const sameAddressControl = this.studentForm.get("sameAsCurrentAddress");
    const permAddressControl = this.studentForm.get("permanentAddress");

    if (!currentAddressControl || !sameAddressControl || !permAddressControl) {
      return;
    }

    sameAddressControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((isSame: boolean) => {
        if (isSame) {
          permAddressControl.setValue(currentAddressControl.value || "");
          permAddressControl.disable({ emitEvent: false });
        } else {
          permAddressControl.enable({ emitEvent: false });
        }
      });

    currentAddressControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: string) => {
        if (sameAddressControl.value) {
          permAddressControl.setValue(val || "", { emitEvent: false });
        }
      });
  }

  private setupGuardianToggle(): void {
    const guardianIsControl = this.studentForm.get("guardianIs");
    const fatherNameControl = this.studentForm.get("fatherName");
    const fatherPhoneControl = this.studentForm.get("fatherPhone");
    const fatherOccControl = this.studentForm.get("fatherOcc");
    const motherNameControl = this.studentForm.get("motherName");
    const motherPhoneControl = this.studentForm.get("motherPhone");
    const motherOccControl = this.studentForm.get("motherOcc");

    if (
      !guardianIsControl ||
      !fatherNameControl ||
      !fatherPhoneControl ||
      !fatherOccControl ||
      !motherNameControl ||
      !motherPhoneControl ||
      !motherOccControl
    ) {
      return;
    }

    guardianIsControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((relation: string) => {
        this.updateGuardianDetails(relation);
      });

    combineLatest([
      fatherNameControl.valueChanges.pipe(startWith(fatherNameControl.value)),
      fatherPhoneControl.valueChanges.pipe(startWith(fatherPhoneControl.value)),
      fatherOccControl.valueChanges.pipe(startWith(fatherOccControl.value)),
      motherNameControl.valueChanges.pipe(startWith(motherNameControl.value)),
      motherPhoneControl.valueChanges.pipe(startWith(motherPhoneControl.value)),
      motherOccControl.valueChanges.pipe(startWith(motherOccControl.value)),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const currentRelation = guardianIsControl.value;
        if (
          currentRelation === GuardianType.FATHER ||
          currentRelation === GuardianType.MOTHER
        ) {
          this.updateGuardianDetails(currentRelation);
        }
      });
  }

  private updateGuardianDetails(relation: string): void {
    if (relation === GuardianType.FATHER) {
      this.studentForm.patchValue(
        {
          guardianName: this.studentForm.get("fatherName")?.value || "",
          guardianRelation: "Father",
          guardianPhone: this.studentForm.get("fatherPhone")?.value || "",
          guardianOccupation: this.studentForm.get("fatherOcc")?.value || "",
        },
        { emitEvent: false },
      );
    } else if (relation === GuardianType.MOTHER) {
      this.studentForm.patchValue(
        {
          guardianName: this.studentForm.get("motherName")?.value || "",
          guardianRelation: "Mother",
          guardianPhone: this.studentForm.get("motherPhone")?.value || "",
          guardianOccupation: this.studentForm.get("motherOcc")?.value || "",
        },
        { emitEvent: false },
      );
    }
  }

  // --- Helper Methods ---

  public isInvalid(controlName: string): boolean {
    if (!this.studentForm) return false;
    const control = this.studentForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public selectTab(stepId: number): void {
    this.activeTab = stepId;
  }

  public nextTab(): void {
    if (this.activeTab < this.steps.length) {
      this.activeTab++;
    }
  }

  public prevTab(): void {
    if (this.activeTab > 1) {
      this.activeTab--;
    }
  }

  public triggerDatePicker(input: HTMLInputElement): void {
    if (input && typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
    }
  }

  public clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

  public onReset(): void {
    this.studentForm.reset({
      guardianIs: GuardianType.FATHER,
      guardianRelation: "Father",
      sameAsCurrentAddress: false,
      rte: false,
      gender: "",
      category: "",
      religion: "",
      bloodGroup: "",
      house: "",
      classNameId: "",
      sectionId: "",
    });
    this.studentForm.get("sectionId")?.disable();
    this.studentForm.get("permanentAddress")?.enable();
    this.sectionList = [];
    this.activeTab = 1;
    this.clearMessages();
  }

  private parseOptionalNumber(val: unknown): number | undefined {
    if (val === null || val === undefined || val === "") return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }

  private parseOptionalString(val: unknown): string | undefined {
    if (val === null || val === undefined) return undefined;
    const str = String(val).trim();
    return str !== "" ? str : undefined;
  }

  public onSubmit(): void {
    this.clearMessages();

    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      this.errorMessage =
        "Please complete all required fields across all tabs before saving.";
      return;
    }

    this.isSubmitting = true;

    // Capture values including disabled inputs like permanentAddress
    const rawValue = this.studentForm.getRawValue();

    const payload: StudentRequestDto = {
      admissionNumber: String(rawValue.admissionNumber).trim(),
      firstName: String(rawValue.firstName).trim(),
      lastName: String(rawValue.lastName).trim(),
      dateOfBirth: String(rawValue.dateOfBirth),
      gender: rawValue.gender ? (rawValue.gender as Gender) : undefined,
      category: rawValue.category ? (rawValue.category as Category) : undefined,
      religion: rawValue.religion ? (rawValue.religion as Religion) : undefined,
      bloodGroup: rawValue.bloodGroup
        ? (rawValue.bloodGroup as BloodGroup)
        : undefined,
      house: rawValue.house ? (rawValue.house as House) : undefined,

      // Maps both classId and classNameId for backwards compatibility
      classId: this.parseOptionalNumber(rawValue.classNameId),
      classNameId: this.parseOptionalNumber(rawValue.classNameId),
      sectionId: this.parseOptionalNumber(rawValue.sectionId),

      rollNumber: this.parseOptionalString(rawValue.rollNumber),
      middleName: this.parseOptionalString(rawValue.middleName),
      admissionDate: this.parseOptionalString(rawValue.admissionDate),
      previousSchool: this.parseOptionalString(rawValue.previousSchool),
      mobileNo: this.parseOptionalString(rawValue.mobileNo),
      email: this.parseOptionalString(rawValue.email),
      measurementDate: this.parseOptionalString(rawValue.measurementDate),
      height: this.parseOptionalNumber(rawValue.height),
      weight: this.parseOptionalNumber(rawValue.weight),
      currentAddress: this.parseOptionalString(rawValue.currentAddress),
      permanentAddress: this.parseOptionalString(rawValue.permanentAddress),
      fatherName: this.parseOptionalString(rawValue.fatherName),
      fatherPhone: this.parseOptionalString(rawValue.fatherPhone),
      fatherOcc: this.parseOptionalString(rawValue.fatherOcc),
      motherName: this.parseOptionalString(rawValue.motherName),
      motherPhone: this.parseOptionalString(rawValue.motherPhone),
      motherOcc: this.parseOptionalString(rawValue.motherOcc),
      guardianIs: rawValue.guardianIs,
      guardianName: this.parseOptionalString(rawValue.guardianName),
      guardianRelation: this.parseOptionalString(rawValue.guardianRelation),
      guardianPhone: this.parseOptionalString(rawValue.guardianPhone),
      guardianEmail: this.parseOptionalString(rawValue.guardianEmail),
      guardianOccupation: this.parseOptionalString(rawValue.guardianOccupation),
      guardianAddress: this.parseOptionalString(rawValue.guardianAddress),
      bankName: this.parseOptionalString(rawValue.bankName),
      bankAccountNo: this.parseOptionalString(rawValue.bankAccountNo),
      ifscCode: this.parseOptionalString(rawValue.ifscCode),
      nationalIdentificationNo: this.parseOptionalString(
        rawValue.nationalIdentificationNo,
      ),
      localIdentificationNo: this.parseOptionalString(
        rawValue.localIdentificationNo,
      ),
      note: this.parseOptionalString(rawValue.note),
      rte: Boolean(rawValue.rte),
    };

    this.studentService
      .createStudent(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.successMessage = `Student "${response.firstName} ${response.lastName}" registered successfully!`;
          this.onReset();
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error("Error creating student:", error);
          this.errorMessage =
            error?.error?.message ||
            "Failed to save student record. Please verify server connectivity and input data.";
        },
      });
  }
}
