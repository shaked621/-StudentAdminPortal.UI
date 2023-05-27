import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiConnectionService } from 'src/app/services/apiconnection.service';
import { StudentService } from '../student.service';
import { IStudent } from 'src/app/models/api-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { IGender } from 'src/app/models/api-models/gender.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IAddStudnetRequest } from 'src/app/models/api-models/addStudentRequest.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-view-students',
  templateUrl: './view-students.component.html',
  styleUrls: ['./view-students.component.css'],
})
export class ViewStudentsComponent implements OnInit, OnDestroy {
  routeParam$: Subscription = new Subscription();
  getStudent$: Subscription = new Subscription();
  deleteStudent$: Subscription = new Subscription();
  addStudent$: Subscription = new Subscription();
  studentId: string | null | undefined;
  student: IStudent = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    profileImageUrl: '',
    genderId: '',
    gender: {
      id: '',
      description: '',
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: '',
    },
  };
  genderList: IGender[] = [];
  isNewStudent = false;
  header = '';

  @ViewChild('studentDetailsForm') studentDetailsForm: NgForm | undefined;

  constructor(
    private readonly apiConnectionService: ApiConnectionService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private readonly studentService: StudentService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.apiConnectionService.getGenders();
    this.genderList = this.genderService.getGenders();
    this.routeParam$ = this.route.paramMap.subscribe((params) => {
      this.studentId = params.get('id');
      if (this.studentId && this.studentId.toLowerCase() !== 'add') {
        this.getStudent$ = this.apiConnectionService
          .getStudent(this.studentId)
          .subscribe((res) => {
            this.student = res;
          });
        this.isNewStudent = false;
        this.header = 'Edit Student';
      } else {
        this.isNewStudent = true;
        this.header = 'Add New Student';
      }
    });
  }

  ngOnDestroy(): void {
    this.routeParam$.unsubscribe();
    this.getStudent$.unsubscribe();
  }

  onUpdate() {
    if (this.studentDetailsForm?.form?.valid) {
      this.getStudent$ = this.apiConnectionService
        .updateStudent(this.student.id, this.student)
        .subscribe((updateStudent) => {
          if (updateStudent) {
            this.studentService.updateStudent(updateStudent.id, updateStudent);
            this.snackbar.open('Student updated successfully', undefined, {
              duration: 2000,
            });
          } else {
            console.error(updateStudent);
          }
        });
    }
  }

  onDelete() {
    this.deleteStudent$ = this.apiConnectionService
      .deleteStudent(this.student.id)
      .subscribe((student) => {
        if (student) {
          this.studentService.deleteStudent(student.id);
          this.snackbar.open('Student deleted successfully', undefined, {
            duration: 2000,
          });
          setTimeout(() => {
            this.router.navigateByUrl('students');
          }, 2000);
        } else {
          console.error(student);
        }
      });
  }

  onAdd() {
    if (this.studentDetailsForm?.form?.valid) {
      this.addStudent$ = this.apiConnectionService
        .addStudent(this.createIAddStudnetRequest())
        .subscribe((addStudent) => {
          if (addStudent) {
            this.studentService.addStudent(addStudent);
            this.snackbar.open('Student Added successfully', undefined, {
              duration: 2000,
            });
          } else {
            console.error(addStudent);
          }
        });
    }
  }

  createIAddStudnetRequest(): IAddStudnetRequest {
    const student: IAddStudnetRequest = {
      firstName: this.student.firstName,
      lastName: this.student.lastName,
      dateOfBirth: this.student.dateOfBirth,
      email: this.student.email,
      mobile: this.student.mobile,
      genderId: this.student.genderId,
      genderDescription: this.student.gender.description,
      physicalAddress: this.student.address.physicalAddress.replace(/\n/g, ''),
      postalAddress: this.student.address.postalAddress.replace(/\n/g, ''),
    };
    const description = this.genderList.find(
      (gender) => gender.id === this.student.genderId
    )?.description;
    student.genderDescription = description ? description : 'Male';
    return student;
  }
}
