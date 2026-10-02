import { Routes } from "@angular/router";
import { EcommerceComponent } from "./pages/dashboard/ecommerce/ecommerce.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { FormElementsComponent } from "./pages/forms/form-elements/form-elements.component";
import { BasicTablesComponent } from "./pages/tables/basic-tables/basic-tables.component";
import { BlankComponent } from "./pages/blank/blank.component";
import { NotFoundComponent } from "./pages/other-page/not-found/not-found.component";
import { AppLayoutComponent } from "./shared/layout/app-layout/app-layout.component";
import { InvoicesComponent } from "./pages/invoices/invoices.component";
import { LineChartComponent } from "./pages/charts/line-chart/line-chart.component";
import { BarChartComponent } from "./pages/charts/bar-chart/bar-chart.component";
import { AlertsComponent } from "./pages/ui-elements/alerts/alerts.component";
import { AvatarElementComponent } from "./pages/ui-elements/avatar-element/avatar-element.component";
import { BadgesComponent } from "./pages/ui-elements/badges/badges.component";
import { ButtonsComponent } from "./pages/ui-elements/buttons/buttons.component";
import { ImagesComponent } from "./pages/ui-elements/images/images.component";
import { VideosComponent } from "./pages/ui-elements/videos/videos.component";
import { SignInComponent } from "./pages/auth-pages/sign-in/sign-in.component";
import { SignUpComponent } from "./pages/auth-pages/sign-up/sign-up.component";
import { CalenderComponent } from "./pages/calender/calender.component";
import { StudentDetailsComponent } from "./pages/student-information/student-details/student-details.component";
import { StudentAdmissionComponent } from "./pages/student-information/student-admission/student-admission.component";
import { StudentUpdateComponent } from "./pages/student-information/student-update/student-update.component";
import { CollectFeesComponent } from "./pages/fees-collection/collect-fees/collect-fees.component";
import { FeesMasterComponent } from "./pages/fees-collection/fees-master/fees-master.component";
import { BookListComponent } from "./pages/library/book-list/book-list.component";
import { IssueReturnComponent } from "./pages/library/issue-return/issue-return.component";
import { AddStudentComponent } from "./pages/library/add-student/add-student.component";
import { AddStaffMemberComponent } from "./pages/library/add-staff-member/add-staff-member.component";
import { AddHomeworkComponent } from "./pages/homework/add-homework/add-homework.component";
import { StaffDirectoryComponent } from "./pages/human-resource/staff-directory/staff-directory.component";
import { StaffAttandanceComponent } from "./pages/human-resource/staff-attandance/staff-attandance.component";
import { PayrollComponent } from "./pages/human-resource/payroll/payroll.component";
import { ApproveLeaveRequestComponent } from "./pages/human-resource/approve-leave-request/approve-leave-request.component";
import { ApplyLeaveComponent } from "./pages/human-resource/apply-leave/apply-leave.component";
import { DisabledStaffComponent } from "./pages/human-resource/disabled-staff/disabled-staff.component";
import { StudentAttendanceComponent } from "./pages/attendance/student-attendance/student-attendance.component";
import { ApproveLeaveComponent } from "./pages/attendance/approve-leave/approve-leave.component";
import { AttendanceByDateComponent } from "./pages/attendance/attendance-by-date/attendance-by-date.component";
import { ClassTimetableComponent } from "./pages/academics/class-timetable/class-timetable.component";
import { TeachersTimetableComponent } from "./pages/academics/teachers-timetable/teachers-timetable.component";
import { AuthGuard } from "./shared/guard/auth.guard";
import { AddBookComponent } from "./pages/library/add-book/add-book.component";
import { HrMasterComponent } from "./pages/human-resource/hr-master/hr-master.component";
import { AcademicMasterComponent } from "./pages/academics/academic-master/academic-master.component";

export const routes: Routes = [
  { path: "login", component: SignInComponent, title: "Sign In" },
  { path: "signup", component: SignUpComponent, title: "Sign Up" },

  {
    path: "",
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        path: "",
        component: EcommerceComponent,
        title:
          "Angular Ecommerce Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "calendar",
        component: CalenderComponent,
        title:
          "Angular Calender | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "profile",
        component: ProfileComponent,
        title:
          "Angular Profile Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "form-elements",
        component: FormElementsComponent,
        title:
          "Angular Form Elements Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "basic-tables",
        component: BasicTablesComponent,
        title:
          "Angular Basic Tables Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "blank",
        component: BlankComponent,
        title:
          "Angular Blank Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "invoice",
        component: InvoicesComponent,
        title:
          "Angular Invoice Details Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "line-chart",
        component: LineChartComponent,
        title:
          "Angular Line Chart Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "bar-chart",
        component: BarChartComponent,
        title:
          "Angular Bar Chart Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "alerts",
        component: AlertsComponent,
        title:
          "Angular Alerts Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "avatars",
        component: AvatarElementComponent,
        title:
          "Angular Avatars Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "badge",
        component: BadgesComponent,
        title:
          "Angular Badges Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "buttons",
        component: ButtonsComponent,
        title:
          "Angular Buttons Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "images",
        component: ImagesComponent,
        title:
          "Angular Images Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "videos",
        component: VideosComponent,
        title:
          "Angular Videos Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      //student
      {
        path: "student",
        component: StudentDetailsComponent,
        title: "Student Deatils",
      },
      {
        path: "studentAdmission",
        component: StudentAdmissionComponent,
        title: "Student Admission",
      },
      {
        path: "studentUpdate",
        component: StudentUpdateComponent,
        title: "Student Update",
      },
      //fess
      {
        path: "collectFees",
        component: CollectFeesComponent,
        title: "collectFees",
      },

      {
        path: "feesMaster",
        component: FeesMasterComponent,
        title: "feesMaster",
      },

      //library
      { path: "bookList", component: BookListComponent, title: "bookList" },
      {
        path: "issueReturn",
        component: IssueReturnComponent,
        title: "issueReturn",
      },
      {
        path: "addStudent",
        component: AddStudentComponent,
        title: "addStaffMember",
      },
      {
        path: "addStaffMember",
        component: AddStaffMemberComponent,
        title: "addStaffMember",
      },
      //Homework
      {
        path: "addHomework",
        component: AddHomeworkComponent,
        title: "Add Homework",
      },
      //Human Resource
      {
        path: "staffDirectory",
        component: StaffDirectoryComponent,
        title: "staffDirectory",
      },
      {
        path: "staffAttandance",
        component: StaffAttandanceComponent,
        title: "staffAttandance",
      },
      { path: "payroll", component: PayrollComponent, title: "payroll" },
      {
        path: "approveLeaveRequest",
        component: ApproveLeaveRequestComponent,
        title: "approveLeaveRequest",
      },
      {
        path: "applyLeave",
        component: ApplyLeaveComponent,
        title: "applyLeave",
      },
      { path: "hrMaster", component: HrMasterComponent, title: "Hr Master" },

      {
        path: "disabledStaff",
        component: DisabledStaffComponent,
        title: "disabledStaff",
      },
      //Attendance
      {
        path: "studentAttendance",
        component: StudentAttendanceComponent,
        title: "studentAttendance",
      },
      {
        path: "approveLeave",
        component: ApproveLeaveComponent,
        title: "approveLeave",
      },
      {
        path: "attendanceByDate",
        component: AttendanceByDateComponent,
        title: "attendanceByDate",
      },
      //Academics
      {
        path: "academicMaster",
        component: AcademicMasterComponent,
        title: "subjects",
      },

      {
        path: "classTimetable",
        component: ClassTimetableComponent,
        title: "classTimetable",
      },
      {
        path: "teachersTimetable",
        component: TeachersTimetableComponent,
        title: "teachersTimetable",
      },
    ],
  },

  // error pages
  {
    path: "**",
    component: NotFoundComponent,
    title:
      "Angular NotFound Dashboard | TailAdmin - Angular Admin Dashboard Template",
  },
];
