import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('Get english word with TranslatesService', () => {
    return request(app.getHttpServer())
      .get('/english-word')
      .expect(200)
      .expect('word');
  });

  it('Get russian word with TranslatesService', () => {
    return request(app.getHttpServer())
      .get('/russian-word')
      .expect(200)
      .expect('слово');
  });

  it('Post empty data (default language: en)', () => {
    return request(app.getHttpServer())
      .post('/validate-dto')
      .expect(400)
      .expect([
        {
          property: 'email',
          children: [],
          constraints: {
            isNotEmpty: 'email should not be empty',
            isEmail: 'email must be an email',
          },
        },
        {
          property: 'password',
          children: [],
          constraints: { isNotEmpty: 'password should not be empty' },
        },
      ]);
  });

  it('Post invalid email data (default language: en)', () => {
    return request(app.getHttpServer())
      .post('/validate-dto')
      .send({
        email: 'string',
        password: 'string',
      })
      .expect(400)
      .expect([
        {
          property: 'email',
          children: [],
          constraints: {
            isEmail: 'email must be an email',
          },
        },
      ]);
  });

  it('Post empty data (language: ru)', () => {
    return request(app.getHttpServer())
      .post('/validate-dto')
      .set({ 'accept-language': 'ru' })
      .expect(400)
      .expect([
        {
          property: 'email',
          children: [],
          constraints: {
            isNotEmpty: 'email не может быть пустым',
            isEmail: 'email должен быть email',
          },
        },
        {
          property: 'password',
          children: [],
          constraints: { isNotEmpty: 'password не может быть пустым' },
        },
      ]);
  });

  it('Post invalid email data (language: ru)', () => {
    return request(app.getHttpServer())
      .post('/validate-dto')
      .set({ 'Accept-Language': 'ru,en;q=0.9' })
      .send({
        email: 'string',
        password: 'string',
      })
      .expect(400)
      .expect([
        {
          property: 'email',
          children: [],
          constraints: { isEmail: 'email должен быть email' },
        },
      ]);
  });
});
