import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Page } from "../models/book.model";
import { StudentResponseDto } from "../models/library-student.model";
import { Gender, StudentRequestDto } from "../models/student.model";

@Injectable({
  providedIn: "root",
})
export class StudentService {
  getStudentByAdmissionNumber(arg0: string) {
    throw new Error("Method not implemented.");
  }
  getStudentByRollNumber(arg0: string) {
    throw new Error("Method not implemented.");
  }
  private apiUrl = "/api/students";

  constructor(private http: HttpClient) {}

  getAllStudents(
    page: number = 0,
    size: number = 20,
  ): Observable<Page<StudentResponseDto>> {
    const params = new HttpParams().set("page", page).set("size", size);
    return this.http.get<Page<StudentResponseDto>>(this.apiUrl, { params });
  }

  getStudentById(id: number): Observable<StudentResponseDto> {
    return this.http.get<StudentResponseDto>(`${this.apiUrl}/${id}`);
  }

  searchStudents(
    query: string,
    page: number = 0,
    size: number = 20,
  ): Observable<Page<StudentResponseDto>> {
    const params = new HttpParams()
      .set("query", query)
      .set("page", page)
      .set("size", size);
    return this.http.get<Page<StudentResponseDto>>(`${this.apiUrl}/search`, {
      params,
    });
  }

  filterStudents(
    classId?: number,
    sectionId?: number,
    gender?: Gender,
    page: number = 0,
    size: number = 20,
  ): Observable<Page<StudentResponseDto>> {
    let params = new HttpParams().set("page", page).set("size", size);
    if (classId) params = params.set("classId", classId);
    if (sectionId) params = params.set("sectionId", sectionId);
    if (gender) params = params.set("gender", gender);

    return this.http.get<Page<StudentResponseDto>>(`${this.apiUrl}/filter`, {
      params,
    });
  }

  createStudent(dto: StudentRequestDto): Observable<StudentResponseDto> {
    return this.http.post<StudentResponseDto>(this.apiUrl, dto);
  }

  updateStudent(
    id: number,
    dto: StudentRequestDto,
  ): Observable<StudentResponseDto> {
    return this.http.put<StudentResponseDto>(`${this.apiUrl}/${id}`, dto);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
