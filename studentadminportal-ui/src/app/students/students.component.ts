import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { StudentService } from './student.service';
import { Subscription } from 'rxjs';
import { IStudent } from '../models/api-models/student.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiConnectionService } from '../services/apiconnection.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit, OnDestroy, OnChanges {
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
    'edit',
  ];
  filterString: string = '';
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  constructor(
    private readonly studentService: StudentService,
    private readonly apiConnectionService: ApiConnectionService
  ) {}

  ngOnInit(): void {
    this.apiConnectionService.getStudents();
    this.students$ = this.studentService.studentsChanged.subscribe(
      (students: IStudent[]) => {
        this.students = students;
        this.initializeTable();
      }
    );
    this.initializeTable();
    this.students = this.studentService.getStudents();
    this.dataSource = new MatTableDataSource<IStudent>(this.students);
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.initializeTable();
    this.students = this.studentService.getStudents();
    this.dataSource = new MatTableDataSource<IStudent>(this.students);
  }

  ngOnDestroy(): void {
    this.students$?.unsubscribe();
  }

  filterStudents() {
    this.dataSource.filter = this.filterString.trim().toLowerCase();
  }

  initializeTable() {
    this.dataSource = new MatTableDataSource<IStudent>(this.students);
    if (this.matPaginator) {
      this.dataSource.paginator = this.matPaginator;
    }
    if (this.matSort) {
      this.dataSource.sort = this.matSort;
    }
  }
}
