import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { NavSidebarComponent } from '../nav-sidebar/nav-sidebar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { TeamService } from '../my-team/team.service';
import { Employee } from '../team-dashboard/employee.model';

Chart.register(...registerables);

@Component({
  selector: 'app-team-timezone-chart',
  standalone: true,
  imports: [CommonModule, NavSidebarComponent, TopBarComponent],
  template: `
    <div class="team-timezone-container">
      <app-nav-sidebar [activePage]="'Team Timezone'"></app-nav-sidebar>
      <main class="main-content">
        <app-top-bar [currentPage]="'Team Timezone'"></app-top-bar>
        <div class="chart-content">
          <div class="best-meeting-time">
            <h3>Best Meeting Time</h3>
            <p>{{ bestMeetingTime }}</p>
          </div>
          <div class="chart-container">
            <canvas id="timezoneChart"></canvas>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .team-timezone-container {
      display: flex;
      height: 100vh;
    }
    .main-content {
      flex-grow: 1;
      overflow-y: auto;
    }
    .chart-content {
      padding: 20px;
    }
    .best-meeting-time {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f0f0f0;
      border-radius: 5px;
    }
    .chart-container {
      height: 400px;
    }
  `]
})
export class TeamTimezoneChartComponent implements OnInit {
  teamMembers: Employee[] = [];
  bestMeetingTime: string = '';
  chart: Chart | undefined;

  constructor(private teamService: TeamService) {}

  ngOnInit() {
    this.teamService.getTeamMembers().subscribe(members => {
      this.teamMembers = members;
      if (this.teamMembers.length > 0) {
        this.calculateBestMeetingTime();
        this.createChart();
      } else {
        console.log('No team members found');
      }
    });
  }

  calculateBestMeetingTime() {
    // Simplified calculation - assumes all team members are in the same timezone (India)
    // In a real-world scenario, you'd use the actual timezones of team members
    this.bestMeetingTime = '10:00 AM IST'; // Example time
  }

  createChart() {
    const ctx = document.getElementById('timezoneChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas element not found');
      return;
    }

    const data = this.generateChartData();

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: this.teamMembers.map((member, index) => ({
          label: member.name,
          data: data[member.name],
          backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 24,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  generateChartData() {
    const data: { [key: string]: number[] } = {};
    this.teamMembers.forEach(member => {
      // Simplified data generation - assumes all members are in the same timezone
      data[member.name] = Array.from({ length: 24 }, (_, hour) => hour);
    });
    return data;
  }
}