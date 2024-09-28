import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavSidebarComponent } from '../nav-sidebar/nav-sidebar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { EmployeeTimeZone } from './team-timezone.interface';
import { TimesheetService } from './timesheet.service';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [CommonModule, FormsModule, NavSidebarComponent, TopBarComponent],
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {
  employeeTimeZone: EmployeeTimeZone = {
    employeeId: 0, // Leave employeeId empty for user input
    timeZone: '',
    workingHoursStart: '',
    workingHoursEnd: '',
    isSubmitted: false
  };
  
  message: string = '';
  isSaved: boolean = false;
  isSubmitted: boolean = false;

  timeZones: string[] = [
    'UTC - Coordinated Universal Time',
    'GMT - Greenwich Mean Time',
    'EST - Eastern Standard Time (US & Canada)',
    'CST - Central Standard Time (US & Canada)',
    'MST - Mountain Standard Time (US & Canada)',
    'PST - Pacific Standard Time (US & Canada)',
    'IST - Indian Standard Time',
    'CET - Central European Time',
    'EET - Eastern European Time',
    'JST - Japan Standard Time',
    'AEST - Australian Eastern Standard Time',
    'NZST - New Zealand Standard Time',
  ];

  constructor(private timesheetService: TimesheetService) { }

  ngOnInit(): void {
    this.loadEmployeeTimeZone(); // Load the employee's time zone info
  }

  canSubmitTimesheet(): boolean {
    return this.isSaved && !this.isSubmitted; // Logic to check if timesheet can be submitted
  }

  onSave() {
    console.log('Attempting to save:', this.employeeTimeZone);
    this.timesheetService.saveEmployeeTimeZone(this.employeeTimeZone).subscribe(
      response => {
        this.message = 'Timesheet saved successfully! You can still update it.';
        this.isSaved = true; // Set isSaved to true after successful save
        console.log('Saved response:', response);
      },
      error => {
        this.message = 'Error saving timesheet. Please try again.';
        console.error('Save Error:', error);
      }
    );
  }

  onSubmit() {
    console.log('Attempting to submit:', this.employeeTimeZone);
    this.timesheetService.submitEmployeeTimeZone(this.employeeTimeZone).subscribe(
      response => {
        this.message = 'Timesheet submitted successfully! It can no longer be modified.';
        this.isSubmitted = true; // Set isSubmitted to true after successful submit
        console.log('Submitted response:', response);
      },
      error => {
        this.message = 'Error submitting timesheet. Please try again.';
        console.error('Submit Error:', error);
      }
    );
  }

  onUpdate() {
    if (this.isSubmitted) {
      this.message = 'This timesheet has been submitted and cannot be modified.';
      return; // Prevent update if submitted
    }

    console.log('Attempting to update:', this.employeeTimeZone);
    this.timesheetService.updateEmployeeTimeZone(this.employeeTimeZone.employeeId, this.employeeTimeZone).subscribe(
      response => {
        this.message = 'Timesheet updated successfully!';
        console.log('Updated response:', response);
      },
      error => {
        this.message = 'Error updating timesheet. Please try again.';
        console.error('Update Error:', error);
      }
    );
  }

  loadEmployeeTimeZone() {
    if (this.employeeTimeZone.employeeId) {
      this.timesheetService.getEmployeeTimeZone(this.employeeTimeZone.employeeId).subscribe(
        data => {
          this.employeeTimeZone = data; // Load time zone data for employee
          this.isSaved = true; // Mark as saved after loading
          this.isSubmitted = data.isSubmitted; // Set submission status from response
          this.message = 'Employee timesheet loaded.';
        },
        error => {
          if (error.status === 404) {
            this.message = 'No timesheet found. Please create a new one.';
          } else {
            this.message = 'Error loading employee timesheet.';
            console.error('Load Error:', error);
          }
        }
      );
    } else {
      console.log('No employee ID provided. Ready for user input.');
    }
  }
}
