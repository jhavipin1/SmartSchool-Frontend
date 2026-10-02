import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";

export interface HomeworkItem {
  id: number;
  className: string;
  section: string;
  subject: string;
  homeworkDate: string;
  submissionDate: string;
  maxMarks?: number;
  description?: string;
  fileName?: string;
  status: "Active" | "Draft";
}

@Component({
  selector: "app-homework-add",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./add-homework.component.html",
})
export class AddHomeworkComponent implements OnInit {
  addHomeworkForm!: FormGroup;

  classes: string[] = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 9",
    "Class 10",
  ];
  sections: string[] = ["Section A", "Section B", "Section C", "Section D"];
  subjects: string[] = [
    "English",
    "Mathematics",
    "Science",
    "Hindi",
    "Social Studies",
    "Computer Science",
  ];

  // File state
  selectedFile: File | null = null;
  isDragOver = false;

  // Custom Calendar Controls state
  showHomeworkDatePicker = false;
  showSubmissionDatePicker = false;

  homeworkDateList: {
    day: number;
    isCurrentMonth: boolean;
    fullDate: string;
  }[] = [];
  submissionDateList: {
    day: number;
    isCurrentMonth: boolean;
    fullDate: string;
  }[] = [];

  currentMonthHomework = new Date();
  currentMonthSubmission = new Date();

  daysOfWeek: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  homeworkList: HomeworkItem[] = [
    {
      id: 1,
      className: "Class 10",
      section: "Section A",
      subject: "Mathematics",
      homeworkDate: "2026-10-02",
      submissionDate: "2026-10-05",
      maxMarks: 100,
      description:
        "Complete Exercise 4.2 Questions 1 to 10 in homework notebook.",
      fileName: "Math_Assignment_Ch4.pdf",
      status: "Active",
    },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const todayStr = new Date().toISOString().substring(0, 10);
    this.addHomeworkForm = this.fb.group({
      selectedClass: ["", Validators.required],
      selectedSection: ["", Validators.required],
      selectedSubject: ["", Validators.required],
      homeworkDate: [todayStr, Validators.required],
      submissionDate: ["", Validators.required],
      maxMarks: [null, [Validators.min(0)]],
      description: [""],
      isPublished: [true],
    });

    this.generateCalendarDays("homework");
    this.generateCalendarDays("submission");
  }

  // Calendar Helper Logic
  generateCalendarDays(type: "homework" | "submission"): void {
    const date =
      type === "homework"
        ? this.currentMonthHomework
        : this.currentMonthSubmission;
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const daysArray: {
      day: number;
      isCurrentMonth: boolean;
      fullDate: string;
    }[] = [];

    // Previous month padding days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const d = new Date(year, month - 1, dayNum);
      daysArray.push({
        day: dayNum,
        isCurrentMonth: false,
        fullDate: d.toISOString().substring(0, 10),
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const monthStr = String(month + 1).padStart(2, "0");
      const dayStr = String(i).padStart(2, "0");
      daysArray.push({
        day: i,
        isCurrentMonth: true,
        fullDate: `${year}-${monthStr}-${dayStr}`,
      });
    }

    if (type === "homework") {
      this.homeworkDateList = daysArray;
    } else {
      this.submissionDateList = daysArray;
    }
  }

  changeMonth(type: "homework" | "submission", step: number): void {
    if (type === "homework") {
      this.currentMonthHomework.setMonth(
        this.currentMonthHomework.getMonth() + step,
      );
    } else {
      this.currentMonthSubmission.setMonth(
        this.currentMonthSubmission.getMonth() + step,
      );
    }
    this.generateCalendarDays(type);
  }

  selectDate(type: "homework" | "submission", fullDate: string): void {
    if (type === "homework") {
      this.addHomeworkForm.patchValue({ homeworkDate: fullDate });
      this.showHomeworkDatePicker = false;
    } else {
      this.addHomeworkForm.patchValue({ submissionDate: fullDate });
      this.showSubmissionDatePicker = false;
    }
  }

  toggleCalendar(type: "homework" | "submission"): void {
    if (type === "homework") {
      this.showHomeworkDatePicker = !this.showHomeworkDatePicker;
      this.showSubmissionDatePicker = false;
    } else {
      this.showSubmissionDatePicker = !this.showSubmissionDatePicker;
      this.showHomeworkDatePicker = false;
    }
  }

  // File Upload Logic
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  onSubmit(): void {
    if (this.addHomeworkForm.invalid) {
      this.addHomeworkForm.markAllAsTouched();
      return;
    }

    const formVal = this.addHomeworkForm.value;

    const newHomework: HomeworkItem = {
      id: Date.now(),
      className: formVal.selectedClass,
      section: formVal.selectedSection,
      subject: formVal.selectedSubject,
      homeworkDate: formVal.homeworkDate,
      submissionDate: formVal.submissionDate,
      maxMarks: formVal.maxMarks,
      description: formVal.description,
      fileName: this.selectedFile ? this.selectedFile.name : "",
      status: formVal.isPublished ? "Active" : "Draft",
    };

    this.homeworkList.unshift(newHomework);
    this.resetForm();
  }

  resetForm(): void {
    this.addHomeworkForm.reset({
      homeworkDate: new Date().toISOString().substring(0, 10),
      isPublished: true,
    });
    this.selectedFile = null;
    this.showHomeworkDatePicker = false;
    this.showSubmissionDatePicker = false;
  }

  deleteHomework(id: number): void {
    this.homeworkList = this.homeworkList.filter((item) => item.id !== id);
  }
}
