/* eslint-disable */
import { Controller, Post, Body, Get, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created', type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    const allowPublic = process.env.ALLOW_PUBLIC_REGISTRATION === 'true';
    const adminSecret = process.env.ADMIN_REGISTRATION_SECRET;

    const providedAdminToken = createUserDto.adminToken;

    if (!allowPublic) {
      const adminSecretConfigured = !!adminSecret;
      const hasValidAdminToken = !!providedAdminToken && providedAdminToken === adminSecret;

      if (!adminSecretConfigured || !hasValidAdminToken) {
        // Return exact JSON required and 403 status
        throw new HttpException(
          { error: 'O cadastro público está desativado no momento.' },
          HttpStatus.FORBIDDEN,
        );
      }
    }

    delete createUserDto.adminToken;

    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List all users (requires auth)' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async findAll() {
    return this.usersService.findAll();
  }
}
