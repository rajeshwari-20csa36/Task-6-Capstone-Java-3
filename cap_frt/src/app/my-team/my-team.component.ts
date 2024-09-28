import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavSidebarComponent } from '../nav-sidebar/nav-sidebar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { TeamService } from './team.service';
import { Employee } from '../team-dashboard/employee.model';


@Component({
  selector: 'app-my-team',
  standalone: true,
  imports: [CommonModule, NavSidebarComponent, TopBarComponent],
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.css']
})
export class MyTeamComponent implements OnInit {
  teamMembers: Employee[] = [];

  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private teamService: TeamService) {}

  ngOnInit() {
    this.teamService.getTeamMembers().subscribe(members => {
      this.teamMembers = members;
      this.calculateTotalPages();
    });
  }

  calculateTotalPages() {
    const itemsPerPage = 10;  // Define how many items you want per page
    this.totalPages = Math.ceil(this.teamMembers.length / itemsPerPage);
  }

  // Implement methods for pagination
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}