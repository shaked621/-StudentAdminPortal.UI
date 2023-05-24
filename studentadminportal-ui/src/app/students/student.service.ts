import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IStudent } from '../models/api-models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private url = 'https://localhost:7157/students';
  private students: IStudent[] = [];
  studentsChanged: Subject<IStudent[]> = new Subject<IStudent[]>();

  constructor() {}

  setStudents(students: IStudent[]): void {
    // this.students = students;
    this.students = students;
    this.studentsChanged.next(this.students.slice());
  }

  getStudents(): IStudent[] {
    return this.students.slice();
  }

  getStudent(id: string): IStudent | undefined {
    return this.students.find((student) => student.id === id);
  }

  addStudent(student: IStudent) {
    this.students.push(student);
    this.studentsChanged.next(this.students.slice());
  }

  updateStudent(id: string, newStudent: IStudent) {
    const index = this.students.findIndex((studentId) => studentId.id === id);
    this.students[index] = newStudent;
    this.studentsChanged.next(this.students.slice());
  }

  deleteStudent(index: number) {
    this.students.splice(index, 1);
    this.studentsChanged.next(this.students.slice());
  }
}
