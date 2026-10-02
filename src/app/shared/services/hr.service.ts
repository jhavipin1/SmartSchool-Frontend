import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  Department,
  Designation,
  LeaveType,
  SalaryHead,
} from "../models/hr.model";

@Injectable({
  providedIn: "root",
})
export class HrService {
  private baseUrl = "http://localhost:8080/api";

  constructor(private http: HttpClient) {}

  // Departments
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/departments`);
  }
  saveDepartment(data: Department): Observable<Department> {
    return data.id
      ? this.http.put<Department>(
          `${this.baseUrl}/departments/${data.id}`,
          data,
        )
      : this.http.post<Department>(`${this.baseUrl}/departments`, data);
  }
  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/departments/${id}`);
  }

  // Designations
  getDesignations(): Observable<Designation[]> {
    return this.http.get<Designation[]>(`${this.baseUrl}/designations`);
  }
  saveDesignation(data: Designation): Observable<Designation> {
    return data.id
      ? this.http.put<Designation>(
          `${this.baseUrl}/designations/${data.id}`,
          data,
        )
      : this.http.post<Designation>(`${this.baseUrl}/designations`, data);
  }
  deleteDesignation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/designations/${id}`);
  }

  // Leave Types
  getLeaveTypes(): Observable<LeaveType[]> {
    return this.http.get<LeaveType[]>(`${this.baseUrl}/leave-types`);
  }
  saveLeaveType(data: LeaveType): Observable<LeaveType> {
    return data.id
      ? this.http.put<LeaveType>(`${this.baseUrl}/leave-types/${data.id}`, data)
      : this.http.post<LeaveType>(`${this.baseUrl}/leave-types`, data);
  }
  deleteLeaveType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/leave-types/${id}`);
  }

  // Salary Heads
  getSalaryHeads(): Observable<SalaryHead[]> {
    return this.http.get<SalaryHead[]>(`${this.baseUrl}/salary-heads`);
  }
  saveSalaryHead(data: SalaryHead): Observable<SalaryHead> {
    return data.id
      ? this.http.put<SalaryHead>(
          `${this.baseUrl}/salary-heads/${data.id}`,
          data,
        )
      : this.http.post<SalaryHead>(`${this.baseUrl}/salary-heads`, data);
  }
  deleteSalaryHead(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/salary-heads/${id}`);
  }
}
