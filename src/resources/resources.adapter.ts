import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { IResourceAdapter } from './resources.interface.repository';

@Injectable()
export class ResourceAdapter implements IResourceAdapter {
  constructor(private readonly httpService: HttpService) {}

  get(url: string): Promise<AxiosResponse<any>> {    
    return this.httpService.axiosRef.get(url);
  }
}
