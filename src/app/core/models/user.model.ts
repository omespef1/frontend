export type UserRole = 'Empleado' | 'Supervisor' | 'SecAdmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}
