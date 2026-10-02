export interface Department {
  id?: number;
  departmentName: string;
  description?: string;
}

export interface Designation {
  id?: number;
  designationName: string;
  description?: string;
}

export interface LeaveType {
  id?: number;
  type: string;
  isSystem: boolean;
}

export enum SalaryType {
  EARNING = "EARNING",
  DEDUCTION = "DEDUCTION",
}

export interface SalaryHead {
  id?: number;
  salaryHeadName: string;
  salaryType: SalaryType;
}
