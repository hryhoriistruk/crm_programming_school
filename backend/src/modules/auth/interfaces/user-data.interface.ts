import { EUserRole } from '../../../database/entities/enums/user-role.enum';

export interface IUserData {
  userId: number;
  role: EUserRole;
  deviceId: string;
  email: string;
}
