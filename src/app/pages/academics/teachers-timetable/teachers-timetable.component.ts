import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

export interface TeacherSlot {
  className: string; // e.g. "Class 1(A)"
  subject: string; // e.g. "Subject: English (210)"
  timeFrom: string; // e.g. "8:00 AM"
  timeTo: string; // e.g. "08:45 AM"
  roomNo: string; // e.g. "100"
}

export interface DayTeacherSchedule {
  day: string;
  slots: TeacherSlot[];
}

@Component({
  selector: "app-teacher-timetable",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./teachers-timetable.component.html",
})
export class TeachersTimetableComponent implements OnInit {
  filterForm!: FormGroup;

  // Master teacher list
  teachers = [
    { id: "9002", name: "Shivam Verma (9002)" },
    { id: "9006", name: "Jason Sharlton (9006)" },
    { id: "1002", name: "Nishant Khare (1002)" },
    { id: "654", name: "Aman Verma (654)" },
  ];

  daysOfWeek: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Timetable display store mapped by teacher ID
  teacherScheduleMap: Record<string, DayTeacherSchedule[]> = {};
  currentSchedule: DayTeacherSchedule[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      teacherId: ["9002", Validators.required],
    });

    this.loadMockTeacherData();
    this.onSearch();
  }

  onSearch(): void {
    if (this.filterForm.invalid) return;

    const selectedId = this.filterForm.value.teacherId;
    this.currentSchedule =
      this.teacherScheduleMap[selectedId] || this.getEmptySchedule();
  }

  printTimetable(): void {
    window.print();
  }

  private getEmptySchedule(): DayTeacherSchedule[] {
    return this.daysOfWeek.map((day) => ({ day, slots: [] }));
  }

  private loadMockTeacherData(): void {
    // Data for Shivam Verma (9002)
    this.teacherScheduleMap["9002"] = [
      {
        day: "Monday",
        slots: [
          {
            className: "Class 1(A)",
            subject: "Subject: English (210)",
            timeFrom: "8:00 AM",
            timeTo: "08:45 AM",
            roomNo: "100",
          },
        ],
      },
      {
        day: "Tuesday",
        slots: [
          {
            className: "Class 1(A)",
            subject: "Subject: English (210)",
            timeFrom: "8:00 AM",
            timeTo: "08:30 AM",
            roomNo: "12",
          },
        ],
      },
      {
        day: "Wednesday",
        slots: [
          {
            className: "Class 1(A)",
            subject: "Subject: English (210)",
            timeFrom: "8:00 AM",
            timeTo: "08:30 AM",
            roomNo: "12",
          },
        ],
      },
      {
        day: "Thursday",
        slots: [
          {
            className: "Class 1(A)",
            subject: "Subject: English (210)",
            timeFrom: "8:00 AM",
            timeTo: "08:30 AM",
            roomNo: "12",
          },
        ],
      },
      {
        day: "Friday",
        slots: [
          {
            className: "Class 1(A)",
            subject: "Subject: English (210)",
            timeFrom: "9:40 AM",
            timeTo: "10:05 AM",
            roomNo: "12",
          },
        ],
      },
      {
        day: "Saturday",
        slots: [
          {
            className: "Class 1(A)",
            subject: "Subject: Science (111)",
            timeFrom: "8:00 AM",
            timeTo: "08:30 AM",
            roomNo: "12",
          },
        ],
      },
      {
        day: "Sunday",
        slots: [],
      },
    ];

    // Data for Jason Sharlton (9006)
    this.teacherScheduleMap["9006"] = [
      {
        day: "Monday",
        slots: [
          {
            className: "Class 1(A)",
            subject: "Subject: Hindi (230)",
            timeFrom: "8:45 AM",
            timeTo: "9:30 AM",
            roomNo: "100",
          },
        ],
      },
      {
        day: "Tuesday",
        slots: [
          {
            className: "Class 1(A)",
            subject: "Subject: Hindi (230)",
            timeFrom: "08:35 AM",
            timeTo: "09:05 AM",
            roomNo: "12",
          },
        ],
      },
      { day: "Wednesday", slots: [] },
      { day: "Thursday", slots: [] },
      { day: "Friday", slots: [] },
      { day: "Saturday", slots: [] },
      { day: "Sunday", slots: [] },
    ];
  }
}
