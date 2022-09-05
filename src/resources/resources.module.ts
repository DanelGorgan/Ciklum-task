import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { ResourceAdapter } from './resources.adapter';
import { HeaderValidationMiddleware } from './middlewares/header.validation.middleware';
import { GitClient } from './strategy/gitclient';

const resourceAdapter = {
  provide: 'IResourceAdapter',
  useClass: ResourceAdapter,
};

const gitProvider = {
  provide: 'RepoStrategy',
  useFactory: () => {
    return new GitClient(new ResourceAdapter(new HttpService()));
  },
};

@Module({
  imports: [HttpModule],
  controllers: [ResourcesController],
  providers: [resourceAdapter, ResourcesService, gitProvider],
})
export class ResourcesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HeaderValidationMiddleware).forRoutes('resources');
  }
}
