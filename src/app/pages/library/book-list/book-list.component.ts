import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
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

  // Pagination & Filtering
  searchTerm = "";
  pageSize = 50;
  currentPage = 0;
  totalElements = 0;
  totalPages = 0;

  // Form Visibility Control
  showAddForm = false;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
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

  onSearchChange(): void {
    this.currentPage = 0;
    this.loadBooks();
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.loadBooks();
  }

  openAddForm(): void {
    this.showAddForm = true;
  }

  closeAddForm(): void {
    this.showAddForm = false;
  }

  onBookSaved(): void {
    this.closeAddForm();
    this.loadBooks();
  }
}
