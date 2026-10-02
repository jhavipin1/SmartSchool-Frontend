import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  BookIssueRequestDto,
  IssueResponseDto,
  BookReturnRequestDto,
} from "../models/issue.model";

@Injectable({
  providedIn: "root",
})
export class IssueService {
  private apiUrl = "http://localhost:8080/api/issues";

  constructor(private http: HttpClient) {}

  issueBook(request: BookIssueRequestDto): Observable<IssueResponseDto> {
    return this.http.post<IssueResponseDto>(`${this.apiUrl}/issue`, request);
  }

  returnBook(request: BookReturnRequestDto): Observable<IssueResponseDto> {
    return this.http.post<IssueResponseDto>(`${this.apiUrl}/return`, request);
  }
}
