type BranchInfo = {
  name: string;
  commit: string;
};

export class ResponseDto {
  name: string;
  owner: string;
  branches: BranchInfo[];
}
