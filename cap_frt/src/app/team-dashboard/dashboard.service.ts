import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8082/api/employees';

  constructor(private http: HttpClient) { }

  getEmployees(
    page: number, 
    size: number, 
    searchTerm?: string, 
    skills?: string[], 
    location?: string, 
    numberOfEmployees?: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (skills && skills.length > 0) params = params.set('skills', skills.join(','));
    if (location) params = params.set('location', location);
    if (numberOfEmployees) params = params.set('numberOfEmployees', numberOfEmployees.toString());

    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  addToTeam(employeeId: number): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/${employeeId}/toggle-team`, {});
  }

  getUniqueSkills(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/skills`);
  }

  getUniqueLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/locations`);
  }
}