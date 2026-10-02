export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum Category {
  GENERAL = "GENERAL",
  OBC = "OBC",
  SC = "SC",
  ST = "ST",
}

export enum Religion {
  HINDUISM = "HINDUISM",
  ISLAM = "ISLAM",
  CHRISTIANITY = "CHRISTIANITY",
  SIKHISM = "SIKHISM",
  OTHER = "OTHER",
}

export enum BloodGroup {
  A_POSITIVE = "A_POSITIVE",
  A_NEGATIVE = "A_NEGATIVE",
  B_POSITIVE = "B_POSITIVE",
  B_NEGATIVE = "B_NEGATIVE",
  O_POSITIVE = "O_POSITIVE",
  O_NEGATIVE = "O_NEGATIVE",
  AB_POSITIVE = "AB_POSITIVE",
  AB_NEGATIVE = "AB_NEGATIVE",
}

export enum House {
  RED = "RED",
  BLUE = "BLUE",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
}

export interface StudentRequestDto {
  admissionNumber: string;
  rollNumber?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender?: Gender;
  category?: Category;
  religion?: Religion;
  bloodGroup?: BloodGroup;
  house?: House;
  classId?: number;
  sectionId?: number;
  mobileNo?: string;
  email?: string;
  admissionDate?: string;
  height?: number;
  weight?: number;
  fatherName?: string;
  fatherPhone?: string;
  fatherOcc?: string;
  motherName?: string;
  motherPhone?: string;
  motherOcc?: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  guardianAddress?: string;
  currentAddress?: string;
  permanentAddress?: string;
  bankAccountNo?: string;
  bankName?: string;
  ifscCode?: string;
  nationalIdentificationNo?: string;
  localIdentificationNo?: string;
  previousSchool?: string;
  note?: string;
}

export interface StudentResponseDto extends StudentRequestDto {
  id: number;
  libraryCardNo?: string;
  libraryCardStatus?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
