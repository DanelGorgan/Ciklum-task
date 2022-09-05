import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';

const gitProvider = {
  provide: 'RepoStrategy',
  useFactory: () => {
    return;
  },
};

describe('ResourcesController UNIT tests', () => {
  let controller: ResourcesController;
  let service: ResourcesService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ResourcesController],
      providers: [ResourcesService, gitProvider],
    })
      .compile();

    service = moduleRef.get(ResourcesService);
    controller = moduleRef.get(ResourcesController);
  });

  it('should return result with success ', async () => {
    const result = [{ name: 'test', owner: 'test', branches: [ {name: 'test', commit: '1235'}] }]
    jest.spyOn(service, 'findAllUserInfo').mockImplementation(() => Promise.resolve(result));
    expect(await controller.findAll({ username: 'test' })).toStrictEqual(result);
  });

  it('should throw UNKNOWN_ERROR on service error ', async () => {
    jest.spyOn(service, 'findAllUserInfo').mockImplementation(() => { throw 'UNKNOWN_ERROR' });
    expect(() => controller.findAll({ username: 'test' })).rejects.toThrow('UNKNOWN_ERROR')
  });
});
