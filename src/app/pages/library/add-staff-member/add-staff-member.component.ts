import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from "@angular/forms";

import {
  StaffSearchRequestDto,
  StaffResponseDto,
  LibraryCardUpdateRequestDto,
  OptionItem,
} from "../../../shared/models/library-staff.model";

@Component({
  selector: "app-library-staff-members",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: "./add-staff-member.component.html",
})
export class AddStaffMemberComponent implements OnInit {
  private readonly baseUrl = "/api/library/staff";

  // Search Criteria Form
  searchForm!: FormGroup;

  // Assign Library Card Form
  assignCardForm!: FormGroup;

  // State Data
  staffMembers: StaffResponseDto[] = [];
  filteredStaffMembers: StaffResponseDto[] = [];

  // Dropdown Options
  roles: OptionItem[] = [
    { id: 1, name: "Teacher" },
    { id: 2, name: "Librarian" },
    { id: 3, name: "Admin" },
    { id: 4, name: "Accountant" },
  ];

  // UI State
  isLoading = false;
  tableSearchText = "";
  pageSize = 50;

  // Modal State
  selectedStaff: StaffResponseDto | null = null;
  showAssignModal = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.onSearch(); // Initial Search
  }

  private initForms(): void {
    this.searchForm = this.fb.group({
      roleId: [""],
    });

    this.assignCardForm = this.fb.group({
      libraryCardNo: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z0-9_-]+$")],
      ],
    });
  }

  // POST /api/library/staff/search
  onSearch(): void {
    this.isLoading = true;
    const payload: StaffSearchRequestDto = this.searchForm.value;

    this.http
      .post<StaffResponseDto[]>(`${this.baseUrl}/search`, payload)
      .subscribe({
        next: (data) => {
          this.staffMembers = data;
          this.applyTableFilter();
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Failed to fetch staff members:", err);
          this.isLoading = false;
          // Fallback mock data for preview
          this.loadMockData();
        },
      });
  }

  // Client-side quick filter
  onTableSearch(term: string): void {
    this.tableSearchText = term.toLowerCase();
    this.applyTableFilter();
  }

  applyTableFilter(): void {
    if (!this.tableSearchText) {
      this.filteredStaffMembers = [...this.staffMembers];
      return;
    }

    this.filteredStaffMembers = this.staffMembers.filter(
      (staff) =>
        staff.staffName?.toLowerCase().includes(this.tableSearchText) ||
        staff.staffId?.toLowerCase().includes(this.tableSearchText) ||
        staff.libraryCardNo?.toLowerCase().includes(this.tableSearchText) ||
        staff.role?.toLowerCase().includes(this.tableSearchText) ||
        staff.email?.toLowerCase().includes(this.tableSearchText),
    );
  }

  // Open Assign Card Modal
  openAssignModal(staff: StaffResponseDto): void {
    this.selectedStaff = staff;
    this.assignCardForm.patchValue({
      libraryCardNo: staff.libraryCardNo || "",
    });
    this.showAssignModal = true;
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.selectedStaff = null;
    this.assignCardForm.reset();
  }

  // PATCH /api/library/staff/{id}/library-card
  submitLibraryCard(): void {
    if (this.assignCardForm.invalid || !this.selectedStaff) {
      this.assignCardForm.markAllAsTouched();
      return;
    }

    const payload: LibraryCardUpdateRequestDto = this.assignCardForm.value;
    const staffId = this.selectedStaff.id;

    this.http
      .patch<StaffResponseDto>(
        `${this.baseUrl}/${staffId}/library-card`,
        payload,
      )
      .subscribe({
        next: (updatedStaff) => {
          const index = this.staffMembers.findIndex((s) => s.id === staffId);
          if (index !== -1) {
            this.staffMembers[index] = {
              ...this.staffMembers[index],
              ...updatedStaff,
            };
            this.applyTableFilter();
          }
          this.closeAssignModal();
        },
        error: (err) => {
          console.error("Failed to assign staff library card:", err);
        },
      });
  }

  private loadMockData(): void {
    this.staffMembers = [
      {
        id: 101,
        memberId: 101,
        staffId: "STF-9001",
        libraryCardNo: "LIB-S-01",
        staffName: "Dr. Robert Smith",
        role: "Teacher",
        department: "Academic",
        designation: "Senior Lecturer",
        gender: "Male",
        mobileNumber: "9876543210",
        email: "robert.smith@smartschool.com",
      },
      {
        id: 102,
        memberId: 102,
        staffId: "STF-9002",
        libraryCardNo: "LIB-S-02",
        staffName: "Sarah Jenkins",
        role: "Librarian",
        department: "Library Services",
        designation: "Head Librarian",
        gender: "Female",
        mobileNumber: "9812345670",
        email: "sarah.j@smartschool.com",
      },
      {
        id: 103,
        memberId: 103,
        staffId: "STF-9003",
        libraryCardNo: "",
        staffName: "Michael Brown",
        role: "Admin",
        department: "Administration",
        designation: "System Administrator",
        gender: "Male",
        mobileNumber: "9845612378",
        email: "michael.b@smartschool.com",
      },
    ];
    this.applyTableFilter();
  }
}
