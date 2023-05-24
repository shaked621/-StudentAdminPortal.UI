import { Injectable } from '@angular/core';
import { IGender } from '../models/api-models/gender.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenderService {
  private genders: IGender[] = [];
  gendersChanged: Subject<IGender[]> = new Subject<IGender[]>();

  constructor() {}

  setGenders(genders: IGender[]): void {
    this.genders = genders;
    this.gendersChanged.next(this.genders.slice());
  }

  getGenders(): IGender[] {
    return this.genders.slice();
  }
}
