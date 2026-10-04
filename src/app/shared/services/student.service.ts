import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpEvent,
  HttpParams,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { API_CONFIG } from "../../../api.constants";
import {
  ClassNameResponseDto,
  ClassWithSectionsRequestDto,
  Gender,
  StudentRequestDto,
  StudentResponseDto,
} from "../models/student.model";

@Injectable({
  providedIn: "root",
})
export class StudentService {
  private readonly endpointUrl = `${API_CONFIG.BASE_URL}/students`;

  constructor(private http: HttpClient) {}

  /** Fast Bulk Upload */
  bulkUploadStudents(file: File): Observable<HttpEvent<StudentResponseDto[]>> {
    const formData = new FormData();
    formData.append("file", file, file.name);

    const request = new HttpRequest(
      "POST",
      `${this.endpointUrl}/bulk-upload`,
      formData,
      { reportProgress: true, responseType: "json" },
    );

    return this.http.request<StudentResponseDto[]>(request);
  }

  /** Batch Creation */
  createStudentsBatch(
    dtos: StudentRequestDto[],
  ): Observable<StudentResponseDto[]> {
    return this.http.post<StudentResponseDto[]>(
      `${this.endpointUrl}/batch`,
      dtos,
    );
  }

  /** Fetch all classes with embedded sections */
  getAllClasses(): Observable<ClassNameResponseDto[]> {
    return this.http.get<ClassNameResponseDto[]>(
      `${API_CONFIG.BASE_URL}/classes`,
    );
  }

  /** Create class with sections */
  createClassWithSections(
    dto: ClassWithSectionsRequestDto,
  ): Observable<ClassNameResponseDto> {
    return this.http.post<ClassNameResponseDto>(
      `${API_CONFIG.BASE_URL}/classes/class-with-sections`,
      dto,
    );
  }

  /** Fetch all student records without pagination */
  getAllStudents(): Observable<StudentResponseDto[]> {
    return this.http.get<StudentResponseDto[]>(`${this.endpointUrl}/all`);
  }

  getStudentById(id: number): Observable<StudentResponseDto> {
    return this.http.get<StudentResponseDto>(`${this.endpointUrl}/${id}`);
  }

  getStudentByAdmissionNumber(
    admissionNumber: string,
  ): Observable<StudentResponseDto> {
    return this.http.get<StudentResponseDto>(
      `${this.endpointUrl}/admission/${encodeURIComponent(admissionNumber)}`,
    );
  }

  getStudentByRollNumber(rollNumber: string): Observable<StudentResponseDto> {
    return this.http.get<StudentResponseDto>(
      `${this.endpointUrl}/roll-number/${encodeURIComponent(rollNumber)}`,
    );
  }

  searchStudents(query: string): Observable<StudentResponseDto[]> {
    const params = new HttpParams().set("query", query);
    return this.http.get<StudentResponseDto[]>(`${this.endpointUrl}/search`, {
      params,
    });
  }

  filterStudents(
    classId?: number,
    sectionId?: number,
    gender?: Gender,
  ): Observable<StudentResponseDto[]> {
    let params = new HttpParams();
    if (classId !== undefined && classId !== null)
      params = params.set("classId", classId);
    if (sectionId !== undefined && sectionId !== null)
      params = params.set("sectionId", sectionId);
    if (gender) params = params.set("gender", gender);

    return this.http.get<StudentResponseDto[]>(`${this.endpointUrl}/filter`, {
      params,
    });
  }

  createStudent(dto: StudentRequestDto): Observable<StudentResponseDto> {
    return this.http.post<StudentResponseDto>(this.endpointUrl, dto);
  }

  updateStudent(
    id: number,
    dto: StudentRequestDto,
  ): Observable<StudentResponseDto> {
    return this.http.put<StudentResponseDto>(`${this.endpointUrl}/${id}`, dto);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpointUrl}/${id}`);
  }
}
