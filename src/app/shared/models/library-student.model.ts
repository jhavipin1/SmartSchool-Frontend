export interface StudentSearchRequestDto {
  classId?: number;
  sectionId?: number;
  searchTerm?: string;
}

export interface StudentResponseDto {
  rollNumber: any;
  bloodGroup: any;
  category: any;
  religion: any;
  house: any;
  email: any;
  fatherPhone: any;
  currentAddress: any;
  nationalIdentificationNo: any;
  previousSchool: any;
  bankAccountNo: any;
  bankName: any;
  admissionNumber: any;
  firstName: any;
  middleName: any;
  lastName: any;
  mobileNo: any;
  id: number;
  memberId?: string | number;
  libraryCardNo?: string;
  admissionNo: string;
  studentName: string;
  className: string;
  sectionName?: string;
  fatherName?: string;
  dateOfBirth?: string;
  gender?: string;
  mobileNumber?: string;
}

export interface LibraryCardUpdateRequestDto {
  libraryCardNo: string;
}

export interface LibraryCardAudit {
  id: number;
  studentId: number;
  oldLibraryCardNo?: string;
  newLibraryCardNo?: string;
  updatedBy?: string;
  updatedAt?: string;
  actionReason?: string;
}

export interface OptionItem {
  id: number;
  name: string;
}
