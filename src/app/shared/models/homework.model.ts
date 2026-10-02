export interface Homework {
  id?: number;
  className: { id: number; name: string };
  section: { id: number; name: string };
  subjectGroup?: { id: number; name: string };
  subject: { id: number; name: string };
  homeworkDate: string;
  submissionDate: string;
  evaluationDate?: string;
  maxMarks?: number;
  description?: string;
  documentPath?: string;
  createdBy?: string;
  active?: boolean;
}

export interface HomeworkSearchCriteria {
  classId?: number;
  sectionId?: number;
  subjectGroupId?: number;
  subjectId?: number;
}
