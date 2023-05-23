import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StudentService } from './student.service';
import { Subscription } from 'rxjs';
import { IStudent } from '../models/api-models/student.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit, OnDestroy {
  students: IStudent[] = [];
  students$: Subscription | undefined;
  dataSource: MatTableDataSource<IStudent> = new MatTableDataSource<IStudent>();
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'dateOfBirth',
    'email',
    'mobile',
    'gender',
  ];
  filterString: string = '';
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.students$ = this.studentService.studentsChanged.subscribe(
      (students: IStudent[]) => {
        this.students = students;
        this.dataSource = new MatTableDataSource<IStudent>(students);
        if (this.matPaginator) {
          this.dataSource.paginator = this.matPaginator;
        }
        if (this.matSort) {
          this.dataSource.sort = this.matSort;
        }
      }
    );
    this.students = this.studentService.getStudents();
    this.dataSource = new MatTableDataSource<IStudent>(this.students);
  }

  ngOnDestroy(): void {
    this.students$?.unsubscribe();
  }

  filterStudents() {
    this.dataSource.filter = this.filterString.trim().toLowerCase();
  }
}
