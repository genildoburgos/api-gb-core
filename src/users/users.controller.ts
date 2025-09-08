/* eslint-disable */

import { Controller, Post, Body, Get, UseGuards, Patch, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Patch('avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5 MB
          new FileTypeValidator({
            fileType: '.(png|jpeg|jpg|webp)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ){
    // O AuthGuard garante que `req.user` estará definido neste ponto.
    // A asserção de não-nulidade `!` informa ao TypeScript que
    // estamos cientes disso e que o valor não será nulo ou indefinido.
    const userId = req.user!.id;

    const avatarUrl = await this.usersService.uploadAvatar(userId, file);
    
    return {
      message: 'Avatar uploaded successfully!',
      avatarUrl: avatarUrl,
    };
  }




}
