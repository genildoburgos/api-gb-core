import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthPayload } from './auth-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const rawAuthHeader =
      request.headers['authorization'] ?? request.headers['Authorization'];

    const authHeader: string | undefined =
      typeof rawAuthHeader === 'string'
        ? rawAuthHeader
        : Array.isArray(rawAuthHeader)
          ? rawAuthHeader[0]
          : undefined;

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid token format');
    }

    const token = parts[1];

    try {
      const payload = await this.jwtService.verifyAsync<AuthPayload>(token, {
        algorithms: ['HS256'],
      });
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
