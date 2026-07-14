import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export function roleGuard(minRole: UserRole): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    
    const roleHierarchy: UserRole[] = ['Empleado', 'Supervisor', 'SecAdmin'];
    const userRole = auth.userRole() || 'Empleado';
    
    const userLevel = roleHierarchy.indexOf(userRole);
    const requiredLevel = roleHierarchy.indexOf(minRole);

    if (userLevel >= requiredLevel) {
      return true;
    }
    
    router.navigate(['/chat']);
    return false;
  };
}
