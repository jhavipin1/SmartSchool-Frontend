import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from "@angular/forms";

export interface TimetableSlot {
  subject: string;
  timeFrom: string;
  timeTo: string;
  teacher: string;
  roomNo: string;
}

export interface DaySchedule {
  day: string; // 'Monday', 'Tuesday', etc.
  slots: TimetableSlot[];
}

@Component({
  selector: "app-class-timetable",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./class-timetable.component.html",
})
export class ClassTimetableComponent implements OnInit {
  // Navigation / Mode state
  viewMode: "view" | "add" = "view";
  selectedDayTab: string = "Monday";

  daysOfWeek: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Master Data (mock response from backend)
  classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];
  sections = ["A", "B", "C", "D"];
  subjectGroups = ["Class 1 subject", "Class 2 subject", "General Group"];

  subjects = [
    { id: "210", name: "English (210)" },
    { id: "230", name: "Hindi (230)" },
    { id: "110", name: "Mathematics (110)" },
    { id: "111", name: "Science (111)" },
  ];

  teachers = [
    { id: "9002", name: "Shivam Verma (9002)" },
    { id: "9006", name: "Jason Sharlton (9006)" },
    { id: "1002", name: "Nishant Khare (1002)" },
    { id: "654", name: "Aman Verma (654)" },
  ];

  // Search Filter Form
  filterForm!: FormGroup;

  // Timetable Add/Edit Form
  timetableForm!: FormGroup;

  // Data Store for display
  weeklySchedule: DaySchedule[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initFilterForm();
    this.initTimetableForm();
    this.loadMockTimetableData();
  }

  private initFilterForm(): void {
    this.filterForm = this.fb.group({
      selectedClass: ["Class 1", Validators.required],
      selectedSection: ["A", Validators.required],
      subjectGroup: ["Class 1 subject"],
    });
  }

  private initTimetableForm(): void {
    this.timetableForm = this.fb.group({
      periodStartTime: ["08:00 AM"],
      durationMinutes: [45],
      intervalMinutes: [0],
      defaultRoomNo: ["100"],
      slots: this.fb.array([]),
    });
  }

  get slotsArray(): FormArray {
    return this.timetableForm.get("slots") as FormArray;
  }

  createSlotGroup(slot?: TimetableSlot): FormGroup {
    return this.fb.group({
      subject: [slot?.subject || "", Validators.required],
      timeFrom: [slot?.timeFrom || "", Validators.required],
      timeTo: [slot?.timeTo || "", Validators.required],
      teacher: [slot?.teacher || "", Validators.required],
      roomNo: [slot?.roomNo || "", Validators.required],
    });
  }

  // Add new empty row to form
  addSlotRow(): void {
    this.slotsArray.push(this.createSlotGroup());
  }

  // Remove row from form
  removeSlotRow(index: number): void {
    this.slotsArray.removeAt(index);
  }

  // Quick generator for period slots based on duration
  applyQuickSlots(): void {
    const startTime =
      this.timetableForm.get("periodStartTime")?.value || "08:00 AM";
    const duration =
      Number(this.timetableForm.get("durationMinutes")?.value) || 30;
    const interval =
      Number(this.timetableForm.get("intervalMinutes")?.value) || 0;
    const room = this.timetableForm.get("defaultRoomNo")?.value || "";

    if (this.slotsArray.length === 0) {
      this.addSlotRow();
    }

    let currentMinutes = this.parseTimeToMinutes(startTime);

    this.slotsArray.controls.forEach((control, index) => {
      const fromStr = this.formatMinutesToTime(currentMinutes);
      const toMinutes = currentMinutes + duration;
      const toStr = this.formatMinutesToTime(toMinutes);

      control.patchValue({
        timeFrom: fromStr,
        timeTo: toStr,
        roomNo: room,
      });

      currentMinutes = toMinutes + interval;
    });
  }

  switchDayTab(day: string): void {
    this.selectedDayTab = day;
    this.populateFormForSelectedDay();
  }

  private populateFormForSelectedDay(): void {
    this.slotsArray.clear();
    const dayData = this.weeklySchedule.find(
      (d) => d.day === this.selectedDayTab,
    );

    if (dayData && dayData.slots.length > 0) {
      dayData.slots.forEach((slot) => {
        this.slotsArray.push(this.createSlotGroup(slot));
      });
    } else {
      this.addSlotRow(); // Default single empty row
    }
  }

  onSearch(): void {
    if (this.filterForm.invalid) return;
    this.loadMockTimetableData();
  }

  openAddMode(): void {
    this.viewMode = "add";
    this.populateFormForSelectedDay();
  }

  openViewMode(): void {
    this.viewMode = "view";
  }

  saveTimetable(): void {
    if (this.timetableForm.invalid) {
      this.timetableForm.markAllAsTouched();
      return;
    }

    const updatedSlots: TimetableSlot[] = this.timetableForm.value.slots;
    const dayIndex = this.weeklySchedule.findIndex(
      (d) => d.day === this.selectedDayTab,
    );

    if (dayIndex !== -1) {
      this.weeklySchedule[dayIndex].slots = updatedSlots;
    } else {
      this.weeklySchedule.push({
        day: this.selectedDayTab,
        slots: updatedSlots,
      });
    }

    alert(`Lesrooster voor ${this.selectedDayTab} succesvol opgeslagen!`);
    this.openViewMode();
  }

  // Load sample data into schedule
  private loadMockTimetableData(): void {
    this.weeklySchedule = [
      {
        day: "Monday",
        slots: [
          {
            subject: "English (210)",
            timeFrom: "8:00 AM",
            timeTo: "08:45 AM",
            teacher: "Shivam Verma (9002)",
            roomNo: "100",
          },
          {
            subject: "Hindi (230)",
            timeFrom: "8:45 AM",
            timeTo: "9:30 AM",
            teacher: "Jason Sharlton (9006)",
            roomNo: "100",
          },
          {
            subject: "Mathematics (110)",
            timeFrom: "9:30 AM",
            timeTo: "10:15 AM",
            teacher: "Nishant Khare (1002)",
            roomNo: "100",
          },
        ],
      },
      {
        day: "Tuesday",
        slots: [
          {
            subject: "English (210)",
            timeFrom: "8:00 AM",
            timeTo: "08:30 AM",
            teacher: "Shivam Verma (9002)",
            roomNo: "12",
          },
          {
            subject: "Hindi (230)",
            timeFrom: "08:35 AM",
            timeTo: "09:05 AM",
            teacher: "Jason Sharlton (9006)",
            roomNo: "12",
          },
          {
            subject: "Mathematics (110)",
            timeFrom: "09:10 AM",
            timeTo: "09:40 AM",
            teacher: "Nishant Khare (1002)",
            roomNo: "12",
          },
        ],
      },
      {
        day: "Wednesday",
        slots: [
          {
            subject: "English (210)",
            timeFrom: "8:00 AM",
            timeTo: "08:30 AM",
            teacher: "Shivam Verma (9002)",
            roomNo: "12",
          },
          {
            subject: "Hindi (230)",
            timeFrom: "08:35 AM",
            timeTo: "09:05 AM",
            teacher: "Jason Sharlton (9006)",
            roomNo: "12",
          },
        ],
      },
      {
        day: "Thursday",
        slots: [
          {
            subject: "English (210)",
            timeFrom: "8:00 AM",
            timeTo: "08:30 AM",
            teacher: "Shivam Verma (9002)",
            roomNo: "12",
          },
        ],
      },
      {
        day: "Friday",
        slots: [
          {
            subject: "Hindi (230)",
            timeFrom: "8:00 AM",
            timeTo: "08:30 AM",
            teacher: "Jason Sharlton (9006)",
            roomNo: "12",
          },
          {
            subject: "Mathematics (110)",
            timeFrom: "08:35 AM",
            timeTo: "09:05 AM",
            teacher: "Nishant Khare (1002)",
            roomNo: "12",
          },
        ],
      },
      {
        day: "Saturday",
        slots: [
          {
            subject: "Science (111)",
            timeFrom: "8:00 AM",
            timeTo: "08:30 AM",
            teacher: "Shivam Verma (9002)",
            roomNo: "12",
          },
          {
            subject: "English (210)",
            timeFrom: "08:35 AM",
            timeTo: "09:05 AM",
            teacher: "Aman Verma (654)",
            roomNo: "12",
          },
        ],
      },
      {
        day: "Sunday",
        slots: [],
      },
    ];
  }

  // Time conversion helpers
  private parseTimeToMinutes(timeStr: string): number {
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  private formatMinutesToTime(totalMinutes: number): string {
    let hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const modifier = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
    return `${hoursStr}:${minutesStr} ${modifier}`;
  }
}
