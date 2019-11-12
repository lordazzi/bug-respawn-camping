import { JiraCommentIssueRequest } from '../jira/jira-comment-issue-request.interface';
import { JiraCreateIssueRequest } from '../jira/jira-create-issue-request.interface';
import { JiraIntegrationApi } from '../jira/jira-integration.api';
import { JiraSearchIssueResponse } from '../jira/jira-search-issue-response.interface';
import { ObjectUtil } from '../util/object.util';
import { ErrorNormalized } from './../error-handler/error-normalized.model';
import { ErrorToRegister } from './error-to-register.interface';
import { InteractionControllerService } from './interaction-controller.service';

export class RespawnCampingService {

  private static instance: RespawnCampingService | null = null;

  private readonly SOFTWARE_IDENTIFIER = 'catch-by-respawn-camping';

  private objectUtil = new ObjectUtil();
  private jiraApi = new JiraIntegrationApi();
  private interactionController = new InteractionControllerService();

  constructor() {
    if (!RespawnCampingService.instance) {
      RespawnCampingService.instance = this;
    }

    return RespawnCampingService.instance;
  }

  async registerRespawnedBug(normalizerName: string, error: ErrorNormalized): Promise<void> {
    if (!this.interactionController.canInteract()) {
      return Promise.resolve();
    }

    const registrable = this.createRegistrableError(normalizerName, error);
    const resultSet = await this.jiraApi.findIssueByLabel([this.SOFTWARE_IDENTIFIER, registrable.error.id]);
    const issueKey = this.getIssueKeyFromSearch(resultSet);
    if (issueKey) {
      const issueResultSet = await this.jiraApi.getIssue(issueKey);
      await this.jiraApi.putIssueInTodo(issueKey);

      if (this.interactionController.shouldComment(issueResultSet)) {
        await this.jiraApi.commentOnIssue(issueKey, this.generateCommentResultSet(error));
        return Promise.resolve();
      }

      return Promise.resolve();
    } else {
      await this.jiraApi.createIssue(this.generateIssueResultSet(error));
      return Promise.resolve();
    }
  }

  private generateCommentResultSet(error: ErrorNormalized): JiraCommentIssueRequest {
    return {} as any;
  }

  private generateIssueResultSet(error: ErrorNormalized): JiraCreateIssueRequest {
    return {} as any;
  }

  private getIssueKeyFromSearch(response: JiraSearchIssueResponse): string | null {
    const list: string[] = [];
    response.sections.forEach(section => {
      section.issues.forEach(issue => {
        list.push(issue.key);
      });
    });

    return list[0] || null;
  }

  private createRegistrableError(normalizerName: string, error: ErrorNormalized): ErrorToRegister {
    const clonedError = this.objectUtil.clone(error);

    clonedError.id = `id-${normalizerName.toLowerCase()}-${clonedError.id}`;
    clonedError.labels.push(this.SOFTWARE_IDENTIFIER);

    const aditionalInformation = `
      Environtment Information:
      User Agent: ${navigator.userAgent};
      Browser size: (${innerWidth} x ${innerHeight});
      Url: ${location.href};
      Time: ${this.getFormattedCurrentDate()};
    `;

    return {
      originName: normalizerName,
      aditionalInformation,
      error: clonedError
    };
  }

  private getFormattedCurrentDate(): string {
    const date = new Date();
    const decimalBase = 10;

    let d: string | number = date.getDate();
    d = d < decimalBase ? '0' + d : d;

    let m: string | number = date.getMonth() + 1;
    m = m < decimalBase ? '0' + m : m;

    const Y = date.getFullYear();

    let H: string | number = date.getHours();
    H = H < decimalBase ? '0' + H : H;

    let i: string | number = date.getMinutes();
    i = i < decimalBase ? '0' + i : i;

    let s: string | number = date.getSeconds();
    s = s < decimalBase ? '0' + s : s;

    return `[${d}/${m}/${Y} ${H}:${i}:${s}]`;
  }
}
