import { EnvironmentService } from '../environment.service';
import { ErrorHandlingService } from '../error-handler/error-handler.service';
import { NormalizerCLazz } from '../error-handler/normalizer-clazz.type';
import { RespawnCampingService } from './respawn-camping.service';

export class CamperBuilder {

  private static instance: CamperBuilder | null = null;

  private enviroment = new EnvironmentService();
  private errorHandling = new ErrorHandlingService();

  constructor() {
    if (!CamperBuilder.instance) {
      CamperBuilder.instance = this;
    }

    return CamperBuilder.instance;
  }

  declareCustomErrorNormalizer(clazzes: NormalizerCLazz[]): CamperBuilder {
    this.errorHandling.declareCustomErrorNormalizer(clazzes);
    return this;
  }

  setAtlassianJiraServer(server: string): CamperBuilder {
    this.enviroment.atlassianJiraServer = server;
    return this;
  }

  setDefaultProjectKey(projectKey: string): CamperBuilder {
    this.enviroment.defaultProjectKey = projectKey;
    return this;
  }

  basicAuth(basicAuth: string): CamperBuilder {
    this.enviroment.basicAuth = basicAuth;
    return this;
  }

  updateJiraHistoryOnIssueCreate(): CamperBuilder {
    this.enviroment.updateJiraHistory = true;
    return this;
  }

  build(): RespawnCampingService {
    return new RespawnCampingService();
  }
}
