import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from "@angular/forms";
import {
  FeeResponseDto,
  FeePaymentStatus,
  FeeRequestDto,
  FeeType,
} from "../../../shared/models/fee.model";
import { FeeService } from "../../../shared/services/fee.service";

@Component({
  selector: "app-fee-management-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./collect-fees.component.html",
})
export class CollectFeesComponent implements OnInit {
  // Dummy Data initialized directly
  feesList: FeeResponseDto[] = [
    {
      id: 101,
      studentId: 1001,
      studentName: "Emma Watson",
      classId: 10,
      feeType: "Tuition Fee",
      totalAmount: 1500.0,
      paidAmount: 1500.0,
      remainingAmount: 0.0,
      fineAmount: 0.0,
      dueDate: "2026-09-15",
      status: FeePaymentStatus.PAID,
    },
    {
      id: 102,
      studentId: 1002,
      studentName: "Liam Smith",
      classId: 10,
      feeType: "Laboratory Fee",
      totalAmount: 350.0,
      paidAmount: 150.0,
      remainingAmount: 200.0,
      fineAmount: 0.0,
      dueDate: "2026-10-10",
      status: FeePaymentStatus.PARTIALLY_PAID,
    },
    {
      id: 103,
      studentId: 1003,
      studentName: "Sophia Johnson",
      classId: 11,
      feeType: "Sports & Extracurricular",
      totalAmount: 250.0,
      paidAmount: 0.0,
      remainingAmount: 250.0,
      fineAmount: 25.0,
      dueDate: "2026-08-30",
      status: FeePaymentStatus.OVERDUE,
    },
    {
      id: 104,
      studentId: 1004,
      studentName: "Noah Williams",
      classId: 9,
      feeType: "Tuition Fee",
      totalAmount: 1200.0,
      paidAmount: 0.0,
      remainingAmount: 1200.0,
      fineAmount: 0.0,
      dueDate: "2026-10-25",
      status: FeePaymentStatus.UNPAID,
    },
  ];

  filteredFees: FeeResponseDto[] = [];

  // Dummy Fee Types for Dropdown
  feeTypes: FeeType[] = [
    { id: 1, name: "Tuition Fee" } as any,
    { id: 2, name: "Laboratory Fee" } as any,
    { id: 3, name: "Library Fee" } as any,
    { id: 4, name: "Sports & Extracurricular" } as any,
    { id: 5, name: "Transportation Fee" } as any,
  ];

  feeForm!: FormGroup;
  paymentForm!: FormGroup;

  // Drawer & Form State Control
  isDrawerOpen = false;
  activeFormMode: "NONE" | "ASSIGN_FEE" | "RECORD_PAYMENT" = "NONE";
  isEditMode = false;
  selectedFee: FeeResponseDto | null = null;

  isLoading = false;

  // Filters & Search State
  selectedStatusFilter: string = "ALL";
  searchQuery: string = "";
  selectedClassFilter: string = "";

  PaymentStatusEnum = FeePaymentStatus;

  constructor(
    private fb: FormBuilder,
    private feeService: FeeService,
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadFeeTypes();
    this.loadAllFees();
  }

  private initForms(): void {
    this.feeForm = this.fb.group({
      studentId: [null, [Validators.required, Validators.min(1)]],
      classId: [null, [Validators.required, Validators.min(1)]],
      feeType: ["", [Validators.required]],
      totalAmount: [null, [Validators.required, Validators.min(0.01)]],
      dueDate: ["", [Validators.required]],
    });

    this.paymentForm = this.fb.group({
      paymentAmount: [null, [Validators.required, Validators.min(0.01)]],
      fineAmount: [0, [Validators.min(0)]],
    });
  }

  loadFeeTypes(): void {
    this.feeService.getFeeTypes().subscribe({
      next: (types) => {
        if (types && types.length > 0) {
          this.feeTypes = types;
        }
      },
      error: () => {
        // Fallback to dummy data if API fails
      },
    });
  }

  loadAllFees(): void {
    this.isLoading = true;
    this.feeService.getAllFees().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.feesList = data;
        }
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        // Fallback to dummy data on API error
        this.applyFilters();
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    let result = [...this.feesList];

    if (this.selectedStatusFilter !== "ALL") {
      result = result.filter((f) => f.status === this.selectedStatusFilter);
    }

    if (this.selectedClassFilter) {
      result = result.filter(
        (f) => f.classId === Number(this.selectedClassFilter),
      );
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.studentId.toString().includes(q) ||
          f.feeType.toLowerCase().includes(q) ||
          (f.studentName && f.studentName.toLowerCase().includes(q)),
      );
    }

    this.filteredFees = result;
  }

  onStatusFilterChange(status: string): void {
    this.selectedStatusFilter = status;
    this.applyFilters();
  }

  // Action Handlers
  openCreateForm(): void {
    this.isEditMode = false;
    this.selectedFee = null;
    this.feeForm.reset();
    this.activeFormMode = "ASSIGN_FEE";
    this.isDrawerOpen = true;
  }

  openEditForm(fee: FeeResponseDto): void {
    this.isEditMode = true;
    this.selectedFee = fee;
    this.feeForm.patchValue({
      studentId: fee.studentId,
      classId: fee.classId,
      feeType: fee.feeType,
      totalAmount: fee.totalAmount,
      dueDate: fee.dueDate,
    });
    this.activeFormMode = "ASSIGN_FEE";
    this.isDrawerOpen = true;
  }

  openPaymentForm(fee: FeeResponseDto): void {
    this.selectedFee = fee;
    this.paymentForm.reset({
      paymentAmount: fee.remainingAmount,
      fineAmount: fee.fineAmount || 0,
    });
    this.activeFormMode = "RECORD_PAYMENT";
    this.isDrawerOpen = true;
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
    setTimeout(() => {
      this.activeFormMode = "NONE";
      this.selectedFee = null;
      this.isEditMode = false;
      this.feeForm.reset();
      this.paymentForm.reset();
    }, 300);
  }

  // Form Submissions (With fallback state mutation for offline/mock demo)
  saveFee(): void {
    if (this.feeForm.invalid) {
      this.feeForm.markAllAsTouched();
      return;
    }

    const dto: FeeRequestDto = this.feeForm.value;

    if (this.isEditMode && this.selectedFee) {
      this.feeService.updateFee(this.selectedFee.id, dto).subscribe({
        next: () => {
          this.closeDrawer();
          this.loadAllFees();
        },
        error: () => {
          // Local update for dummy data demo
          const index = this.feesList.findIndex(
            (f) => f.id === this.selectedFee?.id,
          );
          if (index !== -1) {
            this.feesList[index] = {
              ...this.feesList[index],
              ...dto,
              remainingAmount:
                dto.totalAmount - this.feesList[index].paidAmount,
            };
          }
          this.closeDrawer();
          this.applyFilters();
        },
      });
    } else {
      this.feeService.createFee(dto).subscribe({
        next: () => {
          this.closeDrawer();
          this.loadAllFees();
        },
        error: () => {
          // Local add for dummy data demo
          const newFee: FeeResponseDto = {
            id: Math.floor(Math.random() * 1000) + 105,
            studentId: dto.studentId,
            studentName: `Student ${dto.studentId}`,
            classId: dto.classId,
            feeType: dto.feeType,
            totalAmount: dto.totalAmount,
            paidAmount: 0,
            remainingAmount: dto.totalAmount,
            fineAmount: 0,
            dueDate: dto.dueDate,
            status: FeePaymentStatus.UNPAID,
          };
          this.feesList.unshift(newFee);
          this.closeDrawer();
          this.applyFilters();
        },
      });
    }
  }

  submitPayment(): void {
    if (this.paymentForm.invalid || !this.selectedFee) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const { paymentAmount, fineAmount } = this.paymentForm.value;

    this.feeService
      .recordPayment(this.selectedFee.id, paymentAmount, fineAmount)
      .subscribe({
        next: () => {
          this.closeDrawer();
          this.loadAllFees();
        },
        error: () => {
          // Local payment update for dummy data demo
          const target = this.feesList.find(
            (f) => f.id === this.selectedFee?.id,
          );
          if (target) {
            target.paidAmount += paymentAmount;
            target.fineAmount = fineAmount;
            target.remainingAmount = Math.max(
              0,
              target.totalAmount - target.paidAmount,
            );
            target.status =
              target.remainingAmount === 0
                ? FeePaymentStatus.PAID
                : FeePaymentStatus.PARTIALLY_PAID;
          }
          this.closeDrawer();
          this.applyFilters();
        },
      });
  }

  deleteFee(id: number): void {
    if (confirm("Are you sure you want to delete this fee record?")) {
      this.feeService.deleteFee(id).subscribe({
        next: () => {
          if (this.selectedFee?.id === id) {
            this.closeDrawer();
          }
          this.loadAllFees();
        },
        error: () => {
          // Local removal for dummy data demo
          this.feesList = this.feesList.filter((f) => f.id !== id);
          if (this.selectedFee?.id === id) {
            this.closeDrawer();
          }
          this.applyFilters();
        },
      });
    }
  }

  getStatusBadgeClass(status: FeePaymentStatus): string {
    switch (status) {
      case FeePaymentStatus.PAID:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case FeePaymentStatus.PARTIALLY_PAID:
        return "bg-amber-50 text-amber-700 border-amber-200";
      case FeePaymentStatus.OVERDUE:
        return "bg-rose-50 text-rose-700 border-rose-200";
      case FeePaymentStatus.UNPAID:
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  }
}
