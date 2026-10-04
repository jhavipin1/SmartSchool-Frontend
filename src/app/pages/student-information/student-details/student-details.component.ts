import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ChangeDetectorRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpEventType } from "@angular/common/http";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  ClassNameResponseDto,
  SectionResponseDto,
  StudentResponseDto,
} from "../../../shared/models/student.model";
import { StudentService } from "../../../shared/services/student.service";

@Component({
  selector: "app-student-details",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./student-details.component.html",
})
export class StudentDetailsComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  // Filter Bindings
  selectedClassId: number | null = null;
  selectedSectionId: number | null = null;
  keywordSearch: string = "";
  tableSearchText: string = "";

  // Active Tab
  activeTab: "list" | "details" = "list";

  // Dynamic Options lists
  classList: ClassNameResponseDto[] = [];
  availableSections: SectionResponseDto[] = [];

  // Data state
  rawStudents: StudentResponseDto[] = [];
  displayStudents: StudentResponseDto[] = [];

  // Track if search has been executed
  hasSearched: boolean = false;

  // Active Search Strategy ('FILTER' | 'KEYWORD')
  activeSearchType: "FILTER" | "KEYWORD" | null = null;

  // UI Loaders & Upload State
  isLoading: boolean = false;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  selectedFile: File | null = null;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    // Only load options (Classes) on init, no student records fetched initially
    this.loadClasses();
  }

  /** Fetch Class & Section Dropdowns */
  loadClasses(): void {
    this.studentService
      .getAllClasses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.classList = res || [];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Failed to fetch classes:", err);
        },
      });
  }

  /** Handle Class Dropdown Selection */
  onClassChange(): void {
    this.selectedSectionId = null;
    const matchedClass = this.classList.find(
      (c) => c.id === Number(this.selectedClassId),
    );
    this.availableSections = matchedClass?.sections || [];
  }

  /** Filter Search Trigger */
  onFilterSearch(): void {
    if (!this.selectedClassId) return;

    this.activeSearchType = "FILTER";
    this.hasSearched = true;
    this.executeFilterSearch();
  }

  private executeFilterSearch(): void {
    this.isLoading = true;
    this.studentService
      .filterStudents(
        this.selectedClassId || undefined,
        this.selectedSectionId || undefined,
        undefined,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: StudentResponseDto[] | any) => {
          this.updateDataState(res);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Filter request failed:", err);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  /** Keyword Search Trigger */
  onKeywordSearch(): void {
    if (!this.keywordSearch.trim()) return;

    this.activeSearchType = "KEYWORD";
    this.hasSearched = true;
    this.executeKeywordSearch();
  }

  private executeKeywordSearch(): void {
    this.isLoading = true;
    this.studentService
      .searchStudents(this.keywordSearch.trim())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: StudentResponseDto[] | any) => {
          this.updateDataState(res);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Keyword search failed:", err);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  /** Client-Side In-Memory Search within displayed results */
  onClientSideTableSearch(): void {
    const query = this.tableSearchText.toLowerCase().trim();
    if (!query) {
      this.displayStudents = [...this.rawStudents];
      return;
    }

    this.displayStudents = this.rawStudents.filter((student) =>
      Object.values(student).some(
        (val) => val && val.toString().toLowerCase().includes(query),
      ),
    );
    this.cdr.detectChanges();
  }

  /** File Selection */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  /** Bulk Data Upload */
  uploadBulkData(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    this.studentService
      .bulkUploadStudents(this.selectedFile)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round(
              (100 * event.loaded) / event.total,
            );
            this.cdr.detectChanges();
          } else if (event.type === HttpEventType.Response) {
            this.isUploading = false;
            this.selectedFile = null;
            alert("Bulk data upload completed successfully!");
            if (this.hasSearched) {
              this.dispatchActiveFetch();
            }
          }
        },
        error: (err) => {
          console.error("Bulk upload failed:", err);
          this.isUploading = false;
          this.cdr.detectChanges();
          alert("Bulk upload failed. Please check file format and try again.");
        },
      });
  }

  /** Route Active Data Fetch */
  private dispatchActiveFetch(): void {
    if (this.activeSearchType === "FILTER") {
      this.executeFilterSearch();
    } else if (this.activeSearchType === "KEYWORD") {
      this.executeKeywordSearch();
    }
  }

  /** Process Response Array with Safe Fallbacks */
  private updateDataState(res: any): void {
    if (Array.isArray(res)) {
      this.rawStudents = res;
    } else if (res && Array.isArray(res.content)) {
      this.rawStudents = res.content;
    } else {
      this.rawStudents = [];
    }

    this.displayStudents = [...this.rawStudents];
  }

  /** Reset Filters and Clear Results */
  resetFilters(): void {
    this.selectedClassId = null;
    this.selectedSectionId = null;
    this.availableSections = [];
    this.keywordSearch = "";
    this.tableSearchText = "";
    this.rawStudents = [];
    this.displayStudents = [];
    this.hasSearched = false;
    this.activeSearchType = null;
  }

  /** Optimization trackBy */
  trackByStudentId(index: number, student: StudentResponseDto): number {
    return student.id;
  }

  // Row Level Actions
  onViewStudent(student: StudentResponseDto): void {
    this.studentService
      .getStudentById(student.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          alert(
            `Student Details:\nName: ${res.firstName} ${res.lastName}\nAdm No: ${res.admissionNumber}`,
          );
        },
        error: (err) => console.error("Error getting student details:", err),
      });
  }

  onEditStudent(student: StudentResponseDto): void {
    console.log("Navigating to edit mode for student:", student.id);
  }

  onDeleteStudent(student: StudentResponseDto): void {
    if (confirm(`Are you sure you want to delete ${student.firstName}?`)) {
      this.studentService
        .deleteStudent(student.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.dispatchActiveFetch();
          },
          error: (err) => console.error("Delete operation failed:", err),
        });
    }
  }

  // Export & Print Utilities
  exportToCSV(): void {
    if (!this.displayStudents.length) return;
    const keys = [
      "admissionNumber",
      "firstName",
      "lastName",
      "rollNumber",
      "className",
      "sectionName",
      "mobileNo",
    ];
    const csvRows = [
      keys.join(","),
      ...this.displayStudents.map((s) =>
        keys
          .map((k) => `"${(s as unknown as Record<string, unknown>)[k] || ""}"`)
          .join(","),
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_export_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  printPage(): void {
    window.print();
  }
}
