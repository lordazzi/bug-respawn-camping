import { EnvironmentService } from '../environment.service';
import { JiraCommentIssueRequest } from '../jira/jira-comment-issue-request.interface';
import { JiraCreateIssueRequest } from '../jira/jira-create-issue-request.interface';
import { JiraIntegrationApi } from '../jira/jira-integration.api';
import { JiraSearchIssueResponse } from '../jira/jira-search-issue-response.interface';
import { ObjectUtil } from '../util/object.util';
import { StringUtil } from '../util/string.util';
import { ErrorNormalized } from './../error-handler/error-normalized.model';
import { ErrorToRegister } from './error-to-register.interface';
import { InteractionControllerService } from './interaction-controller.service';

export class RespawnCampingService {

  private static instance: RespawnCampingService | null = null;

  private readonly SOFTWARE_IDENTIFIER = 'catch-by-respawn-camping';

  private objectUtil = new ObjectUtil();
  private stringUtil = new StringUtil();
  private jiraApi = new JiraIntegrationApi();
  private environment = new EnvironmentService();
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
      const firstStateId = await this.getFirstTransactionId(issueKey);

      if (!firstStateId) {
        return;
      }

      await this.jiraApi.setIssueTransaction(issueKey, firstStateId);
      if (this.interactionController.shouldComment(issueResultSet)) {
        await this.jiraApi.commentOnIssue(issueKey, this.generateCommentResultSet(registrable));
        return Promise.resolve();
      }

      return Promise.resolve();
    } else {
      await this.jiraApi.createIssue(this.generateIssueResultSet(registrable));
      return Promise.resolve();
    }
  }

  private async getFirstTransactionId(issueKey: string): Promise<string | null> {
    let firstStateId = this.environment.initialTransactionId;
    if (!firstStateId) {
      const issueTransactions = await this.jiraApi.getIssueTransitionHistory(issueKey);
      const firstIssueState = issueTransactions.transitions.shift();
      firstStateId = firstIssueState && firstIssueState.id || null;

      return Promise.resolve(firstStateId);
    }

    return Promise.resolve(firstStateId);
  }

  private generateCommentResultSet(toRegister: ErrorToRegister): JiraCommentIssueRequest {
    let paragraphs = [toRegister.error.title];
    const textContent = toRegister.aditionalInformation.replace(/(\r|\n+)/g, '\n');
    paragraphs = paragraphs.concat(textContent.split('\n'));

    const content = paragraphs.map(text => {
      return {
        type: 'paragraph',
        content: [
          {
            text: text,
            type: 'text',
          }
        ]
      };
    });

    return {
      body: {
        type: 'doc',
        version: 1,
        content: content
      }
    };
  }

  private generateIssueResultSet(toRegister: ErrorToRegister): JiraCreateIssueRequest {
    return {
      fields: {
        summary: toRegister.error.title,
        issuetype: {
          name: this.environment.bugTypeName || 'Bug'
        },
        description: toRegister.aditionalInformation,
        labels: toRegister.error.labels,
        project: {
          key: this.environment.defaultProjectKey
        }
      }
    };
  }

  private getIssueKeyFromSearch(resultSet: JiraSearchIssueResponse): string | null {
    return resultSet.issues && resultSet.issues[0] && resultSet.issues[0].key || null;
  }

  private createRegistrableError(normalizerName: string, error: ErrorNormalized): ErrorToRegister {
    const clonedError = this.objectUtil.clone(error);

    clonedError.id = this.stringUtil.labelfy(`id-${normalizerName}-${clonedError.id}`);
    clonedError.labels.push(this.SOFTWARE_IDENTIFIER);
    clonedError.labels = clonedError.labels.map(label => this.stringUtil.labelfy(label));
    clonedError.labels.push(clonedError.id);

    const aditionalInformation = '' +
      `Environment Information:\n` +
      `User Agent: ${navigator.userAgent};\n` +
      `Browser size: (${innerWidth} x ${innerHeight});\n` +
      `Url: ${location.href};\n` +
      `Time: ${this.getFormattedCurrentDate()};\n` +
      '\n' +
      `${this.environment.aditionalInformation}\n` +
      '\n' +
      `${error.content}\n`;

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
