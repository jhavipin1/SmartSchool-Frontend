import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  FeeGroup,
  FeeType,
  FeeDiscount,
  FeeMaster,
  FeePaymentStatus,
  FeeRequestDto,
  FeeResponseDto,
} from "../models/fee.model";

@Injectable({
  providedIn: "root",
})
export class FeeService {
  private baseUrl = "http://localhost:8080/api/fees";
  private readonly apiUrl = "/api/fees";

  constructor(private http: HttpClient) {}

  // --- Fee Group Endpoints ---
  getFeeGroups(): Observable<FeeGroup[]> {
    return this.http.get<FeeGroup[]>(`${this.baseUrl}/groups`);
  }
  saveFeeGroup(group: FeeGroup): Observable<FeeGroup> {
    return this.http.post<FeeGroup>(`${this.baseUrl}/groups`, group);
  }
  deleteFeeGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/groups/${id}`);
  }

  // --- Fee Type Endpoints ---
  getFeeTypes(): Observable<FeeType[]> {
    return this.http.get<FeeType[]>(`${this.baseUrl}/types`);
  }
  saveFeeType(type: FeeType): Observable<FeeType> {
    return this.http.post<FeeType>(`${this.baseUrl}/types`, type);
  }
  deleteFeeType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/types/${id}`);
  }

  // --- Fee Discount Endpoints ---
  getFeeDiscounts(): Observable<FeeDiscount[]> {
    return this.http.get<FeeDiscount[]>(`${this.baseUrl}/discounts`);
  }
  saveFeeDiscount(discount: FeeDiscount): Observable<FeeDiscount> {
    return this.http.post<FeeDiscount>(`${this.baseUrl}/discounts`, discount);
  }
  deleteFeeDiscount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/discounts/${id}`);
  }

  // --- Fee Master Endpoints ---
  getFeeMasters(): Observable<FeeMaster[]> {
    return this.http.get<FeeMaster[]>(`${this.baseUrl}/master`);
  }
  saveFeeMaster(fee: FeeMaster): Observable<FeeMaster> {
    return this.http.post<FeeMaster>(`${this.baseUrl}/master`, fee);
  }
  deleteFeeMaster(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/master/${id}`);
  }

  // 1. Assign / Create new fee
  createFee(requestDto: FeeRequestDto): Observable<FeeResponseDto> {
    return this.http.post<FeeResponseDto>(this.apiUrl, requestDto);
  }

  // 2. Update existing fee assignment
  updateFee(id: number, requestDto: FeeRequestDto): Observable<FeeResponseDto> {
    return this.http.put<FeeResponseDto>(`${this.apiUrl}/${id}`, requestDto);
  }

  // 3. Get fee by ID
  getFeeById(id: number): Observable<FeeResponseDto> {
    return this.http.get<FeeResponseDto>(`${this.apiUrl}/${id}`);
  }

  // 4. Get all fees
  getAllFees(): Observable<FeeResponseDto[]> {
    return this.http.get<FeeResponseDto[]>(this.apiUrl);
  }

  // 5. Get fees for a specific student
  getFeesByStudent(studentId: number): Observable<FeeResponseDto[]> {
    return this.http.get<FeeResponseDto[]>(
      `${this.apiUrl}/student/${studentId}`,
    );
  }

  // 6. Get fees filtered by status
  getFeesByStatus(status: FeePaymentStatus): Observable<FeeResponseDto[]> {
    return this.http.get<FeeResponseDto[]>(`${this.apiUrl}/status/${status}`);
  }

  // 7. Get fees by class ID
  getFeesByClass(classId: number): Observable<FeeResponseDto[]> {
    return this.http.get<FeeResponseDto[]>(`${this.apiUrl}/class/${classId}`);
  }

  // 8. Record payment against a fee
  recordPayment(
    id: number,
    paymentAmount: number,
    fineAmount?: number,
  ): Observable<FeeResponseDto> {
    let params = new HttpParams().set(
      "paymentAmount",
      paymentAmount.toString(),
    );
    if (fineAmount !== undefined && fineAmount !== null) {
      params = params.set("fineAmount", fineAmount.toString());
    }
    return this.http.patch<FeeResponseDto>(
      `${this.apiUrl}/${id}/pay`,
      {},
      { params },
    );
  }

  // 9. Delete fee record
  deleteFee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
