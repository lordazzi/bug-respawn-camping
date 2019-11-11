import { HttpMethod } from '../http/http-method.enum';
import { EnvironmentService } from './../environment.service';
import { HttpService } from './../http/http.service';
import { JiraCommentIssueRequest } from './jira-comment-issue-request.interface';
import { JiraCommentIssueResponse } from './jira-comment-issue-response.interface';
import { JiraCreateIssueRequest } from './jira-create-issue-request.interface';
import { JiraCreateIssueResponse } from './jira-create-issue-response.interface';
import { JiraSearchIssueResponse } from './jira-search-issue-response.interface';
export class JiraIntegrationApi {

  private static instance: JiraIntegrationApi | null = null;

  private http = new HttpService();
  private environment = new EnvironmentService();

  constructor() {
    if (!JiraIntegrationApi.instance) {
      JiraIntegrationApi.instance = this;
    }

    return JiraIntegrationApi.instance;
  }

  createIssue(createIssue: JiraCreateIssueRequest): Promise<JiraCreateIssueResponse> {
    return this.http.request({
      method: HttpMethod.POST,
      server: `${this.mountPath('issue')}?updateHistory=${String(this.environment.updateJiraHistory)}`,
      headers: this.generateAuthHeader(),
      payload: createIssue
    });
  }

  findIssueByLabel(labels: string[]): Promise<JiraSearchIssueResponse> {
    const labelsCondition = labels.map(label => 'labels = ' + label).join(' AND ');
    const jql = `project = ${this.environment.defaultProjectKey} AND issuetype = Bug AND status != Done AND ${labelsCondition}`;
    const query = `?currentProjectId=${this.environment.defaultProjectKey}&currentJQL=${jql}&showSubTasks=false&showSubTaskParent=false`;

    return this.http.request({
      method: HttpMethod.GET,
      server: this.mountPath(`issue/picker${query}`),
      headers: this.generateAuthHeader()
    });
  }

  commentOnIssue(issueId: string, comment: JiraCommentIssueRequest): Promise<JiraCommentIssueResponse> {
    return this.http.request({
      method: HttpMethod.POST,
      server: this.mountPath(`issue/${issueId}/comment`),
      headers: this.generateAuthHeader(),
      payload: comment
    });
  }

  private mountPath(endpoint: string): string {
    return `${this.environment.atlassianJiraServer}rest/api/3/${endpoint}`;
  }

  private generateAuthHeader(): {
    [header: string]: string;
  } {
    const headers: { [header: string]: string; } = {};

    if (this.environment.basicAuth) {
      headers['Authorization'] = `Basic ${this.environment.basicAuth}`;
    }

    return headers;
  }
}
