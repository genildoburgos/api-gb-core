/* eslint-disable */
import { Controller, Post, Get, Delete, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Req, Query, Param, ParseIntPipe, DefaultValuePipe, Res} from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('images')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload an image file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  async uploadImage(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp|gif)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const userId = req.user!.id;
    const result = await this.imagesService.uploadImage(userId, file);
    return {
      message: 'Image uploaded successfully!',
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get authenticated user images' })
  @ApiResponse({ status: 200, description: 'Paginated images list' })
  async getUserImages(
    @Req() req: Request,
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    const userId = req.user!.id;
    return this.imagesService.findUserImages(userId, search, page, limit);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an image by id' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  async deleteImage(
    @Req() req: Request,
    @Param('id') imageId: string,
  ) {
    const userId = req.user!.id;
    return this.imagesService.deleteUserImage(userId, imageId);
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Export user images as CSV' })
  @ApiResponse({ status: 200, description: 'CSV file stream' })
  async exportImagesAsCsv(
    @Req() req: Request,
    @Res() res: Response, 
  ) {
    const userId = req.user!.id;

  
    const csvData = await this.imagesService.exportUserImagesToCsv(userId);

    const fileName = `export-images-${uuidv4().substring(0, 8)}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    res.status(200).send(csvData);
  }
}