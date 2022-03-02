import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { ValidationError } from 'class-validator-multi-lang';
import {
  getDefaultTranslatesModuleOptions,
  TranslatesModule,
} from 'nestjs-translates';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TranslatesModule.forRoot(
      getDefaultTranslatesModuleOptions({
        localePaths: [
          join(process.cwd(), 'i18n'),
          join(
            process.cwd(),
            'node_modules',
            'class-validator-multi-lang',
            'i18n',
          ),
        ],
        locales: ['en', 'ru'],
        validationPipeOptions: {
          transform: true,
          validationError: {
            target: false,
            value: false,
          },
          transformOptions: {
            strategy: 'excludeAll',
          },
          exceptionFactory: (errors: ValidationError[]) =>
            new HttpException(errors, HttpStatus.BAD_REQUEST),
        },
      }),
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
