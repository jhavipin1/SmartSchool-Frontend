import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RackDto, BookRequestDto } from "../../../shared/models/book.model";
import { BookService } from "../../../shared/services/book.service";

@Component({
  selector: "app-add-book",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./add-book.component.html",
})
export class AddBookComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  bookForm!: FormGroup;
  racks: RackDto[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRacks();
  }

  private initForm(): void {
    this.bookForm = this.fb.group({
      title: ["", [Validators.required]],
      bookNumber: ["", [Validators.required]],
      isbnNumber: [""],
      publisher: [""],
      author: [""],
      subject: [""],
      qty: [1, [Validators.required, Validators.min(0)]],
      availableQty: [1, [Validators.required, Validators.min(0)]],
      price: [null, [Validators.min(0)]],
      postDate: [new Date().toISOString().substring(0, 10)],
      rackCode: [""],
      description: [""],
    });

    this.bookForm.get("qty")?.valueChanges.subscribe((val) => {
      if (val !== null && val >= 0) {
        this.bookForm.patchValue({ availableQty: val }, { emitEvent: false });
      }
    });
  }

  private loadRacks(): void {
    this.bookService.getRacks().subscribe({
      next: (data) => (this.racks = data),
      error: (err) => console.error("Failed to load racks:", err),
    });
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const requestPayload: BookRequestDto = this.bookForm.value;

    this.bookService.addBook(requestPayload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.saved.emit();
      },
      error: (err) => {
        console.error("Error adding book:", err);
        this.isSubmitting = false;
      },
    });
  }

  closeForm(): void {
    this.close.emit();
  }
}
