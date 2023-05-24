import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStudent } from '../models/api-models/student.model';
import { Observable, map } from 'rxjs';
import { StudentService } from '../students/student.service';

@Injectable({
  providedIn: 'root',
})
export class ApiConnectionService {
  private url = 'https://localhost:7157';
  constructor(
    private httpClient: HttpClient,
    private studentService: StudentService
  ) {}

  getStudents(): void {
    this.httpClient
      .get<IStudent[]>(this.url + '/students')
      .subscribe((_students) => {
        this.studentService.setStudents(_students);
      });
  }

  getStudent(studentId: string): Observable<IStudent> {
    return this.httpClient.get<IStudent>(this.url + '/students/' + studentId);
  }
}
