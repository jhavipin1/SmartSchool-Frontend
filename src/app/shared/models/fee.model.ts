export interface FeeGroup {
  id?: number;
  name: string;
  description?: string;
}

export interface FeeType {
  id?: number;
  feeGroup: string;
  name: string;
  code: string;
  description?: string;
}

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIX_AMOUNT = "FIX_AMOUNT",
}

export interface FeeDiscount {
  id?: number;
  name: string;
  discountCode: string;
  discountType: DiscountType;
  percentage?: number;
  amount?: number;
  numberOfUseCount: number;
  expiryDate?: string;
  description?: string;
}

export enum FeePaymentStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  OVERDUE = "OVERDUE",
}

export enum FineType {
  NONE = "NONE",
  PERCENTAGE = "PERCENTAGE",
  FIX_AMOUNT = "FIX_AMOUNT",
  CUMULATIVE = "CUMULATIVE",
}

export interface FeeMaster {
  id?: number;
  studentId: number;
  feeGroupId?: number;
  feeTypeId: number;
  feeDiscountId?: number;
  dueDate: string;
  amount: number;
  paidAmount?: number;
  fineAmount?: number;
  discountAmount?: number;
  status?: FeePaymentStatus;
  description?: string;
  fineType?: FineType;
}
export interface FeeRequestDto {
  studentId: number;
  classId: number;
  feeType: string;
  totalAmount: number;
  dueDate: string; // ISO date format YYYY-MM-DD
}

export interface FeeResponseDto {
  id: number;
  studentId: number;
  studentName?: string;
  classId: number;
  className?: string;
  feeType: string;
  totalAmount: number;
  paidAmount: number;
  fineAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: FeePaymentStatus;
}
