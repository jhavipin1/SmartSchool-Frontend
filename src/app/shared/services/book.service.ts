import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  BookRequestDto,
  BookResponseDto,
  Page,
  RackDto,
} from "../models/book.model";

@Injectable({
  providedIn: "root",
})
export class BookService {
  private apiUrl = "http://localhost:8080/api/books";
  private rackUrl = "http://localhost:8080/api/racks";

  constructor(private http: HttpClient) {}

  addBook(request: BookRequestDto): Observable<BookResponseDto> {
    return this.http.post<BookResponseDto>(this.apiUrl, request);
  }

  updateBook(id: number, request: BookRequestDto): Observable<BookResponseDto> {
    return this.http.put<BookResponseDto>(`${this.apiUrl}/${id}`, request);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchBooks(
    params: {
      title?: string;
      author?: string;
      subject?: string;
      bookNumber?: string;
      isbnNumber?: string;
      publisherName?: string;
      rackCode?: string;
    },
    page: number = 0,
    size: number = 50,
  ): Observable<Page<BookResponseDto>> {
    let httpParams = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString());

    Object.keys(params).forEach((key) => {
      const val = (params as any)[key];
      if (val !== undefined && val !== null && val !== "") {
        httpParams = httpParams.set(key, val);
      }
    });

    return this.http.get<Page<BookResponseDto>>(`${this.apiUrl}/search`, {
      params: httpParams,
    });
  }

  getRacks(): Observable<RackDto[]> {
    return this.http.get<RackDto[]>(this.rackUrl);
  }
}
