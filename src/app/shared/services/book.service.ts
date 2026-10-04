import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map } from "rxjs";

import {
  BookRequestDto,
  BookResponseDto,
  Page,
  RackDto,
} from "../models/book.model";
import { environment } from "../../../environment";

@Injectable({
  providedIn: "root",
})
export class BookService {
  private readonly apiUrl = `${environment.apiUrl}/books`;
  private readonly rackUrl = `${environment.apiUrl}/racks`;

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
    size: number = 25,
  ): Observable<Page<BookResponseDto>> {
    let httpParams = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value.trim() !== "") {
        httpParams = httpParams.set(key, value.trim());
      }
    });

    return this.http.get<Page<BookResponseDto>>(`${this.apiUrl}/search`, {
      params: httpParams,
    });
  }

  /**
   * Fetches all racks.
   * Handles both plain array (List<RackDto>) and paginated Spring responses (Page<RackDto>).
   */
  getRacks(): Observable<RackDto[]> {
    return this.http.get<any>(`${this.rackUrl}/search?size=1000`).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response;
        }
        return response?.content || [];
      }),
    );
  }
}
