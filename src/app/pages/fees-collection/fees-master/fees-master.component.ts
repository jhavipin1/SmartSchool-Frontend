import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  FeeGroup,
  FeeType,
  FeeDiscount,
  FeeMaster,
  DiscountType,
  FineType,
  FeePaymentStatus,
} from "../../../shared/models/fee.model";
import { FeeService } from "../../../shared/services/fee.service";

@Component({
  selector: "app-fee-management",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule, // 2. Add FormsModule here
  ],
  templateUrl: "./fees-master.component.html",
})
export class FeesMasterComponent implements OnInit {
  activeTab: "group" | "type" | "discount" | "master" = "group";

  // Lists
  feeGroups: FeeGroup[] = [];
  feeTypes: FeeType[] = [];
  feeDiscounts: FeeDiscount[] = [];
  feeMasters: FeeMaster[] = [];

  // Forms
  groupForm!: FormGroup;
  typeForm!: FormGroup;
  discountForm!: FormGroup;
  masterForm!: FormGroup;

  // Enums for HTML access
  DiscountType = DiscountType;
  FineType = FineType;

  // Loading & Action states
  isSubmitting = false;
  searchQuery = "";

  constructor(
    private fb: FormBuilder,
    private feeService: FeeService,
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadAllData();
  }

  private initForms(): void {
    // 1. Fee Group Form
    this.groupForm = this.fb.group({
      id: [null],
      name: ["", [Validators.required, Validators.maxLength(100)]],
      description: ["", [Validators.maxLength(500)]],
    });

    // 2. Fee Type Form
    this.typeForm = this.fb.group({
      id: [null],
      feeGroup: ["", [Validators.required, Validators.maxLength(100)]],
      name: ["", [Validators.required, Validators.maxLength(100)]],
      code: ["", [Validators.required, Validators.maxLength(50)]],
      description: ["", [Validators.maxLength(500)]],
    });

    // 3. Fee Discount Form
    this.discountForm = this.fb.group({
      id: [null],
      name: ["", [Validators.required, Validators.maxLength(100)]],
      discountCode: ["", [Validators.required, Validators.maxLength(50)]],
      discountType: [DiscountType.PERCENTAGE, [Validators.required]],
      percentage: [null, [Validators.min(0.01), Validators.max(100)]],
      amount: [null, [Validators.min(0.01)]],
      numberOfUseCount: [1, [Validators.required, Validators.min(1)]],
      expiryDate: [""],
      description: ["", [Validators.maxLength(500)]],
    });

    // Toggle Discount dynamic validations
    this.discountForm.get("discountType")?.valueChanges.subscribe((type) => {
      const percentageControl = this.discountForm.get("percentage");
      const amountControl = this.discountForm.get("amount");

      if (type === DiscountType.PERCENTAGE) {
        percentageControl?.setValidators([
          Validators.required,
          Validators.min(0.01),
          Validators.max(100),
        ]);
        amountControl?.clearValidators();
        amountControl?.setValue(null);
      } else {
        amountControl?.setValidators([
          Validators.required,
          Validators.min(0.01),
        ]);
        percentageControl?.clearValidators();
        percentageControl?.setValue(null);
      }
      percentageControl?.updateValueAndValidity();
      amountControl?.updateValueAndValidity();
    });

    // 4. Fee Master Form
    this.masterForm = this.fb.group({
      id: [null],
      studentId: [1, [Validators.required]], // Defaulted for form binding
      feeGroupId: [null],
      feeTypeId: [null, [Validators.required]],
      feeDiscountId: [null],
      dueDate: ["", [Validators.required]],
      amount: [0.0, [Validators.required, Validators.min(0)]],
      fineType: [FineType.NONE],
      status: [FeePaymentStatus.UNPAID],
      description: ["", [Validators.maxLength(500)]],
    });
  }

  loadAllData(): void {
    this.feeService.getFeeGroups().subscribe((data) => (this.feeGroups = data));
    this.feeService.getFeeTypes().subscribe((data) => (this.feeTypes = data));
    this.feeService
      .getFeeDiscounts()
      .subscribe((data) => (this.feeDiscounts = data));
    this.feeService
      .getFeeMasters()
      .subscribe((data) => (this.feeMasters = data));
  }

  switchTab(tab: "group" | "type" | "discount" | "master"): void {
    this.activeTab = tab;
    this.searchQuery = "";
  }

  // --- Submit Handlers ---
  saveGroup(): void {
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.feeService.saveFeeGroup(this.groupForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.groupForm.reset();
        this.loadAllData();
      },
      error: () => (this.isSubmitting = false),
    });
  }

  saveType(): void {
    if (this.typeForm.invalid) {
      this.typeForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.feeService.saveFeeType(this.typeForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.typeForm.reset();
        this.loadAllData();
      },
      error: () => (this.isSubmitting = false),
    });
  }

  saveDiscount(): void {
    if (this.discountForm.invalid) {
      this.discountForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.feeService.saveFeeDiscount(this.discountForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.discountForm.reset({
          discountType: DiscountType.PERCENTAGE,
          numberOfUseCount: 1,
        });
        this.loadAllData();
      },
      error: () => (this.isSubmitting = false),
    });
  }

  saveMaster(): void {
    if (this.masterForm.invalid) {
      this.masterForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.feeService.saveFeeMaster(this.masterForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.masterForm.reset({
          studentId: 1,
          fineType: FineType.NONE,
          status: FeePaymentStatus.UNPAID,
        });
        this.loadAllData();
      },
      error: () => (this.isSubmitting = false),
    });
  }

  deleteItem(id: number | undefined): void {
    if (!id || !confirm("Are you sure you want to delete this record?")) return;

    if (this.activeTab === "group")
      this.feeService.deleteFeeGroup(id).subscribe(() => this.loadAllData());
    if (this.activeTab === "type")
      this.feeService.deleteFeeType(id).subscribe(() => this.loadAllData());
    if (this.activeTab === "discount")
      this.feeService.deleteFeeDiscount(id).subscribe(() => this.loadAllData());
    if (this.activeTab === "master")
      this.feeService.deleteFeeMaster(id).subscribe(() => this.loadAllData());
  }
}
