import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiConnectionService } from 'src/app/shared/apiconnection.service';
import { StudentService } from '../student.service';
import { IStudent } from 'src/app/models/api-models/student.model';

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

  constructor(
    private readonly studentService: StudentService,
    private readonly apiConnectionService: ApiConnectionService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeParam = this.route.paramMap.subscribe((params) => {
      this.studentId = params.get('id');
      if (this.studentId) {
        const res = this.studentService.getStudent(this.studentId);
        if (!res) {
          this.apiConnectionService
            .getStudent(this.studentId)
            .subscribe((res) => {
              this.student = res;
              console.log(res);
            });
        } else {
          this.student = res;
        }
      }
    });
  }
}
