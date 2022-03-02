import { Body, Controller, Get, Post } from '@nestjs/common';
import { TranslatesService } from 'nestjs-translates';
import { AppService } from './app.service';
import { SampleDto } from './sample.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly translatesService: TranslatesService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('english-word')
  englishWord() {
    return this.translatesService.translate('word', 'en');
  }

  @Get('russian-word')
  russianWord() {
    return this.translatesService.translate('word', 'ru');
  }

  @Post('validate-dto')
  validateDto(@Body() sampleDto: SampleDto) {
    return sampleDto;
  }
}
