import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ListUserInfoDto } from './dto/listUserInfo.dto';
import { ResponseDto } from './dto/responseDto.dto';
import { GitBranches } from './entities/github/branches.entity';
import { RepoStrategy } from './strategy/strategy.interface';

@Injectable()
export class ResourcesService {
  constructor(@Inject('RepoStrategy') private gitClient: RepoStrategy) { }

  async findAllUserInfo(query: ListUserInfoDto): Promise<ResponseDto[]> {
    try {
      const repositories: GitRepository[] = await this.gitClient.getUserRepositories(query.username, query.pageNr, query.perPage);
      const branches: GitBranches[] = await this.gitClient.getUserBranches(repositories);
      const res: ResponseDto[] = await this.gitClient.formatResponse(repositories, branches);

      return res;
    } catch (error) {      
      if (error.response?.status === 404) {
        throw new NotFoundException();
      }
      throw error;
    }
  }
}
