import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError } from 'axios';
import { ResourcesService } from './resources.service';

const gitProvider = {
  provide: 'RepoStrategy',
  useFactory: () => {
    return {
      getUserRepositories: (username: string) => {
        if (username === 'UNEXPECTED_ERROR') {
          throw new Error('UNEXPECTED_ERROR');
        }
        if (username === 'NOT_FOUND') {
          throw new AxiosError('not found', null, null, null, {
            data: [],
            status: 404,
            statusText: 'test',
            config: {},
            headers: {}
          });
        }
        return [];
      },
      getUserBranches: () => [],
      formatResponse: () => []
    }
  },
};

describe('ResourcesService UNIT tests', () => {
  let service: ResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourcesService, gitProvider],
    }).compile();

    service = module.get<ResourcesService>(ResourcesService);
  });

  it('should return empty response', async () => {
    expect(await service.findAllUserInfo('test')).toStrictEqual([])
  });

  it('should throw unexpected error', async () => {
    await expect(async () => await service.findAllUserInfo('UNEXPECTED_ERROR')).rejects.toThrow('UNEXPECTED_ERROR')
  });

  it('should throw not found error', async () => {
    await expect(() => service.findAllUserInfo('NOT_FOUND')).rejects.toThrow(NotFoundException);
  });
});
