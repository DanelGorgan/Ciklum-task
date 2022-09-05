type Owner = {
  login: string;
  [key: string]: string;
};

interface GitRepository {
  name: string;
  owner: Owner;
  fork: boolean;
  branches_url: string;
}
