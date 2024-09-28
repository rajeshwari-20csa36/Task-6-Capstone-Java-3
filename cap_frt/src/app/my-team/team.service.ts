import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../team-dashboard/employee.model';


@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamMembersSubject: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  
  constructor() { }

  getTeamMembers(): Observable<Employee[]> {
    return this.teamMembersSubject.asObservable();
  }

  addTeamMember(employee: Employee): void {
    const currentTeam = this.teamMembersSubject.value;
    this.teamMembersSubject.next([...currentTeam, employee]);
  }

  removeTeamMember(employeeId: number): void {
    const currentTeam = this.teamMembersSubject.value;
    this.teamMembersSubject.next(currentTeam.filter(emp => emp.id !== employeeId));
  }
}