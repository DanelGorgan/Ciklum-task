import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

export interface IResourceAdapter {
  get<T>(param: string): Promise<AxiosResponse<T>>;
}
