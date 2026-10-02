import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from "@angular/forms";
import {
  Department,
  Designation,
  LeaveType,
  SalaryHead,
  SalaryType,
} from "../../../shared/models/hr.model";
import { HrService } from "../../../shared/services/hr.service";

type ActiveTab = "department" | "designation" | "leaveType" | "salaryHead";

@Component({
  selector: "app-hr-master",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./hr-master.component.html",
})
export class HrMasterComponent implements OnInit {
  activeTab: ActiveTab = "department";

  // Data Sources
  departments: Department[] = [];
  designations: Designation[] = [];
  leaveTypes: LeaveType[] = [];
  salaryHeads: SalaryHead[] = [];

  // Enum access for HTML
  SalaryType = SalaryType;

  // Form & Controls
  masterForm!: FormGroup;
  searchQuery: string = "";
  pageSize: number = 50;
  isSubmitting: boolean = false;
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private hrService: HrService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  private initForm(): void {
    this.masterForm = this.fb.group({
      id: [null],
      name: ["", [Validators.required, Validators.maxLength(100)]],
      description: [""],
      isSystem: [false],
      salaryType: [SalaryType.EARNING],
    });
  }

  switchTab(tab: ActiveTab): void {
    this.activeTab = tab;
    this.searchQuery = "";
    this.resetForm();
    this.loadData();
  }

  loadData(): void {
    if (this.activeTab === "department") {
      this.hrService.getDepartments().subscribe((d) => (this.departments = d));
    } else if (this.activeTab === "designation") {
      this.hrService
        .getDesignations()
        .subscribe((d) => (this.designations = d));
    } else if (this.activeTab === "leaveType") {
      this.hrService.getLeaveTypes().subscribe((l) => (this.leaveTypes = l));
    } else if (this.activeTab === "salaryHead") {
      this.hrService.getSalaryHeads().subscribe((s) => (this.salaryHeads = s));
    }
  }

  // Real-time Filters
  get filteredDepartments(): Department[] {
    const q = this.searchQuery.toLowerCase().trim();
    return !q
      ? this.departments
      : this.departments.filter((d) =>
          d.departmentName.toLowerCase().includes(q),
        );
  }

  get filteredDesignations(): Designation[] {
    const q = this.searchQuery.toLowerCase().trim();
    return !q
      ? this.designations
      : this.designations.filter((d) =>
          d.designationName.toLowerCase().includes(q),
        );
  }

  get filteredLeaveTypes(): LeaveType[] {
    const q = this.searchQuery.toLowerCase().trim();
    return !q
      ? this.leaveTypes
      : this.leaveTypes.filter((l) => l.type.toLowerCase().includes(q));
  }

  get filteredSalaryHeads(): SalaryHead[] {
    const q = this.searchQuery.toLowerCase().trim();
    return !q
      ? this.salaryHeads
      : this.salaryHeads.filter(
          (s) =>
            s.salaryHeadName.toLowerCase().includes(q) ||
            s.salaryType.toLowerCase().includes(q),
        );
  }

  save(): void {
    if (this.masterForm.invalid) {
      this.masterForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const v = this.masterForm.value;

    if (this.activeTab === "department") {
      this.hrService
        .saveDepartment({
          id: v.id,
          departmentName: v.name,
          description: v.description,
        })
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadData();
          },
          error: () => (this.isSubmitting = false),
        });
    } else if (this.activeTab === "designation") {
      this.hrService
        .saveDesignation({
          id: v.id,
          designationName: v.name,
          description: v.description,
        })
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadData();
          },
          error: () => (this.isSubmitting = false),
        });
    } else if (this.activeTab === "leaveType") {
      this.hrService
        .saveLeaveType({ id: v.id, type: v.name, isSystem: v.isSystem })
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadData();
          },
          error: () => (this.isSubmitting = false),
        });
    } else if (this.activeTab === "salaryHead") {
      this.hrService
        .saveSalaryHead({
          id: v.id,
          salaryHeadName: v.name,
          salaryType: v.salaryType,
        })
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadData();
          },
          error: () => (this.isSubmitting = false),
        });
    }
  }

  editItem(item: any): void {
    this.editingId = item.id || null;

    if (this.activeTab === "department") {
      this.masterForm.patchValue({
        id: item.id,
        name: item.departmentName,
        description: item.description,
      });
    } else if (this.activeTab === "designation") {
      this.masterForm.patchValue({
        id: item.id,
        name: item.designationName,
        description: item.description,
      });
    } else if (this.activeTab === "leaveType") {
      this.masterForm.patchValue({
        id: item.id,
        name: item.type,
        isSystem: item.isSystem,
      });
    } else if (this.activeTab === "salaryHead") {
      this.masterForm.patchValue({
        id: item.id,
        name: item.salaryHeadName,
        salaryType: item.salaryType,
      });
    }
  }

  deleteItem(id: number | undefined): void {
    if (!id || !confirm(`Delete this record?`)) return;

    if (this.activeTab === "department")
      this.hrService.deleteDepartment(id).subscribe(() => this.loadData());
    if (this.activeTab === "designation")
      this.hrService.deleteDesignation(id).subscribe(() => this.loadData());
    if (this.activeTab === "leaveType")
      this.hrService.deleteLeaveType(id).subscribe(() => this.loadData());
    if (this.activeTab === "salaryHead")
      this.hrService.deleteSalaryHead(id).subscribe(() => this.loadData());
  }

  resetForm(): void {
    this.isSubmitting = false;
    this.editingId = null;
    this.masterForm.reset({ isSystem: false, salaryType: SalaryType.EARNING });
  }
}
