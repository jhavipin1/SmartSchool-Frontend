import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { finalize } from "rxjs/operators";
import { BookResponseDto } from "../../../shared/models/book.model";
import { BookService } from "../../../shared/services/book.service";
import { AddBookComponent } from "../add-book/add-book.component";

@Component({
  selector: "app-book-list",
  standalone: true,
  imports: [CommonModule, FormsModule, AddBookComponent],
  templateUrl: "./book-list.component.html",
})
export class BookListComponent implements OnInit {
  books: BookResponseDto[] = [];
  selectedBook: BookResponseDto | null = null;

  showAddForm = false;
  isLoading = false;

  searchTerm = "";
  pageSize = 10; // Default to 10 items per page
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    // Remove this line to avoid toggling loading UI:
    // this.isLoading = true;

    if (this.pageSize === 0) {
      this.bookService.getAllBooksUnpaginated().subscribe({
        next: (data) => {
          this.books = data || [];
          this.totalElements = this.books.length;
        },
        error: (err) => console.error("Error loading books:", err),
      });
    } else {
      this.bookService.getAllBooks(this.currentPage, this.pageSize).subscribe({
        next: (res) => {
          this.books = res?.content || [];
          this.totalPages = res?.totalPages || 0;
          this.totalElements = res?.totalElements || 0;
        },
        error: (err) => console.error("Error loading books:", err),
      });
    }

    // 2. Unpaginated Mode (pageSize === 0)
    if (this.pageSize === 0) {
      this.bookService
        .getAllBooksUnpaginated()
        .pipe(
          finalize(() => {
            this.isLoading = false;
          }),
        )
        .subscribe({
          next: (data) => {
            this.books = data || [];
            this.totalElements = this.books.length;
            this.totalPages = 1;
            this.currentPage = 0;
          },
          error: (err) => {
            console.error("Failed to load books:", err);
            this.books = [];
            this.totalElements = 0;
            this.totalPages = 0;
          },
        });
    } else {
      // 3. Paginated Load Mode (Default 10)
      this.bookService
        .getAllBooks(this.currentPage, this.pageSize)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          }),
        )
        .subscribe({
          next: (res) => {
            this.books = res?.content || [];
            this.totalPages = res?.totalPages || 0;
            this.totalElements = res?.totalElements || 0;
          },
          error: (err) => {
            console.error("Failed to load books:", err);
            this.books = [];
            this.totalPages = 0;
            this.totalElements = 0;
          },
        });
    }
  }

  onSearchInput(): void {
    this.currentPage = 0;
    this.loadBooks();
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.loadBooks();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadBooks();
    }
  }

  openAddForm(): void {
    this.selectedBook = null;
    this.showAddForm = true;
  }

  editBook(book: BookResponseDto): void {
    this.selectedBook = { ...book };
    this.showAddForm = true;
  }

  closeAddForm(): void {
    this.showAddForm = false;
    this.selectedBook = null;
  }

  onBookSaved(): void {
    this.closeAddForm();
    this.loadBooks();
  }

  deleteBook(id: number): void {
    if (confirm("Are you sure you want to delete this book?")) {
      this.bookService.deleteBook(id).subscribe({
        next: () => this.loadBooks(),
        error: (err) => console.error("Error deleting book:", err),
      });
    }
  }
}
