import { Component } from '@angular/core';
import { ApiConnectionService } from 'src/app/services/apiconnection.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css'],
})
export class TopNavComponent {
  constructor(private apiConnectionService: ApiConnectionService) {}

  onStudents() {
    this.apiConnectionService.getStudents();
  }
}
