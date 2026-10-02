export interface BookIssueRequestDto {
  libraryCardNo: string;
  bookId: number;
  dueDate: string; // ISO format (YYYY-MM-DD)
}

export interface BookReturnRequestDto {
  issueRecordId: number;
}

export interface IssueResponseDto {
  id: number;
  libraryCardNo: string;
  bookId: number;
  bookTitle?: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: "ISSUED" | "RETURNED" | "OVERDUE";
  fineAmount?: number;
}
