import { HttpMethod } from '../http/http-method.const';
import { EnvironmentService } from './../environment.service';
import { HttpService } from './../http/http.service';
import { JiraCommentIssueRequest } from './jira-comment-issue-request.interface';
import { JiraCommentIssueResponse } from './jira-comment-issue-response.interface';
import { JiraCreateIssueRequest } from './jira-create-issue-request.interface';
import { JiraCreateIssueResponse } from './jira-create-issue-response.interface';
import { JiraGetIssueResponse } from './jira-get-issue-response.interface';
import { JiraGetIssueTransactionResponse } from './jira-get-issue-transaction-response.interface';
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

  /**
   * https://developer.atlassian.com/cloud/jira/platform/rest/v2/#api-rest-api-2-issue-post
   */
  createIssue(createIssue: JiraCreateIssueRequest): Promise<JiraCreateIssueResponse> {
    return this.http.request({
      method: HttpMethod.POST,
      server: `${this.mountPath('issue')}?updateHistory=${String(this.environment.updateJiraHistory)}`,
      headers: this.generateAuthHeader(),
      payload: createIssue
    });
  }

  /**
   * https://developer.atlassian.com/cloud/jira/platform/rest/v2/#api-rest-api-2-search-get
   */
  findIssueByLabel(labels: string[], maxResults = 1): Promise<JiraSearchIssueResponse> {
    const labelsCondition = labels.map(label => 'labels = ' + label).join(' AND ');
    const jql =
      `project = ${this.environment.defaultProjectKey
      } AND issuetype = ${this.environment.bugTypeName
      } AND ${labelsCondition}`;

    const queryString = `?currentProjectId=${this.environment.defaultProjectKey}&jql=${
      jql}&fields=summary,issuetype&maxResults=${maxResults}`;

    return this.http.request({
      method: HttpMethod.GET,
      server: this.mountPath(`search${queryString}`),
      headers: this.generateAuthHeader()
    });
  }

  /**
   * https://developer.atlassian.com/cloud/jira/platform/rest/v2/#api-rest-api-2-issue-issueIdOrKey-comment-post
   */
  commentOnIssue(issueKey: string, comment: JiraCommentIssueRequest): Promise<JiraCommentIssueResponse> {
    return this.http.request({
      method: HttpMethod.POST,
      server: this.mountPath(`issue/${issueKey}/comment`),
      headers: this.generateAuthHeader(),
      payload: comment
    });
  }

  /**
   * https://developer.atlassian.com/cloud/jira/platform/rest/v2/#api-rest-api-2-issue-issueIdOrKey-get
   */
  getIssue(issueKey: string): Promise<JiraGetIssueResponse> {
    return this.http.request({
      method: HttpMethod.GET,
      server: this.mountPath(`issue/${issueKey}?fields=comment,worklog`),
      headers: this.generateAuthHeader()
    });
  }

  /**
   * https://developer.atlassian.com/cloud/jira/platform/rest/v2/#api-rest-api-2-issue-issueIdOrKey-transitions-get
   */
  getIssueTransitionHistory(issueKey: string): Promise<JiraGetIssueTransactionResponse> {
    return this.http.request({
      method: HttpMethod.GET,
      server: this.mountPath(`issue/${issueKey}/transitions`),
      headers: this.generateAuthHeader()
    });
  }

  /**
   * https://developer.atlassian.com/cloud/jira/platform/rest/v2/#api-rest-api-2-issue-issueIdOrKey-transitions-post
   */
  setIssueTransaction(issueKey: string, transactId: string): Promise<void> {
    return this.http.request({
      method: HttpMethod.POST,
      server: this.mountPath(`issue/${issueKey}/transitions`),
      headers: this.generateAuthHeader(),
      payload: {
        transition: { id: transactId }
      }
    });
  }

  private mountPath(endpoint: string): string {
    return `${this.environment.atlassianJiraServer}rest/api/${this.environment.jiraVersion}/${endpoint}`;
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
