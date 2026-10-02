import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  IssueResponseDto,
  BookIssueRequestDto,
  BookReturnRequestDto,
} from "../../../shared/models/issue.model";
import { IssueService } from "../../../shared/services/issue.service";

@Component({
  selector: "app-issue-return",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./issue-return.component.html",
})
export class IssueReturnComponent implements OnInit {
  activeTab: "issue" | "return" = "issue";

  issueForm!: FormGroup;
  returnForm!: FormGroup;

  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  lastRecord: IssueResponseDto | null = null;

  constructor(
    private fb: FormBuilder,
    private issueService: IssueService,
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  private initForms(): void {
    // Default due date: 14 days from today
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);

    this.issueForm = this.fb.group({
      libraryCardNo: ["", [Validators.required]],
      bookId: [null, [Validators.required, Validators.min(1)]],
      dueDate: [
        defaultDueDate.toISOString().substring(0, 10),
        [Validators.required],
      ],
    });

    this.returnForm = this.fb.group({
      issueRecordId: [null, [Validators.required, Validators.min(1)]],
    });
  }

  switchTab(tab: "issue" | "return"): void {
    this.activeTab = tab;
    this.resetAlerts();
  }

  onIssueSubmit(): void {
    if (this.issueForm.invalid) {
      this.issueForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.resetAlerts();

    const requestPayload: BookIssueRequestDto = this.issueForm.value;

    this.issueService.issueBook(requestPayload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.lastRecord = res;
        this.successMessage = `Book successfully issued for Card #${res.libraryCardNo}!`;
        this.issueForm.reset({
          libraryCardNo: "",
          bookId: null,
          dueDate: new Date(Date.now() + 14 * 86400000)
            .toISOString()
            .substring(0, 10),
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage =
          err.error?.message || "Failed to issue book. Please check details.";
      },
    });
  }

  onReturnSubmit(): void {
    if (this.returnForm.invalid) {
      this.returnForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.resetAlerts();

    const requestPayload: BookReturnRequestDto = this.returnForm.value;

    this.issueService.returnBook(requestPayload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.lastRecord = res;
        this.successMessage = `Book (Issue ID: ${res.id}) successfully returned!`;
        this.returnForm.reset();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage =
          err.error?.message ||
          "Failed to process return. Check Issue Record ID.";
      },
    });
  }

  private resetAlerts(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.lastRecord = null;
  }
}
