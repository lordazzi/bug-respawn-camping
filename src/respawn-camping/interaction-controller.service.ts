import { JiraGetIssueResponse } from '../jira/jira-get-issue-response.interface';
import { JiraIntegrationApi } from '../jira/jira-integration.api';
import { EnvironmentService } from './../environment.service';

export class InteractionControllerService {

  private static instance: InteractionControllerService | null = null;

  private environment = new EnvironmentService();
  private jiraApi = new JiraIntegrationApi();

  constructor() {
    if (!InteractionControllerService.instance) {
      InteractionControllerService.instance = this;
    }

    return InteractionControllerService.instance;
  }

  async canInteract(): Promise<boolean> {
    const issues = await this.jiraApi.findIssueByLabel([this.environment.SOFTWARE_IDENTIFIER]);
    const maximumAmountOfIssuesReached = this.environment.stopInteractWhen.maximumAmountOfIssuesReached;

    if (maximumAmountOfIssuesReached !== false) {
      const maxOfIssuesReached = issues.total >= this.environment.stopInteractWhen.maximumAmountOfIssuesReached;
      if (maxOfIssuesReached) {
        return false;
      }
    }


    return true;
  }

  shouldComment(issue: JiraGetIssueResponse): boolean {
    const comment = issue.fields.comment.comments.pop();

    if (comment) {
      const configuredEarly = new Date().getTime() - this.environment.waitTimeConfig.betweenEachInteractionOnTheSameIssue;
      const isTooEarlyToComment = new Date(comment.updated) > new Date(configuredEarly);

      if (isTooEarlyToComment) {
        return false;
      }
    }

    if (issue.fields.comment.total <= this.environment.maxCommentsInIssue) {
      return true;
    }

    return false;
  }
}
