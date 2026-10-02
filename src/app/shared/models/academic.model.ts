export interface Section {
  id?: number;
  sectionName: string;
}

export interface ClassName {
  id?: number;
  className: string;
  sections?: Section[];
}

export interface ClassWithSectionsRequest {
  className: string;
  sectionIds: number[];
}

export interface Subject {
  id?: number;
  name: string;
  code?: string;
  subjectType: "Theory" | "Practical";
  description?: string;
  active?: boolean;
  maxMarks?: number;
}
