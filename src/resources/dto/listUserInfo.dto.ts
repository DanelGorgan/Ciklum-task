import { IsNotEmpty, IsOptional } from "class-validator";

export class ListUserInfoDto {
  @IsNotEmpty()
  username: string;

  @IsOptional()
  perPage: string;

  @IsOptional()
  pageNr: string;
}
