export interface RepoStrategy {
  getUserRepositories(username: string, pageNr: string, perPage: string): any;
  getUserBranches(repositories: any): any;
  formatResponse(repositories: any, branches: any): any;
}
