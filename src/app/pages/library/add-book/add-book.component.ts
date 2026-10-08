import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  RackDto,
  BookRequestDto,
  BookResponseDto,
} from "../../../shared/models/book.model";
import { BookService } from "../../../shared/services/book.service";

@Component({
  selector: "app-add-book",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./add-book.component.html",
})
export class AddBookComponent implements OnInit, OnChanges {
  @Input() editData: BookResponseDto | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  bookForm!: FormGroup;
  racks: RackDto[] = [];
  books: BookResponseDto[] = []; // Initialized as empty array
  isSubmitting = false;
  isLoading = false;
  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRacks();
    this.loadAllBooks();

    if (this.editData) {
      this.populateForm(this.editData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["editData"] && this.bookForm) {
      if (this.editData) {
        this.populateForm(this.editData);
      } else {
        this.resetForm();
      }
    }
  }

  loadAllBooks(): void {
    this.isLoading = true;
    this.bookService.getAllBooksUnpaginated().subscribe({
      next: (data) => {
        this.books = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to load books:", err);
        this.isLoading = false;
      },
    });
  }

  private initForm(): void {
    this.bookForm = this.fb.group({
      title: ["", [Validators.required, Validators.maxLength(150)]],
      bookNumber: ["", [Validators.required, Validators.maxLength(50)]],
      isbnNumber: [
        "",
        [Validators.pattern(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/)],
      ],
      publisher: ["", [Validators.maxLength(100)]],
      author: ["", [Validators.maxLength(100)]],
      subject: ["", [Validators.maxLength(100)]],
      qty: [1, [Validators.required, Validators.min(0)]],
      availableQty: [1, [Validators.required, Validators.min(0)]],
      price: [null, [Validators.min(0)]],
      postDate: [new Date().toISOString().substring(0, 10)],
      rackCode: [null],
      description: ["", [Validators.maxLength(500)]],
    });

    this.bookForm.get("qty")?.valueChanges.subscribe((val) => {
      if (!this.editData && val !== null && val >= 0) {
        this.bookForm.patchValue(
          { availableQty: Number(val) },
          { emitEvent: false },
        );
      }
    });
  }

  private populateForm(data: BookResponseDto): void {
    this.bookForm.patchValue({
      title: data.title,
      bookNumber: data.bookNumber,
      isbnNumber: data.isbnNumber || "",
      publisher: data.publisher || "",
      author: data.author || "",
      subject: data.subject || "",
      qty: data.qty,
      availableQty: data.availableQty,
      price: data.price ?? null,
      postDate: data.postDate
        ? data.postDate.substring(0, 10)
        : new Date().toISOString().substring(0, 10),
      rackCode: data.rackCode || null,
      description: data.description || "",
    });
  }

  private loadRacks(): void {
    this.bookService.getRacks().subscribe({
      next: (data) => {
        this.racks = data || [];
      },
      error: (err) => console.error("Failed to load racks:", err),
    });
  }

  onSubmit(): void {
    this.errorMessage = "";
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const rawValue = this.bookForm.value;

    const payload: BookRequestDto = {
      ...rawValue,
      author: rawValue.author?.trim() || null,
      publisher: rawValue.publisher?.trim() || null,
      rackCode: rawValue.rackCode || null,
      qty: Number(rawValue.qty ?? 0),
      availableQty: Number(rawValue.availableQty ?? rawValue.qty ?? 0),
      price:
        rawValue.price !== null && rawValue.price !== ""
          ? Number(rawValue.price)
          : null,
    };

    if (payload.availableQty > payload.qty) {
      this.errorMessage = "Available quantity cannot exceed total quantity.";
      return;
    }

    this.isSubmitting = true;

    const request$ = this.editData
      ? this.bookService.updateBook(this.editData.id, payload)
      : this.bookService.addBook(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.saved.emit();
      },
      error: (err) => {
        console.error("Error saving book:", err);
        this.errorMessage =
          err?.error?.message || "An unexpected error occurred while saving.";
        this.isSubmitting = false;
      },
    });
  }

  resetForm(): void {
    this.bookForm.reset({
      qty: 1,
      availableQty: 1,
      postDate: new Date().toISOString().substring(0, 10),
      rackCode: null,
    });
  }

  closeForm(): void {
    this.close.emit();
  }
}
