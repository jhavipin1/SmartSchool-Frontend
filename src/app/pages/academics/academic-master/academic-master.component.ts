import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from "@angular/forms";
import { AcademicService } from "../../../shared/services/academic.service";
import {
  ClassName,
  Section,
  Subject,
} from "../../../shared/models/academic.model";

type ActiveTab = "class" | "section" | "subject";

@Component({
  selector: "app-academic-master",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./academic-master.component.html",
})
export class AcademicMasterComponent implements OnInit {
  activeTab: ActiveTab = "class";

  // API Data Sources
  classList: ClassName[] = [];
  sectionList: Section[] = [];
  subjectList: Subject[] = [];

  // Form & UI States
  academicForm!: FormGroup;
  searchQuery: string = "";
  pageSize: number = 50;
  isSubmitting: boolean = false;
  isLoading: boolean = false;
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private academicService: AcademicService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAllData();
  }

  private initForm(): void {
    this.academicForm = this.fb.group({
      id: [null],
      className: [""],
      sectionIds: this.fb.array([]),
      sectionName: [""],
      name: [""],
      code: [""],
      subjectType: ["Theory"],
    });
    this.updateValidations();
  }

  loadAllData(): void {
    this.isLoading = true;
    if (this.activeTab === "class") {
      this.academicService.getAllClasses().subscribe({
        next: (data) => {
          this.classList = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Failed to load classes", err);
          this.isLoading = false;
        },
      });
      // Pre-fetch available sections for class creation checkbox list
      this.academicService.getSectionsByClass(0).subscribe({
        next: (data) => (this.sectionList = data),
        error: () => {},
      });
    } else if (this.activeTab === "section") {
      this.academicService.getSectionsByClass(0).subscribe({
        next: (data) => {
          this.sectionList = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Failed to load sections", err);
          this.isLoading = false;
        },
      });
    } else if (this.activeTab === "subject") {
      this.academicService.getAllSubjects().subscribe({
        next: (data) => {
          this.subjectList = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Failed to load subjects", err);
          this.isLoading = false;
        },
      });
    }
  }

  switchTab(tab: ActiveTab): void {
    this.activeTab = tab;
    this.searchQuery = "";
    this.resetForm();
    this.updateValidations();
    this.loadAllData();
  }

  private updateValidations(): void {
    const classNameCtrl = this.academicForm.get("className");
    const sectionNameCtrl = this.academicForm.get("sectionName");
    const nameCtrl = this.academicForm.get("name");

    classNameCtrl?.clearValidators();
    sectionNameCtrl?.clearValidators();
    nameCtrl?.clearValidators();

    if (this.activeTab === "class") {
      classNameCtrl?.setValidators([
        Validators.required,
        Validators.maxLength(50),
      ]);
    } else if (this.activeTab === "section") {
      sectionNameCtrl?.setValidators([
        Validators.required,
        Validators.maxLength(50),
      ]);
    } else if (this.activeTab === "subject") {
      nameCtrl?.setValidators([Validators.required, Validators.maxLength(100)]);
    }

    classNameCtrl?.updateValueAndValidity();
    sectionNameCtrl?.updateValueAndValidity();
    nameCtrl?.updateValueAndValidity();
  }

  get sectionIdsArray(): FormArray {
    return this.academicForm.get("sectionIds") as FormArray;
  }

  onSectionCheckboxChange(event: Event, sectionId: number): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.sectionIdsArray.push(this.fb.control(sectionId));
    } else {
      const index = this.sectionIdsArray.controls.findIndex(
        (ctrl) => ctrl.value === sectionId,
      );
      if (index !== -1) this.sectionIdsArray.removeAt(index);
    }
  }

  isSectionChecked(sectionId: number): boolean {
    return this.sectionIdsArray.controls.some(
      (ctrl) => ctrl.value === sectionId,
    );
  }

  // Real-time Search Filters
  get filteredClasses(): ClassName[] {
    const q = this.searchQuery.toLowerCase().trim();
    return !q
      ? this.classList
      : this.classList.filter((c) => c.className.toLowerCase().includes(q));
  }

  get filteredSections(): Section[] {
    const q = this.searchQuery.toLowerCase().trim();
    return !q
      ? this.sectionList
      : this.sectionList.filter((s) => s.sectionName.toLowerCase().includes(q));
  }

  get filteredSubjects(): Subject[] {
    const q = this.searchQuery.toLowerCase().trim();
    return !q
      ? this.subjectList
      : this.subjectList.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            (s.code && s.code.toLowerCase().includes(q)) ||
            s.subjectType.toLowerCase().includes(q),
        );
  }

  save(): void {
    if (this.academicForm.invalid) {
      this.academicForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const val = this.academicForm.value;

    if (this.activeTab === "class") {
      if (this.editingId) {
        this.academicService
          .updateClass(this.editingId, { className: val.className })
          .subscribe({
            next: () => {
              this.resetForm();
              this.loadAllData();
            },
            error: () => (this.isSubmitting = false),
          });
      } else {
        this.academicService
          .createClassWithSections({
            className: val.className,
            sectionIds: val.sectionIds,
          })
          .subscribe({
            next: () => {
              this.resetForm();
              this.loadAllData();
            },
            error: () => (this.isSubmitting = false),
          });
      }
    } else if (this.activeTab === "section") {
      if (this.editingId) {
        this.academicService
          .updateSection(this.editingId, { sectionName: val.sectionName })
          .subscribe({
            next: () => {
              this.resetForm();
              this.loadAllData();
            },
            error: () => (this.isSubmitting = false),
          });
      } else {
        this.academicService
          .createSection({ sectionName: val.sectionName })
          .subscribe({
            next: () => {
              this.resetForm();
              this.loadAllData();
            },
            error: () => (this.isSubmitting = false),
          });
      }
    } else if (this.activeTab === "subject") {
      const payload: Subject = {
        name: val.name,
        code: val.code,
        subjectType: val.subjectType,
      };

      if (this.editingId) {
        this.academicService.updateSubject(this.editingId, payload).subscribe({
          next: () => {
            this.resetForm();
            this.loadAllData();
          },
          error: () => (this.isSubmitting = false),
        });
      } else {
        this.academicService.createSubject(payload).subscribe({
          next: () => {
            this.resetForm();
            this.loadAllData();
          },
          error: () => (this.isSubmitting = false),
        });
      }
    }
  }

  editItem(item: any): void {
    this.editingId = item.id || null;
    this.sectionIdsArray.clear();

    if (this.activeTab === "class") {
      this.academicForm.patchValue({ className: item.className });
      if (item.sections) {
        item.sections.forEach((sec: Section) => {
          if (sec.id) this.sectionIdsArray.push(this.fb.control(sec.id));
        });
      }
    } else if (this.activeTab === "section") {
      this.academicForm.patchValue({ sectionName: item.sectionName });
    } else if (this.activeTab === "subject") {
      this.academicForm.patchValue({
        name: item.name,
        code: item.code,
        subjectType: item.subjectType,
      });
    }
  }

  deleteItem(id?: number): void {
    if (!id || !confirm("Are you sure you want to delete this record?")) return;

    if (this.activeTab === "class") {
      this.academicService.deleteClass(id).subscribe(() => this.loadAllData());
    } else if (this.activeTab === "section") {
      this.academicService
        .deleteSection(id)
        .subscribe(() => this.loadAllData());
    } else if (this.activeTab === "subject") {
      this.academicService
        .deleteSubject(id)
        .subscribe(() => this.loadAllData());
    }
  }

  resetForm(): void {
    this.isSubmitting = false;
    this.editingId = null;
    this.sectionIdsArray.clear();
    this.academicForm.reset({ subjectType: "Theory" });
  }
}
