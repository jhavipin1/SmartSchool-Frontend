import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { AddBookComponent } from "../add-book/add-book.component";
import { BookResponseDto } from "../../../shared/models/book.model";
import { BookService } from "../../../shared/services/book.service";

@Component({
  selector: "app-book-list",
  standalone: true,
  imports: [CommonModule, FormsModule, AddBookComponent],
  templateUrl: "./book-list.component.html",
})
export class BookListComponent implements OnInit {
  books: BookResponseDto[] = [];
  isLoading = false;
  selectedBook: BookResponseDto | null = null;

  // Pagination & Filtering
  searchTerm = "";
  pageSize = 50;
  currentPage = 0;
  totalElements = 0;
  totalPages = 0;

  // Search Debounce
  private searchSubject = new Subject<string>();

  showAddForm = false;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 0;
        this.loadBooks();
      });
  }

  loadBooks(): void {
    this.isLoading = true;
    const filter = this.searchTerm.trim()
      ? { title: this.searchTerm.trim() }
      : {};

    this.bookService
      .searchBooks(filter, this.currentPage, this.pageSize)
      .subscribe({
        next: (page) => {
          this.books = page.content;
          this.totalElements = page.totalElements;
          this.totalPages = page.totalPages;
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Failed to load books:", err);
          this.isLoading = false;
        },
      });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
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
    this.selectedBook = book;
    this.showAddForm = true;
  }

  deleteBook(bookId: number): void {
    if (confirm("Are you sure you want to delete this book record?")) {
      this.bookService.deleteBook(bookId).subscribe({
        next: () => this.loadBooks(),
        error: (err) => console.error("Failed to delete book:", err),
      });
    }
  }

  closeAddForm(): void {
    this.showAddForm = false;
    this.selectedBook = null;
  }

  onBookSaved(): void {
    this.closeAddForm();
    this.loadBooks();
  }
}
