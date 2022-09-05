import { InternalServerErrorException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ResponseDto } from '../dto/responseDto.dto';
import { GitBranches } from '../entities/github/branches.entity';
import { IResourceAdapter } from '../resources.interface.repository';
import { RepoStrategy } from './strategy.interface';

type BranchAxiosResult = AxiosResponse<GitBranches[]>;

export class GitClient implements RepoStrategy {
  private baseUrl: string = `${process.env.BASE_GITHUB_URL}`;
  constructor(private resourceAdapter: IResourceAdapter) { }

  async getUserRepositories(username: string, pageNr: string, perPage: string): Promise<GitRepository[]> {
    let repoInfo: AxiosResponse<GitRepository[]> = await this.resourceAdapter.get<GitRepository[]>(this.baseUrl + `/users/${username}/repos?per_page=${perPage}&page=${pageNr}`);
    return (repoInfo.data = repoInfo.data.filter(
      (r: GitRepository) => !r.fork,
    ));
  }

  async getUserBranches(repositories: GitRepository[]): Promise<PromiseSettledResult<BranchAxiosResult>[]> {
    const promises = [];
    const urlMap = [];
    for (const repo of repositories) {
      const branchUrl = repo.branches_url.substring(0, repo.branches_url.length - 9);
      promises.push(this.resourceAdapter.get<GitBranches[]>(branchUrl));
      urlMap.push(branchUrl);
    }
    const branchesInfo: PromiseSettledResult<BranchAxiosResult>[] = await Promise.allSettled<BranchAxiosResult>(promises);
    branchesInfo.forEach(result => {
      if (result.status === 'rejected') {
        throw new InternalServerErrorException(null, 'An unexpected error occured while processing the branches. Please try again');
      }
    })

    return branchesInfo;
  }

  formatResponse(repositories: GitRepository[], branchesInfo: PromiseFulfilledResult<BranchAxiosResult>[]): ResponseDto[] {
    return repositories.map((repo: GitRepository, idx: number) => {
      return {
        name: repo.name,
        owner: repo.owner.login,
        branches: branchesInfo[idx].value.data.map((branch: GitBranches) => ({
          name: branch.name,
          commit: branch.commit.sha,
        })),
      };
    });
  }
}
