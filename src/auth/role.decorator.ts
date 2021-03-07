import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entites/user.entity';

export type roles = keyof typeof UserRole | 'Any';

export const Role = (roles: roles[]) => SetMetadata('roles', roles);
