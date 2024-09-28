import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from './dashboard.service';
import { Employee } from './employee.model';
import { NavSidebarComponent } from '../nav-sidebar/nav-sidebar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { TeamService } from '../my-team/team.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavSidebarComponent, TopBarComponent],
  templateUrl: './team-dashboard.component.html',
  styleUrls: ['./team-dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployees: Set<number> = new Set();
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  searchTerm = '';
  numberOfEmployees: number | null = null;
  location = '';
  constructor(
    private dashboardService: DashboardService,
    private teamService: TeamService
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.dashboardService.getEmployees(
      this.currentPage,
      this.pageSize,
      this.searchTerm,
      [],
      this.location,
      this.numberOfEmployees || undefined
    ).subscribe(
      (data: any) => {
        this.employees = data.content;
        this.totalPages = data.totalPages;
      },
      error => console.error('Error loading employees', error)
    );
  }

  search() {
    this.currentPage = 0;
    this.loadEmployees();
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadEmployees();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadEmployees();
    }
  }

  toggleEmployeeSelection(employeeId: number) {
    if (this.selectedEmployees.has(employeeId)) {
      this.selectedEmployees.delete(employeeId);
    } else {
      this.selectedEmployees.add(employeeId);
    }
  }

  addToTeam() {
    this.selectedEmployees.forEach(employeeId => {
      const employee = this.employees.find(emp => emp.id === employeeId);
      if (employee) {
        this.teamService.addTeamMember(employee);
        this.dashboardService.addToTeam(employeeId).subscribe(
          () => {
            console.log(`Employee ${employeeId} added to team`);
            this.selectedEmployees.delete(employeeId);
            // Optionally, you can update the UI to reflect the change
          },
          error => console.error(`Error adding employee ${employeeId} to team`, error)
        );
      }
    });
  }
}