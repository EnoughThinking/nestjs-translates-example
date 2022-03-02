import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationError } from 'class-validator-multi-lang';
import {
  getDefaultTranslatesModuleOptions,
  TranslatesModule,
} from 'nestjs-translates';
import { join } from 'path/posix';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('Get english word with TranslatesService', () => {
      expect(appController.englishWord()).toEqual('word');
    });

    it('Get russian word with TranslatesService', () => {
      expect(appController.russianWord()).toEqual('слово');
    });
  });
});
