import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStudent } from '../models/api-models/student.model';
import { Observable, map } from 'rxjs';
import { StudentService } from '../students/student.service';
import { IGender } from '../models/api-models/gender.model';
import { GenderService } from './gender.service';
import { IUpdateStudentRequest } from '../models/api-models/updateStudentRequest';
import { IAddStudnetRequest } from '../models/api-models/addStudentRequest.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiConnectionService {
  private url = environment.baseApiUrl;
  constructor(
    private httpClient: HttpClient,
    private studentService: StudentService,
    private genderService: GenderService
  ) {}

  getStudents(): void {
    this.httpClient
      .get<IStudent[]>(this.url + '/students')
      .subscribe((_students) => {
        this.studentService.setStudents(_students);
      });
  }

  getStudent(studentId: string): Observable<IStudent> {
    this.getGenders();
    return this.httpClient.get<IStudent>(this.url + '/students/' + studentId);
  }

  updateStudent(studentId: string, newStudent: IStudent) {
    const request: IUpdateStudentRequest = {
      firstName: newStudent.firstName,
      lastName: newStudent.lastName,
      dateOfBirth: newStudent.dateOfBirth,
      email: newStudent.email,
      mobile: newStudent.mobile,
      genderId: newStudent.genderId,
      PhysicalAddress: newStudent.address.physicalAddress,
      PostalAddress: newStudent.address.postalAddress,
    };
    return this.httpClient.put<IStudent>(
      this.url + '/students/' + studentId,
      request
    );
  }

  deleteStudent(studentId: string): Observable<IStudent> {
    return this.httpClient.delete<IStudent>(
      this.url + '/students/' + studentId
    );
  }

  addStudent(newStudent: IAddStudnetRequest): Observable<IStudent> {
    const request: IAddStudnetRequest = {
      firstName: newStudent.firstName,
      lastName: newStudent.lastName,
      dateOfBirth: newStudent.dateOfBirth,
      email: newStudent.email,
      mobile: newStudent.mobile,
      genderId: newStudent.genderId,
      genderDescription: newStudent.genderDescription,
      physicalAddress: newStudent.physicalAddress,
      postalAddress: newStudent.postalAddress,
    };
    return this.httpClient.post<IStudent>(this.url + '/students/add', request);
  }

  getGenders(): void {
    {
      this.httpClient
        .get<IGender[]>(this.url + '/gender')
        .subscribe((_genders) => {
          this.genderService.setGenders(_genders);
        });
    }
  }
}
