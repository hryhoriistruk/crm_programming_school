import { EUserRole } from '../../../database/entities/enums/user-role.enum';

export interface IJwtPayload {
  manager_id: number;
  role: EUserRole;
  deviceId: string;
}
export interface IActionJwtPayload {
  manager_id: number;
}
