export interface StaffSearchRequestDto {
  roleId?: number;
  searchTerm?: string;
}

export interface StaffResponseDto {
  id: number;
  memberId?: string | number;
  libraryCardNo?: string;
  staffId: string;
  staffName: string;
  role: string;
  department?: string;
  designation?: string;
  gender?: string;
  mobileNumber?: string;
  email?: string;
}

export interface LibraryCardUpdateRequestDto {
  libraryCardNo: string;
}

export interface OptionItem {
  id: number;
  name: string;
}
