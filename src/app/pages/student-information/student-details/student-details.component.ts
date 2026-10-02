import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

export interface Student {
  id: string;
  admissionNo: string;
  studentName: string;
  rollNo: string;
  class: string;
  section: string;
  fatherName: string;
  motherName?: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  category: string;
  mobileNumber: string;
  email?: string;
  address?: string;
  avatarUrl?: string;
}

@Component({
  selector: "app-student-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./student-details.component.html",
})
export class StudentDetailsComponent implements OnInit {
  // Criteria Search Models
  selectedClass: string = "Class 1";
  selectedSection: string = "A";
  keywordSearch: string = "";

  // Active Tab
  activeTab: "list" | "details" = "list";

  // Table Filter & Pagination
  tableSearchText: string = "";
  pageSize: number = 50;

  // Options
  classList: string[] = ["Class 1", "Class 2", "Class 3", "Class 4"];
  sectionList: string[] = ["A", "B", "C", "D"];

  // Dynamic Master Student Dataset
  students: Student[] = [
    {
      id: "1",
      admissionNo: "1800011",
      studentName: "Edward Thomas",
      rollNo: "001",
      class: "Class 1",
      section: "A",
      fatherName: "Olivier Thomas",
      motherName: "Sophia Thomas",
      dateOfBirth: "04/08/2020",
      gender: "Male",
      category: "OBC",
      mobileNumber: "98262573272",
      email: "edward@example.com",
      address: "73 Canal Street, New York",
    },
    {
      id: "2",
      admissionNo: "002",
      studentName: "Sneha Patel",
      rollNo: "002",
      class: "Class 1",
      section: "A",
      fatherName: "Ramesh Patel",
      motherName: "Sunita Patel",
      dateOfBirth: "07/15/2016",
      gender: "Female",
      category: "General",
      mobileNumber: "9876200001",
      email: "sneha.p@example.com",
      address: "42 Hilltop Rd, Mumbai",
    },
    {
      id: "3",
      admissionNo: "003",
      studentName: "Hariom Yadav",
      rollNo: "003",
      class: "Class 1",
      section: "A",
      fatherName: "Suresh Yadav",
      motherName: "Meena Yadav",
      dateOfBirth: "04/08/2020",
      gender: "Male",
      category: "OBC",
      mobileNumber: "9811223344",
      address: "12 Green Park, Delhi",
    },
  ];

  filteredStudents: Student[] = [];

  ngOnInit(): void {
    this.filteredStudents = [...this.students];
  }

  // Filter handlers
  onFilterSearch(): void {
    this.filteredStudents = this.students.filter(
      (s) =>
        s.class === this.selectedClass && s.section === this.selectedSection,
    );
  }

  onKeywordSearch(): void {
    if (!this.keywordSearch.trim()) {
      this.filteredStudents = [...this.students];
      return;
    }
    const q = this.keywordSearch.toLowerCase();
    this.filteredStudents = this.students.filter(
      (s) =>
        s.studentName.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.mobileNumber.includes(q),
    );
  }

  onTableSearch(): void {
    const q = this.tableSearchText.toLowerCase();
    this.filteredStudents = this.students.filter((s) =>
      Object.values(s).some(
        (val) => val && val.toString().toLowerCase().includes(q),
      ),
    );
  }

  // Quick Action Handlers
  onViewStudent(student: Student): void {
    console.log("Viewing student:", student);
  }

  onEditStudent(student: Student): void {
    console.log("Editing student:", student);
  }

  onCollectFees(student: Student): void {
    console.log("Collecting fees for:", student);
  }

  onPrintStudent(student: Student): void {
    console.log("Printing record for:", student);
  }
}
