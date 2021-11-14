import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/csv')
  @UseInterceptors(
    FileInterceptor('csv-file', {
      storage: memoryStorage(),
    }),
  )
  readFile(@UploadedFile() file: Express.Multer.File) {
    return this.appService.readFile(file);
  }
}
