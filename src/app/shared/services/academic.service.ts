import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  ClassName,
  ClassWithSectionsRequest,
  Section,
  Subject,
} from "../models/academic.model";

@Injectable({
  providedIn: "root",
})
export class AcademicService {
  private readonly baseUrl = "http://localhost:8080/api";

  constructor(private http: HttpClient) {}

  // --- CLASS ENDPOINTS ---
  getAllClasses(): Observable<ClassName[]> {
    return this.http.get<ClassName[]>(`${this.baseUrl}/classes`);
  }

  createClassWithSections(
    payload: ClassWithSectionsRequest,
  ): Observable<ClassName> {
    return this.http.post<ClassName>(
      `${this.baseUrl}/classes/class-with-sections`,
      payload,
    );
  }

  updateClass(id: number, payload: Partial<ClassName>): Observable<ClassName> {
    return this.http.put<ClassName>(`${this.baseUrl}/classes/${id}`, payload);
  }

  deleteClass(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/classes/${id}`);
  }

  // --- SECTION ENDPOINTS ---
  getSectionsByClass(classId: number): Observable<Section[]> {
    return this.http.get<Section[]>(
      `${this.baseUrl}/sections/class/${classId}`,
    );
  }

  createSection(payload: { sectionName: string }): Observable<Section> {
    return this.http.post<Section>(`${this.baseUrl}/sections`, payload);
  }

  updateSection(
    id: number,
    payload: { sectionName: string },
  ): Observable<Section> {
    return this.http.put<Section>(`${this.baseUrl}/sections/${id}`, payload);
  }

  deleteSection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/sections/${id}`);
  }

  // --- SUBJECT ENDPOINTS ---
  getAllSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.baseUrl}/v1/subjects`);
  }

  createSubject(payload: Subject): Observable<Subject> {
    return this.http.post<Subject>(`${this.baseUrl}/v1/subjects`, payload);
  }

  updateSubject(id: number, payload: Subject): Observable<Subject> {
    return this.http.put<Subject>(`${this.baseUrl}/v1/subjects/${id}`, payload);
  }

  deleteSubject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/v1/subjects/${id}`);
  }
}
