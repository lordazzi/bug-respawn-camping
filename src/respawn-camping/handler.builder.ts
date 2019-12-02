import { EnvironmentService } from '../environment.service';
import { ErrorHandlingService } from '../error-handler/error-handler.service';
import { NormalizerCLazz } from '../error-handler/normalizer-clazz.type';

export class HandlerBuilder {

  private static instance: HandlerBuilder | null = null;

  private enviroment = new EnvironmentService();
  private errorHandling = new ErrorHandlingService();

  constructor() {
    if (!HandlerBuilder.instance) {
      HandlerBuilder.instance = this;
    }

    return HandlerBuilder.instance;
  }

  declareCustomErrorNormalizer(clazzes: NormalizerCLazz[]): HandlerBuilder {
    this.errorHandling.declareCustomErrorNormalizer(clazzes);
    return this;
  }

  setAtlassianJiraServer(server: string): HandlerBuilder {
    this.enviroment.atlassianJiraServer = server;
    return this;
  }

  setDefaultProjectKey(projectKey: string): HandlerBuilder {
    this.enviroment.defaultProjectKey = projectKey;
    return this;
  }

  setBugTypeName(bugTypeName: string): HandlerBuilder {
    this.enviroment.bugTypeName = bugTypeName;
    return this;
  }

  basicAuth(basicAuth: string): HandlerBuilder {
    this.enviroment.basicAuth = basicAuth;
    return this;
  }

  updateJiraHistoryOnIssueCreate(): HandlerBuilder {
    this.enviroment.updateJiraHistory = true;
    return this;
  }

  build(): ErrorHandlingService {
    return new ErrorHandlingService();
  }
}
