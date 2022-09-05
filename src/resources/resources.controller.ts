import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListUserInfoDto } from './dto/listUserInfo.dto';
import { ResponseDto } from './dto/responseDto.dto';
import { HttpExceptionFilter } from '../http-exception.filter';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) { }

  @Get()
  @ApiOperation({
    description: 'Exposes default repository user info',
  })
  @ApiQuery({
    name: 'username',
    required: true
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    description: 'The number of results per page (max 100, default 30).'
  })
  @ApiQuery({
    name: 'pageNr',
    required: false,
    description: 'Page number of the results to fetch.'
  })
  @ApiResponse({
    status: 200,
    description: 'Resources are successfully returned',
  })
  @ApiResponse({
    status: 400,
    description: 'Missing username validation error',
  })
  @ApiResponse({
    status: 404,
    description: 'Missing username repositories',
  })
  @ApiResponse({
    status: 406,
    description: 'XML Invalid Content-type',
  })
  @ApiHeader({
    name: 'accept-swagger',
    description:
      'Header parameters Accept, Content-Type and Authorization (via security schema only) are not allowed to be specified, therefore this field is used only for testing purposes',
  })
  @UseFilters(new HttpExceptionFilter())
  async findAll(@Query() query: ListUserInfoDto): Promise<ResponseDto[]> {
    return this.resourcesService.findAllUserInfo(query);
  }
}
