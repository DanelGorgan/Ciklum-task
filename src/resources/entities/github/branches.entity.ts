type Commit = {
  sha: string,
  url: string
}

export interface GitBranches {
  name: string;
  commit: Commit
}
