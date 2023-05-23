import { IAddress } from './address.model';
import { IGender } from './gender.model';

export interface IStudent {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  mobile: number;
  profileImageUrl: string;
  genderId: string;
  gender: IGender;
  address: IAddress;
}
