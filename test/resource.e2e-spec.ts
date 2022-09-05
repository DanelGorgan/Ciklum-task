import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ResourceController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 404 when user is not found', () => {
    const invalidUsername = 'octocatasd';
    return request(app.getHttpServer())
      .get(`/resources?username=${invalidUsername}`)
      .expect(404)
      .expect({
        status: 404,
        message: 'Not Found'
      })
  });

  it('should return 200', () => {
    const validName = 'test';
    const expectedResult = [
      {
        "name": "HelloWorld",
        "owner": "test",
        "branches": [
          {
            "name": "asd",
            "commit": "ec4ab42080e536cdfd628fc858b6d53992a90ef0"
          },
          {
            "name": "master",
            "commit": "c8e8f1b026c4840fed7376d33786f2c721375ae6"
          }
        ]
      },
      {
        "name": "rokehan",
        "owner": "test",
        "branches": [
          {
            "name": "master",
            "commit": "54a889cb5438d13c92850edb8e25a793ccec42aa"
          }
        ]
      },
      {
        "name": "sNews",
        "owner": "test",
        "branches": []
      },
      {
        "name": "Test--01",
        "owner": "test",
        "branches": [
          {
            "name": "master",
            "commit": "60c3b002b742176770fa742ceab323e731966b9a"
          }
        ]
      }
    ]
    return request(app.getHttpServer())
      .get(`/resources?username=${validName}`)
      .expect(200)
      .expect(expectedResult)
  });
});
