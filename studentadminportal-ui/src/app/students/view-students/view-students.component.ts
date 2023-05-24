import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiConnectionService } from 'src/app/services/apiconnection.service';
import { StudentService } from '../student.service';
import { IStudent } from 'src/app/models/api-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { IGender } from 'src/app/models/api-models/gender.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-students',
  templateUrl: './view-students.component.html',
  styleUrls: ['./view-students.component.css'],
})
export class ViewStudentsComponent implements OnInit {
  routeParam: Subscription = new Subscription();
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

  constructor(
    private readonly apiConnectionService: ApiConnectionService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private readonly studentService: StudentService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.routeParam = this.route.paramMap.subscribe((params) => {
      this.studentId = params.get('id');
      if (this.studentId) {
        this.apiConnectionService
          .getStudent(this.studentId)
          .subscribe((res) => {
            this.student = res;
          });
        this.genderList = this.genderService.getGenders();
      }
    });
  }

  onUpdate() {
    this.apiConnectionService
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

  onDelete() {}
  onAdd() {}
}
